import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });

async function main() {
  // Fix kits.ageRange
  try {
    await prisma.$executeRawUnsafe('ALTER TABLE kits ALTER COLUMN agerange TYPE VARCHAR(50);');
    console.log('OK kits.agerange -> VARCHAR');
  } catch (e) {
    console.log('kits.agerange:', e.message?.split('\n')[0] || e);
  }

  // Check if ageRange already exists
  try {
    await prisma.$executeRawUnsafe('ALTER TABLE kits ALTER COLUMN "ageRange" TYPE VARCHAR(50);');
    console.log('OK kits.ageRange already renamed');
  } catch (e) {
    // ignore
  }

  await prisma.$disconnect();
}

main();
