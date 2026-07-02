import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });

const tables = ['users','courses','enrollments','organizations','programs','competitions','kits','kit_components','projects','lessons','orders','discussions','notifications','assignments'];

async function main() {
  for (const t of tables) {
    try {
      const cols = await prisma.$queryRaw`
        SELECT column_name FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = ${t} 
        ORDER BY ordinal_position
      `;
      const names = cols.map(c => c.column_name);
      const mismatches = names.filter(n => n !== n.toLowerCase() && !/^[a-z][a-zA-Z0-9]*$/.test(n));
      const status = mismatches.length ? ` [MISMATCH: ${mismatches.join(', ')}]` : ' [OK]';
      console.log(`${t}: ${names.join(', ')}${status}`);
    } catch(e) {
      console.log(`${t}: ERROR - ${e.message.split('\n')[0]}`);
    }
  }
  await prisma.$disconnect();
}

main();
