import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });

async function main() {
  const tables = ['users','courses','enrollments','organizations','programs','competitions','kits','kit_components','projects','lessons','orders','discussions','notifications','assignments'];
  
  for (const table of tables) {
    try {
      const result = await prisma.$queryRaw`
        SELECT table_name, column_name 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = ${table}
        ORDER BY ordinal_position
      `;
      if (result.length > 0) {
        console.log(`\n=== ${table} ===`);
        for (const row of result) {
          console.log(`  ${row.column_name}`);
        }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (!msg.includes('does not exist')) console.error(`Error on ${table}: ${msg}`);
    }
  }

  await prisma.$disconnect();
}

main().catch(e => {
  console.error('Fatal:', e);
  process.exit(1);
});
