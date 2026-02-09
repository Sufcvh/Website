# Job Tracker - Vercel Deployment Guide

## Prerequisites

### 1. MongoDB Atlas Setup (Required - Free Tier)

Since Vercel is serverless, you need a cloud MongoDB database:

1. **Create MongoDB Atlas Account**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up for free

2. **Create a Free Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier (M0 Sandbox)
   - Select a cloud provider and region closest to you
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access" in left menu
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `jobtracker`
   - Password: Generate a secure password (save this!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Whitelist IP Address**
   - Go to "Network Access" in left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in left menu
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like):
     ```
     mongodb+srv://jobtracker:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<password>` with your actual password
   - This is your `MONGO_URL`

## Vercel Deployment Steps

### 1. Push Updated Code to GitHub

```bash
cd /app
git add -A
git commit -m "Add Vercel deployment configuration"
git push origin Job-Tracker
```

### 2. Connect Vercel to GitHub

1. Go to https://vercel.com
2. Sign up/Login with GitHub
3. Click "Add New Project"
4. Import your repository: `Sufcvh/Website`
5. Select the `Job-Tracker` branch

### 3. Configure Project Settings

**Build & Development Settings:**
- Framework Preset: `Other`
- Build Command: `bash build.sh`
- Output Directory: `frontend/build`
- Install Command: `yarn install`
- Root Directory: Leave empty (use root)

**Environment Variables:**
Add these in the "Environment Variables" section:

| Name | Value |
|------|-------|
| `MONGO_URL` | Your MongoDB Atlas connection string |
| `DB_NAME` | `job_tracker` |
| `CORS_ORIGINS` | `*` |

### 4. Deploy

- Click "Deploy"
- Wait for build to complete (3-5 minutes)
- Your app will be live at: `https://your-project.vercel.app`

### 5. Update Frontend Environment

After first deployment, update your frontend environment:

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   ```
   REACT_APP_BACKEND_URL=https://your-project.vercel.app
   ```
3. Redeploy from Vercel Dashboard

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json and requirements.txt

### API Not Working
- Verify MongoDB connection string is correct
- Check that `/api` routes are configured in vercel.json
- Look at Function logs in Vercel dashboard

### Frontend Not Loading
- Verify build command completed successfully
- Check that `frontend/build` directory was created
- Ensure REACT_APP_BACKEND_URL points to your Vercel URL

## Local Development

To test locally with MongoDB Atlas:

1. Update `/app/backend/.env`:
   ```
   MONGO_URL=mongodb+srv://jobtracker:yourpassword@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   DB_NAME=job_tracker
   ```

2. Start services:
   ```bash
   sudo supervisorctl restart backend frontend
   ```

## Cost

- **MongoDB Atlas**: Free M0 tier (512MB storage, shared RAM)
- **Vercel**: Free tier (100GB bandwidth/month, serverless functions)

Both services have generous free tiers suitable for personal projects.
