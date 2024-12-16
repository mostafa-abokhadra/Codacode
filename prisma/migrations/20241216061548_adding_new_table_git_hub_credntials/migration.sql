-- CreateTable
CREATE TABLE `GitHubCredential` (
    `user_id` INTEGER NOT NULL,
    `accessToken` VARCHAR(191) NULL,
    `githubUsername` VARCHAR(191) NULL,

    UNIQUE INDEX `GitHubCredential_user_id_key`(`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `GitHubCredential` ADD CONSTRAINT `GitHubCredential_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
