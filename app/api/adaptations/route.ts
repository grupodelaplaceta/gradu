import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
  const body = await request.json();
  if (!body.studentId) {
    return NextResponse.json({ error: "studentId requerido" }, { status: 400 });
  }

  const adaptation = await prisma.adaptation.upsert({
    where: { studentId: body.studentId },
    update: {
      required: Boolean(body.required),
      reason: body.required ? body.reason : null,
      tutorJustification: body.required ? body.tutorJustification : null
    },
    create: {
      studentId: body.studentId,
      required: Boolean(body.required),
      reason: body.required ? body.reason : null,
      tutorJustification: body.required ? body.tutorJustification : null
    }
  });

  return NextResponse.json(adaptation);
}
