# Deployment Diagnosis Guide

This document helps diagnose and fix common deployment issues, especially the "old UI still showing" problem.

## Problem: Old UI Still Showing After Deployment

### Symptoms
- Deployed app shows old design/features
- BuildInfo shows old commit SHA
- Changes made in code don't appear on deployed site
- Users see cached version

### Root Causes

1. **Browser Cache**
   - Browser cached old assets
   - Service worker caching old version
   - CDN cached old files

2. **Build Cache**
   - Vercel using cached build
   - Old build artifacts not cleared
   - Dependencies not updated

3. **Wrong Branch Deployed**
   - Deploying from wrong branch
   - Local changes not pushed
   - Vercel connected to wrong branch

4. **Build Configuration Issues**
   - Wrong root directory
   - Incorrect build command
   - Missing environment variables

### Diagnosis Steps

#### Step 1: Verify Git Status

```bash
# Check current branch
git branch

# Check if changes are committed
git status

# Check latest commit
git log -1

# Verify remote is updated
git fetch origin
git log origin/main -1
```

**Expected**: All changes committed and pushed to remote.

#### Step 2: Check Vercel Deployment

1. Go to Vercel dashboard
2. Click on your project
3. Check "Deployments" tab
4. Find latest deployment
5. Click on it and check:
   - **Commit SHA**: Should match your latest commit
   - **Build Time**: Should be recent
   - **Build Logs**: Should show no errors
   - **Source**: Should be correct branch

**Expected**: Latest deployment matches your latest commit.

#### Step 3: Check BuildInfo Component

1. Visit deployed site
2. Navigate to About page
3. Check BuildInfo section:
   - **Commit SHA**: Should match `git log -1 --format=%H`
   - **Build Time**: Should be recent
   - **Environment**: Should show production

**Expected**: BuildInfo shows correct commit and recent build time.

#### Step 4: Check Browser Cache

1. Open deployed site
2. Open DevTools (F12)
3. Go to Network tab
4. Check "Disable cache"
5. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
6. Check if new UI appears

**Expected**: Hard refresh shows new UI.

#### Step 5: Check Vercel Cache

1. Go to Vercel dashboard
2. Click on your project
3. Go to Settings → General
4. Scroll to "Build & Development Settings"
5. Check "Output Directory" is `.next`
6. Check "Install Command" is `npm install`

**Expected**: Settings are correct.

### Solutions

#### Solution 1: Clear Browser Cache

**For Users**:
```
Chrome/Edge: Ctrl+Shift+Delete → Clear cache
Firefox: Ctrl+Shift+Delete → Clear cache
Safari: Cmd+Option+E
```

**For Developers**:
```
1. Open DevTools
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"
```

#### Solution 2: Force Vercel Rebuild

**Option A: Redeploy**
```bash
# In frontend directory
vercel --prod --force
```

**Option B: Dashboard**
1. Go to Vercel dashboard
2. Click on latest deployment
3. Click "..." menu
4. Select "Redeploy"
5. Check "Use existing Build Cache" is OFF

**Option C: Clear Build Cache**
1. Make a small change (add comment)
2. Commit and push
3. Vercel will auto-deploy with fresh build

#### Solution 3: Verify Environment Variables

```bash
# Check local build works
cd frontend
npm run build
npm start

# Visit http://localhost:3000
# Check if new UI appears
```

If local build works but deployed doesn't:
1. Check Vercel environment variables
2. Ensure `NEXT_PUBLIC_*` variables are set
3. Redeploy after updating variables

#### Solution 4: Check Next.js Configuration

Verify `frontend/next.config.ts` has cache-busting headers:

```typescript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-cache, no-store, must-revalidate',
        },
        {
          key: 'Pragma',
          value: 'no-cache',
        },
        {
          key: 'Expires',
          value: '0',
        },
      ],
    },
  ];
}
```

#### Solution 5: Verify Build Process

Check build logs for errors:

1. Go to Vercel dashboard
2. Click on deployment
3. Check "Building" section
4. Look for:
   - TypeScript errors
   - Missing dependencies
   - Build warnings
   - Environment variable issues

#### Solution 6: Check Vercel.json Configuration

Verify `frontend/vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        }
      ]
    }
  ]
}
```

### Prevention Strategies

#### 1. Always Use BuildInfo Component

Add to every deployment:
```tsx
<BuildInfo />
```

