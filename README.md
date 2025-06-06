# ChronoBox - Digital Legacy Vault

ChronoBox is a secure digital legacy platform that allows users to preserve their memories, videos, and digital content for future generations with advanced encryption and scheduled releases.

## Tech Stack

- **Frontend**: Next.js 14 with React 18
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with credentials provider
- **Storage**: AWS S3 with KMS encryption
- **Deployment**: Optimized for Vercel/Netlify

## Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- AWS account (for S3 storage)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd chronobox-code
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/chronobox"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-here"

# AWS Configuration
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-aws-access-key-id"
AWS_SECRET_ACCESS_KEY="your-aws-secret-access-key"
S3_BUCKET_NAME="your-s3-bucket-name"
KMS_KEY_ID="your-kms-key-id"

# Public AWS Configuration (for client-side)
NEXT_PUBLIC_S3_BUCKET="your-s3-bucket-name"
NEXT_PUBLIC_AWS_REGION="us-east-1"
```

4. **Set up the database**
```bash
# Run database migrations
npx prisma migrate dev

# (Optional) Generate Prisma client
npx prisma generate

# (Optional) Open Prisma Studio to view data
npx prisma studio
```

5. **Start the development server**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── components/          # Reusable React components
├── contexts/           # React context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries and configurations
├── pages/              # Next.js pages and API routes
│   ├── api/            # API endpoints
│   │   ├── auth/       # Authentication endpoints
│   │   ├── memories/   # Memory management
│   │   ├── timeline/   # Timeline data
│   │   └── profile/    # User profile management
│   ├── auth/           # Authentication pages
│   └── dashboard/      # Dashboard pages
├── services/           # External service integrations
├── styles/             # Global styles
├── types/              # TypeScript type definitions
└── utils/              # Utility functions

prisma/
├── migrations/         # Database migrations
└── schema.prisma       # Database schema

public/                 # Static assets
```

## Core Features

### Memory Management
- **Secure Upload**: Upload videos and documents with AWS S3 + KMS encryption
- **Scheduled Release**: Set memories to be released at specific future dates
- **Privacy Controls**: Public/private memories with sharing capabilities
- **Categories**: Organize memories by type and category

### User Authentication
- **Secure Registration**: Email/password authentication with bcrypt
- **Profile Setup**: Complete profile with trusted contacts
- **Session Management**: JWT-based sessions with NextAuth.js

### Timeline & Discovery
- **Personal Timeline**: Chronological view of user's memories
- **Memory Feed**: Recent memories and updates
- **Shared Content**: Memories shared by trusted contacts

### Security Features
- **Encryption**: All sensitive data encrypted at rest and in transit
- **Access Control**: Role-based permissions for memory sharing
- **Trusted Contacts**: Designated users for legacy access

## Database Schema

Key models:
- **User**: User accounts with profile information
- **Video**: Stored memories/videos with metadata
- **UserTrust**: Many-to-many relationship for trusted contacts
- **TimelineEvent**: Activity tracking
- **ShareLink**: Temporary sharing links

## AWS Configuration

### S3 Bucket Setup
1. Create an S3 bucket for file storage
2. Configure CORS for web uploads
3. Set up lifecycle policies for cost management

### KMS Key Setup
1. Create a KMS key for encryption
2. Set appropriate permissions
3. Note the key ID for environment variables

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React best practices
- Use Tailwind CSS for styling
- Implement proper error handling

### Database Changes
- Create migrations with: `npx prisma migrate dev --name description`
- Always review migration files before applying
- Keep schema and migrations in sync

### API Development
- Follow RESTful conventions
- Implement proper authentication checks
- Use consistent error response format
- Add input validation with Zod

## Known Issues & Fixes Needed

1. **API Route Optimization**: Some endpoints return 404 - ensure all routes are properly configured
2. **Error Handling**: Standardize error response format across all APIs
3. **Type Safety**: Some components need better TypeScript typing
4. **Testing**: Add comprehensive test coverage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

[Add your license information here]

## Support

For issues and questions, please open a GitHub issue or contact the development team. # Development branch test
# Trigger development deploy
