-- CreateEnum
CREATE TYPE "ActivityPlanStatus" AS ENUM ('Aktif', 'Reschedule', 'Batal');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'LECTURER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STUDENT',
    "isActive" BOOLEAN DEFAULT false,
    "createAt" TIMESTAMP(6) NOT NULL DEFAULT timezone('Asia/Jakarta', now()),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "nim" TEXT NOT NULL,
    "stase" TEXT NOT NULL,
    "startSchoolYear" INTEGER NOT NULL,
    "endSchoolYear" INTEGER NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityPlan" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "status" "ActivityPlanStatus" DEFAULT 'Aktif',
    "active" BOOLEAN DEFAULT true,
    "createAt" TIMESTAMP(6) NOT NULL DEFAULT timezone('Asia/Jakarta', now()),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ActivityPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityPlanComment" (
    "id" SERIAL NOT NULL,
    "activityPlanId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "rating" INTEGER DEFAULT 0,
    "comment" TEXT,

    CONSTRAINT "ActivityPlanComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityPlanLecturer" (
    "id" SERIAL NOT NULL,
    "activityPlanId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ActivityPlanLecturer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Observation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "image" TEXT NOT NULL,
    "active" BOOLEAN DEFAULT true,
    "createAt" TIMESTAMP(6) NOT NULL DEFAULT timezone('Asia/Jakarta', now()),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Observation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "image" TEXT NOT NULL,
    "active" BOOLEAN DEFAULT true,
    "createAt" TIMESTAMP(6) NOT NULL DEFAULT timezone('Asia/Jakarta', now()),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportLecturer" (
    "id" SERIAL NOT NULL,
    "reportId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ReportLecturer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ObservationComment" (
    "id" SERIAL NOT NULL,
    "observationId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "rating" INTEGER DEFAULT 0,
    "comment" TEXT,

    CONSTRAINT "ObservationComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ObservationLecturer" (
    "id" SERIAL NOT NULL,
    "observationId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ObservationLecturer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Memo" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "active" BOOLEAN DEFAULT true,
    "createAt" TIMESTAMP(6) NOT NULL DEFAULT timezone('Asia/Jakarta', now()),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Memo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemoLecturer" (
    "id" SERIAL NOT NULL,
    "memoId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "MemoLecturer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemoComment" (
    "id" SERIAL NOT NULL,
    "memoId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "rating" INTEGER DEFAULT 0,
    "comment" TEXT,

    CONSTRAINT "MemoComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SelfEvaluation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "createAt" TIMESTAMP(6) NOT NULL DEFAULT timezone('Asia/Jakarta', now()),
    "updatedAt" TIMESTAMP(3),
    "active" BOOLEAN DEFAULT true,

    CONSTRAINT "SelfEvaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SelfEvaluationLecturer" (
    "id" SERIAL NOT NULL,
    "selfEvaluationId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "SelfEvaluationLecturer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SelfEvaluationComment" (
    "id" SERIAL NOT NULL,
    "selfEvaluationId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "rating" INTEGER DEFAULT 0,
    "comment" TEXT,
    "createAt" TIMESTAMP(6) NOT NULL DEFAULT timezone('Asia/Jakarta', now()),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "SelfEvaluationComment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ActivityPlanComment_activityPlanId_key" ON "ActivityPlanComment"("activityPlanId");

-- CreateIndex
CREATE UNIQUE INDEX "ActivityPlanLecturer_activityPlanId_key" ON "ActivityPlanLecturer"("activityPlanId");

-- CreateIndex
CREATE UNIQUE INDEX "ReportLecturer_reportId_key" ON "ReportLecturer"("reportId");

-- CreateIndex
CREATE UNIQUE INDEX "ObservationComment_observationId_key" ON "ObservationComment"("observationId");

-- CreateIndex
CREATE UNIQUE INDEX "ObservationLecturer_observationId_key" ON "ObservationLecturer"("observationId");

-- CreateIndex
CREATE UNIQUE INDEX "MemoLecturer_memoId_key" ON "MemoLecturer"("memoId");

-- CreateIndex
CREATE UNIQUE INDEX "MemoComment_memoId_key" ON "MemoComment"("memoId");

-- CreateIndex
CREATE UNIQUE INDEX "SelfEvaluationLecturer_selfEvaluationId_key" ON "SelfEvaluationLecturer"("selfEvaluationId");

-- CreateIndex
CREATE UNIQUE INDEX "SelfEvaluationComment_selfEvaluationId_key" ON "SelfEvaluationComment"("selfEvaluationId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityPlan" ADD CONSTRAINT "ActivityPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityPlanComment" ADD CONSTRAINT "ActivityPlanComment_activityPlanId_fkey" FOREIGN KEY ("activityPlanId") REFERENCES "ActivityPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityPlanComment" ADD CONSTRAINT "ActivityPlanComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityPlanLecturer" ADD CONSTRAINT "ActivityPlanLecturer_activityPlanId_fkey" FOREIGN KEY ("activityPlanId") REFERENCES "ActivityPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityPlanLecturer" ADD CONSTRAINT "ActivityPlanLecturer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Observation" ADD CONSTRAINT "Observation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportLecturer" ADD CONSTRAINT "ReportLecturer_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportLecturer" ADD CONSTRAINT "ReportLecturer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObservationComment" ADD CONSTRAINT "ObservationComment_observationId_fkey" FOREIGN KEY ("observationId") REFERENCES "Observation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObservationComment" ADD CONSTRAINT "ObservationComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObservationLecturer" ADD CONSTRAINT "ObservationLecturer_observationId_fkey" FOREIGN KEY ("observationId") REFERENCES "Observation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ObservationLecturer" ADD CONSTRAINT "ObservationLecturer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Memo" ADD CONSTRAINT "Memo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemoLecturer" ADD CONSTRAINT "MemoLecturer_memoId_fkey" FOREIGN KEY ("memoId") REFERENCES "Memo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemoLecturer" ADD CONSTRAINT "MemoLecturer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemoComment" ADD CONSTRAINT "MemoComment_memoId_fkey" FOREIGN KEY ("memoId") REFERENCES "Memo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemoComment" ADD CONSTRAINT "MemoComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelfEvaluation" ADD CONSTRAINT "SelfEvaluation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelfEvaluationLecturer" ADD CONSTRAINT "SelfEvaluationLecturer_selfEvaluationId_fkey" FOREIGN KEY ("selfEvaluationId") REFERENCES "SelfEvaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelfEvaluationLecturer" ADD CONSTRAINT "SelfEvaluationLecturer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelfEvaluationComment" ADD CONSTRAINT "SelfEvaluationComment_selfEvaluationId_fkey" FOREIGN KEY ("selfEvaluationId") REFERENCES "SelfEvaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SelfEvaluationComment" ADD CONSTRAINT "SelfEvaluationComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