This shows:
- Commit SHA (verify it matches your latest commit)
- Build time (verify it's recent)
- Environment (verify it's production)

#### 2. Implement Version Checking

Add version check in app:
```typescript
// Check if new version available
const checkVersion = async () => {
  const response = await fetch('/api/version');
  const { version } = await response.json();
  if (version !== currentVersion) {
    // Show update notification
  }
};
```

#### 3. Use Deployment Checklist

Before marking deployment as complete:

- [ ] Verify commit SHA in BuildInfo matches latest commit
- [ ] Verify build time is recent (within last hour)
- [ ] Test on multiple browsers
- [ ] Test on mobile device
- [ ] Clear cache and test again
- [ ] Check all pages load correctly
- [ ] Verify API connections work
- [ ] Check Socket.IO connection
- [ ] Test authentication flow
- [ ] Test file upload/download

#### 4. Automate Verification

Add to CI/CD pipeline:
```yaml
- name: Verify Deployment
  run: |
    # Wait for deployment
    sleep 30
    # Check BuildInfo
    curl https://your-app.vercel.app/api/build-info
    # Verify commit SHA
    DEPLOYED_SHA=$(curl -s https://your-app.vercel.app/api/build-info | jq -r '.commitSha')
    CURRENT_SHA=$(git rev-parse HEAD)
    if [ "$DEPLOYED_SHA" != "$CURRENT_SHA" ]; then
      echo "Deployment verification failed"
      exit 1
    fi
```

### Common Mistakes

1. **Not Pushing Changes**
   - Committed locally but forgot to push
   - Solution: Always `git push` before checking deployment

2. **Wrong Branch**
   - Vercel deploying from `main` but you're on `develop`
   - Solution: Merge to correct branch or change Vercel settings

3. **Cached Dependencies**
   - Old dependencies causing issues
   - Solution: Clear node_modules and reinstall

4. **Environment Variables Not Set**
   - Missing `NEXT_PUBLIC_*` variables
   - Solution: Set in Vercel dashboard and redeploy

5. **Build Cache Issues**
   - Vercel using old cached build
   - Solution: Force rebuild without cache

### Emergency Fix

If nothing works, nuclear option:

```bash
# 1. Delete Vercel project
# 2. Delete local .next and node_modules
rm -rf frontend/.next frontend/node_modules

# 3. Fresh install
cd frontend
npm install

# 4. Test local build
npm run build
npm start

# 5. Redeploy to Vercel
vercel --prod

# 6. Verify BuildInfo shows correct commit
```

### Monitoring

Set up monitoring to catch issues early:

1. **Vercel Analytics**: Track page views and errors
2. **Sentry**: Track runtime errors
3. **Uptime Monitor**: Check if site is accessible
4. **Version API**: Endpoint that returns current version

### Support

If issue persists:

1. Check Vercel status page
2. Review Vercel build logs
3. Check browser console for errors
4. Test in incognito mode
5. Test on different device/network
6. Contact Vercel support with deployment ID

## Other Common Issues

### Backend Not Responding

**Symptoms**: Frontend loads but API calls fail

**Diagnosis**:
```bash
# Check backend health
curl https://your-backend.onrender.com/health

# Check logs in Render dashboard
```

**Solutions**:
- Verify backend is running (Render free tier sleeps)
- Check environment variables
- Verify CORS settings
- Check database connection

### Socket.IO Connection Failed

**Symptoms**: Real-time features don't work

**Diagnosis**:
```javascript
// Check browser console
// Should see: "Connected to server"
```

**Solutions**:
- Verify `NEXT_PUBLIC_SOCKET_URL` is correct
- Check backend CORS allows frontend origin
- Ensure backend Socket.IO is running
- Check for WebSocket blocking (firewall/proxy)

### Database Migration Issues

**Symptoms**: API returns database errors

**Diagnosis**:
```bash
# Check Prisma schema
cd backend
npx prisma validate

# Check migrations
npx prisma migrate status
```

**Solutions**:
- Run migrations: `npx prisma migrate deploy`
- Reset database: `npx prisma migrate reset` (dev only)
- Check DATABASE_URL is correct

## Conclusion

The key to avoiding "old UI" issues:

1. **Always verify BuildInfo** after deployment
2. **Use cache-busting headers** in Next.js config
3. **Force rebuild** when in doubt
4. **Test in incognito mode** to avoid cache
5. **Monitor deployments** with automated checks

Remember: If BuildInfo shows the correct commit SHA and recent build time, the deployment is correct. Any "old UI" is likely a caching issue on the client side.
