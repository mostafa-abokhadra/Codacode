/*
  Warnings:

  - You are about to drop the column `user_id` on the `Group` table. All the data in the column will be lost.
  - You are about to drop the `ProjectToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeamToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProjectToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_TeamToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Group` DROP FOREIGN KEY `Group_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Project` DROP FOREIGN KEY `Project_team_id_fkey`;

-- DropForeignKey
ALTER TABLE `Request` DROP FOREIGN KEY `Request_role_id_fkey`;

-- DropForeignKey
ALTER TABLE `Request` DROP FOREIGN KEY `Request_userApplied_id_fkey`;

-- DropForeignKey
ALTER TABLE `_ProjectToUser` DROP FOREIGN KEY `_ProjectToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_ProjectToUser` DROP FOREIGN KEY `_ProjectToUser_B_fkey`;

-- DropForeignKey
ALTER TABLE `_TeamToUser` DROP FOREIGN KEY `_TeamToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_TeamToUser` DROP FOREIGN KEY `_TeamToUser_B_fkey`;

-- AlterTable
ALTER TABLE `Group` DROP COLUMN `user_id`;

-- AlterTable
ALTER TABLE `Project` ADD COLUMN `status` ENUM('waitingForTeam', 'completed', 'workOn') NULL;

-- AlterTable
ALTER TABLE `message` ADD COLUMN `sendedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- DropTable
DROP TABLE `ProjectToUser`;

-- DropTable
DROP TABLE `TeamToUser`;

-- DropTable
DROP TABLE `_ProjectToUser`;

-- DropTable
DROP TABLE `_TeamToUser`;

-- CreateTable
CREATE TABLE `_userTeams` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_userTeams_AB_unique`(`A`, `B`),
    INDEX `_userTeams_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ProjectUsers` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ProjectUsers_AB_unique`(`A`, `B`),
    INDEX `_ProjectUsers_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Request` ADD CONSTRAINT `Request_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Request` ADD CONSTRAINT `Request_userApplied_id_fkey` FOREIGN KEY (`userApplied_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `Team`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_userTeams` ADD CONSTRAINT `_userTeams_A_fkey` FOREIGN KEY (`A`) REFERENCES `Team`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_userTeams` ADD CONSTRAINT `_userTeams_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProjectUsers` ADD CONSTRAINT `_ProjectUsers_A_fkey` FOREIGN KEY (`A`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProjectUsers` ADD CONSTRAINT `_ProjectUsers_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
