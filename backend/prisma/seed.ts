import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@incubyte.com' },
    update: {},
    create: {
      email: 'admin@incubyte.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin user created:', admin.email);

  const sweets = [
    {
      name: 'Chocolate Fudge',
      category: 'Fudge',
      price: 3.50,
      quantity: 50,
      description: 'Rich and creamy chocolate fudge.'
    },
    {
      name: 'Strawberry Bonbons',
      category: 'Hard Candy',
      price: 2.00,
      quantity: 100,
      description: 'Classic strawberry flavored bonbons.'
    },
    {
      name: 'Gummy Bears',
      category: 'Gummies',
      price: 1.50,
      quantity: 200,
      description: 'Assorted fruit flavored gummy bears.'
    },
    {
      name: 'Lemon Sherbets',
      category: 'Hard Candy',
      price: 2.20,
      quantity: 80,
      description: 'Zesty lemon sherbets with a fizzy center.'
    },
    {
      name: 'Dark Chocolate Truffles',
      category: 'Chocolate',
      price: 5.00,
      quantity: 30,
      description: 'Luxury dark chocolate truffles.'
    },
    {
      name: 'Mint Humbugs',
      category: 'Hard Candy',
      price: 1.80,
      quantity: 120,
      description: 'Traditional mint flavored striped sweets.'
    },
    {
      name: 'Jelly Beans',
      category: 'Gummies',
      price: 2.50,
      quantity: 150,
      description: 'Colorful jelly beans in various flavors.'
    },
    {
      name: 'Caramel Chews',
      category: 'Toffee',
      price: 2.00,
      quantity: 90,
      description: 'Soft and chewy caramel candies.'
    }
  ];

  console.log('Seeding sweets...');
  for (const sweet of sweets) {
    const createdSweet = await prisma.sweet.create({
      data: sweet,
    });
    console.log(`Created sweet with id: ${createdSweet.id}`);
  }
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
