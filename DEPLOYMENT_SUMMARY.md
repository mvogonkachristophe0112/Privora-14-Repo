# Deployment Summary

Quick reference for deploying Privora to local network or cloud.

## Quick Links

- [Local Network Deployment](./DEPLOYMENT_GUIDE.md) - Deploy on your local network
- [Cloud Deployment](./VERCEL_DEPLOYMENT.md) - Deploy to Vercel + Render
- [Diagnosis Guide](./DIAGNOSIS.md) - Fix deployment issues

## Deployment Methods

### 1. Local Network (Development/Testing)

**Use Case**: Testing on multiple devices, local network access

**Steps**:
```bash
# 1. Setup
copy .env.example .env
npm run install:all

# 2. Configure
# Edit .env with your local IP

# 3. Start
START_APP.bat

# 4. Access
# http://YOUR_LOCAL_IP:3000
```

**Pros**:
- Fast iteration
- No internet required
- Full control
- Free

**Cons**:
- Not accessible from internet
- Manual setup required
- No automatic scaling

### 2. Cloud (Production)

**Use Case**: Public access, production deployment

**Frontend**: Vercel
**Backend**: Render
**Database**: PostgreSQL (Render)

**Steps**:
```bash
# 1. Push to GitHub
git push origin main

# 2. Deploy Backend (Render)
# - Connect GitHub repo
# - Set environment variables
# - Deploy

# 3. Deploy Frontend (Vercel)
cd frontend
vercel --prod

# 4. Verify
# Check BuildInfo on About page
```

**Pros**:
- Automatic deployments
- Global CDN
- HTTPS included
- Scalable

**Cons**:
- Free tier limitations
- Cold starts (Render free)
- Requires internet

## Batch Scripts

### START_APP.bat

Starts both frontend and backend on local network.

```batch
START_APP.bat
```

**What it does**:
- Starts backend on 0.0.0.0:5000
- Starts frontend on 0.0.0.0:3000
- Keeps both running

### UPDATE_APP.bat

Updates and restarts the application.

```batch
UPDATE_APP.bat
```

**What it does**:
- Pulls latest changes
- Installs dependencies
- Rebuilds application
- Restarts services

### test-build.bat

Tests that everything builds correctly.

```batch
test-build.bat
```

**What it does**:
- Runs TypeScript checks
- Builds backend
- Builds frontend
- Reports errors

## Environment Variables

### Required for Local Network

```env
# Backend (.env in root)
PORT=5000
API_URL=http://YOUR_LOCAL_IP:5000
FRONTEND_URL=http://YOUR_LOCAL_IP:3000
DATABASE_URL="file:./dev.db"
JWT_SECRET=your-secret-key

# Frontend (frontend/.env.local)
NEXT_PUBLIC_API_URL=http://YOUR_LOCAL_IP:5000
NEXT_PUBLIC_SOCKET_URL=http://YOUR_LOCAL_IP:5000
```

### Required for Cloud

```env
# Backend (Render)
NODE_ENV=production
PORT=10000
API_URL=https://your-backend.onrender.com
FRONTEND_URL=https://your-app.vercel.app
DATABASE_URL=postgresql://...
JWT_SECRET=strong-random-secret

# Frontend (Vercel)
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
NEXT_PUBLIC_SOCKET_URL=https://your-backend.onrender.com
```

## Verification Checklist

After deployment, verify:

- [ ] Backend health endpoint responds: `/health`
- [ ] Frontend loads correctly
- [ ] BuildInfo shows correct commit SHA
- [ ] BuildInfo shows recent build time
- [ ] Login/Register works
- [ ] Socket.IO connects (check console)
- [ ] Online users list updates
- [ ] File upload works
- [ ] File encryption works
- [ ] File download/decrypt works
- [ ] Mobile layout works
- [ ] All pages accessible

## Common Issues

### Issue: Old UI Still Showing

**Solution**:
1. Check BuildInfo commit SHA
2. Hard refresh browser (Ctrl+Shift+R)
3. Force Vercel rebuild
4. See [DIAGNOSIS.md](./DIAGNOSIS.md) for details

### Issue: Backend Not Responding

**Solution**:
1. Check Render logs
2. Verify environment variables
3. Check database connection
4. Restart service

