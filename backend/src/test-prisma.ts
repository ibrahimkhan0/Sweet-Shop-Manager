import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});
async function main() {
  console.log('Prisma initialized');
  await prisma.$disconnect();
}
main().catch(console.error);
