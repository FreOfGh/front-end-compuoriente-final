export type ClassResource = {
  title: string;
  description: string;
  videoUrl: string;
  workshopUrl: string;
};

export type ThemeAxis = {
  id: string;
  title: string;
  description: string;
  class: ClassResource;
};

export type Subject = {
  id: string;
  name: string;
  code: string;
  progress: number; // 0-100
  themes: ThemeAxis[];
};

export type ScheduleEntry = {
  id: string;
  day: string;
  time: string;
  subjectId: string;
  subjectName: string;
  location: string;
  teacher: string;
};

export type StudentProfile = {
  id: string;
  name: string;
  email: string;
  program: string;
  progress: number;
};

export const mockStudent: StudentProfile = {
  id: "student-01",
  name: "María Pérez",
  email: "maria.perez@example.com",
  program: "Ingeniería en Sistemas",
  progress: 52,
};

export const mockSchedule: ScheduleEntry[] = [
  {
    id: "s1",
    day: "Lunes",
    time: "08:00 - 10:00",
    subjectId: "materia-1",
    subjectName: "Windows",
    location: "Aula 201",
    teacher: "Ing. López",
  },
  {
    id: "s2",
    day: "Martes",
    time: "10:30 - 12:30",
    subjectId: "materia-2",
    subjectName: "Word",
    location: "Aula 205",
    teacher: "Dra. Rivera",
  },
  {
    id: "s3",
    day: "Miércoles",
    time: "14:00 - 16:00",
    subjectId: "materia-3",
    subjectName: "Excel",
    location: "Aula 402",
    teacher: "Ing. Castillo",
  },
  {
    id: "s4",
    day: "Jueves",
    time: "08:00 - 10:00",
    subjectId: "materia-4",
    subjectName: "desarrollo web",
    location: "Aula 309",
    teacher: "Ing. Gómez",
  },
];

