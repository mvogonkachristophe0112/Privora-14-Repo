# Complete Setup Guide for Privora

This guide will help you complete the setup of the Privora secure file transfer application.

## Current Status

✅ **Completed:**
- Project structure created
- Backend fully implemented (Express + Socket.IO + Prisma)
- Deployment documentation (local + cloud)
- Batch scripts for Windows
- GitHub Actions workflow
- Configuration files (Next.js, Tailwind, TypeScript, etc.)
- Comprehensive README with test checklist

⚠️ **Remaining:**
- Frontend React components and pages
- Frontend utilities (API client, Socket.IO client, encryption)
- State management (Zustand stores)

## Quick Setup (Get Running Fast)

### Step 1: Install Dependencies

```bash
# Install all dependencies
npm run install:all

# This will install:
# - Root dependencies
# - Backend dependencies  
# - Frontend dependencies
```

### Step 2: Setup Environment

```bash
# Copy environment files
copy .env.example .env
copy backend\.env.example backend\.env
copy frontend\.env.example frontend\.env.local

# Edit .env files with your configuration
# For local development, defaults should work
```

### Step 3: Setup Database

```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
cd ..
```

### Step 4: Start Development

```bash
# Option A: Use batch script (Windows)
START_APP.bat

# Option B: Manual start
npm run dev
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Frontend Implementation Guide

The frontend structure is set up, but you need to create the React components and pages. Here's what needs to be created:

### Required Frontend Files

#### 1. Global Styles
**File:** `frontend/src/app/globals.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  max-width: 100vw;
  overflow-x: hidden;
  font-size: 14px;
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

#### 2. Root Layout
**File:** `frontend/src/app/layout.tsx`
```typescript
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Privora - Secure File Transfer',
  description: 'End-to-end encrypted file transfer with real-time presence',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
```

#### 3. Home Page
**File:** `frontend/src/app/page.tsx`
```typescript
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-success-500">
      <div className="text-center text-white p-8">
        <h1 className="text-4xl font-bold mb-4">Privora</h1>
        <p className="text-xl mb-8">Secure Encrypted File Transfer</p>
        <div className="space-x-4">
          <Link
            href="/login"
            className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  );
}
```

#### 4. API Client
**File:** `frontend/src/lib/api.ts`
```typescript
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

#### 5. Socket.IO Client
**File:** `frontend/src/lib/socket.ts`
```typescript
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

let socket: Socket | null = null;

export const connectSocket = (token: string) => {
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
  });

  socket.on('connect', () => {
    console.log('Connected to server');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;
```

#### 6. Encryption Utilities
**File:** `frontend/src/lib/crypto.ts`
```typescript
export async function encryptFile(file: File): Promise<{
  encryptedData: ArrayBuffer;
  key: string;
  iv: string;
}> {
  const key = await crypto.subtle.generateKey(
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const fileData = await file.arrayBuffer();

  const encryptedData = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    fileData
  );

  const exportedKey = await crypto.subtle.exportKey('raw', key);
  const keyHex = Array.from(new Uint8Array(exportedKey))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  const ivHex = Array.from(iv)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return { encryptedData, key: keyHex, iv: ivHex };
}

export async function decryptFile(
  encryptedData: ArrayBuffer,
  keyHex: string,
  ivHex: string
): Promise<ArrayBuffer> {
  const keyBytes = new Uint8Array(
    keyHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );
  const ivBytes = new Uint8Array(
    ivHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );

  const key = await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  return await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: ivBytes },
    key,
    encryptedData
  );
}
```

#### 7. Auth Store
**File:** `frontend/src/store/authStore.ts`
```typescript
import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  setAuth: (user, token) => {
    localStorage.setItem('token', token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));
```

#### 8. BuildInfo Component
**File:** `frontend/src/components/BuildInfo.tsx`
```typescript
'use client';

