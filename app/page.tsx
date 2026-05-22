"use client";

import { useMemo, useState } from "react";
import { Fragment } from "react";
import type { ComponentType, FormEvent, ReactNode } from "react";
import { jsPDF } from "jspdf";
import {
  Award,
  BarChart3,
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  ClipboardList,
  FileDown,
  GraduationCap,
  Info,
  LayoutDashboard,
  ListChecks,
  Plus,
  ShieldAlert,
  UserPlus,
  Users
} from "lucide-react";
import clsx from "clsx";

type CourseModality = "STANDARD" | "PLACETA_EDU";
type GradingMode = "CUALITATIVO" | "NUMERICO_CISCO";
type AttendanceStatus = "ASISTE" | "FALTA_JUSTIFICADA" | "FALTA_INJUSTIFICADA" | "RETRASO";
type SessionType = "Presencial" | "Telematica";
type FinalStatus = "APTO" | "NO APTO" | "PENDIENTE";
type AssessmentStatus = "NO_EVALUADO" | "EN_PROCESO" | "APTO" | "NO_APTO";

type Course = {
  id: string;
  name: string;
  modality: CourseModality;
  collaboratorCenter?: string;
  onlineWithoutCenter: boolean;
  gradingMode: GradingMode;
  isOpen: boolean;
};

type Student = {
  id: string;
  firstName: string;
  lastName: string;
  documentId: string;
  email: string;
  phone: string;
  courseId: string;
  confidentialNotes: string;
};

type Grade = {
  studentId: string;
  qualitativeStatus: FinalStatus;
  internalMockScore: number | "";
  ciscoFinalValidated: boolean;
  tutorObservations: string;
};

type Adaptation = {
  required: boolean;
  reason: string;
  tutorJustification: string;
};

const nav = [
  { id: "notebook", label: "Cuaderno docente", icon: ClipboardList },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "courses", label: "Cursos/Programas", icon: BookOpen },
  { id: "students", label: "Alumnos", icon: Users },
  { id: "attendance", label: "Asistencia", icon: CalendarCheck },
  { id: "grades", label: "Evaluaciones", icon: ListChecks },
  { id: "adaptations", label: "Adaptaciones", icon: ShieldAlert },
  { id: "certificates", label: "Certificados", icon: Award }
] as const;

const adaptationReasons = [
  "Brecha linguistica / Idioma",
  "Brecha digital severa (Sin dispositivo en el hogar)",
  "Dificultad de lectoescritura",
  "Discapacidad sensorial/motora",
  "Conciliacion laboral/familiar (Acceso asincrono)"
];

const attendanceLabels: Record<AttendanceStatus, string> = {
  ASISTE: "Asiste",
  FALTA_JUSTIFICADA: "Falta justificada",
  FALTA_INJUSTIFICADA: "Falta injustificada",
  RETRASO: "Retraso"
};

const assessmentLabels: Record<AssessmentStatus, string> = {
  NO_EVALUADO: "No evaluado",
  EN_PROCESO: "En proceso",
  APTO: "Apto",
  NO_APTO: "No apto"
};

