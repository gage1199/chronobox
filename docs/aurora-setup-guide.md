# ChronoBox Aurora Database Setup Guide

## 🗄️ **AWS RDS Aurora Migration Guide**

This guide will help you migrate ChronoBox from your current database to AWS RDS Aurora MySQL for production-grade scalability, security, and Stripe integration.

## 📋 **Prerequisites**

1. **AWS Account** with appropriate permissions
2. **AWS CLI** installed and configured
3. **Node.js** and **npm** (already installed)
4. **MySQL client** (optional, for testing)

## 🚀 **Step 1: Deploy Aurora Infrastructure**

### **Option A: Using Our Script (Recommended)**

```bash
# Make script executable
chmod +x scripts/deploy-aurora.sh

# Deploy development environment
./scripts/deploy-aurora.sh dev

# Deploy staging environment  
./scripts/deploy-aurora.sh staging

# Deploy production environment
./scripts/deploy-aurora.sh prod
```

### **Option B: Manual AWS Console Setup**

1. Go to AWS RDS Console
2. Click "Create database"
3. Choose "Aurora MySQL-Compatible"
4. Configuration:
   ```
   Engine: Aurora MySQL 8.0.mysql_aurora.3.07.0
   DB cluster identifier: chronobox-aurora-dev
   Master username: chronobox_admin
   Master password: [Generate secure password]
   DB instance class: db.t3.medium (dev) / db.r6g.large (prod)
   ```

## 🔐 **Step 2: Environment Configuration**

### **Update your `.env` file:**

```env
# Database Configuration
DATABASE_URL="mysql://chronobox_admin:YOUR_PASSWORD@aurora-endpoint.region.rds.amazonaws.com:3306/chronobox"

# NextAuth Configuration  
NEXTAUTH_SECRET="your-nextauth-secret-32-chars-long"
NEXTAUTH_URL="http://localhost:3000"

# AWS Configuration (for S3 and KMS)
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="chronobox-storage-dev"
KMS_KEY_ID="your-kms-key-id"

# Stripe Configuration (for future integration)
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Scheduler API Key
SCHEDULER_API_KEY="your-scheduler-api-key"
```

## 🔄 **Step 3: Database Migration**

```bash
# 1. Generate Prisma client for MySQL
npx prisma generate

# 2. Apply schema to Aurora (creates tables)
npx prisma db push

# 3. Optionally, view your database
npx prisma studio
```

## 📊 **Step 4: Data Migration (if needed)**

If you have existing data, create a migration script:

```javascript
// scripts/migrate-to-aurora.js
const { PrismaClient: OldPrisma } = require('@prisma/client')
const { PrismaClient: NewPrisma } = require('@prisma/client')

// Configure old database connection
const oldDb = new OldPrisma({
  datasources: { db: { url: process.env.OLD_DATABASE_URL } }
})

// Configure new Aurora connection  
const newDb = new NewPrisma({
  datasources: { db: { url: process.env.DATABASE_URL } }
})

async function migrateData() {
  console.log('🔄 Starting data migration...')
  
  // Migrate users
  const users = await oldDb.user.findMany()
  for (const user of users) {
    await newDb.user.create({ data: user })
  }
  
  // Migrate videos
  const videos = await oldDb.video.findMany()
  for (const video of videos) {
    await newDb.video.create({ data: video })
  }
  
  console.log('✅ Migration completed!')
}

migrateData()
  .catch(console.error)
  .finally(() => {
    oldDb.$disconnect()
    newDb.$disconnect()
  })
```

## 🧪 **Step 5: Test Authentication**

1. **Restart your development server:**
   ```bash
   npm run dev
   ```

2. **Test user registration and login:**
   - Go to `http://localhost:3000`
   - Create a new account
   - Login with your credentials
   - Verify dashboard access

## 🔒 **Security Best Practices**

### **1. Network Security**
- Aurora is deployed in private subnets
- Security groups restrict access to application only
- No public internet access to database

### **2. Encryption**
- Storage encryption enabled with AWS KMS
- SSL/TLS encryption for data in transit
- Application-level encryption for sensitive files

### **3. Access Control**
- IAM roles for application access
- Secrets Manager for credential rotation
- Principle of least privilege

## 💳 **Stripe Integration Preparation**

Your Aurora schema is already prepared for Stripe with these models:

- **Subscription**: Tracks user subscriptions and billing
- **Payment**: Records all payment transactions  
- **StorageUsage**: Monitors usage for billing accuracy

## 📈 **Monitoring and Maintenance**

### **CloudWatch Metrics**
- Database performance metrics
- Connection pooling stats
- Query performance insights

### **Automated Backups**
- Point-in-time recovery enabled
- 7-day backup retention
- Cross-region backup replication (production)

## 🚨 **Troubleshooting**

### **Connection Issues**
```bash
# Test connection
mysql -h aurora-endpoint.region.rds.amazonaws.com -u chronobox_admin -p chronobox

# Check security group rules
aws ec2 describe-security-groups --group-ids sg-your-group-id
```

### **Migration Issues**
```bash
# Reset schema (development only!)
npx prisma db push --force-reset

# Regenerate Prisma client
npx prisma generate
```

### **Performance Optimization**
```sql
-- Check slow queries
SELECT * FROM mysql.slow_log ORDER BY start_time DESC LIMIT 10;

-- Monitor connections
SHOW PROCESSLIST;
```

## 📚 **Additional Resources**

- [AWS Aurora Documentation](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/)
- [Prisma with MySQL](https://www.prisma.io/docs/concepts/database-connectors/mysql)
- [NextAuth.js with Prisma](https://next-auth.js.org/adapters/prisma)

## 🆘 **Support**

If you encounter issues:
1. Check the AWS CloudFormation events for deployment errors
2. Review CloudWatch logs for application errors
3. Verify security group and VPC configurations
4. Test network connectivity from your application environment

---

**🎉 Congratulations!** Your ChronoBox application is now running on enterprise-grade AWS Aurora with full support for user authentication, file encryption, and future Stripe integration. 