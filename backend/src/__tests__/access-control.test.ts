import { describe, it, expect, beforeAll } from '@jest/globals';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const API_URL = 'http://localhost:5000';
let user1Token: string;
let user2Token: string;
let user1Id: string;
let user2Id: string;
let user1FileId: string;

describe('Access Control - Unit Tests', () => {
  beforeAll(async () => {
    // Create two test users
    const user1Response = await request(API_URL)
      .post('/api/auth/register')
      .send({
        email: 'user1@example.com',
        username: 'user1',
        password: 'pass123',
      });
    
    const user2Response = await request(API_URL)
      .post('/api/auth/register')
      .send({
        email: 'user2@example.com',
        username: 'user2',
        password: 'pass123',
      });

    user1Token = user1Response.body.token;
    user2Token = user2Response.body.token;
    user1Id = user1Response.body.user.id;
    user2Id = user2Response.body.user.id;

    // Upload file as user1
    const fileResponse = await request(API_URL)
      .post('/api/files/upload')
      .set('Authorization', `Bearer ${user1Token}`)
      .attach('file', Buffer.from('Private content'), 'private.txt')
      .field('originalName', 'private.txt')
      .field('mimeType', 'text/plain');

    user1FileId = fileResponse.body.file.id;
  });

  it('should allow user to access their own files', async () => {
    const response = await request(API_URL)
      .get('/api/files')
      .set('Authorization', `Bearer ${user1Token}`);

    expect(response.status).toBe(200);
    expect(response.body.files.length).toBeGreaterThan(0);
  });

  it('should prevent unauthorized access to files', async () => {
    const response = await request(API_URL)
      .get('/api/files');

    expect(response.status).toBe(401);
  });

  it('should allow user to delete their own files', async () => {
    const response = await request(API_URL)
      .delete(`/api/files/${user1FileId}`)
      .set('Authorization', `Bearer ${user1Token}`);

    expect(response.status).toBe(200);
  });

  it('should prevent user from deleting other users files', async () => {
    // Upload file as user1
    const fileResponse = await request(API_URL)
      .post('/api/files/upload')
      .set('Authorization', `Bearer ${user1Token}`)
      .attach('file', Buffer.from('Content'), 'file.txt')
      .field('originalName', 'file.txt')
      .field('mimeType', 'text/plain');

    const fileId = fileResponse.body.file.id;

    // Try to delete as user2
    const deleteResponse = await request(API_URL)
      .delete(`/api/files/${fileId}`)
      .set('Authorization', `Bearer ${user2Token}`);

    expect(deleteResponse.status).toBe(403);
  });

  it('should only show files sent to specific user', async () => {
    const response = await request(API_URL)
      .get('/api/transfers/received')
      .set('Authorization', `Bearer ${user2Token}`);

    expect(response.status).toBe(200);
    // User2 should only see files sent to them, not all files
    const transfers = response.body.transfers;
    transfers.forEach((transfer: any) => {
      expect(transfer.receiverId).toBe(user2Id);
    });
  });

  it('should enforce JWT token validation', async () => {
    const response = await request(API_URL)
      .get('/api/files')
      .set('Authorization', 'Bearer invalid-token');

    expect(response.status).toBe(401);
  });
});
