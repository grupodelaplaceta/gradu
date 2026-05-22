const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const courseName = "Conciencia Digital";

const assessmentMilestones = [
  {
    code: "SIMULACRO_ASOCIACION",
    name: "Examen Simulacro Asociación",
    gradingType: "NUMERICO",
    scale: "1-10",
    purpose: "Entrenamiento interno y detección de refuerzos antes de la validación externa."
  },
  {
    code: "FINAL_CISCO",
    name: "Examen Final Cisco",
    gradingType: "CUALITATIVO_PORCENTAJE",
    scale: "APTO / NO APTO con porcentaje de plataforma",
    purpose: "Validación final externa del curso Conciencia Digital."
  }
];

const modules = [
  {
    order: 1,
    title: "¡Hay todo un mundo nuevo ahí fuera!",
    learningOutcomes: [
      {
        code: "RA 1.1",
        description:
          "Diferencia los componentes físicos (hardware) de los lógicos (software) en los dispositivos tecnológicos de uso común.",
        criteria: [
          {
            code: "CE 1.1.a",
            description: "Clasifica elementos como la pantalla, el teclado, el router y la memoria dentro del hardware."
          },
          {
            code: "CE 1.1.b",
            description: "Identifica los programas, sistemas operativos y aplicaciones móviles como componentes de software."
          }
        ]
      },
      {
        code: "RA 1.2",
        description: "Reconoce el impacto y la utilidad de las tecnologías digitales en el entorno cotidiano y educativo.",
        criteria: [
          {
            code: "CE 1.2.a",
            description:
              "Describe situaciones cotidianas donde el uso de la tecnología optimiza el tiempo y la comunicación familiar."
          },
          {
            code: "CE 1.2.b",
            description:
              "Identifica las herramientas digitales básicas que se emplean habitualmente en los centros educativos de sus hijos."
          }
        ]
      }
    ]
  },
  {
    order: 2,
    title: "Necesitarás algunas herramientas básicas",
    learningOutcomes: [
      {
        code: "RA 2.1",
        description: "Configura y opera las funciones básicas del sistema operativo en ordenadores y teléfonos inteligentes.",
        criteria: [
          {
            code: "CE 2.1.a",
            description: "Enciende, apaga, reinicia y desbloquea los dispositivos de forma correcta y segura."
          },
          {
            code: "CE 2.1.b",
            description:
              "Navega por los menús de ajustes para revisar el almacenamiento, el idioma y la hora del dispositivo."
          }
        ]
      },
      {
        code: "RA 2.2",
        description: "Gestiona archivos y documentos digitales en el dispositivo local.",
        criteria: [
          {
            code: "CE 2.2.a",
            description: "Crea, renombra, mueve y elimina carpetas para organizar documentos escolares o familiares."
          },
          {
            code: "CE 2.2.b",
            description: "Localiza de manera rápida archivos descargados (como resguardos, PDF de la escuela o fotos)."
          }
        ]
      },
      {
        code: "RA 2.3",
        description: "Diagnostica y resuelve problemas técnicos menores de conectividad y rendimiento en el hogar.",
        criteria: [
          {
            code: "CE 2.3.a",
            description:
              "Identifica fallos comunes de la red WiFi y aplica soluciones como reiniciar el router o reconectar el dispositivo."
          },
          {
            code: "CE 2.3.b",
            description:
              "Detecta los motivos de la lentitud de un dispositivo (exceso de aplicaciones abiertas, falta de espacio) y libera memoria básica."
          }
        ]
      }
    ]
  },
  {
    order: 3,
    title: "Así es como te desplazas y encuentras lo que buscas",
    learningOutcomes: [
      {
        code: "RA 3.1",
        description: "Utiliza navegadores web de forma eficiente gestionando la interfaz de usuario.",
        criteria: [
          {
            code: "CE 3.1.a",
            description: "Distingue con claridad entre la barra de direcciones y el cuadro del motor de búsqueda."
          },
          {
            code: "CE 3.1.b",
            description: "Trabaja con varias pestañas de forma simultánea sin perder el hilo de la navegación."
          },
          {
            code: "CE 3.1.c",
            description: "Organiza las páginas web de uso frecuente en la sección de marcadores o favoritos."
          }
        ]
      },
      {
        code: "RA 3.2",
        description: "Aplica técnicas de búsqueda de información en Internet adaptadas a las necesidades del hogar.",
        criteria: [
          {
            code: "CE 3.2.a",
            description:
              "Redacta palabras clave precisas para encontrar soluciones a dudas concretas, evitando resultados genéricos o publicitarios."
          },
          {
            code: "CE 3.2.b",
            description:
              "Utiliza las pestañas de búsqueda especializada (Imágenes, Mapas, Noticias, Vídeos) según el tipo de información requerido."
          }
        ]
      }
    ]
  },
  {
    order: 4,
    title: "Sigue mejorando",
    learningOutcomes: [
      {
        code: "RA 4.1",
        description: "Aplica el mantenimiento preventivo de software en los dispositivos de uso familiar.",
        criteria: [
          {
            code: "CE 4.1.a",
            description:
              "Reconoce los avisos de actualizaciones del sistema operativo y las ejecuta para mantener el equipo protegido."
          },
          {
            code: "CE 4.1.b",
            description: "Entiende los beneficios de mantener el software al día respecto al rendimiento y la seguridad."
          }
        ]
      },
      {
        code: "RA 4.2",
        description: "Descarga e instala aplicaciones de forma segura minimizando riesgos técnicos.",
        criteria: [
          {
            code: "CE 4.2.a",
            description: "Utiliza exclusivamente tiendas oficiales o webs oficiales de fabricantes para obtener programas."
          },
          {
            code: "CE 4.2.b",
            description:
              "Revisa y desmarca casillas sospechosas o de publicidad engañosa durante los procesos de instalación."
          }
        ]
      }
    ]
  },
  {
    order: 5,
    title: "Aunque sea digital, es real, con consecuencias reales; ¡ten cuidado ahí fuera!",
    learningOutcomes: [
      {
        code: "RA 5.1",
        description: "Crea y gestiona credenciales de acceso seguras para los diferentes servicios de la red.",
        criteria: [
          {
            code: "CE 5.1.a",
            description:
              "Diseña contraseñas robustas combinando letras, números y símbolos, evitando datos personales evidentes."
          },
          {
            code: "CE 5.1.b",
            description:
              "Reconoce el riesgo de utilizar la misma contraseña para todas las plataformas y aplica técnicas sencillas de memorización o guardado seguro."
          }
        ]
      },
      {
        code: "RA 5.2",
        description: "Detecta fraudes informáticos, amenazas digitales y técnicas de ingeniería social básicas.",
        criteria: [
          {
            code: "CE 5.2.a",
            description: "Identifica señales de alarma en correos o SMS sospechosos vinculados al phishing."
          },
          {
            code: "CE 5.2.b",
            description:
              "Describe qué es un virus o malware y evita hacer clic en ventanas emergentes publicitarias o alertas falsas."
          }
        ]
      },
      {
        code: "RA 5.3",
        description: "Protege la privacidad, los datos personales y la imagen de los menores en Internet.",
        criteria: [
          {
            code: "CE 5.3.a",
            description: "Configura opciones básicas de privacidad en perfiles o aplicaciones de uso común."
          },
          {
            code: "CE 5.3.b",
            description:
              "Valora el impacto a largo plazo de compartir fotos o datos sensibles de la familia en la red (huella digital)."
          }
        ]
      }
    ]
  },
  {
    order: 6,
    title: "Aprende sobre cualquier cosa y todo",
    learningOutcomes: [
      {
        code: "RA 6.1",
        description: "Utiliza la red como un espacio de autoaprendizaje permanente y apoyo escolar.",
        criteria: [
          {
            code: "CE 6.1.a",
            description:
              "Localiza plataformas de tutoriales en vídeo o cursos gratuitos para aprender habilidades manuales, domésticas o laborales."
          },
          {
            code: "CE 6.1.b",
            description: "Accede a recursos digitales fiables para ayudar a los hijos en tareas escolares."
          }
        ]
      },
      {
        code: "RA 6.2",
        description: "Desarrolla el pensamiento crítico frente a la información que circula en los entornos digitales.",
        criteria: [
          {
            code: "CE 6.2.a",
            description: "Contrasta una noticia o cadena de texto antes de darla por verídica o compartirla (fake news)."
          },
          {
            code: "CE 6.2.b",
            description:
              "Identifica fuentes de información oficiales e institucionales frente a blogs o foros informales."
          }
        ]
      }
    ]
  },
  {
    order: 7,
    title: "Bloque de evaluación final e integración (Cisco & Asociación)",
    learningOutcomes: [
      {
        code: "RA 7.1",
        description: "Supera pruebas de simulación orientadas a la resolución de problemas digitales en entornos cotidianos.",
        criteria: [
          {
            code: "CE 7.1.a",
            description:
              "Realiza el examen simulacro de la asociación aplicando los conocimientos adquiridos de forma calmada y analítica."
          },
          {
            code: "CE 7.1.b",
            description:
              "Identifica los errores cometidos en el simulacro durante la corrección conjunta y asimila la solución correcta como refuerzo."
          }
        ]
      },
      {
        code: "RA 7.2",
        description:
          "Valida los conocimientos de alfabetización digital mediante la plataforma oficial externa y la encuesta de calidad.",
        criteria: [
          {
            code: "CE 7.2.a",
            description: "Completa la encuesta de satisfacción de fin de curso de Cisco de manera reflexiva."
          },
          {
            code: "CE 7.2.b",
            description:
              "Supera la Evaluación Final de Conciencia Digital de Cisco, demostrando la asimilación global de todos los conceptos del curso."
          }
        ]
      }
    ]
  }
];

