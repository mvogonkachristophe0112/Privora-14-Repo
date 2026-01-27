# Local Network Deployment Guide

This guide explains how to deploy Privora on your local network so other devices can access it.

## Prerequisites

- Node.js 18+ and npm 9+
- Git installed
- Windows OS (for batch scripts) or adapt commands for Linux/Mac

## Quick Start

### 1. Initial Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd "Privora 14"

# Copy environment file
copy .env.example .env

# Edit .env and set your local IP address
# Example: API_URL=http://192.168.1.100:5000
# Example: FRONTEND_URL=http://192.168.1.100:3000

# Install all dependencies
npm run install:all
```

### 2. Database Setup

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
cd ..
```

### 3. Start the Application

**Option A: Using Batch Script (Recommended)**
```bash
START_APP.bat
```

This will:
- Start backend on 0.0.0.0:5000 (accessible from network)
- Start frontend on 0.0.0.0:3000 (accessible from network)
- Keep both running in the background

**Option B: Manual Start**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 4. Access from Other Devices

Find your local IP address:
```bash
ipconfig
```

Look for "IPv4 Address" (e.g., 192.168.1.100)

Then access from any device on the same network:
- Frontend: `http://192.168.1.100:3000`
- Backend API: `http://192.168.1.100:5000`

## Updating the Application

When you make changes to the code:

```bash
UPDATE_APP.bat
```

This will:
1. Pull latest changes from git
2. Install any new dependencies
3. Rebuild the application
4. Restart services

## Testing the Build

Before deploying, test that everything builds correctly:

```bash
test-build.bat
```

This will:
1. Run TypeScript checks
2. Build backend
3. Build frontend
4. Report any errors

## Troubleshooting

### Port Already in Use

If ports 3000 or 5000 are already in use:

1. Edit `.env` file
2. Change `PORT=5000` to another port (e.g., `PORT=5001`)
3. Update `API_URL` and `SOCKET_URL` accordingly
4. Restart the application

### Cannot Access from Other Devices

1. Check Windows Firewall settings
2. Allow Node.js through firewall
3. Ensure devices are on the same network
4. Verify IP address is correct

### Database Issues

Reset the database:
```bash
cd backend
del prisma\dev.db
npx prisma migrate dev --name init
cd ..
```

## Network Configuration

### Binding to 0.0.0.0

The application binds to `0.0.0.0` which means:
- Accessible from localhost (127.0.0.1)
- Accessible from local IP (192.168.x.x)
- Accessible from other devices on the network

### Security Considerations

For local network deployment:
- Change default JWT secrets in `.env`
- Use strong passwords
- Don't expose to the internet without proper security
- Consider using HTTPS for production

## Environment Variables

Key variables for local network deployment:

```env
# Backend
PORT=5000
API_URL=http://YOUR_LOCAL_IP:5000
FRONTEND_URL=http://YOUR_LOCAL_IP:3000

# Frontend (in frontend/.env.local)
NEXT_PUBLIC_API_URL=http://YOUR_LOCAL_IP:5000
NEXT_PUBLIC_SOCKET_URL=http://YOUR_LOCAL_IP:5000
```

Replace `YOUR_LOCAL_IP` with your actual local IP address.

## Verifying Deployment

After starting the app, verify:

1. **Backend Health**: Visit `http://YOUR_LOCAL_IP:5000/health`
2. **Frontend**: Visit `http://YOUR_LOCAL_IP:3000`
3. **BuildInfo**: Check the About page for commit SHA and build time
4. **Socket.IO**: Check browser console for "Connected to server"

## Production Considerations

For production local network deployment:

1. Use `NODE_ENV=production`
2. Build optimized versions: `npm run build`
3. Use `npm start` instead of `npm run dev`
4. Set up proper logging
5. Configure automatic restarts (PM2 or similar)
6. Regular backups of the database

## Support

If you encounter issues:
1. Check the logs in the terminal
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check firewall settings
5. Verify network connectivity
