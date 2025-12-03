# Verification Guide - Admin Dashboard Stats Fix

This guide shows you how to verify that the storage methods and admin dashboard are working correctly.

## 1. Check TypeScript Compilation

First, verify that there are no TypeScript errors:

```bash
cd server
npm run check
```

This should compile without errors. If you see errors about `getUserCount`, `getActiveTransactionCount`, or `getPendingKycCount`, the fixes weren't applied correctly.

## 2. Test the API Endpoints Directly

### Start the Server

```bash
cd server
npm run dev
```

The server should start on `http://localhost:5000`

### Test Admin Stats Endpoint

You need to be authenticated as an admin. Here are a few ways to test:

#### Option A: Using curl (after logging in)

1. First, log in to get a session cookie:
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"your_username","password":"your_password"}' \
  -c cookies.txt
```

2. Then test the stats endpoint:
```bash
curl http://localhost:5000/api/admin/stats \
  -b cookies.txt
```

#### Option B: Using Browser DevTools

1. Open your browser and navigate to `http://localhost:5173` (frontend)
2. Log in to your account
3. Open DevTools (F12) → Network tab
4. Navigate to the admin dashboard (or manually call the API)
5. Look for the `/api/admin/stats` request
6. Check the response - it should return:
```json
{
  "totalUsers": 10,
  "activeTransactions": 5,
  "pendingKyc": 2,
  "securityAlerts": 0
}
```

#### Option C: Using Postman or Insomnia

1. Create a new request to `GET http://localhost:5000/api/admin/stats`
2. Add authentication (session cookie or Bearer token)
3. Send the request
4. Verify the response contains the stats

## 3. Test the Admin Dashboard UI

### Add the Route (if not already added)

Make sure the Admin Dashboard route is in `client/src/App.tsx`:

```typescript
import { AdminDashboard } from "./screens/AdminDashboard";

// In the Routes section:
<Route 
  path="/admin/dashboard" 
  element={
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  } 
/>
```

### Access the Dashboard

1. Start the frontend:
```bash
cd client
npm run dev
```

2. Navigate to `http://localhost:5173/admin/dashboard`
3. You should see:
   - Stats cards showing Total Users, Active Transactions, Pending KYC, Security Alerts
   - Navigation tabs (Overview, Users, Security, Logs, Settings)
   - Recent Activities section
   - Quick Actions section

## 4. Verify Storage Methods Work

### Test in Development Console

You can test the storage methods directly in Node.js:

```bash
cd server
node -e "
import('./storage.js').then(async ({ storage }) => {
  console.log('Total Users:', await storage.getUserCount());
  console.log('Active Transactions:', await storage.getActiveTransactionCount());
  console.log('Pending KYC:', await storage.getPendingKycCount());
});
"
```

### Check Database (if using PostgreSQL)

If you're using DatabaseStorage, you can verify the counts directly:

```sql
-- Total users
SELECT COUNT(*) FROM users;

-- Active transactions
SELECT COUNT(*) FROM transactions 
WHERE status IN ('pending', 'in_progress', 'escrow_held');

-- Pending KYC
SELECT COUNT(*) FROM kyc_verifications 
WHERE status = 'pending';
```

## 5. Check for Errors in Console

### Server Console

Watch the server console for any errors when accessing `/api/admin/stats`. You should see:
- No TypeScript errors
- No runtime errors
- Successful API calls logged

### Browser Console

Open browser DevTools → Console tab and check for:
- No JavaScript errors
- Successful API responses
- No network errors (404, 500, etc.)

## 6. Expected Behavior

### Successful Response

When you call `/api/admin/stats`, you should get:

```json
{
  "totalUsers": <number>,
  "activeTransactions": <number>,
  "pendingKyc": <number>,
  "securityAlerts": 0
}
```

### Error Responses

If you get errors, check:

1. **401 Unauthorized**: You're not logged in or session expired
   - Solution: Log in again

2. **403 Forbidden**: You don't have admin access
   - Solution: Check if your user has `isAdmin: true` or email contains `@trustverify.com`

3. **500 Internal Server Error**: Database or storage issue
   - Check server logs for detailed error
   - Verify database connection
   - Check if storage methods are implemented correctly

## 7. Quick Test Script

Create a test file `server/test-admin-stats.js`:

```javascript
import { storage } from './storage.js';

async function testAdminStats() {
  try {
    console.log('Testing admin stats methods...\n');
    
    const userCount = await storage.getUserCount();
    console.log('✓ getUserCount():', userCount);
    
    const activeTransactions = await storage.getActiveTransactionCount();
    console.log('✓ getActiveTransactionCount():', activeTransactions);
    
    const pendingKyc = await storage.getPendingKycCount();
    console.log('✓ getPendingKycCount():', pendingKyc);
    
    console.log('\n✅ All methods working correctly!');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testAdminStats();
```

Run it:
```bash
cd server
node test-admin-stats.js
```

## 8. Integration Test

You can also write a simple integration test:

```javascript
// server/tests/__tests__/integration/admin-stats.test.ts
import { storage } from '../../../storage';
import { describe, it, expect } from '@jest/globals';

describe('Admin Stats Methods', () => {
  it('should get user count', async () => {
    const count = await storage.getUserCount();
    expect(typeof count).toBe('number');
    expect(count).toBeGreaterThanOrEqual(0);
  });

  it('should get active transaction count', async () => {
    const count = await storage.getActiveTransactionCount();
    expect(typeof count).toBe('number');
    expect(count).toBeGreaterThanOrEqual(0);
  });

  it('should get pending KYC count', async () => {
    const count = await storage.getPendingKycCount();
    expect(typeof count).toBe('number');
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
```

Run the test:
```bash
cd server
npm test -- admin-stats
```

## Troubleshooting

### If methods still don't exist:

1. Check that `server/storage.ts` was saved correctly
2. Restart the TypeScript server in your IDE
3. Restart the development server
4. Clear TypeScript cache: `rm -rf node_modules/.cache`

### If you get "Cannot find module" errors:

1. Make sure you're in the correct directory (`server/`)
2. Run `npm install` to ensure dependencies are installed
3. Check that the file paths are correct

### If counts are always 0:

- This is normal if you're using a fresh database or MemStorage
- Create some test data:
  - Register a user
  - Create a transaction
  - Submit a KYC verification

