import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { UploadedFile } from 'express-fileupload';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const prisma = new PrismaClient();

// Upload encrypted file
router.post('/upload', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    if (!req.files || !req.files.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.files.file as UploadedFile;
    const { originalName, mimeType } = req.body;

    if (!originalName || !mimeType) {
      return res.status(400).json({ error: 'Missing file metadata' });
    }

    // Generate unique filename
    const encryptedName = `${uuidv4()}${path.extname(originalName)}`;
    const uploadPath = path.join(__dirname, '../../uploads', encryptedName);

    // Save file
    await file.mv(uploadPath);

    // Create database record
    const fileRecord = await prisma.file.create({
      data: {
        originalName,
        encryptedName,
        size: file.size,
        mimeType,
        encryptedPath: uploadPath,
        userId: req.user.id,
      },
    });

    res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        id: fileRecord.id,
        originalName: fileRecord.originalName,
        size: fileRecord.size,
        mimeType: fileRecord.mimeType,
        uploadedAt: fileRecord.uploadedAt,
      },
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
});

// Get user's files
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const files = await prisma.file.findMany({
      where: { userId: req.user.id },
      select: {
        id: true,
        originalName: true,
        size: true,
        mimeType: true,
        uploadedAt: true,
      },
      orderBy: { uploadedAt: 'desc' },
    });

    res.json({ files });
  } catch (error) {
    console.error('Get files error:', error);
    res.status(500).json({ error: 'Failed to get files' });
  }
});

// Download encrypted file
router.get('/download/:fileId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { fileId } = req.params;

    const file = await prisma.file.findUnique({
      where: { id: fileId },
      include: {
        transfers: {
          where: {
            OR: [
              { senderId: req.user.id },
              { receiverId: req.user.id },
            ],
          },
        },
      },
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Check if user has access (owner or recipient)
    const hasAccess =
      file.userId === req.user?.id ||
      file.transfers.some(
        (t) => t.senderId === req.user?.id || t.receiverId === req.user?.id
      );

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Check if file exists
    if (!fs.existsSync(file.encryptedPath)) {
      return res.status(404).json({ error: 'File not found on server' });
    }

    // Send file
    res.download(file.encryptedPath, file.encryptedName);
  } catch (error) {
    console.error('File download error:', error);
    res.status(500).json({ error: 'File download failed' });
  }
});

// Delete file
router.delete('/:fileId', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const { fileId } = req.params;

    const file = await prisma.file.findUnique({
      where: { id: fileId },
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Check if user owns the file
    if (file.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Delete file from filesystem
    if (fs.existsSync(file.encryptedPath)) {
      fs.unlinkSync(file.encryptedPath);
    }

    // Delete from database (cascades to transfers)
    await prisma.file.delete({
      where: { id: fileId },
    });

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('File delete error:', error);
    res.status(500).json({ error: 'File deletion failed' });
  }
});

export default router;
