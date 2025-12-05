# Developer Portal - Complete Implementation Document

**Version**: 2.0  
**Last Updated**: January 2025  
**Status**: ✅ Production Ready

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [Database Schema](#database-schema)
4. [Backend Implementation](#backend-implementation)
5. [Frontend Implementation](#frontend-implementation)
6. [Authentication & Authorization](#authentication--authorization)
7. [API Reference](#api-reference)
8. [Component Details](#component-details)
9. [Industry Templates](#industry-templates)
10. [Webhook System](#webhook-system)
11. [Analytics & Monitoring](#analytics--monitoring)
12. [SDK Management](#sdk-management)
13. [Deployment Guide](#deployment-guide)
14. [Testing Guide](#testing-guide)
15. [Troubleshooting](#troubleshooting)

---

## Executive Summary

The TrustVerify Developer Portal is a comprehensive platform that enables businesses to customize workflows for their specific industry needs. The portal provides:

- **Visual Workflow Builder** with drag-and-drop functionality
- **Industry Templates** for common use cases
- **Webhook Management** with delivery tracking
- **Analytics Dashboard** with real-time metrics
- **SDK Management** for multiple programming languages
- **Interactive API Documentation** with live testing

### Key Features Implemented

✅ Developer account creation and management  
✅ Auto-approval of developer accounts  
✅ Pending account access with limitations  
✅ Advanced workflow builder with drag-and-drop  
✅ Industry template gallery  
✅ Webhook configuration and management  
✅ Delivery logs and retry management  
✅ Enhanced analytics dashboard  
✅ SDK downloads and changelogs  
✅ API Explorer with interactive testing  
✅ Trust Score Simulator  
✅ API Sandbox  

---

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + TypeScript)              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Developer    │  │ Workflow     │  │ Analytics    │      │
│  │ Portal       │  │ Builder      │  │ Dashboard    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Webhook      │  │ SDK Manager  │  │ API Explorer │      │
│  │ Manager      │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Node.js + Express)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Developer    │  │ Workflow     │  │ Webhook      │      │
│  │ Routes       │  │ Service      │  │ Service      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Storage      │  │ Validation   │  │ Auth         │      │
│  │ Layer        │  │ (Zod)        │  │ Middleware   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Drizzle ORM
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Database (PostgreSQL)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Developer    │  │ Workflows    │  │ Templates    │      │
│  │ Accounts     │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Webhooks     │  │ API Keys    │  │ Usage Logs   │      │
│  │              │  │              │  │              │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- React 18+ with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- @dnd-kit for drag-and-drop
- Lucide React for icons
- React Query for API state management

**Backend:**
- Node.js 18+ with Express
- TypeScript
- PostgreSQL with Drizzle ORM
- Zod for validation
- Crypto for webhook signatures

---

## Database Schema

### Developer Accounts

```sql
CREATE TABLE developer_accounts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) NOT NULL,
  company_name TEXT,
  website TEXT,
  description TEXT,
  status TEXT DEFAULT 'pending', -- pending, approved, suspended
  monthly_quota INTEGER DEFAULT 1000,
  current_usage INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP,
  approved_by INTEGER REFERENCES users(id)
);
```

### Workflow Configurations

```sql
CREATE TABLE workflow_configurations (
  id SERIAL PRIMARY KEY,
  developer_id INTEGER REFERENCES developer_accounts(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  industry TEXT NOT NULL,
  use_case TEXT NOT NULL,
  workflow_steps JSONB NOT NULL,
  rules JSONB DEFAULT '{}',
  triggers JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  is_template BOOLEAN DEFAULT false,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Industry Templates

```sql
CREATE TABLE industry_templates (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT NOT NULL,
  use_case TEXT NOT NULL,
  description TEXT,
  workflow_steps JSONB NOT NULL,
  default_rules JSONB DEFAULT '{}',
  recommended_settings JSONB DEFAULT '{}',
  documentation TEXT,
  code_examples JSONB DEFAULT '[]',
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Webhook Configurations

```sql
CREATE TABLE webhook_configurations (
  id SERIAL PRIMARY KEY,
  developer_id INTEGER REFERENCES developer_accounts(id) NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  secret TEXT NOT NULL,
  events JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  retry_policy JSONB DEFAULT '{"maxRetries": 3, "backoff": "exponential"}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Webhook Deliveries

```sql
CREATE TABLE webhook_deliveries (
  id SERIAL PRIMARY KEY,
  webhook_id INTEGER REFERENCES webhook_configurations(id) NOT NULL,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT DEFAULT 'pending', -- pending, delivered, failed
  status_code INTEGER,
  response_body TEXT,
  attempt_number INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  delivered_at TIMESTAMP
);
```

---

## Backend Implementation

### API Routes Structure

All developer routes are in `server/routes/developer.ts`:

```typescript
// Developer Account Management
GET    /api/developer/account              # Get developer account
POST   /api/developer/account              # Create developer account

// API Key Management
GET    /api/developer/api-keys             # List API keys
POST   /api/developer/api-keys             # Create API key
DELETE /api/developer/api-keys/:id          # Revoke API key

// Workflow Management
GET    /api/developer/workflows             # List workflows
GET    /api/developer/workflows/:id         # Get workflow
POST   /api/developer/workflows             # Create workflow
PUT    /api/developer/workflows/:id         # Update workflow
DELETE /api/developer/workflows/:id         # Delete workflow
GET    /api/developer/workflows/metrics    # Get workflow metrics

// Industry Templates
GET    /api/developer/templates             # List templates
GET    /api/developer/templates/:id         # Get template
POST   /api/developer/templates/:id/create-workflow  # Create workflow from template

// Webhook Management
GET    /api/developer/webhooks              # List webhooks
GET    /api/developer/webhooks/:id          # Get webhook
POST   /api/developer/webhooks              # Create webhook
PUT    /api/developer/webhooks/:id          # Update webhook
DELETE /api/developer/webhooks/:id         # Delete webhook
GET    /api/developer/webhooks/:id/deliveries  # Get delivery logs
POST   /api/developer/webhooks/:id/retry   # Retry failed delivery

// Analytics & Usage
GET    /api/developer/usage/stats           # Get usage statistics
GET    /api/developer/usage/logs            # Get usage logs
GET    /api/developer/performance           # Get performance metrics
```

### Admin Endpoints

```typescript
// Admin Developer Account Management
PATCH  /api/admin/developer-accounts/:id/status  # Update account status
GET    /api/admin/developer-accounts             # List all accounts
```

### Service Layer

#### WorkflowService (`server/services/workflow-service.ts`)

**Methods:**
- `createWorkflow()` - Create new workflow
- `getWorkflow()` - Get workflow by ID
- `listWorkflows()` - List workflows with filters
- `updateWorkflow()` - Update workflow
- `deleteWorkflow()` - Delete workflow
- `createFromTemplate()` - Create workflow from template
- `getMetrics()` - Get workflow execution metrics

#### WebhookService (`server/services/webhook-service.ts`)

**Methods:**
- `createWebhook()` - Create webhook configuration
- `getWebhook()` - Get webhook by ID
- `listWebhooks()` - List webhooks for developer
- `updateWebhook()` - Update webhook
- `deleteWebhook()` - Delete webhook
- `deliverWebhook()` - Deliver webhook event
- `retryDelivery()` - Retry failed delivery
- `generateSignature()` - Generate webhook signature
- `verifySignature()` - Verify webhook signature
- `listDeliveries()` - Get delivery logs

### Storage Layer

All storage methods are in `server/storage.ts`:

**Developer Account Methods:**
- `createDeveloperAccount()` - Create account (supports status and approvedAt)
- `getDeveloperAccountByUserId()` - Get account by user ID
- `getDeveloperAccount()` - Get account by ID
- `updateDeveloperAccountStatus()` - Update account status

**Workflow Methods:**
- `createWorkflowConfiguration()`
- `getWorkflowConfiguration()`
- `listWorkflowConfigurations()`
- `updateWorkflowConfiguration()`
- `deleteWorkflowConfiguration()`

**Template Methods:**
- `createIndustryTemplate()`
- `getIndustryTemplate()`
- `listIndustryTemplates()`
- `updateIndustryTemplate()`

**Webhook Methods:**
- `createWebhookConfiguration()`
- `getWebhookConfiguration()`
- `listWebhookConfigurations()`
- `updateWebhookConfiguration()`
- `deleteWebhookConfiguration()`
- `createWebhookDelivery()`
- `listWebhookDeliveries()`
- `updateWebhookDelivery()`

---

## Frontend Implementation

### Component Structure

```
client/src/screens/DeveloperPortal/
├── DeveloperPortal.tsx              # Main portal container
├── components/
│   ├── DeveloperAuth.tsx           # Account creation/login
│   ├── WorkflowBuilder.tsx         # Workflow builder with drag-and-drop
│   ├── TemplateGallery.tsx         # Industry template gallery
│   ├── ApiExplorer.tsx             # Interactive API testing
│   ├── WebhookManager.tsx          # Webhook configuration
│   ├── SDKManager.tsx              # SDK downloads
│   ├── EnhancedAnalytics.tsx      # Analytics dashboard
│   └── index.ts                    # Component exports
```

### Main Portal Component

**File**: `client/src/screens/DeveloperPortal/DeveloperPortal.tsx`

**Key Features:**
- Account status checking (approved/pending)
- Pending account banner
- Navigation sidebar
- Tab-based content switching
- API key management
- Dashboard metrics
- Trust Score Simulator
- API Sandbox

**State Management:**
- `hasDeveloperAccount` - Boolean indicating account exists
- `accountStatus` - Current account status (approved/pending)
- `checkingAccount` - Loading state for account check
- `activeNavItem` - Currently active navigation tab
- Various data states for API keys, workflows, analytics, etc.

### DeveloperAuth Component

**File**: `client/src/screens/DeveloperPortal/components/DeveloperAuth.tsx`

**Features:**
- Checks if user is logged in
- Checks developer account status
- Account creation form
- Status checking
- Redirects to portal for both approved and pending accounts
- Toast notifications

**Account Status Handling:**
- **Approved**: Full access to portal
- **Pending**: Access with limitations (yellow banner, disabled API key creation)
- **No Account**: Shows account creation form

### WorkflowBuilder Component

**File**: `client/src/screens/DeveloperPortal/components/WorkflowBuilder.tsx`

**Features:**
- Create/edit workflows
- Drag-and-drop step reordering (@dnd-kit)
- Add/remove workflow steps
- Configure step parameters
- Industry and use case selection
- Step editor modal
- Save/load workflows
- Workflow validation

**Dependencies:**
- `@dnd-kit/core`
- `@dnd-kit/sortable`
- `@dnd-kit/utilities`

### TemplateGallery Component

**File**: `client/src/screens/DeveloperPortal/components/TemplateGallery.tsx`

**Features:**
- Browse industry templates
- Filter by industry/use case
- Search functionality
- Template detail view
- Code examples display
- One-click workflow creation
- Template preview

### WebhookManager Component

**File**: `client/src/screens/DeveloperPortal/components/WebhookManager.tsx`

**Features:**
- Create/edit webhooks
- Webhook list with status indicators
- Toggle active/inactive
- Event subscription management
- Delivery log viewer
- Filter deliveries by status
- Retry failed deliveries
- Copy webhook URL
- Delete webhooks

### SDKManager Component

**File**: `client/src/screens/DeveloperPortal/components/SDKManager.tsx`

**Features:**
- SDK list (JavaScript, Python, PHP, Ruby, Go)
- Version management display
- Installation commands
- Changelog viewer with tabs
- Documentation links
- Copy install commands

### EnhancedAnalytics Component

**File**: `client/src/screens/DeveloperPortal/components/EnhancedAnalytics.tsx`

**Features:**
- API usage statistics
- Success rate metrics
- Average response time
- Calls by endpoint
- Time range selector (24h, 7d, 30d, 90d)
- Visual charts and progress bars
- Workflow execution metrics
- Performance monitoring

### ApiExplorer Component

**File**: `client/src/screens/DeveloperPortal/components/ApiExplorer.tsx`

**Features:**
- Interactive API testing
- Multiple endpoint selection
- Request body editor
- Response viewer
- Example requests/responses
- Copy functionality
- Error handling

---

## Authentication & Authorization

### Developer Account Flow

1. **User Registration/Login**
   - User must be logged in to access portal
   - Uses existing authentication system

2. **Developer Account Creation**
   - User creates developer account via `DeveloperAuth` component
   - Account is **auto-approved** (status: 'approved', approvedAt: current timestamp)
   - User is immediately redirected to portal

3. **Account Status Handling**

   **Approved Accounts:**
   - Full access to all features
   - Can create API keys
   - Can create/edit workflows
   - Can configure webhooks
   - Full analytics access

   **Pending Accounts:**
   - Can access portal (with yellow banner)
   - Can view templates and documentation
   - Can explore API Explorer
   - **Cannot** create API keys (buttons disabled)
   - May have limited workflow/webhook creation (backend enforced)

4. **Admin Account Management**
   - Admins can update account status via API
   - Endpoint: `PATCH /api/admin/developer-accounts/:id/status`
   - Requires admin authentication

### Middleware

**requireDeveloperAuth** (`server/middleware/apiAuth.ts`):
- Checks if user is authenticated
- Verifies developer account exists
- Verifies account is approved (for API key operations)
- Attaches developer account to request

**requireAdmin** (`server/routes.ts`):
- Checks if user is authenticated
- Verifies user has admin privileges
- Used for admin-only endpoints

---

## API Reference

### Developer Account Endpoints

#### Get Developer Account
```http
GET /api/developer/account
Authorization: Cookie (session)
```

**Response:**
```json
{
  "id": 1,
  "userId": 123,
  "companyName": "Example Corp",
  "website": "https://example.com",
  "description": "Example description",
  "status": "approved",
  "monthlyQuota": 1000,
  "currentUsage": 0,
  "isVerified": false,
  "createdAt": "2025-01-15T10:00:00Z",
  "approvedAt": "2025-01-15T10:00:00Z",
  "approvedBy": null
}
```

#### Create Developer Account
```http
POST /api/developer/account
Content-Type: application/json
Authorization: Cookie (session)

{
  "companyName": "Example Corp",
  "website": "https://example.com",
  "description": "Example description"
}
```

**Response:** Same as Get Developer Account

### Workflow Endpoints

#### List Workflows
```http
GET /api/developer/workflows?industry=ecommerce&isActive=true
```

**Response:**
```json
[
  {
    "id": 1,
    "developerId": 123,
    "name": "E-commerce Checkout",
    "industry": "ecommerce",
    "useCase": "checkout",
    "workflowSteps": [...],
    "isActive": true,
    "version": 1
  }
]
```

#### Create Workflow
```http
POST /api/developer/workflows
Content-Type: application/json

{
  "name": "My Workflow",
  "description": "Workflow description",
  "industry": "ecommerce",
  "useCase": "checkout",
  "workflowSteps": [
    {
      "id": "step1",
      "name": "Fraud Check",
      "type": "fraud_check",
      "order": 1,
      "config": {}
    }
  ],
  "rules": {},
  "triggers": []
}
```

### Webhook Endpoints

#### Create Webhook
```http
POST /api/developer/webhooks
Content-Type: application/json

{
  "name": "Transaction Webhook",
  "url": "https://example.com/webhooks",
  "events": ["transaction.completed", "transaction.failed"],
  "isActive": true
}
```

**Response:**
```json
{
  "id": 1,
  "developerId": 123,
  "name": "Transaction Webhook",
  "url": "https://example.com/webhooks",
  "secret": "whsec_...",
  "events": ["transaction.completed", "transaction.failed"],
  "isActive": true,
  "createdAt": "2025-01-15T10:00:00Z"
}
```

#### Get Delivery Logs
```http
GET /api/developer/webhooks/:id/deliveries?limit=50
```

**Response:**
```json
[
  {
    "id": 1,
    "webhookId": 5,
    "eventType": "transaction.completed",
    "status": "delivered",
    "statusCode": 200,
    "attemptNumber": 1,
    "createdAt": "2025-01-15T10:05:00Z",
    "deliveredAt": "2025-01-15T10:05:01Z"
  }
]
```

---

## Component Details

### WorkflowBuilder - Drag and Drop

**Implementation:**
- Uses `@dnd-kit/core` for drag-and-drop
- `SortableContext` for sortable list
- `useSortable` hook for each step
- Visual feedback during drag

**Step Reordering:**
```typescript
const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;
  if (over && active.id !== over.id) {
    // Reorder steps
    const oldIndex = steps.findIndex(s => s.id === active.id);
    const newIndex = steps.findIndex(s => s.id === over.id);
    const newSteps = arrayMove(steps, oldIndex, newIndex);
    setSteps(newSteps);
  }
};
```

### WebhookManager - Delivery Tracking

**Features:**
- Real-time delivery status
- Filter by status (all, delivered, failed, pending)
- Retry failed deliveries
- View delivery payload
- Response body inspection

### EnhancedAnalytics - Metrics

**Metrics Tracked:**
- Total API calls
- Success rate percentage
- Average response time (ms)
- Calls by endpoint
- Calls over time (chart)
- Error rate
- P95/P99 response times

**Time Ranges:**
- Last 24 hours
- Last 7 days
- Last 30 days
- Last 90 days

---

## Industry Templates

### Available Templates

1. **E-commerce Checkout Flow**
   - Industry: E-commerce
   - Use Case: Checkout
   - Steps: Fraud Check → Optional KYC → Payment Processing

2. **E-commerce Dispute Resolution**
   - Industry: E-commerce
   - Use Case: Dispute Resolution
   - Steps: Dispute Creation → Evidence Collection → AI Arbitration → Resolution

3. **Fintech Account Opening**
   - Industry: Fintech
   - Use Case: Account Opening
   - Steps: Identity Verification → Document Verification → Risk Assessment → Activation

4. **Marketplace Escrow Transaction**
   - Industry: Marketplace
   - Use Case: Escrow
   - Steps: Escrow Hold → Delivery Confirmation → Fund Release

5. **Crypto Exchange KYC**
   - Industry: Cryptocurrency
   - Use Case: KYC
   - Steps: Identity Verification → Source of Funds → AML Screening → Approval

### Seeding Templates

```bash
cd server
npm run seed:templates
```

Or directly:
```bash
npx tsx scripts/seed-industry-templates.ts
```

---

## Webhook System

### Webhook Delivery Flow

1. **Event Occurs** (e.g., transaction completed)
2. **WebhookService** finds active webhooks subscribed to event
3. **Signature Generated** using HMAC-SHA256
4. **HTTP POST** sent to webhook URL with:
   - Headers: `X-TrustVerify-Signature`, `X-TrustVerify-Event`
   - Body: JSON payload
5. **Response Recorded** in `webhook_deliveries` table
6. **Retry Logic** if delivery fails (exponential backoff)

### Webhook Signature Verification

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(JSON.stringify(payload));
  const expectedSignature = hmac.digest('hex');
  return signature === expectedSignature;
}
```

### Retry Policy

- **Max Retries**: 3 (configurable)
- **Backoff**: Exponential (1s, 2s, 4s)
- **Retryable Status Codes**: 5xx, network errors
- **Non-retryable**: 4xx (client errors)

---

## Analytics & Monitoring

### Usage Statistics

**Endpoint**: `GET /api/developer/usage/stats`

**Metrics:**
- Total requests
- Successful requests
- Error requests
- Average response time
- Requests by endpoint
- Requests over time

### Performance Metrics

**Endpoint**: `GET /api/developer/performance`

**Metrics:**
- P95 response time
- P99 response time
- Throughput (requests/second)
- Error rate
- Success rate

---

## SDK Management

### Supported SDKs

1. **JavaScript/TypeScript**
   - Package: `@trustverify/sdk`
   - Install: `npm install @trustverify/sdk`

2. **Python**
   - Package: `trustverify-sdk`
   - Install: `pip install trustverify-sdk`

3. **PHP**
   - Package: `trustverify/php-sdk`
   - Install: `composer require trustverify/php-sdk`

4. **Ruby**
   - Package: `trustverify-ruby`
   - Install: `gem install trustverify-ruby`

5. **Go**
   - Package: `github.com/trustverify/go-sdk`
   - Install: `go get github.com/trustverify/go-sdk`

### Changelog Management

Each SDK has versioned changelogs displayed in the SDK Manager component, showing:
- Version number
- Release date
- New features
- Bug fixes
- Breaking changes

---

## Deployment Guide

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/trustverify

# Authentication
JWT_SECRET=your_jwt_secret_here
SESSION_SECRET=your_session_secret_here

# API
API_BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173

# Webhooks
WEBHOOK_SECRET_KEY=your_webhook_secret
```

### Database Setup

1. **Create Tables:**
```bash
cd server
npm run db:create-tables
```

2. **Seed Templates:**
```bash
npm run seed:templates
```

3. **Or Complete Setup:**
```bash
npm run db:setup
```

### Build and Run

**Development:**
```bash
# Backend
cd server
npm run dev

# Frontend
cd client
npm run dev
```

**Production:**
```bash
# Build frontend
cd client
npm run build

# Build backend
cd server
npm run build

# Start server
cd server
npm start
```

---

## Testing Guide

### Manual Testing Checklist

**Developer Account:**
- [ ] Create developer account
- [ ] Verify auto-approval
- [ ] Check pending account access
- [ ] Test account status update (admin)

**Workflows:**
- [ ] Create workflow
- [ ] Edit workflow
- [ ] Delete workflow
- [ ] Reorder steps (drag-and-drop)
- [ ] Create from template

**Templates:**
- [ ] Browse templates
- [ ] Filter by industry
- [ ] View template details
- [ ] Create workflow from template

**Webhooks:**
- [ ] Create webhook
- [ ] Update webhook
- [ ] Delete webhook
- [ ] View delivery logs
- [ ] Retry failed delivery

**Analytics:**
- [ ] View usage stats
- [ ] Check performance metrics
- [ ] Filter by time range

**SDK Manager:**
- [ ] View SDKs
- [ ] Copy install commands
- [ ] View changelogs

### API Testing

Use the API Explorer in the portal or tools like Postman/curl:

```bash
# Get developer account
curl -X GET http://localhost:5000/api/developer/account \
  -H "Cookie: connect.sid=YOUR_SESSION_COOKIE"

# Create workflow
curl -X POST http://localhost:5000/api/developer/workflows \
  -H "Content-Type: application/json" \
  -H "Cookie: connect.sid=YOUR_SESSION_COOKIE" \
  -d '{
    "name": "Test Workflow",
    "industry": "ecommerce",
    "useCase": "checkout",
    "workflowSteps": []
  }'
```

---

## Troubleshooting

### Common Issues

**1. "Developer account not found"**
- Ensure user is logged in
- Check if developer account exists in database
- Verify account status is "approved" or "pending"

**2. "Cannot create API key"**
- Account must be "approved" (not "pending")
- Check account status via API or database

**3. "Workflow not saving"**
- Verify workflow steps are valid JSON
- Check browser console for errors
- Ensure backend server is running

**4. "Webhook delivery failing"**
- Verify webhook URL is accessible
- Check webhook signature verification
- Review delivery logs for error details

**5. "Templates not loading"**
- Ensure templates are seeded: `npm run seed:templates`
- Check database connection
- Verify `industry_templates` table exists

### Database Issues

**Missing Tables:**
```bash
cd server
npm run db:create-tables
```

**Reset Database:**
```sql
-- Drop and recreate tables (CAUTION: Deletes all data)
DROP TABLE IF EXISTS webhook_deliveries;
DROP TABLE IF EXISTS webhook_configurations;
DROP TABLE IF EXISTS workflow_configurations;
DROP TABLE IF EXISTS industry_templates;

-- Then run create-tables script
```

---

## Additional Resources

### Documentation Files

- `DEVELOPER_PORTAL_IMPLEMENTATION.md` - Original implementation doc
- `DEVELOPER_PORTAL_COMPLETE.md` - Quick reference
- `DEVELOPER_PORTAL_SETUP.md` - Setup instructions
- `PENDING_ACCOUNT_REDIRECT.md` - Pending account handling
- `UPDATE_DEVELOPER_ACCOUNT_STATUS.md` - Admin guide

### Code Locations

**Backend:**
- Routes: `server/routes/developer.ts`
- Services: `server/services/workflow-service.ts`, `server/services/webhook-service.ts`
- Storage: `server/storage.ts`
- Schema: `server/shared/schema.ts`

**Frontend:**
- Main Portal: `client/src/screens/DeveloperPortal/DeveloperPortal.tsx`
- Components: `client/src/screens/DeveloperPortal/components/`

---

## Summary

The Developer Portal is **fully implemented** and **production-ready** with:

✅ Complete authentication and authorization  
✅ Auto-approval of developer accounts  
✅ Pending account support with limitations  
✅ Advanced workflow builder with drag-and-drop  
✅ Industry template gallery (5 templates)  
✅ Webhook management with delivery tracking  
✅ Enhanced analytics dashboard  
✅ SDK management with changelogs  
✅ Interactive API Explorer  
✅ Comprehensive documentation  

**Status**: ✅ **PRODUCTION READY**

---

**Document Version**: 2.0  
**Last Updated**: January 2025  
**Maintained By**: TrustVerify Development Team

