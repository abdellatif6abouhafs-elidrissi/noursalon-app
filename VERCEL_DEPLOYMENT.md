# Vercel Deployment Guide - Full Stack

This project is now configured to deploy both frontend (Next.js) and backend (FastAPI) on Vercel.

## Deployment Steps

### 1. Push to GitHub
```bash
cd C:\Users\ULTRA PC\noursalon-app
git add .
git commit -m "Convert backend to Vercel serverless functions"
git push origin main
```

### 2. Import to Vercel

1. Go to https://vercel.com/new
2. Select "Import Git Repository"
3. Choose `abdellatif6abouhafs-elidrissi/noursalon-app`
4. Click Import

### 3. Set Environment Variables

In Vercel dashboard, go to Settings → Environment Variables and add:

```
MONGODB_URL=mongodb+srv://noursalon_user:YOUR_PASSWORD@cluster0.vhmlghp.mongodb.net/?appName=Cluster0
DB_NAME=noursalon
SECRET_KEY=your-secure-secret-key-min-32-chars-change-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
APP_NAME=NourSalon API
DEBUG=False
ALLOWED_ORIGINS=https://noursalon-app.vercel.app,http://localhost:3000
```

### 4. Deploy

Click "Deploy" in Vercel dashboard. Vercel will:
- Install Node.js dependencies
- Build Next.js frontend → `.next/`
- Install Python dependencies from `api/requirements.txt`
- Deploy serverless Python functions for `/api`
- Generate production URL

### 5. Test Deployment

After deployment:
```bash
# Test health endpoint
curl https://noursalon-app.vercel.app/api/health

# Test root endpoint
curl https://noursalon-app.vercel.app/api/

# View API docs
https://noursalon-app.vercel.app/api/docs
```

### 6. Update Frontend (if needed)

The frontend `.env.production` is already configured:
```
NEXT_PUBLIC_API_URL=https://noursalon-app.vercel.app/api
```

## Architecture

### Frontend (Next.js)
- `/src/` - React components, pages, hooks
- `/public/` - Static assets
- Deployed as Next.js on Vercel

### Backend (FastAPI - Serverless)
- `/api/index.py` - Main ASGI app handler
- `/api/src/app/` - FastAPI application code
- `/api/requirements.txt` - Python dependencies
- Deployed as Python serverless functions on Vercel

### Database
- MongoDB Atlas (free tier or paid)
- Connection: `MONGODB_URL` environment variable

## Free Tier Limits

Vercel Free Plan includes:
- ✅ Unlimited deployments
- ✅ 4 serverless functions per deployment (plenty for API routes)
- ✅ 100GB bandwidth/month
- ✅ 6 hours CPU time/day per function

MongoDB Atlas Free Tier:
- ✅ 512MB storage
- ✅ Shared cluster
- ✅ Up to 100 connections

## Troubleshooting

### Cold Start Issues
- First request to API might take 1-2 seconds (serverless cold start)
- Subsequent requests will be fast

### MongoDB Connection Issues
- Verify IP whitelist in MongoDB Atlas Network Access
- Use connection string with correct password
- Test with: `/api/health` endpoint

### Import Errors
- Ensure all Python files are in `/api/src/`
- Check `PYTHONPATH` settings
- Verify `requirements.txt` includes all dependencies

## Next Steps

1. Deploy to Vercel (this step)
2. Test all API endpoints
3. Monitor performance in Vercel dashboard
4. Set up error logging/monitoring (optional)
