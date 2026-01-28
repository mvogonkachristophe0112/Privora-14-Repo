import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const API_URL = 'http://localhost:5000';

describe('Authentication Module - Unit Tests', () => {
  beforeAll(async () => {
    // Clean up test data
    await prisma.user.deleteMany({
      where: { email: { contains: 'test' } }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should authenticate valid user with correct credentials', async () => {
    // Create test user
    const hashedPassword = await bcrypt.hash('testpass123', 10);
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        username: 'testuser',
        password: hashedPassword,
      },
    });

    const response = await request(API_URL)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'testpass123',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user.email).toBe('test@example.com');
  });

  it('should reject invalid password', async () => {
    const response = await request(API_URL)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  it('should reject non-existent user', async () => {
    const response = await request(API_URL)
      .post('/api/auth/login')
      .send({
        email: 'nonexistent@example.com',
        password: 'anypassword',
      });

    expect(response.status).toBe(401);
  });

  it('should register new user successfully', async () => {
    const response = await request(API_URL)
      .post('/api/auth/register')
      .send({
        email: 'newuser@example.com',
        username: 'newuser',
        password: 'newpass123',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user.email).toBe('newuser@example.com');
  });

  it('should prevent duplicate email registration', async () => {
    const response = await request(API_URL)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        username: 'anotheruser',
        password: 'password123',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('already registered');
  });
});
