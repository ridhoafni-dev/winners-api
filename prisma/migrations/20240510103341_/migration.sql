/*
  Warnings:

  - You are about to drop the column `comment` on the `activityplan` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `activityplan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `activityplan` DROP COLUMN `comment`,
    DROP COLUMN `rating`;
