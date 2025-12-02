# Testing Guide

This directory contains all tests for the TrustVerify backend.

## Test Structure

```
tests/
├── __tests__/
│   ├── unit/              # Unit tests
│   │   ├── utils.test.ts
│   │   ├── repositories/
│   │   ├── services/
│   │   └── middleware/
│   └── integration/       # Integration tests
│       ├── api/
│       └── database/
├── security/              # Security tests
├── load/                   # Load tests (k6)
├── performance/            # Performance tests
├── helpers/                # Test helpers
└── setup.ts               # Test setup file
```

## Running Tests

### All Tests
```bash
npm test
```

### Unit Tests Only
```bash
npm run test:unit
```

### Integration Tests Only
```bash
npm run test:integration
```

### Security Tests
```bash
npm run test:security
```

### With Coverage
```bash
npm run test:coverage
```

### Watch Mode
```bash
npm run test:watch
```

## Test Environment

Tests use a separate test database. Set `TEST_DATABASE_URL` in `.env.test`:

```env
TEST_DATABASE_URL=postgresql://test:test@localhost:5432/trustverify_test
NODE_ENV=test
```

## Writing Tests

### Unit Test Example
```typescript
import { MyService } from '../../services/my-service';

describe('MyService', () => {
  it('should do something', () => {
    const result = MyService.doSomething();
    expect(result).toBe(expected);
  });
});
```

### Integration Test Example
```typescript
import request from 'supertest';
import { app } from '../../index';

describe('API Endpoint', () => {
  it('should return data', async () => {
    const response = await request(app)
      .get('/api/endpoint')
      .expect(200);
    
    expect(response.body).toHaveProperty('data');
  });
});
```

## Test Helpers

Use test helpers from `tests/helpers/test-helpers.ts`:

```typescript
import { createTestUser, deleteTestUser } from '../helpers/test-helpers';

const user = await createTestUser();
// ... test code ...
await deleteTestUser(user.id);
```

## Coverage

Coverage reports are generated in `coverage/` directory. Open `coverage/index.html` to view.

## Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Clean up test data after tests
3. **Mocking**: Mock external dependencies
4. **Naming**: Use descriptive test names
5. **Arrange-Act-Assert**: Follow AAA pattern

