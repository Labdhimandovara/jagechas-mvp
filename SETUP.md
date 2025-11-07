# 🚀 JAGECHAS - Complete Setup Guide

## 📋 Prerequisites

Before you begin, make sure you have the following installed:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - Either local installation or MongoDB Atlas account
  - Local: [Download MongoDB](https://www.mongodb.com/try/download/community)
  - Cloud: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** (optional, for version control)

## 🛠️ Installation Steps

### Step 1: Install Root Dependencies

```bash
cd Jagechas
npm install
```

### Step 2: Install Server Dependencies

```bash
cd server
npm install
```

### Step 3: Install Client Dependencies

```bash
cd ../client
npm install
```

### Step 4: Configure Environment Variables

The `.env` file is already created in the `server/` folder. Update it if needed:

```env
MONGO_URI=mongodb://localhost:27017/jagechas
JWT_SECRET=jagechas_secret_key_2025_secure
PORT=5000
NODE_ENV=development
```

**For MongoDB Atlas:**
Replace `MONGO_URI` with your Atlas connection string:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/jagechas?retryWrites=true&w=majority
```

### Step 5: Start MongoDB (if using local installation)

**macOS:**
```bash
brew services start mongodb-community
```

**Windows:**
MongoDB should start automatically, or run:
```
net start MongoDB
```

**Linux:**
```bash
sudo systemctl start mongod
```

### Step 6: Seed the Database

From the `server/` directory:

```bash
node seed.js
```

This will create:
- 1 Admin account
- 3 Company accounts (HUL, Dabur, ITC)
- 9 Products (3 per company)
- 3 Test users
- 10 Sample reviews

### Step 7: Start the Development Servers

From the **root** directory (`Jagechas/`):

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend React app on `http://localhost:3000`

## ✅ Verify Installation

1. Open your browser and go to `http://localhost:3000`
2. You should see the Jagechas homepage
3. Try logging in with test credentials (see below)

## 🔑 Test Credentials

### Admin Account
- Email: `admin@jagechas.com`
- Password: `password123`
- Access: Full admin panel, company dashboard

### Company Accounts
- **HUL**: `company@hul.com` / `password123`
- **Dabur**: `company@dabur.com` / `password123`
- **ITC**: `company@itc.com` / `password123`
- Access: Company analytics dashboard

### User Accounts
- **User 1**: `rahul@example.com` / `password123` (30 points)
- **User 2**: `priya@example.com` / `password123` (20 points)
- **User 3**: `amit@example.com` / `password123` (10 points)
- Access: Write reviews, view profile

## 🧪 Testing Workflow

### As a User:
1. Register a new account or login with existing user credentials
2. Browse companies and products on the homepage
3. Click "Write Review" on any product
4. Fill in the review form (liked, disliked, rating)
5. Submit and earn 10 points
6. View your profile to see points and past reviews

### As a Company:
1. Login with company credentials
2. View the analytics dashboard
3. See charts for:
   - Rating distribution
   - Top liked aspects
   - Top disliked aspects
   - Recent reviews
4. Filter by products

### As an Admin:
1. Login with admin credentials
2. Access the Admin Panel
3. View statistics, users, and all reviews
4. Add new companies and products
5. Create company accounts
6. Delete spam reviews

## 📁 Project Structure

```
Jagechas/
├── client/                 # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Navbar
│   │   ├── context/       # AuthContext
│   │   ├── pages/         # Home, Login, Register, etc.
│   │   ├── utils/         # API helper
│   │   ├── App.jsx
│   │   └── index.js
│   └── package.json
├── server/                # Express Backend
│   ├── controllers/       # Business logic
│   ├── middleware/        # Authentication
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── server.js         # Entry point
│   ├── seed.js           # Database seeder
│   └── .env              # Environment variables
├── package.json          # Root package
└── README.md
```

## 🔧 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongo --version

# On macOS, restart MongoDB
brew services restart mongodb-community

# Check connection string in .env
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Dependencies Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Do the same for client and server folders
```

## 🚀 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set build command: `cd client && npm run build`
4. Set output directory: `client/build`
5. Add environment variable: `REACT_APP_API_URL=your-backend-url`

### Backend (Render)
1. Push code to GitHub
2. Create new Web Service on Render
3. Set build command: `cd server && npm install`
4. Set start command: `cd server && node server.js`
5. Add environment variables from `.env`

## 📝 API Endpoints Summary

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `GET /api/companies` - Get all companies
- `GET /api/products` - Get all products
- `POST /api/reviews/add` - Submit review (authenticated)
- `GET /api/companies/:id/insights` - Company analytics
- `GET /api/admin/stats` - Admin dashboard stats

## 🎨 Features Implemented

✅ User registration and authentication  
✅ JWT-based authorization  
✅ Role-based access control (User, Company, Admin)  
✅ Review submission with point rewards  
✅ Company analytics dashboard with charts  
✅ Admin panel for managing data  
✅ Responsive design with Tailwind CSS  
✅ Real-time data visualization with Recharts  

## 📞 Support

If you encounter any issues:
1. Check the console for error messages
2. Verify MongoDB is running
3. Ensure all dependencies are installed
4. Check environment variables are correct

## 🎉 Congratulations!

Your Jagechas platform is now ready! Start testing all features and customizing as needed.
