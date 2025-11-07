#!/bin/bash

# MongoDB Atlas Setup Helper Script
# This script helps you configure MongoDB Atlas for Jagechas

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     🌥️  JAGECHAS - MongoDB Atlas Setup Helper            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

echo "Follow these steps to set up MongoDB Atlas:"
echo ""

echo "📋 STEP 1: Create MongoDB Atlas Account"
echo "----------------------------------------"
echo "1. Open this URL in your browser:"
echo "   👉 https://www.mongodb.com/cloud/atlas/register"
echo ""
echo "2. Sign up (it's FREE!)"
echo "   - Use email, Google, or GitHub"
echo ""
read -p "Press ENTER when you've created your account..."
echo ""

echo "📋 STEP 2: Create Free Cluster"
echo "-------------------------------"
echo "1. Click 'Build a Database' or 'Create'"
echo "2. Select 'M0 FREE' tier (no credit card needed)"
echo "3. Choose a cloud provider and region (AWS recommended)"
echo "4. Name your cluster (or keep default)"
echo "5. Click 'Create Cluster' (takes 3-5 minutes)"
echo ""
read -p "Press ENTER when your cluster is created..."
echo ""

echo "📋 STEP 3: Create Database User"
echo "--------------------------------"
echo "1. Go to 'Database Access' in left sidebar"
echo "2. Click 'Add New Database User'"
echo "3. Choose 'Password' authentication"
echo "4. Username: jagechas-admin (or your choice)"
echo "5. Click 'Autogenerate Secure Password'"
echo "6. ⚠️  IMPORTANT: Copy and save this password!"
echo "7. Set privileges to 'Atlas admin'"
echo "8. Click 'Add User'"
echo ""
read -p "Have you copied the password? Press ENTER to continue..."
echo ""

echo "📋 STEP 4: Whitelist IP Address"
echo "--------------------------------"
echo "1. Go to 'Network Access' in left sidebar"
echo "2. Click 'Add IP Address'"
echo "3. Click 'Allow Access from Anywhere' (for development)"
echo "4. Click 'Confirm'"
echo ""
read -p "Press ENTER when IP is whitelisted..."
echo ""

echo "📋 STEP 5: Get Connection String"
echo "---------------------------------"
echo "1. Go to 'Database' in left sidebar"
echo "2. Click 'Connect' button on your cluster"
echo "3. Choose 'Connect your application'"
echo "4. Driver: Node.js, Version: 5.5 or later"
echo "5. Copy the connection string"
echo ""
echo "Your connection string looks like:"
echo "mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority"
echo ""
read -p "Have you copied the connection string? Press ENTER..."
echo ""

echo "📋 STEP 6: Configure Your Project"
echo "----------------------------------"
echo ""
echo "Now I need your connection details:"
echo ""

read -p "Enter your database USERNAME (e.g., jagechas-admin): " DB_USERNAME
read -sp "Enter your database PASSWORD (hidden): " DB_PASSWORD
echo ""
read -p "Enter your CLUSTER address (e.g., cluster0.xxxxx.mongodb.net): " DB_CLUSTER
echo ""

# Construct the connection string
MONGO_URI="mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_CLUSTER}/jagechas?retryWrites=true&w=majority"

echo ""
echo "✅ Generated Connection String:"
echo "$MONGO_URI"
echo ""

# Update .env file
ENV_FILE="/Users/uditjainnnn/Jagechas/server/.env"

echo "Updating $ENV_FILE..."
cat > "$ENV_FILE" << EOF
MONGO_URI=$MONGO_URI
JWT_SECRET=jagechas_secret_key_2025_secure
PORT=5000
NODE_ENV=development
EOF

echo "✅ .env file updated successfully!"
echo ""

echo "📋 STEP 7: Test Connection"
echo "---------------------------"
read -p "Press ENTER to test MongoDB connection..."
echo ""

cd /Users/uditjainnnn/Jagechas/server
node -e "const mongoose = require('mongoose'); require('dotenv').config(); mongoose.connect(process.env.MONGO_URI).then(() => { console.log('✅ MongoDB Atlas Connected Successfully!'); process.exit(0); }).catch(err => { console.error('❌ Connection Error:', err.message); console.log('\nPlease check your credentials and try again.'); process.exit(1); });"

if [ $? -eq 0 ]; then
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║     🎉 SUCCESS! MongoDB Atlas is connected!               ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    echo "📋 STEP 8: Seed the Database"
    echo "----------------------------"
    read -p "Press ENTER to populate test data (admin, companies, products)..."
    echo ""
    node seed.js
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "╔════════════════════════════════════════════════════════════╗"
        echo "║     ✅ ALL DONE! Your database is ready!                  ║"
        echo "╚════════════════════════════════════════════════════════════╝"
        echo ""
        echo "🚀 Next Steps:"
        echo "-------------"
        echo "1. Start the application:"
        echo "   cd /Users/uditjainnnn/Jagechas"
        echo "   npm run dev"
        echo ""
        echo "2. Open in browser:"
        echo "   http://localhost:3000"
        echo ""
        echo "3. Test login credentials:"
        echo "   Admin: admin@jagechas.com / password123"
        echo "   User:  rahul@example.com / password123"
        echo "   Company: company@hul.com / password123"
        echo ""
        echo "📚 For more info, see MONGODB_ATLAS_SETUP.md"
        echo ""
    else
        echo ""
        echo "⚠️  Seed failed. Check the error above."
    fi
else
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║     ❌ Connection Failed                                   ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""
    echo "🔧 Troubleshooting:"
    echo "------------------"
    echo "1. Check your username and password"
    echo "2. Ensure IP is whitelisted (0.0.0.0/0)"
    echo "3. Wait if cluster is still being created"
    echo "4. Verify cluster address is correct"
    echo ""
    echo "📚 See MONGODB_ATLAS_SETUP.md for detailed help"
fi
