#!/bin/bash

# AWS Deployment Script for ANDIKA

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="andika"
AWS_REGION=${AWS_REGION:-"us-east-1"}
TERRAFORM_DIR="./deploy/aws/terraform"

echo -e "${GREEN}Starting AWS deployment for ${PROJECT_NAME}...${NC}"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}AWS CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if Terraform is installed
if ! command -v terraform &> /dev/null; then
    echo -e "${RED}Terraform is not installed. Please install it first.${NC}"
    exit 1
fi

# Login to AWS ECR
echo -e "${YELLOW}Logging into AWS ECR...${NC}"
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin $(aws sts get-caller-identity --query Account --output text).dkr.ecr.${AWS_REGION}.amazonaws.com

# Build and push backend image
echo -e "${YELLOW}Building and pushing backend image...${NC}"
cd backend
docker build -t ${PROJECT_NAME}-backend .
BACKEND_REPO_URI=$(aws ecr describe-repositories --repository-names ${PROJECT_NAME}-backend --region ${AWS_REGION} --query repositories[0].repositoryUri --output text 2>/dev/null || echo "")
if [ -z "$BACKEND_REPO_URI" ]; then
    BACKEND_REPO_URI=$(aws ecr create-repository --repository-name ${PROJECT_NAME}-backend --region ${AWS_REGION} --query repository.repositoryUri --output text)
fi
docker tag ${PROJECT_NAME}-backend:latest ${BACKEND_REPO_URI}:latest
docker push ${BACKEND_REPO_URI}:latest
cd ..

# Build and push frontend image
echo -e "${YELLOW}Building and pushing frontend image...${NC}"
cd frontend
docker build -t ${PROJECT_NAME}-frontend .
FRONTEND_REPO_URI=$(aws ecr describe-repositories --repository-names ${PROJECT_NAME}-frontend --region ${AWS_REGION} --query repositories[0].repositoryUri --output text 2>/dev/null || echo "")
if [ -z "$FRONTEND_REPO_URI" ]; then
    FRONTEND_REPO_URI=$(aws ecr create-repository --repository-name ${PROJECT_NAME}-frontend --region ${AWS_REGION} --query repository.repositoryUri --output text)
fi
docker tag ${PROJECT_NAME}-frontend:latest ${FRONTEND_REPO_URI}:latest
docker push ${FRONTEND_REPO_URI}:latest
cd ..

# Initialize Terraform
echo -e "${YELLOW}Initializing Terraform...${NC}"
cd ${TERRAFORM_DIR}
terraform init

# Plan Terraform
echo -e "${YELLOW}Planning Terraform changes...${NC}"
terraform plan -out=tfplan

# Apply Terraform
echo -e "${YELLOW}Applying Terraform changes...${NC}"
terraform apply tfplan

# Get outputs
echo -e "${GREEN}Deployment complete!${NC}"
echo -e "${YELLOW}Outputs:${NC}"
terraform output -json

cd ../..

echo -e "${GREEN}AWS deployment completed successfully!${NC}"
