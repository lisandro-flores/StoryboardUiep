/**
 * Storyboard Ilustrado Interactivo — Diagnóstico Comunitario Participativo
 * Comunidad de San José Buenavista, Puebla · UIEP Ingeniería Civil Sustentable
 */

const STORYBOARD_SCENES = [
  {
    number: 1,
    stageBadge: "Bienvenida comunitaria",
    ribbonClass: "ribbon-peach",
    title: "Bienvenida y conexión con San José Buenavista",
    imageWebp: "assets/escena-01.webp",
    imageJpg: "assets/escena-01.jpg",
    imageAlt: "Estudiantes brigadistas de la UIEP y su asesor llegando por un camino de tierra y saludando con respeto a una familia de San José Buenavista.",
    onScreenLines: [
      "¡Hola, vecinas y vecinos de San José Buenavista!",
      "Somos estudiantes de la UIEP y venimos a escuchar y aprender con ustedes."
    ],
    speaker: "Brigada estudiantil UIEP",
    dialogue: "«¡Buenos días, vecinas y vecinos! Venimos de la Universidad Intercultural del Estado de Puebla con mucho respeto para caminar su comunidad y trabajar de la mano con ustedes.»",
    visualDescription: "Plano general abierto a nivel de calle bajo la luz cálida de la mañana. Por un camino de tierra y piedra bordeado de nopales en flor, órganos cactáceos y agaves, llega caminando la brigada de estudiantes de Ingeniería Civil Sustentable de la UIEP junto con su asesor, el Dr. Rogelio Rojas Ramos; portan sombreros para el sol, mochilas, cuadernos de campo, gafetes con cordón azul y chalecos oscuros con franjas reflejantes. Frente a una casa sencilla y con los cerros semiáridos y la iglesia comunitaria al fondo, un abuelo con sombrero, una abuelita con rebozo rosa pastel, una madre y dos niños los reciben con un apretón de manos y sonrisas de confianza y hospitalidad.",
    transitionNote: "Paneo suave siguiendo el saludo de manos hacia el centro del pueblo, fundiéndose con la sombra fresca de un árbol donde inicia la plática vecinal."
  },
  {
    number: 2,
    stageBadge: "¿De qué trata?",
    ribbonClass: "ribbon-pink",
    title: "¿Qué es el Diagnóstico Comunitario Participativo?",
    imageWebp: "assets/escena-02.webp",
    imageJpg: "assets/escena-02.jpg",
    imageAlt: "Vecinos de distintas edades y estudiantes de la UIEP conversando en círculo horizontal bajo la sombra de un mezquite.",
    onScreenLines: [
      "No es un proyecto impuesto desde afuera:",
      "es un trabajo en equipo donde la voz de la comunidad guía las soluciones."
    ],
    speaker: "Narración comunitaria",
    dialogue: "«Nadie conoce mejor San José Buenavista que quienes viven aquí todos los días. Por eso aquí nadie viene a imponer nada: tus ideas y tu palabra son las que marcan el camino.»",
    visualDescription: "Plano medio grupal a la misma altura visual bajo la sombra de un mezquite en una plazuela de la comunidad. Una adulta mayor con rebozo, un vecino campesino con sombrero, una mujer joven y un niño conversan con confianza y gestos abiertos frente a tres jóvenes brigadistas de la UIEP que escuchan con atención y toman notas en sus libretas. En la parte superior flotan delicadas viñetas en acuarela suave (un puente peatonal, una gota de agua, una escuela con rampa y dos manos estrechándose) que simbolizan los temas nacidos de la propia gente. Emoción de empatía, igualdad e interculturalidad.",
    transitionNote: "Disolvencia cálida desde el ícono de las manos unidas hacia una mesa de acuerdos comunitarios en la oficina de las autoridades locales."
  },
  {
    number: 3,
    stageBadge: "Etapa 1 · Planeación",
    ribbonClass: "ribbon-lilac",
    title: "Etapa 1 – Nos organizamos con autoridades y comités",
    imageWebp: "assets/escena-03.webp",
    imageJpg: "assets/escena-03.jpg",
    imageAlt: "Autoridades comunitarias, representantes vecinales, el asesor y estudiantes de la UIEP organizando talleres alrededor de una mesa.",
    onScreenLines: [
      "Etapa 1 · Planeación: Autoridades, comités y brigada UIEP",
      "organizamos juntos los talleres y acordamos los temas prioritarios."
    ],
    speaker: "Representante comunitario",
    dialogue: "«Primero nos sentamos entre autoridades locales, comités y la universidad para organizar los talleres y cuidar que todas las familias sean tomadas en cuenta.»",
    visualDescription: "Plano medio amplio en el interior luminoso y sencillo de la oficina comunitaria (con piso de mosaico tradicional, paredes color crema y ventana abierta hacia los cerros y cactáceas de San José Buenavista). Alrededor de una mesa de madera se reúnen autoridades locales, una mujer representante comunitaria, un adulto mayor, el Dr. Rogelio Rojas Ramos y estudiantes de la brigada con sus chalecos y gafetes. Sobre la mesa revisan hojas ilustradas de planeación y calendarios con plumones de colores, señalando acuerdos con gestos de respeto, orden y compromiso compartido.",
    transitionNote: "Corte dinámico hacia la puerta iluminada por el sol mientras la brigada sale con sus tablillas y encuestas rumbo a las calles de la comunidad."
  },
  {
    number: 4,
    stageBadge: "Etapa 2 · Trabajo de campo",
    ribbonClass: "ribbon-olive",
    title: "Etapa 2 – Recorremos calles, caminos y escuelas",
    imageWebp: "assets/escena-04.webp",
    imageJpg: "assets/escena-04.jpg",
    imageAlt: "Estudiantes brigadistas conversando y aplicando encuestas con una vecina, un niño y un adulto mayor frente a la escuela local.",
    onScreenLines: [
      "Etapa 2 · Trabajo de campo: Caminamos calles, barrancas y escuelas",
      "escuchando tus inquietudes sobre agua, accesibilidad y servicios."
    ],
    speaker: "Vecina y adulto mayor",
    dialogue: "«Los muchachos recorrieron nuestras calles preguntándonos cómo está el agua, los caminos de tierra y lo difícil que es subir los escalones o cruzar en temporada de lluvia.»",
    visualDescription: "Plano general-medio exterior sobre una calle de tierra y piedra bajo el cielo despejado de San José Buenavista. En primer plano derecho, frente a la escuela comunitaria con escalones amarillos y un mural colorido de nopales en flor, una estudiante con sombrero de ala ancha y un estudiante con tablilla de encuestas escuchan con calidez a una mamá, su hijo pequeño y un abuelito con bastón que señala los escalones y el camino. Al fondo a la izquierda, otros dos brigadistas observan y anotan el estado de una llave de agua y el cruce estrecho de piedra sobre la barranca. Ambiente cercano, respetuoso y atento a la vida cotidiana.",
    transitionNote: "Acercamiento suave a las hojas de encuesta en la tablilla, que al pasar de viñeta se abren como un gran pliego de papel sobre la mesa del taller comunitario."
  },
  {
    number: 5,
    stageBadge: "Etapa 3 · Análisis y mapa social",
    ribbonClass: "ribbon-lilac",
    title: "Etapa 3 – Dibujamos nuestro mapa social y priorizamos",
    imageWebp: "assets/escena-05.webp",
    imageJpg: "assets/escena-05.jpg",
    imageAlt: "Jóvenes, mujeres, niños, adultos mayores y brigadistas dibujando juntos el mapa de San José Buenavista bajo el techado comunitario.",
    onScreenLines: [
      "Etapa 3 · Análisis y mapa social: Dibujamos juntos nuestra comunidad",
      "para ubicar y dar prioridad a las necesidades más urgentes."
    ],
    speaker: "Joven de la comunidad",
    dialogue: "«¡Entre chicas, chicos, mamás y abuelos dibujamos el mapa de nuestro pueblo y marcamos con colores los puntos donde más urge mejorar!»",
    visualDescription: "Plano picado suave (tres cuartos cenital) bajo el techado comunitario de lámina con columnas color terracota y barda baja de block, rodeado de vegetación y cerros. Alrededor de una larga mesa de madera conviven adolescentes con uniforme deportivo verde con blanco, un niño pequeño, mujeres de la comunidad, un adulto mayor con sombrero y estudiantes de la UIEP. En el centro de la mesa destaca un gran pliego blanco con el mapa social dibujado a mano con plumones: se aprecian la iglesia, la escuela, las veredas, la barranca y círculos en tonos durazno y verde olivo donde las manos de todos señalan prioridades. Emoción de entusiasmo colectivo y unión intergeneracional.",
    transitionNote: "Los círculos de prioridad dibujados en el mapa cobran vida y se expanden suavemente en tres paneles ilustrados con las propuestas concretas."
  },
  {
    number: 6,
    stageBadge: "Etapa 4 · Propuestas",
    ribbonClass: "ribbon-peach",
    title: "Etapa 4 – Propuestas técnicas viables y sustentables",
    imageWebp: "assets/escena-06.webp",
    imageJpg: "assets/escena-06.jpg",
    imageAlt: "Tríptico ilustrado con tres soluciones: puente peatonal seguro sobre la barranca, rampas incluyentes en la escuela y calle mejorada con piedra local y drenaje.",
    onScreenLines: [
      "Etapa 4 · Propuestas: Puente peatonal seguro, rampas incluyentes",
      "en la escuela y mejora sustentable de nuestras calles y servicios."
    ],
    speaker: "Asesor Dr. Rogelio Rojas Ramos y brigada",
    dialogue: "«Con todo lo que la comunidad nos compartió, preparamos propuestas viables y sustentables: un puente peatonal seguro, rampas accesibles en la escuela y calles dignas con materiales de la región.»",
    visualDescription: "Composición horizontal tipo tríptico con tres viñetas orgánicas de bordes redondeados sobre papel crema cálido (#FAF3E8): (1) A la izquierda, un puente peatonal firme y seguro con barandales sobre la barranca rocosa bordeada de magueyes y nopales, por donde cruzan tranquilos escolares y una abuelita; (2) Al centro, rampas de acceso con pendiente suave y pasamanos junto a los escalones amarillos de la escuela, permitiendo el ingreso digno de una persona mayor en silla de ruedas y niñas y niños; (3) A la derecha, una calle empedrada con materiales regionales mixtos, cunetas pluviales limpias y registros ordenados de agua hacia la iglesia del pueblo. Transmite esperanza práctica, seguridad e inclusión.",
    transitionNote: "Desplazamiento fluido hacia adelante siguiendo un sendero color tierra cálida que conecta las tres propuestas con los tres pasos de participación vecinal."
  },
  {
    number: 7,
    stageBadge: "¡Participa hoy!",
    ribbonClass: "ribbon-olive",
    title: "¿Qué puedes hacer tú como vecina o vecino?",
    imageWebp: "assets/escena-07.webp",
    imageJpg: "assets/escena-07.jpg",
    imageAlt: "Tres momentos conectados por un sendero: asistir a los talleres, compartir ideas en encuestas y mapas, y validar juntos las propuestas.",
    onScreenLines: [
      "Participa en 3 pasos: 1. Asiste a los talleres · 2. Comparte tus ideas",
      "en encuestas y mapas · 3. Ayuda a validar y dar seguimiento."
    ],
    speaker: "Vecina e integrante de brigada",
    dialogue: "«¡Tu participación hace la diferencia! Ven a las reuniones y conversatorios, cuéntanos tus propuestas y acompáñanos a revisar que cada proyecto responda de verdad al pueblo.»",
    visualDescription: "Ilustración didáctica en tres escenas conectadas por un sendero ondulante sobre fondo crema cálido: (Izquierda – Paso 1) Familias, jóvenes y personas mayores llegando contentos a tomar asiento en círculo bajo el techado comunitario; (Centro – Paso 2) Una vecina con rebozo y un señor con sombrero conversando animadamente, señalando el croquis comunitario mientras una brigadista anota sus propuestas en la encuesta; (Derecha – Paso 3) Vecinas, comité local y dos estudiantes revisando juntos el plano ilustrado de un puente/rampa y levantando el pulgar en señal de aprobación y seguimiento. Ritmo claro, cercano y motivador.",
    transitionNote: "Apertura amplia de cámara (zoom out) desde el sendero comunitario hasta revelar a todo el pueblo y la brigada reunidos al atardecer."
  },
  {
    number: 8,
    stageBadge: "Cierre y agradecimiento",
    ribbonClass: "ribbon-peach",
    title: "¡Porque juntos construimos un mejor San José Buenavista!",
    imageWebp: "assets/escena-08.webp",
    imageJpg: "assets/escena-08.jpg",
    imageAlt: "Retrato grupal panorámico de familias, niños, adultos mayores, autoridades y la brigada de la UIEP saludando unidos en San José Buenavista.",
    onScreenLines: [
      "¡Porque juntos construimos un mejor San José Buenavista!",
      "Gracias por abrirnos sus puertas y trabajar en equipo — UIEP."
    ],
    speaker: "Comunidad y Brigada UIEP en una sola voz",
    dialogue: "«¡Muchas gracias, San José Buenavista, por recibirnos con tanta calidez! Escuchándonos y trabajando unidos, sembramos soluciones duraderas para nuestras familias.»",
    visualDescription: "Gran plano general panorámico y emotivo iluminado por la luz dorada de la tarde. En primer plano, hombro con hombro como una sola gran comunidad, posan sonrientes y saludando niñas, niños, jóvenes, madres, padres, abuelitas con rebozo artesanal, adultos mayores con sombrero, autoridades locales, el Dr. Rogelio Rojas Ramos y la brigada de estudiantes de Ingeniería Civil Sustentable de la UIEP con sus chalecos, gafetes y cuadernos de campo. Detrás de ellos lucen los cerros dorados y verdes, nopales en flor, órganos, caminos empedrados y la iglesia comunitaria, con ramas y hojas verdes enmarcando suavemente las esquinas inferiores igual que en la lona informativa. Emoción de orgullo, gratitud y unidad.",
    transitionNote: "Cierre cálido sostenido con disolvencia suave hacia el lema comunitario, los créditos de la brigada universitaria y el emblema oficial de la UIEP."
  }
];

