-- CreateTable
CREATE TABLE projects (
    id VARCHAR(191) NOT NULL,
    slug VARCHAR(191) NOT NULL,
    title VARCHAR(191) NOT NULL,
    description TEXT NOT NULL,
    thumbnailUrl VARCHAR(191) NULL,
    category VARCHAR(100) NOT NULL,
    tags JSON NULL,
    status VARCHAR(191) NOT NULL DEFAULT 'PROTOTYPE',
    githubUrl VARCHAR(500) NULL,
    demoUrl VARCHAR(500) NULL,
    creatorId VARCHAR(191) NOT NULL,
    likesCount INTEGER NOT NULL DEFAULT 0,
    isPublished BOOLEAN NOT NULL DEFAULT true,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt TIMESTAMP(3) NOT NULL,

    CONSTRAINT projects_slug_key UNIQUE (slug),
    PRIMARY KEY (id)
) ;

-- CreateTable
CREATE TABLE project_likes (
    id VARCHAR(191) NOT NULL,
    userId VARCHAR(191) NOT NULL,
    projectId VARCHAR(191) NOT NULL,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    CONSTRAINT project_likes_userId_projectId_key UNIQUE (userId, projectId),
    PRIMARY KEY (id)
) ;

-- CreateTable
CREATE TABLE solutions (
    id VARCHAR(191) NOT NULL,
    slug VARCHAR(191) NOT NULL,
    title VARCHAR(191) NOT NULL,
    subtitle VARCHAR(191) NULL,
    description TEXT NOT NULL,
    level VARCHAR(191) NOT NULL DEFAULT 'BEGINNER',
    hours INTEGER NOT NULL DEFAULT 1,
    components JSON NULL,
    relatedKitSlugs JSON NULL,
    labSteps JSON NULL,
    codeTemplate TEXT NULL,
    status VARCHAR(191) NOT NULL DEFAULT 'PUBLISHED',
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt TIMESTAMP(3) NOT NULL,

    CONSTRAINT solutions_slug_key UNIQUE (slug),
    PRIMARY KEY (id)
) ;

-- CreateTable
CREATE TABLE solution_joins (
    id VARCHAR(191) NOT NULL,
    userId VARCHAR(191) NOT NULL,
    solutionId VARCHAR(191) NOT NULL,
    labProgress JSON NULL,
    joinedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    CONSTRAINT solution_joins_userId_solutionId_key UNIQUE (userId, solutionId),
    PRIMARY KEY (id)
) ;

-- CreateTable
CREATE TABLE lab_resources (
    id VARCHAR(191) NOT NULL,
    slug VARCHAR(191) NOT NULL,
    title VARCHAR(191) NOT NULL,
    description TEXT NULL,
    type VARCHAR(191) NOT NULL DEFAULT 'COMPONENT',
    category VARCHAR(100) NULL,
    fileUrl VARCHAR(500) NULL,
    externalUrl VARCHAR(500) NULL,
    thumbnailUrl VARCHAR(191) NULL,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt TIMESTAMP(3) NOT NULL,

    CONSTRAINT lab_resources_slug_key UNIQUE (slug),
    PRIMARY KEY (id)
) ;

-- CreateTable
CREATE TABLE user_lab_resources (
    id VARCHAR(191) NOT NULL,
    userId VARCHAR(191) NOT NULL,
    labResourceId VARCHAR(191) NOT NULL,
    savedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    CONSTRAINT user_lab_resources_userId_labResourceId_key UNIQUE (userId, labResourceId),
    PRIMARY KEY (id)
) ;

-- CreateTable
CREATE TABLE blog_posts (
    id VARCHAR(191) NOT NULL,
    slug VARCHAR(191) NOT NULL,
    title VARCHAR(191) NOT NULL,
    excerpt TEXT NULL,
    body TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    status VARCHAR(191) NOT NULL DEFAULT 'PUBLISHED',
    authorId VARCHAR(191) NULL,
    publishedAt TIMESTAMP(3) NULL,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt TIMESTAMP(3) NOT NULL,

    CONSTRAINT blog_posts_slug_key UNIQUE (slug),
    PRIMARY KEY (id)
) ;

-- CreateTable
CREATE TABLE pricing_plans (
    id VARCHAR(191) NOT NULL,
    slug VARCHAR(191) NOT NULL,
    name VARCHAR(191) NOT NULL,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    period VARCHAR(50) NULL,
    features JSON NOT NULL,
    isPopular BOOLEAN NOT NULL DEFAULT false,
    sortOrder INTEGER NOT NULL DEFAULT 0,
    isActive BOOLEAN NOT NULL DEFAULT true,
    ctaLabel VARCHAR(100) NOT NULL DEFAULT 'Get started',
    ctaHref VARCHAR(500) NULL,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt TIMESTAMP(3) NOT NULL,

    CONSTRAINT pricing_plans_slug_key UNIQUE (slug),
    PRIMARY KEY (id)
) ;

-- AddForeignKey
ALTER TABLE projects ADD CONSTRAINT projects_creatorId_fkey FOREIGN KEY (creatorId) REFERENCES users(id) ON DELETE RESTRICT ;

-- AddForeignKey
ALTER TABLE project_likes ADD CONSTRAINT project_likes_userId_fkey FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ;

-- AddForeignKey
ALTER TABLE project_likes ADD CONSTRAINT project_likes_projectId_fkey FOREIGN KEY (projectId) REFERENCES projects(id) ON DELETE CASCADE ;

-- AddForeignKey
ALTER TABLE solution_joins ADD CONSTRAINT solution_joins_userId_fkey FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ;

-- AddForeignKey
ALTER TABLE solution_joins ADD CONSTRAINT solution_joins_solutionId_fkey FOREIGN KEY (solutionId) REFERENCES solutions(id) ON DELETE CASCADE ;

-- AddForeignKey
ALTER TABLE user_lab_resources ADD CONSTRAINT user_lab_resources_userId_fkey FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ;

-- AddForeignKey
ALTER TABLE user_lab_resources ADD CONSTRAINT user_lab_resources_labResourceId_fkey FOREIGN KEY (labResourceId) REFERENCES lab_resources(id) ON DELETE CASCADE ;

-- AddForeignKey
ALTER TABLE blog_posts ADD CONSTRAINT blog_posts_authorId_fkey FOREIGN KEY (authorId) REFERENCES users(id) ON DELETE SET NULL ;

CREATE INDEX projects_creatorId_idx ON projects(creatorId);
