# Vercel Cloud Deployment Guide

This guide explains how to deploy Privora to Vercel (frontend) and Render (backend).

## Architecture

- **Frontend**: Next.js app deployed to Vercel
- **Backend**: Express + Socket.IO deployed to Render
- **Database**: PostgreSQL on Render or SQLite for development

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Render account (free tier works)
- Git repository with your code

## Part 1: Backend Deployment (Render)

### 1. Prepare Backend for Render

The backend is already configured with `render.yaml`. Ensure these files exist:
- `backend/render.yaml` - Render configuration
- `backend/package.json` - Dependencies and scripts
- `backend/prisma/schema.prisma` - Database schema

### 2. Create Render Service

1. Go to [render.com](https://render.com) and sign in
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `privora-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

### 3. Set Environment Variables on Render

Add these environment variables in Render dashboard:

```env
NODE_ENV=production
PORT=10000
DATABASE_URL=<your-postgres-url>
JWT_SECRET=<generate-strong-secret>
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=<generate-strong-secret>
REFRESH_TOKEN_EXPIRES_IN=30d
FRONTEND_URL=https://your-app.vercel.app
CORS_ORIGIN=https://your-app.vercel.app
MAX_FILE_SIZE=104857600
```

**Important**: Generate strong secrets using:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Add PostgreSQL Database (Optional)

For production, use PostgreSQL instead of SQLite:

1. In Render dashboard, click "New +" → "PostgreSQL"
2. Create database
3. Copy the "Internal Database URL"
4. Update `DATABASE_URL` in your web service environment variables
5. Render will automatically run migrations on deploy

### 5. Deploy Backend

1. Click "Create Web Service"
2. Render will automatically deploy
3. Note your backend URL: `https://privora-backend.onrender.com`

## Part 2: Frontend Deployment (Vercel)

### 1. Prepare Frontend for Vercel

Ensure these files exist:
- `frontend/vercel.json` - Vercel configuration
- `frontend/next.config.ts` - Next.js configuration
- `frontend/package.json` - Dependencies

### 2. Deploy to Vercel

**Option A: Vercel CLI (Recommended)**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from frontend directory
cd frontend
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? privora
# - Directory? ./
# - Override settings? No

# Deploy to production
vercel --prod
```

**Option B: Vercel Dashboard**

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### 3. Set Environment Variables on Vercel

In Vercel project settings → Environment Variables, add:

```env
NEXT_PUBLIC_API_URL=https://privora-backend.onrender.com
NEXT_PUBLIC_SOCKET_URL=https://privora-backend.onrender.com
NEXT_PUBLIC_BUILD_TIME=auto-generated
NEXT_PUBLIC_COMMIT_SHA=auto-generated
```

**Note**: `NEXT_PUBLIC_BUILD_TIME` and `NEXT_PUBLIC_COMMIT_SHA` are automatically set by the build process.

### 4. Configure Build Settings

Vercel should auto-detect Next.js. Verify:
- **Framework**: Next.js
- **Node Version**: 18.x or higher
- **Root Directory**: `frontend`

### 5. Deploy Frontend

Click "Deploy" and Vercel will:
1. Install dependencies
2. Build the Next.js app
3. Deploy to CDN
4. Provide a URL: `https://your-app.vercel.app`

## Part 3: Connect Frontend and Backend

### 1. Update Backend CORS

In Render dashboard, update environment variables:
```env
FRONTEND_URL=https://your-app.vercel.app
CORS_ORIGIN=https://your-app.vercel.app
```

### 2. Update Frontend API URLs

In Vercel dashboard, update environment variables:
```env
NEXT_PUBLIC_API_URL=https://privora-backend.onrender.com
NEXT_PUBLIC_SOCKET_URL=https://privora-backend.onrender.com
```

### 3. Redeploy Both Services

- Render: Click "Manual Deploy" → "Deploy latest commit"
- Vercel: Push to main branch or click "Redeploy"

## Part 4: Verify Deployment

### 1. Check Backend Health

Visit: `https://privora-backend.onrender.com/health`

Should return:
```json
{
  "status": "ok",
  "timestamp": "2026-01-27T12:00:00.000Z"
}
```

### 2. Check Frontend

Visit: `https://your-app.vercel.app`

Should load the home page.

### 3. Check BuildInfo

1. Navigate to About page
2. Verify commit SHA matches your latest commit
3. Verify build time is recent

### 4. Test Features

- [ ] Register a new account
- [ ] Login
- [ ] See online users
- [ ] Upload and encrypt a file
- [ ] Send to another user
- [ ] Receive and decrypt file
- [ ] Check file manager
- [ ] Check history

## Continuous Deployment

### Automatic Deployments

Both Vercel and Render support automatic deployments:

1. **Vercel**: Automatically deploys on push to main branch
2. **Render**: Automatically deploys on push to main branch

### GitHub Actions (Optional)

The included `.github/workflows/deploy.yml` will:
- Run tests on every push
- Build both frontend and backend
- Report any errors

## Troubleshooting

### "Old UI Still Showing" Issue

This is prevented by:

1. **Cache-Busting Headers** in `frontend/next.config.ts`:
```typescript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
      ],
    },
  ];
}
```

2. **BuildInfo Component**: Shows commit SHA and build time
3. **Vercel Build Settings**: Ensures fresh builds

### Backend Not Responding

1. Check Render logs for errors
2. Verify environment variables are set
3. Check database connection
4. Ensure PORT is set to 10000 (Render default)

### Socket.IO Connection Failed

1. Verify `NEXT_PUBLIC_SOCKET_URL` is correct
2. Check CORS settings on backend
3. Ensure backend is running
4. Check browser console for errors

### Database Migration Issues

Run migrations manually on Render:

1. Go to Render dashboard → Shell
2. Run: `npx prisma migrate deploy`

### Build Failures

**Frontend**:
- Check TypeScript errors: `npm run type-check`
- Check build locally: `npm run build`
- Verify all environment variables are set

**Backend**:
- Check TypeScript errors: `npm run type-check`
- Verify Prisma schema is valid: `npx prisma validate`
- Check build locally: `npm run build`

## Environment Variables Reference

### Backend (Render)

| Variable | Example | Required |
|----------|---------|----------|
| NODE_ENV | production | Yes |
| PORT | 10000 | Yes |
| DATABASE_URL | postgresql://... | Yes |
| JWT_SECRET | random-32-byte-hex | Yes |
| JWT_EXPIRES_IN | 7d | Yes |
| REFRESH_TOKEN_SECRET | random-32-byte-hex | Yes |
| REFRESH_TOKEN_EXPIRES_IN | 30d | Yes |
| FRONTEND_URL | https://app.vercel.app | Yes |
| CORS_ORIGIN | https://app.vercel.app | Yes |
| MAX_FILE_SIZE | 104857600 | No |

### Frontend (Vercel)

| Variable | Example | Required |
|----------|---------|----------|
| NEXT_PUBLIC_API_URL | https://backend.onrender.com | Yes |
| NEXT_PUBLIC_SOCKET_URL | https://backend.onrender.com | Yes |
| NEXT_PUBLIC_BUILD_TIME | auto | No |
| NEXT_PUBLIC_COMMIT_SHA | auto | No |

## Custom Domain (Optional)

### Vercel Custom Domain

1. Go to Vercel project → Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. Update backend CORS_ORIGIN to include your domain

### Render Custom Domain

1. Go to Render service → Settings → Custom Domain
2. Add your domain
3. Update DNS records as instructed
4. Update frontend API URLs to use your domain

## Monitoring

### Vercel Analytics

Enable in Vercel dashboard → Analytics

### Render Metrics

View in Render dashboard → Metrics:
- CPU usage
- Memory usage
- Response times
- Error rates

## Costs

### Free Tier Limits

**Vercel**:
- 100 GB bandwidth/month
- Unlimited deployments
- Automatic HTTPS

**Render**:
- 750 hours/month (enough for 1 service)
- 512 MB RAM
- Sleeps after 15 min inactivity (free tier)

### Upgrading

For production use, consider:
- Render: $7/month (no sleep, more resources)
- Vercel: $20/month (more bandwidth, team features)

## Security Checklist

- [ ] Strong JWT secrets (32+ bytes)
- [ ] HTTPS enabled (automatic on Vercel/Render)
- [ ] CORS properly configured
- [ ] Environment variables not in code
- [ ] Database credentials secure
- [ ] File upload limits enforced
- [ ] Rate limiting enabled (if implemented)

## Support

For deployment issues:
- Vercel: [vercel.com/support](https://vercel.com/support)
- Render: [render.com/docs](https://render.com/docs)
- GitHub Issues: Report bugs in your repository
