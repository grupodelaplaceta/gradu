import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
  const body = await request.json();
  if (!body.studentId || !body.targetType || !body.targetId || !body.status) {
    return NextResponse.json({ error: "studentId, targetType, targetId y status son requeridos" }, { status: 400 });
  }

  const data = {
    status: body.status,
    evidence: body.evidence,
    teacherNotes: body.teacherNotes,
    assessedAt: body.status === "NO_EVALUADO" ? null : new Date()
  };

  if (body.targetType === "RA") {
    const assessment = await prisma.learningOutcomeAssessment.upsert({
      where: {
        studentId_learningOutcomeId: {
          studentId: body.studentId,
          learningOutcomeId: body.targetId
        }
      },
      update: data,
      create: {
        studentId: body.studentId,
        learningOutcomeId: body.targetId,
        ...data
      }
    });
    return NextResponse.json(assessment);
  }

  if (body.targetType === "CE") {
    const assessment = await prisma.evaluationCriterionAssessment.upsert({
      where: {
        studentId_evaluationCriterionId: {
          studentId: body.studentId,
          evaluationCriterionId: body.targetId
        }
      },
      update: data,
      create: {
        studentId: body.studentId,
        evaluationCriterionId: body.targetId,
        ...data
      }
    });
    return NextResponse.json(assessment);
  }

  return NextResponse.json({ error: "targetType debe ser RA o CE" }, { status: 400 });
}
