# TrustVerify Upgrade - Complete Platform

This is the upgraded version of TrustVerify with a new modern UI/UX design while maintaining all backend features, APIs, and database connections from the original TrustVerify project.

## Features

### Frontend (New UI/UX Design)
- Modern React-based UI with Shadcn components
- Responsive design with Tailwind CSS
- All original screens and features with upgraded design

### Backend (Complete Feature Set)
- Express.js REST API
- PostgreSQL database with Drizzle ORM
- Authentication system (Passport.js with local and Google OAuth)
- Security middleware (rate limiting, XSS protection, SQL injection prevention)
- KYC verification system
- Transaction and escrow management
- Dispute resolution system
- Scam reporting
- Developer portal with API key management
- Audit logging and compliance (GDPR, KYC/AML, SOC2)

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database
- SendGrid account (for emails, optional)
- Google OAuth credentials (optional)

### Installation

1. Install frontend dependencies (from the project root):
```bash
npm install
```

2. Install backend dependencies:
```bash
cd server
npm install
```

3. Set up environment variables:
Create a `.env` file inside the `server/` directory:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/trustverify
SESSION_SECRET=your-secure-session-secret-min-32-chars
SENDGRID_API_KEY=your-sendgrid-key (optional)
GOOGLE_CLIENT_ID=your-google-client-id (optional)
GOOGLE_CLIENT_SECRET=your-google-client-secret (optional)
PORT=5000
```

4. Set up the database (run inside `server/`):
```bash
npm run db:push
```

5. Start development servers (use separate terminals):

Frontend:
```bash
npm run dev
```

Backend:
```bash
cd server
npm run dev
```

This starts:
- Frontend on http://localhost:5173
- Backend on http://localhost:5000

## Project Structure

```
Trust-Verify-Upgrade/
├── server/              # Backend Express.js server
│   ├── middleware/     # Validation and API auth
│   ├── routes/         # API route handlers
│   ├── security/       # Security modules
│   └── ...
├── shared/             # Shared database schema
├── src/                # Frontend React application
│   ├── components/     # UI components
│   ├── screens/        # Page components
│   └── ...
└── ...
```

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user

### Transactions
- `POST /api/transactions` - Create transaction
- `GET /api/transactions` - Get user transactions
- `GET /api/transactions/:id` - Get transaction details
- `PATCH /api/transactions/:id/status` - Update transaction status

### KYC
- `POST /api/kyc/submit` - Submit KYC verification
- `GET /api/kyc/status` - Get KYC status

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/:transactionId` - Get transaction messages

### Developer Portal
- `GET /api/developer/account` - Get developer account
- `POST /api/developer/api-keys` - Create API key
- `GET /api/developer/api-keys` - List API keys

See the original TrustVerify documentation for complete API reference.

## Development

### Frontend Development
```bash
npm run dev
```

### Backend Development
```bash
cd server
npm run dev
```

### Build for Production

Frontend:
```bash
npm run build
```

Backend:
```bash
cd server
npm run build
npm start   # serves the API and, after you copy the built frontend, static assets
```

## Important Notes

- The new UI/UX design is preserved in all frontend components
- All backend features from TrustVerify are fully integrated
- Database schema matches the original TrustVerify project
- API endpoints remain compatible with the original implementation

## License

MIT


