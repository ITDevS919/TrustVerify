/**
 * Deployment Governance Service
 * Implements automated rollback and release governance per BR-OPS-EN
 */

import { config } from '../config';
import pino from 'pino';
import { siemService } from './siem-integration';
import { healthCheckService } from './health-check-service';

const logger = pino({
  name: 'deployment-governance',
  level: config.LOG_LEVEL || 'info'
});

export interface Deployment {
  id: string;
  version: string;
  environment: string;
  region: string;
  deployedAt: Date;
  deployedBy: string;
  status: 'pending' | 'deploying' | 'active' | 'rolled_back' | 'failed';
  healthCheckPassed: boolean;
  rollbackThreshold?: {
    errorRate: number;
    responseTime: number;
    duration: number; // seconds
  };
}

export interface RollbackPolicy {
  enabled: boolean;
  autoRollback: boolean;
  errorRateThreshold: number; // percentage
  responseTimeThreshold: number; // milliseconds
  monitoringWindow: number; // seconds
  gracePeriod: number; // seconds before monitoring starts
}

export class DeploymentGovernanceService {
  private currentDeployment: Deployment | null = null;
  private deploymentHistory: Deployment[] = [];
  private rollbackPolicy: RollbackPolicy = {
    enabled: config.ROLLBACK_ENABLED || false,
    autoRollback: true,
    errorRateThreshold: 0.1, // 10%
    responseTimeThreshold: 2000, // 2 seconds
    monitoringWindow: 300, // 5 minutes
    gracePeriod: 60, // 1 minute
  };

  /**
   * Record new deployment
   */
  async recordDeployment(
    version: string,
    environment: string,
    deployedBy: string
  ): Promise<Deployment> {
    // Use a small delay to ensure unique timestamps for proper sorting
    // This is especially important in tests where deployments are created quickly
    const now = new Date();
    if (this.deploymentHistory.length > 0) {
      const lastDeployment = this.deploymentHistory[this.deploymentHistory.length - 1];
      if (now.getTime() <= lastDeployment.deployedAt.getTime()) {
        now.setTime(lastDeployment.deployedAt.getTime() + 1);
      }
    }
    
    const deployment: Deployment = {
      id: `deploy_${now.getTime()}_${Math.random().toString(36).substr(2, 9)}`,
      version,
      environment,
      region: config.REGION || 'us-east-1',
      deployedAt: now,
      deployedBy,
      status: 'deploying',
      healthCheckPassed: false,
      rollbackThreshold: {
        errorRate: this.rollbackPolicy.errorRateThreshold,
        responseTime: this.rollbackPolicy.responseTimeThreshold,
        duration: this.rollbackPolicy.monitoringWindow,
      },
    };

    this.currentDeployment = deployment;
    this.deploymentHistory.push(deployment);

    logger.info({ deployment }, 'Deployment recorded');

    // Log to SIEM
    await siemService.logSecurityEvent(
      'deployment_started',
      'medium',
      undefined,
      undefined,
      {
        deploymentId: deployment.id,
        version,
        environment,
        deployedBy,
      }
    );

    // Start monitoring for rollback conditions
    if (this.rollbackPolicy.enabled && this.rollbackPolicy.autoRollback) {
      this.startRollbackMonitoring(deployment);
    }

    return deployment;
  }

  /**
   * Mark deployment as active
   */
  async markDeploymentActive(deploymentId: string): Promise<boolean> {
    const deployment = this.deploymentHistory.find(d => d.id === deploymentId);
    if (!deployment) {
      return false;
    }

    deployment.status = 'active';
    deployment.healthCheckPassed = true;

    logger.info({ deploymentId }, 'Deployment marked as active');

    return true;
  }

  /**
   * Start monitoring for rollback conditions
   */
  private startRollbackMonitoring(deployment: Deployment): void {
    // Wait for grace period
    setTimeout(() => {
      const monitoringInterval = setInterval(async () => {
        if (deployment.status !== 'active' && deployment.status !== 'deploying') {
          clearInterval(monitoringInterval);
          return;
        }

        // Check health status
        const health = await healthCheckService.performHealthCheck();
        
        // Check if rollback conditions are met
        const shouldRollback = await this.shouldRollback(deployment, health);
        
        if (shouldRollback) {
          clearInterval(monitoringInterval);
          await this.triggerRollback(deployment, 'Automatic rollback triggered due to health degradation');
        }
      }, 10000); // Check every 10 seconds

      // Stop monitoring after monitoring window
      setTimeout(() => {
        clearInterval(monitoringInterval);
        if (deployment.status === 'active') {
          logger.info({ deploymentId: deployment.id }, 'Deployment monitoring completed successfully');
        }
      }, this.rollbackPolicy.monitoringWindow * 1000);
    }, this.rollbackPolicy.gracePeriod * 1000);
  }

  /**
   * Determine if rollback should be triggered
   */
  private async shouldRollback(
    _deployment: Deployment,
    health: any
  ): Promise<boolean> {
    if (!this.rollbackPolicy.enabled) {
      return false;
    }

    // Check overall health status
    if (health.status === 'unhealthy') {
      return true;
    }

    // Check error rate (would need metrics service integration)
    // For now, check health status components
    const unhealthyComponents = Object.values(health.checks).filter(
      (c: any) => c.status === 'unhealthy'
    ).length;

    if (unhealthyComponents > 0) {
      return true;
    }

    return false;
  }

  /**
   * Trigger rollback
   */
  async triggerRollback(
    deployment: Deployment,
    reason: string
  ): Promise<boolean> {
    if (deployment.status === 'rolled_back') {
      logger.warn({ deploymentId: deployment.id }, 'Deployment already rolled back');
      return false;
    }

    deployment.status = 'rolled_back';

    logger.error({
      deploymentId: deployment.id,
      version: deployment.version,
      reason,
    }, 'Rollback triggered');

    // Log to SIEM
    await siemService.logSecurityEvent(
      'deployment_rolled_back',
      'high',
      undefined,
      undefined,
      {
        deploymentId: deployment.id,
        version: deployment.version,
        environment: deployment.environment,
        reason,
      }
    );

    // In a real implementation, this would trigger actual rollback process
    // For now, we just mark it as rolled back
    return true;
  }

  /**
   * Get current deployment
   */
  getCurrentDeployment(): Deployment | null {
    return this.currentDeployment;
  }

  /**
   * Get deployment history
   */
  getDeploymentHistory(limit: number = 10): Deployment[] {
    return this.deploymentHistory
      .sort((a, b) => b.deployedAt.getTime() - a.deployedAt.getTime())
      .slice(0, limit);
  }

  /**
   * Update rollback policy
   */
  updateRollbackPolicy(policy: Partial<RollbackPolicy>): void {
    this.rollbackPolicy = {
      ...this.rollbackPolicy,
      ...policy,
    };

    logger.info({ policy: this.rollbackPolicy }, 'Rollback policy updated');
  }

  /**
   * Get rollback policy
   */
  getRollbackPolicy(): RollbackPolicy {
    return { ...this.rollbackPolicy };
  }
}

// Singleton instance
export const deploymentGovernance = new DeploymentGovernanceService();

