/*
  Warnings:

  - You are about to drop the `portfolioProject` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `portfolioProject` DROP FOREIGN KEY `portfolioProject_profile_id_fkey`;

-- DropTable
DROP TABLE `portfolioProject`;

-- CreateTable
CREATE TABLE `experience` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `profile_id` INTEGER NOT NULL,
    `title` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `link` VARCHAR(191) NULL,
    `repo` VARCHAR(191) NULL,
    `linkedInPost` VARCHAR(191) NULL,

    UNIQUE INDEX `experience_profile_id_key`(`profile_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `experience` ADD CONSTRAINT `experience_profile_id_fkey` FOREIGN KEY (`profile_id`) REFERENCES `Profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
