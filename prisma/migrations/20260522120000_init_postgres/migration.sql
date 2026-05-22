CREATE TABLE "Course" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "collection" TEXT,
  "platformTheoryHours" INTEGER NOT NULL DEFAULT 0,
  "tutoredHours" INTEGER NOT NULL DEFAULT 0,
  "level" TEXT,
  "assessmentType" TEXT,
  "assessmentMilestones" TEXT,
  "modality" TEXT NOT NULL DEFAULT 'STANDARD',
  "collaboratorCenter" TEXT,
  "onlineWithoutCenter" BOOLEAN NOT NULL DEFAULT false,
  "gradingMode" TEXT NOT NULL DEFAULT 'CUALITATIVO',
  "startDate" TIMESTAMP(3),
  "endDate" TIMESTAMP(3),
  "isOpen" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CourseModule" (
  "id" TEXT NOT NULL,
  "courseId" TEXT NOT NULL,
  "order" INTEGER NOT NULL,
  "title" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CourseModule_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LearningOutcome" (
  "id" TEXT NOT NULL,
  "moduleId" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "LearningOutcome_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "EvaluationCriterion" (
  "id" TEXT NOT NULL,
  "learningOutcomeId" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "EvaluationCriterion_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Student" (
  "id" TEXT NOT NULL,
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "documentId" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "confidentialNotes" TEXT,
  "courseId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AttendanceSession" (
  "id" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "type" TEXT NOT NULL,
  "courseId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AttendanceSession_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AttendanceRecord" (
  "id" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "sessionId" TEXT NOT NULL,
  "notes" TEXT,
  CONSTRAINT "AttendanceRecord_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Grade" (
  "id" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "courseId" TEXT NOT NULL,
  "qualitativeStatus" TEXT NOT NULL DEFAULT 'PENDIENTE',
  "internalMockScore" DOUBLE PRECISION,
  "ciscoFinalValidated" BOOLEAN NOT NULL DEFAULT false,
  "tutorObservations" TEXT,
  "finalStatus" TEXT NOT NULL DEFAULT 'PENDIENTE',
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Grade_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Adaptation" (
  "id" TEXT NOT NULL,
  "studentId" TEXT NOT NULL,
  "required" BOOLEAN NOT NULL DEFAULT false,
  "reason" TEXT,
  "tutorJustification" TEXT,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Adaptation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Course_name_key" ON "Course"("name");
CREATE UNIQUE INDEX "CourseModule_courseId_order_key" ON "CourseModule"("courseId", "order");
CREATE UNIQUE INDEX "LearningOutcome_moduleId_code_key" ON "LearningOutcome"("moduleId", "code");
CREATE UNIQUE INDEX "EvaluationCriterion_learningOutcomeId_code_key" ON "EvaluationCriterion"("learningOutcomeId", "code");
CREATE UNIQUE INDEX "Student_documentId_key" ON "Student"("documentId");
CREATE UNIQUE INDEX "AttendanceSession_courseId_date_type_key" ON "AttendanceSession"("courseId", "date", "type");
CREATE UNIQUE INDEX "AttendanceRecord_studentId_sessionId_key" ON "AttendanceRecord"("studentId", "sessionId");
CREATE UNIQUE INDEX "Grade_studentId_key" ON "Grade"("studentId");
CREATE UNIQUE INDEX "Adaptation_studentId_key" ON "Adaptation"("studentId");

ALTER TABLE "CourseModule"
  ADD CONSTRAINT "CourseModule_courseId_fkey"
  FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "LearningOutcome"
  ADD CONSTRAINT "LearningOutcome_moduleId_fkey"
  FOREIGN KEY ("moduleId") REFERENCES "CourseModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "EvaluationCriterion"
  ADD CONSTRAINT "EvaluationCriterion_learningOutcomeId_fkey"
  FOREIGN KEY ("learningOutcomeId") REFERENCES "LearningOutcome"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Student"
  ADD CONSTRAINT "Student_courseId_fkey"
  FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AttendanceSession"
  ADD CONSTRAINT "AttendanceSession_courseId_fkey"
  FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AttendanceRecord"
  ADD CONSTRAINT "AttendanceRecord_studentId_fkey"
  FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AttendanceRecord"
  ADD CONSTRAINT "AttendanceRecord_sessionId_fkey"
  FOREIGN KEY ("sessionId") REFERENCES "AttendanceSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Grade"
  ADD CONSTRAINT "Grade_studentId_fkey"
  FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Grade"
  ADD CONSTRAINT "Grade_courseId_fkey"
  FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Adaptation"
  ADD CONSTRAINT "Adaptation_studentId_fkey"
  FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
