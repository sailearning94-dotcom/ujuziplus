-- DropForeignKey
ALTER TABLE order_items DROP CONSTRAINT order_items_courseId_fkey;

-- AlterTable
ALTER TABLE notifications ALTER COLUMN type TYPE VARCHAR(191);

-- AlterTable
ALTER TABLE order_items ADD COLUMN kitId VARCHAR(191) NULL;
ALTER TABLE order_items ALTER COLUMN courseId TYPE VARCHAR(191);

-- CreateTable
CREATE TABLE kit_purchases (
    id VARCHAR(191) NOT NULL,
    userId VARCHAR(191) NOT NULL,
    kitId VARCHAR(191) NOT NULL,
    orderId VARCHAR(191) NULL,
    purchasedAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    CONSTRAINT kit_purchases_userId_kitId_key UNIQUE (userId, kitId),
    PRIMARY KEY (id)
) ;

-- AddForeignKey
ALTER TABLE order_items ADD CONSTRAINT order_items_courseId_fkey FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE SET NULL ;

-- AddForeignKey
ALTER TABLE order_items ADD CONSTRAINT order_items_kitId_fkey FOREIGN KEY (kitId) REFERENCES kits(id) ON DELETE SET NULL ;

-- AddForeignKey
ALTER TABLE kit_purchases ADD CONSTRAINT kit_purchases_userId_fkey FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ;

-- AddForeignKey
ALTER TABLE kit_purchases ADD CONSTRAINT kit_purchases_kitId_fkey FOREIGN KEY (kitId) REFERENCES kits(id) ON DELETE CASCADE ;
