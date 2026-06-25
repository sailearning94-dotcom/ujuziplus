-- CreateTable
CREATE TABLE notification_preferences (
    id VARCHAR(191) NOT NULL,
    userId VARCHAR(191) NOT NULL,
    category VARCHAR(100) NOT NULL,
    emailEnabled BOOLEAN NOT NULL DEFAULT true,
    inAppEnabled BOOLEAN NOT NULL DEFAULT true,
    pushEnabled BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT notification_preferences_userId_category_key UNIQUE (userId, category),
    PRIMARY KEY (id)
) ;

-- CreateTable
CREATE TABLE organizations (
    id VARCHAR(191) NOT NULL,
    slug VARCHAR(191) NOT NULL,
    name VARCHAR(191) NOT NULL,
    type VARCHAR(191) NOT NULL DEFAULT 'UNIVERSITY',
    logoUrl VARCHAR(191) NULL,
    memberCount INTEGER NOT NULL DEFAULT 0,
    isVerified BOOLEAN NOT NULL DEFAULT false,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt TIMESTAMP(3) NOT NULL,

    CONSTRAINT organizations_slug_key UNIQUE (slug),
    PRIMARY KEY (id)
) ;

-- CreateTable
CREATE TABLE organization_members (
    id VARCHAR(191) NOT NULL,
    orgId VARCHAR(191) NOT NULL,
    userId VARCHAR(191) NOT NULL,
    role VARCHAR(191) NOT NULL DEFAULT 'MEMBER',

    CONSTRAINT organization_members_orgId_userId_key UNIQUE (orgId, userId),
    PRIMARY KEY (id)
) ;

-- CreateTable
CREATE TABLE org_kit_inventory (
    id VARCHAR(191) NOT NULL,
    orgId VARCHAR(191) NOT NULL,
    kitId VARCHAR(191) NOT NULL,
    quantityOnHand INTEGER NOT NULL DEFAULT 0,
    quantityAllocated INTEGER NOT NULL DEFAULT 0,
    reorderLevel INTEGER NOT NULL DEFAULT 5,

    CONSTRAINT org_kit_inventory_orgId_kitId_key UNIQUE (orgId, kitId),
    PRIMARY KEY (id)
) ;

-- CreateTable
CREATE TABLE org_kit_requests (
    id VARCHAR(191) NOT NULL,
    orgId VARCHAR(191) NOT NULL,
    kitId VARCHAR(191) NOT NULL,
    requesterId VARCHAR(191) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    status VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    notes TEXT NULL,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt TIMESTAMP(3) NOT NULL,

    PRIMARY KEY (id)
) ;

-- AddForeignKey
ALTER TABLE notification_preferences ADD CONSTRAINT notification_preferences_userId_fkey FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ;

-- AddForeignKey
ALTER TABLE organization_members ADD CONSTRAINT organization_members_orgId_fkey FOREIGN KEY (orgId) REFERENCES organizations(id) ON DELETE CASCADE ;

-- AddForeignKey
ALTER TABLE organization_members ADD CONSTRAINT organization_members_userId_fkey FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ;

-- AddForeignKey
ALTER TABLE org_kit_inventory ADD CONSTRAINT org_kit_inventory_orgId_fkey FOREIGN KEY (orgId) REFERENCES organizations(id) ON DELETE CASCADE ;

-- AddForeignKey
ALTER TABLE org_kit_inventory ADD CONSTRAINT org_kit_inventory_kitId_fkey FOREIGN KEY (kitId) REFERENCES kits(id) ON DELETE CASCADE ;

-- AddForeignKey
ALTER TABLE org_kit_requests ADD CONSTRAINT org_kit_requests_orgId_fkey FOREIGN KEY (orgId) REFERENCES organizations(id) ON DELETE CASCADE ;

-- AddForeignKey
ALTER TABLE org_kit_requests ADD CONSTRAINT org_kit_requests_kitId_fkey FOREIGN KEY (kitId) REFERENCES kits(id) ON DELETE CASCADE ;

-- AddForeignKey
ALTER TABLE org_kit_requests ADD CONSTRAINT org_kit_requests_requesterId_fkey FOREIGN KEY (requesterId) REFERENCES users(id) ON DELETE RESTRICT ;
