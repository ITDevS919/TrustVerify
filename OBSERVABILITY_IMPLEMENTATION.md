# Observability & Incident Response Implementation

This document describes the implementation of observability and incident response features for TrustVerify.

## Features Implemented

### 1. Structured Telemetry (Logs, Metrics, Traces) with Correlation IDs

**Service**: `server/services/telemetry.ts`

- **Correlation IDs**: Automatically generated for each request and propagated through headers
- **Trace IDs**: Unique identifiers for distributed tracing
- **Span IDs**: Individual operation identifiers within a trace
- **Structured Logging**: All logs include correlation IDs, trace IDs, and context
- **Metrics Recording**: Structured metric entries with tags and context
- **Distributed Tracing**: Span-based tracing with parent-child relationships

**Middleware**: `server/middleware/telemetry.ts`
- Automatically adds correlation IDs to all requests
- Starts and ends trace spans for each request
- Logs request start and completion with full context

**Usage**:
```typescript
// Get context from request
const context = (req as any).telemetryContext;

// Log with context
telemetryService.log({
  level: 'info',
  message: 'Operation completed',
  context,
  metadata: { ... }
});

// Record metric
telemetryService.recordMetric({
  name: 'api.request.duration',
  value: 150,
  unit: 'ms',
  tags: { endpoint: '/api/users' },
  context,
});
```

### 2. Immutable Audit Trails (WORM Storage)

**Service**: `server/services/worm-storage.ts`

- **Write-Once-Read-Many (WORM)**: Records cannot be modified after creation
- **Hash Chain**: Each record includes hash of previous record for integrity verification
- **Encryption Support**: Optional encryption of stored records
- **Date-Based Organization**: Records organized by year/month/day for efficient retrieval
- **Retention Policy**: Configurable retention period (default 7 years)
- **Integrity Verification**: `verifyRecord()` method to check record integrity

**Configuration**:
- `WORM_STORAGE_PATH`: Storage directory path
- `WORM_ENABLE_ENCRYPTION`: Enable encryption (true/false)
- `WORM_ENCRYPTION_KEY`: Encryption key
- `WORM_RETENTION_DAYS`: Retention period in days (default: 2555 = 7 years)

**Usage**:
```typescript
// Write audit event to WORM storage
await wormStorage.writeRecord(auditEvent, metadata);

// Read records for date range
const records = await wormStorage.readRecords(startDate, endDate, eventType);

// Verify record integrity
const isValid = await wormStorage.verifyRecord(record);
```

### 3. Security Alerts and Dashboards

**Service**: `server/services/security-alerts.ts`

**Alert Types**:
- `auth_failure`: Multiple authentication failures
- `exfiltration`: Large data exports or rapid exports
- `suspicious_activity`: Unusual patterns
- `data_breach`: Potential data breach indicators
- `rate_limit`: Rate limit violations
- `unauthorized_access`: Unauthorized access attempts

**Features**:
- **Real-time Monitoring**: Tracks auth failures, data exports, and security events
- **Alert Rules**: Configurable thresholds and conditions
- **Dashboard Metrics**: 
  - Auth failures (24h, 7d, 30d) by IP and user
  - Exfiltration signals and suspicious exports
  - Security events by severity
  - Rate limit hits by endpoint
- **Auto-Alerting**: Automatically creates alerts when thresholds are exceeded

**API Endpoints**:
- `GET /api/admin/security/dashboard`: Get dashboard metrics
- `GET /api/admin/security/alerts`: Get active alerts
- `POST /api/admin/security/alerts/:id/resolve`: Resolve an alert

**Integration**:
- Automatically records auth failures in `auth.ts`
- Monitors data exports in transaction routes
- Integrates with SIEM for event forwarding

### 4. Incident Response Runbooks and Escalation Procedures

**Service**: `server/services/incident-response.ts`

