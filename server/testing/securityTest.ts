/**
 * Comprehensive Security Testing Suite for TrustVerify Enterprise Platform
 * Tests compliance, data protection, and security controls
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

interface SecurityControlTest {
  id: string;
  name: string;
  category: 'access_control' | 'data_protection' | 'audit_logging' | 'encryption' | 'compliance' | 'incident_response';
  framework: 'NIST' | 'ISO27001' | 'SOC2' | 'PCI_DSS' | 'GDPR' | 'SOX';
  description: string;
  requirement: string;
  test: () => Promise<SecurityTestResult>;
}

interface SecurityTestResult {
  passed: boolean;
  compliant: boolean;
  score: number; // 0-100
  details: string;
  evidence?: any;
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface ComplianceReport {
  overall: {
    score: number;
    compliance: number;
    riskLevel: string;
    passedTests: number;
    totalTests: number;
  };
  frameworks: {
    [key: string]: {
      score: number;
      compliance: number;
      passedTests: number;
      totalTests: number;
      criticalIssues: number;
    };
  };
  categories: {
    [key: string]: {
      score: number;
      passedTests: number;
      totalTests: number;
    };
  };
  failures: Array<{
    test: string;
    category: string;
    framework: string;
    risk: string;
    details: string;
    recommendations: string[];
  }>;
  recommendations: string[];
}

export class SecurityTester {
  private testResults: Array<{ test: SecurityControlTest; result: SecurityTestResult }> = [];

  async runSecurityCompliance(): Promise<ComplianceReport> {
    console.log(`\n🔒 SECURITY COMPLIANCE TESTING STARTING`);
    console.log(`Testing enterprise security controls and compliance frameworks...\n`);

    const tests = this.getAllSecurityTests();
    this.testResults = [];

    // Run all security tests
    for (const test of tests) {
      console.log(`🔍 Testing: ${test.name} (${test.framework})`);
      try {
        const result = await test.test();
        this.testResults.push({ test, result });
        
        if (result.compliant) {
          console.log(`  ✅ COMPLIANT (${result.score}/100)`);
        } else {
          console.log(`  ❌ NON-COMPLIANT - ${test.framework} violation`);
        }
      } catch (error) {
        console.log(`  💥 TEST FAILED: ${error instanceof Error ? error.message : 'Unknown error'}`);
        this.testResults.push({ 
          test, 
          result: { 
            passed: false, 
            compliant: false, 
            score: 0,
            details: `Test execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            recommendations: ['Review test implementation and security controls'],
            riskLevel: 'high'
          } 
        });
      }
    }

    const report = this.generateComplianceReport();
    this.printComplianceReport(report);
    return report;
  }

  private getAllSecurityTests(): SecurityControlTest[] {
    return [
      // Access Control Tests (NIST, ISO27001)
      {
        id: 'AC-001',
        name: 'Multi-Factor Authentication Implementation',
        category: 'access_control',
        framework: 'NIST',
        description: 'Verify MFA is enforced for privileged accounts',
        requirement: 'NIST 800-53 IA-2(1): Multi-factor Authentication',
        test: () => this.testMFAImplementation()
      },
      {
        id: 'AC-002',
        name: 'Role-Based Access Control',
        category: 'access_control',
        framework: 'ISO27001',
        description: 'Verify RBAC implementation and principle of least privilege',
        requirement: 'ISO 27001 A.9.1.2: Access to networks and network services',
        test: () => this.testRBACImplementation()
      },
      {
        id: 'AC-003',
        name: 'Session Management Controls',
        category: 'access_control',
        framework: 'SOC2',
        description: 'Verify secure session handling and timeout controls',
        requirement: 'SOC 2 CC6.1: Logical and physical access controls',
        test: () => this.testSessionManagement()
      },

      // Data Protection Tests (GDPR, PCI DSS)
      {
        id: 'DP-001',
        name: 'Data Encryption at Rest',
        category: 'data_protection',
        framework: 'PCI_DSS',
        description: 'Verify sensitive data is encrypted when stored',
        requirement: 'PCI DSS 3.4: Protect stored cardholder data',
        test: () => this.testDataEncryptionAtRest()
      },
      {
        id: 'DP-002',
        name: 'Data Encryption in Transit',
        category: 'data_protection',
        framework: 'PCI_DSS',
        description: 'Verify data is encrypted during transmission',
        requirement: 'PCI DSS 4.1: Use strong cryptography for data transmission',
        test: () => this.testDataEncryptionInTransit()
      },
      {
        id: 'DP-003',
        name: 'Personal Data Protection (GDPR)',
        category: 'data_protection',
        framework: 'GDPR',
        description: 'Verify GDPR compliance for personal data handling',
        requirement: 'GDPR Article 25: Data protection by design and by default',
        test: () => this.testGDPRCompliance()
      },
      {
        id: 'DP-004',
        name: 'Data Retention Policy',
        category: 'data_protection',
        framework: 'GDPR',
        description: 'Verify data retention and deletion policies',
        requirement: 'GDPR Article 17: Right to erasure',
        test: () => this.testDataRetentionPolicy()
      },

      // Audit Logging Tests (SOX, SOC2)
      {
        id: 'AL-001',
        name: 'Comprehensive Audit Logging',
        category: 'audit_logging',
        framework: 'SOX',
        description: 'Verify all financial transactions are logged',
        requirement: 'SOX Section 404: Internal controls over financial reporting',
        test: () => this.testAuditLogging()
      },
      {
        id: 'AL-002',
        name: 'Log Integrity Protection',
        category: 'audit_logging',
        framework: 'SOC2',
        description: 'Verify audit logs are tamper-proof',
        requirement: 'SOC 2 CC3.4: Log management and monitoring',
        test: () => this.testLogIntegrity()
      },
      {
        id: 'AL-003',
        name: 'Security Event Monitoring',
        category: 'audit_logging',
        framework: 'NIST',
        description: 'Verify security events are monitored and alerted',
        requirement: 'NIST 800-53 AU-6: Audit Review, Analysis, and Reporting',
        test: () => this.testSecurityMonitoring()
      },

      // Encryption Tests (NIST, PCI DSS)
      {
        id: 'EN-001',
        name: 'Cryptographic Algorithm Strength',
        category: 'encryption',
        framework: 'NIST',
        description: 'Verify use of approved cryptographic algorithms',
        requirement: 'NIST 800-53 SC-13: Cryptographic Protection',
        test: () => this.testCryptographicStrength()
      },
      {
        id: 'EN-002',
        name: 'Key Management Controls',
        category: 'encryption',
        framework: 'PCI_DSS',
        description: 'Verify secure cryptographic key management',
        requirement: 'PCI DSS 3.6: Fully document and implement key-management processes',
        test: () => this.testKeyManagement()
      },

      // Compliance Tests
      {
        id: 'CO-001',
        name: 'Financial Data Protection',
        category: 'compliance',
        framework: 'SOX',
        description: 'Verify financial data integrity controls',
        requirement: 'SOX Section 302: Corporate responsibility for financial reports',
        test: () => this.testFinancialDataProtection()
      },
      {
        id: 'CO-002',
        name: 'Payment Card Data Security',
        category: 'compliance',
        framework: 'PCI_DSS',
        description: 'Verify PCI DSS compliance for payment processing',
        requirement: 'PCI DSS Requirements 1-12: Complete compliance framework',
        test: () => this.testPCICompliance()
      },

      // Incident Response Tests
      {
        id: 'IR-001',
        name: 'Incident Response Plan',
        category: 'incident_response',
        framework: 'ISO27001',
        description: 'Verify incident response procedures are documented and tested',
        requirement: 'ISO 27001 A.16.1: Management of information security incidents',
        test: () => this.testIncidentResponsePlan()
      },
      {
        id: 'IR-002',
        name: 'Security Breach Notification',
        category: 'incident_response',
        framework: 'GDPR',
        description: 'Verify breach notification capabilities',
        requirement: 'GDPR Article 33: Notification of personal data breach to supervisory authority',
        test: () => this.testBreachNotification()
      }
    ];
  }

  // Access Control Tests
  private async testMFAImplementation(): Promise<SecurityTestResult> {
    // Check if MFA is configured and enforced
    const mfaConfigExists = this.checkFileExists('server/middleware/mfa.ts');
    const authMiddlewareHasMFA = await this.checkCodeForPattern('server/middleware/apiAuth.ts', /mfa|two.?factor|2fa/i);
    
    const score = (mfaConfigExists ? 50 : 0) + (authMiddlewareHasMFA ? 50 : 0);
    const compliant = score >= 80;
    
    return {
      passed: score > 0,
      compliant,
      score,
      details: `MFA implementation status: Config exists: ${mfaConfigExists}, Middleware integration: ${authMiddlewareHasMFA}`,
      recommendations: compliant ? [] : [
        'Implement multi-factor authentication for all privileged accounts',
        'Integrate MFA into authentication middleware',
        'Enforce MFA for admin and developer access'
      ],
      riskLevel: compliant ? 'low' : 'high'
    };
  }

  private async testRBACImplementation(): Promise<SecurityTestResult> {
    const rbacMiddleware = this.checkFileExists('server/middleware/rbac.ts');
    const roleDefinitions = await this.checkCodeForPattern('server/middleware/apiAuth.ts', /role|permission|privilege/i);
    const userRoles = await this.checkCodeForPattern('shared/schema.ts', /role|permission/i);
    
    const score = (rbacMiddleware ? 40 : 0) + (roleDefinitions ? 30 : 0) + (userRoles ? 30 : 0);
    const compliant = score >= 80;
    
    return {
      passed: score > 0,
      compliant,
      score,
      details: `RBAC implementation: Middleware: ${rbacMiddleware}, Role definitions: ${roleDefinitions}, User roles: ${userRoles}`,
      recommendations: compliant ? [] : [
        'Implement comprehensive role-based access control',
        'Define clear role hierarchies and permissions',
        'Apply principle of least privilege consistently'
      ],
      riskLevel: compliant ? 'low' : 'high'
    };
  }

  private async testSessionManagement(): Promise<SecurityTestResult> {
    const sessionConfig = await this.checkCodeForPattern('server/routes.ts', /session.*secure|httpOnly|sameSite/i);
    const sessionTimeout = await this.checkCodeForPattern('server/routes.ts', /maxAge|expires/i);
    const sessionRotation = await this.checkCodeForPattern('server/routes.ts', /regenerate|rotate/i);
    
    const score = (sessionConfig ? 40 : 0) + (sessionTimeout ? 30 : 0) + (sessionRotation ? 30 : 0);
    const compliant = score >= 70;
    
    return {
      passed: score > 0,
      compliant,
      score,
      details: `Session security: Secure config: ${sessionConfig}, Timeout: ${sessionTimeout}, Rotation: ${sessionRotation}`,
      recommendations: compliant ? [] : [
        'Configure secure session cookies (httpOnly, secure, sameSite)',
        'Implement session timeout controls',
        'Add session rotation on privilege elevation'
      ],
      riskLevel: compliant ? 'low' : 'medium'
    };
  }

  // Data Protection Tests
  private async testDataEncryptionAtRest(): Promise<SecurityTestResult> {
    const databaseEncryption = await this.checkCodeForPattern('server/db.ts', /encrypt|cipher|aes/i);
    const fileEncryption = await this.checkCodeForPattern('server/storage.ts', /encrypt|crypto/i);
    const secretsManagement = process.env.DATABASE_URL ? true : false;
    
    const score = (databaseEncryption ? 40 : 0) + (fileEncryption ? 30 : 0) + (secretsManagement ? 30 : 0);
    const compliant = score >= 70;
    
    return {
      passed: score > 0,
      compliant,
      score,
      details: `Encryption at rest: Database: ${databaseEncryption}, Files: ${fileEncryption}, Secrets: ${secretsManagement}`,
      recommendations: compliant ? [] : [
        'Implement database-level encryption for sensitive data',
        'Encrypt file storage and backups',
        'Use proper secrets management for encryption keys'
      ],
      riskLevel: compliant ? 'low' : 'critical'
    };
  }

  private async testDataEncryptionInTransit(): Promise<SecurityTestResult> {
    const httpsEnforced = await this.checkCodeForPattern('server/routes.ts', /https|ssl|tls/i);
    const apiEncryption = await this.checkCodeForPattern('server/routes.ts', /helmet|secure/i);
    const dbConnectionSecure = process.env.DATABASE_URL?.includes('ssl') || false;
    
    const score = (httpsEnforced ? 40 : 0) + (apiEncryption ? 30 : 0) + (dbConnectionSecure ? 30 : 0);
    const compliant = score >= 80;
    
    return {
      passed: score > 0,
      compliant,
      score,
      details: `Encryption in transit: HTTPS: ${httpsEnforced}, API security: ${apiEncryption}, DB SSL: ${dbConnectionSecure}`,
      recommendations: compliant ? [] : [
        'Enforce HTTPS for all communications',
        'Use TLS 1.2+ with strong cipher suites',
        'Secure database connections with SSL/TLS'
      ],
      riskLevel: compliant ? 'low' : 'critical'
    };
  }

  private async testGDPRCompliance(): Promise<SecurityTestResult> {
    const privacyPolicy = this.checkFileExists('client/src/pages/Privacy.tsx');
    const dataPortability = await this.checkCodeForPattern('server/routes.ts', /export.*data|download.*data/i);
    const dataMinimization = await this.checkCodeForPattern('server/routes.ts', /limit|select.*specific/i);
    const consentManagement = await this.checkCodeForPattern('shared/schema.ts', /consent|agreement/i);
    
    const score = (privacyPolicy ? 25 : 0) + (dataPortability ? 25 : 0) + (dataMinimization ? 25 : 0) + (consentManagement ? 25 : 0);
    const compliant = score >= 75;
    
    return {
      passed: score > 0,
      compliant,
      score,
      details: `GDPR compliance: Privacy policy: ${privacyPolicy}, Data portability: ${dataPortability}, Minimization: ${dataMinimization}, Consent: ${consentManagement}`,
      recommendations: compliant ? [] : [
        'Implement comprehensive privacy policy and consent management',
        'Add data portability and export capabilities',
        'Apply data minimization principles',
        'Implement right to erasure functionality'
      ],
      riskLevel: compliant ? 'low' : 'high'
    };
  }

  private async testDataRetentionPolicy(): Promise<SecurityTestResult> {
    const retentionPolicy = this.checkFileExists('server/services/dataRetention.ts');
    const automaticDeletion = await this.checkCodeForPattern('server/storage.ts', /delete.*old|retention|cleanup/i);
    const userDataDeletion = await this.checkCodeForPattern('server/routes.ts', /delete.*user|remove.*account/i);
    
    const score = (retentionPolicy ? 40 : 0) + (automaticDeletion ? 30 : 0) + (userDataDeletion ? 30 : 0);
    const compliant = score >= 70;
    
    return {
      passed: score > 0,
      compliant,
      score,
      details: `Data retention: Policy exists: ${retentionPolicy}, Auto deletion: ${automaticDeletion}, User deletion: ${userDataDeletion}`,
      recommendations: compliant ? [] : [
        'Implement documented data retention policy',
        'Add automatic deletion of expired data',
        'Provide user account deletion capabilities'
      ],
      riskLevel: compliant ? 'low' : 'medium'
    };
  }

  // Audit Logging Tests
  private async testAuditLogging(): Promise<SecurityTestResult> {
    const auditLogging = await this.checkCodeForPattern('server/routes.ts', /audit|log.*transaction|financial.*log/i);
    const transactionLogging = await this.checkCodeForPattern('server/storage.ts', /log|audit|history/i);
    const userActionLogging = await this.checkCodeForPattern('server/middleware/apiAuth.ts', /log.*usage|audit/i);
    
    const score = (auditLogging ? 40 : 0) + (transactionLogging ? 30 : 0) + (userActionLogging ? 30 : 0);
    const compliant = score >= 80;
    
    return {
      passed: score > 0,
      compliant,
      score,
      details: `Audit logging: System logging: ${auditLogging}, Transaction logging: ${transactionLogging}, User actions: ${userActionLogging}`,
      recommendations: compliant ? [] : [
        'Implement comprehensive audit logging for all financial transactions',
        'Log all user actions and system changes',
        'Ensure logs are tamper-proof and accessible for compliance'
      ],
      riskLevel: compliant ? 'low' : 'critical'
    };
  }

  private async testLogIntegrity(): Promise<SecurityTestResult> {
    const logSigning = await this.checkCodeForPattern('server/middleware', /sign.*log|hash.*log|integrity/i);
    const logStorage = this.checkFileExists('server/services/auditLog.ts');
    const logMonitoring = await this.checkCodeForPattern('server/routes.ts', /monitor.*log|alert.*log/i);
    
    const score = (logSigning ? 40 : 0) + (logStorage ? 30 : 0) + (logMonitoring ? 30 : 0);
    const compliant = score >= 70;
    
    return {
      passed: score > 0,
      compliant,
      score,
      details: `Log integrity: Signing: ${logSigning}, Secure storage: ${logStorage}, Monitoring: ${logMonitoring}`,
      recommendations: compliant ? [] : [
        'Implement cryptographic log signing for integrity',
        'Use secure, append-only log storage',
        'Monitor logs for tampering attempts'
      ],
      riskLevel: compliant ? 'low' : 'high'
    };
  }

  private async testSecurityMonitoring(): Promise<SecurityTestResult> {
    const securityAlerts = await this.checkCodeForPattern('server/routes.ts', /alert|notify.*security|threat/i);
    const intrusionDetection = await this.checkCodeForPattern('server/middleware', /detect|intrusion|suspicious/i);
    const realTimeMonitoring = await this.checkCodeForPattern('server/services', /monitor|watch|real.?time/i);
    
    const score = (securityAlerts ? 40 : 0) + (intrusionDetection ? 30 : 0) + (realTimeMonitoring ? 30 : 0);
    const compliant = score >= 70;
    
    return {
      passed: score > 0,
      compliant,
      score,
      details: `Security monitoring: Alerts: ${securityAlerts}, Intrusion detection: ${intrusionDetection}, Real-time: ${realTimeMonitoring}`,
      recommendations: compliant ? [] : [
        'Implement real-time security monitoring and alerting',
        'Add intrusion detection capabilities',
        'Set up automated threat response mechanisms'
      ],
      riskLevel: compliant ? 'low' : 'high'
    };
  }

  // Encryption Tests
  private async testCryptographicStrength(): Promise<SecurityTestResult> {
    const strongAlgorithms = await this.checkCodeForPattern('server', /aes.?256|sha.?256|rsa.?2048|ecdsa/i);
    const weakAlgorithms = await this.checkCodeForPattern('server', /md5|sha1|des|rc4/i);
    const randomGeneration = await this.checkCodeForPattern('server', /crypto\.randomBytes|crypto\.getRandomValues/i);
    
    const score = (strongAlgorithms ? 40 : 0) + (!weakAlgorithms ? 30 : 0) + (randomGeneration ? 30 : 0);
    const compliant = score >= 80 && !weakAlgorithms;
    
    return {
      passed: score > 0,
      compliant,
      score,
      details: `Cryptographic strength: Strong algorithms: ${strongAlgorithms}, No weak algorithms: ${!weakAlgorithms}, Secure random: ${randomGeneration}`,
      recommendations: compliant ? [] : [
        'Use only approved cryptographic algorithms (AES-256, SHA-256+, RSA-2048+)',
        'Remove any weak cryptographic implementations',
        'Use cryptographically secure random number generation'
      ],
      riskLevel: compliant ? 'low' : 'critical'
    };
  }

  private async testKeyManagement(): Promise<SecurityTestResult> {
    const keyRotation = await this.checkCodeForPattern('server', /rotate.*key|key.*rotation/i);
    const keyStorage = process.env.STRIPE_SECRET_KEY ? true : false; // Secrets management
    const keyAccess = await this.checkCodeForPattern('server', /key.*access|access.*key/i);
    
    const score = (keyRotation ? 40 : 0) + (keyStorage ? 30 : 0) + (keyAccess ? 30 : 0);
    const compliant = score >= 70;
    
    return {
      passed: score > 0,
      compliant,
      score,
      details: `Key management: Rotation: ${keyRotation}, Secure storage: ${keyStorage}, Access control: ${keyAccess}`,
      recommendations: compliant ? [] : [
        'Implement automatic key rotation policies',
        'Use hardware security modules or secure key vaults',
        'Apply strict access controls to cryptographic keys'
      ],
      riskLevel: compliant ? 'low' : 'critical'
    };
  }

  // Compliance Tests
  private async testFinancialDataProtection(): Promise<SecurityTestResult> {
    const financialAudit = await this.checkCodeForPattern('server/routes/enterprise.ts', /financial|compliance|audit/i);
    const dataIntegrity = await this.checkCodeForPattern('server/storage.ts', /integrity|hash|checksum/i);
    const accessControl = await this.checkCodeForPattern('server/middleware', /financial.*auth|finance.*permission/i);
    
    const score = (financialAudit ? 40 : 0) + (dataIntegrity ? 30 : 0) + (accessControl ? 30 : 0);
    const compliant = score >= 80;
    
    return {
      passed: score > 0,
      compliant,
      score,
      details: `Financial data protection: Audit trails: ${financialAudit}, Data integrity: ${dataIntegrity}, Access control: ${accessControl}`,
      recommendations: compliant ? [] : [
        'Implement comprehensive financial data audit trails',
        'Ensure data integrity controls for financial information',
        'Apply strict access controls to financial data'
      ],
      riskLevel: compliant ? 'low' : 'critical'
    };
  }

  private async testPCICompliance(): Promise<SecurityTestResult> {
    const cardDataHandling = await this.checkCodeForPattern('server', /stripe|payment.*secure|tokenize/i);
    const networkSecurity = await this.checkCodeForPattern('server', /firewall|network.*security/i);
    const vulnerabilityManagement = this.checkFileExists('server/testing');
    
    const score = (cardDataHandling ? 40 : 0) + (networkSecurity ? 30 : 0) + (vulnerabilityManagement ? 30 : 0);
    const compliant = score >= 80;
    
    return {
      passed: score > 0,
      compliant,
      score,
      details: `PCI compliance: Secure payment handling: ${cardDataHandling}, Network security: ${networkSecurity}, Vulnerability management: ${vulnerabilityManagement}`,
      recommendations: compliant ? [] : [
        'Use PCI-compliant payment processors for card data',
        'Implement network segmentation and firewall rules',
        'Maintain regular vulnerability scanning and patching'
      ],
      riskLevel: compliant ? 'low' : 'critical'
    };
  }

  // Incident Response Tests
  private async testIncidentResponsePlan(): Promise<SecurityTestResult> {
    const incidentPlan = this.checkFileExists('server/incident-response.md');
    const alerting = await this.checkCodeForPattern('server', /alert|notify.*incident|emergency/i);
    const documentation = this.checkFileExists('README.md') || this.checkFileExists('SECURITY.md');
    
    const score = (incidentPlan ? 50 : 0) + (alerting ? 25 : 0) + (documentation ? 25 : 0);
    const compliant = score >= 75;
    
    return {
      passed: score > 0,
      compliant,
      score,
      details: `Incident response: Plan documented: ${incidentPlan}, Alerting system: ${alerting}, Documentation: ${documentation}`,
      recommendations: compliant ? [] : [
        'Document comprehensive incident response procedures',
        'Implement automated incident detection and alerting',
        'Maintain security documentation and playbooks'
      ],
      riskLevel: compliant ? 'low' : 'medium'
    };
  }

  private async testBreachNotification(): Promise<SecurityTestResult> {
    const notificationSystem = await this.checkCodeForPattern('server', /breach.*notify|notify.*breach|gdpr.*notification/i);
    const contactMechanism = await this.checkCodeForPattern('server', /email.*admin|notify.*authority/i);
    const timelinessControl = await this.checkCodeForPattern('server', /72.*hour|immediate.*notify/i);
    
    const score = (notificationSystem ? 40 : 0) + (contactMechanism ? 30 : 0) + (timelinessControl ? 30 : 0);
    const compliant = score >= 70;
    
    return {
      passed: score > 0,
      compliant,
      score,
      details: `Breach notification: System exists: ${notificationSystem}, Contact mechanism: ${contactMechanism}, Timeliness controls: ${timelinessControl}`,
      recommendations: compliant ? [] : [
        'Implement automated breach detection and notification',
        'Establish direct communication channels with authorities',
        'Ensure 72-hour notification compliance for GDPR'
      ],
      riskLevel: compliant ? 'low' : 'high'
    };
  }

  // Helper methods
  private checkFileExists(filePath: string): boolean {
    try {
      return fs.existsSync(path.join(process.cwd(), filePath));
    } catch {
      return false;
    }
  }

  private async checkCodeForPattern(searchPath: string, pattern: RegExp): Promise<boolean> {
    try {
      const fullPath = path.join(process.cwd(), searchPath);
      
      if (fs.statSync(fullPath).isDirectory()) {
        // Search in directory
        const files = this.getAllFiles(fullPath, ['.ts', '.js', '.tsx', '.jsx']);
        
        for (const file of files) {
          const content = fs.readFileSync(file, 'utf8');
          if (pattern.test(content)) {
            return true;
          }
        }
        return false;
      } else {
        // Search in single file
        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath, 'utf8');
          return pattern.test(content);
        }
        return false;
      }
    } catch {
      return false;
    }
  }

  private getAllFiles(dirPath: string, extensions: string[]): string[] {
    const files: string[] = [];
    
    try {
      const items = fs.readdirSync(dirPath);
      
      for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          files.push(...this.getAllFiles(itemPath, extensions));
        } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
          files.push(itemPath);
        }
      }
    } catch {
      // Ignore access errors
    }
    
    return files;
  }

  private generateComplianceReport(): ComplianceReport {
    const frameworks = ['NIST', 'ISO27001', 'SOC2', 'PCI_DSS', 'GDPR', 'SOX'];
    const categories = ['access_control', 'data_protection', 'audit_logging', 'encryption', 'compliance', 'incident_response'];

    // Calculate overall metrics
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.result.compliant).length;
    const overallScore = totalTests > 0 ? Math.round((this.testResults.reduce((sum, r) => sum + r.result.score, 0) / totalTests)) : 0;
    const overallCompliance = Math.round((passedTests / totalTests) * 100);

    // Framework-specific metrics
    const frameworkMetrics: { [key: string]: any } = {};
    frameworks.forEach(framework => {
      const frameworkTests = this.testResults.filter(r => r.test.framework === framework);
      const frameworkPassed = frameworkTests.filter(r => r.result.compliant).length;
      const frameworkCritical = frameworkTests.filter(r => !r.result.compliant && r.result.riskLevel === 'critical').length;
      
      frameworkMetrics[framework] = {
        score: frameworkTests.length > 0 ? Math.round(frameworkTests.reduce((sum, r) => sum + r.result.score, 0) / frameworkTests.length) : 0,
        compliance: frameworkTests.length > 0 ? Math.round((frameworkPassed / frameworkTests.length) * 100) : 0,
        passedTests: frameworkPassed,
        totalTests: frameworkTests.length,
        criticalIssues: frameworkCritical
      };
    });

    // Category-specific metrics
    const categoryMetrics: { [key: string]: any } = {};
    categories.forEach(category => {
      const categoryTests = this.testResults.filter(r => r.test.category === category);
      const categoryPassed = categoryTests.filter(r => r.result.compliant).length;
      
      categoryMetrics[category] = {
        score: categoryTests.length > 0 ? Math.round(categoryTests.reduce((sum, r) => sum + r.result.score, 0) / categoryTests.length) : 0,
        passedTests: categoryPassed,
        totalTests: categoryTests.length
      };
    });

    // Collect failures
    const failures = this.testResults
      .filter(r => !r.result.compliant)
      .map(r => ({
        test: r.test.name,
        category: r.test.category,
        framework: r.test.framework,
        risk: r.result.riskLevel,
        details: r.result.details,
        recommendations: r.result.recommendations
      }));

    // Generate recommendations
    const recommendations = [
      'Implement comprehensive security training program',
      'Regular security assessments and penetration testing',
      'Maintain up-to-date security documentation',
      'Establish incident response and business continuity plans',
      'Regular compliance audits and reviews',
      'Implement automated security monitoring and alerting'
    ];

    return {
      overall: {
        score: overallScore,
        compliance: overallCompliance,
        riskLevel: overallScore >= 90 ? 'low' : overallScore >= 70 ? 'medium' : 'high',
        passedTests,
        totalTests
      },
      frameworks: frameworkMetrics,
      categories: categoryMetrics,
      failures,
      recommendations
    };
  }

  private printComplianceReport(report: ComplianceReport): void {
    console.log(`\n🔒 SECURITY COMPLIANCE REPORT`);
    console.log(`${'-'.repeat(80)}`);
    
    console.log(`\n📊 Overall Security Posture:`);
    console.log(`   Security Score: ${report.overall.score}/100`);
    console.log(`   Compliance Rate: ${report.overall.compliance}%`);
    console.log(`   Risk Level: ${report.overall.riskLevel.toUpperCase()}`);
    console.log(`   Tests Passed: ${report.overall.passedTests}/${report.overall.totalTests}`);
    
    console.log(`\n📋 Framework Compliance:`);
    Object.entries(report.frameworks).forEach(([framework, metrics]) => {
      if (metrics.totalTests > 0) {
        console.log(`   ${framework}: ${metrics.compliance}% (${metrics.passedTests}/${metrics.totalTests} tests)`);
        if (metrics.criticalIssues > 0) {
          console.log(`     🚨 ${metrics.criticalIssues} critical issues`);
        }
      }
    });
    
    if (report.failures.length > 0) {
      console.log(`\n❌ Compliance Failures:`);
      report.failures.forEach((failure, index) => {
        console.log(`\n   ${index + 1}. ${failure.test} [${failure.framework}]`);
        console.log(`      Category: ${failure.category}`);
        console.log(`      Risk Level: ${failure.risk.toUpperCase()}`);
        console.log(`      Details: ${failure.details}`);
        if (failure.recommendations.length > 0) {
          console.log(`      Recommendations:`);
          failure.recommendations.forEach(rec => console.log(`        - ${rec}`));
        }
      });
    }
    
    // Security assessment
    console.log(`\n🎯 SECURITY ASSESSMENT`);
    console.log(`${'-'.repeat(40)}`);
    
    if (report.overall.score >= 90 && report.overall.compliance >= 95) {
      console.log(`✅ Excellent security posture - enterprise ready`);
    } else if (report.overall.score >= 75 && report.overall.compliance >= 80) {
      console.log(`🟡 Good security - minor compliance gaps to address`);
    } else if (report.overall.score >= 60 && report.overall.compliance >= 60) {
      console.log(`🟠 Fair security - significant improvements needed`);
    } else {
      console.log(`🔴 Poor security - critical compliance issues require immediate attention`);
    }
  }
}

export const securityTester = new SecurityTester();