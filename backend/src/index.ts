import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import path from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth';
import fileRoutes from './routes/files';
import userRoutes from './routes/users';
import transferRoutes from './routes/transfers';

// Import socket handlers
import { setupSocketHandlers } from './socket/handlers';

// Create Express app
const app = express();
const httpServer = createServer(app);

// Setup Socket.IO with CORS
const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      // Allow all origins for local network deployment
      callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: (origin, callback) => {
    // Allow all origins for local network deployment
    callback(null, true);
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File upload middleware
app.use(fileUpload({
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE || '104857600') }, // 100MB default
  abortOnLimit: true,
  createParentPath: true,
}));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Get server IP endpoint
app.get('/api/server-info', (_req, res) => {
  const os = require('os');
  const networkInterfaces = os.networkInterfaces();
  let serverIP = 'localhost';
  
  // Find the first non-internal IPv4 address
  for (const name of Object.keys(networkInterfaces)) {
    for (const net of networkInterfaces[name] || []) {
      if (net.family === 'IPv4' && !net.internal) {
        serverIP = net.address;
        break;
      }
    }
    if (serverIP !== 'localhost') break;
  }
  
  res.json({
    serverIP,
    frontendURL: `http://${serverIP}:3000`,
    backendURL: `http://${serverIP}:5000`,
    socketURL: `http://${serverIP}:5000`,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transfers', transferRoutes);

// Setup Socket.IO handlers
setupSocketHandlers(io);

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

httpServer.listen(Number(PORT), HOST, () => {
  console.log(`
╔════════════════════════════════════════╗
║   Privora Backend Server Started      ║
╚════════════════════════════════════════╝

🚀 Server running on: http://${HOST}:${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
🔌 Socket.IO ready
📁 Uploads directory: ${uploadsDir}
🔒 CORS origin: ${process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:3000'}

Health check: http://${HOST}:${PORT}/health
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  httpServer.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export { io };