**Features**:
- **Incident Management**: Create, track, and resolve security incidents
- **Runbooks**: Pre-defined response procedures for common scenarios
- **Step Tracking**: Track completion of each runbook step
- **Notes**: Add notes and attachments to incidents
- **Escalation**: Automatic escalation based on time thresholds
- **Auto-Creation**: Automatically creates incidents from critical alerts

**Default Runbooks**:
1. **Brute Force Attack Response** (`auth_failure_brute_force`)
   - Identify attack source
   - Block source IP
   - Lock affected accounts
   - Notify security team

2. **Data Exfiltration Response** (`data_exfiltration`)
   - Immediate containment
   - Assess data access
   - Notify legal and compliance
   - Preserve evidence

3. **Rate Limit Abuse Response** (`rate_limit_abuse`)
   - Verify legitimate use
   - Adjust rate limits

**API Endpoints**:
- `GET /api/admin/incidents`: List all incidents
- `GET /api/admin/incidents/:id`: Get incident details
- `POST /api/admin/incidents/:id/status`: Update incident status
- `POST /api/admin/incidents/:id/steps/:stepId/complete`: Complete a runbook step
- `POST /api/admin/incidents/:id/notes`: Add note to incident
- `GET /api/admin/runbooks`: List available runbooks

**Escalation Levels**:
Each runbook defines escalation levels with:
- Role (Security Analyst, Security Manager, CISO, Legal Counsel)
- Contact method (email, phone)
- Escalation time threshold

## Integration Points

### Authentication Failures
- `server/auth.ts`: Records auth failures and triggers alerts
- WORM storage: All auth events written to immutable storage

### Data Access Monitoring
- `server/routes.ts`: Monitors transaction data exports
- Exfiltration signals triggered for large or rapid exports

### Audit Logging
- `server/security/audit-logger.ts`: All audit events written to WORM storage
- Correlation IDs included in all audit events

### Telemetry Middleware
- `server/middleware/telemetry.ts`: Adds correlation IDs to all requests
- Automatic span creation for distributed tracing

## Configuration

### Environment Variables

```bash
# Telemetry
LOG_LEVEL=info

# WORM Storage
WORM_STORAGE_PATH=./audit-trails
WORM_ENABLE_ENCRYPTION=false
WORM_ENCRYPTION_KEY=your-encryption-key
WORM_RETENTION_DAYS=2555
WORM_STORAGE_ENABLED=true

# SIEM Integration (for alerts)
SIEM_ENDPOINT=https://your-siem-endpoint.com
SIEM_API_KEY=your-api-key
SIEM_PROVIDER=splunk|datadog|sentry|custom
```

## Scheduled Tasks

The following tasks run automatically:

1. **WORM Storage Cleanup**: Daily cleanup of records older than retention period
2. **Auto-Incident Creation**: Every 5 minutes, creates incidents from critical alerts
3. **Auth Failure Cleanup**: Hourly cleanup of old auth failure records

## Monitoring and Alerting

### Dashboard Metrics

Access the security dashboard at `/api/admin/security/dashboard` to view:
- Authentication failure trends
- Exfiltration signals
- Security event counts by severity
- Rate limit violations

### Alert Thresholds

Default thresholds (configurable in `security-alerts.ts`):
- **Auth Failures**: 5 failures in 15 minutes → High severity alert
- **Large Exports**: >10,000 records → Critical alert
- **Rapid Exports**: 10+ exports in 1 hour → High severity alert

## Best Practices

1. **Correlation IDs**: Always include correlation IDs in logs for request tracing
2. **WORM Storage**: Critical events automatically written to WORM storage
3. **Alert Response**: Review and respond to alerts promptly using runbooks
4. **Incident Tracking**: Use incidents to track security events through resolution
5. **Runbook Updates**: Keep runbooks updated with latest procedures

## Future Enhancements

- Integration with external SIEM platforms (Splunk, Datadog, etc.)
- Real-time alerting via email/SMS/Slack
- Advanced analytics and anomaly detection
- Automated response actions (auto-block IPs, lock accounts)
- Integration with ticketing systems (Jira, ServiceNow)