/* Estado global de la interfaz */
let currentMode = "vecinos"; // 'vecinos' | 'slideshow' | 'storyboard'
let currentSlideIndex = 0;
let activeSpeechScene = null;
let isPlayingAll = false;

const storyboardContainer = document.getElementById("storyboard-container");
const sceneSelectStrip = document.getElementById("scene-select-strip");
const slideCounterEl = document.getElementById("slide-counter");
const prevSlideBtn = document.getElementById("prev-slide-btn");
const nextSlideBtn = document.getElementById("next-slide-btn");
const listenAllBtn = document.getElementById("listen-all-btn");

/**
 * Renderiza las 8 tarjetas ilustradas y los botones de navegación rápida
 */
function renderStoryboard() {
  storyboardContainer.innerHTML = "";
  sceneSelectStrip.innerHTML = "";

  STORYBOARD_SCENES.forEach((scene, index) => {
    // 1. Botón píldora de acceso rápido (1..8)
    const dotBtn = document.createElement("button");
    dotBtn.type = "button";
    dotBtn.className = `scene-dot-btn ${index === 0 ? "current" : ""}`;
    dotBtn.dataset.index = index;
    dotBtn.textContent = `${scene.number}. ${scene.stageBadge.split("·")[0].trim()}`;
    dotBtn.setAttribute("aria-label", `Ir a escena ${scene.number}: ${scene.title}`);
    dotBtn.addEventListener("click", () => goToScene(index));
    sceneSelectStrip.appendChild(dotBtn);

    // 2. Tarjeta de la escena
    const article = document.createElement("article");
    article.className = `scene-card ${index === 0 ? "active-slide" : ""}`;
    article.id = `escena-${scene.number}`;
    article.dataset.index = index;

    const loadingAttr = index === 0 ? "eager" : "lazy";

    article.innerHTML = `
      <div class="scene-card-header">
        <div class="scene-badge-group">
          <span class="scene-num-circle" aria-hidden="true">${scene.number}</span>
          <div>
            <span class="scene-stage-tag ${scene.ribbonClass}">${scene.stageBadge}</span>
            <h2 class="scene-card-title">Escena ${scene.number}: ${scene.title}</h2>
          </div>
        </div>
        <button type="button" class="scene-audio-btn" data-scene-audio="${index}" aria-label="Escuchar narración de la escena ${scene.number}">
          <span aria-hidden="true">🔊</span>
          <span class="audio-btn-label">Escuchar</span>
        </button>
      </div>

      <figure class="scene-figure" data-lightbox-index="${index}" tabindex="0" role="button" aria-label="Ampliar ilustración de la escena ${scene.number}">
        <picture>
          <source srcset="${scene.imageWebp}" type="image/webp" />
          <img
            src="${scene.imageJpg}"
            alt="${scene.imageAlt}"
            class="scene-img"
            width="1360"
            height="759"
            loading="${loadingAttr}"
          />
        </picture>
        <span class="zoom-hint">🔍 Toca para ampliar</span>
      </figure>

      <div class="scene-body">
        <div class="onscreen-banner">
          <span class="onscreen-label">Texto en pantalla</span>
          <p class="onscreen-text">
            ${scene.onScreenLines[0]}<br />
            ${scene.onScreenLines[1]}
          </p>
        </div>

        <div class="dialogue-box">
          <span class="dialogue-speaker">💬 ${scene.speaker}</span>
          <p class="dialogue-quote">${scene.dialogue}</p>
        </div>

        <button type="button" class="tech-specs-toggle" data-toggle-tech="${index}" aria-expanded="false">
          <span>📋 Ver descripción visual y nota de transición (Ficha de Storyboard)</span>
          <span class="toggle-chevron" aria-hidden="true">▾</span>
        </button>

        <div class="tech-specs-panel" id="tech-panel-${index}">
          <div class="spec-item">
            <span class="spec-label">🎨 Descripción visual detallada (encuadre, personajes, entorno y emociones)</span>
            <p class="spec-text">${scene.visualDescription}</p>
          </div>
          <div class="spec-item">
            <span class="spec-label">🎬 Nota de transición / ritmo visual hacia la siguiente escena</span>
            <p class="spec-text">${scene.transitionNote}</p>
          </div>
        </div>
      </div>
    `;

    storyboardContainer.appendChild(article);

    // 3. Conector visual entre viñetas (excepto después de la escena 8)
    if (index < STORYBOARD_SCENES.length - 1) {
      const connector = document.createElement("div");
      connector.className = "transition-connector";
      connector.setAttribute("aria-hidden", "true");
      connector.innerHTML = `
        <div class="transition-pill">
          <span class="transition-arrow">↓</span>
          <span class="transition-text-short">Sigue a la Escena ${scene.number + 1}</span>
          <span class="transition-text-detail">· ${scene.transitionNote}</span>
        </div>
      `;
      storyboardContainer.appendChild(connector);
    }
  });

  bindCardInteractions();
  setupScrollObserver();
  updateSlideshowControls();
}

