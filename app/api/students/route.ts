import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const students = await prisma.student.findMany({
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    include: { course: true, grade: true, adaptation: true }
  });
  return NextResponse.json(students);
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.firstName || !body.lastName || !body.documentId || !body.email || !body.courseId) {
    return NextResponse.json({ error: "Datos de alumno incompletos" }, { status: 400 });
  }

  const student = await prisma.student.create({
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      documentId: body.documentId,
      email: body.email,
      phone: body.phone,
      confidentialNotes: body.confidentialNotes,
      courseId: body.courseId,
      grade: {
        create: {
          courseId: body.courseId,
          qualitativeStatus: "PENDIENTE",
          finalStatus: "PENDIENTE"
        }
      },
      adaptation: {
        create: { required: false }
      }
    },
    include: { course: true, grade: true, adaptation: true }
  });

  return NextResponse.json(student, { status: 201 });
}
