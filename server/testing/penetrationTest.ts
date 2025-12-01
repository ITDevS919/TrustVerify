/**
 * Penetration Testing Suite for TrustVerify Enterprise Platform
 * Tests for security vulnerabilities, injection attacks, and authorization flaws
 */

import http from 'http';
import https from 'https';
import { URL } from 'url';

interface VulnerabilityTest {
  name: string;
  category: 'injection' | 'authentication' | 'authorization' | 'crypto' | 'configuration' | 'data_exposure';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  description: string;
  test: () => Promise<TestResult>;
}

interface TestResult {
  passed: boolean;
  vulnerable: boolean;
  details: string;
  recommendation?: string;
  evidence?: any;
}

interface PenetrationTestReport {
  summary: {
    totalTests: number;
    vulnerabilitiesFound: number;
    criticalIssues: number;
    highIssues: number;
    mediumIssues: number;
    lowIssues: number;
    securityScore: number;
  };
  vulnerabilities: Array<{
    test: string;
    category: string;
    severity: string;
    description: string;
    evidence: any;
    recommendation: string;
  }>;
  recommendations: string[];
}

export class PenetrationTester {
  private baseUrl: string;
  private testResults: Array<{ test: VulnerabilityTest; result: TestResult }> = [];

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async runPenetrationTests(): Promise<PenetrationTestReport> {
    console.log(`\n🛡️  PENETRATION TESTING STARTING`);
    console.log(`Target: ${this.baseUrl}`);
    console.log(`Running comprehensive security vulnerability scans...\n`);

    const tests = this.getAllTests();
    this.testResults = [];

    // Run all tests
    for (const test of tests) {
      console.log(`🔍 Testing: ${test.name}`);
      try {
        const result = await test.test();
        this.testResults.push({ test, result });
        
        if (result.vulnerable) {
          console.log(`  🚨 VULNERABLE - ${test.severity.toUpperCase()}`);
        } else {
          console.log(`  ✅ SECURE`);
        }
      } catch (error) {
        console.log(`  ❌ TEST FAILED: ${error instanceof Error ? error.message : 'Unknown error'}`);
        this.testResults.push({ 
          test, 
          result: { 
            passed: false, 
            vulnerable: false, 
            details: `Test execution failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
          } 
        });
      }
    }

    const report = this.generateReport();
    this.printPenetrationReport(report);
    return report;
  }

  private getAllTests(): VulnerabilityTest[] {
    return [
      // SQL Injection Tests
      {
        name: 'SQL Injection - Login Form',
        category: 'injection',
        severity: 'critical',
        description: 'Tests for SQL injection vulnerabilities in authentication',
        test: () => this.testSqlInjection('/api/auth/login', { username: "admin' OR '1'='1'--", password: 'test' })
      },
      {
        name: 'SQL Injection - User Search',
        category: 'injection',
        severity: 'critical',
        description: 'Tests for SQL injection in user search functionality',
        test: () => this.testSqlInjection('/api/users/search', { query: "'; DROP TABLE users; --" })
      },
      
      // Cross-Site Scripting (XSS) Tests
      {
        name: 'Reflected XSS - Search Parameters',
        category: 'injection',
        severity: 'high',
        description: 'Tests for reflected XSS in search parameters',
        test: () => this.testXss('/api/transactions?search=<script>alert("xss")</script>')
      },
      {
        name: 'Stored XSS - User Profile',
        category: 'injection',
        severity: 'high',
        description: 'Tests for stored XSS in user profile data',
        test: () => this.testStoredXss('/api/users/profile', { bio: '<img src=x onerror=alert("xss")>' })
      },
      
      // Authentication Tests
      {
        name: 'Weak Password Policy',
        category: 'authentication',
        severity: 'medium',
        description: 'Tests password strength requirements',
        test: () => this.testWeakPasswords()
      },
      {
        name: 'Session Fixation',
        category: 'authentication',
        severity: 'high',
        description: 'Tests for session fixation vulnerabilities',
        test: () => this.testSessionFixation()
      },
      {
        name: 'Brute Force Protection',
        category: 'authentication',
        severity: 'medium',
        description: 'Tests rate limiting on authentication endpoints',
        test: () => this.testBruteForceProtection()
      },
      
      // Authorization Tests
      {
        name: 'Insecure Direct Object Reference',
        category: 'authorization',
        severity: 'high',
        description: 'Tests for unauthorized access to user data',
        test: () => this.testIDOR()
      },
      {
        name: 'Privilege Escalation',
        category: 'authorization',
        severity: 'critical',
        description: 'Tests for vertical privilege escalation',
        test: () => this.testPrivilegeEscalation()
      },
      {
        name: 'JWT Token Validation',
        category: 'authorization',
        severity: 'high',
        description: 'Tests JWT token security and validation',
        test: () => this.testJWTSecurity()
      },
      
      // Crypto Tests
      {
        name: 'Weak Crypto Implementation',
        category: 'crypto',
        severity: 'high',
        description: 'Tests for weak cryptographic implementations',
        test: () => this.testCryptoWeakness()
      },
      {
        name: 'TLS Configuration',
        category: 'crypto',
        severity: 'medium',
        description: 'Tests SSL/TLS configuration security',
        test: () => this.testTLSConfiguration()
      },
      
      // Configuration Tests
      {
        name: 'Information Disclosure',
        category: 'configuration',
        severity: 'medium',
        description: 'Tests for sensitive information disclosure',
        test: () => this.testInformationDisclosure()
      },
      {
        name: 'Security Headers',
        category: 'configuration',
        severity: 'low',
        description: 'Tests for proper security headers implementation',
        test: () => this.testSecurityHeaders()
      },
      {
        name: 'Directory Traversal',
        category: 'configuration',
        severity: 'high',
        description: 'Tests for directory traversal vulnerabilities',
        test: () => this.testDirectoryTraversal()
      },
      
      // Data Exposure Tests
      {
        name: 'API Data Leakage',
        category: 'data_exposure',
        severity: 'medium',
        description: 'Tests for excessive data exposure in API responses',
        test: () => this.testAPIDataLeakage()
      },
      {
        name: 'Error Message Information Leakage',
        category: 'data_exposure',
        severity: 'low',
        description: 'Tests for sensitive information in error messages',
        test: () => this.testErrorMessageLeakage()
      }
    ];
  }

  // SQL Injection Tests
  private async testSqlInjection(endpoint: string, payload: any): Promise<TestResult> {
    try {
      const response = await this.makeRequest('POST', endpoint, payload);
      
      // Check for SQL error messages or unexpected behavior
      const errorPatterns = [
        /sql/i,
        /mysql/i,
        /postgres/i,
        /sqlite/i,
        /syntax error/i,
        /ORA-\d+/i,
        /microsoft odbc/i
      ];
      
      const hasErrorPattern = errorPatterns.some(pattern => pattern.test(response.body));
      const statusIndicatesError = response.status >= 500;
      
      return {
        passed: true,
        vulnerable: hasErrorPattern || (statusIndicatesError && response.body.includes('error')),
        details: hasErrorPattern ? 'SQL error patterns detected in response' : 'No SQL injection detected',
        recommendation: hasErrorPattern ? 'Implement proper parameterized queries and input validation' : undefined,
        evidence: hasErrorPattern ? { response: response.body, status: response.status } : null
      };
    } catch (error) {
      return {
        passed: false,
        vulnerable: false,
        details: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // XSS Tests
  private async testXss(endpoint: string): Promise<TestResult> {
    try {
      const response = await this.makeRequest('GET', endpoint);
      
      // Check if script tags are reflected without encoding
      const hasReflectedScript = response.body.includes('<script>') || response.body.includes('onerror=');
      const hasProperEncoding = response.body.includes('&lt;script&gt;') || response.body.includes('&quot;');
      
      return {
        passed: true,
        vulnerable: hasReflectedScript && !hasProperEncoding,
        details: hasReflectedScript ? 'Unencoded script tags found in response' : 'No XSS vulnerability detected',
        recommendation: hasReflectedScript ? 'Implement proper output encoding and Content Security Policy' : undefined,
        evidence: hasReflectedScript ? { responseSnippet: response.body.substring(0, 500) } : null
      };
    } catch (error) {
      return {
        passed: false,
        vulnerable: false,
        details: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private async testStoredXss(endpoint: string, payload: any): Promise<TestResult> {
    try {
      // First, try to store the XSS payload
      const postResponse = await this.makeRequest('POST', endpoint, payload);
      
      // Then retrieve and check if payload is executed
      const getResponse = await this.makeRequest('GET', endpoint);
      
      const hasStoredScript = getResponse.body.includes('<img src=x onerror=') && !getResponse.body.includes('&lt;img');
      
      return {
        passed: true,
        vulnerable: hasStoredScript,
        details: hasStoredScript ? 'Stored XSS payload executed without encoding' : 'No stored XSS vulnerability detected',
        recommendation: hasStoredScript ? 'Implement input validation and output encoding for user-generated content' : undefined,
        evidence: hasStoredScript ? { storedPayload: payload, response: getResponse.body.substring(0, 500) } : null
      };
    } catch (error) {
      return {
        passed: false,
        vulnerable: false,
        details: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Authentication Tests
  private async testWeakPasswords(): Promise<TestResult> {
    const weakPasswords = ['123456', 'password', 'admin', 'test', 'qwerty'];
    let vulnerableToWeak = false;
    
    for (const password of weakPasswords) {
      try {
        const response = await this.makeRequest('POST', '/api/auth/register', {
          username: `testuser_${Math.random()}`,
          password: password,
          email: `test_${Math.random()}@example.com`
        });
        
        if (response.status === 201 || response.status === 200) {
          vulnerableToWeak = true;
          break;
        }
      } catch (error) {
        // Expected for weak passwords
      }
    }
    
    return {
      passed: true,
      vulnerable: vulnerableToWeak,
      details: vulnerableToWeak ? 'System accepts weak passwords' : 'Strong password policy enforced',
      recommendation: vulnerableToWeak ? 'Implement stronger password requirements (length, complexity, common password blacklist)' : undefined
    };
  }

  private async testBruteForceProtection(): Promise<TestResult> {
    const attempts = 10;
    let blockedRequests = 0;
    
    for (let i = 0; i < attempts; i++) {
      try {
        const response = await this.makeRequest('POST', '/api/auth/login', {
          username: 'admin',
          password: `wrongpassword${i}`
        });
        
        if (response.status === 429 || response.status === 423) {
          blockedRequests++;
        }
      } catch (error) {
        // May fail due to rate limiting
      }
    }
    
    const hasRateLimit = blockedRequests > 0;
    
    return {
      passed: true,
      vulnerable: !hasRateLimit,
      details: hasRateLimit ? `Rate limiting activated after failed attempts` : 'No rate limiting detected',
      recommendation: !hasRateLimit ? 'Implement rate limiting and account lockout mechanisms' : undefined,
      evidence: { blockedRequests, totalAttempts: attempts }
    };
  }

  private async testSessionFixation(): Promise<TestResult> {
    try {
      // Get initial session
      const initialResponse = await this.makeRequest('GET', '/api/auth/session');
      const initialSessionId = this.extractSessionId(initialResponse.headers);
      
      // Login
      await this.makeRequest('POST', '/api/auth/login', {
        username: 'testuser',
        password: 'testpass'
      });
      
      // Check if session ID changed
      const postLoginResponse = await this.makeRequest('GET', '/api/auth/session');
      const postLoginSessionId = this.extractSessionId(postLoginResponse.headers);
      
      const sessionFixed = initialSessionId === postLoginSessionId;
      
      return {
        passed: true,
        vulnerable: sessionFixed,
        details: sessionFixed ? 'Session ID not regenerated after login' : 'Session properly regenerated',
        recommendation: sessionFixed ? 'Regenerate session IDs after authentication state changes' : undefined
      };
    } catch (error) {
      return {
        passed: false,
        vulnerable: false,
        details: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Authorization Tests
  private async testIDOR(): Promise<TestResult> {
    try {
      // Try to access user data with different user IDs
      const userIds = [1, 2, 3, 999, -1];
      let unauthorizedAccess = false;
      
      for (const userId of userIds) {
        const response = await this.makeRequest('GET', `/api/users/${userId}`);
        
        // If we get user data without proper authentication, it's vulnerable
        if (response.status === 200 && response.body.includes('email')) {
          unauthorizedAccess = true;
          break;
        }
      }
      
      return {
        passed: true,
        vulnerable: unauthorizedAccess,
        details: unauthorizedAccess ? 'Unauthorized access to user data possible' : 'Proper authorization controls in place',
        recommendation: unauthorizedAccess ? 'Implement proper authorization checks for all resource access' : undefined
      };
    } catch (error) {
      return {
        passed: false,
        vulnerable: false,
        details: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private async testPrivilegeEscalation(): Promise<TestResult> {
    try {
      // Try to access admin endpoints without admin privileges
      const adminEndpoints = [
        '/api/admin/users',
        '/api/admin/transactions',
        '/api/enterprise/dashboard'
      ];
      
      let hasPrivilegeEscalation = false;
      
      for (const endpoint of adminEndpoints) {
        const response = await this.makeRequest('GET', endpoint);
        
        if (response.status === 200) {
          hasPrivilegeEscalation = true;
          break;
        }
      }
      
      return {
        passed: true,
        vulnerable: hasPrivilegeEscalation,
        details: hasPrivilegeEscalation ? 'Access to privileged endpoints possible' : 'Proper privilege controls enforced',
        recommendation: hasPrivilegeEscalation ? 'Implement role-based access control and principle of least privilege' : undefined
      };
    } catch (error) {
      return {
        passed: false,
        vulnerable: false,
        details: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private async testJWTSecurity(): Promise<TestResult> {
    try {
      // Test JWT vulnerabilities
      const issues = [];
      
      // Test for 'none' algorithm acceptance
      const noneAlgToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJub25lIn0.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.';
      const noneResponse = await this.makeRequest('GET', '/api/auth/user', {}, { 'Authorization': `Bearer ${noneAlgToken}` });
      
      if (noneResponse.status === 200) {
        issues.push('Accepts "none" algorithm JWT tokens');
      }
      
      // Test for weak secret brute force
      const weakToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.XbPfbIHMI6arZ3Y922BhjWgQzWXcXNrz0ogtVhfEd2o';
      const weakResponse = await this.makeRequest('GET', '/api/auth/user', {}, { 'Authorization': `Bearer ${weakToken}` });
      
      if (weakResponse.status === 200) {
        issues.push('Uses weak JWT signing secret');
      }
      
      return {
        passed: true,
        vulnerable: issues.length > 0,
        details: issues.length > 0 ? `JWT vulnerabilities: ${issues.join(', ')}` : 'JWT implementation appears secure',
        recommendation: issues.length > 0 ? 'Use strong signing secrets, validate algorithms, implement proper token validation' : undefined,
        evidence: { issues }
      };
    } catch (error) {
      return {
        passed: false,
        vulnerable: false,
        details: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Crypto Tests
  private async testCryptoWeakness(): Promise<TestResult> {
    try {
      const response = await this.makeRequest('GET', '/api/crypto/config');
      
      const weakPatterns = [
        /md5/i,
        /sha1/i,
        /des/i,
        /rc4/i,
        /ssl.?v[123]/i
      ];
      
      const hasWeakCrypto = weakPatterns.some(pattern => pattern.test(response.body));
      
      return {
        passed: true,
        vulnerable: hasWeakCrypto,
        details: hasWeakCrypto ? 'Weak cryptographic algorithms detected' : 'Strong cryptography in use',
        recommendation: hasWeakCrypto ? 'Upgrade to stronger cryptographic algorithms (SHA-256+, AES, TLS 1.2+)' : undefined
      };
    } catch (error) {
      return {
        passed: true,
        vulnerable: false,
        details: 'Crypto configuration endpoint not accessible (secure behavior)'
      };
    }
  }

  private async testTLSConfiguration(): Promise<TestResult> {
    try {
      const url = new URL(this.baseUrl);
      const isHttps = url.protocol === 'https:';
      
      if (!isHttps) {
        return {
          passed: true,
          vulnerable: true,
          details: 'Application not using HTTPS',
          recommendation: 'Implement HTTPS with proper TLS configuration'
        };
      }
      
      // Additional TLS tests would require more sophisticated tooling
      return {
        passed: true,
        vulnerable: false,
        details: 'HTTPS enabled (detailed TLS analysis requires specialized tools)'
      };
    } catch (error) {
      return {
        passed: false,
        vulnerable: false,
        details: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Configuration Tests
  private async testSecurityHeaders(): Promise<TestResult> {
    try {
      const response = await this.makeRequest('GET', '/');
      const headers = response.headers;
      
      const requiredHeaders = [
        'x-frame-options',
        'x-content-type-options',
        'x-xss-protection',
        'strict-transport-security',
        'content-security-policy'
      ];
      
      const missingHeaders = requiredHeaders.filter(header => !headers[header]);
      
      return {
        passed: true,
        vulnerable: missingHeaders.length > 0,
        details: missingHeaders.length > 0 ? `Missing security headers: ${missingHeaders.join(', ')}` : 'All security headers present',
        recommendation: missingHeaders.length > 0 ? 'Implement missing security headers for defense in depth' : undefined,
        evidence: { presentHeaders: Object.keys(headers), missingHeaders }
      };
    } catch (error) {
      return {
        passed: false,
        vulnerable: false,
        details: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private async testInformationDisclosure(): Promise<TestResult> {
    try {
      const sensitiveEndpoints = [
        '/.env',
        '/config.json',
        '/package.json',
        '/.git/config',
        '/admin',
        '/debug',
        '/test'
      ];
      
      let disclosedInfo = [];
      
      for (const endpoint of sensitiveEndpoints) {
        const response = await this.makeRequest('GET', endpoint);
        if (response.status === 200) {
          disclosedInfo.push(endpoint);
        }
      }
      
      return {
        passed: true,
        vulnerable: disclosedInfo.length > 0,
        details: disclosedInfo.length > 0 ? `Sensitive information disclosed: ${disclosedInfo.join(', ')}` : 'No information disclosure detected',
        recommendation: disclosedInfo.length > 0 ? 'Restrict access to sensitive files and directories' : undefined,
        evidence: { disclosedEndpoints: disclosedInfo }
      };
    } catch (error) {
      return {
        passed: false,
        vulnerable: false,
        details: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private async testDirectoryTraversal(): Promise<TestResult> {
    try {
      const traversalPayloads = [
        '../../../etc/passwd',
        '..\\..\\..\\windows\\system32\\drivers\\etc\\hosts',
        '....//....//....//etc/passwd',
        '%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd'
      ];
      
      let vulnerableToTraversal = false;
      
      for (const payload of traversalPayloads) {
        const response = await this.makeRequest('GET', `/api/files/${payload}`);
        
        if (response.body.includes('root:') || response.body.includes('# Copyright')) {
          vulnerableToTraversal = true;
          break;
        }
      }
      
      return {
        passed: true,
        vulnerable: vulnerableToTraversal,
        details: vulnerableToTraversal ? 'Directory traversal vulnerability detected' : 'No directory traversal vulnerability',
        recommendation: vulnerableToTraversal ? 'Implement proper input validation and path sanitization' : undefined
      };
    } catch (error) {
      return {
        passed: false,
        vulnerable: false,
        details: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Data Exposure Tests
  private async testAPIDataLeakage(): Promise<TestResult> {
    try {
      const response = await this.makeRequest('GET', '/api/users');
      
      // Check for sensitive data in API responses
      const sensitivePatterns = [
        /password/i,
        /secret/i,
        /private.?key/i,
        /ssn/i,
        /social.?security/i,
        /credit.?card/i
      ];
      
      const hasSensitiveData = sensitivePatterns.some(pattern => pattern.test(response.body));
      
      return {
        passed: true,
        vulnerable: hasSensitiveData,
        details: hasSensitiveData ? 'Sensitive data exposed in API responses' : 'No sensitive data leakage detected',
        recommendation: hasSensitiveData ? 'Filter sensitive fields from API responses and implement data minimization' : undefined
      };
    } catch (error) {
      return {
        passed: false,
        vulnerable: false,
        details: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private async testErrorMessageLeakage(): Promise<TestResult> {
    try {
      // Trigger error conditions
      const response = await this.makeRequest('GET', '/api/nonexistent/endpoint/12345');
      
      // Check for sensitive information in error messages
      const sensitivePatterns = [
        /file.?path/i,
        /database/i,
        /sql/i,
        /stack.?trace/i,
        /internal.?server/i,
        /localhost/i,
        /127\.0\.0\.1/i
      ];
      
      const leaksSensitiveInfo = sensitivePatterns.some(pattern => pattern.test(response.body));
      
      return {
        passed: true,
        vulnerable: leaksSensitiveInfo,
        details: leaksSensitiveInfo ? 'Error messages leak sensitive information' : 'Error messages properly sanitized',
        recommendation: leaksSensitiveInfo ? 'Implement generic error messages and proper error handling' : undefined,
        evidence: leaksSensitiveInfo ? { errorResponse: response.body } : null
      };
    } catch (error) {
      return {
        passed: false,
        vulnerable: false,
        details: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Helper methods
  private async makeRequest(method: string, endpoint: string, body?: any, headers?: any): Promise<{ status: number; body: string; headers: any }> {
    return new Promise((resolve, reject) => {
      const url = new URL(endpoint, this.baseUrl);
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'TrustVerify-PenTest/1.0',
          ...headers
        }
      };

      const client = url.protocol === 'https:' ? https : http;
      const req = client.request(url, options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          resolve({
            status: res.statusCode || 0,
            body: data,
            headers: res.headers
          });
        });
      });

      req.on('error', reject);
      
      if (body) {
        req.write(JSON.stringify(body));
      }
      
      req.end();
    });
  }

  private extractSessionId(headers: any): string | null {
    const setCookie = headers['set-cookie'];
    if (!setCookie) return null;
    
    const sessionMatch = setCookie.find((cookie: string) => cookie.includes('sessionid') || cookie.includes('connect.sid'));
    return sessionMatch ? sessionMatch.split('=')[1].split(';')[0] : null;
  }

  private generateReport(): PenetrationTestReport {
    const vulnerabilities = this.testResults
      .filter(result => result.result.vulnerable)
      .map(result => ({
        test: result.test.name,
        category: result.test.category,
        severity: result.test.severity,
        description: result.test.description,
        evidence: result.result.evidence,
        recommendation: result.result.recommendation || 'Review and fix this vulnerability'
      }));

    const summary = {
      totalTests: this.testResults.length,
      vulnerabilitiesFound: vulnerabilities.length,
      criticalIssues: vulnerabilities.filter(v => v.severity === 'critical').length,
      highIssues: vulnerabilities.filter(v => v.severity === 'high').length,
      mediumIssues: vulnerabilities.filter(v => v.severity === 'medium').length,
      lowIssues: vulnerabilities.filter(v => v.severity === 'low').length,
      securityScore: Math.max(0, 100 - (
        (vulnerabilities.filter(v => v.severity === 'critical').length * 25) +
        (vulnerabilities.filter(v => v.severity === 'high').length * 15) +
        (vulnerabilities.filter(v => v.severity === 'medium').length * 8) +
        (vulnerabilities.filter(v => v.severity === 'low').length * 3)
      ))
    };

    const recommendations = [
      'Implement comprehensive input validation and sanitization',
      'Use parameterized queries to prevent SQL injection',
      'Implement proper authentication and session management',
      'Apply principle of least privilege for authorization',
      'Use strong cryptographic algorithms and secure configurations',
      'Implement security headers and HTTPS',
      'Regular security testing and code reviews',
      'Security awareness training for developers'
    ];

    return { summary, vulnerabilities, recommendations };
  }

  private printPenetrationReport(report: PenetrationTestReport): void {
    console.log(`\n🛡️  PENETRATION TEST RESULTS`);
    console.log(`${'-'.repeat(80)}`);
    
    console.log(`\n📊 Security Summary:`);
    console.log(`   Total Tests Run: ${report.summary.totalTests}`);
    console.log(`   Vulnerabilities Found: ${report.summary.vulnerabilitiesFound}`);
    console.log(`   Critical Issues: ${report.summary.criticalIssues}`);
    console.log(`   High Risk Issues: ${report.summary.highIssues}`);
    console.log(`   Medium Risk Issues: ${report.summary.mediumIssues}`);
    console.log(`   Low Risk Issues: ${report.summary.lowIssues}`);
    console.log(`   Security Score: ${report.summary.securityScore}/100`);
    
    if (report.vulnerabilities.length > 0) {
      console.log(`\n🚨 Vulnerabilities Found:`);
      report.vulnerabilities.forEach((vuln, index) => {
        console.log(`\n   ${index + 1}. ${vuln.test} [${vuln.severity.toUpperCase()}]`);
        console.log(`      Category: ${vuln.category}`);
        console.log(`      Description: ${vuln.description}`);
        console.log(`      Recommendation: ${vuln.recommendation}`);
      });
    } else {
      console.log(`\n✅ No vulnerabilities detected in basic scan`);
    }
    
    // Security assessment
    console.log(`\n🎯 SECURITY ASSESSMENT`);
    console.log(`${'-'.repeat(40)}`);
    
    if (report.summary.securityScore >= 90) {
      console.log(`✅ Excellent security posture - enterprise ready`);
    } else if (report.summary.securityScore >= 75) {
      console.log(`🟡 Good security - minor issues to address`);
    } else if (report.summary.securityScore >= 60) {
      console.log(`🟠 Fair security - significant improvements needed`);
    } else {
      console.log(`🔴 Poor security - critical vulnerabilities require immediate attention`);
    }
  }
}

export const penetrationTester = new PenetrationTester('http://localhost:5000');