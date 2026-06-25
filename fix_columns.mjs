import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });

const fixes = [
  { table: 'courses', old: 'createdat', new: 'createdAt' },
  { table: 'courses', old: 'updatedat', new: 'updatedAt' },
  { table: 'enrollments', old: 'completedat', new: 'completedAt' },
  { table: 'organizations', old: 'createdat', new: 'createdAt' },
  { table: 'organizations', old: 'updatedat', new: 'updatedAt' },
  { table: 'programs', old: 'startdate', new: 'startDate' },
  { table: 'programs', old: 'enddate', new: 'endDate' },
  { table: 'programs', old: 'createdat', new: 'createdAt' },
  { table: 'programs', old: 'updatedat', new: 'updatedAt' },
  { table: 'competitions', old: 'teamscount', new: 'teamsCount' },
  { table: 'competitions', old: 'startdate', new: 'startDate' },
  { table: 'competitions', old: 'enddate', new: 'endDate' },
  { table: 'competitions', old: 'createdat', new: 'createdAt' },
  { table: 'competitions', old: 'updatedat', new: 'updatedAt' },
  { table: 'kits', old: 'createdat', new: 'createdAt' },
  { table: 'kits', old: 'updatedat', new: 'updatedAt' },
  { table: 'kit_components', old: 'imageurl', new: 'imageUrl' },
  { table: 'projects', old: 'thumbnailurl', new: 'thumbnailUrl' },
  { table: 'projects', old: 'githuburl', new: 'githubUrl' },
  { table: 'projects', old: 'demourl', new: 'demoUrl' },
  { table: 'projects', old: 'creatorid', new: 'creatorId' },
  { table: 'projects', old: 'createdat', new: 'createdAt' },
  { table: 'projects', old: 'updatedat', new: 'updatedAt' },
  { table: 'lessons', old: 'videourl', new: 'videoUrl' },
  { table: 'lessons', old: 'createdat', new: 'createdAt' },
  { table: 'lessons', old: 'updatedat', new: 'updatedAt' },
  { table: 'orders', old: 'couponcode', new: 'couponCode' },
  { table: 'orders', old: 'paymentmethod', new: 'paymentMethod' },
  { table: 'orders', old: 'paymentref', new: 'paymentRef' },
  { table: 'orders', old: 'createdat', new: 'createdAt' },
  { table: 'orders', old: 'updatedat', new: 'updatedAt' },
  { table: 'assignments', old: 'createdat', new: 'createdAt' },
  { table: 'assignments', old: 'updatedat', new: 'updatedAt' },
  { table: 'password_reset_tokens', old: 'expiresat', new: 'expiresAt' },
  { table: 'password_reset_tokens', old: 'usedat', new: 'usedAt' },
  { table: 'instructor_payout_profiles', old: 'preferredmethod', new: 'preferredMethod' },
  { table: 'instructor_payout_profiles', old: 'mpesaphone', new: 'mpesaPhone' },
  { table: 'instructor_payout_profiles', old: 'bankname', new: 'bankName' },
  { table: 'instructor_payout_profiles', old: 'bankaccountname', new: 'bankAccountName' },
  { table: 'instructor_payout_profiles', old: 'bankaccountnumber', new: 'bankAccountNumber' },
  { table: 'instructor_payout_profiles', old: 'bankswift', new: 'bankSwift' },
  { table: 'kit_materials', old: 'durationminutes', new: 'durationMinutes' },
  { table: 'org_kit_requests', old: 'updatedat', new: 'updatedAt' },
  { table: 'fcm_device_tokens', old: 'createdat', new: 'createdAt' },
  { table: 'fcm_device_tokens', old: 'updatedat', new: 'updatedAt' },
];

async function main() {
  let fixed = 0;
  let skipped = 0;

  for (const fix of fixes) {
    try {
      await prisma.$executeRawUnsafe(
        `ALTER TABLE "${fix.table}" RENAME COLUMN "${fix.old}" TO "${fix.new}"`
      );
      console.log(`OK ${fix.table}.${fix.old} -> ${fix.new}`);
      fixed++;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes('does not exist') || msg.includes('already exists')) {
        skipped++;
      } else {
        console.error(`FAIL ${fix.table}.${fix.old}: ${msg}`);
      }
    }
  }

  console.log(`\nFixed: ${fixed}, Skipped: ${skipped}`);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
