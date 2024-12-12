/*
  Warnings:

  - A unique constraint covering the columns `[project_id]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Project` DROP FOREIGN KEY `Project_team_id_fkey`;

-- AlterTable
ALTER TABLE `Team` ADD COLUMN `project_id` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Team_project_id_key` ON `Team`(`project_id`);

-- AddForeignKey
ALTER TABLE `Team` ADD CONSTRAINT `Team_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
