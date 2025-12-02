/**
 * Incident Response Service
 * Manages incident response runbooks and escalation procedures
 */

import { config } from '../config';
import pino from 'pino';
import { SecurityAlert } from './security-alerts';
import { siemService } from './siem-integration';
import { telemetryService } from './telemetry';

const logger = pino({
  name: 'incident-response',
  level: config.LOG_LEVEL || 'info'
});

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'contained' | 'resolved' | 'closed';
  alertIds: string[];
  assignedTo?: number;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  resolvedBy?: number;
  runbook?: string;
  steps: IncidentStep[];
  notes: IncidentNote[];
  correlationId?: string;
}

export interface IncidentStep {
  id: string;
  step: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  completedAt?: Date;
  completedBy?: number;
  notes?: string;
}

export interface IncidentNote {
  id: string;
  author: number;
  content: string;
  timestamp: Date;
  attachments?: string[];
}

export interface Runbook {
  id: string;
  name: string;
  description: string;
  severity: Incident['severity'];
  category: 'security' | 'availability' | 'performance' | 'data' | 'compliance';
  steps: RunbookStep[];
  escalation: EscalationProcedure;
}

export interface RunbookStep {
  order: number;
  title: string;
  description: string;
  action: string;
  expectedOutcome: string;
  timeout?: number; // in minutes
}

export interface EscalationProcedure {
  levels: EscalationLevel[];
  onCallRotation?: string[];
}

export interface EscalationLevel {
  level: number;
  role: string;
  contactMethod: string;
  contactInfo: string;
  escalationTime: number; // minutes
}

export class IncidentResponseService {
  private incidents: Incident[] = [];
  private runbooks: Runbook[] = [];

  constructor() {
    this.initializeDefaultRunbooks();
  }

