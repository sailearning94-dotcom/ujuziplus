-- CreateTable
CREATE TABLE org_invites (
    id VARCHAR(191) NOT NULL,
    orgId VARCHAR(191) NOT NULL,
    email VARCHAR(191) NOT NULL,
    role VARCHAR(191) NOT NULL DEFAULT 'MEMBER',
    token VARCHAR(191) NOT NULL,
    status VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    invitedById VARCHAR(191) NOT NULL,
    expiresAt TIMESTAMP(3) NOT NULL,
    acceptedAt TIMESTAMP(3) NULL,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX org_invites_token_key(token),
    INDEX org_invites_orgId_status_idx(orgId, status),
    PRIMARY KEY (id)
) ;

-- CreateTable
CREATE TABLE push_subscriptions (
    id VARCHAR(191) NOT NULL,
    userId VARCHAR(191) NOT NULL,
    endpoint VARCHAR(500) NOT NULL,
    p256dh VARCHAR(255) NOT NULL,
    auth VARCHAR(255) NOT NULL,
    userAgent VARCHAR(500) NULL,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX push_subscriptions_userId_endpoint_key(userId, endpoint),
    PRIMARY KEY (id)
) ;

-- AddForeignKey
ALTER TABLE org_invites ADD CONSTRAINT org_invites_orgId_fkey FOREIGN KEY (orgId) REFERENCES organizations(id) ON DELETE CASCADE ;

-- AddForeignKey
ALTER TABLE org_invites ADD CONSTRAINT org_invites_invitedById_fkey FOREIGN KEY (invitedById) REFERENCES users(id) ON DELETE RESTRICT ;

-- AddForeignKey
ALTER TABLE push_subscriptions ADD CONSTRAINT push_subscriptions_userId_fkey FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ;
