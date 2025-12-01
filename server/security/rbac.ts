import { Request, Response, NextFunction } from 'express';
import { User } from '@shared/schema';
import pino from 'pino';

const logger = pino({
  name: 'rbac',
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
});

// Define roles and permissions (Rule 1.3)
export enum Role {
  USER = 'user',
  CLIENT_ANALYST = 'client_analyst', // Limited dashboard & reports only
  CLIENT_ORG_OWNER = 'client_org_owner', // Manage billing, users
  DEVELOPER = 'developer', // Limited API integration sandbox
  MODERATOR = 'moderator',
  ADMIN = 'admin', // Full system control
  SUPER_ADMIN = 'super_admin'
}

export enum Permission {
  // User permissions
  READ_OWN_PROFILE = 'read:own_profile',
  UPDATE_OWN_PROFILE = 'update:own_profile',
  CREATE_TRANSACTION = 'create:transaction',
  READ_OWN_TRANSACTIONS = 'read:own_transactions',
  UPDATE_OWN_TRANSACTIONS = 'update:own_transactions',
  CREATE_MESSAGE = 'create:message',
  READ_OWN_MESSAGES = 'read:own_messages',
  CREATE_SCAM_REPORT = 'create:scam_report',
  READ_SCAM_REPORTS = 'read:scam_reports',
  
  // Client Analyst permissions (Rule 1.3)
  READ_ORG_DASHBOARD = 'read:org_dashboard',
  READ_ORG_REPORTS = 'read:org_reports',
  READ_ORG_TRANSACTIONS = 'read:org_transactions',
  EXPORT_ORG_REPORTS = 'export:org_reports',
  
  // Client Org Owner permissions (Rule 1.3)
  MANAGE_ORG_BILLING = 'manage:org_billing',
  MANAGE_ORG_USERS = 'manage:org_users',
  MANAGE_ORG_SETTINGS = 'manage:org_settings',
  READ_ORG_AUDIT_LOGS = 'read:org_audit_logs',
  MANAGE_ORG_API_KEYS = 'manage:org_api_keys',
  
  // Developer permissions (Rule 1.3)
  ACCESS_DEVELOPER_SANDBOX = 'access:developer_sandbox',
  MANAGE_API_KEYS = 'manage:api_keys',
  READ_API_DOCS = 'read:api_docs',
  TEST_API_ENDPOINTS = 'test:api_endpoints',
  
  // Moderator permissions
  READ_ALL_TRANSACTIONS = 'read:all_transactions',
  UPDATE_TRANSACTION_STATUS = 'update:transaction_status',
  READ_ALL_MESSAGES = 'read:all_messages',
  MODERATE_MESSAGES = 'moderate:messages',
  REVIEW_SCAM_REPORTS = 'review:scam_reports',
  UPDATE_SCAM_REPORTS = 'update:scam_reports',
  READ_KYC_VERIFICATIONS = 'read:kyc_verifications',
  REVIEW_KYC = 'review:kyc',
  
  // Admin permissions (Rule 1.3)
  READ_ALL_USERS = 'read:all_users',
  UPDATE_USER_STATUS = 'update:user_status',
  DELETE_USERS = 'delete:users',
  READ_DISPUTES = 'read:disputes',
  RESOLVE_DISPUTES = 'resolve:disputes',
  ACCESS_ADMIN_DASHBOARD = 'access:admin_dashboard',
  MANAGE_DEVELOPER_ACCOUNTS = 'manage:developer_accounts',
  MANAGE_CLIENT_ORGS = 'manage:client_orgs',
  ACCESS_SECURITY_INCIDENTS = 'access:security_incidents',
  MANAGE_INSURANCE_CLAIMS = 'manage:insurance_claims',
  
  // Super Admin permissions
  MANAGE_SYSTEM_CONFIG = 'manage:system_config',
  ACCESS_AUDIT_LOGS = 'access:audit_logs',
  MANAGE_ROLES = 'manage:roles',
  EMERGENCY_ACCESS = 'emergency:access',
  MANAGE_PENETRATION_TESTS = 'manage:penetration_tests',
  ACCESS_INCIDENT_RESPONSE = 'access:incident_response'
}

