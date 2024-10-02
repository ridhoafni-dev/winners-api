-- CreateTable
CREATE TABLE `ActivityPlanLecturer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `activityPlanId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `ActivityPlanLecturer_activityPlanId_key`(`activityPlanId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ObservationLecturer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `observationId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `ObservationLecturer_observationId_key`(`observationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MemoLecturer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `memoId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `MemoLecturer_memoId_key`(`memoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SelfEvaluationLecturer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `selfEvaluationId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `SelfEvaluationLecturer_selfEvaluationId_key`(`selfEvaluationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ActivityPlanLecturer` ADD CONSTRAINT `ActivityPlanLecturer_activityPlanId_fkey` FOREIGN KEY (`activityPlanId`) REFERENCES `ActivityPlan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActivityPlanLecturer` ADD CONSTRAINT `ActivityPlanLecturer_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ObservationLecturer` ADD CONSTRAINT `ObservationLecturer_observationId_fkey` FOREIGN KEY (`observationId`) REFERENCES `Observation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ObservationLecturer` ADD CONSTRAINT `ObservationLecturer_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MemoLecturer` ADD CONSTRAINT `MemoLecturer_memoId_fkey` FOREIGN KEY (`memoId`) REFERENCES `Memo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MemoLecturer` ADD CONSTRAINT `MemoLecturer_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SelfEvaluationLecturer` ADD CONSTRAINT `SelfEvaluationLecturer_selfEvaluationId_fkey` FOREIGN KEY (`selfEvaluationId`) REFERENCES `SelfEvaluation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SelfEvaluationLecturer` ADD CONSTRAINT `SelfEvaluationLecturer_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
