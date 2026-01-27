import { Server, Socket } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

interface AuthenticatedSocket extends Socket {
  userId?: string;
  username?: string;
  email?: string;
}

export const setupSocketHandlers = (io: Server) => {
  // Authentication middleware for Socket.IO
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return next(new Error('Authentication required'));
      }

      if (!process.env.JWT_SECRET) {
        return next(new Error('JWT_SECRET not configured'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        id: string;
        email: string;
        username: string;
      };

      // Verify user exists
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user.id;
      socket.username = user.username;
      socket.email = user.email;

      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', async (socket: AuthenticatedSocket) => {
    console.log(`User connected: ${socket.username} (${socket.id})`);

    if (!socket.userId || !socket.username || !socket.email) {
      socket.disconnect();
      return;
    }

    try {
      // Add user to online users
      await prisma.onlineUser.upsert({
        where: { userId: socket.userId },
        update: {
          socketId: socket.id,
          lastSeen: new Date(),
        },
        create: {
          userId: socket.userId,
          socketId: socket.id,
          username: socket.username,
          email: socket.email,
        },
      });

      // Get all online users
      const onlineUsers = await prisma.onlineUser.findMany({
        select: {
          userId: true,
          username: true,
          email: true,
          connectedAt: true,
        },
      });

      // Broadcast updated online users list to all clients
      io.emit('online-users-updated', { onlineUsers });

      // Send current online users to the newly connected user
      socket.emit('online-users', { onlineUsers });

      // Handle heartbeat to update last seen
      socket.on('heartbeat', async () => {
        try {
          if (socket.userId) {
            await prisma.onlineUser.update({
              where: { userId: socket.userId },
              data: { lastSeen: new Date() },
            });
          }
        } catch (error) {
          console.error('Heartbeat error:', error);
        }
      });

      // Handle file transfer notification
      socket.on('file-sent', async (data: { transferId: string; receiverId: string }) => {
        try {
          const receiverOnline = await prisma.onlineUser.findUnique({
            where: { userId: data.receiverId },
          });

          if (receiverOnline) {
            io.to(receiverOnline.socketId).emit('file-received', {
              transferId: data.transferId,
              senderId: socket.userId,
              senderUsername: socket.username,
            });
          }
        } catch (error) {
          console.error('File sent notification error:', error);
        }
      });

      // Handle typing indicator
      socket.on('typing', (data: { receiverId: string }) => {
        prisma.onlineUser.findUnique({
          where: { userId: data.receiverId },
        }).then((receiver) => {
          if (receiver) {
            io.to(receiver.socketId).emit('user-typing', {
              userId: socket.userId,
              username: socket.username,
            });
          }
        }).catch((error) => {
          console.error('Typing indicator error:', error);
        });
      });

      // Handle disconnect
      socket.on('disconnect', async () => {
        console.log(`User disconnected: ${socket.username} (${socket.id})`);

        try {
          if (socket.userId) {
            // Remove from online users
            await prisma.onlineUser.delete({
              where: { userId: socket.userId },
            }).catch(() => {
              // User might already be deleted
            });

            // Get updated online users list
            const onlineUsers = await prisma.onlineUser.findMany({
              select: {
                userId: true,
                username: true,
                email: true,
                connectedAt: true,
              },
            });

            // Broadcast updated list
            io.emit('online-users-updated', { onlineUsers });
          }
        } catch (error) {
          console.error('Disconnect handler error:', error);
        }
      });

    } catch (error) {
      console.error('Connection handler error:', error);
      socket.disconnect();
    }
  });

  // Cleanup stale connections every 5 minutes
  setInterval(async () => {
    try {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      
      await prisma.onlineUser.deleteMany({
        where: {
          lastSeen: {
            lt: fiveMinutesAgo,
          },
        },
      });

      const onlineUsers = await prisma.onlineUser.findMany({
        select: {
          userId: true,
          username: true,
          email: true,
          connectedAt: true,
        },
      });

      io.emit('online-users-updated', { onlineUsers });
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }, 5 * 60 * 1000);
};