// Define base permissions for each role (Rule 1.3)
const basePermissions = {
  [Role.USER]: [
    Permission.READ_OWN_PROFILE,
    Permission.UPDATE_OWN_PROFILE,
    Permission.CREATE_TRANSACTION,
    Permission.READ_OWN_TRANSACTIONS,
    Permission.UPDATE_OWN_TRANSACTIONS,
    Permission.CREATE_MESSAGE,
    Permission.READ_OWN_MESSAGES,
    Permission.CREATE_SCAM_REPORT,
    Permission.READ_SCAM_REPORTS
  ],
  [Role.CLIENT_ANALYST]: [
    // Limited dashboard & reports only (Rule 1.3)
    Permission.READ_OWN_PROFILE,
    Permission.UPDATE_OWN_PROFILE,
    Permission.READ_ORG_DASHBOARD,
    Permission.READ_ORG_REPORTS,
    Permission.READ_ORG_TRANSACTIONS,
    Permission.EXPORT_ORG_REPORTS
  ],
  [Role.DEVELOPER]: [
    // Limited API integration sandbox (Rule 1.3)
    Permission.READ_OWN_PROFILE,
    Permission.UPDATE_OWN_PROFILE,
    Permission.ACCESS_DEVELOPER_SANDBOX,
    Permission.MANAGE_API_KEYS,
    Permission.READ_API_DOCS,
    Permission.TEST_API_ENDPOINTS
  ],
  [Role.MODERATOR]: [
    Permission.READ_ALL_TRANSACTIONS,
    Permission.UPDATE_TRANSACTION_STATUS,
    Permission.READ_ALL_MESSAGES,
    Permission.MODERATE_MESSAGES,
    Permission.REVIEW_SCAM_REPORTS,
    Permission.UPDATE_SCAM_REPORTS,
    Permission.READ_KYC_VERIFICATIONS,
    Permission.REVIEW_KYC
  ],
  [Role.ADMIN]: [
    Permission.READ_ALL_USERS,
    Permission.UPDATE_USER_STATUS,
    Permission.READ_DISPUTES,
    Permission.RESOLVE_DISPUTES,
    Permission.ACCESS_ADMIN_DASHBOARD,
    Permission.MANAGE_DEVELOPER_ACCOUNTS,
    Permission.MANAGE_CLIENT_ORGS,
    Permission.ACCESS_SECURITY_INCIDENTS,
    Permission.MANAGE_INSURANCE_CLAIMS
  ],
  [Role.SUPER_ADMIN]: [
    Permission.DELETE_USERS,
    Permission.MANAGE_SYSTEM_CONFIG,
    Permission.ACCESS_AUDIT_LOGS,
    Permission.MANAGE_ROLES,
    Permission.EMERGENCY_ACCESS,
    Permission.MANAGE_PENETRATION_TESTS,
    Permission.ACCESS_INCIDENT_RESPONSE
  ]
};

// Build role permissions with proper inheritance
const rolePermissions: Record<Role, Permission[]> = {
  [Role.USER]: basePermissions[Role.USER],
  [Role.CLIENT_ANALYST]: basePermissions[Role.CLIENT_ANALYST],
  [Role.CLIENT_ORG_OWNER]: [
    // Manage billing, users (Rule 1.3)
    ...basePermissions[Role.CLIENT_ANALYST],
    Permission.MANAGE_ORG_BILLING,
    Permission.MANAGE_ORG_USERS,
    Permission.MANAGE_ORG_SETTINGS,
    Permission.READ_ORG_AUDIT_LOGS,
    Permission.MANAGE_ORG_API_KEYS
  ],
  [Role.DEVELOPER]: basePermissions[Role.DEVELOPER],
  [Role.MODERATOR]: [
    // Inherit basic user permissions
    ...basePermissions[Role.USER],
    ...basePermissions[Role.MODERATOR]
  ],
  [Role.ADMIN]: [
    // Full system control (Rule 1.3)
    ...basePermissions[Role.USER],
    ...basePermissions[Role.MODERATOR],
    ...basePermissions[Role.ADMIN]
  ],
  [Role.SUPER_ADMIN]: [
    // Inherit all admin permissions
    ...basePermissions[Role.USER],
    ...basePermissions[Role.MODERATOR],
    ...basePermissions[Role.ADMIN],
    ...basePermissions[Role.SUPER_ADMIN]
  ]
};


export class RBACService {
  static getUserRole(user: User): Role {
    // Default role assignment logic
    if (user.email === 'admin@trustverify.com') return Role.SUPER_ADMIN;
    if (user.email?.endsWith('@trustverify.com')) return Role.ADMIN;
    if (user.trustScore && parseFloat(user.trustScore) >= 9.0) return Role.MODERATOR;
    return Role.USER;
  }
  
  static hasPermission(user: User, permission: Permission): boolean {
    const userRole = this.getUserRole(user);
    const permissions = rolePermissions[userRole] || [];
    return permissions.includes(permission);
  }
  
