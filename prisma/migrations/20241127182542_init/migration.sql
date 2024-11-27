-- CreateTable
CREATE TABLE `SendRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `to_id` INTEGER NOT NULL,
    `role_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SendRequest` ADD CONSTRAINT `SendRequest_to_id_fkey` FOREIGN KEY (`to_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SendRequest` ADD CONSTRAINT `SendRequest_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
