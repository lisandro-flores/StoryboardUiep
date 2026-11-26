export interface StoryboardScene {
  number: number;
  numeral: string;
  phase: string;
  accent: 'forest' | 'peach' | 'olive' | 'rose';
  title: string;
  locationTag: string;
  imageWebp: string;
  imageJpg: string;
  imageAlt: string;
  objectPosition: string;
  secondaryPhoto?: {
    webp: string;
    jpg: string;
    alt: string;
    label: string;
    objectPosition: string;
  };
  /** Qué se está haciendo (texto breve en pantalla, máx. 2 líneas) */
  whatLines: [string, string];
  /** Cómo se está haciendo en la práctica junto con la comunidad */
  howDescription: string;
  speaker: string;
  dialogue: string;
  visualDescription: string;
  transitionNote: string;
}

export const STORYBOARD_SCENES: StoryboardScene[] = [
  {
    number: 1,
    numeral: '01',
    phase: 'Contexto · Llegada a territorio',
    accent: 'peach',
    title: 'Presencia en campo y vinculación con San José Buenavista',
    locationTag: 'Calles de San José Buenavista',
    imageWebp: 'assets/foto-01.webp',
    imageJpg: 'assets/foto-01.jpg',
    imageAlt:
      'Brigada estudiantil de Ingeniería Civil Sustentable de la UIEP en las calles de San José Buenavista, Puebla.',
    objectPosition: '50% 42%',
    whatLines: [
      'Acudimos directamente a San José Buenavista para caminar su territorio',
      'y escuchar de primera mano a las familias de la comunidad.',
    ],
    howDescription:
      'La brigada de 10 estudiantes de Ingeniería Civil Sustentable de la UIEP, asesorada por el Dr. Rogelio Rojas Ramos, visita personalmente las calles de la localidad con respeto, apertura e identidad intercultural.',
    speaker: 'Brigada UIEP en comunidad',
    dialogue:
      '«Venimos de la Universidad Intercultural del Estado de Puebla a caminar junto con ustedes, conocer su realidad cotidiana y sumar nuestro trabajo técnico al servicio del pueblo.»',
    visualDescription:
      'Fotografía documental abierta en una calle de terracería de San José Buenavista bajo cielo despejado, con viviendas de block, nopales y los cerros de la región al fondo. Integrantes de la brigada universitaria portan chalecos reflejantes, gafetes con cordón azul, sombreros para el sol y mochilas de campo.',
    transitionNote:
      'De la bienvenida en las calles habitacionales avanzamos hacia los caminos rurales y cruces naturales de la localidad.',
  },
  {
    number: 2,
    numeral: '02',
    phase: 'Contexto · Diagnóstico participativo',
    accent: 'rose',
    title: '¿Qué se está haciendo? Un diagnóstico guiado por la comunidad',
    locationTag: 'Caminos y cruce de barranca',
    imageWebp: 'assets/foto-02.webp',
    imageJpg: 'assets/foto-02.jpg',
    imageAlt:
      'Recorrido comunitario de estudiantes y asesor por los caminos y el cruce de barranca en San José Buenavista.',
    objectPosition: '50% 62%',
    whatLines: [
      'Realizamos un Diagnóstico Comunitario Participativo:',
      'identificamos necesidades reales sin imponer proyectos desde afuera.',
    ],
    howDescription:
      'Observamos en sitio el estado real de los caminos, pasos sobre barranca y servicios, combinando la mirada técnica de ingeniería civil sustentable con la experiencia diaria de quienes habitan San José Buenavista.',
    speaker: 'Enfoque participativo',
    dialogue:
      '«Aquí no traemos decisiones tomadas de antemano: recorremos cada tramo para entender qué pasa en temporada de lluvias y qué obras hacen falta de verdad.»',
    visualDescription:
      'Fotografía real en plano general de la brigada cruzando a pie un paso vehicular estrecho sobre la barranca rodeado de vegetación semiárida y cerros, evidenciando la falta de resguardo peatonal seguro.',
    transitionNote:
      'Del reconocimiento territorial pasamos a la coordinación institucional con las autoridades locales.',
  },
  {
    number: 3,
    numeral: '03',
    phase: 'Etapa 1 de 4 · Planeación',
    accent: 'forest',
    title: 'Coordinación formal con autoridades y Juzgado de Paz',
    locationTag: 'Oficina del Juzgado de Paz',
    imageWebp: 'assets/foto-03.webp',
    imageJpg: 'assets/foto-03.jpg',
    imageAlt:
      'Estudiantes de la UIEP, asesor y autoridades locales en la Oficina del Juzgado de Paz de San José Buenavista.',
    objectPosition: '50% 35%',
    whatLines: [
      'Etapa 1 · Planeación: Acordamos con las autoridades locales',
      'la organización de talleres, recorridos y temas prioritarios.',
    ],
    howDescription:
      'Nos reunimos formalmente en el Juzgado de Paz con autoridades y representantes comunitarios para presentar el plan de trabajo, pedir anuencia, definir fechas de talleres y asegurar una convocatoria abierta y respetuosa.',
    speaker: 'Trabajo con autoridades',
    dialogue:
      '«Todo paso se coordina primero con las autoridades de San José Buenavista para trabajar en orden, con transparencia y tomando en cuenta a toda la población.»',
    visualDescription:
      'Fotografía real en el interior de la Oficina del Juzgado de Paz: autoridades comunitarias, docente asesor e integrantes de la brigada posan juntos sosteniendo la documentación de acuerdos de vinculación.',
    transitionNote:
      'Con la planeación y permisos acordados, los equipos salen a recorrer calles, veredas y espacios públicos.',
  },
  {
    number: 4,
    numeral: '04',
    phase: 'Etapa 2 de 4 · Trabajo de campo',
    accent: 'olive',
    title: 'Aplicación de encuestas, entrevistas y recorridos a pie',
    locationTag: 'Calles y brechas de la localidad',
    imageWebp: 'assets/foto-04.webp',
    imageJpg: 'assets/foto-04.jpg',
    imageAlt:
      'Brigada de estudiantes y docente mostrando los formatos de encuesta sobre una calle de tierra en San José Buenavista.',
    objectPosition: '50% 24%',
    secondaryPhoto: {
      webp: 'assets/foto-09.webp',
      jpg: 'assets/foto-09.jpg',
      alt: 'Brigadistas caminando por brechas de tierra bordeadas de órganos cactáceos y mezquites en San José Buenavista.',
      label: 'Recorrido en brechas',
      objectPosition: '50% 55%',
    },
    whatLines: [
      'Etapa 2 · Trabajo de campo: Recorremos calles y aplicamos encuestas',
      'para registrar problemáticas de caminos, agua, accesos y servicios.',
    ],
    howDescription:
      'Caminamos calle por calle con formatos impresos de encuesta y libretas de campo, platicando directamente con vecinas, vecinos y adultos mayores para escuchar qué dificultades enfrentan todos los días.',
    speaker: 'Brigada en recorrido de calle',
    dialogue:
      '«En cada calle escuchamos opiniones reales sobre el estado de la terracería, el suministro de agua y los puntos donde cuesta más caminar con seguridad.»',
    visualDescription:
      'Dos fotografías reales de campo: brigadistas con chalecos reflejantes y gafetes sosteniendo las cédulas impresas de encuesta en una calle de tierra, acompañados del recorrido a pie entre cactáceas columnares y vegetación local.',
    transitionNote:
      'Todas las voces reunidas en las calles se llevan a la mesa colectiva del taller comunitario.',
  },
  {
    number: 5,
    numeral: '05',
    phase: 'Etapa 2 de 4 · Trabajo de campo',
    accent: 'rose',
    title: 'Mesas participativas y dibujo conjunto del mapa social',
    locationTag: 'Techado comunitario',
    imageWebp: 'assets/foto-05.webp',
    imageJpg: 'assets/foto-05.jpg',
    imageAlt:
      'Vecinos, jóvenes estudiantes locales y brigadistas de la UIEP reunidos en mesa de madera bajo el techado dibujando el mapa social.',
    objectPosition: '50% 42%',
    whatLines: [
      'Etapa 2 · Mapa social: Vecinos, jóvenes y brigada dibujamos juntos',
      'el croquis de la comunidad para ubicar las necesidades más urgentes.',
    ],
    howDescription:
      'Mediante dinámicas grupales y conversatorios bajo el techado comunitario, habitantes de distintas edades trazan sobre papel bond su propio territorio, señalando qué zonas requieren atención prioritaria.',
    speaker: 'Taller participativo vecinal',
    dialogue:
      '«Alrededor de la misma mesa participan jóvenes, adultos y familias señalando en el mapa dónde están los puntos críticos de la comunidad.»',
    visualDescription:
      'Fotografía real del taller comunitario bajo techado de lámina: jóvenes con uniforme escolar verde con blanco, habitantes adultos y estudiantes brigadistas dialogan alrededor de un pliego de papel bond con plumones de colores.',
    transitionNote:
      'Los mapas y encuestas levantados con la gente pasan al proceso de organización y análisis detallado.',
  },
  {
    number: 6,
    numeral: '06',
    phase: 'Etapa 3 de 4 · Análisis',
    accent: 'forest',
    title: 'Organización y análisis de las prioridades comunitarias',
    locationTag: 'Sesión de sistematización UIEP',
    imageWebp: 'assets/foto-06.webp',
    imageJpg: 'assets/foto-06.jpg',
    imageAlt:
      'Equipo de estudiantes de Ingeniería Civil Sustentable organizando libretas, datos y láminas para analizar los resultados del diagnóstico.',
    objectPosition: '50% 45%',
    whatLines: [
      'Ordenamos toda la información recabada en encuestas y talleres',
      'para identificar con claridad las prioridades de San José Buenavista.',
    ],
    howDescription:
      'En mesas de trabajo académico revisamos cada encuesta, comentario vecinal y mapa social para clasificar las problemáticas más sentidas y evaluar qué alternativas técnicas resultan viables y sustentables.',
    speaker: 'Equipo de análisis UIEP',
    dialogue:
      '«Cada opinión que nos compartieron en la comunidad se registra y se analiza con cuidado para que las propuestas respondan fielmente a lo que pidió la gente.»',
    visualDescription:
      'Fotografía real de trabajo colaborativo en aula: los integrantes de la brigada revisan cuadernos, notas de campo y pliegos de síntesis concentrados alrededor de las mesas de trabajo.',
    transitionNote:
      'A partir de los datos sistematizados iniciamos el trazo concreto de las propuestas de solución.',
  },
  {
    number: 7,
    numeral: '07',
    phase: 'Etapa 4 de 4 · Propuestas',
    accent: 'peach',
    title: 'Elaboración de propuestas técnicas y cómo puedes sumarte',
    locationTag: 'Diseño de soluciones y jornada vecinal',
    imageWebp: 'assets/foto-07.webp',
    imageJpg: 'assets/foto-07.jpg',
    imageAlt:
      'Estudiantes de la brigada inclinados sobre la mesa trazando planos y propuestas técnicas para San José Buenavista.',
    objectPosition: '50% 38%',
    secondaryPhoto: {
      webp: 'assets/foto-10.webp',
      jpg: 'assets/foto-10.jpg',
      alt: 'Asesor y estudiantes de la brigada UIEP durante la jornada comunitaria bajo la sombra de un árbol en San José Buenavista.',
      label: 'Jornada en campo',
      objectPosition: '50% 38%',
    },
    whatLines: [
      'Etapa 4 · Propuestas: Planteamos puente peatonal, rampas en la escuela',
      'y mejora sustentable de calles; tu voz valida cada propuesta.',
    ],
    howDescription:
      'Con base en el diagnóstico elaboramos propuestas preliminares de infraestructura digna y accesible. Tú puedes sumarte en 3 pasos: (1) asistir a los talleres, (2) compartir tus ideas y (3) validar y dar seguimiento a los acuerdos.',
    speaker: 'Propuestas para validar juntos',
    dialogue:
      '«Estamos trabajando en opciones concretas como un paso peatonal seguro, rampas incluyentes en la escuela y mejora de vialidades con materiales acordes al entorno.»',
    visualDescription:
      'Fotografía real del equipo de ingeniería trazando a mano láminas y esquemas de solución sobre pliegos blancos, complementada con la fotografía de la brigada reunida al aire libre durante la jornada en comunidad.',
    transitionNote:
      'El proceso une el trabajo técnico universitario con el respaldo vivo de las instituciones y familias locales.',
  },
  {
    number: 8,
    numeral: '08',
    phase: 'Cierre · Impacto esperado',
    accent: 'olive',
    title: '¡Porque juntos construimos un mejor San José Buenavista!',
    locationTag: 'Frente al mural comunitario escolar',
    imageWebp: 'assets/foto-08.webp',
    imageJpg: 'assets/foto-08.jpg',
    imageAlt:
      'Fotografía grupal de estudiantes brigadistas de la UIEP, asesor y autoridades frente al mural comunitario de cactáceas en San José Buenavista.',
    objectPosition: '50% 38%',
    whatLines: [
      '¡Porque juntos construimos un mejor San José Buenavista!',
      'Agradecemos a la comunidad por abrirnos sus puertas y trabajar en equipo.',
    ],
    howDescription:
      'Fortalecemos un vínculo duradero entre la Universidad Intercultural del Estado de Puebla y San José Buenavista, sumando saberes comunitarios y formación técnica para mejorar la calidad de vida local.',
    speaker: 'Agradecimiento UIEP',
    dialogue:
      '«Gracias a cada vecina, vecino, comité y autoridad de San José Buenavista por su confianza y por dejarnos aprender y trabajar hombro con hombro con ustedes.»',
    visualDescription:
      'Fotografía grupal real sobre los escalones amarillos frente al mural comunitario con nopales en flor: brigadistas de la UIEP con sus chalecos y gafetes junto con autoridades escolares y comunitarias sosteniendo el acuerdo de trabajo conjunto.',
    transitionNote:
      'Cierre documental que invita a seguir participando en las siguientes mesas de validación comunitaria.',
  },
];

