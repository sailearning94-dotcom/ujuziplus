-- CreateTable
CREATE TABLE orders (
    id VARCHAR(191) NOT NULL,
    userId VARCHAR(191) NOT NULL,
    status VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    subtotal DECIMAL(10, 2) NOT NULL,
    discountAmount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    couponCode VARCHAR(50) NULL,
    paymentMethod VARCHAR(191) NULL,
    paymentRef VARCHAR(191) NULL,
    createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt TIMESTAMP(3) NOT NULL,

    PRIMARY KEY (id)
) ;

-- CreateTable
CREATE TABLE order_items (
    id VARCHAR(191) NOT NULL,
    orderId VARCHAR(191) NOT NULL,
    courseId VARCHAR(191) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,

    PRIMARY KEY (id)
) ;

-- AddForeignKey
ALTER TABLE orders ADD CONSTRAINT orders_userId_fkey FOREIGN KEY (userId) REFERENCES users(id) ON DELETE RESTRICT ;

-- AddForeignKey
ALTER TABLE order_items ADD CONSTRAINT order_items_orderId_fkey FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE ;

-- AddForeignKey
ALTER TABLE order_items ADD CONSTRAINT order_items_courseId_fkey FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE RESTRICT ;
