/*
  Warnings:

  - A unique constraint covering the columns `[project_id]` on the table `Post` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `project_id` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Group` DROP FOREIGN KEY `Group_team_id_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `message_group_id_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `message_user_id_fkey`;

-- AlterTable
ALTER TABLE `Post` ADD COLUMN `project_id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Post_project_id_key` ON `Post`(`project_id`);

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Group` ADD CONSTRAINT `Group_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `Team`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `message` ADD CONSTRAINT `message_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `Group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `message` ADD CONSTRAINT `message_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
