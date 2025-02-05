/*
  Warnings:

  - You are about to drop the column `phoneNumber` on the `contactInfo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `contactInfo` DROP COLUMN `phoneNumber`,
    ADD COLUMN `twitter` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `phoneNumber` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contact_id` INTEGER NOT NULL,
    `number` VARCHAR(191) NULL,
    `countryCode` VARCHAR(191) NULL,

    UNIQUE INDEX `phoneNumber_contact_id_key`(`contact_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `phoneNumber` ADD CONSTRAINT `phoneNumber_contact_id_fkey` FOREIGN KEY (`contact_id`) REFERENCES `contactInfo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