/**
 * Enlaza eventos de desplegables técnicos, audio por escena y visor lightbox
 */
function bindCardInteractions() {
  // Desplegable individual de ficha técnica
  document.querySelectorAll("[data-toggle-tech]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card = btn.closest(".scene-card");
      const isExpanded = card.classList.toggle("show-tech");
      btn.setAttribute("aria-expanded", String(isExpanded));
      const chevron = btn.querySelector(".toggle-chevron");
      if (chevron) chevron.textContent = isExpanded ? "▴" : "▾";
    });
  });

  // Botón de voz por escena
  document.querySelectorAll("[data-scene-audio]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = Number(btn.dataset.sceneAudio);
      speakSingleScene(idx);
    });
  });

  // Lightbox de ilustración
  document.querySelectorAll("[data-lightbox-index]").forEach((fig) => {
    const openHandler = () => openLightbox(Number(fig.dataset.lightboxIndex));
    fig.addEventListener("click", openHandler);
    fig.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openHandler();
      }
    });
  });
}

/**
 * Cambia entre los 3 modos de visualización:
 * - 'vecinos': Lectura corrida clara y amigable (por defecto para QR)
 * - 'slideshow': Viñeta por viñeta tipo presentación
 * - 'storyboard': Ficha técnica completa con todas las descripciones abiertas
 */