export const PARTICIPATION_STEPS = [
  {
    step: '01',
    title: 'Asiste a los talleres y conversatorios',
    description:
      'Acércate con tu familia a los encuentros convocados junto con las autoridades locales y comités vecinales de San José Buenavista.',
  },
  {
    step: '02',
    title: 'Comparte tus ideas e inquietudes',
    description:
      'Expresa tu experiencia diaria sobre agua, caminos, barrancas y accesibilidad escolar en las encuestas y mesas de mapa social.',
  },
  {
    step: '03',
    title: 'Valida y da seguimiento comunitario',
    description:
      'Revisa junto con la brigada que las propuestas técnicas sean viables, respeten el entorno local y respondan a las prioridades reales.',
  },
];

export interface TerritoryNode {
  id: string;
  code: string;
  zone: string;
  photoJpg: string;
  photoWebp: string;
  photoPosition: string;
  diagnosis: string;
  proposal: string;
  benefit: string;
  relatedScene: number;
}

export const TERRITORY_NODES: TerritoryNode[] = [
  {
    id: 'barranca',
    code: 'PUNTO 01',
    zone: 'Paso sobre Barranca',
    photoJpg: 'assets/foto-02.jpg',
    photoWebp: 'assets/foto-02.webp',
    photoPosition: '50% 62%',
    diagnosis:
      'Cruce estrecho sin barandales peatonales seguros, riesgoso para escolares, familias y personas mayores especialmente cuando llueve.',
    proposal:
      'Planteamiento de puente peatonal seguro con protección lateral firme y accesos nivelados.',
    benefit: 'Tránsito peatonal seguro durante todo el año.',
    relatedScene: 2,
  },
  {
    id: 'escuela',
    code: 'PUNTO 02',
    zone: 'Accesos en la Escuela',
    photoJpg: 'assets/foto-08.jpg',
    photoWebp: 'assets/foto-08.webp',
    photoPosition: '50% 42%',
    diagnosis:
      'Escalones y desniveles en áreas educativas y comunitarias que dificultan el acceso a personas con movilidad reducida o adultos mayores.',
    proposal:
      'Diseño de rampas incluyentes con pendiente adecuada, acabado antiderrapante y pasamanos.',
    benefit: 'Espacios comunitarios y escolares accesibles para todas y todos.',
    relatedScene: 8,
  },
  {
    id: 'calles',
    code: 'PUNTO 03',
    zone: 'Calles y Caminos Locales',
    photoJpg: 'assets/foto-09.jpg',
    photoWebp: 'assets/foto-09.webp',
    photoPosition: '50% 58%',
    diagnosis:
      'Calles de tierra y piedra suelta con desgaste por escurrimientos, polvo y tramos irregulares para caminar o circular.',
    proposal:
      'Propuesta de mejora de calles aprovechando materiales regionales y drenaje superficial ordenado.',
    benefit: 'Vialidades más durables, transitables y acordes al territorio.',
    relatedScene: 4,
  },
  {
    id: 'techado',
    code: 'PUNTO 04',
    zone: 'Mesas de Mapa Social',
    photoJpg: 'assets/foto-05.jpg',
    photoWebp: 'assets/foto-05.webp',
    photoPosition: '50% 42%',
    diagnosis:
      'Importancia de escuchar directamente a jóvenes, mujeres, adultos mayores y comités para priorizar qué urge atender primero.',
    proposal:
      'Talleres participativos, dibujo colectivo del mapa social y validación abierta con la comunidad.',
    benefit: 'Soluciones guiadas por quienes habitan San José Buenavista.',
    relatedScene: 5,
  },
  {
    id: 'planeacion',
    code: 'PUNTO 05',
    zone: 'Juzgado de Paz y Servicios',
    photoJpg: 'assets/foto-03.jpg',
    photoWebp: 'assets/foto-03.webp',
    photoPosition: '50% 35%',
    diagnosis:
      'Necesidad de articular esfuerzos entre autoridades locales, comités vecinales y brigada universitaria sobre agua e infraestructura.',
    proposal:
      'Trabajo coordinado desde la planeación hasta la entrega de propuestas técnicas para gestión comunitaria.',
    benefit: 'Organización transparente y respaldo comunitario.',
    relatedScene: 3,
  },
];

export const BRIGADE_TEAM = {
  institution: 'Universidad Intercultural del Estado de Puebla (UIEP)',
  program: 'Ingeniería Civil Sustentable · Vinculación Comunitaria',
  community: 'San José Buenavista, Puebla',
  advisor: 'Dr. Rogelio Rojas Ramos',
  students: [
    'Ricardo Arenas Rodríguez',
    'María Paz Contreras Maceda',
    'Brissa Elizabeth Espíndola López',
    'Leonel Martín López Cuahutle',
    'Rosendo Sánchez Gutiérrez',
    'David Balderas López',
    'Pedro Ángel Cruz Sánchez',
    'Osmar Leyva Flores',
    'Roberto Melchor Velázquez',
    'Isaías Jasciel Zúñiga Sanromán',
  ],
};
