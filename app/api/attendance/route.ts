import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.courseId || !body.date || !body.type || !Array.isArray(body.records)) {
    return NextResponse.json({ error: "Sesion de asistencia incompleta" }, { status: 400 });
  }

  const session = await prisma.attendanceSession.upsert({
    where: {
      courseId_date_type: {
        courseId: body.courseId,
        date: new Date(body.date),
        type: body.type
      }
    },
    update: {},
    create: {
      courseId: body.courseId,
      date: new Date(body.date),
      type: body.type
    }
  });

  await prisma.$transaction(
    body.records.map((record: { studentId: string; status: string; notes?: string }) =>
      prisma.attendanceRecord.upsert({
        where: { studentId_sessionId: { studentId: record.studentId, sessionId: session.id } },
        update: { status: record.status, notes: record.notes },
        create: {
          studentId: record.studentId,
          sessionId: session.id,
          status: record.status,
          notes: record.notes
        }
      })
    )
  );

  return NextResponse.json({ sessionId: session.id, saved: body.records.length });
}
