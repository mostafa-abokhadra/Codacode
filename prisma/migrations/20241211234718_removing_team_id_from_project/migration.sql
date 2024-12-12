/*
  Warnings:

  - You are about to drop the column `team_id` on the `Project` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Project_team_id_key` ON `Project`;

-- AlterTable
ALTER TABLE `Project` DROP COLUMN `team_id`;
