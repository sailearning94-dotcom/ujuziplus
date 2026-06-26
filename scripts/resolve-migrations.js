#!/usr/bin/env node

/**
 * Resolve failed Prisma migrations in the database
 * This script marks failed migrations as rolled back so they can be reapplied
 */

const { PrismaClient } = require("@prisma/client");

async function resolveMigrations() {
  const prisma = new PrismaClient();

  try {
    console.log("🔧 Checking for failed migrations...");

    // Get all failed migrations
    const failedMigrations = await prisma.$executeRaw`
      SELECT migration_name, started_at FROM _prisma_migrations
      WHERE finished_at IS NULL AND rolled_back_at IS NULL
    `;

    if (failedMigrations.length === 0) {
      console.log("✅ No failed migrations found");
      return;
    }

    console.log(`⚠️  Found ${failedMigrations.length} failed migration(s):`);
    failedMigrations.forEach((m) => {
      console.log(`   - ${m.migration_name} (started at ${m.started_at})`);
    });

    // Mark failed migrations as rolled back
    console.log("\n🔄 Marking migrations as rolled back...");
    await prisma.$executeRaw`
      UPDATE _prisma_migrations
      SET rolled_back_at = NOW()
      WHERE finished_at IS NULL AND rolled_back_at IS NULL
    `;

    // Drop the partially created tables
    console.log("🗑️  Cleaning up partial tables...");
    const tablesToDrop = [
      "mentor_profiles",
      "mentor_requests",
      "mentor_sessions",
      "mentor_office_hours",
      "mentor_group_sessions",
      "mentor_group_session_attendees",
      "mentor_cohorts",
      "mentor_cohort_members",
      "showcase_projects",
      "showcase_likes",
    ];

    for (const table of tablesToDrop) {
      try {
        await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS \`${table}\``);
        console.log(`   ✓ Dropped ${table}`);
      } catch (e) {
        console.log(`   - ${table} not found (OK)`);
      }
    }

    console.log("\n✅ Migration resolution complete!");
    console.log("ℹ️  Run 'prisma migrate deploy' to reapply migrations");
  } catch (error) {
    console.error("❌ Error resolving migrations:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

resolveMigrations();