  static hasAnyPermission(user: User, permissions: Permission[]): boolean {
    return permissions.some(permission => this.hasPermission(user, permission));
  }
  
  static hasAllPermissions(user: User, permissions: Permission[]): boolean {
    return permissions.every(permission => this.hasPermission(user, permission));
  }
  
  static getUserPermissions(user: User): Permission[] {
    const userRole = this.getUserRole(user);
    return rolePermissions[userRole] || [];
  }
  
  static canAccessResource(user: User, resourceId: string, resourceType: string): boolean {
    const userRole = this.getUserRole(user);
    
    // Super admins can access everything
    if (userRole === Role.SUPER_ADMIN) return true;
    
    // Admins can access most resources
    if (userRole === Role.ADMIN) {
      return !['system_config', 'audit_logs'].includes(resourceType);
    }
    
    // Users can only access their own resources
    if (resourceType === 'user_profile' || resourceType === 'transaction' || resourceType === 'message') {
      return resourceId === user.id.toString();
    }
    
    return false;
  }
}

// RBAC Middleware
export const requirePermission = (permission: Permission) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated() || !req.user) {
      logger.warn({
        ip: req.ip,
        endpoint: req.path,
        permission,
        reason: 'not_authenticated'
      }, 'Access denied: Not authenticated');
      
      return res.status(401).json({
        error: 'Authentication required',
        code: 'AUTHENTICATION_REQUIRED'
      });
    }
    
    if (!RBACService.hasPermission(req.user, permission)) {
      logger.warn({
        userId: req.user.id,
        userRole: RBACService.getUserRole(req.user),
        ip: req.ip,
        endpoint: req.path,
        permission,
        reason: 'insufficient_permissions'
      }, 'Access denied: Insufficient permissions');
      
      return res.status(403).json({
        error: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: permission
      });
    }
    
    logger.debug({
      userId: req.user.id,
      userRole: RBACService.getUserRole(req.user),
      endpoint: req.path,
      permission
    }, 'Access granted');
    
    next();
  };
};

export const requireAnyPermission = (permissions: Permission[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        code: 'AUTHENTICATION_REQUIRED'
      });
    }
    
    if (!RBACService.hasAnyPermission(req.user, permissions)) {
      logger.warn({
        userId: req.user.id,
        userRole: RBACService.getUserRole(req.user),
        ip: req.ip,
        endpoint: req.path,
        permissions,
        reason: 'insufficient_permissions'
      }, 'Access denied: Insufficient permissions');
      
      return res.status(403).json({
        error: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: permissions
      });
    }
    
    next();
  };
};

export const requireRole = (role: Role) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        code: 'AUTHENTICATION_REQUIRED'
      });
    }
    
    const userRole = RBACService.getUserRole(req.user);
    const roleHierarchy = [Role.USER, Role.MODERATOR, Role.ADMIN, Role.SUPER_ADMIN];
    const requiredRoleIndex = roleHierarchy.indexOf(role);
    const userRoleIndex = roleHierarchy.indexOf(userRole);
    
    if (userRoleIndex < requiredRoleIndex) {
      logger.warn({
        userId: req.user.id,
        userRole,
        requiredRole: role,
        ip: req.ip,
        endpoint: req.path,
        reason: 'insufficient_role'
      }, 'Access denied: Insufficient role');
      
      return res.status(403).json({
        error: 'Insufficient role',
        code: 'INSUFFICIENT_ROLE',
        required: role,
        current: userRole
      });
    }
    
    next();
  };
};

// Resource ownership check
export const requireResourceOwnership = (resourceType: string, getResourceId?: (req: Request) => string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({
        error: 'Authentication required',
        code: 'AUTHENTICATION_REQUIRED'
      });
    }
    
    const userRole = RBACService.getUserRole(req.user);
    
    // Admins and above can access any resource
    if (userRole === Role.ADMIN || userRole === Role.SUPER_ADMIN) {
      return next();
    }
    
    const resourceId = getResourceId ? getResourceId(req) : req.params.id;
    
    if (!RBACService.canAccessResource(req.user, resourceId, resourceType)) {
      logger.warn({
        userId: req.user.id,
        resourceType,
        resourceId,
        ip: req.ip,
        endpoint: req.path,
        reason: 'not_resource_owner'
      }, 'Access denied: Not resource owner');
      
      return res.status(403).json({
        error: 'Access denied: You can only access your own resources',
        code: 'NOT_RESOURCE_OWNER'
      });
    }
    
    next();
  };
};

export default {
  Role,
  Permission,
  RBACService,
  requirePermission,
  requireAnyPermission,
  requireRole,
  requireResourceOwnership
};