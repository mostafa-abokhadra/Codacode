-- AlterTable
ALTER TABLE `Request` ADD COLUMN `UpdatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `createdAT` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
