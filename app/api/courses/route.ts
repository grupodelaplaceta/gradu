import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { students: true, sessions: true } } }
  });
  return NextResponse.json(courses);
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.name || (body.modality === "PLACETA_EDU" && !body.onlineWithoutCenter && !body.collaboratorCenter)) {
    return NextResponse.json({ error: "Datos de curso incompletos" }, { status: 400 });
  }

  const course = await prisma.course.create({
    data: {
      name: body.name,
      modality: body.modality ?? "STANDARD",
      collaboratorCenter: body.onlineWithoutCenter ? null : body.collaboratorCenter,
      onlineWithoutCenter: Boolean(body.onlineWithoutCenter),
      gradingMode: body.gradingMode ?? "CUALITATIVO",
      isOpen: body.isOpen ?? true
    }
  });

  return NextResponse.json(course, { status: 201 });
}
