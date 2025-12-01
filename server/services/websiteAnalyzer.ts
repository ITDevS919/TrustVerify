import https from 'https';
import http from 'http';
import { URL } from 'url';
import dns from 'dns';
import { promisify } from 'util';

const dnsLookup = promisify(dns.lookup);
const dnsResolve = promisify(dns.resolve);

export interface SecurityHeaders {
  hasHTTPS: boolean;
  hasHSTS: boolean;
  hasCSP: boolean;
  hasXFrameOptions: boolean;
  hasXSSProtection: boolean;
  hasContentTypeOptions: boolean;
  headers: Record<string, string>;
}

export interface SSLCertificateInfo {
  valid: boolean;
  issuer: string;
  subject: string;
  validFrom: string;
  validTo: string;
  expired: boolean;
  selfSigned: boolean;
  daysUntilExpiry: number;
}

export interface DomainInfo {
  domain: string;
  ip: string;
  isReachable: boolean;
  responseTime: number;
  statusCode: number;
  redirects: string[];
}

export interface ThreatIntelligence {
  isBlacklisted: boolean;
  threatCategories: string[];
  reputationScore: number;
  lastSeen: string;
  sources: string[];
}

export interface WebsiteAnalysisResult {
  domain: string;
  url: string;
  timestamp: string;
  domainInfo: DomainInfo;
  securityHeaders: SecurityHeaders;
  sslCertificate: SSLCertificateInfo | null;
  threatIntelligence: ThreatIntelligence;
  performanceMetrics: {
    loadTime: number;
    firstByteTime: number;
    pageSize: number;
  };
  vulnerabilities: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    recommendation: string;
  }>;
  trustScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  summary: string;
}

export class WebsiteSecurityAnalyzer {
  private readonly userAgent = 'TrustVerify-SecurityScanner/1.0';
  private readonly timeout = 10000; // 10 seconds

