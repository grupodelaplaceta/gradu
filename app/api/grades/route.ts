import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function calculateFinalStatus(gradingMode: string, body: { qualitativeStatus?: string; internalMockScore?: number; ciscoFinalValidated?: boolean }) {
  if (gradingMode === "CUALITATIVO") return body.qualitativeStatus ?? "PENDIENTE";
  if (typeof body.internalMockScore === "number" && body.internalMockScore >= 5 && body.ciscoFinalValidated) return "APTO";
  if (typeof body.internalMockScore === "number" && body.internalMockScore < 5) return "NO_APTO";
  return "PENDIENTE";
}

export async function PUT(request: Request) {
  const body = await request.json();
  if (!body.studentId) {
    return NextResponse.json({ error: "studentId requerido" }, { status: 400 });
  }

  const student = await prisma.student.findUnique({
    where: { id: body.studentId },
    include: { course: true }
  });
  if (!student) return NextResponse.json({ error: "Alumno no encontrado" }, { status: 404 });

  const grade = await prisma.grade.upsert({
    where: { studentId: body.studentId },
    update: {
      qualitativeStatus: body.qualitativeStatus ?? "PENDIENTE",
      internalMockScore: body.internalMockScore,
      ciscoFinalValidated: Boolean(body.ciscoFinalValidated),
      tutorObservations: body.tutorObservations,
      finalStatus: calculateFinalStatus(student.course.gradingMode, body)
    },
    create: {
      studentId: body.studentId,
      courseId: student.courseId,
      qualitativeStatus: body.qualitativeStatus ?? "PENDIENTE",
      internalMockScore: body.internalMockScore,
      ciscoFinalValidated: Boolean(body.ciscoFinalValidated),
      tutorObservations: body.tutorObservations,
      finalStatus: calculateFinalStatus(student.course.gradingMode, body)
    }
  });

  return NextResponse.json(grade);
}
