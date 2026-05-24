/*
  Warnings:

  - The values [github,google] on the enum `Authprovider` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Authprovider_new" AS ENUM ('Github', 'Google');
ALTER TABLE "User" ALTER COLUMN "provider" TYPE "Authprovider_new" USING ("provider"::text::"Authprovider_new");
ALTER TYPE "Authprovider" RENAME TO "Authprovider_old";
ALTER TYPE "Authprovider_new" RENAME TO "Authprovider";
DROP TYPE "public"."Authprovider_old";
COMMIT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "supabaseId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