  /**
   * Initialize default runbooks
   */
  private initializeDefaultRunbooks(): void {
    this.runbooks = [
      {
        id: 'auth_failure_brute_force',
        name: 'Brute Force Attack Response',
        description: 'Response procedure for multiple authentication failures',
        severity: 'high',
        category: 'security',
        steps: [
          {
            order: 1,
            title: 'Identify Attack Source',
            description: 'Review authentication failure logs and identify source IP',
            action: 'Check security alerts dashboard for auth failure patterns',
            expectedOutcome: 'Source IP and user accounts identified',
            timeout: 5,
          },
          {
            order: 2,
            title: 'Block Source IP',
            description: 'Temporarily block the source IP address',
            action: 'Add IP to firewall blocklist or rate limiting rules',
            expectedOutcome: 'IP blocked from further authentication attempts',
            timeout: 10,
          },
          {
            order: 3,
            title: 'Lock Affected Accounts',
            description: 'Lock user accounts that may be compromised',
            action: 'Set account lock status for affected users',
            expectedOutcome: 'Compromised accounts locked',
            timeout: 5,
          },
          {
            order: 4,
            title: 'Notify Security Team',
            description: 'Escalate to security team for investigation',
            action: 'Send alert to security team with incident details',
            expectedOutcome: 'Security team notified and investigating',
            timeout: 15,
          },
        ],
        escalation: {
          levels: [
            {
              level: 1,
              role: 'Security Analyst',
              contactMethod: 'email',
              contactInfo: (config as any).GDPR_ADMIN_EMAIL || 'security@trustverify.com',
              escalationTime: 15,
            },
            {
              level: 2,
              role: 'Security Manager',
              contactMethod: 'phone',
              contactInfo: '+1-XXX-XXX-XXXX',
              escalationTime: 30,
            },
            {
              level: 3,
              role: 'CISO',
              contactMethod: 'phone',
              contactInfo: '+1-XXX-XXX-XXXX',
              escalationTime: 60,
            },
          ],
        },
      },
      {
        id: 'data_exfiltration',
        name: 'Data Exfiltration Response',
        description: 'Response procedure for suspected data exfiltration',
        severity: 'critical',
        category: 'security',
        steps: [
          {
            order: 1,
            title: 'Immediate Containment',
            description: 'Suspend user account and API access',
            action: 'Disable user account and revoke all API keys',
            expectedOutcome: 'User access immediately suspended',
            timeout: 5,
          },
          {
            order: 2,
            title: 'Assess Data Access',
            description: 'Review what data was accessed and exported',
            action: 'Query audit logs and WORM storage for data access records',
            expectedOutcome: 'Complete list of accessed data',
            timeout: 15,
          },
          {
            order: 3,
            title: 'Notify Legal and Compliance',
            description: 'Escalate to legal team for breach assessment',
            action: 'Send incident report to legal and compliance teams',
            expectedOutcome: 'Legal team assessing breach notification requirements',
            timeout: 30,
          },
          {
            order: 4,
            title: 'Preserve Evidence',
            description: 'Ensure all logs and evidence are preserved',
            action: 'Verify WORM storage contains all relevant records',
            expectedOutcome: 'All evidence preserved for investigation',
            timeout: 10,
          },
        ],
        escalation: {
          levels: [
            {
              level: 1,
              role: 'Security Manager',
              contactMethod: 'phone',
              contactInfo: '+1-XXX-XXX-XXXX',
              escalationTime: 15,
            },
            {
              level: 2,
              role: 'CISO',
              contactMethod: 'phone',
              contactInfo: '+1-XXX-XXX-XXXX',
              escalationTime: 30,
            },
            {
              level: 3,
              role: 'Legal Counsel',
              contactMethod: 'phone',
              contactInfo: '+1-XXX-XXX-XXXX',
              escalationTime: 60,
            },
          ],
        },
      },
      {
        id: 'rate_limit_abuse',
        name: 'Rate Limit Abuse Response',
        description: 'Response procedure for rate limit violations',
        severity: 'medium',
        category: 'availability',
        steps: [
          {
            order: 1,
            title: 'Verify Legitimate Use',
            description: 'Check if requests are from legitimate users',
            action: 'Review request patterns and user history',
            expectedOutcome: 'Legitimate vs malicious traffic identified',
            timeout: 10,
          },
          {
            order: 2,
            title: 'Adjust Rate Limits',
            description: 'Temporarily adjust rate limits if needed',
            action: 'Update rate limiting configuration',
            expectedOutcome: 'Rate limits adjusted appropriately',
            timeout: 5,
          },
        ],
        escalation: {
          levels: [
            {
              level: 1,
              role: 'Operations Team',
              contactMethod: 'email',
              contactInfo: 'ops@trustverify.com',
              escalationTime: 30,
            },
          ],
        },
      },
    ];
  }

