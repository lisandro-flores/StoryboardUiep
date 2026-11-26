import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import useEmblaCarousel from 'embla-carousel-react';
import { STORYBOARD_SCENES, type StoryboardScene } from '../data/storyboard';
import AudioWave from './AudioWave';

type ViewMode = 'editorial' | 'carousel' | 'technical';

interface StoryboardExperienceProps {
  baseUrl: string;
}

const ACCENT_STYLES: Record<
  StoryboardScene['accent'],
  { pill: string; bar: string; cardTint: string }
> = {
  peach: {
    pill: 'bg-peach-pale text-ink border-peach',
    bar: 'bg-terracotta',
    cardTint: 'from-peach-pale/70 to-cream-soft',
  },
  rose: {
    pill: 'bg-rose-pale text-ink border-rose',
    bar: 'bg-rose',
    cardTint: 'from-rose-pale/65 to-cream-soft',
  },
  olive: {
    pill: 'bg-olive-pale text-forest border-olive/40',
    bar: 'bg-olive',
    cardTint: 'from-olive-pale/65 to-cream-soft',
  },
  forest: {
    pill: 'bg-forest/10 text-forest border-forest/25',
    bar: 'bg-forest',
    cardTint: 'from-olive-pale/45 to-cream-soft',
  },
};

