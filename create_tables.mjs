import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({ datasources: { db: { url: process.env.DATABASE_URL } } });

async function main() {
  // Create mentor_profiles
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "mentor_profiles" (
      id VARCHAR(191) NOT NULL,
      slug VARCHAR(191) NOT NULL,
      "userId" VARCHAR(191) UNIQUE,
      mentorType VARCHAR(191) NOT NULL DEFAULT 'GENERAL',
      "displayName" VARCHAR(191) NOT NULL,
      title VARCHAR(255),
      company VARCHAR(255),
      "companyLogoUrl" VARCHAR(191),
      "avatarUrl" VARCHAR(191),
      bio TEXT,
      hook VARCHAR(280),
      quote VARCHAR(500),
      "videoIntroUrl" VARCHAR(191),
      city VARCHAR(100),
      country VARCHAR(100),
      "expertiseTags" JSON DEFAULT '[]',
      tracks JSON DEFAULT '[]',
      languages JSON DEFAULT '[]',
      "yearsExperience" INTEGER NOT NULL DEFAULT 0,
      linkedin VARCHAR(191),
      github VARCHAR(191),
      "learningPath" JSON DEFAULT '[]',
      "recommendedCourseIds" JSON DEFAULT '[]',
      "recommendedKitSlugs" JSON DEFAULT '[]',
      "officeHoursNote" TEXT,
      "bookingUrl" VARCHAR(191),
      "isFeatured" BOOLEAN NOT NULL DEFAULT false,
      "isAcceptingRequests" BOOLEAN NOT NULL DEFAULT true,
      "agreedToCodeOfConduct" BOOLEAN NOT NULL DEFAULT false,
      "studentsHelped" INTEGER NOT NULL DEFAULT 0,
      "averageRating" FLOAT,
      "ratingCount" INTEGER NOT NULL DEFAULT 0,
      "sortOrder" INTEGER NOT NULL DEFAULT 0,
      status VARCHAR(191) NOT NULL DEFAULT 'DRAFT',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "mentor_profiles_pkey" PRIMARY KEY (id)
    );
  `);
  console.log('OK created mentor_profiles');

  // Create mentor_requests
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "mentor_requests" (
      id VARCHAR(191) NOT NULL,
      "learnerId" VARCHAR(191) NOT NULL,
      "mentorId" VARCHAR(191) NOT NULL,
      goal VARCHAR(500) NOT NULL,
      message TEXT NOT NULL,
      status VARCHAR(191) NOT NULL DEFAULT 'PENDING',
      "mentorReply" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "mentor_requests_pkey" PRIMARY KEY (id)
    );
  `);
  console.log('OK created mentor_requests');

  // Create mentor_sessions
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "mentor_sessions" (
      id VARCHAR(191) NOT NULL,
      "mentorId" VARCHAR(191) NOT NULL,
      "learnerId" VARCHAR(191) NOT NULL,
      "requestId" VARCHAR(191),
      type VARCHAR(191) NOT NULL DEFAULT 'GUIDANCE',
      status VARCHAR(191) NOT NULL DEFAULT 'REQUESTED',
      topic VARCHAR(500),
      notes TEXT,
      "scheduledAt" TIMESTAMP(3),
      "durationMins" INTEGER NOT NULL DEFAULT 30,
      "meetingUrl" VARCHAR(191),
      "smsReminderSent" BOOLEAN NOT NULL DEFAULT false,
      rating INTEGER,
      "learnerFeedback" VARCHAR(1000),
      "ratedAt" TIMESTAMP(3),
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "mentor_sessions_pkey" PRIMARY KEY (id)
    );
  `);
  console.log('OK created mentor_sessions');

  // Create mentor_group_sessions
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "mentor_group_sessions" (
      id VARCHAR(191) NOT NULL,
      "mentorId" VARCHAR(191) NOT NULL,
      "cohortId" VARCHAR(191),
      title VARCHAR(191) NOT NULL,
      description TEXT,
      "sessionMode" VARCHAR(191) NOT NULL DEFAULT 'VIRTUAL',
      venue VARCHAR(500),
      "scheduledAt" TIMESTAMP(3) NOT NULL,
      "durationMins" INTEGER NOT NULL DEFAULT 60,
      "maxAttendees" INTEGER NOT NULL DEFAULT 20,
      "meetingUrl" VARCHAR(191),
      "recordingUrl" VARCHAR(191),
      "channelSlug" VARCHAR(50) NOT NULL DEFAULT 'mentorship',
      "isActive" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "mentor_group_sessions_pkey" PRIMARY KEY (id)
    );
  `);
  console.log('OK created mentor_group_sessions');

  // Create mentor_group_session_attendees
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "mentor_group_session_attendees" (
      id VARCHAR(191) NOT NULL,
      "sessionId" VARCHAR(191) NOT NULL,
      "userId" VARCHAR(191) NOT NULL,
      "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "mentor_group_session_attendees_pkey" PRIMARY KEY (id),
      CONSTRAINT "mentor_group_session_attendees_sessionId_userId_key" UNIQUE ("sessionId", "userId")
    );
  `);
  console.log('OK created mentor_group_session_attendees');

  // Create mentor_cohorts
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "mentor_cohorts" (
      id VARCHAR(191) NOT NULL,
      "mentorId" VARCHAR(191) NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      track VARCHAR(100),
      "startsAt" TIMESTAMP(3) NOT NULL,
      "endsAt" TIMESTAMP(3),
      "maxMembers" INTEGER NOT NULL DEFAULT 20,
      "isActive" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "mentor_cohorts_pkey" PRIMARY KEY (id)
    );
  `);
  console.log('OK created mentor_cohorts');

  // Create mentor_cohort_members
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "mentor_cohort_members" (
      id VARCHAR(191) NOT NULL,
      "cohortId" VARCHAR(191) NOT NULL,
      "userId" VARCHAR(191) NOT NULL,
      "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "mentor_cohort_members_pkey" PRIMARY KEY (id),
      CONSTRAINT "mentor_cohort_members_cohortId_userId_key" UNIQUE ("cohortId", "userId")
    );
  `);
  console.log('OK created mentor_cohort_members');

  // Create showcase_projects
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "showcase_projects" (
      id VARCHAR(191) NOT NULL,
      "userId" VARCHAR(191) NOT NULL,
      title VARCHAR(255) NOT NULL,
      tagline VARCHAR(280),
      description TEXT NOT NULL,
      "thumbnailUrl" VARCHAR(191),
      "demoUrl" VARCHAR(191),
      "repoUrl" VARCHAR(191),
      "videoUrl" VARCHAR(191),
      "techStack" JSON DEFAULT '[]',
      track VARCHAR(100),
      status VARCHAR(191) NOT NULL DEFAULT 'DRAFT',
      "isFeatured" BOOLEAN NOT NULL DEFAULT false,
      "viewCount" INTEGER NOT NULL DEFAULT 0,
      "likeCount" INTEGER NOT NULL DEFAULT 0,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "showcase_projects_pkey" PRIMARY KEY (id)
    );
  `);
  console.log('OK created showcase_projects');

  // Create showcase_likes
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "showcase_likes" (
      id VARCHAR(191) NOT NULL,
      "userId" VARCHAR(191) NOT NULL,
      "projectId" VARCHAR(191) NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "showcase_likes_pkey" PRIMARY KEY (id),
      CONSTRAINT "showcase_likes_userId_projectId_key" UNIQUE ("userId", "projectId")
    );
  `);
  console.log('OK created showcase_likes');

  await prisma.$disconnect();
}

main().catch(e => { console.error('Fatal:', e); process.exit(1); });
