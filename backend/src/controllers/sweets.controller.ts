import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const createSweet = async (req: AuthRequest, res: Response) => {
  try {
    const sweet = await prisma.sweet.create({
      data: req.body
    });
    res.status(201).json(sweet);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create sweet' });
  }
};

export const getSweets = async (req: AuthRequest, res: Response) => {
  try {
    const sweets = await prisma.sweet.findMany();
    res.json(sweets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sweets' });
  }
};

export const searchSweets = async (req: AuthRequest, res: Response) => {
  const { q } = req.query;
  try {
    const sweets = await prisma.sweet.findMany({
      where: {
        OR: [
          { name: { contains: String(q) } },
          { category: { contains: String(q) } }
        ]
      }
    });
    res.json(sweets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search sweets' });
  }
};

export const updateSweet = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    const sweet = await prisma.sweet.update({
      where: { id: Number(id) },
      data: req.body
    });
    res.json(sweet);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update sweet' });
  }
};

export const deleteSweet = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.sweet.delete({
      where: { id: Number(id) }
    });
    res.json({ message: 'Sweet deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete sweet' });
  }
};
