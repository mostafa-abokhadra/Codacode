/*
  Warnings:

  - You are about to drop the column `user_id` on the `GitHubCredential` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `GitHubCredential` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `GitHubCredential` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `GitHubCredential` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `GitHubCredential` DROP FOREIGN KEY `GitHubCredential_user_id_fkey`;

-- DropIndex
DROP INDEX `GitHubCredential_user_id_key` ON `GitHubCredential`;

-- AlterTable
ALTER TABLE `GitHubCredential` DROP COLUMN `user_id`,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `userId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `GitHubCredential_userId_key` ON `GitHubCredential`(`userId`);

-- AddForeignKey
ALTER TABLE `GitHubCredential` ADD CONSTRAINT `GitHubCredential_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
