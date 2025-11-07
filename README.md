# Jagechas (MVP)

Jagechas — two-sided review analytics platform (MVP).

This repository contains a full-stack demo app:

- `server/` - Node.js + Express backend
- `client/` - React frontend (Create React App)

Quick start (local):

1. Install dependencies:
   - `cd server && npm install`
   - `cd ../client && npm install`
2. Configure environment variables in `server/.env` (MONGO_URI, JWT_SECRET, PORT)
3. Run backend: `cd server && node server.js`
4. Run frontend: `cd client && npm start`

Deploy notes: We recommend deploying the backend to Render or Fly and the frontend to Vercel.

Test credentials (seeded):
- admin@jagechas.com / password123

---
If you want, I can also create a `Dockerfile`, or help publish this repository to GitHub and deploy it.
# 🚀 Jagechas - Review Analytics Platform

A two-sided review analytics platform where users write reviews, earn points, and companies view insights.

## 🎯 Features

✅ **User Features**
- Write detailed product reviews (likes, dislikes, ratings)
- Earn 10 points for each review submitted
- View profile with points and review history
- Browse products by company

✅ **Company Features**
- View comprehensive analytics dashboard
- See rating trends and distribution charts
- Analyze top liked/disliked product aspects
- Track reviews over time

✅ **Admin Features**
- Manage companies, products, and users
- View platform statistics
- Create company accounts
- Monitor and moderate reviews

## 🛠️ Tech Stack

- **Frontend**: React.js + Tailwind CSS + Recharts
- **Backend**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT (JSON Web Token)
- **Styling**: Tailwind CSS with custom design system
- **Charts**: Recharts for data visualization

## 📂 Project Structure

```
jagechas/
├── client/                 # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components (Navbar)
│   │   ├── context/       # AuthContext for global state
│   │   ├── pages/         # Page components
│   │   ├── utils/         # API utilities
│   │   └── App.jsx
│   └── package.json
├── server/                # Express Backend
│   ├── controllers/       # Business logic
│   ├── middleware/        # Authentication middleware
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── server.js         # Entry point
│   ├── seed.js           # Database seeder
│   └── .env              # Environment variables
├── package.json          # Root package
├── README.md
├── SETUP.md              # Detailed setup guide
└── MONGODB_SETUP.md      # MongoDB installation guide
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - Local installation OR MongoDB Atlas account
  - See `MONGODB_SETUP.md` for installation instructions

### Installation Steps

1. **Install Dependencies**
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
cd ..
```

2. **Setup MongoDB**
   - **Option A (Cloud)**: Follow instructions in `MONGODB_SETUP.md` to setup MongoDB Atlas
   - **Option B (Local)**: Install MongoDB locally (see `MONGODB_SETUP.md`)

3. **Configure Environment Variables**

The `.env` file already exists in `server/` folder. Update if needed:
```env
MONGO_URI=mongodb://localhost:27017/jagechas
JWT_SECRET=jagechas_secret_key_2025_secure
PORT=5000
```

For MongoDB Atlas, update `MONGO_URI` with your connection string.

4. **Seed the Database**
```bash
cd server
node seed.js
```

This creates test data including:
- Admin account
- 3 companies (HUL, Dabur, ITC)
- 9 products
- 3 test users with sample reviews

5. **Start Development Servers**
```bash
# From root directory
npm run dev
```

This starts:
- Backend server on http://localhost:5000
- Frontend React app on http://localhost:3000

6. **Access the Application**

Open http://localhost:3000 in your browser

## 🔑 Test Credentials

### 👨‍💼 Admin Account
```
Email: admin@jagechas.com
Password: password123
```
**Access**: Full admin panel, all features

### 🏢 Company Accounts
```
HUL:   company@hul.com / password123
Dabur: company@dabur.com / password123
ITC:   company@itc.com / password123
```
**Access**: Company analytics dashboard

### 👤 Regular Users
```
User 1: rahul@example.com / password123 (30 points)
User 2: priya@example.com / password123 (20 points)
User 3: amit@example.com / password123 (10 points)
```
**Access**: Write reviews, view profile

## 📝 API Endpoints

### Authentication
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User/Company/Admin login

### Reviews
- POST `/api/reviews/add` - Submit review (requires auth)
- GET `/api/reviews/user/:userId` - Get user's reviews

### Companies
- GET `/api/companies` - Get all companies
- GET `/api/companies/:id/insights` - Get company insights (requires company auth)
- POST `/api/companies/add` - Add company (requires admin auth)

### Products
- GET `/api/products` - Get all products
- GET `/api/products/company/:companyId` - Get products by company
- POST `/api/products/add` - Add product (requires admin auth)

### Admin
- GET `/api/admin/users` - Get all users
- GET `/api/admin/reviews` - Get all reviews
- DELETE `/api/admin/reviews/:id` - Delete review

## 🎨 Design Theme

- **Colors**: Deep Blue (#1e3a8a) & Lime Green (#84cc16)
- **Font**: Inter/Poppins
- **Style**: Modern, clean cards with shadows

## 🧪 Testing Flow

1. Register as a new user
2. Browse companies and products
3. Submit a review (earn 10 points)
4. View your profile and points
5. Login as company to view dashboard
6. Login as admin to manage data

## 🚢 Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
# Deploy to Vercel
```

### Backend (Render)
- Push to GitHub
- Connect to Render
- Add environment variables
- Deploy

## 📄 License

MIT License

## 👨‍💻 Developer

Built with ❤️ for Jagechas MVP
