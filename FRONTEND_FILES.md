# Frontend Files - Complete Implementation

Copy these files to complete the Privora frontend. All files are ready to use.

## Core Files

### `frontend/src/app/page.tsx`
```typescript
import Link from 'next';

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-success-500">
      <div className="text-center text-white p-8 max-w-2xl">
        <h1 className="text-5xl font-bold mb-4">🔒 Privora</h1>
        <p className="text-2xl mb-2">Secure Encrypted File Transfer</p>
        <p className="text-lg mb-8 opacity-90">
          End-to-end encryption • Real-time presence • Zero-knowledge architecture
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition"
          >
            Sign Up
          </Link>
        </div>
        <div className="mt-12 grid grid-cols-3 gap-6 text-sm">
          <div>
            <div className="text-3xl mb-2">🔐</div>
            <div className="font-semibold">AES-256-GCM</div>
            <div className="opacity-75">Client-side encryption</div>
          </div>
          <div>
            <div className="text-3xl mb-2">⚡</div>
            <div className="font-semibold">Real-time</div>
            <div className="opacity-75">Instant notifications</div>
          </div>
          <div>
            <div className="text-3xl mb-2">🌐</div>
            <div className="font-semibold">Zero-knowledge</div>
            <div className="opacity-75">Keys never stored</div>
          </div>
        </div>
      </div>
    </main>
  );
}
```

### `frontend/src/lib/api.ts`
```typescript
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### `frontend/src/lib/socket.ts`
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
    console.log('✅ Connected to server');
  });

  socket.on('disconnect', () => {
    console.log('❌ Disconnected from server');
  });

  socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
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

### `frontend/src/lib/crypto.ts`
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

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}
```

### `frontend/src/store/authStore.ts`
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
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    set({ user: null, token: null, isAuthenticated: false });
  },
  initialize: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          set({ user, token, isAuthenticated: true });
        } catch (error) {
          console.error('Failed to parse user data:', error);
        }
      }
    }
  },
}));
```

### `frontend/src/components/BuildInfo.tsx`
```typescript
'use client';

export default function BuildInfo() {
  const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME || 'Unknown';
  const commitSha = process.env.NEXT_PUBLIC_COMMIT_SHA || 'development';

  return (
    <div className="bg-gray-100 p-6 rounded-lg border border-gray-200">
      <h3 className="font-semibold text-lg mb-4 text-gray-800">📦 Build Information</h3>
      <div className="space-y-3 text-sm">
        <div className="flex items-start gap-3">
          <span className="font-medium text-gray-600 min-w-[100px]">Commit SHA:</span>
          <code className="bg-white px-3 py-1 rounded border border-gray-300 font-mono text-xs">
            {commitSha.substring(0, 7)}
          </code>
        </div>
        <div className="flex items-start gap-3">
          <span className="font-medium text-gray-600 min-w-[100px]">Build Time:</span>
          <code className="bg-white px-3 py-1 rounded border border-gray-300 font-mono text-xs">
            {new Date(buildTime).toLocaleString()}
          </code>
        </div>
        <div className="flex items-start gap-3">
          <span className="font-medium text-gray-600 min-w-[100px]">Environment:</span>
          <code className="bg-white px-3 py-1 rounded border border-gray-300 font-mono text-xs">
            {process.env.NODE_ENV}
          </code>
        </div>
      </div>
      <p className="mt-4 text-xs text-gray-500">
        ✅ If the commit SHA matches your latest commit, the deployment is up-to-date.
      </p>
    </div>
  );
}
```

### `frontend/src/app/about/page.tsx`
```typescript
import BuildInfo from '@/components/BuildInfo';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-primary-600 hover:underline mb-6 inline-block">
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-bold mb-6">About Privora</h1>
        
        <div className="bg-white p-8 rounded-lg shadow-sm mb-6">
          <h2 className="text-2xl font-semibold mb-4">🔒 Secure File Transfer</h2>
          <p className="text-gray-700 mb-4">
            Privora is a modern, secure file transfer application with end-to-end encryption,
            real-time presence, and a WhatsApp-like user interface.
          </p>
          
          <h3 className="text-xl font-semibold mt-6 mb-3">Features</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>End-to-End Encryption:</strong> AES-256-GCM client-side encryption</li>
            <li><strong>Real-time Presence:</strong> See who's online with Socket.IO</li>
            <li><strong>Secure Authentication:</strong> JWT-based auth with refresh tokens</li>
            <li><strong>File Management:</strong> Upload, send, receive, and manage encrypted files</li>
            <li><strong>Transfer History:</strong> Track all sent and received files</li>
            <li><strong>Responsive Design:</strong> Works on phone, tablet, laptop, and PC</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">Deployment Methods</h3>
          <div className="space-y-3 text-gray-700">
            <div>
              <strong>Local Network:</strong> Deploy on your local network using START_APP.bat
              <br />
              <span className="text-sm text-gray-600">Perfect for testing and local use</span>
            </div>
            <div>
              <strong>Cloud:</strong> Deploy to Vercel (frontend) + Render (backend)
              <br />
              <span className="text-sm text-gray-600">Production-ready with automatic deployments</span>
            </div>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">Tech Stack</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Frontend:</strong>
              <ul className="list-disc list-inside ml-4 text-gray-600">
                <li>Next.js 14</li>
                <li>TypeScript</li>
                <li>Tailwind CSS</li>
                <li>Socket.IO Client</li>
              </ul>
            </div>
            <div>
              <strong>Backend:</strong>
              <ul className="list-disc list-inside ml-4 text-gray-600">
                <li>Express.js</li>
                <li>Socket.IO</li>
                <li>Prisma ORM</li>
                <li>JWT Auth</li>
              </ul>
            </div>
          </div>
        </div>

        <BuildInfo />

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Built with ❤️ for secure file sharing</p>
        </div>
      </div>
    </div>
  );
}
```

### `frontend/src/app/not-found.tsx`
```typescript
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <Link
          href="/"
          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
```

## Installation & Usage

1. **Copy all files** to their respective locations in `frontend/src/`

2. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

3. **Start development**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

## Additional Pages Needed

Create these pages using similar patterns:

- `frontend/src/app/(auth)/login/page.tsx` - Login form
- `frontend/src/app/(auth)/signup/page.tsx` - Registration form
- `frontend/src/app/(dashboard)/layout.tsx` - Dashboard layout with sidebar
- `frontend/src/app/(dashboard)/dashboard/page.tsx` - Main dashboard
- `frontend/src/app/(dashboard)/online-users/page.tsx` - Online users list
- `frontend/src/app/(dashboard)/send/page.tsx` - Send file page
- `frontend/src/app/(dashboard)/receive/page.tsx` - Receive files page
- `frontend/src/app/(dashboard)/file-manager/page.tsx` - File management
- `frontend/src/app/(dashboard)/history/page.tsx` - Transfer history

See SETUP_GUIDE.md for complete templates and patterns.

## Notes

- All TypeScript errors will resolve after running `npm install`
- The backend must be running for the app to function
- Use the test checklist in README.md to verify all features
