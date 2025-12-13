import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

describe('Sweets Endpoints', () => {
  let token: string;
  let adminToken: string;

  beforeAll(async () => {
    await prisma.sweet.deleteMany();
    await prisma.user.deleteMany();

    // Create User
    const user = await prisma.user.create({
      data: { email: 'user@example.com', password: 'password', role: 'USER' }
    });
    token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET);

    // Create Admin
    const admin = await prisma.user.create({
      data: { email: 'admin@example.com', password: 'password', role: 'ADMIN' }
    });
    adminToken = jwt.sign({ userId: admin.id, role: admin.role }, JWT_SECRET);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a new sweet (Protected)', async () => {
    const res = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.5,
        quantity: 100
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.name).toEqual('Chocolate Bar');
  });

  it('should get all sweets', async () => {
    const res = await request(app)
      .get('/api/sweets')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should search sweets', async () => {
    const res = await request(app)
      .get('/api/sweets/search?q=Chocolate')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body[0].name).toEqual('Chocolate Bar');
  });

  it('should update a sweet', async () => {
    const sweet = await prisma.sweet.findFirst();
    const res = await request(app)
      .put(`/api/sweets/${sweet?.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ price: 3.0 });
    expect(res.statusCode).toEqual(200);
    expect(res.body.price).toEqual(3.0);
  });

  it('should delete a sweet (Admin only)', async () => {
    const sweet = await prisma.sweet.create({
      data: { name: 'To Delete', category: 'Test', price: 1, quantity: 1 }
    });
    
    // User try
    const resUser = await request(app)
      .delete(`/api/sweets/${sweet.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(resUser.statusCode).toEqual(403);

    // Admin try
    const resAdmin = await request(app)
      .delete(`/api/sweets/${sweet.id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(resAdmin.statusCode).toEqual(200);
  });
});