export const mockSubjects: Subject[] = [
  {
    id: "materia-1",
    name: "Programación I",
    code: "PROG101",
    progress: 60,
    themes: [
      {
        id: "prog1",
        title: "Fundamentos de Programación",
        description: "Conceptos básicos: variables, tipos de datos y estructuras de control.",
        class: {
          title: "Clase 1: Introducción a la programación",
          description: "Video introductorio sobre lógica de programación y primeras líneas de código.",
          videoUrl: "https://www.youtube.com/embed/HP5vovf4A0I",
          workshopUrl: "https://example.com/talleres/prog1",
        },
      },
      {
        id: "prog2",
        title: "Funciones y modularidad",
        description: "Cómo dividir el código en funciones reutilizables.",
        class: {
          title: "Clase 2: Funciones y módulos",
          description: "Exploramos parámetros, retorno de valores y buenas prácticas.",
          videoUrl: "https://www.youtube.com/embed/OBhL38exY2w",
          workshopUrl: "https://example.com/talleres/prog2",
        },
      },
      {
        id: "prog3",
        title: "Estructuras de datos básicas",
        description: "Listas, arreglos y diccionarios en acción.",
        class: {
          title: "Clase 3: Colecciones y estructuras",
          description: "Aprende a almacenar y acceder a datos de forma eficiente.",
          videoUrl: "https://www.youtube.com/embed/GW0rWYwHw5k",
          workshopUrl: "https://example.com/talleres/prog3",
        },
      },
      {
        id: "prog4",
        title: "Depuración y pruebas",
        description: "Buenas prácticas para encontrar y corregir errores.",
        class: {
          title: "Clase 4: Depura tu código",
          description: "Herramientas y técnicas básicas de debugging.",
          videoUrl: "https://www.youtube.com/embed/AeJOxEip1Fo",
          workshopUrl: "https://example.com/talleres/prog4",
        },
      },
    ],
  },
  {
    id: "materia-2",
    name: "Matemáticas Discretas",
    code: "MATH104",
    progress: 40,
    themes: [
      {
        id: "math1",
        title: "Lógica y conjuntos",
        description: "Principios de lógica proposicional y teoría de conjuntos.",
        class: {
          title: "Clase 1: Lógica proposicional",
          description: "Introducción a proposiciones, conectores y tableros de verdad.",
          videoUrl: "https://www.youtube.com/embed/zosqOSV8Q-4",
          workshopUrl: "https://example.com/talleres/math1",
        },
      },
      {
        id: "math2",
        title: "Relaciones y funciones",
        description: "Conceptos de relaciones, funciones y su representación.",
        class: {
          title: "Clase 2: Funciones matemáticas",
          description: "Cómo modelar relaciones entre conjuntos.",
          videoUrl: "https://www.youtube.com/embed/9dYd2FHY_vY",
          workshopUrl: "https://example.com/talleres/math2",
        },
      },
      {
        id: "math3",
        title: "Grafos y árboles",
        description: "Estructuras fundamentales para modelar redes.",
        class: {
          title: "Clase 3: Grafos y árboles",
          description: "Modelando problemas con nodos y aristas.",
          videoUrl: "https://www.youtube.com/embed/ZnrjadQPd0w",
          workshopUrl: "https://example.com/talleres/math3",
        },
      },
      {
        id: "math4",
        title: "Combinatoria básica",
        description: "Contar sin contar: permutaciones y combinaciones.",
        class: {
          title: "Clase 4: Combinatoria",
          description: "Aplicaciones en conteo de posibilidades.",
          videoUrl: "https://www.youtube.com/embed/FFcjHxNDeTY",
          workshopUrl: "https://example.com/talleres/math4",
        },
      },
    ],
  },
  {
    id: "materia-3",
    name: "Redes de Computadoras",
    code: "NET203",
    progress: 25,
    themes: [
      {
        id: "net1",
        title: "Modelo OSI",
        description: "Capas del modelo OSI y su funcionamiento.",
        class: {
          title: "Clase 1: Modelo OSI",
          description: "Comprende cada capa y sus responsabilidades.",
          videoUrl: "https://www.youtube.com/embed/aW_KVE9e4Sc",
          workshopUrl: "https://example.com/talleres/net1",
        },
      },
      {
        id: "net2",
        title: "Direccionamiento IP",
        description: "IPv4, subredes y máscaras de red.",
        class: {
          title: "Clase 2: IP y Subredes",
          description: "Aprende a calcular rangos de direcciones.",
          videoUrl: "https://www.youtube.com/embed/gP0gU8KcTdg",
          workshopUrl: "https://example.com/talleres/net2",
        },
      },
      {
        id: "net3",
        title: "Protocolos comunes",
        description: "TCP/IP, UDP y HTTP al detalle.",
        class: {
          title: "Clase 3: Protocolos de red",
          description: "Cómo se comunican los equipos en la red.",
          videoUrl: "https://www.youtube.com/embed/QqT4sRUuTrk",
          workshopUrl: "https://example.com/talleres/net3",
        },
      },
      {
        id: "net4",
        title: "Seguridad en redes",
        description: "Conceptos básicos de firewalls y VPN.",
        class: {
          title: "Clase 4: Seguridad de red",
          description: "Introducción a buenas prácticas de seguridad.",
          videoUrl: "https://www.youtube.com/embed/YkoA8cKc3Tc",
          workshopUrl: "https://example.com/talleres/net4",
        },
      },
    ],
  },
  {
    id: "materia-4",
    name: "Bases de Datos",
    code: "DBS210",
    progress: 35,
    themes: [
      {
        id: "db1",
        title: "Modelado de datos",
        description: "Entidades, atributos y relaciones.",
        class: {
          title: "Clase 1: Modelado ER",
          description: "Crea diagramas entidad-relación eficientes.",
          videoUrl: "https://www.youtube.com/embed/S5OaP_u0nwA",
          workshopUrl: "https://example.com/talleres/db1",
        },
      },
      {
        id: "db2",
        title: "SQL básico",
        description: "Consultas SELECT, INSERT, UPDATE y DELETE.",
        class: {
          title: "Clase 2: SQL esencial",
          description: "Práctica de consultas para manipular datos.",
          videoUrl: "https://www.youtube.com/embed/u5eYc2knkGI",
          workshopUrl: "https://example.com/talleres/db2",
        },
      },
      {
        id: "db3",
        title: "Normalización",
        description: "Normaliza bases de datos para evitar redundancias.",
        class: {
          title: "Clase 3: Normalización",
          description: "Formas normales y ejemplos prácticos.",
          videoUrl: "https://www.youtube.com/embed/thE6f5YUl-Y",
          workshopUrl: "https://example.com/talleres/db3",
        },
      },
      {
        id: "db4",
        title: "Bases de datos NoSQL",
        description: "Introducción a almacenes de documentos y clave-valor.",
        class: {
          title: "Clase 4: NoSQL",
          description: "Cuándo usar NoSQL vs SQL y ejemplos básicos.",
          videoUrl: "https://www.youtube.com/embed/w2m4vDINYhI",
          workshopUrl: "https://example.com/talleres/db4",
        },
      },
    ],
  },
];
