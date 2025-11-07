# Jagechas MVP Deployment Guide

This guide will help you deploy your Jagechas application with:
- **Frontend (React)**: Vercel
- **Backend (Node.js/Express)**: Render
- **Database**: MongoDB Atlas (already configured)

## Prerequisites
- Vercel account (https://vercel.com)
- Render account (https://render.com)
- MongoDB Atlas connection string (you already have this)
- Git repository pushed to GitHub/GitLab/Bitbucket

---

## Step 1: Push Your Code to Git (if not already done)

```bash
# Initialize git if not done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit for deployment"

# Create a GitHub repository and push
git remote add origin <your-github-repo-url>
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend on Render

### 2.1 Create Web Service on Render

1. Go to https://render.com/dashboard
2. Click **"New +"** button → Select **"Web Service"**
3. Connect your GitHub/GitLab repository
4. Configure the service:
   - **Name**: `jagechas-api`
   - **Region**: Choose closest to you (e.g., Oregon)
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Runtime**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Plan**: Free

### 2.2 Add Environment Variables

In the Render dashboard, go to **Environment** section and add:

```
MONGO_URI=mongodb+srv://jagechas:1990%40Iamnothuman@jagechas.ypidfoi.mongodb.net/jagechas?retryWrites=true&w=majority&appName=Jagechas
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=production
PORT=10000
```

**Important**: Change `JWT_SECRET` to a strong random string!

### 2.3 Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (takes 2-5 minutes)
3. Once deployed, you'll get a URL like: `https://jagechas-api.onrender.com`
4. **Copy this URL** - you'll need it for frontend deployment

---

## Step 3: Deploy Frontend on Vercel

### 3.1 Install Vercel CLI (Optional but recommended)

```bash
npm install -g vercel
```

### 3.2 Update Frontend API URL

Before deploying, update the API URL in your React app:

1. Create `client/.env.production` file:

```bash
echo "REACT_APP_API_URL=https://your-render-url.onrender.com" > client/.env.production
```

Replace `your-render-url.onrender.com` with your actual Render URL.

2. Update axios configuration in your React app to use this environment variable.

### 3.3 Deploy to Vercel (Option A: Dashboard)

1. Go to https://vercel.com/dashboard
2. Click **"Add New Project"**
3. Import your Git repository
4. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
   - **Install Command**: `npm install`

5. Add Environment Variable:
   - **Key**: `REACT_APP_API_URL`
   - **Value**: `https://your-render-url.onrender.com` (your Render backend URL)

6. Click **"Deploy"**

### 3.4 Deploy to Vercel (Option B: CLI)

```bash
# Login to Vercel
vercel login

# Navigate to client directory
cd client

# Deploy
vercel --prod
```

When prompted:
- Set up and deploy: `Y`
- Which scope: Choose your account
- Link to existing project: `N`
- Project name: `jagechas-mvp`
- Directory: `./`
- Override build settings: `N`

---

## Step 4: Configure CORS on Backend

Update your backend to allow requests from Vercel domain:

In `server/server.js`, update CORS configuration:

```javascript
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-vercel-app.vercel.app'  // Add your Vercel URL
  ],
  credentials: true
}));
```

Then redeploy your backend on Render (it auto-deploys on git push).

---

## Step 5: Test Your Deployment

1. **Test Backend**:
   ```bash
   curl https://your-render-url.onrender.com
   ```
   Should return: `{"message":"Welcome to Jagechas API 🚀"}`

2. **Test Frontend**:
   - Visit your Vercel URL
   - Try logging in
   - Check browser console for any CORS errors

---

## Important Notes

### MongoDB Atlas Network Access
Make sure MongoDB Atlas allows connections from anywhere:
1. Go to MongoDB Atlas Dashboard
2. Navigate to **Network Access**
3. Add IP: `0.0.0.0/0` (allows all IPs - needed for Render and Vercel)

### Free Tier Limitations
- **Render Free**: Server spins down after 15 min of inactivity (first request takes ~30 sec)
- **Vercel Free**: Unlimited bandwidth for personal projects

### Environment Variables
Never commit `.env` files! They're already in `.gitignore`.

---

## Troubleshooting

### Backend Issues
- Check Render logs: Dashboard → Your Service → Logs
- Verify environment variables are set correctly
- Test endpoints with Postman/curl

### Frontend Issues
- Check Vercel deployment logs
- Verify `REACT_APP_API_URL` is set correctly
- Check browser console for errors
- Ensure CORS is configured on backend

### Database Issues
- Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Check connection string is correct
- Look for connection errors in Render logs

---

## Quick Commands Reference

```bash
# Check if frontend builds locally
cd client && npm run build

# Test backend locally
cd server && npm start

# Redeploy frontend
cd client && vercel --prod

# View Render logs
# Use Render dashboard: https://dashboard.render.com
```

---

## Your URLs

After deployment, save these URLs:

- **Frontend (Vercel)**: https://your-app.vercel.app
- **Backend (Render)**: https://jagechas-api.onrender.com
- **Database (MongoDB Atlas)**: Already configured ✅

---

## Next Steps

1. Update your domain settings (if you have a custom domain)
2. Set up monitoring and error tracking
3. Configure CD/CI for automatic deployments
4. Add analytics (Google Analytics, etc.)
5. Set up backup strategy for MongoDB

---

Need help? Check:
- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
