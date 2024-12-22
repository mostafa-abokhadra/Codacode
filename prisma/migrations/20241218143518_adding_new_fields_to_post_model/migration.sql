/*
  Warnings:

  - You are about to drop the column `content` on the `Post` table. All the data in the column will be lost.
  - Added the required column `description` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `languagePreferences` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `myRole` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Post` DROP COLUMN `content`,
    ADD COLUMN `description` VARCHAR(350) NOT NULL,
    ADD COLUMN `languagePreferences` VARCHAR(191) NOT NULL,
    ADD COLUMN `myRole` VARCHAR(191) NOT NULL;
