#!/bin/bash

echo "🚀 Jagechas Deployment Helper"
echo "================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if git is initialized
if [ ! -d .git ]; then
    echo -e "${YELLOW}📦 Git not initialized. Initializing...${NC}"
    git init
    git add .
    git commit -m "Initial commit for deployment"
    echo -e "${GREEN}✅ Git initialized${NC}"
else
    echo -e "${GREEN}✅ Git already initialized${NC}"
fi

echo ""
echo -e "${BLUE}Step 1: Update .env.production with your Render URL${NC}"
echo "After deploying backend to Render, update client/.env.production"
echo "Replace YOUR_RENDER_URL with your actual Render URL"
echo ""
read -p "Have you updated client/.env.production? (y/n): " updated_env

if [ "$updated_env" != "y" ]; then
    echo -e "${YELLOW}⚠️  Please update client/.env.production first${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}Step 2: Test local build${NC}"
echo "Testing if the client builds successfully..."
cd client
if npm run build; then
    echo -e "${GREEN}✅ Client build successful${NC}"
else
    echo -e "${RED}❌ Client build failed. Fix errors before deploying${NC}"
    exit 1
fi
cd ..

echo ""
echo -e "${BLUE}Step 3: Commit all changes${NC}"
git add .
git commit -m "Ready for deployment" || echo "No changes to commit"

echo ""
echo -e "${GREEN}✅ Pre-deployment checks complete!${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Push to GitHub: git push origin main"
echo "2. Deploy backend on Render (see DEPLOYMENT_GUIDE.md)"
echo "3. Update client/.env.production with Render URL"
echo "4. Deploy frontend on Vercel (see DEPLOYMENT_GUIDE.md)"
echo ""
echo "For detailed instructions, see DEPLOYMENT_GUIDE.md"
