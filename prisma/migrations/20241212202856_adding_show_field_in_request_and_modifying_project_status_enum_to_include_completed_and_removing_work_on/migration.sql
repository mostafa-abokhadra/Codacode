/*
  Warnings:

  - The values [workOn] on the enum `Project_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Project` MODIFY `status` ENUM('waitingForTeam', 'completed') NULL;

-- AlterTable
ALTER TABLE `Request` ADD COLUMN `show` BOOLEAN NOT NULL DEFAULT true;
