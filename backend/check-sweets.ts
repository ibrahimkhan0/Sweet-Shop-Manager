import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const sweets = await prisma.sweet.findMany();
  console.log('Total sweets:', sweets.length);
  console.table(sweets);
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