async function main() {
  const course = await prisma.course.upsert({
    where: { name: courseName },
    update: {
      collection: "Alfabetización Digital (Cisco & OpenEDG)",
      platformTheoryHours: 6,
      tutoredHours: 12,
      level: "Principiante",
      assessmentType: "Cualitativa (APTO / NO APTO)",
      assessmentMilestones: JSON.stringify(assessmentMilestones),
      modality: "STANDARD",
      gradingMode: "CUALITATIVO",
      isOpen: true
    },
    create: {
      name: courseName,
      collection: "Alfabetización Digital (Cisco & OpenEDG)",
      platformTheoryHours: 6,
      tutoredHours: 12,
      level: "Principiante",
      assessmentType: "Cualitativa (APTO / NO APTO)",
      assessmentMilestones: JSON.stringify(assessmentMilestones),
      modality: "STANDARD",
      gradingMode: "CUALITATIVO",
      isOpen: true
    }
  });

  await prisma.courseModule.deleteMany({
    where: { courseId: course.id }
  });

  await prisma.course.update({
    where: { id: course.id },
    data: {
      modules: {
        create: modules.map((module) => ({
          order: module.order,
          title: module.title,
          learningOutcomes: {
            create: module.learningOutcomes.map((learningOutcome) => ({
              code: learningOutcome.code,
              description: learningOutcome.description,
              criteria: {
                create: learningOutcome.criteria.map((criterion) => ({
                  code: criterion.code,
                  description: criterion.description
                }))
              }
            }))
          }
        }))
      }
    }
  });

  const totals = modules.reduce(
    (acc, module) => {
      acc.modules += 1;
      acc.learningOutcomes += module.learningOutcomes.length;
      acc.criteria += module.learningOutcomes.reduce((sum, learningOutcome) => sum + learningOutcome.criteria.length, 0);
      return acc;
    },
    { modules: 0, learningOutcomes: 0, criteria: 0 }
  );

  console.log(
    `Seed completado: ${courseName} (${totals.modules} módulos, ${totals.learningOutcomes} RA, ${totals.criteria} CE).`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