function setViewMode(mode) {
  currentMode = mode;
  document.body.classList.remove("mode-vecinos", "mode-slideshow", "mode-storyboard");
  document.body.classList.add(`mode-${mode}`);

  document.querySelectorAll("[data-mode-btn]").forEach((btn) => {
    const isActive = btn.dataset.modeBtn === mode;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-pressed", String(isActive));
  });

  if (mode === "slideshow") {
    showSlide(currentSlideIndex);
  }
}

/**
 * Navega a una escena específica según el modo activo
 */
function goToScene(index) {
  currentSlideIndex = index;
  highlightDot(index);

  if (currentMode === "slideshow") {
    showSlide(index);
  } else {
    const target = document.getElementById(`escena-${index + 1}`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
}

function showSlide(index) {
  currentSlideIndex = Math.max(0, Math.min(STORYBOARD_SCENES.length - 1, index));
  document.querySelectorAll(".scene-card").forEach((card, idx) => {
    card.classList.toggle("active-slide", idx === currentSlideIndex);
  });
  highlightDot(currentSlideIndex);
  updateSlideshowControls();
}

function updateSlideshowControls() {
  if (!slideCounterEl) return;
  slideCounterEl.textContent = `Viñeta ${currentSlideIndex + 1} de ${STORYBOARD_SCENES.length}`;
  prevSlideBtn.disabled = currentSlideIndex === 0;
  nextSlideBtn.disabled = currentSlideIndex === STORYBOARD_SCENES.length - 1;
}

function highlightDot(activeIndex) {
  document.querySelectorAll(".scene-dot-btn").forEach((btn, idx) => {
    btn.classList.toggle("current", idx === activeIndex);
  });
}

/**
 * Observador para iluminar en la barra superior la escena visible al hacer scroll
 */
function setupScrollObserver() {
  if (!("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver(
    (entries) => {
      if (currentMode === "slideshow") return;
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = Number(entry.target.dataset.index);
          currentSlideIndex = idx;
          highlightDot(idx);
        }
      });
    },
    { rootMargin: "-25% 0px -55% 0px", threshold: 0.1 }
  );

  document.querySelectorAll(".scene-card").forEach((card) => observer.observe(card));
}

