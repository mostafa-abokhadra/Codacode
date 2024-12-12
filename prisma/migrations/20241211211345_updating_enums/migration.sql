/*
  Warnings:

  - The values [completed] on the enum `Project_status` will be removed. If these variants are still used in the database, this will fail.
  - The values [completed] on the enum `Request_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Project` MODIFY `status` ENUM('waitingForTeam', 'workOn') NULL;

-- AlterTable
ALTER TABLE `Request` MODIFY `status` ENUM('waiting', 'rejected', 'accepted') NULL;
