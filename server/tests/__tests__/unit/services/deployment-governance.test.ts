/**
 * Unit Tests for Deployment Governance Service
 */

// Mock dependencies BEFORE importing the service
jest.mock('../../../../services/health-check-service', () => ({
  healthCheckService: {
    performHealthCheck: jest.fn().mockResolvedValue({
      status: 'healthy',
      checks: {},
    }),
    isReady: jest.fn().mockResolvedValue(true),
    isAlive: jest.fn().mockReturnValue(true),
  },
}));

jest.mock('../../../../services/siem-integration', () => ({
  siemService: {
    logSecurityEvent: jest.fn().mockResolvedValue(true),
  },
}));

import { DeploymentGovernanceService } from '../../../../services/deployment-governance';

describe('DeploymentGovernanceService', () => {
  let deploymentService: DeploymentGovernanceService;

  beforeEach(() => {
    deploymentService = new DeploymentGovernanceService();
  });

  describe('recordDeployment', () => {
    it('should record a new deployment', async () => {
      const deployment = await deploymentService.recordDeployment(
        '1.0.0',
        'production',
        'test-user'
      );

      expect(deployment).toHaveProperty('id');
      expect(deployment.version).toBe('1.0.0');
      expect(deployment.environment).toBe('production');
      expect(deployment.status).toBe('deploying');
      expect(deployment.deployedBy).toBe('test-user');
    });
  });

  describe('markDeploymentActive', () => {
    it('should mark deployment as active', async () => {
      const deployment = await deploymentService.recordDeployment(
        '1.0.0',
        'production',
        'test-user'
      );

      const result = await deploymentService.markDeploymentActive(deployment.id);

      expect(result).toBe(true);
      const current = deploymentService.getCurrentDeployment();
      expect(current?.status).toBe('active');
    });

    it('should return false for non-existent deployment', async () => {
      const result = await deploymentService.markDeploymentActive('non-existent');
      expect(result).toBe(false);
    });
  });

  describe('triggerRollback', () => {
    it('should trigger rollback for deployment', async () => {
      const deployment = await deploymentService.recordDeployment(
        '1.0.0',
        'production',
        'test-user'
      );

      const result = await deploymentService.triggerRollback(
        deployment,
        'Test rollback reason'
      );

      expect(result).toBe(true);
      // The deployment object should be updated directly
      expect(deployment.status).toBe('rolled_back');
    });
  });

  describe('getDeploymentHistory', () => {
    it('should return deployment history', async () => {
      await deploymentService.recordDeployment('1.0.0', 'production', 'user1');
      await deploymentService.recordDeployment('1.1.0', 'production', 'user2');

      const history = deploymentService.getDeploymentHistory(10);

      expect(history.length).toBeGreaterThanOrEqual(2);
      expect(history[0].version).toBe('1.1.0'); // Most recent first
    });
  });
});

