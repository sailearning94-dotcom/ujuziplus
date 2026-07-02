-- CreateTable
CREATE TABLE mentor_profiles (
    id VARCHAR(191) NOT NULL,
    slug VARCHAR(191) NOT NULL,
    userId VARCHAR(191) NULL,
    mentorType VARCHAR(191) NOT NULL DEFAULT 'GENERAL',
    displayName VARCHAR(191) NOT NULL,
    title VARCHAR(255) NULL,
    company VARCHAR(255) NULL,
    companyLogoUrl VARCHAR(191) NULL,
    avatarUrl VARCHAR(191) NULL,
    bio TEXT NULL,
    hook VARCHAR(280) NULL,
    quote VARCHAR(500) NULL,
    videoIntroUrl VARCHAR(191) NULL,
    city VARCHAR(100) NULL,
    country VARCHAR(100) NULL,
    expertiseTags JSON NOT NULL,
    tracks JSON NOT NULL,
    languages JSON NOT NULL,
    yearsExperience INTEGER NOT NULL DEFAULT 0,
    linkedin VARCHAR(191) NULL,
    github VARCHAR(191) NULL,
    learningPath JSON NOT NULL,
    recommendedCourseIds JSON NOT NULL,
    recommendedKitSlugs JSON NOT NULL,
    officeHoursNote TEXT NULL,
    bookingUrl VARCHAR(191) NULL,
    isFeatured BOOLEAN NOT NULL DEFAULT false,
    isAcceptingRequests BOOLEAN NOT NULL DEFAULT true,
    agreedToCodeOfConduct BOOLEAN NOT NULL DEFAULT false,
    studentsHelped INTEGER NOT NULL DEFAULT 0,
    averageRating DOUBLE PRECISION NULL,
    ratingCount INTEGER NOT NULL DEFAULT 0,
    sortOrder INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(191) NOT NULL DEFAULT 'DRAFT',
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt TIMESTAMP(3) NOT NULL,

    CONSTRAINT mentor_profiles_slug_key UNIQUE (slug),
    CONSTRAINT mentor_profiles_userId_key UNIQUE (userId),
    PRIMARY KEY (id)
) ;

-- CreateTable
CREATE TABLE mentor_requests (
    id VARCHAR(191) NOT NULL,
    learnerId VARCHAR(191) NOT NULL,
    mentorId VARCHAR(191) NOT NULL,
    goal VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    mentorReply TEXT NULL,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt TIMESTAMP(3) NOT NULL,

    PRIMARY KEY (id)
) ;

-- CreateTable
CREATE TABLE mentor_sessions (
    id VARCHAR(191) NOT NULL,
    mentorId VARCHAR(191) NOT NULL,
    learnerId VARCHAR(191) NOT NULL,
    requestId VARCHAR(191) NULL,
    type VARCHAR(191) NOT NULL DEFAULT 'GUIDANCE',
    status VARCHAR(191) NOT NULL DEFAULT 'REQUESTED',
    topic VARCHAR(500) NULL,
    notes TEXT NULL,
    scheduledAt TIMESTAMP(3) NULL,
    durationMins INTEGER NOT NULL DEFAULT 30,
    meetingUrl VARCHAR(191) NULL,
    smsReminderSent BOOLEAN NOT NULL DEFAULT false,
    rating INTEGER NULL,
    learnerFeedback VARCHAR(1000) NULL,
    ratedAt TIMESTAMP(3) NULL,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt TIMESTAMP(3) NOT NULL,

    PRIMARY KEY (id)
) ;

-- CreateTable
CREATE TABLE mentor_office_hours (
    id VARCHAR(191) NOT NULL,
    mentorId VARCHAR(191) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    dayOfWeek INTEGER NOT NULL,
    startTime VARCHAR(10) NOT NULL,
    endTime VARCHAR(10) NOT NULL,
    timezone VARCHAR(50) NOT NULL DEFAULT 'Africa/Dar_es_Salaam',
    meetingUrl VARCHAR(191) NULL,
    isActive BOOLEAN NOT NULL DEFAULT true,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt TIMESTAMP(3) NOT NULL,

    PRIMARY KEY (id)
) ;

-- CreateTable (created before mentor_group_sessions — group sessions FK references it)
CREATE TABLE mentor_cohorts (
    id VARCHAR(191) NOT NULL,
    mentorId VARCHAR(191) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    track VARCHAR(100) NOT NULL,
    startsAt TIMESTAMP(3) NOT NULL,
    endsAt TIMESTAMP(3) NULL,
    maxMembers INTEGER NOT NULL DEFAULT 20,
    isActive BOOLEAN NOT NULL DEFAULT true,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt TIMESTAMP(3) NOT NULL,

    PRIMARY KEY (id)
) ;

-- CreateTable
CREATE TABLE mentor_group_sessions (
    id VARCHAR(191) NOT NULL,
    mentorId VARCHAR(191) NOT NULL,
    cohortId VARCHAR(191) NULL,
    title VARCHAR(191) NOT NULL,
    description TEXT NULL,
    sessionMode VARCHAR(191) NOT NULL DEFAULT 'VIRTUAL',
    venue VARCHAR(500) NULL,
    scheduledAt TIMESTAMP(3) NOT NULL,
    durationMins INTEGER NOT NULL DEFAULT 60,
    maxAttendees INTEGER NOT NULL DEFAULT 20,
    meetingUrl VARCHAR(191) NULL,
    recordingUrl VARCHAR(191) NULL,
    channelSlug VARCHAR(50) NOT NULL DEFAULT 'mentorship',
    isActive BOOLEAN NOT NULL DEFAULT true,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt TIMESTAMP(3) NOT NULL,

    PRIMARY KEY (id)
) ;

