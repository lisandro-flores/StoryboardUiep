export interface StoryboardScene {
  number: number;
  numeral: string;
  phase: string;
  accent: 'forest' | 'peach' | 'olive' | 'rose';
  title: string;
  imageWebp: string;
  imageJpg: string;
  imageAlt: string;
  onScreenLines: [string, string];
  speaker: string;
  dialogue: string;
  visualDescription: string;
  transitionNote: string;
}

export const STORYBOARD_SCENES: StoryboardScene[] = [
  {
    number: 1,
    numeral: '01',
    phase: 'Bienvenida comunitaria',
    accent: 'peach',
    title: 'Bienvenida y conexión con San José Buenavista',
    imageWebp: 'assets/escena-01.webp',
    imageJpg: 'assets/escena-01.jpg',
    imageAlt:
      'Estudiantes brigadistas de la UIEP y su asesor llegando por un camino de tierra y saludando con respeto a una familia de San José Buenavista.',
    onScreenLines: [
      '¡Hola, vecinas y vecinos de San José Buenavista!',
      'Somos estudiantes de la UIEP y venimos a escuchar y aprender con ustedes.',
    ],
    speaker: 'Brigada estudiantil UIEP',
    dialogue:
      '«Buenos días, vecinas y vecinos. Venimos de la Universidad Intercultural del Estado de Puebla con mucho respeto para caminar su comunidad y trabajar de la mano con ustedes.»',
    visualDescription:
      'Plano general abierto a nivel de calle bajo la luz cálida de la mañana. Por un camino de tierra y piedra bordeado de nopales en flor, órganos cactáceos y agaves, llega caminando la brigada de estudiantes de Ingeniería Civil Sustentable de la UIEP junto con su asesor, el Dr. Rogelio Rojas Ramos; portan sombreros para el sol, mochilas, cuadernos de campo, gafetes con cordón azul y chalecos oscuros con franjas reflejantes. Frente a una casa sencilla y con los cerros semiáridos y la iglesia comunitaria al fondo, un abuelo con sombrero, una abuelita con rebozo rosa pastel, una madre y dos niños los reciben con un apretón de manos y sonrisas de confianza y hospitalidad.',
    transitionNote:
      'Paneo suave siguiendo el saludo de manos hacia el centro del pueblo, fundiéndose con la sombra fresca de un mezquite donde inicia la plática vecinal.',
  },
  {
    number: 2,
    numeral: '02',
    phase: 'Sentido del proyecto',
    accent: 'rose',
    title: '¿De qué trata el Diagnóstico Comunitario Participativo?',
    imageWebp: 'assets/escena-02.webp',
    imageJpg: 'assets/escena-02.jpg',
    imageAlt:
      'Vecinos de distintas edades y estudiantes de la UIEP conversando en círculo horizontal bajo la sombra de un mezquite.',
    onScreenLines: [
      'No es un proyecto impuesto desde afuera:',
      'es un trabajo conjunto donde la voz de la comunidad guía las soluciones.',
    ],
    speaker: 'Voz comunitaria',
    dialogue:
      '«Nadie conoce mejor San José Buenavista que quienes viven aquí todos los días. Por eso nadie viene a imponer nada: tus ideas y tu palabra son las que marcan el rumbo.»',
    visualDescription:
      'Plano medio grupal a la misma altura visual bajo la sombra de un mezquite en una plazuela de la comunidad. Una adulta mayor con rebozo, un vecino campesino con sombrero, una mujer joven y un niño conversan con confianza y gestos abiertos frente a tres jóvenes brigadistas de la UIEP que escuchan con atención y toman notas en sus libretas. En la parte superior flotan delicadas viñetas en acuarela suave (un puente peatonal, una gota de agua, una escuela con rampa y dos manos estrechándose) que simbolizan los temas nacidos de la propia gente. Emoción de empatía, igualdad e interculturalidad.',
    transitionNote:
      'Disolvencia cálida desde las manos estrechándose hacia una mesa de acuerdos comunitarios en la oficina de las autoridades locales.',
  },
  {
    number: 3,
    numeral: '03',
    phase: 'Etapa 01 · Planeación',
    accent: 'forest',
    title: 'Nos organizamos con autoridades y representantes',
    imageWebp: 'assets/escena-03.webp',
    imageJpg: 'assets/escena-03.jpg',
    imageAlt:
      'Autoridades comunitarias, representantes vecinales, el asesor y estudiantes de la UIEP organizando talleres alrededor de una mesa.',
    onScreenLines: [
      'Etapa 1 · Planeación: Autoridades, comités y brigada UIEP',
      'organizamos juntos los talleres y acordamos los temas prioritarios.',
    ],
    speaker: 'Representación comunitaria',
    dialogue:
      '«Primero nos pusimos de acuerdo entre autoridades locales, comités y la universidad para organizar los talleres y cuidar que todas las familias sean tomadas en cuenta.»',
    visualDescription:
      'Plano medio amplio en el interior luminoso y sencillo de la oficina comunitaria (con piso de mosaico tradicional, paredes color crema y ventana abierta hacia los cerros y cactáceas de San José Buenavista). Alrededor de una mesa de madera se reúnen autoridades locales, una mujer representante comunitaria, un adulto mayor, el Dr. Rogelio Rojas Ramos y estudiantes de la brigada con sus chalecos y gafetes. Sobre la mesa revisan hojas ilustradas de planeación y calendarios con plumones de colores, señalando acuerdos con gestos de respeto, orden y compromiso compartido.',
    transitionNote:
      'Corte dinámico hacia la puerta bañada por el sol mientras la brigada sale con sus tablillas y encuestas rumbo a las calles de terracería.',
  },
  {
    number: 4,
    numeral: '04',
    phase: 'Etapa 02 · Trabajo de campo',
    accent: 'olive',
    title: 'Recorremos calles, caminos y escuelas escuchando a la gente',
    imageWebp: 'assets/escena-04.webp',
    imageJpg: 'assets/escena-04.jpg',
    imageAlt:
      'Estudiantes brigadistas conversando y aplicando encuestas con una vecina, un niño y un adulto mayor frente a la escuela local.',
    onScreenLines: [
      'Etapa 2 · Trabajo de campo: Caminamos calles, barrancas y escuelas',
      'conversando contigo sobre agua, accesibilidad, caminos y servicios.',
    ],
    speaker: 'Vecina y adulto mayor',
    dialogue:
      '«Recorrieron nuestras calles preguntándonos cómo está el agua, los caminos de piedra y lo difícil que resulta subir escalones o cruzar la barranca cuando llueve.»',
    visualDescription:
      'Plano general-medio exterior sobre una calle de tierra y piedra bajo el cielo despejado de San José Buenavista. En primer plano derecho, frente a la escuela comunitaria con escalones amarillos y un mural colorido de nopales en flor, una estudiante con sombrero de ala ancha y un estudiante con tablilla de encuestas escuchan con calidez a una mamá, su hijo pequeño y un abuelito con bastón que señala los escalones y el camino. Al fondo a la izquierda, otros dos brigadistas observan y anotan el estado de una llave de agua y el cruce estrecho de piedra sobre la barranca. Ambiente cercano, respetuoso y atento a la vida cotidiana.',
    transitionNote:
      'Acercamiento suave al cuaderno de campo de la brigadista, cuyas notas se despliegan en un gran pliego de papel sobre la mesa del taller vecinal.',
  },
  {
    number: 5,
    numeral: '05',
    phase: 'Etapa 03 · Análisis y mapa social',
    accent: 'rose',
    title: 'Dibujamos nuestro mapa social y priorizamos en equipo',
    imageWebp: 'assets/escena-05.webp',
    imageJpg: 'assets/escena-05.jpg',
    imageAlt:
      'Jóvenes, mujeres, niños, adultos mayores y brigadistas dibujando juntos el mapa de San José Buenavista bajo el techado comunitario.',
    onScreenLines: [
      'Etapa 3 · Mapa social: Dibujamos juntos nuestra comunidad',
      'para ubicar y dar prioridad a las necesidades más urgentes.',
    ],
    speaker: 'Juventud vecinal',
    dialogue:
      '«Entre jóvenes, mamás, niñas, niños y abuelos dibujamos el mapa de nuestro pueblo y marcamos juntos los puntos donde más urge actuar primero.»',
    visualDescription:
      'Plano picado suave (tres cuartos cenital) bajo el techado comunitario de lámina con columnas color terracota y barda baja de block, rodeado de vegetación y cerros. Alrededor de una larga mesa de madera conviven adolescentes con uniforme deportivo verde con blanco, un niño pequeño, mujeres de la comunidad, un adulto mayor con sombrero y estudiantes de la UIEP. En el centro de la mesa destaca un gran pliego blanco con el mapa social dibujado a mano con plumones: se aprecian la iglesia, la escuela, las veredas, la barranca y círculos en tonos durazno y verde olivo donde las manos de todos señalan prioridades. Emoción de entusiasmo colectivo y unión intergeneracional.',
    transitionNote:
      'Los trazos de colores sobre el mapa social cobran relieve y se transforman suavemente en tres láminas luminosas de propuestas concretas.',
  },
  {
    number: 6,
    numeral: '06',
    phase: 'Etapa 04 · Propuestas de solución',
    accent: 'peach',
    title: 'Soluciones técnicas viables, incluyentes y sustentables',
    imageWebp: 'assets/escena-06.webp',
    imageJpg: 'assets/escena-06.jpg',
    imageAlt:
      'Tríptico ilustrado con tres soluciones: puente peatonal seguro sobre la barranca, rampas incluyentes en la escuela y calle mejorada con piedra local y drenaje.',
    onScreenLines: [
      'Etapa 4 · Propuestas: Puente peatonal seguro, rampas incluyentes',
      'en la escuela y mejora sustentable de nuestras calles y servicios.',
    ],
    speaker: 'Dr. Rogelio Rojas Ramos y brigada UIEP',
    dialogue:
      '«Con todo lo que ustedes nos compartieron, planteamos soluciones viables y sustentables: un puente peatonal seguro, rampas accesibles en la escuela y calles dignas con materiales de la región.»',
    visualDescription:
      'Composición horizontal tipo tríptico con tres viñetas orgánicas de bordes redondeados sobre papel crema cálido (#FAF3E8): (1) A la izquierda, un puente peatonal firme y seguro con barandales sobre la barranca rocosa bordeada de magueyes y nopales, por donde cruzan tranquilos escolares y una abuelita; (2) Al centro, rampas de acceso con pendiente suave y pasamanos junto a los escalones amarillos de la escuela, permitiendo el ingreso digno de una persona mayor en silla de ruedas y niñas y niños; (3) A la derecha, una calle empedrada con materiales regionales mixtos, cunetas pluviales limpias y registros ordenados de agua hacia la iglesia del pueblo. Transmite esperanza práctica, seguridad e inclusión.',
    transitionNote:
      'Desplazamiento fluido siguiendo un sendero color tierra que enlaza las tres propuestas con los tres pasos prácticos de participación vecinal.',
  },
  {
    number: 7,
    numeral: '07',
    phase: 'Participación activa',
    accent: 'olive',
    title: '¿Qué puedes hacer tú como vecina o vecino?',
    imageWebp: 'assets/escena-07.webp',
    imageJpg: 'assets/escena-07.jpg',
    imageAlt:
      'Tres momentos conectados por un sendero: asistir a los talleres, compartir ideas en encuestas y mapas, y validar juntos las propuestas.',
    onScreenLines: [
      'Participa en 3 pasos: 1. Asiste a talleres · 2. Comparte tus ideas',
      'en encuestas y mapas · 3. Ayuda a validar y dar seguimiento.',
    ],
    speaker: 'Invitación abierta a la comunidad',
    dialogue:
      '«Participar es muy sencillo: acércate a los talleres y conversatorios, cuéntanos tus propuestas en las encuestas y acompáñanos a validar que cada acuerdo sirva al pueblo.»',
    visualDescription:
      'Ilustración didáctica en tres escenas conectadas por un sendero ondulante sobre fondo crema cálido: (Izquierda – Paso 1) Familias, jóvenes y personas mayores llegando contentos a tomar asiento en círculo bajo el techado comunitario; (Centro – Paso 2) Una vecina con rebozo y un señor con sombrero conversando animadamente, señalando el croquis comunitario mientras una brigadista anota sus propuestas en la encuesta; (Derecha – Paso 3) Vecinas, comité local y dos estudiantes revisando juntos el plano ilustrado de un puente/rampa y levantando el pulgar en señal de aprobación y seguimiento. Ritmo claro, cercano y motivador.',
    transitionNote:
      'Apertura amplia de encuadre desde el sendero comunitario hasta reunir en un gran retrato colectivo a todo San José Buenavista y la brigada al atardecer.',
  },
  {
    number: 8,
    numeral: '08',
    phase: 'Cierre y gratitud',
    accent: 'forest',
    title: '¡Porque juntos construimos un mejor San José Buenavista!',
    imageWebp: 'assets/escena-08.webp',
    imageJpg: 'assets/escena-08.jpg',
    imageAlt:
      'Retrato grupal panorámico de familias, niños, adultos mayores, autoridades y la brigada de la UIEP saludando unidos en San José Buenavista.',
    onScreenLines: [
      '¡Porque juntos construimos un mejor San José Buenavista!',
      'Gracias por abrirnos sus puertas y trabajar en equipo — UIEP.',
    ],
    speaker: 'Comunidad y Brigada UIEP',
    dialogue:
      '«Muchas gracias, San José Buenavista, por abrirnos sus puertas y su confianza. Escuchándonos y trabajando en equipo construimos un futuro más digno para todas y todos.»',
    visualDescription:
      'Gran plano general panorámico y emotivo iluminado por la luz dorada de la tarde. En primer plano, hombro con hombro como una sola gran comunidad, posan sonrientes y saludando niñas, niños, jóvenes, madres, padres, abuelitas con rebozo artesanal, adultos mayores con sombrero, autoridades locales, el Dr. Rogelio Rojas Ramos y la brigada de estudiantes de Ingeniería Civil Sustentable de la UIEP con sus chalecos, gafetes y cuadernos de campo. Detrás de ellos lucen los cerros dorados y verdes, nopales en flor, órganos, caminos empedrados y la iglesia comunitaria, con ramas y hojas verdes enmarcando suavemente las esquinas inferiores igual que en la lona informativa. Emoción de orgullo, gratitud y unidad.',
    transitionNote:
      'Cierre cálido sostenido con disolvencia suave hacia el lema comunitario, los créditos de vinculación y el emblema institucional de la UIEP.',
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
      'Expresa tu experiencia cotidiana sobre agua, caminos, barrancas y accesibilidad escolar en las encuestas y mesas de mapa social.',
  },
  {
    step: '03',
    title: 'Valida y da seguimiento comunitario',
    description:
      'Revisa junto con la brigada que las propuestas técnicas sean viables, respeten el entorno local y respondan a las prioridades reales.',
  },
];

export const COMMUNITY_IMPACTS = [
  'Mayor participación ciudadana de todas las edades.',
  'Propuestas técnicas viables y adaptadas al territorio semiárido.',
  'Mejora digna e incluyente en infraestructura y servicios básicos.',
  'Vínculo intercultural vivo entre la UIEP y San José Buenavista.',
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