const curriculum = [
  {
    module: "M1",
    title: "Hay todo un mundo nuevo ahi fuera",
    ra: [
      {
        code: "RA 1.1",
        text: "Diferencia hardware y software en dispositivos de uso comun.",
        ce: [
          ["CE 1.1.a", "Clasifica pantalla, teclado, router y memoria como hardware."],
          ["CE 1.1.b", "Identifica programas, sistemas operativos y apps moviles como software."]
        ]
      },
      {
        code: "RA 1.2",
        text: "Reconoce el impacto de las tecnologias digitales en el entorno cotidiano y educativo.",
        ce: [
          ["CE 1.2.a", "Describe situaciones donde la tecnologia optimiza tiempo y comunicacion familiar."],
          ["CE 1.2.b", "Identifica herramientas digitales basicas usadas en centros educativos."]
        ]
      }
    ]
  },
  {
    module: "M2",
    title: "Herramientas basicas",
    ra: [
      {
        code: "RA 2.1",
        text: "Configura y opera funciones basicas del sistema operativo.",
        ce: [
          ["CE 2.1.a", "Enciende, apaga, reinicia y desbloquea dispositivos de forma segura."],
          ["CE 2.1.b", "Revisa almacenamiento, idioma y hora desde ajustes."]
        ]
      },
      {
        code: "RA 2.2",
        text: "Gestiona archivos y documentos digitales en local.",
        ce: [
          ["CE 2.2.a", "Crea, renombra, mueve y elimina carpetas."],
          ["CE 2.2.b", "Localiza archivos descargados como resguardos, PDF escolares o fotos."]
        ]
      },
      {
        code: "RA 2.3",
        text: "Resuelve problemas menores de conectividad y rendimiento.",
        ce: [
          ["CE 2.3.a", "Identifica fallos WiFi y aplica reinicio de router o reconexion."],
          ["CE 2.3.b", "Detecta lentitud por apps abiertas o falta de espacio y libera memoria basica."]
        ]
      }
    ]
  },
  {
    module: "M3",
    title: "Navegacion y busqueda",
    ra: [
      {
        code: "RA 3.1",
        text: "Usa navegadores web gestionando la interfaz.",
        ce: [
          ["CE 3.1.a", "Distingue barra de direcciones y cuadro de busqueda."],
          ["CE 3.1.b", "Trabaja con varias pestanas sin perder el hilo."],
          ["CE 3.1.c", "Organiza webs frecuentes en marcadores o favoritos."]
        ]
      },
      {
        code: "RA 3.2",
        text: "Aplica busquedas adaptadas a necesidades del hogar.",
        ce: [
          ["CE 3.2.a", "Redacta palabras clave precisas evitando resultados genericos o publicitarios."],
          ["CE 3.2.b", "Usa Imagenes, Mapas, Noticias o Videos segun el tipo de informacion."]
        ]
      }
    ]
  },
  {
    module: "M4",
    title: "Mantenimiento y mejora",
    ra: [
      {
        code: "RA 4.1",
        text: "Aplica mantenimiento preventivo de software.",
        ce: [
          ["CE 4.1.a", "Reconoce y ejecuta actualizaciones del sistema."],
          ["CE 4.1.b", "Relaciona software al dia con rendimiento y seguridad."]
        ]
      },
      {
        code: "RA 4.2",
        text: "Descarga e instala aplicaciones de forma segura.",
        ce: [
          ["CE 4.2.a", "Usa tiendas oficiales o webs oficiales de fabricantes."],
          ["CE 4.2.b", "Revisa y desmarca casillas sospechosas o publicidad enganosa."]
        ]
      }
    ]
  },
  {
    module: "M5",
    title: "Seguridad, privacidad y consecuencias",
    ra: [
      {
        code: "RA 5.1",
        text: "Crea y gestiona credenciales seguras.",
        ce: [
          ["CE 5.1.a", "Disena contrasenas robustas con letras, numeros y simbolos."],
          ["CE 5.1.b", "Evita repetir contrasenas y aplica guardado o memorizacion segura."]
        ]
      },
      {
        code: "RA 5.2",
        text: "Detecta fraudes, amenazas y tecnicas basicas de ingenieria social.",
        ce: [
          ["CE 5.2.a", "Identifica alarmas de phishing en correos o SMS."],
          ["CE 5.2.b", "Describe malware y evita ventanas emergentes o alertas falsas."]
        ]
      },
      {
        code: "RA 5.3",
        text: "Protege privacidad, datos personales e imagen de menores.",
        ce: [
          ["CE 5.3.a", "Configura opciones basicas de privacidad."],
          ["CE 5.3.b", "Valora la huella digital de compartir fotos o datos familiares."]
        ]
      }
    ]
  },
  {
    module: "M6",
    title: "Autoaprendizaje y pensamiento critico",
    ra: [
      {
        code: "RA 6.1",
        text: "Usa la red como espacio de autoaprendizaje y apoyo escolar.",
        ce: [
          ["CE 6.1.a", "Localiza tutoriales o cursos gratuitos utiles para vida laboral o domestica."],
          ["CE 6.1.b", "Accede a recursos fiables para ayudar en tareas escolares."]
        ]
      },
      {
        code: "RA 6.2",
        text: "Desarrolla pensamiento critico frente a informacion digital.",
        ce: [
          ["CE 6.2.a", "Contrasta noticias o cadenas antes de compartirlas."],
          ["CE 6.2.b", "Distingue fuentes oficiales de blogs o foros informales."]
        ]
      }
    ]
  },
  {
    module: "M7",
    title: "Evaluacion final e integracion",
    ra: [
      {
        code: "RA 7.1",
        text: "Supera simulaciones de problemas digitales cotidianos.",
        ce: [
          ["CE 7.1.a", "Realiza el simulacro de la asociacion de forma calmada y analitica."],
          ["CE 7.1.b", "Corrige errores del simulacro y asimila la solucion correcta."]
        ]
      },
      {
        code: "RA 7.2",
        text: "Valida conocimientos en plataforma oficial externa y encuesta de calidad.",
        ce: [
          ["CE 7.2.a", "Completa la encuesta de satisfaccion Cisco de forma reflexiva."],
          ["CE 7.2.b", "Supera la Evaluacion Final de Conciencia Digital de Cisco."]
        ]
      }
    ]
  }
];

const seedCourses: Course[] = [
  {
    id: "conciencia-digital",
    name: "Conciencia Digital",
    modality: "STANDARD",
    onlineWithoutCenter: false,
    gradingMode: "CUALITATIVO",
    isOpen: true
  },
  {
    id: "digital-base",
    name: "Competencias Digitales Base",
    modality: "STANDARD",
    onlineWithoutCenter: false,
    gradingMode: "CUALITATIVO",
    isOpen: true
  }
];