### Issue: Socket.IO Not Connecting

**Solution**:
1. Verify SOCKET_URL is correct
2. Check CORS settings
3. Ensure backend is running
4. Check browser console

### Issue: Database Errors

**Solution**:
1. Run migrations: `npx prisma migrate deploy`
2. Check DATABASE_URL
3. Verify Prisma schema

## Deployment Workflow

### Development Workflow

```
1. Make changes locally
2. Test with npm run dev
3. Commit changes
4. Push to GitHub
5. Auto-deploy to cloud
   OR
   Run UPDATE_APP.bat for local
```

### Production Workflow

```
1. Develop on feature branch
2. Test locally
3. Create pull request
4. Review and merge to main
5. Auto-deploy to production
6. Verify BuildInfo
7. Test all features
```

## Monitoring

### Local Network

- Check terminal output for errors
- Monitor browser console
- Check network tab in DevTools

### Cloud

- **Vercel**: Dashboard → Analytics
- **Render**: Dashboard → Metrics
- **Logs**: Check deployment logs

## Rollback

### Local Network

```bash
git checkout previous-commit
UPDATE_APP.bat
```

### Cloud

**Vercel**:
1. Go to Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

**Render**:
1. Go to Deployments
2. Find previous working deployment
3. Click "Redeploy"

## Performance

### Local Network

- Fast (no network latency)
- Limited by local hardware
- No CDN

### Cloud

- Global CDN (Vercel)
- Auto-scaling
- Cold starts on free tier (Render)

## Security

### Local Network

- Not exposed to internet
- Use strong JWT secrets
- Enable firewall

### Cloud

- HTTPS automatic
- Environment variables encrypted
- Use strong secrets
- Enable rate limiting

## Costs

### Local Network

- **Free** (uses your hardware)
- Electricity costs only

### Cloud (Free Tier)

- **Vercel**: Free (100 GB bandwidth)
- **Render**: Free (750 hours, sleeps after 15 min)
- **Total**: $0/month

### Cloud (Paid)

- **Vercel Pro**: $20/month
- **Render Starter**: $7/month
- **Total**: $27/month

## Support

- **Documentation**: See individual guides
- **Issues**: Check DIAGNOSIS.md
- **Community**: GitHub Issues
- **Vercel Support**: vercel.com/support
- **Render Support**: render.com/docs

## Quick Commands

```bash
# Install everything
npm run install:all

# Start development
npm run dev

# Build everything
npm run build

# Start production
npm start

# Test build
test-build.bat

# Update app (local)
UPDATE_APP.bat

# Start app (local network)
START_APP.bat

# Deploy to Vercel
cd frontend && vercel --prod

# Check backend health
curl http://localhost:5000/health

# Check Prisma status
cd backend && npx prisma migrate status
```

## File Structure

```
Privora 14/
├── frontend/           # Next.js app
│   ├── src/
│   ├── public/
│   ├── vercel.json
│   └── next.config.ts
├── backend/            # Express + Socket.IO
│   ├── src/
│   ├── prisma/
│   ├── render.yaml
│   └── package.json
├── .github/
│   └── workflows/
│       └── deploy.yml
├── DEPLOYMENT_GUIDE.md
├── VERCEL_DEPLOYMENT.md
├── DIAGNOSIS.md
├── DEPLOYMENT_SUMMARY.md
├── START_APP.bat
├── UPDATE_APP.bat
├── test-build.bat
└── package.json
```

## Next Steps

1. **First Time Setup**: Follow [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
2. **Cloud Deployment**: Follow [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)
3. **Issues**: Check [DIAGNOSIS.md](./DIAGNOSIS.md)
4. **Updates**: Use UPDATE_APP.bat or git push

## Important Notes

- Always verify BuildInfo after deployment
- Use cache-busting headers to prevent old UI
- Test on multiple devices/browsers
- Keep environment variables secure
- Regular backups of database
- Monitor logs for errors

## Version Control

- **Main Branch**: Production-ready code
- **Develop Branch**: Development code
- **Feature Branches**: New features

Always deploy from main branch to production.

## Continuous Integration

GitHub Actions automatically:
- Runs tests on push
- Builds frontend and backend
- Reports errors
- Deploys to cloud (if configured)

See `.github/workflows/deploy.yml` for details.