  async analyzeWebsite(url: string): Promise<WebsiteAnalysisResult> {
    const startTime = Date.now();
    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname;

    console.log(`Starting security analysis for: ${url}`);

    try {
      // Parallel analysis for speed
      const [
        domainInfo,
        securityHeaders,
        sslCertificate,
        threatIntelligence,
        performanceMetrics
      ] = await Promise.allSettled([
        this.analyzeDomain(domain, url),
        this.analyzeSecurityHeaders(url),
        this.analyzeSSLCertificate(domain),
        this.analyzeThreatIntelligence(domain),
        this.analyzePerformance(url)
      ]);

      // Extract results from settled promises
      const domainResult = domainInfo.status === 'fulfilled' ? domainInfo.value : this.getDefaultDomainInfo(domain);
      const headersResult = securityHeaders.status === 'fulfilled' ? securityHeaders.value : this.getDefaultSecurityHeaders();
      const sslResult = sslCertificate.status === 'fulfilled' ? sslCertificate.value : null;
      const threatResult = threatIntelligence.status === 'fulfilled' ? threatIntelligence.value : this.getDefaultThreatIntelligence();
      const perfResult = performanceMetrics.status === 'fulfilled' ? performanceMetrics.value : this.getDefaultPerformanceMetrics();

      // Calculate vulnerabilities based on analysis
      const vulnerabilities = this.calculateVulnerabilities(headersResult, sslResult, threatResult);
      
      // Calculate trust score and risk level
      const trustScore = this.calculateTrustScore(domainResult, headersResult, sslResult, threatResult, vulnerabilities);
      const riskLevel = this.calculateRiskLevel(trustScore, vulnerabilities, threatResult);

      const analysisTime = Date.now() - startTime;
      console.log(`Analysis completed in ${analysisTime}ms for ${domain}`);

      return {
        domain,
        url,
        timestamp: new Date().toISOString(),
        domainInfo: domainResult,
        securityHeaders: headersResult,
        sslCertificate: sslResult,
        threatIntelligence: threatResult,
        performanceMetrics: perfResult,
        vulnerabilities,
        trustScore,
        riskLevel,
        summary: this.generateSummary(domain, trustScore, riskLevel, vulnerabilities)
      };

    } catch (error) {
      console.error(`Analysis failed for ${domain}:`, error);
      throw new Error(`Website analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async analyzeDomain(domain: string, url: string): Promise<DomainInfo> {
    const startTime = Date.now();
    let ip = '';
    let isReachable = false;
    let statusCode = 0;
    let redirects: string[] = [];

    try {
      // DNS lookup
      const lookupResult = await dnsLookup(domain);
      ip = lookupResult.address;

      // HTTP request to check reachability
      const { statusCode: code, redirects: redirectChain } = await this.makeHttpRequest(url);
      statusCode = code;
      redirects = redirectChain;
      isReachable = statusCode >= 200 && statusCode < 400;

    } catch (error) {
      console.warn(`Domain analysis failed for ${domain}:`, error);
    }

    return {
      domain,
      ip,
      isReachable,
      responseTime: Date.now() - startTime,
      statusCode,
      redirects
    };
  }

  private async analyzeSecurityHeaders(url: string): Promise<SecurityHeaders> {
    try {
      const { headers } = await this.makeHttpRequest(url);
      
      return {
        hasHTTPS: url.startsWith('https://'),
        hasHSTS: !!headers['strict-transport-security'],
        hasCSP: !!headers['content-security-policy'],
        hasXFrameOptions: !!headers['x-frame-options'],
        hasXSSProtection: !!headers['x-xss-protection'],
        hasContentTypeOptions: !!headers['x-content-type-options'],
        headers
      };
    } catch (error) {
      console.warn('Security headers analysis failed:', error);
      return this.getDefaultSecurityHeaders();
    }
  }

  private async analyzeSSLCertificate(domain: string): Promise<SSLCertificateInfo | null> {
    return new Promise((resolve) => {
      const options = {
        host: domain,
        port: 443,
        method: 'GET',
        timeout: this.timeout,
        rejectUnauthorized: false // We want to analyze even invalid certs
      };

      const req = https.request(options, (res) => {
        const cert = (res.socket as any).getPeerCertificate();
        
        if (cert && Object.keys(cert).length > 0) {
          const validFrom = new Date(cert.valid_from);
          const validTo = new Date(cert.valid_to);
          const now = new Date();
          
          resolve({
            valid: !cert.selfSigned && validFrom <= now && now <= validTo,
            issuer: cert.issuer?.CN || 'Unknown',
            subject: cert.subject?.CN || domain,
            validFrom: cert.valid_from,
            validTo: cert.valid_to,
            expired: now > validTo,
            selfSigned: !!cert.selfSigned,
            daysUntilExpiry: Math.ceil((validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          });
        } else {
          resolve(null);
        }
      });

      req.on('error', () => resolve(null));
      req.on('timeout', () => {
        req.destroy();
        resolve(null);
      });
      
      req.setTimeout(this.timeout);
      req.end();
    });
  }

  private async analyzeThreatIntelligence(domain: string): Promise<ThreatIntelligence> {
    // Real-world implementation would integrate with threat intelligence APIs
    // Using conservative heuristics to avoid false positives
    
    const knownMaliciousPatterns = [
      /\d+\.\d+\.\d+\.\d+/, // Raw IP addresses as domains (higher risk)
      /bit\.ly|tinyurl\.com|short\.link/, // Known URL shorteners (moderate risk)
    ];

    const threatCategories = [];
    let riskLevel = 0;
    
    // Only flag clearly suspicious patterns
    if (knownMaliciousPatterns.some(pattern => pattern.test(domain))) {
      threatCategories.push('suspicious-pattern');
      riskLevel += 30;
    }

    // Check against specific phishing patterns (more conservative)
    const phishingPatterns = [
      { pattern: /paypal/i, legitimate: 'paypal.com' },
      { pattern: /amazon/i, legitimate: 'amazon.com' },
      { pattern: /microsoft/i, legitimate: 'microsoft.com' },
      { pattern: /apple/i, legitimate: 'apple.com' }
    ];

    for (const { pattern, legitimate } of phishingPatterns) {
      if (pattern.test(domain) && !domain.endsWith(legitimate) && !domain.includes(legitimate.split('.')[0])) {
        threatCategories.push('potential-phishing');
        riskLevel += 40;
        break;
      }
    }

    // More conservative reputation scoring
    let reputationScore = 85; // Default neutral score
    
    if (riskLevel >= 40) {
      reputationScore = 30; // Confirmed suspicious activity
    } else if (riskLevel >= 20) {
      reputationScore = 65; // Minor concerns
    }

    return {
      isBlacklisted: riskLevel >= 40,
      threatCategories,
      reputationScore,
      lastSeen: new Date().toISOString(),
      sources: ['TrustVerify-Conservative-Heuristics']
    };
  }

  private async analyzePerformance(url: string): Promise<{ loadTime: number; firstByteTime: number; pageSize: number }> {
    const startTime = Date.now();
    let firstByteTime = 0;
    let pageSize = 0;

    try {
      const response = await this.makeHttpRequest(url, true);
      firstByteTime = response.firstByteTime || 0;
      pageSize = response.contentLength || 0;
    } catch (error) {
      console.warn('Performance analysis failed:', error);
    }

    return {
      loadTime: Date.now() - startTime,
      firstByteTime,
      pageSize
    };
  }

  private async makeHttpRequest(url: string, trackPerformance = false): Promise<{
    statusCode: number;
    headers: Record<string, string>;
    redirects: string[];
    firstByteTime?: number;
    contentLength?: number;
  }> {
    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(url);
      const isHttps = parsedUrl.protocol === 'https:';
      const client = isHttps ? https : http;
      
      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || (isHttps ? 443 : 80),
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'HEAD', // Use HEAD for faster response
        headers: {
          'User-Agent': this.userAgent,
          'Accept': '*/*'
        },
        timeout: this.timeout
      };

      const startTime = Date.now();
      let firstByteTime = 0;
      let redirects: string[] = [];

      const req = client.request(options, (res) => {
        if (!firstByteTime && trackPerformance) {
          firstByteTime = Date.now() - startTime;
        }

        // Handle redirects
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400) {
          const location = res.headers.location;
          if (location && redirects.length < 5) { // Prevent infinite redirects
            redirects.push(location);
            // Could recursively follow redirects here if needed
          }
        }

        const headers: Record<string, string> = {};
        Object.entries(res.headers).forEach(([key, value]) => {
          headers[key.toLowerCase()] = Array.isArray(value) ? value.join(', ') : value || '';
        });

        resolve({
          statusCode: res.statusCode || 0,
          headers,
          redirects,
          firstByteTime,
          contentLength: parseInt(headers['content-length'] || '0', 10)
        });
      });

      req.on('error', reject);
      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.setTimeout(this.timeout);
      req.end();
    });
  }

  private calculateVulnerabilities(
    headers: SecurityHeaders,
    ssl: SSLCertificateInfo | null,
    threat: ThreatIntelligence
  ): Array<{ type: string; severity: 'low' | 'medium' | 'high' | 'critical'; description: string; recommendation: string }> {
    const vulnerabilities = [];

    // SSL/TLS vulnerabilities
    if (!headers.hasHTTPS) {
      vulnerabilities.push({
        type: 'missing-https',
        severity: 'high' as const,
        description: 'Website does not use HTTPS encryption',
        recommendation: 'Implement SSL/TLS certificate and redirect HTTP to HTTPS'
      });
    }

    if (ssl && ssl.expired) {
      vulnerabilities.push({
        type: 'expired-certificate',
        severity: 'critical' as const,
        description: 'SSL certificate has expired',
        recommendation: 'Renew SSL certificate immediately'
      });
    }

    if (ssl && ssl.selfSigned) {
      vulnerabilities.push({
        type: 'self-signed-certificate',
        severity: 'medium' as const,
        description: 'Using self-signed SSL certificate',
        recommendation: 'Use a certificate from a trusted Certificate Authority'
      });
    }

    // Security headers vulnerabilities
    if (!headers.hasHSTS) {
      vulnerabilities.push({
        type: 'missing-hsts',
        severity: 'medium' as const,
        description: 'Missing HTTP Strict Transport Security header',
        recommendation: 'Add Strict-Transport-Security header to prevent protocol downgrade attacks'
      });
    }

    if (!headers.hasCSP) {
      vulnerabilities.push({
        type: 'missing-csp',
        severity: 'medium' as const,
        description: 'Missing Content Security Policy header',
        recommendation: 'Implement Content-Security-Policy header to prevent XSS attacks'
      });
    }

    if (!headers.hasXFrameOptions) {
      vulnerabilities.push({
        type: 'missing-x-frame-options',
        severity: 'medium' as const,
        description: 'Missing X-Frame-Options header',
        recommendation: 'Add X-Frame-Options header to prevent clickjacking attacks'
      });
    }

    // Threat intelligence vulnerabilities
    if (threat.isBlacklisted) {
      vulnerabilities.push({
        type: 'blacklisted-domain',
        severity: 'critical' as const,
        description: 'Domain appears on security blacklists',
        recommendation: 'Investigate domain reputation and potential security issues'
      });
    }

    if (threat.threatCategories.includes('potential-phishing')) {
      vulnerabilities.push({
        type: 'phishing-indicators',
        severity: 'high' as const,
        description: 'Domain shows characteristics of phishing attempts',
        recommendation: 'Verify domain legitimacy and avoid sharing sensitive information'
      });
    }

    return vulnerabilities;
  }

  private calculateTrustScore(
    domain: DomainInfo,
    headers: SecurityHeaders,
    ssl: SSLCertificateInfo | null,
    threat: ThreatIntelligence,
    vulnerabilities: Array<{ severity: string }>
  ): number {
    // Enterprise-grade scoring for B2B compliance certification
    let score = 75; // Conservative business baseline
    let securityPoints = 0;
    let compliancePoints = 0;
    let riskDeductions = 0;

    // CORE INFRASTRUCTURE ASSESSMENT (25 points possible)
    
    // Domain Infrastructure (10 points)
    if (domain.isReachable) {
      securityPoints += 5;
      if (domain.responseTime <= 2000) securityPoints += 3; // Fast response
      if (domain.responseTime <= 1000) securityPoints += 2; // Excellent response
    } else {
      riskDeductions += 25; // Critical - unreachable domain
    }

    // SSL/TLS SECURITY COMPLIANCE (30 points possible)
    
    if (headers.hasHTTPS) {
      securityPoints += 8; // Basic HTTPS
      
      if (ssl && ssl.valid && !ssl.expired) {
        securityPoints += 12; // Valid certificate
        
        // Certificate quality assessment
        if (!ssl.selfSigned) securityPoints += 5; // Proper CA
        if (ssl.daysUntilExpiry > 90) securityPoints += 3; // Well-maintained
        if (ssl.daysUntilExpiry > 180) securityPoints += 2; // Excellent maintenance
      } else if (ssl) {
        if (ssl.expired) riskDeductions += 30; // Critical security issue
        if (ssl.selfSigned) riskDeductions += 15; // Compliance concern
        if (ssl.daysUntilExpiry < 30 && ssl.daysUntilExpiry > 0) riskDeductions += 8; // Poor maintenance
      }
    } else {
      riskDeductions += 25; // Major compliance failure
    }

    // SECURITY HEADERS COMPLIANCE (20 points possible)
    // Modern enterprise security standards
    
    let headerScore = 0;
    if (headers.hasHSTS) headerScore += 5; // OWASP recommendation
    if (headers.hasCSP) headerScore += 5; // XSS protection
    if (headers.hasXFrameOptions) headerScore += 3; // Clickjacking protection
    if (headers.hasXSSProtection) headerScore += 3; // Legacy XSS protection
    if (headers.hasContentTypeOptions) headerScore += 4; // MIME sniffing protection
    
    compliancePoints += headerScore;

    // THREAT INTELLIGENCE & REPUTATION (Critical factor)
    
    if (threat.isBlacklisted) {
      // Confirmed threat - unsuitable for business use
      return 15; // Critical failure threshold
    }
    
    if (threat.threatCategories.length > 0) {
      riskDeductions += 12; // Potential reputation risk
    }
    
    // Reputation bonus for clean record
    if (threat.reputationScore >= 90 && threat.threatCategories.length === 0) {
      compliancePoints += 5;
    }

    // VULNERABILITY ASSESSMENT (Compliance-focused)
    
    let criticalVulns = 0;
    let highVulns = 0;
    
    vulnerabilities.forEach(vuln => {
      switch (vuln.severity) {
        case 'critical': 
          criticalVulns++;
          riskDeductions += 25; // Each critical vuln is major compliance issue
          break;
        case 'high': 
          highVulns++;
          riskDeductions += 12; // High vulns are significant risks
          break;
        case 'medium': 
          riskDeductions += 6; // Medium vulns need attention
          break;
        case 'low': 
          riskDeductions += 2; // Minor issues
          break;
      }
    });

    // BUSINESS COMPLIANCE MULTIPLIERS
    
    // Penalize multiple critical issues severely for enterprise use
    if (criticalVulns > 0) {
      riskDeductions += criticalVulns * 10; // Exponential penalty
    }
    
    if (highVulns > 2) {
      riskDeductions += 15; // Too many high-risk issues
    }

    // FINAL CALCULATION
    
    const finalScore = Math.max(15, Math.min(100, 
      score + securityPoints + compliancePoints - riskDeductions
    ));

    return Math.round(finalScore);
  }

  private calculateRiskLevel(
    trustScore: number,
    vulnerabilities: Array<{ severity: string }>,
    threat: ThreatIntelligence
  ): 'low' | 'medium' | 'high' | 'critical' {
    const criticalVulns = vulnerabilities.filter(v => v.severity === 'critical').length;
    const highVulns = vulnerabilities.filter(v => v.severity === 'high').length;
    const mediumVulns = vulnerabilities.filter(v => v.severity === 'medium').length;

    // ENTERPRISE B2B COMPLIANCE RISK ASSESSMENT
    
    // CRITICAL RISK: Unsuitable for business use
    if (threat.isBlacklisted || 
        trustScore <= 25 || 
        criticalVulns > 0) {
      return 'critical';
    }
    
    // HIGH RISK: Requires immediate attention before business use
    if (trustScore <= 50 || 
        highVulns >= 2 || 
        (highVulns >= 1 && mediumVulns >= 3)) {
      return 'high';
    }
    
    // MEDIUM RISK: Acceptable with monitoring and safeguards
    if (trustScore <= 75 || 
        highVulns >= 1 || 
        mediumVulns >= 2 ||
        threat.threatCategories.length > 0) {
      return 'medium';
    }
    
    // LOW RISK: Suitable for business use
    return 'low';
  }

  private generateSummary(domain: string, trustScore: number, riskLevel: string, vulnerabilities: Array<{ type: string }>): string {
    const vulnCount = vulnerabilities.length;
    
    // ENTERPRISE B2B COMPLIANCE MESSAGING
    
    if (riskLevel === 'critical') {
      return `🚫 COMPLIANCE CONCERN: ${domain} unsuitable for business use. Trust score: ${trustScore}%. Critical security issues require immediate attention before any business engagement.`;
    }
    
    if (riskLevel === 'high') {
      return `⚠️ BUSINESS RISK: ${domain} requires security improvements. Trust score: ${trustScore}%. ${vulnCount} significant issues identified. Consider enhanced due diligence.`;
    }
    
    if (riskLevel === 'medium') {
      return `⚡ STANDARD RISK: ${domain} acceptable for business use with monitoring. Trust score: ${trustScore}%. ${vulnCount} areas noted for improvement.`;
    }
    
    return `✅ BUSINESS READY: ${domain} meets enterprise security standards. Trust score: ${trustScore}%. Suitable for business certification.`;
  }

  // Default fallback methods
  private getDefaultDomainInfo(domain: string): DomainInfo {
    return {
      domain,
      ip: '',
      isReachable: false,
      responseTime: 0,
      statusCode: 0,
      redirects: []
    };
  }

  private getDefaultSecurityHeaders(): SecurityHeaders {
    return {
      hasHTTPS: false,
      hasHSTS: false,
      hasCSP: false,
      hasXFrameOptions: false,
      hasXSSProtection: false,
      hasContentTypeOptions: false,
      headers: {}
    };
  }

  private getDefaultThreatIntelligence(): ThreatIntelligence {
    return {
      isBlacklisted: false,
      threatCategories: [],
      reputationScore: 50,
      lastSeen: new Date().toISOString(),
      sources: []
    };
  }

  private getDefaultPerformanceMetrics() {
    return {
      loadTime: 0,
      firstByteTime: 0,
      pageSize: 0
    };
  }
}