export default function BuildInfo() {
  const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME || 'Unknown';
  const commitSha = process.env.NEXT_PUBLIC_COMMIT_SHA || 'Unknown';

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h3 className="font-semibold mb-2">Build Information</h3>
      <div className="text-sm space-y-1">
        <p>
          <span className="font-medium">Commit SHA:</span>{' '}
          <code className="bg-gray-200 px-2 py-1 rounded">{commitSha.substring(0, 7)}</code>
        </p>
        <p>
          <span className="font-medium">Build Time:</span>{' '}
          <code className="bg-gray-200 px-2 py-1 rounded">
            {new Date(buildTime).toLocaleString()}
          </code>
        </p>
        <p>
          <span className="font-medium">Environment:</span>{' '}
          <code className="bg-gray-200 px-2 py-1 rounded">
            {process.env.NODE_ENV}
          </code>
        </p>
      </div>
    </div>
  );
}
```

### Complete Frontend Structure

You need to create these directories and files:

```
frontend/src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── online-users/
│   │   │   └── page.tsx
│   │   ├── send/
│   │   │   └── page.tsx
│   │   ├── receive/
│   │   │   └── page.tsx
│   │   ├── file-manager/
│   │   │   └── page.tsx
│   │   └── history/
│   │       └── page.tsx
│   ├── about/
│   │   └── page.tsx
│   ├── not-found.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Modal.tsx
│   ├── BuildInfo.tsx
│   ├── Sidebar.tsx
│   ├── Topbar.tsx
│   └── FileCard.tsx
├── lib/
│   ├── api.ts
│   ├── socket.ts
│   ├── crypto.ts
│   └── utils.ts
├── store/
│   ├── authStore.ts
│   └── socketStore.ts
└── types/
    └── index.ts
```

## Using AI to Generate Frontend Files

Since this is a large project, you can use AI tools to generate the remaining frontend files. Here's a prompt you can use:

```
Create a complete Next.js 14 App Router page for [PAGE_NAME] with:
- TypeScript
- Tailwind CSS (compact, 14px base font)
- Blue (#1890ff) + Green (#52c41a) theme
- WhatsApp-like UI
- Mobile responsive
- Uses Zustand for state
- Uses axios for API calls
- Uses Socket.IO for real-time
- Includes loading states
- Includes error handling
- Uses react-hot-toast for notifications

The page should [DESCRIBE FUNCTIONALITY]
```

## Testing the Application

Once you have the frontend files created:

### 1. Start the Application

```bash
START_APP.bat
```

### 2. Test Authentication

1. Go to http://localhost:3000
2. Click "Sign Up"
3. Create an account
4. Login with credentials

### 3. Test Real-Time Presence

1. Open two browser windows
2. Login with different accounts
3. Check Online Users page
4. Verify both users appear

### 4. Test File Transfer

1. User A: Upload a file
2. User A: Select User B as recipient
3. User A: Send file
4. User B: Check Receive page
5. User B: Enter decryption key
6. User B: Download/preview file

### 5. Test All Pages

Use the test checklist in README.md

## Deployment

### Local Network

```bash
# 1. Find your IP
ipconfig

# 2. Update .env
API_URL=http://YOUR_IP:5000
FRONTEND_URL=http://YOUR_IP:3000

# 3. Start
START_APP.bat

# 4. Access from other devices
http://YOUR_IP:3000
```

### Cloud (Vercel + Render)

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

## Troubleshooting

### Dependencies Not Installing

```bash
# Clear caches
rm -rf node_modules frontend/node_modules backend/node_modules
rm package-lock.json frontend/package-lock.json backend/package-lock.json

# Reinstall
npm run install:all
```

### Database Issues

```bash
cd backend
del prisma\dev.db
npx prisma generate
npx prisma migrate dev --name init
```

### Port Already in Use

Edit `.env` and change ports:
```
PORT=5001
```

### TypeScript Errors

These are expected until dependencies are installed:
```bash
cd frontend && npm install
cd ../backend && npm install
```

## Next Steps

1. **Install Dependencies**: `npm run install:all`
2. **Create Frontend Files**: Use the templates above or AI generation
3. **Test Locally**: Follow the test checklist
4. **Deploy**: Use deployment guides
5. **Monitor**: Check BuildInfo after deployment

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Socket.IO](https://socket.io/docs/v4/)
- [Prisma](https://www.prisma.io/docs)
- [Vercel](https://vercel.com/docs)
- [Render](https://render.com/docs)

## Support

- Check [DIAGNOSIS.md](./DIAGNOSIS.md) for common issues
- Review [README.md](./README.md) for full documentation
- See deployment guides for cloud setup

---

**You're almost there! The backend is complete and ready. Just add the frontend components and you'll have a fully functional secure file transfer application.**