/**
 * Síntesis de voz en español de México (accesibilidad comunitaria para adultos mayores y familias)
 */
function getSpanishVoice() {
  if (!("speechSynthesis" in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang.toLowerCase().startsWith("es-mx")) ||
    voices.find((v) => v.lang.toLowerCase().startsWith("es-419")) ||
    voices.find((v) => v.lang.toLowerCase().startsWith("es")) ||
    null
  );
}

function stopSpeech() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  activeSpeechScene = null;
  isPlayingAll = false;
  updateAudioButtonsUI();
}

function buildSceneNarrationText(scene) {
  const cleanDialogue = scene.dialogue.replace(/[«»""]/g, "");
  return `Escena ${scene.number}: ${scene.title}. ${scene.onScreenLines.join(" ")} ${cleanDialogue}`;
}

function speakSingleScene(index) {
  if (!("speechSynthesis" in window)) {
    alert("Tu navegador no cuenta con lectura en voz alta integrada, pero puedes leer cada tarjeta en pantalla.");
    return;
  }

  if (activeSpeechScene === index && !isPlayingAll) {
    stopSpeech();
    return;
  }

  stopSpeech();
  activeSpeechScene = index;
  updateAudioButtonsUI();

  const utterance = new SpeechSynthesisUtterance(buildSceneNarrationText(STORYBOARD_SCENES[index]));
  utterance.lang = "es-MX";
  utterance.rate = 0.96;
  const voice = getSpanishVoice();
  if (voice) utterance.voice = voice;

  utterance.onend = () => {
    activeSpeechScene = null;
    updateAudioButtonsUI();
  };
  utterance.onerror = () => {
    activeSpeechScene = null;
    updateAudioButtonsUI();
  };

  window.speechSynthesis.speak(utterance);
}

