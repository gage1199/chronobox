#!/bin/bash

# ChronoBox Aurora Deployment Script
set -e

echo "🚀 ChronoBox Aurora Database Deployment"
echo "======================================="

# Configuration
STACK_NAME="chronobox-aurora"
ENVIRONMENT=${1:-"dev"}
REGION=${AWS_DEFAULT_REGION:-"us-east-1"}
TEMPLATE_PATH="infrastructure/aurora-setup.yml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if ! command -v aws &> /dev/null; then
        log_error "AWS CLI not installed. Please install AWS CLI first."
        exit 1
    fi
    
    if ! aws sts get-caller-identity &> /dev/null; then
        log_error "AWS CLI not configured. Please run 'aws configure' first."
        exit 1
    fi
    
    if [ ! -f "$TEMPLATE_PATH" ]; then
        log_error "CloudFormation template not found at $TEMPLATE_PATH"
        exit 1
    fi
    
    log_info "Prerequisites check passed ✅"
}

# Generate secure password
generate_password() {
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-25
}

# Deploy Aurora
deploy_aurora() {
    log_info "Deploying Aurora cluster for environment: $ENVIRONMENT"
    
    # Generate secure password
    DB_PASSWORD=$(generate_password)
    
    # Deploy CloudFormation stack
    aws cloudformation deploy \
        --template-file "$TEMPLATE_PATH" \
        --stack-name "$STACK_NAME-$ENVIRONMENT" \
        --parameter-overrides \
            Environment="$ENVIRONMENT" \
            DatabaseName="chronobox" \
            MasterUsername="chronobox_admin" \
            MasterPassword="$DB_PASSWORD" \
        --capabilities CAPABILITY_IAM \
        --region "$REGION" \
        --no-fail-on-empty-changeset
    
    if [ $? -eq 0 ]; then
        log_info "Aurora deployment completed successfully! 🎉"
        
        # Get outputs
        AURORA_ENDPOINT=$(aws cloudformation describe-stacks \
            --stack-name "$STACK_NAME-$ENVIRONMENT" \
            --region "$REGION" \
            --query 'Stacks[0].Outputs[?OutputKey==`AuroraClusterEndpoint`].OutputValue' \
            --output text)
        
        # Create DATABASE_URL
        DATABASE_URL="mysql://chronobox_admin:$DB_PASSWORD@$AURORA_ENDPOINT:3306/chronobox"
        
        echo ""
        echo "📋 Database Connection Details:"
        echo "==============================="
        echo "Environment: $ENVIRONMENT"
        echo "Aurora Endpoint: $AURORA_ENDPOINT"
        echo "Database Name: chronobox"
        echo "Username: chronobox_admin"
        echo "Password: $DB_PASSWORD"
        echo ""
        echo "🔐 Add this to your .env file:"
        echo "DATABASE_URL=\"$DATABASE_URL\""
        echo ""
        log_warn "⚠️  Save the password securely - it won't be shown again!"
        
    else
        log_error "Aurora deployment failed!"
        exit 1
    fi
}

# Main execution
main() {
    echo "Environment: $ENVIRONMENT"
    echo "Region: $REGION"
    echo "Stack Name: $STACK_NAME-$ENVIRONMENT"
    echo ""
    
    check_prerequisites
    deploy_aurora
    
    log_info "Next steps:"
    echo "1. Update your .env file with the DATABASE_URL above"
    echo "2. Run: npm install mysql2"
    echo "3. Run: npx prisma generate"
    echo "4. Run: npx prisma db push"
    echo "5. Test your application!"
}

# Show usage if no arguments
if [ "$#" -eq 0 ]; then
    echo "Usage: $0 [environment]"
    echo "Example: $0 dev"
    echo "Example: $0 staging"
    echo "Example: $0 prod"
    echo ""
    main "dev"
else
    main "$1"
fi 