-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('STUDENT', 'LECTURER') NOT NULL DEFAULT 'STUDENT',
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Profile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `address` LONGTEXT NOT NULL,
    `nim` VARCHAR(191) NOT NULL,
    `stase` VARCHAR(191) NOT NULL,
    `startSchoolYear` INTEGER NOT NULL,
    `endSchoolYear` INTEGER NOT NULL,

    UNIQUE INDEX `Profile_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ActivityPlan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `name` LONGTEXT NOT NULL,
    `startDate` DATE NOT NULL,
    `endDate` DATE NOT NULL,
    `status` ENUM('Aktif', 'Reschedule', 'Batal') NULL DEFAULT 'Aktif',
    `active` BOOLEAN NULL DEFAULT true,
    `rating` INTEGER NULL DEFAULT 0,
    `comment` LONGTEXT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ActivityPlanComment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `activityPlanId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `rating` INTEGER NULL DEFAULT 0,
    `comment` LONGTEXT NULL,

    UNIQUE INDEX `ActivityPlanComment_activityPlanId_key`(`activityPlanId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Observation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `name` LONGTEXT NOT NULL,
    `description` LONGTEXT NOT NULL,
    `date` DATE NOT NULL,
    `image` LONGTEXT NOT NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ObservationComment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `observationId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `rating` INTEGER NULL DEFAULT 0,
    `comment` LONGTEXT NULL,

    UNIQUE INDEX `ObservationComment_observationId_key`(`observationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Memo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `title` LONGTEXT NOT NULL,
    `active` BOOLEAN NULL DEFAULT true,
    `rating` INTEGER NULL DEFAULT 0,
    `comment` LONGTEXT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MemoComment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `memoId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `rating` INTEGER NULL DEFAULT 0,
    `comment` LONGTEXT NULL,

    UNIQUE INDEX `MemoComment_memoId_key`(`memoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SelfEvaluation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `description` LONGTEXT NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SelfEvaluationComment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `selfEvaluationId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `rating` INTEGER NULL DEFAULT 0,
    `comment` LONGTEXT NULL,

    UNIQUE INDEX `SelfEvaluationComment_selfEvaluationId_key`(`selfEvaluationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Profile` ADD CONSTRAINT `Profile_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActivityPlan` ADD CONSTRAINT `ActivityPlan_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActivityPlanComment` ADD CONSTRAINT `ActivityPlanComment_activityPlanId_fkey` FOREIGN KEY (`activityPlanId`) REFERENCES `ActivityPlan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActivityPlanComment` ADD CONSTRAINT `ActivityPlanComment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Observation` ADD CONSTRAINT `Observation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ObservationComment` ADD CONSTRAINT `ObservationComment_observationId_fkey` FOREIGN KEY (`observationId`) REFERENCES `Observation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ObservationComment` ADD CONSTRAINT `ObservationComment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Memo` ADD CONSTRAINT `Memo_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MemoComment` ADD CONSTRAINT `MemoComment_memoId_fkey` FOREIGN KEY (`memoId`) REFERENCES `Memo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MemoComment` ADD CONSTRAINT `MemoComment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SelfEvaluation` ADD CONSTRAINT `SelfEvaluation_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SelfEvaluationComment` ADD CONSTRAINT `SelfEvaluationComment_selfEvaluationId_fkey` FOREIGN KEY (`selfEvaluationId`) REFERENCES `SelfEvaluation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SelfEvaluationComment` ADD CONSTRAINT `SelfEvaluationComment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
