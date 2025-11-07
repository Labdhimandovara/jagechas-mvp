# MongoDB Setup Options

## Option 1: Use MongoDB Atlas (Cloud - Recommended for Quick Start)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (free tier available)
4. Click "Connect" on your cluster
5. Choose "Connect your application"
6. Copy the connection string
7. Update `server/.env` with your connection string:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/jagechas?retryWrites=true&w=majority
```

Replace:
- `username` with your MongoDB Atlas username
- `password` with your MongoDB Atlas password
- `cluster` with your cluster name

## Option 2: Install MongoDB Locally

### macOS (using Homebrew)

```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community@7.0

# Start MongoDB
brew services start mongodb-community@7.0

# Verify it's running
brew services list
```

### Windows

1. Download MongoDB from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Run the installer
3. MongoDB will start automatically as a Windows service

### Linux (Ubuntu/Debian)

```bash
# Import MongoDB GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package list
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

## Quick Test: MongoDB Atlas Setup

If you want to proceed immediately without local MongoDB:

1. The project is configured to work with MongoDB Atlas by default
2. You just need to update the `MONGO_URI` in `server/.env`
3. Once updated, run the seed script to populate data

## Verify Connection

After setting up MongoDB (local or Atlas), test the connection:

```bash
cd server
node -e "const mongoose = require('mongoose'); require('dotenv').config(); mongoose.connect(process.env.MONGO_URI).then(() => { console.log('✅ MongoDB Connected!'); process.exit(0); }).catch(err => { console.error('❌ Error:', err.message); process.exit(1); });"
```

This should output "✅ MongoDB Connected!" if everything is set up correctly.
