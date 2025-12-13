import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.middleware';

const prisma = new PrismaClient();

export const purchaseSweet = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  try {
    const sweet = await prisma.sweet.findUnique({ where: { id: Number(id) } });
    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }
    if (sweet.quantity <= 0) {
      return res.status(400).json({ error: 'Out of stock' });
    }
    const updatedSweet = await prisma.sweet.update({
      where: { id: Number(id) },
      data: { quantity: sweet.quantity - 1 }
    });
    res.json(updatedSweet);
  } catch (error) {
    res.status(500).json({ error: 'Failed to purchase sweet' });
  }
};

export const restockSweet = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { quantity } = req.body;
  try {
    const sweet = await prisma.sweet.findUnique({ where: { id: Number(id) } });
    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }
    const updatedSweet = await prisma.sweet.update({
      where: { id: Number(id) },
      data: { quantity: sweet.quantity + Number(quantity) }
    });
    res.json(updatedSweet);
  } catch (error) {
    res.status(500).json({ error: 'Failed to restock sweet' });
  }
};

export const checkoutCart = async (req: AuthRequest, res: Response) => {
  const { items } = req.body; // items: { id: number, quantity: number }[]

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  try {
    // Use a transaction to ensure all updates succeed or fail together
    await prisma.$transaction(async (tx: any) => {
      for (const item of items) {
        const sweet = await tx.sweet.findUnique({ where: { id: item.id } });
        
        if (!sweet) {
          throw new Error(`Sweet with ID ${item.id} not found`);
        }
        
        if (sweet.quantity < item.quantity) {
          throw new Error(`Insufficient stock for ${sweet.name}`);
        }

        await tx.sweet.update({
          where: { id: item.id },
          data: { quantity: sweet.quantity - item.quantity }
        });
      }
    });

    res.json({ message: 'Purchase successful' });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Checkout failed' });
  }
};
