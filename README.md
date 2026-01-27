# Privora - Secure Encrypted File Transfer

A modern, secure file transfer application with end-to-end encryption, real-time presence, and a WhatsApp-like UI.

## 🚀 Features

- **End-to-End Encryption**: AES-256-GCM client-side encryption
- **Real-time Presence**: See who's online with Socket.IO
- **Secure Authentication**: JWT-based auth with refresh tokens
- **File Management**: Upload, send, receive, and manage encrypted files
- **Transfer History**: Track all sent and received files
- **Responsive Design**: Works on phone, tablet, laptop, and PC
- **Modern UI**: Compact, WhatsApp-like interface with blue+green theme

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Tech Stack](#tech-stack)
- [Test Checklist](#test-checklist)
- [Troubleshooting](#troubleshooting)

## 🏁 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- Git

### Local Development

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd "Privora 14"

# 2. Install dependencies
npm run install:all

# 3. Setup environment variables
copy .env.example .env
# Edit .env with your configuration

# 4. Setup database
cd backend
npx prisma generate
npx prisma migrate dev --name init
cd ..

# 5. Start the application
npm run dev
# OR use the batch script
START_APP.bat
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Local Network Access

To access from other devices on your network:

```bash
# 1. Find your local IP
ipconfig  # Windows
# Look for IPv4 Address (e.g., 192.168.1.100)

# 2. Update .env file
API_URL=http://192.168.1.100:5000
FRONTEND_URL=http://192.168.1.100:3000

# 3. Start with network binding
START_APP.bat

# 4. Access from any device
http://192.168.1.100:3000
```

## 🌐 Deployment

### Cloud Deployment (Vercel + Render)

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed instructions.

**Quick Deploy:**

1. **Backend (Render)**:
   - Connect GitHub repo
   - Set root directory to `backend`
   - Configure environment variables
   - Deploy

2. **Frontend (Vercel)**:
   ```bash
   cd frontend
   vercel --prod
   ```

3. **Verify**:
   - Check BuildInfo on About page
   - Confirm commit SHA matches latest

### Local Network Deployment

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## 📁 Project Structure

```
Privora 14/
├── frontend/                 # Next.js 14 frontend
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   │   ├── (auth)/      # Auth pages (login, signup)
│   │   │   ├── (dashboard)/ # Protected pages
│   │   │   ├── about/       # About page with BuildInfo
│   │   │   ├── layout.tsx   # Root layout
│   │   │   └── page.tsx     # Home page
│   │   ├── components/      # React components
│   │   │   ├── ui/          # UI components
│   │   │   ├── BuildInfo.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── ...
│   │   ├── lib/             # Utilities
│   │   │   ├── api.ts       # API client
│   │   │   ├── socket.ts    # Socket.IO client
│   │   │   └── crypto.ts    # Encryption utilities
│   │   ├── store/           # Zustand stores
│   │   │   ├── authStore.ts
│   │   │   └── socketStore.ts
│   │   └── types/           # TypeScript types
│   ├── public/              # Static assets
│   ├── next.config.ts       # Next.js config
│   ├── vercel.json          # Vercel config
│   └── package.json
│
├── backend/                  # Express + Socket.IO backend
│   ├── src/
│   │   ├── routes/          # API routes
│   │   │   ├── auth.ts      # Authentication
│   │   │   ├── files.ts     # File operations
│   │   │   ├── users.ts     # User management
│   │   │   └── transfers.ts # File transfers
│   │   ├── socket/          # Socket.IO handlers
│   │   │   └── handlers.ts  # Real-time events
│   │   ├── middleware/      # Express middleware
│   │   │   └── auth.ts      # JWT authentication
│   │   └── index.ts         # Server entry point
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── render.yaml          # Render config
│   └── package.json
│
├── .github/
│   └── workflows/
│       └── deploy.yml       # CI/CD pipeline
│
├── docs/                     # Documentation
│   ├── DEPLOYMENT_GUIDE.md
│   ├── VERCEL_DEPLOYMENT.md
│   ├── DIAGNOSIS.md
│   └── DEPLOYMENT_SUMMARY.md
│
├── START_APP.bat            # Start app (local network)
├── UPDATE_APP.bat           # Update and rebuild
├── test-build.bat           # Test build process
├── .env.example             # Environment template
└── README.md                # This file
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Real-time**: Socket.IO Client
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Icons**: Lucide React
- **Encryption**: Web Crypto API (AES-256-GCM)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **ORM**: Prisma
- **Real-time**: Socket.IO
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **File Upload**: express-fileupload

### DevOps
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render
- **CI/CD**: GitHub Actions
- **Version Control**: Git

## ✅ Test Checklist

### Authentication
- [ ] Register new account
- [ ] Login with credentials
- [ ] Logout
- [ ] Protected routes redirect to login
- [ ] Token refresh works
- [ ] Invalid credentials show error

### Real-time Presence
- [ ] User appears in Online Users list after login
- [ ] Green dot shows for online users
- [ ] User disappears from list after logout
- [ ] Multiple users can be online simultaneously
- [ ] Online status updates in real-time

### File Transfer (End-to-End)
- [ ] Upload file successfully
- [ ] File is encrypted client-side
- [ ] Select recipient from Online Users
- [ ] Send encrypted file
- [ ] Receiver gets real-time notification
- [ ] Receiver sees file in Receive page
- [ ] Receiver can input decryption key
- [ ] File decrypts correctly
- [ ] Preview works for images/videos/PDFs
- [ ] Download decrypted file works

### File Manager
- [ ] List all user files
- [ ] Search/filter files
- [ ] Download encrypted file
- [ ] Delete file (if allowed)
- [ ] File metadata displays correctly

### History
- [ ] View sent files with timestamps
- [ ] View received files with timestamps
- [ ] Status shows correctly (pending/received/decrypted)
- [ ] History updates in real-time

### UI/UX
- [ ] Compact layout (not huge)
- [ ] WhatsApp-like structure
- [ ] Sidebar navigation works
- [ ] Mobile responsive (360px width)
- [ ] Tablet responsive
- [ ] Desktop responsive
- [ ] All pages accessible
- [ ] Consistent styling
- [ ] Blue+green theme applied
- [ ] Toast notifications work
- [ ] Loading states show
- [ ] Error messages clear

### Deployment
- [ ] BuildInfo shows correct commit SHA
- [ ] BuildInfo shows recent build time
- [ ] Local network access works (0.0.0.0 binding)
- [ ] Cloud deployment accessible
- [ ] No "old UI" issues
- [ ] Cache-busting headers work
- [ ] Environment variables set correctly
- [ ] Database migrations applied
- [ ] Socket.IO connects successfully

### Performance
- [ ] Page load time < 3 seconds
- [ ] File upload/download works for large files (up to 100MB)
- [ ] Real-time updates have low latency
- [ ] No memory leaks
- [ ] Smooth animations

### Security
- [ ] Passwords hashed (bcrypt)
- [ ] JWT tokens secure
- [ ] Encryption keys not stored on server
- [ ] HTTPS enabled (production)
- [ ] CORS configured correctly
- [ ] File upload limits enforced
- [ ] SQL injection prevented (Prisma)
- [ ] XSS prevented (React)

## 🐛 Troubleshooting

### "Old UI Still Showing"

See [DIAGNOSIS.md](./DIAGNOSIS.md) for detailed troubleshooting.

**Quick Fix**:
1. Check BuildInfo commit SHA
2. Hard refresh browser (Ctrl+Shift+R)
3. Clear browser cache
4. Force Vercel rebuild

### Backend Not Responding

```bash
# Check backend health
curl http://localhost:5000/health

# Check logs
cd backend
npm run dev
```

### Socket.IO Not Connecting

1. Verify `NEXT_PUBLIC_SOCKET_URL` is correct
2. Check CORS settings in backend
3. Ensure backend is running
4. Check browser console for errors

### Database Issues

```bash
# Reset database (development only)
cd backend
del prisma\dev.db
npx prisma migrate dev --name init
```

### Build Failures

```bash
# Test build
test-build.bat

# Check TypeScript errors
cd frontend && npx tsc --noEmit
cd backend && npx tsc --noEmit

# Reinstall dependencies
rm -rf node_modules frontend/node_modules backend/node_modules
npm run install:all
```

## 📚 Documentation

- [Local Network Deployment](./DEPLOYMENT_GUIDE.md)
- [Cloud Deployment](./VERCEL_DEPLOYMENT.md)
- [Diagnosis Guide](./DIAGNOSIS.md)
- [Deployment Summary](./DEPLOYMENT_SUMMARY.md)

## 🔧 Scripts

### Root Scripts

```bash
npm run dev              # Start both frontend and backend
npm run build            # Build both
npm run start            # Start production servers
npm run install:all      # Install all dependencies
```

### Batch Scripts (Windows)

```bash
START_APP.bat           # Start app on local network
UPDATE_APP.bat          # Pull changes and rebuild
test-build.bat          # Test build process
```

### Backend Scripts

```bash
cd backend
npm run dev             # Start development server
npm run build           # Build TypeScript
npm start               # Start production server
npx prisma generate     # Generate Prisma client
npx prisma migrate dev  # Run migrations
```

### Frontend Scripts

```bash
cd frontend
npm run dev             # Start development server
npm run build           # Build for production
npm start               # Start production server
npm run lint            # Run ESLint
```

## 🌟 Key Features Explained

### Client-Side Encryption

Files are encrypted in the browser before upload:

1. User selects file
2. Generate random AES-256-GCM key + IV
3. Encrypt file in browser
4. Upload encrypted bytes
5. Share key with recipient (out-of-band)
6. Recipient decrypts in browser

**Key never touches the server!**

### Real-Time Presence

Socket.IO provides instant updates:

1. User logs in → connects to Socket.IO
2. Server adds to online users list
3. Broadcasts update to all clients
4. Green dot appears next to username
5. User logs out → removed from list
6. Red dot or disappears from list

### Protected Routes

Next.js middleware protects dashboard routes:

1. Check for auth token in cookies/localStorage
2. Verify token with backend
3. Allow access if valid
4. Redirect to login if invalid

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly (use checklist)
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Issues**: GitHub Issues
- **Documentation**: See `/docs` folder
- **Deployment Help**: See deployment guides

## 🎯 Roadmap

- [ ] Group file sharing
- [ ] File expiration
- [ ] Password-protected links
- [ ] Mobile apps (React Native)
- [ ] Desktop apps (Electron)
- [ ] End-to-end encrypted chat
- [ ] Video/audio calls
- [ ] File versioning
- [ ] Audit logs

## ⚡ Performance Tips

1. **Use production builds**: `npm run build && npm start`
2. **Enable compression**: Gzip/Brotli on server
3. **Optimize images**: Use WebP format
4. **Lazy load components**: React.lazy()
5. **Cache API responses**: Use SWR or React Query
6. **CDN for static assets**: Vercel CDN
7. **Database indexing**: Prisma indexes on foreign keys

## 🔒 Security Best Practices

1. **Never commit secrets**: Use .env files
2. **Rotate JWT secrets**: Regularly in production
3. **Use HTTPS**: Always in production
4. **Validate input**: Both client and server
5. **Rate limiting**: Prevent abuse
6. **File type validation**: Check MIME types
7. **Size limits**: Enforce max file size
8. **Audit logs**: Track sensitive operations

## 📊 Monitoring

### Local Development

- Terminal logs
- Browser DevTools
- Network tab

### Production

- Vercel Analytics
- Render Metrics
- Error tracking (Sentry)
- Uptime monitoring

## 🎨 UI/UX Guidelines

- **Base font size**: 14px
- **Spacing**: Tight, compact
- **Colors**: Blue (#1890ff) + Green (#52c41a)
- **Layout**: WhatsApp-like (sidebar + main)
- **Mobile**: Bottom nav or drawer
- **Accessibility**: Labels, focus, contrast
- **Feedback**: Toasts for actions
- **Loading**: Spinners for async operations

## 📱 Mobile Responsiveness

- **Phone** (< 640px): Single column, bottom nav
- **Tablet** (640px - 1024px): Sidebar + main
- **Laptop** (1024px - 1440px): Full layout
- **Desktop** (> 1440px): Wide layout

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] All tests pass
- [ ] No console errors
- [ ] Environment variables set
- [ ] Database migrations applied
- [ ] BuildInfo configured
- [ ] Cache-busting enabled
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Secrets rotated
- [ ] Backups configured
- [ ] Monitoring enabled
- [ ] Documentation updated

---

**Built with ❤️ for secure file sharing**