-- CreateTable
CREATE TABLE mentor_group_session_attendees (
    id VARCHAR(191) NOT NULL,
    sessionId VARCHAR(191) NOT NULL,
    userId VARCHAR(191) NOT NULL,
    joinedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    CONSTRAINT mentor_group_session_attendees_sessionId_userId_key UNIQUE (sessionId, userId),
    PRIMARY KEY (id)
) ;

-- CreateTable
CREATE TABLE mentor_cohort_members (
    id VARCHAR(191) NOT NULL,
    cohortId VARCHAR(191) NOT NULL,
    userId VARCHAR(191) NOT NULL,
    joinedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    CONSTRAINT mentor_cohort_members_cohortId_userId_key UNIQUE (cohortId, userId),
    PRIMARY KEY (id)
) ;

-- CreateIndex
CREATE INDEX mentor_requests_learnerId_idx ON mentor_requests(learnerId);
CREATE INDEX mentor_requests_mentorId_idx ON mentor_requests(mentorId);
CREATE INDEX mentor_sessions_mentorId_idx ON mentor_sessions(mentorId);
CREATE INDEX mentor_sessions_learnerId_idx ON mentor_sessions(learnerId);
CREATE INDEX mentor_sessions_scheduledAt_idx ON mentor_sessions(scheduledAt);
CREATE INDEX mentor_office_hours_mentorId_idx ON mentor_office_hours(mentorId);
CREATE INDEX mentor_cohorts_mentorId_idx ON mentor_cohorts(mentorId);
CREATE INDEX mentor_group_sessions_mentorId_idx ON mentor_group_sessions(mentorId);
CREATE INDEX mentor_group_sessions_cohortId_idx ON mentor_group_sessions(cohortId);
CREATE INDEX mentor_group_sessions_scheduledAt_idx ON mentor_group_sessions(scheduledAt);
CREATE INDEX mentor_cohort_members_userId_idx ON mentor_cohort_members(userId);

-- AddForeignKey
ALTER TABLE mentor_profiles ADD CONSTRAINT mentor_profiles_userId_fkey FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL ;
ALTER TABLE mentor_requests ADD CONSTRAINT mentor_requests_learnerId_fkey FOREIGN KEY (learnerId) REFERENCES users(id) ON DELETE CASCADE ;
ALTER TABLE mentor_requests ADD CONSTRAINT mentor_requests_mentorId_fkey FOREIGN KEY (mentorId) REFERENCES mentor_profiles(id) ON DELETE CASCADE ;
ALTER TABLE mentor_sessions ADD CONSTRAINT mentor_sessions_mentorId_fkey FOREIGN KEY (mentorId) REFERENCES mentor_profiles(id) ON DELETE CASCADE ;
ALTER TABLE mentor_sessions ADD CONSTRAINT mentor_sessions_learnerId_fkey FOREIGN KEY (learnerId) REFERENCES users(id) ON DELETE CASCADE ;
ALTER TABLE mentor_sessions ADD CONSTRAINT mentor_sessions_requestId_fkey FOREIGN KEY (requestId) REFERENCES mentor_requests(id) ON DELETE SET NULL ;
ALTER TABLE mentor_office_hours ADD CONSTRAINT mentor_office_hours_mentorId_fkey FOREIGN KEY (mentorId) REFERENCES mentor_profiles(id) ON DELETE CASCADE ;
ALTER TABLE mentor_cohorts ADD CONSTRAINT mentor_cohorts_mentorId_fkey FOREIGN KEY (mentorId) REFERENCES mentor_profiles(id) ON DELETE CASCADE ;
ALTER TABLE mentor_group_sessions ADD CONSTRAINT mentor_group_sessions_mentorId_fkey FOREIGN KEY (mentorId) REFERENCES mentor_profiles(id) ON DELETE CASCADE ;
ALTER TABLE mentor_group_sessions ADD CONSTRAINT mentor_group_sessions_cohortId_fkey FOREIGN KEY (cohortId) REFERENCES mentor_cohorts(id) ON DELETE SET NULL ;
ALTER TABLE mentor_group_session_attendees ADD CONSTRAINT mentor_group_session_attendees_sessionId_fkey FOREIGN KEY (sessionId) REFERENCES mentor_group_sessions(id) ON DELETE CASCADE ;
ALTER TABLE mentor_group_session_attendees ADD CONSTRAINT mentor_group_session_attendees_userId_fkey FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ;
ALTER TABLE mentor_cohort_members ADD CONSTRAINT mentor_cohort_members_cohortId_fkey FOREIGN KEY (cohortId) REFERENCES mentor_cohorts(id) ON DELETE CASCADE ;
ALTER TABLE mentor_cohort_members ADD CONSTRAINT mentor_cohort_members_userId_fkey FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ;
