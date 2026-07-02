-- CreateTable
CREATE TABLE fcm_device_tokens (
    id VARCHAR(191) NOT NULL,
    userId VARCHAR(191) NOT NULL,
    token VARCHAR(500) NOT NULL,
    platform VARCHAR(20) NOT NULL DEFAULT 'web',
    label VARCHAR(100) NULL,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt TIMESTAMP(3) NOT NULL,

    CONSTRAINT fcm_device_tokens_token_key UNIQUE (token),
    PRIMARY KEY (id)
) ;

-- AddForeignKey
ALTER TABLE fcm_device_tokens ADD CONSTRAINT fcm_device_tokens_userId_fkey FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ;

CREATE INDEX fcm_device_tokens_userId_idx ON fcm_device_tokens(userId);
