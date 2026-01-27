import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { io } from '../index';

const router = Router();
const prisma = new PrismaClient();

// Create file transfer
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { fileId, receiverId } = req.body;

    if (!fileId || !receiverId) {
      return res.status(400).json({ error: 'File ID and receiver ID are required' });
    }

    // Verify file exists and belongs to sender
    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    if (file.userId !== req.user.id) {
      return res.status(403).json({ error: 'You can only send your own files' });
    }

    // Verify receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!receiver) {
      return res.status(404).json({ error: 'Receiver not found' });
    }

    // Create transfer
    const transfer = await prisma.fileTransfer.create({
      data: {
        fileId,
        senderId: req.user.id,
        receiverId,
        status: 'pending',
      },
      include: {
        file: {
          select: {
            id: true,
            originalName: true,
            size: true,
            mimeType: true,
          },
        },
        sender: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    // Notify receiver via Socket.IO
    const receiverOnline = await prisma.onlineUser.findUnique({
      where: { userId: receiverId },
    });

    if (receiverOnline) {
      io.to(receiverOnline.socketId).emit('file-received', {
        transfer: {
          id: transfer.id,
          file: transfer.file,
          sender: transfer.sender,
          sentAt: transfer.sentAt,
        },
      });
    }

    res.status(201).json({
      message: 'File transfer created successfully',
      transfer: {
        id: transfer.id,
        file: transfer.file,
        receiver: {
          id: receiver.id,
          username: receiver.username,
          email: receiver.email,
        },
        status: transfer.status,
        sentAt: transfer.sentAt,
      },
    });
  } catch (error) {
    console.error('Create transfer error:', error);
    res.status(500).json({ error: 'Failed to create transfer' });
  }
});

// Get sent transfers
router.get('/sent', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const transfers = await prisma.fileTransfer.findMany({
      where: { senderId: req.user.id },
      include: {
        file: {
          select: {
            id: true,
            originalName: true,
            size: true,
            mimeType: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: { sentAt: 'desc' },
    });

    res.json({ transfers });
  } catch (error) {
    console.error('Get sent transfers error:', error);
    res.status(500).json({ error: 'Failed to get sent transfers' });
  }
});

// Get received transfers
router.get('/received', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const transfers = await prisma.fileTransfer.findMany({
      where: { receiverId: req.user.id },
      include: {
        file: {
          select: {
            id: true,
            originalName: true,
            size: true,
            mimeType: true,
          },
        },
        sender: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      orderBy: { sentAt: 'desc' },
    });

    res.json({ transfers });
  } catch (error) {
    console.error('Get received transfers error:', error);
    res.status(500).json({ error: 'Failed to get received transfers' });
  }
});

// Update transfer status
router.patch('/:transferId/status', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { transferId } = req.params;
    const { status } = req.body;

    if (!status || !['received', 'decrypted'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const transfer = await prisma.fileTransfer.findUnique({
      where: { id: transferId },
    });

    if (!transfer) {
      return res.status(404).json({ error: 'Transfer not found' });
    }

    // Only receiver can update status
    if (transfer.receiverId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updateData: any = { status };
    if (status === 'received' && !transfer.receivedAt) {
      updateData.receivedAt = new Date();
    }
    if (status === 'decrypted' && !transfer.decryptedAt) {
      updateData.decryptedAt = new Date();
    }

    const updatedTransfer = await prisma.fileTransfer.update({
      where: { id: transferId },
      data: updateData,
    });

    res.json({
      message: 'Transfer status updated',
      transfer: updatedTransfer,
    });
  } catch (error) {
    console.error('Update transfer status error:', error);
    res.status(500).json({ error: 'Failed to update transfer status' });
  }
});

// Get transfer history (both sent and received)
router.get('/history', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const [sent, received] = await Promise.all([
      prisma.fileTransfer.findMany({
        where: { senderId: req.user.id },
        include: {
          file: {
            select: {
              id: true,
              originalName: true,
              size: true,
              mimeType: true,
            },
          },
          receiver: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
        orderBy: { sentAt: 'desc' },
        take: 50,
      }),
      prisma.fileTransfer.findMany({
        where: { receiverId: req.user.id },
        include: {
          file: {
            select: {
              id: true,
              originalName: true,
              size: true,
              mimeType: true,
            },
          },
          sender: {
            select: {
              id: true,
              username: true,
              email: true,
            },
          },
        },
        orderBy: { sentAt: 'desc' },
        take: 50,
      }),
    ]);

    res.json({
      sent,
      received,
      total: sent.length + received.length,
    });
  } catch (error) {
    console.error('Get transfer history error:', error);
    res.status(500).json({ error: 'Failed to get transfer history' });
  }
});

export default router;