function toggleSpeakAllScenes() {
  if (!("speechSynthesis" in window)) {
    alert("Tu navegador no cuenta con lectura en voz alta integrada.");
    return;
  }

  if (isPlayingAll || activeSpeechScene !== null) {
    stopSpeech();
    return;
  }

  isPlayingAll = true;
  speakSequenceFrom(0);
}

function speakSequenceFrom(index) {
  if (!isPlayingAll || index >= STORYBOARD_SCENES.length) {
    stopSpeech();
    return;
  }

  activeSpeechScene = index;
  goToScene(index);
  updateAudioButtonsUI();

  const utterance = new SpeechSynthesisUtterance(buildSceneNarrationText(STORYBOARD_SCENES[index]));
  utterance.lang = "es-MX";
  utterance.rate = 0.96;
  const voice = getSpanishVoice();
  if (voice) utterance.voice = voice;

  utterance.onend = () => {
    if (isPlayingAll) {
      speakSequenceFrom(index + 1);
    }
  };
  utterance.onerror = () => {
    stopSpeech();
  };

  window.speechSynthesis.speak(utterance);
}

function updateAudioButtonsUI() {
  document.querySelectorAll("[data-scene-audio]").forEach((btn) => {
    const idx = Number(btn.dataset.sceneAudio);
    const isPlaying = activeSpeechScene === idx;
    btn.classList.toggle("playing", isPlaying);
    const label = btn.querySelector(".audio-btn-label");
    if (label) label.textContent = isPlaying ? "Detener" : "Escuchar";
  });

  if (listenAllBtn) {
    listenAllBtn.classList.toggle("speaking", isPlayingAll);
    listenAllBtn.innerHTML = isPlayingAll
      ? '<span aria-hidden="true">⏹</span> Detener narración'
      : '<span aria-hidden="true">🔊</span> Escuchar historia';
  }
}

