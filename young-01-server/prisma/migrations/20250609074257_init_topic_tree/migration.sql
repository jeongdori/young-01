-- CreateTable
CREATE TABLE `note_tree` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `parentId` INTEGER NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `note_tree` ADD CONSTRAINT `note_tree_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `note_tree`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
