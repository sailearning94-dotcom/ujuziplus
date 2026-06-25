-- Rich community posts + author follows
ALTER TABLE discussions ADD COLUMN excerpt TEXT NULL;
ALTER TABLE discussions ADD COLUMN coverImageUrl VARCHAR(191) NULL;

CREATE TABLE user_follows (
    id VARCHAR(191) NOT NULL,
    followerId VARCHAR(191) NOT NULL,
    followingId VARCHAR(191) NOT NULL,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    CONSTRAINT user_follows_followerId_followingId_key UNIQUE (followerId, followingId),
    PRIMARY KEY (id)
) ;

CREATE INDEX user_follows_followingId_idx ON user_follows(followingId);

ALTER TABLE user_follows ADD CONSTRAINT user_follows_followerId_fkey FOREIGN KEY (followerId) REFERENCES users(id) ON DELETE CASCADE ;
ALTER TABLE user_follows ADD CONSTRAINT user_follows_followingId_fkey FOREIGN KEY (followingId) REFERENCES users(id) ON DELETE CASCADE ;

