import request from 'supertest';
import app from '../app';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

describe('Inventory Endpoints', () => {
  let token: string;
  let adminToken: string;
  let sweetId: number;

  beforeAll(async () => {
    await prisma.sweet.deleteMany();
    await prisma.user.deleteMany();

    const user = await prisma.user.create({
      data: { email: 'user@example.com', password: 'password', role: 'USER' }
    });
    token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET);

    const admin = await prisma.user.create({
      data: { email: 'admin@example.com', password: 'password', role: 'ADMIN' }
    });
    adminToken = jwt.sign({ userId: admin.id, role: admin.role }, JWT_SECRET);

    const sweet = await prisma.sweet.create({
      data: { name: 'Test Sweet', category: 'Test', price: 1, quantity: 10 }
    });
    sweetId = sweet.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should purchase a sweet', async () => {
    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.quantity).toEqual(9);
  });

  it('should not purchase if out of stock', async () => {
    // Set quantity to 0
    await prisma.sweet.update({ where: { id: sweetId }, data: { quantity: 0 } });

    const res = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(400);
    expect(res.body.error).toEqual('Out of stock');
  });

  it('should restock a sweet (Admin only)', async () => {
    // User try
    const resUser = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set('Authorization', `Bearer ${token}`)
      .send({ quantity: 10 });
    expect(resUser.statusCode).toEqual(403);

    // Admin try
    const resAdmin = await request(app)
      .post(`/api/sweets/${sweetId}/restock`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ quantity: 10 });
    expect(resAdmin.statusCode).toEqual(200);
    expect(resAdmin.body.quantity).toEqual(10);
  });
});
