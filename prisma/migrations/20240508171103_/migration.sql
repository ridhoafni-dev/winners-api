/*
  Warnings:

  - You are about to drop the column `comment` on the `memo` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `memo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `memo` DROP COLUMN `comment`,
    DROP COLUMN `rating`;