export default function StoryboardExperience({ baseUrl }: StoryboardExperienceProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('editorial');
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [openTechMap, setOpenTechMap] = useState<Record<number, boolean>>({});
  const [lightboxScene, setLightboxScene] = useState<StoryboardScene | null>(null);

  // Estado de síntesis de voz en español de México
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);

  // Progreso de lectura superior suave
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  // Embla Carousel para el modo táctil inmersivo
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'center',
    skipSnaps: false,
  });

  const onEmblaSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveSceneIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onEmblaSelect();
    emblaApi.on('select', onEmblaSelect);
    emblaApi.on('reInit', onEmblaSelect);
    return () => {
      emblaApi.off('select', onEmblaSelect);
      emblaApi.off('reInit', onEmblaSelect);
    };
  }, [emblaApi, onEmblaSelect]);

  // Sincroniza el indicador activo mientras se hace scroll en modo editorial/técnico
  useEffect(() => {
    if (viewMode === 'carousel' || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.sceneIndex);
            if (!Number.isNaN(idx)) setActiveSceneIndex(idx);
          }
        });
      },
      { rootMargin: '-28% 0px -52% 0px', threshold: 0.1 }
    );

    document.querySelectorAll('[data-scene-card]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [viewMode]);

  // Atajos de teclado para lightbox y carrusel
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && lightboxScene) {
        setLightboxScene(null);
        return;
      }
      if (viewMode === 'carousel' && emblaApi && !lightboxScene) {
        if (e.key === 'ArrowRight') emblaApi.scrollNext();
        if (e.key === 'ArrowLeft') emblaApi.scrollPrev();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxScene, viewMode, emblaApi]);

  // Limpiar voz al desmontar
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  const getSpanishVoice = () => {
    if (!('speechSynthesis' in window)) return null;
    const voices = window.speechSynthesis.getVoices();
    return (
      voices.find((v) => v.lang.toLowerCase().startsWith('es-mx')) ||
      voices.find((v) => v.lang.toLowerCase().startsWith('es-419')) ||
      voices.find((v) => v.lang.toLowerCase().startsWith('es')) ||
      null
    );
  };

  const stopSpeech = useCallback(() => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setSpeakingIndex(null);
    setIsPlayingAll(false);
  }, []);

  const buildNarration = (scene: StoryboardScene) => {
    const cleanDialogue = scene.dialogue.replace(/[«»""]/g, '');
    return `Escena ${scene.number}: ${scene.title}. ${scene.onScreenLines.join(' ')} ${cleanDialogue}`;
  };

  const speakSingleScene = (index: number) => {
    if (!('speechSynthesis' in window)) return;
    if (speakingIndex === index && !isPlayingAll) {
      stopSpeech();
      return;
    }

    stopSpeech();
    setSpeakingIndex(index);

    const utterance = new SpeechSynthesisUtterance(buildNarration(STORYBOARD_SCENES[index]));
    utterance.lang = 'es-MX';
    utterance.rate = 0.96;
    const voice = getSpanishVoice();
    if (voice) utterance.voice = voice;

    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);
    window.speechSynthesis.speak(utterance);
  };

  const toggleSpeakAll = () => {
    if (!('speechSynthesis' in window)) return;
    if (isPlayingAll || speakingIndex !== null) {
      stopSpeech();
      return;
    }
    setIsPlayingAll(true);
    playSequenceFrom(0);
  };

  const playSequenceFrom = (index: number) => {
    if (index >= STORYBOARD_SCENES.length) {
      stopSpeech();
      return;
    }
    setSpeakingIndex(index);
    jumpToScene(index);

    const utterance = new SpeechSynthesisUtterance(buildNarration(STORYBOARD_SCENES[index]));
    utterance.lang = 'es-MX';
    utterance.rate = 0.96;
    const voice = getSpanishVoice();
    if (voice) utterance.voice = voice;

    utterance.onend = () => {
      playSequenceFrom(index + 1);
    };
    utterance.onerror = () => stopSpeech();
    window.speechSynthesis.speak(utterance);
  };

  const jumpToScene = (index: number) => {
    setActiveSceneIndex(index);
    if (viewMode === 'carousel' && emblaApi) {
      emblaApi.scrollTo(index);
      return;
    }
    const target = document.getElementById(`escena-${index + 1}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleTechSpec = (num: number) => {
    setOpenTechMap((prev) => ({ ...prev, [num]: !prev[num] }));
  };

  const currentSlideScene = STORYBOARD_SCENES[activeSceneIndex] ?? STORYBOARD_SCENES[0];

  return (
    <section id="relato-interactivo" className="relative pb-16">
      {/* Hilo superior de progreso de lectura */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-forest via-olive to-terracotta origin-left z-50 no-print"
      />

      {/* Barra flotante moderna con píldoras animadas (layoutId) */}
      <div className="sticky top-3 z-40 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 no-print">
        <div className="rounded-3xl bg-cream-soft/90 backdrop-blur-xl border border-earth/20 shadow-[0_10px_35px_rgba(60,40,20,0.09)] p-2.5 sm:px-4 sm:py-3 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2.5">
            {/* Selector de modo con transición compartida Motion */}
            <div
              className="inline-flex flex-wrap items-center rounded-full bg-cream-deep/75 p-1 border border-earth/15"
              role="tablist"
              aria-label="Modo de experiencia"
            >
              {(
                [
                  { id: 'editorial', label: 'Relato Visual' },
                  { id: 'carousel', label: 'Carrusel Táctil' },
                  { id: 'technical', label: 'Guion Completo' },
                ] as const
              ).map((tab) => {
                const active = viewMode === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setViewMode(tab.id)}
                    className={`relative px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-colors cursor-pointer ${
                      active ? 'text-cream' : 'text-ink-soft hover:text-ink'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="activeViewModePill"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        className="absolute inset-0 rounded-full bg-forest shadow-xs"
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Acciones tipográficas limpias con ecualizador de voz */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleSpeakAll}
                className={`inline-flex items-center gap-2.5 rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
                  isPlayingAll
                    ? 'bg-terracotta text-cream border-terracotta shadow-xs'
                    : 'bg-cream text-ink border-earth/25 hover:border-forest/50'
                }`}
              >
                <AudioWave active={isPlayingAll} light={isPlayingAll} />
                <span>{isPlayingAll ? 'Detener narración' : 'Escuchar historia'}</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="hidden sm:inline-flex items-center rounded-full bg-cream px-3.5 py-1.5 text-xs sm:text-sm font-medium text-ink-soft border border-earth/20 hover:text-ink hover:border-earth/45 transition-colors cursor-pointer"
              >
                Guardar PDF
              </button>
            </div>
          </div>

          {/* Tira numérica 01 — 08 */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
            {STORYBOARD_SCENES.map((scene, idx) => {
              const isCurrent = activeSceneIndex === idx;
              return (
                <button
                  key={scene.number}
                  type="button"
                  onClick={() => jumpToScene(idx)}
                  className={`relative shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    isCurrent ? 'text-ink font-semibold' : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {isCurrent && (
                    <motion.span
                      layoutId="activeSceneScrubber"
                      transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                      className="absolute inset-0 rounded-full bg-peach/65 border border-earth/25"
                    />
                  )}
                  <span className="relative z-10 font-mono mr-1.5 text-[11px]">
                    {scene.numeral}
                  </span>
                  <span className="relative z-10 hidden md:inline">
                    {scene.phase.replace(/^Etapa \d+ · /, '')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL DE VISTAS */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {viewMode === 'carousel' ? (
          /* ================================================================
             VISTA 2: CARRUSEL TÁCTIL INMERSIVO (Embla Carousel + AnimatePresence)
             ================================================================ */
          <motion.div
            key="carousel-view"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="space-y-6"
          >
            <div className="overflow-hidden rounded-[28px] border border-earth/25 bg-cream-soft shadow-[0_20px_50px_rgba(70,45,25,0.1)]" ref={emblaRef}>
              <div className="flex touch-pan-y">
                {STORYBOARD_SCENES.map((scene) => (
                  <div
                    key={scene.number}
                    className="flex-[0_0_100%] min-w-0 relative select-none"
                  >
                    <div
                      onClick={() => setLightboxScene(scene)}
                      className="relative cursor-zoom-in overflow-hidden bg-cream-deep"
                    >
                      <picture>
                        <source srcSet={`${baseUrl}${scene.imageWebp}`} type="image/webp" />
                        <img
                          src={`${baseUrl}${scene.imageJpg}`}
                          alt={scene.imageAlt}
                          className="w-full h-auto aspect-video object-cover"
                          width={1360}
                          height={759}
                        />
                      </picture>
                      <div className="absolute top-4 left-4 rounded-full bg-cream-soft/90 backdrop-blur-md border border-earth/20 px-3.5 py-1">
                        <span className="font-mono text-xs font-semibold text-forest">
                          ESCENA {scene.numeral} / 08
                        </span>
                      </div>
                      <div className="absolute bottom-3 right-4 rounded-full bg-ink/70 backdrop-blur-xs px-3 py-1 text-[11px] font-medium text-cream">
                        Toca la lámina para ampliar
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Controles táctiles y detalle animado de la escena activa */}
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => emblaApi?.scrollPrev()}
                disabled={activeSceneIndex === 0}
                className="rounded-full bg-cream-soft border border-earth/25 px-5 py-2.5 text-xs sm:text-sm font-semibold text-ink disabled:opacity-35 hover:bg-peach-pale transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                Escena anterior
              </button>

              <span className="font-mono text-xs sm:text-sm text-ink-muted">
                Desliza con el dedo · {currentSlideScene.numeral} de 08
              </span>

              <button
                type="button"
                onClick={() => emblaApi?.scrollNext()}
                disabled={activeSceneIndex === STORYBOARD_SCENES.length - 1}
                className="rounded-full bg-forest px-5 py-2.5 text-xs sm:text-sm font-semibold text-cream disabled:opacity-35 hover:bg-forest-dark transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                Siguiente escena
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlideScene.number}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.32, ease: 'easeOut' }}
                className="rounded-[26px] bg-cream-soft border border-earth/20 p-6 sm:p-8 shadow-sm space-y-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span
                      className={`inline-block rounded-full border px-3 py-0.5 text-xs font-semibold ${
                        ACCENT_STYLES[currentSlideScene.accent].pill
                      }`}
                    >
                      {currentSlideScene.phase}
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-ink">
                      {currentSlideScene.title}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => speakSingleScene(activeSceneIndex)}
                    className="inline-flex items-center gap-2 rounded-full bg-olive-pale/75 border border-olive/40 px-4 py-2 text-xs font-semibold text-forest hover:bg-olive-pale transition-colors cursor-pointer"
                  >
                    <AudioWave active={speakingIndex === activeSceneIndex} />
                    <span>
                      {speakingIndex === activeSceneIndex ? 'Detener voz' : 'Escuchar escena'}
                    </span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-gradient-to-br from-peach-pale/80 to-cream p-5 border border-earth/20">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-earth mb-1.5">
                      Texto en pantalla
                    </p>
                    <p className="font-serif text-lg sm:text-xl font-medium text-ink leading-snug">
                      {currentSlideScene.onScreenLines[0]}
                      <br />
                      {currentSlideScene.onScreenLines[1]}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-olive-pale/45 p-5 border border-olive/30">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-forest mb-1.5">
                      {currentSlideScene.speaker}
                    </p>
                    <p className="text-sm sm:text-base text-ink-soft leading-relaxed">
                      {currentSlideScene.dialogue}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        ) : (
          /* ================================================================
             VISTA 1 & 3: RELATO VISUAL SCROLLYTELLING / GUION TÉCNICO COMPLETO
             ================================================================ */
          <div className="space-y-12 md:space-y-20">
            {STORYBOARD_SCENES.map((scene, index) => {
              const isReversed = index % 2 === 1 && viewMode === 'editorial';
              const isTechExpanded = viewMode === 'technical' || Boolean(openTechMap[scene.number]);
              const accent = ACCENT_STYLES[scene.accent];
              const isSpeakingThis = speakingIndex === index;

              return (
                <div key={scene.number} className="relative print-scene-break">
                  <motion.article
                    id={`escena-${scene.number}`}
                    data-scene-card
                    data-scene-index={index}
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="scroll-mt-36 rounded-[30px] bg-cream-soft border border-earth/20 shadow-[0_14px_40px_rgba(70,45,25,0.06)] overflow-hidden p-4 sm:p-6 lg:p-8"
                  >
                    <div
                      className={`grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center`}
                    >
                      {/* Columna de lámina en acuarela */}
                      <div
                        className={`lg:col-span-7 ${
                          isReversed ? 'lg:order-2' : 'lg:order-1'
                        }`}
                      >
                        <div
                          onClick={() => setLightboxScene(scene)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setLightboxScene(scene);
                            }
                          }}
                          role="button"
                          tabIndex={0}
                          aria-label={`Ampliar lámina de la escena ${scene.number}: ${scene.title}`}
                          className="group relative overflow-hidden rounded-[22px] border border-earth/20 bg-cream-deep cursor-zoom-in"
                        >
                          <picture>
                            <source srcSet={`${baseUrl}${scene.imageWebp}`} type="image/webp" />
                            <img
                              src={`${baseUrl}${scene.imageJpg}`}
                              alt={scene.imageAlt}
                              loading={index === 0 ? 'eager' : 'lazy'}
                              width={1360}
                              height={759}
                              className="w-full h-auto aspect-video object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                            />
                          </picture>
                          <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4 no-print">
                            <span className="rounded-full bg-cream-soft/95 px-3.5 py-1 text-xs font-semibold text-ink shadow-sm">
                              Ampliar lámina
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Columna narrativa y editorial */}
                      <div
                        className={`lg:col-span-5 space-y-5 ${
                          isReversed ? 'lg:order-1' : 'lg:order-2'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className="font-serif text-3xl sm:text-4xl font-semibold text-earth/45 leading-none select-none">
                              {scene.numeral}
                            </span>
                            <span
                              className={`inline-block rounded-full border px-3 py-0.5 text-xs font-semibold ${accent.pill}`}
                            >
                              {scene.phase}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => speakSingleScene(index)}
                            className={`no-print inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-colors cursor-pointer ${
                              isSpeakingThis
                                ? 'bg-forest text-cream border-forest'
                                : 'bg-cream text-forest border-olive/35 hover:bg-olive-pale/70'
                            }`}
                          >
                            <AudioWave active={isSpeakingThis} light={isSpeakingThis} />
                            <span>{isSpeakingThis ? 'Detener' : 'Escuchar'}</span>
                          </button>
                        </div>

                        <h2 className="font-serif text-2xl sm:text-[1.75rem] font-semibold leading-tight text-ink">
                          {scene.title}
                        </h2>

                        {/* Texto en pantalla (máximo 2 líneas) */}
                        <div
                          className={`rounded-2xl bg-gradient-to-br ${accent.cardTint} border border-earth/20 p-4 sm:p-5`}
                        >
                          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-earth mb-1.5">
                            Texto en pantalla
                          </p>
                          <p className="font-serif text-base sm:text-lg font-medium text-ink leading-snug">
                            {scene.onScreenLines[0]}
                            <br />
                            {scene.onScreenLines[1]}
                          </p>
                        </div>

                        {/* Diálogo o narración cercana */}
                        <div className="relative pl-4 border-l-2 border-olive space-y-1">
                          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-forest font-medium">
                            {scene.speaker}
                          </p>
                          <p className="text-sm sm:text-[15.5px] text-ink-soft leading-relaxed">
                            {scene.dialogue}
                          </p>
                        </div>

                        {/* Botón acordeón de ficha técnica (solo en modo Relato Visual) */}
                        {viewMode === 'editorial' && (
                          <div className="pt-1 no-print">
                            <button
                              type="button"
                              onClick={() => toggleTechSpec(scene.number)}
                              aria-expanded={isTechExpanded}
                              className="text-xs font-semibold text-earth hover:text-forest transition-colors underline decoration-earth/35 underline-offset-4 cursor-pointer"
                            >
                              {isTechExpanded
                                ? 'Ocultar notas de encuadre y transición'
                                : 'Ver descripción visual y transición de escena'}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Panel expandible con Descripción Visual Detallada + Nota de Transición */}
                    <AnimatePresence initial={false}>
                      {isTechExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="mt-6 pt-6 border-t border-earth/15 grid grid-cols-1 md:grid-cols-12 gap-5 text-sm">
                            <div className="md:col-span-8 rounded-2xl bg-cream/80 border border-earth/15 p-4 sm:p-5 space-y-1.5">
                              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-forest font-medium">
                                Descripción visual detallada (encuadre, personajes, entorno y emociones)
                              </p>
                              <p className="text-ink-soft leading-relaxed">
                                {scene.visualDescription}
                              </p>
                            </div>

                            <div className="md:col-span-4 rounded-2xl bg-cream/80 border border-earth/15 p-4 sm:p-5 space-y-1.5">
                              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-earth font-medium">
                                Ritmo y transición visual
                              </p>
                              <p className="text-ink-soft leading-relaxed">
                                {scene.transitionNote}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.article>

                  {/* Hilo editorial vertical entre escenas */}
                  {index < STORYBOARD_SCENES.length - 1 && (
                    <div
                      className="hidden md:flex flex-col items-center justify-center py-3 no-print"
                      aria-hidden="true"
                    >
                      <div className="w-px h-10 bg-gradient-to-b from-earth/35 to-olive/40" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ================================================================
         VISOR LIGHTBOX DE GALERÍA CON FÍSICA SPRING
         ================================================================ */}
      <AnimatePresence>
        {lightboxScene && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24 }}
            onClick={() => setLightboxScene(null)}
            className="fixed inset-0 z-50 bg-ink/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 no-print"
            role="dialog"
            aria-modal="true"
            aria-label={`Lámina ampliada: Escena ${lightboxScene.number}`}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 14 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-5xl w-full rounded-[26px] bg-cream-soft border border-earth/30 overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between gap-4 px-5 py-3.5 border-b border-earth/15">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold text-forest">
                    ESCENA {lightboxScene.numeral}
                  </span>
                  <span className="text-sm font-semibold text-ink truncate">
                    {lightboxScene.title}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setLightboxScene(null)}
                  className="rounded-full bg-cream border border-earth/25 px-4 py-1 text-xs font-semibold text-ink hover:bg-peach-pale transition-colors cursor-pointer"
                >
                  Cerrar vista
                </button>
              </div>

              <div className="bg-cream-deep">
                <img
                  src={`${baseUrl}${lightboxScene.imageJpg}`}
                  alt={lightboxScene.imageAlt}
                  className="w-full max-h-[74vh] object-contain mx-auto"
                />
              </div>

              <div className="px-5 py-4 bg-cream-soft text-center">
                <p className="font-serif text-base sm:text-lg text-ink">
                  {lightboxScene.onScreenLines.join(' ')}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
