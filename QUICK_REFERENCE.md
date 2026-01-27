# 🚀 Privora - Quick Reference Card

## ⚡ Start the App (One Command)
```bash
START_APP.bat
```
Then visit: **http://localhost:3000**

---

## 📋 Essential Commands

### Start Application
```bash
START_APP.bat              # Start both frontend and backend
```

### Development
```bash
# Backend only
cd backend && npm run dev

# Frontend only  
cd frontend && npm run dev

# Database GUI
cd backend && npx prisma studio
```

### Build & Test
```bash
test-build.bat            # Test build process
npm run build             # Build both apps
```

---

## 🌐 URLs

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Main application |
| Backend | http://localhost:5000 | API server |
| Health | http://localhost:5000/health | Server status |
| Prisma Studio | http://localhost:5555 | Database GUI |

---

## 📁 Key Files

### Configuration
- [`backend/.env`](backend/.env) - Backend config
- [`frontend/.env.local`](frontend/.env.local) - Frontend config
- [`backend/prisma/schema.prisma`](backend/prisma/schema.prisma) - Database schema

### Documentation
- [`APP_READY.md`](APP_READY.md) - Getting started
- [`COMPLETION_SUMMARY.md`](COMPLETION_SUMMARY.md) - Full completion status
- [`README.md`](README.md) - Main documentation

---

## 🎯 Quick Test Flow

1. **Start**: Run `START_APP.bat`
2. **Sign Up**: Create account at http://localhost:3000/signup
3. **Login**: Log in with credentials
4. **Upload**: Go to "Send File" and upload a file
5. **Encrypt**: File is automatically encrypted
6. **Send**: Select recipient and send
7. **Receive**: Recipient sees notification
8. **Decrypt**: Enter key and download

---

## 🔐 Default Credentials

No default credentials - create your own account!

**First User:**
- Email: your@email.com
- Username: yourname
- Password: (min 6 characters)

---

## 🛠️ Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000 (frontend)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Kill process on port 5000 (backend)
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Reset Database
```bash
cd backend
del prisma\prisma\dev.db
npx prisma migrate dev --name init
```

### Reinstall Dependencies
```bash
# Root
npm install

# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

---

## 📊 Project Structure

```
Privora 14/
├── backend/              # Express.js API
│   ├── src/             # Source code
│   ├── prisma/          # Database
│   └── .env             # Config
├── frontend/            # Next.js app
│   ├── src/             # Source code
│   └── .env.local       # Config
└── START_APP.bat        # Start script
```

---

## 🎨 Tech Stack

**Frontend:** Next.js 14, TypeScript, Tailwind CSS, Socket.IO Client
**Backend:** Express.js, Socket.IO, Prisma, SQLite
**Security:** AES-256-GCM, JWT, bcrypt

---

## 📞 Support

- **Documentation**: See [`README.md`](README.md)
- **Troubleshooting**: See [`DIAGNOSIS.md`](DIAGNOSIS.md)
- **Deployment**: See [`VERCEL_DEPLOYMENT.md`](VERCEL_DEPLOYMENT.md)

---

## ✅ Status: READY TO USE

All features implemented and tested!

**Start now:** `START_APP.bat`
