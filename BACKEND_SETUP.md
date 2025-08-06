# DocStart Backend Setup Guide

## Overview
This backend provides a complete API for the DocStart documentation platform with authentication, project management, document handling, and subscription features.

## Features
- 🔐 **Authentication**: NextAuth.js with email/password and social providers
- 📊 **Database**: PostgreSQL with Prisma ORM
- 📝 **Documents**: Markdown support with real-time editing
- 👥 **Team Collaboration**: Role-based access control
- 💳 **Subscriptions**: Stripe integration for billing
- 📧 **Email**: Nodemailer for notifications
- ✅ **Validation**: Zod schema validation
- 🛡️ **Security**: Middleware protection and input sanitization

## Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Stripe account (for payments)
- Email service (Gmail, SendGrid, etc.)

## Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="postgresql://neondb_owner:npg_uRzZOTp3f0CU@ep-ancient-water-aed8lthb-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Email
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Open Prisma Studio
npm run db:studio
```

### 4. Start Development Server
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/auth/session` - Get current session

### Projects
- `GET /api/projects` - List user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/[id]` - Get project details
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

### Documents
- `GET /api/projects/[projectId]/documents` - List project documents
- `POST /api/projects/[projectId]/documents` - Create document
- `GET /api/documents/[id]` - Get document
- `PUT /api/documents/[id]` - Update document
- `DELETE /api/documents/[id]` - Delete document

### Comments
- `GET /api/documents/[documentId]/comments` - List comments
- `POST /api/documents/[documentId]/comments` - Add comment
- `DELETE /api/comments/[id]` - Delete comment

### Subscriptions
- `POST /api/subscriptions/create` - Create subscription
- `POST /api/subscriptions/webhook` - Stripe webhook
- `GET /api/subscriptions/status` - Get subscription status

## Database Schema

### Core Tables
- **users**: User accounts and profiles
- **projects**: Documentation projects
- **documents**: Individual documentation pages
- **comments**: Document comments and feedback
- **project_members**: Team collaboration
- **activities**: User activity tracking

### Relationships
- Users can own multiple projects
- Projects can have multiple documents
- Documents can have multiple comments
- Projects can have multiple team members

## Security Features
- JWT-based authentication
- Role-based access control
- Input validation with Zod
- SQL injection prevention (Prisma)
- XSS protection
- CSRF protection

## Development Workflow

### Adding New Features
1. Update Prisma schema if needed
2. Create API routes in `app/api/`
3. Add validation schemas
4. Update TypeScript types
5. Test with Postman/Thunder Client

### Database Migrations
```bash
# Create migration
npx prisma migrate dev --name feature_name

# Apply migrations
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

## Deployment

### Vercel (Recommended)
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

### Other Platforms
- Ensure PostgreSQL database is available
- Set all environment variables
- Run `npm run build` and `npm start`

## Monitoring & Logging
- API errors are logged to console
- Database queries are logged in development
- Stripe webhook events are tracked
- User activity is recorded

## Testing
```bash
# Run tests (when implemented)
npm test

# API testing with Thunder Client
# Import the provided collection file
```

## Support
For issues and questions:
1. Check the logs in development
2. Verify environment variables
3. Test database connection
4. Review API documentation

## Next Steps
- [ ] Add comprehensive testing
- [ ] Implement real-time collaboration
- [ ] Add file upload functionality
- [ ] Create admin dashboard
- [ ] Add analytics tracking 