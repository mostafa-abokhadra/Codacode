/*
  Warnings:

  - A unique constraint covering the columns `[profile_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `profile_id` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Profile` DROP FOREIGN KEY `Profile_user_id_fkey`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `profile_id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_profile_id_key` ON `User`(`profile_id`);

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