const seedStudents: Student[] = [
  {
    id: "s1",
    firstName: "Nora",
    lastName: "Soler Vidal",
    documentId: "Y1234567L",
    email: "nora.soler@example.org",
    phone: "600 120 320",
    courseId: "conciencia-digital",
    confidentialNotes: "Seguimiento social trimestral."
  },
  {
    id: "s2",
    firstName: "Marc",
    lastName: "Aranda Ruiz",
    documentId: "53820192K",
    email: "marc.aranda@example.org",
    phone: "611 332 410",
    courseId: "digital-base",
    confidentialNotes: ""
  }
];

function nextId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

type IconComponent = ComponentType<{ size?: number; className?: string }>;

function getFullName(student?: Student) {
  return student ? `${student.firstName} ${student.lastName}` : "";
}

export default function PlacetaGrauApp() {
  const [active, setActive] = useState<(typeof nav)[number]["id"]>("notebook");
  const [courses, setCourses] = useState<Course[]>(seedCourses);
  const [students, setStudents] = useState<Student[]>(seedStudents);
  const [grades, setGrades] = useState<Record<string, Grade>>({
    s1: {
      studentId: "s1",
      qualitativeStatus: "APTO",
      internalMockScore: 8.4,
      ciscoFinalValidated: true,
      tutorObservations: "Domina montaje, redes basicas y resolucion guiada de incidencias."
    },
    s2: {
      studentId: "s2",
      qualitativeStatus: "PENDIENTE",
      internalMockScore: "",
      ciscoFinalValidated: false,
      tutorObservations: ""
    }
  });
  const [adaptations, setAdaptations] = useState<Record<string, Adaptation>>({});
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().slice(0, 10));
  const [attendanceCourseId, setAttendanceCourseId] = useState(seedCourses[0].id);
  const [sessionType, setSessionType] = useState<SessionType>("Presencial");
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
  const [notebookStudentId, setNotebookStudentId] = useState(seedStudents[0].id);
  const [raAssessments, setRaAssessments] = useState<Record<string, AssessmentStatus>>({});
  const [ceAssessments, setCeAssessments] = useState<Record<string, AssessmentStatus>>({});

  const selectedCourseStudents = students.filter((student) => student.courseId === attendanceCourseId);
  const officialCourseStudents = students.filter((student) => student.courseId === "conciencia-digital");
  const notebookStudent = students.find((student) => student.id === notebookStudentId) ?? officialCourseStudents[0] ?? students[0];
  const openCourses = courses.filter((course) => course.isOpen);
  const curriculumTotals = useMemo(() => {
    const raCount = curriculum.reduce((total, module) => total + module.ra.length, 0);
    const ceCount = curriculum.reduce((total, module) => total + module.ra.reduce((sum, ra) => sum + ra.ce.length, 0), 0);
    return { raCount, ceCount };
  }, []);
  const notebookProgress = useMemo(() => {
    if (!notebookStudent) return 0;
    const evaluated = curriculum.reduce((total, module) => {
      return (
        total +
        module.ra.filter((ra) => raAssessments[`${notebookStudent.id}:${ra.code}`] === "APTO").length +
        module.ra.reduce(
          (sum, ra) => sum + ra.ce.filter(([code]) => ceAssessments[`${notebookStudent.id}:${code}`] === "APTO").length,
          0
        )
      );
    }, 0);
    return Math.round((evaluated / (curriculumTotals.raCount + curriculumTotals.ceCount)) * 100);
  }, [ceAssessments, curriculumTotals.ceCount, curriculumTotals.raCount, notebookStudent, raAssessments]);
  const attendanceRate = useMemo(() => {
    const values = Object.values(attendance);
    if (!values.length) return 100;
    return Math.round((values.filter((value) => value === "ASISTE" || value === "RETRASO").length / values.length) * 100);
  }, [attendance]);

  function finalStatusFor(studentId: string): FinalStatus {
    const student = students.find((item) => item.id === studentId);
    const course = courses.find((item) => item.id === student?.courseId);
    const grade = grades[studentId];
    if (!grade || !course) return "PENDIENTE";
    if (course.gradingMode === "CUALITATIVO") return grade.qualitativeStatus;
    if (typeof grade.internalMockScore === "number" && grade.internalMockScore >= 5 && grade.ciscoFinalValidated) return "APTO";
    if (typeof grade.internalMockScore === "number" && grade.internalMockScore < 5) return "NO APTO";
    return "PENDIENTE";
  }

  function saveCourse(formData: FormData) {
    const modality = formData.get("modality") as CourseModality;
    const onlineWithoutCenter = formData.get("onlineWithoutCenter") === "on";
    const name = String(formData.get("name") || "").trim();
    const collaboratorCenter = String(formData.get("collaboratorCenter") || "").trim();
    if (!name) return;
    if (modality === "PLACETA_EDU" && !onlineWithoutCenter && !collaboratorCenter) return;
    setCourses((current) => [
      ...current,
      {
        id: nextId("course"),
        name,
        modality,
        collaboratorCenter: onlineWithoutCenter ? undefined : collaboratorCenter,
        onlineWithoutCenter,
        gradingMode: formData.get("gradingMode") as GradingMode,
        isOpen: true
      }
    ]);
  }

  function saveStudent(formData: FormData) {
    const firstName = String(formData.get("firstName") || "").trim();
    const lastName = String(formData.get("lastName") || "").trim();
    const courseId = String(formData.get("courseId") || "");
    if (!firstName || !lastName || !courseId) return;
    const id = nextId("student");
    setStudents((current) => [
      ...current,
      {
        id,
        firstName,
        lastName,
        documentId: String(formData.get("documentId") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        phone: String(formData.get("phone") || "").trim(),
        courseId,
        confidentialNotes: String(formData.get("confidentialNotes") || "").trim()
      }
    ]);
  }

  function updateGrade(studentId: string, patch: Partial<Grade>) {
    const blankGrade: Grade = {
      studentId,
      qualitativeStatus: "PENDIENTE",
      internalMockScore: "",
      ciscoFinalValidated: false,
      tutorObservations: ""
    };
    setGrades((current) => ({
      ...current,
      [studentId]: { ...blankGrade, ...current[studentId], ...patch }
    }));
  }

  function downloadReport(student: Student) {
    const course = courses.find((item) => item.id === student.courseId);
    const grade = grades[student.id];
    const doc = new jsPDF();
    doc.setTextColor(0, 128, 128);
    doc.setFontSize(20);
    doc.text("PlacetaGrau", 20, 22);
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.text("Boletin de Calificaciones", 20, 36);
    doc.setFontSize(11);
    doc.text(`Alumno: ${getFullName(student)}`, 20, 54);
    doc.text(`Curso: ${course?.name ?? "Sin curso"}`, 20, 64);
    doc.text(`Estado final: ${finalStatusFor(student.id)}`, 20, 74);
    doc.text(`Evaluacion cualitativa: ${grade?.qualitativeStatus ?? "PENDIENTE"}`, 20, 90);
    doc.text(`Simulacro interno: ${grade?.internalMockScore || "Sin nota"}`, 20, 100);
    doc.text(`Examen final Cisco validado: ${grade?.ciscoFinalValidated ? "Si" : "No"}`, 20, 110);
    doc.text("Observaciones del tutor:", 20, 128);
    doc.text(doc.splitTextToSize(grade?.tutorObservations || "Sin observaciones registradas.", 165), 20, 138);
    doc.save(`boletin-${student.lastName.toLowerCase().replaceAll(" ", "-")}.pdf`);
  }

  function downloadCertificate(student: Student) {
    const course = courses.find((item) => item.id === student.courseId);
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setDrawColor(0, 128, 128);
    doc.setLineWidth(2);
    doc.rect(12, 12, 273, 186);
    doc.setFillColor(232, 246, 246);
    doc.rect(18, 18, 261, 174, "F");
    doc.setTextColor(0, 128, 128);
    doc.setFontSize(24);
    doc.text("Grupo de La Placeta", 148, 42, { align: "center" });
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(26);
    doc.text("Certificado Oficial de la Asociacion", 148, 66, { align: "center" });
    doc.setFontSize(16);
    doc.text("El Departamento de Educacion certifica que", 148, 88, { align: "center" });
    doc.setFontSize(24);
    doc.text(getFullName(student), 148, 108, { align: "center" });
    doc.setFontSize(13);
    doc.text(`ha superado con estado APTO el programa ${course?.name ?? "formativo"}.`, 148, 124, { align: "center" });
    doc.text("Competencias adquiridas: soporte TIC, ciudadania digital, seguridad basica,", 148, 142, { align: "center" });
    doc.text("resolucion de incidencias y comunicacion tecnica responsable.", 148, 152, { align: "center" });
    doc.line(94, 174, 202, 174);
    doc.text("Firma del Departamento de Educacion", 148, 183, { align: "center" });
    doc.save(`certificado-${student.lastName.toLowerCase().replaceAll(" ", "-")}.pdf`);
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white lg:block">
          <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-school-teal text-white">
              <GraduationCap size={22} />
            </div>
            <div>
              <p className="text-base font-bold text-slate-950">PlacetaGrau</p>
              <p className="text-xs text-slate-500">Grupo de La Placeta</p>
            </div>
          </div>
          <nav className="space-y-1 p-3">
            {nav.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  className={clsx(
                    "focus-ring flex w-full items-center gap-3 rounded px-3 py-2.5 text-left text-sm font-medium",
                    active === item.id ? "bg-school-pale text-school-dark" : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col">
          <header className="flex min-h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-8">
            <div>
              <h1 className="text-xl font-bold text-slate-950">PlacetaGrau</h1>
              <p className="text-sm text-slate-500">Gestion educativa, asistencia y certificacion</p>
            </div>
            <div className="hidden items-center gap-2 rounded border border-teal-200 bg-school-pale px-3 py-2 text-sm text-school-dark md:flex">
              <CheckCircle2 size={16} />
              Sistema operativo
            </div>
          </header>

          <div className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white p-2 lg:hidden">
            {nav.map((item) => (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={clsx("focus-ring whitespace-nowrap rounded px-3 py-2 text-sm", active === item.id && "bg-school-teal text-white")}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="space-y-5 p-4 lg:p-8">
            {active === "notebook" && (
              <Panel title="Cuaderno docente - Conciencia Digital" icon={ClipboardList}>
                <div className="grid gap-3 md:grid-cols-4">
                  <Kpi title="Resultados de aprendizaje" value={curriculumTotals.raCount} icon={ListChecks} />
                  <Kpi title="Criterios evaluables" value={curriculumTotals.ceCount} icon={CheckCircle2} />
                  <Kpi title="Horas plataforma" value="6 h" icon={BookOpen} />
                  <Kpi title="Horas tutorizadas" value="12 h" icon={Users} />
                </div>

                <div className="rounded border border-slate-200 bg-white p-4 shadow-panel">
                  <div className="grid gap-4 lg:grid-cols-[280px_1fr_140px]">
                    <Field label="Alumno del cuaderno">
                      <select
                        className="input"
                        value={notebookStudent?.id ?? ""}
                        onChange={(event) => setNotebookStudentId(event.target.value)}
                      >
                        {officialCourseStudents.map((student) => (
                          <option key={student.id} value={student.id}>
                            {getFullName(student)}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Curso oficial</p>
                      <p className="mt-1 rounded border border-teal-200 bg-school-pale px-3 py-2 text-sm text-school-dark">
                        Conciencia Digital · Alfabetización Digital (Cisco & OpenEDG) · Cualitativa APTO / NO APTO
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Progreso APTO</p>
                      <p className="mt-1 rounded border border-slate-200 bg-slate-50 px-3 py-2 text-2xl font-bold text-slate-950">
                        {notebookProgress}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto rounded border border-slate-200 bg-white">
                  <table className="min-w-[1100px] divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-100 text-left text-xs uppercase text-slate-500">
                      <tr>
                        <th className="w-28 px-3 py-2">Bloque</th>
                        <th className="w-24 px-3 py-2">Código</th>
                        <th className="px-3 py-2">Elemento evaluable</th>
                        <th className="w-44 px-3 py-2">Evaluación</th>
                        <th className="w-64 px-3 py-2">Evidencia docente</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {curriculum.map((module) =>
                        module.ra.map((ra) => (
                          <Fragment key={ra.code}>
                            <tr className="bg-teal-50/60">
                              <td className="px-3 py-2 font-semibold text-school-dark">{module.module}</td>
                              <td className="px-3 py-2 font-semibold text-school-dark">{ra.code}</td>
                              <td className="px-3 py-2">
                                <p className="font-semibold text-slate-950">{module.title}</p>
                                <p className="text-slate-700">{ra.text}</p>
                              </td>
                              <td className="px-3 py-2">
                                <AssessmentSelect
                                  value={raAssessments[`${notebookStudent?.id}:${ra.code}`] ?? "NO_EVALUADO"}
                                  onChange={(value) =>
                                    notebookStudent &&
                                    setRaAssessments((current) => ({ ...current, [`${notebookStudent.id}:${ra.code}`]: value }))
                                  }
                                />
                              </td>
                              <td className="px-3 py-2">
                                <input className="input" placeholder="Observación breve del RA" />
                              </td>
                            </tr>
                            {ra.ce.map(([code, text]) => (
                              <tr key={code} className="hover:bg-slate-50">
                                <td className="px-3 py-2 text-slate-500">{module.module}</td>
                                <td className="px-3 py-2 font-medium text-slate-700">{code}</td>
                                <td className="px-3 py-2 text-slate-700">{text}</td>
                                <td className="px-3 py-2">
                                  <AssessmentSelect
                                    value={ceAssessments[`${notebookStudent?.id}:${code}`] ?? "NO_EVALUADO"}
                                    onChange={(value) =>
                                      notebookStudent &&
                                      setCeAssessments((current) => ({ ...current, [`${notebookStudent.id}:${code}`]: value }))
                                    }
                                  />
                                </td>
                                <td className="px-3 py-2">
                                  <input className="input" placeholder="Evidencia o actividad" />
                                </td>
                              </tr>
                            ))}
                          </Fragment>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Panel>
            )}

            {active === "dashboard" && (
              <div className="space-y-5">
                <div className="grid gap-4 md:grid-cols-3">
                  <Kpi title="Alumnos activos" value={students.length} icon={Users} />
                  <Kpi title="% asistencia global" value={`${attendanceRate}%`} icon={BarChart3} />
                  <Kpi title="Cursos abiertos" value={openCourses.length} icon={BookOpen} />
                </div>
                <Panel title="Actividad reciente" icon={Info}>
                  <ScannableTable
                    headers={["Alumno", "Curso", "Estado", "Adaptacion"]}
                    rows={students.map((student) => {
                      const course = courses.find((item) => item.id === student.courseId);
                      return [
                        getFullName(student),
                        course?.name ?? "Sin curso",
                        <StatusPill key="status" status={finalStatusFor(student.id)} />,
                        adaptations[student.id]?.required ? "Activa" : "No"
                      ];
                    })}
                  />
                </Panel>
              </div>
            )}

            {active === "courses" && (
              <Panel title="Alta de cursos - Modelo PlacetaEDU" icon={BookOpen}>
                <CourseForm onSubmit={saveCourse} />
                <CourseTable courses={courses} />
              </Panel>
            )}

            {active === "students" && (
              <Panel title="Alta de alumnos y registro" icon={UserPlus}>
                <StudentForm courses={courses} onSubmit={saveStudent} />
                <ScannableTable
                  headers={["Alumno", "Documento", "Contacto", "Curso", "Notas confidenciales"]}
                  rows={students.map((student) => [
                    getFullName(student),
                    student.documentId,
                    `${student.email} · ${student.phone}`,
                    courses.find((course) => course.id === student.courseId)?.name ?? "Sin curso",
                    student.confidentialNotes || "Sin notas"
                  ])}
                />
              </Panel>
            )}

            {active === "attendance" && (
              <Panel title="Registro de asistencia flexible" icon={CalendarCheck}>
                <div className="grid gap-4 md:grid-cols-3">
                  <Field label="Curso">
                    <select className="input" value={attendanceCourseId} onChange={(event) => setAttendanceCourseId(event.target.value)}>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Fecha">
                    <input className="input" type="date" value={attendanceDate} onChange={(event) => setAttendanceDate(event.target.value)} />
                  </Field>
                  <Field label="Tipo de sesion obligatorio">
                    <div className="flex h-10 overflow-hidden rounded border border-slate-300 bg-white">
                      {(["Presencial", "Telematica"] as SessionType[]).map((type) => (
                        <label key={type} className="flex flex-1 cursor-pointer items-center justify-center gap-2 text-sm">
                          <input
                            type="radio"
                            name="sessionType"
                            checked={sessionType === type}
                            onChange={() => setSessionType(type)}
                            className="accent-school-teal"
                          />
                          {type}
                        </label>
                      ))}
                    </div>
                  </Field>
                </div>
                <div className="overflow-x-auto rounded border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-100 text-left text-xs uppercase text-slate-500">
                      <tr>
                        <th className="px-4 py-3">Alumno</th>
                        <th className="px-4 py-3">Fecha</th>
                        <th className="px-4 py-3">Sesion</th>
                        <th className="px-4 py-3">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {selectedCourseStudents.map((student) => (
                        <tr key={student.id}>
                          <td className="px-4 py-3 font-medium text-slate-900">{getFullName(student)}</td>
                          <td className="px-4 py-3 text-slate-600">{attendanceDate}</td>
                          <td className="px-4 py-3 text-slate-600">{sessionType}</td>
                          <td className="px-4 py-3">
                            <select
                              className="input max-w-56"
                              value={attendance[student.id] ?? "ASISTE"}
                              onChange={(event) =>
                                setAttendance((current) => ({ ...current, [student.id]: event.target.value as AttendanceStatus }))
                              }
                            >
                              {Object.entries(attendanceLabels).map(([value, label]) => (
                                <option key={value} value={value}>
                                  {label}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Panel>
            )}

            {active === "grades" && (
              <Panel title="Evaluacion, calificaciones y boletines" icon={ListChecks}>
                <GradesTable students={students} courses={courses} grades={grades} finalStatusFor={finalStatusFor} updateGrade={updateGrade} />
              </Panel>
            )}

            {active === "adaptations" && (
              <Panel title="Adaptaciones justificadas" icon={ShieldAlert}>
                <div className="grid gap-4 lg:grid-cols-2">
                  {students.map((student) => {
                    const adaptation = adaptations[student.id] ?? { required: false, reason: "", tutorJustification: "" };
                    return (
                      <div key={student.id} className="rounded border border-slate-200 bg-white p-4 shadow-panel">
                        <div className="mb-4 flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-slate-950">{getFullName(student)}</h3>
                            <p className="text-sm text-slate-500">
                              {courses.find((course) => course.id === student.courseId)?.name ?? "Sin curso"}
                            </p>
                          </div>
                          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700" title="Activa el circuito de diversidad digital">
                            <input
                              type="checkbox"
                              className="peer sr-only"
                              checked={adaptation.required}
                              onChange={(event) =>
                                setAdaptations((current) => ({
                                  ...current,
                                  [student.id]: { ...adaptation, required: event.target.checked }
                                }))
                              }
                            />
                            <span className="h-6 w-11 rounded-full bg-slate-300 p-0.5 transition peer-checked:bg-school-teal">
                              <span className="block h-5 w-5 rounded-full bg-white transition peer-checked:translate-x-5" />
                            </span>
                            Requiere Adaptacion Curricular
                          </label>
                        </div>
                        {adaptation.required && (
                          <div className="space-y-3">
                            <Field label="Motivo justificado">
                              <select
                                className="input"
                                value={adaptation.reason}
                                onChange={(event) =>
                                  setAdaptations((current) => ({
                                    ...current,
                                    [student.id]: { ...adaptation, reason: event.target.value }
                                  }))
                                }
                              >
                                <option value="">Seleccionar motivo</option>
                                {adaptationReasons.map((reason) => (
                                  <option key={reason}>{reason}</option>
                                ))}
                              </select>
                            </Field>
                            <Field label="Justificacion tecnica del tutor">
                              <textarea
                                className="input min-h-24"
                                value={adaptation.tutorJustification}
                                onChange={(event) =>
                                  setAdaptations((current) => ({
                                    ...current,
                                    [student.id]: { ...adaptation, tutorJustification: event.target.value }
                                  }))
                                }
                              />
                            </Field>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Panel>
            )}

            {active === "certificates" && (
              <Panel title="Generacion automatica de documentos PDF" icon={FileDown}>
                <ScannableTable
                  headers={["Alumno", "Curso", "Estado final", "Boletin", "Certificado oficial"]}
                  rows={students.map((student) => {
                    const status = finalStatusFor(student.id);
                    return [
                      getFullName(student),
                      courses.find((course) => course.id === student.courseId)?.name ?? "Sin curso",
                      <StatusPill key="status" status={status} />,
                      <button key="report" className="btn-secondary" onClick={() => downloadReport(student)}>
                        <FileDown size={16} /> Boletin
                      </button>,
                      <button key="cert" className="btn-primary disabled:cursor-not-allowed disabled:opacity-50" disabled={status !== "APTO"} onClick={() => downloadCertificate(student)}>
                        <Award size={16} /> Certificado
                      </button>
                    ];
                  })}
                />
              </Panel>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function Kpi({ title, value, icon: Icon }: { title: string; value: string | number; icon: IconComponent }) {
  return (
    <div className="rounded border border-slate-200 bg-white p-5 shadow-panel">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <Icon className="text-school-teal" size={20} />
      </div>
      <p className="text-3xl font-bold text-slate-950">{value}</p>
    </div>
  );
}

function Panel({ title, icon: Icon, children }: { title: string; icon: IconComponent; children: ReactNode }) {
  return (
    <section className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded bg-school-pale text-school-teal">
          <Icon size={19} />
        </div>
        <h2 className="text-lg font-bold text-slate-950">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function CourseForm({ onSubmit }: { onSubmit: (formData: FormData) => void }) {
  const [modality, setModality] = useState<CourseModality>("STANDARD");
  const [onlineWithoutCenter, setOnlineWithoutCenter] = useState(false);
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(new FormData(event.currentTarget));
    event.currentTarget.reset();
    setModality("STANDARD");
    setOnlineWithoutCenter(false);
  }
  return (
    <form onSubmit={handleSubmit} className="rounded border border-slate-200 bg-white p-4 shadow-panel">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Field label="Nombre del curso">
          <input className="input" name="name" placeholder="Cisco CCST Networking" required />
        </Field>
        <Field label="Modalidad">
          <select className="input" name="modality" value={modality} onChange={(event) => setModality(event.target.value as CourseModality)}>
            <option value="STANDARD">Formato Estandar</option>
            <option value="PLACETA_EDU">Programa PlacetaEDU</option>
          </select>
        </Field>
        <Field label="Sistema de calificacion">
          <select className="input" name="gradingMode">
            <option value="CUALITATIVO">Cualitativo estricto</option>
            <option value="NUMERICO_CISCO">Numerico + Cisco</option>
          </select>
        </Field>
        <div className="flex items-end">
          <button className="btn-primary w-full" type="submit">
            <Plus size={16} /> Crear curso
          </button>
        </div>
      </div>
      {modality === "PLACETA_EDU" && (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="flex items-center gap-2 rounded border border-teal-200 bg-school-pale px-3 py-2 text-sm text-school-dark">
            <input
              name="onlineWithoutCenter"
              type="checkbox"
              checked={onlineWithoutCenter}
              onChange={(event) => setOnlineWithoutCenter(event.target.checked)}
              className="accent-school-teal"
            />
            Sin centro / 100% Online
          </label>
          {!onlineWithoutCenter && (
            <Field label="Centro Educativo de Origen/Colaborador">
              <input className="input" name="collaboratorCenter" required placeholder="IES, colegio o entidad colaboradora" />
            </Field>
          )}
        </div>
      )}
    </form>
  );
}

function StudentForm({ courses, onSubmit }: { courses: Course[]; onSubmit: (formData: FormData) => void }) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit(new FormData(event.currentTarget));
    event.currentTarget.reset();
  }
  return (
    <form onSubmit={handleSubmit} className="rounded border border-slate-200 bg-white p-4 shadow-panel">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Field label="Nombre">
          <input className="input" name="firstName" required />
        </Field>
        <Field label="Apellidos">
          <input className="input" name="lastName" required />
        </Field>
        <Field label="DNI/NIE/Pasaporte">
          <input className="input" name="documentId" required />
        </Field>
        <Field label="Correo electronico">
          <input className="input" type="email" name="email" required />
        </Field>
        <Field label="Telefono">
          <input className="input" name="phone" />
        </Field>
        <Field label="Curso asignado">
          <select className="input" name="courseId" required>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="mt-4">
        <Field label="Notas medicas/sociales confidenciales">
          <textarea className="input min-h-20" name="confidentialNotes" />
        </Field>
      </div>
      <div className="mt-4 flex justify-end">
        <button className="btn-primary" type="submit">
          <UserPlus size={16} /> Matricular alumno
        </button>
      </div>
    </form>
  );
}

function CourseTable({ courses }: { courses: Course[] }) {
  return (
    <ScannableTable
      headers={["Curso", "Modalidad", "Centro", "Calificacion", "Estado"]}
      rows={courses.map((course) => [
        course.name,
        course.modality === "PLACETA_EDU" ? "PlacetaEDU" : "Estandar",
        course.onlineWithoutCenter ? "Sin centro / Online" : course.collaboratorCenter || "No aplica",
        course.gradingMode === "NUMERICO_CISCO" ? "Numerico + Cisco" : "APTO / NO APTO",
        course.isOpen ? "Abierto" : "Cerrado"
      ])}
    />
  );
}

function GradesTable({
  students,
  courses,
  grades,
  finalStatusFor,
  updateGrade
}: {
  students: Student[];
  courses: Course[];
  grades: Record<string, Grade>;
  finalStatusFor: (studentId: string) => FinalStatus;
  updateGrade: (studentId: string, patch: Partial<Grade>) => void;
}) {
  return (
    <div className="overflow-x-auto rounded border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-100 text-left text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Alumno</th>
            <th className="px-4 py-3">Modelo</th>
            <th className="px-4 py-3">APTO / NO APTO</th>
            <th className="px-4 py-3">Simulacro interno</th>
            <th className="px-4 py-3">Cisco final</th>
            <th className="px-4 py-3">Estado</th>
            <th className="px-4 py-3">Observaciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {students.map((student) => {
            const course = courses.find((item) => item.id === student.courseId);
            const grade = grades[student.id] ?? {
              studentId: student.id,
              qualitativeStatus: "PENDIENTE",
              internalMockScore: "",
              ciscoFinalValidated: false,
              tutorObservations: ""
            };
            return (
              <tr key={student.id}>
                <td className="px-4 py-3 font-medium text-slate-900">{getFullName(student)}</td>
                <td className="px-4 py-3 text-slate-600">{course?.gradingMode === "NUMERICO_CISCO" ? "Numerico + Cisco" : "Cualitativo"}</td>
                <td className="px-4 py-3">
                  <select className="input max-w-36" value={grade.qualitativeStatus} onChange={(event) => updateGrade(student.id, { qualitativeStatus: event.target.value as FinalStatus })}>
                    <option>PENDIENTE</option>
                    <option>APTO</option>
                    <option>NO APTO</option>
                  </select>
                </td>
                <td className="px-4 py-3">
                  <input
                    className="input max-w-28"
                    type="number"
                    min="1"
                    max="10"
                    step="0.1"
                    value={grade.internalMockScore}
                    onChange={(event) =>
                      updateGrade(student.id, { internalMockScore: event.target.value === "" ? "" : Number(event.target.value) })
                    }
                  />
                </td>
                <td className="px-4 py-3">
                  <label className="flex items-center gap-2">
                    <input
                      className="accent-school-teal"
                      type="checkbox"
                      checked={grade.ciscoFinalValidated}
                      onChange={(event) => updateGrade(student.id, { ciscoFinalValidated: event.target.checked })}
                    />
                    Validado
                  </label>
                </td>
                <td className="px-4 py-3">
                  <StatusPill status={finalStatusFor(student.id)} />
                </td>
                <td className="px-4 py-3">
                  <input
                    className="input min-w-72"
                    value={grade.tutorObservations}
                    onChange={(event) => updateGrade(student.id, { tutorObservations: event.target.value })}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ScannableTable({ headers, rows }: { headers: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-100 text-left text-xs uppercase text-slate-500">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-slate-50">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-3 align-middle text-slate-700 first:font-medium first:text-slate-950">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusPill({ status }: { status: FinalStatus }) {
  return (
    <span
      className={clsx(
        "inline-flex rounded px-2.5 py-1 text-xs font-semibold",
        status === "APTO" && "bg-emerald-100 text-emerald-700",
        status === "NO APTO" && "bg-rose-100 text-rose-700",
        status === "PENDIENTE" && "bg-amber-100 text-amber-700"
      )}
    >
      {status}
    </span>
  );
}

function AssessmentSelect({ value, onChange }: { value: AssessmentStatus; onChange: (value: AssessmentStatus) => void }) {
  return (
    <select className="input" value={value} onChange={(event) => onChange(event.target.value as AssessmentStatus)}>
      {Object.entries(assessmentLabels).map(([status, label]) => (
        <option key={status} value={status}>
          {label}
        </option>
      ))}
    </select>
  );
}
