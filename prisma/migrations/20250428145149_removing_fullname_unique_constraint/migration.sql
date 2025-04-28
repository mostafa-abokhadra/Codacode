/*
  Warnings:

  - You are about to drop the column `gender` on the `Profile` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `User_fullName_key` ON `User`;

-- AlterTable
ALTER TABLE `Profile` DROP COLUMN `gender`;
