/*
  Warnings:

  - You are about to drop the column `user_id` on the `Request` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `Role` table. All the data in the column will be lost.
  - Added the required column `userApplied_id` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `position` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Request` DROP FOREIGN KEY `Request_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Role` DROP FOREIGN KEY `Role_user_id_fkey`;

-- AlterTable
ALTER TABLE `Request` DROP COLUMN `user_id`,
    ADD COLUMN `userApplied_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Role` DROP COLUMN `role`,
    DROP COLUMN `user_id`,
    ADD COLUMN `position` VARCHAR(191) NOT NULL,
    MODIFY `applied` INTEGER NOT NULL DEFAULT 0,
    MODIFY `accepted` INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `Request` ADD CONSTRAINT `Request_userApplied_id_fkey` FOREIGN KEY (`userApplied_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