  /**
   * Create incident from alert
   */
  createIncidentFromAlert(alert: SecurityAlert, runbookId?: string): Incident {
    const runbook = runbookId 
      ? this.runbooks.find(r => r.id === runbookId)
      : this.findRunbookForAlert(alert);

    const context = telemetryService.createContext({} as any);

    const incident: Incident = {
      id: `incident_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: alert.title,
      description: alert.description,
      severity: alert.severity,
      status: 'open',
      alertIds: [alert.id],
      createdAt: new Date(),
      updatedAt: new Date(),
      runbook: runbook?.id,
      steps: runbook?.steps.map((step, index) => ({
        id: `step_${index + 1}`,
        step: step.title,
        status: 'pending',
      })) || [],
      notes: [],
      correlationId: context.correlationId,
    };

    this.incidents.push(incident);

    logger.warn({
      incidentId: incident.id,
      alertId: alert.id,
      severity: incident.severity,
    }, 'Incident created from alert');

    // Log to SIEM
    siemService.logSecurityEvent(
      'incident_created',
      incident.severity,
      alert.userId,
      alert.ipAddress,
      {
        incidentId: incident.id,
        alertId: alert.id,
        runbook: runbook?.id,
        correlationId: context.correlationId,
      }
    ).catch(() => {});

    return incident;
  }

  /**
   * Find appropriate runbook for alert
   */
  private findRunbookForAlert(alert: SecurityAlert): Runbook | undefined {
    if (alert.type === 'auth_failure') {
      return this.runbooks.find(r => r.id === 'auth_failure_brute_force');
    }
    if (alert.type === 'exfiltration') {
      return this.runbooks.find(r => r.id === 'data_exfiltration');
    }
    if (alert.type === 'rate_limit') {
      return this.runbooks.find(r => r.id === 'rate_limit_abuse');
    }
    return undefined;
  }

  /**
   * Update incident status
   */
  updateIncidentStatus(
    incidentId: string,
    status: Incident['status'],
    updatedBy: number
  ): boolean {
    const incident = this.incidents.find(i => i.id === incidentId);
    if (!incident) {
      return false;
    }

    incident.status = status;
    incident.updatedAt = new Date();

    if (status === 'resolved' || status === 'closed') {
      incident.resolvedAt = new Date();
      incident.resolvedBy = updatedBy;
    }

    logger.info({
      incidentId,
      status,
      updatedBy,
    }, 'Incident status updated');

    return true;
  }

  /**
   * Complete incident step
   */
  completeStep(
    incidentId: string,
    stepId: string,
    completedBy: number,
    notes?: string
  ): boolean {
    const incident = this.incidents.find(i => i.id === incidentId);
    if (!incident) {
      return false;
    }

    const step = incident.steps.find(s => s.id === stepId);
    if (!step) {
      return false;
    }

    step.status = 'completed';
    step.completedAt = new Date();
    step.completedBy = completedBy;
    if (notes) {
      step.notes = notes;
    }

    incident.updatedAt = new Date();

    logger.info({
      incidentId,
      stepId,
      completedBy,
    }, 'Incident step completed');

    return true;
  }

  /**
   * Add note to incident
   */
  addNote(incidentId: string, author: number, content: string): boolean {
    const incident = this.incidents.find(i => i.id === incidentId);
    if (!incident) {
      return false;
    }

    const note: IncidentNote = {
      id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      author,
      content,
      timestamp: new Date(),
    };

    incident.notes.push(note);
    incident.updatedAt = new Date();

    return true;
  }

  /**
   * Get incident by ID
   */
  getIncident(incidentId: string): Incident | undefined {
    return this.incidents.find(i => i.id === incidentId);
  }

  /**
   * Get all incidents
   */
  getIncidents(status?: Incident['status']): Incident[] {
    let incidents = [...this.incidents];
    
    if (status) {
      incidents = incidents.filter(i => i.status === status);
    }

    return incidents.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Get runbooks
   */
  getRunbooks(category?: Runbook['category']): Runbook[] {
    let runbooks = [...this.runbooks];
    
    if (category) {
      runbooks = runbooks.filter(r => r.category === category);
    }

    return runbooks;
  }

  /**
   * Escalate incident
   */
  escalateIncident(incidentId: string): boolean {
    const incident = this.incidents.find(i => i.id === incidentId);
    if (!incident) {
      return false;
    }

    const runbook = this.runbooks.find(r => r.id === incident.runbook);
    if (!runbook || !runbook.escalation) {
      return false;
    }

    // Determine escalation level based on time since creation
    const timeSinceCreation = Date.now() - incident.createdAt.getTime();
    const escalationLevel = runbook.escalation.levels.find(
      level => timeSinceCreation >= level.escalationTime * 60 * 1000
    );

    if (escalationLevel) {
      logger.warn({
        incidentId,
        escalationLevel: escalationLevel.level,
        role: escalationLevel.role,
      }, 'Incident escalated');

      // In production, send notification via email/SMS/Slack
      this.addNote(
        incidentId,
        0, // System
        `Incident escalated to ${escalationLevel.role} (Level ${escalationLevel.level})`
      );
    }

    return true;
  }
}

export const incidentResponse = new IncidentResponseService();

