-- AlterTable
ALTER TABLE `Request` ADD COLUMN `status` ENUM('waiting', 'accepted', 'rejected', 'completed') NULL;

-- AlterTable
ALTER TABLE `Role` ADD COLUMN `status` ENUM('completed', 'available') NULL;