/**
 * Lightbox accesible para ver ilustraciones a detalle
 */
const lightboxEl = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxCloseBtn = document.getElementById("lightbox-close");

function openLightbox(index) {
  const scene = STORYBOARD_SCENES[index];
  if (!scene || !lightboxEl) return;
  lightboxImg.src = scene.imageJpg;
  lightboxImg.alt = scene.imageAlt;
  lightboxCaption.textContent = `Escena ${scene.number}: ${scene.title} — ${scene.onScreenLines.join(" ")}`;
  lightboxEl.classList.add("open");
  lightboxCloseBtn.focus();
}

function closeLightbox() {
  if (!lightboxEl) return;
  lightboxEl.classList.remove("open");
  lightboxImg.src = "";
}

/* Inicialización de eventos globales */
document.addEventListener("DOMContentLoaded", () => {
  renderStoryboard();

  // Precargar voces en español si están disponibles
  if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = () => getSpanishVoice();
  }

  // Botones de modo de vista
  document.querySelectorAll("[data-mode-btn]").forEach((btn) => {
    btn.addEventListener("click", () => setViewMode(btn.dataset.modeBtn));
  });

  // Controles de carrusel
  prevSlideBtn?.addEventListener("click", () => showSlide(currentSlideIndex - 1));
  nextSlideBtn?.addEventListener("click", () => showSlide(currentSlideIndex + 1));

  // Narración corrida
  listenAllBtn?.addEventListener("click", toggleSpeakAllScenes);

  // Botón de impresión / PDF
  document.getElementById("print-btn")?.addEventListener("click", () => window.print());

  // Cerrar lightbox
  lightboxCloseBtn?.addEventListener("click", closeLightbox);
  lightboxEl?.addEventListener("click", (e) => {
    if (e.target === lightboxEl) closeLightbox();
  });

  // Teclado (Escape cierra lightbox; flechas avanzan en modo presentación)
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightboxEl?.classList.contains("open")) {
      closeLightbox();
      return;
    }
    if (currentMode === "slideshow" && !lightboxEl?.classList.contains("open")) {
      if (e.key === "ArrowRight") showSlide(currentSlideIndex + 1);
      if (e.key === "ArrowLeft") showSlide(currentSlideIndex - 1);
    }
  });
});
