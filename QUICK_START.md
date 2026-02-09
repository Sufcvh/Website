# Quick Vercel Deployment Steps

## IMPORTANT: You MUST setup MongoDB Atlas first (5 minutes)

Your local MongoDB won't work on Vercel. Follow these steps:

### Step 1: Create MongoDB Atlas (Free)

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up for FREE account
3. Create FREE cluster (M0 Sandbox)
4. Create database user:
   - Username: `jobtracker`
   - Password: (create a strong password - SAVE IT!)
5. Network Access: "Allow Access from Anywhere"
6. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy string (looks like: `mongodb+srv://jobtracker:<password>@cluster0...`)
   - Replace `<password>` with your actual password
   - **SAVE THIS CONNECTION STRING!**

### Step 2: Deploy to Vercel

1. Go to: https://vercel.com
2. Sign in with GitHub
3. Click "Add New Project"
4. Import repository: `Sufcvh/Website`
5. Select branch: `Job-Tracker`

### Step 3: Configure Vercel Project

**Root Directory:** Leave empty

**Build Settings:**
- Build Command: `bash build.sh`
- Output Directory: `frontend/build`
- Install Command: `yarn install`

**Environment Variables** (Click "Add" for each):

```
MONGO_URL = mongodb+srv://jobtracker:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
DB_NAME = job_tracker
CORS_ORIGINS = *
```

### Step 4: Deploy

Click "Deploy" button and wait 3-5 minutes.

### Step 5: Update Frontend URL (After First Deploy)

1. After deployment completes, copy your Vercel URL (e.g., `https://website-abc123.vercel.app`)
2. Go to: Vercel Dashboard → Your Project → Settings → Environment Variables
3. Add new variable:
   ```
   REACT_APP_BACKEND_URL = https://your-actual-vercel-url.vercel.app
   ```
4. Go to Deployments tab → Click "..." → "Redeploy"

### Done!

Your Job Tracker app should now be live at your Vercel URL!

## If Something Goes Wrong

- Check build logs in Vercel dashboard
- Verify MongoDB connection string is correct (no spaces, password is correct)
- Ensure all environment variables are set
- Check Function logs in Vercel dashboard for API errors

## Files Created for Vercel

- `/api/index.py` - Serverless backend
- `/vercel.json` - Vercel configuration
- `/build.sh` - Build script
- `/VERCEL_DEPLOYMENT.md` - Detailed guide

All files have been pushed to your GitHub repository!
