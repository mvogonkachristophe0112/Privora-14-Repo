import { describe, it, expect, beforeAll } from '@jest/globals';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const API_URL = 'http://localhost:5000';
let authToken: string;
let userId: string;

describe('File Upload Module - Unit Tests', () => {
  beforeAll(async () => {
    // Create test user and get token
    const response = await request(API_URL)
      .post('/api/auth/register')
      .send({
        email: 'filetest@example.com',
        username: 'filetest',
        password: 'test123',
      });
    
    authToken = response.body.token;
    userId = response.body.user.id;
  });

  it('should upload file successfully with valid authentication', async () => {
    const testFile = Buffer.from('Test file content');
    
    const response = await request(API_URL)
      .post('/api/files/upload')
      .set('Authorization', `Bearer ${authToken}`)
      .attach('file', testFile, 'test.txt')
      .field('originalName', 'test.txt')
      .field('mimeType', 'text/plain');

    expect(response.status).toBe(200);
    expect(response.body.file).toHaveProperty('id');
    expect(response.body.file.originalName).toBe('test.txt');
  });

  it('should reject file upload without authentication', async () => {
    const testFile = Buffer.from('Test file content');
    
    const response = await request(API_URL)
      .post('/api/files/upload')
      .attach('file', testFile, 'test.txt');

    expect(response.status).toBe(401);
  });

  it('should reject file upload exceeding size limit', async () => {
    const largeFile = Buffer.alloc(101 * 1024 * 1024); // 101MB
    
    const response = await request(API_URL)
      .post('/api/files/upload')
      .set('Authorization', `Bearer ${authToken}`)
      .attach('file', largeFile, 'large.bin');

    expect(response.status).toBe(413);
  });

  it('should list user files correctly', async () => {
    const response = await request(API_URL)
      .get('/api/files')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('files');
    expect(Array.isArray(response.body.files)).toBe(true);
  });

  it('should download file with valid authentication', async () => {
    // First upload a file
    const testFile = Buffer.from('Download test content');
    const uploadResponse = await request(API_URL)
      .post('/api/files/upload')
      .set('Authorization', `Bearer ${authToken}`)
      .attach('file', testFile, 'download-test.txt')
      .field('originalName', 'download-test.txt')
      .field('mimeType', 'text/plain');

    const fileId = uploadResponse.body.file.id;

    // Then download it
    const downloadResponse = await request(API_URL)
      .get(`/api/files/download/${fileId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(downloadResponse.status).toBe(200);
    expect(downloadResponse.body).toBeDefined();
  });
});
