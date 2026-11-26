import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useSpring } from 'motion/react';
import useEmblaCarousel from 'embla-carousel-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { STORYBOARD_SCENES, type StoryboardScene } from '../data/storyboard';
import { soundscape } from '../utils/soundscape';
import AudioWave from './AudioWave';
import TiltPlate from './TiltPlate';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type ViewMode = 'editorial' | 'documentary' | 'carousel' | 'technical';

interface StoryboardExperienceProps {
  baseUrl: string;
}

const ACCENT_STYLES: Record<
  StoryboardScene['accent'],
  { pill: string; cardTint: string }
> = {
  peach: {
    pill: 'bg-peach-pale text-ink border-peach',
    cardTint: 'from-peach-pale/75 to-cream-soft',
  },
  rose: {
    pill: 'bg-rose-pale text-ink border-rose',
    cardTint: 'from-rose-pale/70 to-cream-soft',
  },
  olive: {
    pill: 'bg-olive-pale text-forest border-olive/40',
    cardTint: 'from-olive-pale/70 to-cream-soft',
  },
  forest: {
    pill: 'bg-forest/10 text-forest border-forest/25',
    cardTint: 'from-olive-pale/50 to-cream-soft',
  },
};

export default function StoryboardExperience({ baseUrl }: StoryboardExperienceProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('editorial');
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [openTechMap, setOpenTechMap] = useState<Record<number, boolean>>({});
  // Permite alternar entre foto principal y secundaria en escenas con doble registro en campo
  const [secondaryActiveMap, setSecondaryActiveMap] = useState<Record<number, boolean>>({});
  const [lightboxMedia, setLightboxMedia] = useState<{
    jpg: string;
    alt: string;
    label: string;
    subtitle: string;
  } | null>(null);

  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [ambientOn, setAmbientOn] = useState(false);
  const [comfortReading, setComfortReading] = useState(false);
  const [mobileControlsOpen, setMobileControlsOpen] = useState(false);

  const [docPlaying, setDocPlaying] = useState(true);
  const [docProgress, setDocProgress] = useState(0);

  const editorialListRef = useRef<HTMLDivElement>(null);

  const scaleX = useSpring(0, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });

  useEffect(() => {
    scaleX.set(activeSceneIndex / (STORYBOARD_SCENES.length - 1));
  }, [activeSceneIndex, scaleX]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('uiep-comfort-reading');
      if (saved === 'true') {
        setComfortReading(true);
        document.documentElement.classList.add('comfort-reading');
      }
    } catch {
      // Ignorar
    }
  }, []);

  const toggleComfortReading = () => {
    setComfortReading((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle('comfort-reading', next);
      try {
        localStorage.setItem('uiep-comfort-reading', String(next));
      } catch {
        // Ignorar
      }
      return next;
    });
  };

  const handleToggleAmbient = () => {
    const active = soundscape.toggleAmbient();
    setAmbientOn(active);
    if (active) soundscape.playHarmonicNote(activeSceneIndex);
  };

  // GSAP ScrollTrigger: parallax suave sobre fotografías reales e hilo conductor central
  useGSAP(
    () => {
      if (viewMode !== 'editorial' && viewMode !== 'technical') return;
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;

      const images = gsap.utils.toArray<HTMLElement>('.gsap-parallax-img');
      images.forEach((img) => {
        gsap.fromTo(
          img,
          { scale: 1.06, yPercent: -3 },
          {
            scale: 1.0,
            yPercent: 3,
            ease: 'none',
            scrollTrigger: {
              trigger: img.parentElement,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      });

      gsap.fromTo(
        '.gsap-spine-progress',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: editorialListRef.current,
            start: 'top 35%',
            end: 'bottom 75%',
            scrub: 0.4,
          },
        }
      );
    },
    { dependencies: [viewMode], scope: editorialListRef }
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'center',
    skipSnaps: false,
  });

  const onEmblaSelect = useCallback(() => {
    if (!emblaApi) return;
    const snap = emblaApi.selectedScrollSnap();
    setActiveSceneIndex(snap);
    if (ambientOn) soundscape.playHarmonicNote(snap);
  }, [emblaApi, ambientOn]);

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

  // Escuchar eventos desde el Mapa Territorial o el Archivo Fotográfico
  useEffect(() => {
    const gotoHandler = (e: Event) => {
      const custom = e as CustomEvent<{ sceneNumber: number }>;
      const idx = (custom.detail?.sceneNumber ?? 1) - 1;
      if (idx >= 0 && idx < STORYBOARD_SCENES.length) {
        if (viewMode === 'carousel' || viewMode === 'documentary') {
          setActiveSceneIndex(idx);
          emblaApi?.scrollTo(idx);
          document.getElementById('relato-interactivo')?.scrollIntoView({ behavior: 'smooth' });
        } else {
          document.getElementById(`escena-${idx + 1}`)?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
    };

    const lightboxHandler = (e: Event) => {
      const custom = e as CustomEvent<{
        jpg: string;
        alt: string;
        label: string;
        subtitle: string;
      }>;
      if (custom.detail) setLightboxMedia(custom.detail);
    };

    window.addEventListener('uiep:goto-scene', gotoHandler);
    window.addEventListener('uiep:open-photo', lightboxHandler);
    return () => {
      window.removeEventListener('uiep:goto-scene', gotoHandler);
      window.removeEventListener('uiep:open-photo', lightboxHandler);
    };
  }, [viewMode, emblaApi]);

  useEffect(() => {
    if (viewMode === 'carousel' || viewMode === 'documentary' || !('IntersectionObserver' in window))
      return;

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

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (lightboxMedia) {
        if (e.key === 'Escape') setLightboxMedia(null);
        return;
      }
      if (viewMode === 'carousel' && emblaApi) {
        if (e.key === 'ArrowRight') emblaApi.scrollNext();
        if (e.key === 'ArrowLeft') emblaApi.scrollPrev();
      }
      if (viewMode === 'documentary') {
        if (e.key === 'ArrowRight')
          setActiveSceneIndex((p) => Math.min(STORYBOARD_SCENES.length - 1, p + 1));
        if (e.key === 'ArrowLeft') setActiveSceneIndex((p) => Math.max(0, p - 1));
        if (e.key === ' ') {
          e.preventDefault();
          setDocPlaying((p) => !p);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxMedia, viewMode, emblaApi]);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      soundscape.stopAmbient();
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
    return `Paso ${scene.number}: ${scene.title}. ${scene.whatLines.join(' ')} ${scene.howDescription} ${cleanDialogue}`;
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

    utterance.onend = () => playSequenceFrom(index + 1);
    utterance.onerror = () => stopSpeech();
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (viewMode !== 'documentary') {
      setDocProgress(0);
      return;
    }
    if (!docPlaying) return;

    const DURATION_MS = 9500;
    const INTERVAL_MS = 60;
    let elapsed = 0;
    setDocProgress(0);

    if (ambientOn) soundscape.playHarmonicNote(activeSceneIndex);

    const timer = setInterval(() => {
      elapsed += INTERVAL_MS;
      const pct = Math.min(100, (elapsed / DURATION_MS) * 100);
      setDocProgress(pct);

      if (elapsed >= DURATION_MS) {
        clearInterval(timer);
        if (activeSceneIndex < STORYBOARD_SCENES.length - 1) {
          setActiveSceneIndex((prev) => prev + 1);
        } else {
          setDocPlaying(false);
        }
      }
    }, INTERVAL_MS);

    return () => clearInterval(timer);
  }, [viewMode, activeSceneIndex, docPlaying, ambientOn]);

  const jumpToScene = (index: number) => {
    setActiveSceneIndex(index);
    setMobileControlsOpen(false);
    if (ambientOn) soundscape.playHarmonicNote(index);

    if (viewMode === 'carousel' && emblaApi) {
      emblaApi.scrollTo(index);
      return;
    }
    if (viewMode === 'documentary') {
      setDocProgress(0);
      return;
    }
    const target = document.getElementById(`escena-${index + 1}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleModeSwitch = (mode: ViewMode) => {
    stopSpeech();
    setViewMode(mode);
    if (mode === 'documentary') {
      setDocPlaying(true);
      setDocProgress(0);
    }
    if (ambientOn) soundscape.playHarmonicNote(activeSceneIndex);
  };

  const openScenePhoto = (scene: StoryboardScene, useSecondary = false) => {
    const media = useSecondary && scene.secondaryPhoto ? scene.secondaryPhoto : null;
    setLightboxMedia({
      jpg: `${baseUrl}${media ? media.jpg : scene.imageJpg}`,
      alt: media ? media.alt : scene.imageAlt,
      label: `PASO ${scene.numeral} · ${scene.locationTag}`,
      subtitle: `${scene.whatLines[0]} ${scene.whatLines[1]}`,
    });
  };

  const currentScene = STORYBOARD_SCENES[activeSceneIndex] ?? STORYBOARD_SCENES[0];

  return (
    <section id="relato-interactivo" className="relative pb-20">
      <div
        role="progressbar"
        aria-label="Progreso del recorrido"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round((activeSceneIndex / (STORYBOARD_SCENES.length - 1)) * 100)}
        className="fixed inset-x-0 top-0 z-[60] h-1 bg-earth/15 no-print"
      >
        <motion.div
          style={{ scaleX }}
          className="h-full origin-left bg-gradient-to-r from-forest via-olive to-terracotta"
        />
      </div>

      {/* DOCK FLOTANTE DE NAVEGACIÓN Y ACCESIBILIDAD */}
      <div className="relative sm:sticky sm:top-2 z-40 max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 mb-6 sm:mb-10 no-print">
        <div className="rounded-2xl sm:rounded-[26px] bg-cream-soft/95 backdrop-blur-xl border border-earth/20 shadow-[0_12px_34px_rgba(55,35,18,0.12)] p-2 sm:px-4 sm:py-3 space-y-2.5">
          <div className="flex sm:hidden items-center justify-between gap-3 px-1 py-0.5">
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-earth">
                Paso {String(activeSceneIndex + 1).padStart(2, '0')} de{' '}
                {String(STORYBOARD_SCENES.length).padStart(2, '0')}
              </p>
              <p className="truncate text-sm font-semibold text-ink">
                {currentScene.title}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMobileControlsOpen((open) => !open)}
              aria-expanded={mobileControlsOpen}
              aria-controls="mobile-story-controls"
              className="shrink-0 rounded-full bg-forest px-4 py-2.5 text-xs font-semibold text-cream transition-colors hover:bg-forest-dark"
            >
              {mobileControlsOpen ? 'Cerrar' : 'Explorar pasos'}
            </button>
          </div>

          <div className="h-1 overflow-hidden rounded-full bg-earth/10 sm:hidden" aria-hidden="true">
            <div
              className="h-full rounded-full bg-gradient-to-r from-forest via-olive to-terracotta transition-[width] duration-300"
              style={{
                width: `${((activeSceneIndex + 1) / STORYBOARD_SCENES.length) * 100}%`,
              }}
            />
          </div>

          <div
            id="mobile-story-controls"
            className={`${mobileControlsOpen ? 'flex' : 'hidden'} sm:flex flex-wrap items-center justify-between gap-2.5`}
          >
            <div
              className="inline-flex flex-wrap items-center rounded-full bg-cream-deep/70 p-1 border border-earth/15"
              role="tablist"
              aria-label="Modo de visualización del proceso"
            >
              {(
                [
                  { id: 'editorial', label: 'Paso a Paso Real' },
                  { id: 'documentary', label: 'Modo Documental' },
                  { id: 'carousel', label: 'Carrusel Táctil' },
                  { id: 'technical', label: 'Ficha Completa' },
                ] as const
              ).map((tab) => {
                const active = viewMode === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => handleModeSwitch(tab.id)}
                    className={`relative px-3 sm:px-3.5 py-1.5 text-xs font-semibold rounded-full transition-colors cursor-pointer ${
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

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={toggleSpeakAll}
                className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold border transition-all cursor-pointer ${
                  isPlayingAll
                    ? 'bg-terracotta text-cream border-terracotta'
                    : 'bg-cream text-ink border-earth/25 hover:border-forest/50'
                }`}
              >
                <AudioWave active={isPlayingAll} light={isPlayingAll} />
                <span>{isPlayingAll ? 'Detener voz' : 'Escuchar explicación'}</span>
              </button>

              <button
                type="button"
                onClick={handleToggleAmbient}
                aria-pressed={ambientOn}
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium border transition-colors cursor-pointer ${
                  ambientOn
                    ? 'bg-olive-pale text-forest border-olive font-semibold'
                    : 'bg-cream text-ink-soft border-earth/20 hover:text-ink'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    ambientOn ? 'bg-forest animate-ping' : 'bg-earth/45'
                  }`}
                  aria-hidden="true"
                />
                <span>Ambiente sonoro</span>
              </button>

              <button
                type="button"
                onClick={toggleComfortReading}
                aria-pressed={comfortReading}
                className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium border transition-colors cursor-pointer ${
                  comfortReading
                    ? 'bg-peach/70 text-ink border-earth/45 font-semibold'
                    : 'bg-cream text-ink-soft border-earth/20 hover:text-ink'
                }`}
              >
                {comfortReading ? 'Texto estándar' : 'Lectura amplia'}
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="hidden lg:inline-flex items-center rounded-full bg-cream px-3 py-1.5 text-xs font-medium text-ink-soft border border-earth/20 hover:text-ink transition-colors cursor-pointer"
              >
                Guardar PDF
              </button>
            </div>
          </div>

          <div
            className={`${mobileControlsOpen ? 'flex' : 'hidden'} sm:flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5`}
          >
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
                    {scene.phase.replace(/^Etapa \d+[B]? · /, '')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {viewMode === 'documentary' ? (
          /* ----------------------------------------------------------------
             MODO DOCUMENTAL CON FOTOS REALES Y EFECTO KEN BURNS
             ---------------------------------------------------------------- */
          <motion.div
            key="documentary-mode"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45 }}
            className="space-y-5"
          >
            <div className="relative rounded-[30px] overflow-hidden bg-ink border border-earth/30 shadow-[0_26px_70px_rgba(28,22,18,0.28)]">
              <div className="absolute top-0 left-0 right-0 z-20 p-4 sm:p-5 bg-gradient-to-b from-ink/80 to-transparent">
                <div className="grid grid-cols-8 gap-1.5 mb-3">
                  {STORYBOARD_SCENES.map((s, i) => {
                    const fill =
                      i < activeSceneIndex ? 100 : i === activeSceneIndex ? docProgress : 0;
                    return (
                      <button
                        key={s.number}
                        type="button"
                        onClick={() => {
                          setActiveSceneIndex(i);
                          setDocProgress(0);
                        }}
                        aria-label={`Saltar a paso ${s.number}`}
                        className="h-1.5 rounded-full bg-cream/25 overflow-hidden cursor-pointer"
                      >
                        <div
                          className="h-full bg-peach transition-[width] duration-75 ease-linear"
                          style={{ width: `${fill}%` }}
                        />
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-cream">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-semibold tracking-wider text-peach">
                      PASO {currentScene.numeral} / 08
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-cream/90">
                      {currentScene.locationTag}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => speakSingleScene(activeSceneIndex)}
                      className="rounded-full bg-cream/15 backdrop-blur-md border border-cream/25 px-3.5 py-1 text-xs font-semibold text-cream hover:bg-cream/25 transition-colors cursor-pointer"
                    >
                      {speakingIndex === activeSceneIndex ? 'Silenciar voz' : 'Narrar paso'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDocPlaying((p) => !p)}
                      className="rounded-full bg-peach text-ink px-4 py-1 text-xs font-semibold hover:bg-peach-pale transition-colors cursor-pointer"
                    >
                      {docPlaying ? 'Pausar' : 'Reanudar'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="relative aspect-[4/3] sm:aspect-video w-full overflow-hidden bg-ink">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentScene.number}
                    src={`${baseUrl}${currentScene.imageJpg}`}
                    alt={currentScene.imageAlt}
                    style={{ objectPosition: currentScene.objectPosition }}
                    initial={{ opacity: 0.25 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0.25 }}
                    transition={{ duration: 0.65 }}
                    className={`w-full h-full object-cover ${
                      docPlaying ? 'ken-burns-active' : ''
                    }`}
                  />
                </AnimatePresence>

                <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-ink/95 via-ink/65 to-transparent px-5 pb-5 pt-20 sm:px-10 sm:pb-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentScene.number}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35 }}
                      className="max-w-3xl space-y-2"
                    >
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-peach">
                        ¿Qué se hace y cómo se trabaja?
                      </p>
                      <h2 className="font-serif text-xl sm:text-3xl font-medium text-cream leading-snug">
                        {currentScene.whatLines[0]}{' '}
                        <span className="text-peach">{currentScene.whatLines[1]}</span>
                      </h2>
                      <p className="text-xs sm:text-base text-cream/85 leading-relaxed">
                        {currentScene.howDescription}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                disabled={activeSceneIndex === 0}
                onClick={() => {
                  setActiveSceneIndex((p) => Math.max(0, p - 1));
                  setDocProgress(0);
                }}
                className="rounded-full bg-cream-soft border border-earth/25 px-5 py-2.5 text-xs sm:text-sm font-semibold text-ink disabled:opacity-35 hover:bg-peach-pale transition-colors cursor-pointer"
              >
                Paso anterior
              </button>

              <button
                type="button"
                onClick={() => openScenePhoto(currentScene, false)}
                className="text-xs sm:text-sm font-semibold text-forest underline underline-offset-4 cursor-pointer"
              >
                Ver fotografía completa con zoom
              </button>

              <button
                type="button"
                disabled={activeSceneIndex === STORYBOARD_SCENES.length - 1}
                onClick={() => {
                  setActiveSceneIndex((p) => Math.min(STORYBOARD_SCENES.length - 1, p + 1));
                  setDocProgress(0);
                }}
                className="rounded-full bg-forest px-5 py-2.5 text-xs sm:text-sm font-semibold text-cream disabled:opacity-35 hover:bg-forest-dark transition-colors cursor-pointer"
              >
                Siguiente paso
              </button>
            </div>
          </motion.div>
        ) : viewMode === 'carousel' ? (
          /* ----------------------------------------------------------------
             MODO CARRUSEL TÁCTIL CON FOTOS REALES
             ---------------------------------------------------------------- */
          <motion.div
            key="carousel-view"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="space-y-6"
          >
            <div
              className="overflow-hidden rounded-[28px] border border-earth/25 bg-cream-soft shadow-[0_20px_50px_rgba(70,45,25,0.1)]"
              ref={emblaRef}
            >
              <div className="flex touch-pan-y">
                {STORYBOARD_SCENES.map((scene) => (
                  <div key={scene.number} className="flex-[0_0_100%] min-w-0 relative select-none">
                    <div
                      onClick={() => openScenePhoto(scene, false)}
                      className="relative cursor-zoom-in overflow-hidden bg-cream-deep aspect-[4/3] sm:aspect-video"
                    >
                      <picture>
                        <source srcSet={`${baseUrl}${scene.imageWebp}`} type="image/webp" />
                        <img
                          src={`${baseUrl}${scene.imageJpg}`}
                          alt={scene.imageAlt}
                          style={{ objectPosition: scene.objectPosition }}
                          className="w-full h-full object-cover"
                        />
                      </picture>
                      <div className="absolute top-4 left-4 rounded-full bg-cream-soft/92 backdrop-blur-md border border-earth/20 px-3.5 py-1">
                        <span className="font-mono text-xs font-semibold text-forest">
                          {scene.numeral} · {scene.locationTag}
                        </span>
                      </div>
                      <div className="absolute bottom-3 right-4 rounded-full bg-ink/75 backdrop-blur-xs px-3 py-1 text-[11px] font-medium text-cream">
                        Toca para ver foto completa
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => emblaApi?.scrollPrev()}
                disabled={activeSceneIndex === 0}
                className="rounded-full bg-cream-soft border border-earth/25 px-5 py-2.5 text-xs sm:text-sm font-semibold text-ink disabled:opacity-35 hover:bg-peach-pale transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                Anterior
              </button>

              <span className="font-mono text-xs sm:text-sm text-ink-muted">
                Desliza con el dedo · {currentScene.numeral} de 08
              </span>

              <button
                type="button"
                onClick={() => emblaApi?.scrollNext()}
                disabled={activeSceneIndex === STORYBOARD_SCENES.length - 1}
                className="rounded-full bg-forest px-5 py-2.5 text-xs sm:text-sm font-semibold text-cream disabled:opacity-35 hover:bg-forest-dark transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentScene.number}
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
                        ACCENT_STYLES[currentScene.accent].pill
                      }`}
                    >
                      {currentScene.phase}
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-ink">
                      {currentScene.title}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => speakSingleScene(activeSceneIndex)}
                    className="inline-flex items-center gap-2 rounded-full bg-olive-pale/75 border border-olive/40 px-4 py-2 text-xs font-semibold text-forest hover:bg-olive-pale transition-colors cursor-pointer"
                  >
                    <AudioWave active={speakingIndex === activeSceneIndex} />
                    <span>
                      {speakingIndex === activeSceneIndex ? 'Detener voz' : 'Escuchar paso'}
                    </span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-gradient-to-br from-peach-pale/80 to-cream p-5 border border-earth/20">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-earth mb-1.5">
                      ¿Qué se está haciendo?
                    </p>
                    <p className="font-serif text-lg sm:text-xl font-medium text-ink leading-snug">
                      {currentScene.whatLines[0]} {currentScene.whatLines[1]}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-olive-pale/45 p-5 border border-olive/30 space-y-2">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-forest">
                      ¿Cómo se está haciendo?
                    </p>
                    <p className="text-sm sm:text-base text-ink-soft leading-relaxed">
                      {currentScene.howDescription}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        ) : (
          /* ----------------------------------------------------------------
             MODO 1 & 4: PASO A PASO REAL EN CAMPO / FICHA COMPLETA
             ---------------------------------------------------------------- */
          <div ref={editorialListRef} className="relative">
            <div
              className="hidden lg:block absolute left-1/2 top-8 bottom-8 w-px bg-earth/15 -translate-x-1/2 pointer-events-none no-print"
              aria-hidden="true"
            >
              <div className="gsap-spine-progress w-full h-full bg-gradient-to-b from-forest via-olive to-terracotta origin-top" />
            </div>

            <div className="space-y-8 md:space-y-12 lg:space-y-20 relative z-10">
              {STORYBOARD_SCENES.map((scene, index) => {
                const isReversed = index % 2 === 1 && viewMode === 'editorial';
                const isTechExpanded =
                  viewMode === 'technical' || Boolean(openTechMap[scene.number]);
                const showSecondary = Boolean(secondaryActiveMap[scene.number] && scene.secondaryPhoto);
                const activeWebp =
                  showSecondary && scene.secondaryPhoto ? scene.secondaryPhoto.webp : scene.imageWebp;
                const activeJpg =
                  showSecondary && scene.secondaryPhoto ? scene.secondaryPhoto.jpg : scene.imageJpg;
                const activeAlt =
                  showSecondary && scene.secondaryPhoto ? scene.secondaryPhoto.alt : scene.imageAlt;
                const activePos =
                  showSecondary && scene.secondaryPhoto
                    ? scene.secondaryPhoto.objectPosition
                    : scene.objectPosition;

                const accent = ACCENT_STYLES[scene.accent];
                const isSpeakingThis = speakingIndex === index;

                return (
                  <div key={scene.number} className="relative print-scene-break">
                    <motion.article
                      id={`escena-${scene.number}`}
                      data-scene-card
                      data-scene-index={index}
                      initial={{ opacity: 0, y: 34 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-75px' }}
                      transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
                      className="scroll-mt-6 sm:scroll-mt-36 rounded-[24px] sm:rounded-[30px] bg-cream-soft/95 backdrop-blur-xs border border-earth/20 shadow-[0_16px_45px_rgba(70,45,25,0.07)] overflow-hidden p-4 sm:p-6 lg:p-8"
                    >
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
                        {/* Columna de fotografía real en campo */}
                        <div
                          className={`lg:col-span-6 space-y-3 ${
                            isReversed ? 'lg:order-2' : 'lg:order-1'
                          }`}
                        >
                          <TiltPlate
                            maxTilt={3.8}
                            onClick={() => openScenePhoto(scene, showSecondary)}
                            ariaLabel={`Ampliar fotografía real del paso ${scene.number}: ${scene.title}`}
                            className="group overflow-hidden rounded-[22px] border border-earth/20 bg-cream-deep cursor-zoom-in"
                          >
                            <div className="overflow-hidden aspect-[4/3]">
                              <picture>
                                <source srcSet={`${baseUrl}${activeWebp}`} type="image/webp" />
                                <img
                                  src={`${baseUrl}${activeJpg}`}
                                  alt={activeAlt}
                                  loading={index === 0 ? 'eager' : 'lazy'}
                                  style={{ objectPosition: activePos }}
                                  className="gsap-parallax-img w-full h-full object-cover will-change-transform"
                                />
                              </picture>
                            </div>

                            {/* Etiqueta de ubicación real sobre la foto */}
                            <div className="absolute top-3.5 left-3.5 rounded-full bg-cream-soft/90 backdrop-blur-md border border-earth/20 px-3 py-1">
                              <span className="font-mono text-[10.5px] font-semibold text-ink">
                                {scene.locationTag}
                              </span>
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4 no-print">
                              <span className="rounded-full bg-cream-soft/95 px-3.5 py-1 text-xs font-semibold text-ink shadow-sm">
                                Ver foto completa con zoom
                              </span>
                            </div>
                          </TiltPlate>

                          {/* Selector de segunda fotografía real cuando el paso tiene 2 evidencias */}
                          {scene.secondaryPhoto && (
                            <div className="flex items-center justify-between gap-2 px-1 no-print">
                              <span className="font-mono text-[11px] text-ink-muted">
                                2 registros reales en esta etapa:
                              </span>
                              <div className="inline-flex rounded-full bg-cream-deep/75 p-0.5 border border-earth/15">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSecondaryActiveMap((m) => ({ ...m, [scene.number]: false }))
                                  }
                                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                                    !showSecondary
                                      ? 'bg-forest text-cream'
                                      : 'text-ink-soft hover:text-ink'
                                  }`}
                                >
                                  Foto 01
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSecondaryActiveMap((m) => ({ ...m, [scene.number]: true }))
                                  }
                                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                                    showSecondary
                                      ? 'bg-forest text-cream'
                                      : 'text-ink-soft hover:text-ink'
                                  }`}
                                >
                                  Foto 02 · {scene.secondaryPhoto.label}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Columna explicativa clara: ¿Qué se hace? y ¿Cómo se hace? */}
                        <div
                          className={`lg:col-span-6 space-y-4 ${
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

                          <h2 className="font-serif text-2xl sm:text-[1.72rem] font-semibold leading-tight text-ink">
                            {scene.title}
                          </h2>

                          {/* Bloque 1: ¿Qué se está haciendo? */}
                          <div
                            className={`rounded-2xl bg-gradient-to-br ${accent.cardTint} border border-earth/20 p-4 sm:p-5`}
                          >
                            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-earth font-semibold mb-1">
                              ¿Qué se está haciendo?
                            </p>
                            <p className="font-serif text-base sm:text-lg font-medium text-ink leading-snug">
                              {scene.whatLines[0]}
                              <br />
                              {scene.whatLines[1]}
                            </p>
                          </div>

                          {/* Bloque 2: ¿Cómo se está haciendo en la práctica? */}
                          <div className="rounded-2xl bg-olive-pale/45 border border-olive/30 p-4 sm:p-5 space-y-2">
                            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-forest font-semibold">
                              ¿Cómo se está haciendo?
                            </p>
                            <p className="text-sm sm:text-[15px] text-ink leading-relaxed">
                              {scene.howDescription}
                            </p>
                            <p className="text-xs sm:text-sm italic text-ink-soft pt-1 border-t border-olive/20">
                              {scene.dialogue}
                            </p>
                          </div>

                          {viewMode === 'editorial' && (
                            <div className="pt-0.5 no-print">
                              <button
                                type="button"
                                onClick={() =>
                                  setOpenTechMap((prev) => ({
                                    ...prev,
                                    [scene.number]: !prev[scene.number],
                                  }))
                                }
                                aria-expanded={isTechExpanded}
                                className="text-xs font-semibold text-earth hover:text-forest transition-colors underline decoration-earth/35 underline-offset-4 cursor-pointer"
                              >
                                {isTechExpanded
                                  ? 'Ocultar detalle documental de fotografía'
                                  : 'Ver descripción de evidencia fotográfica y secuencia'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

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
                                  Evidencia fotográfica real en campo
                                </p>
                                <p className="text-ink-soft leading-relaxed">
                                  {scene.visualDescription}
                                </p>
                              </div>

                              <div className="md:col-span-4 rounded-2xl bg-cream/80 border border-earth/15 p-4 sm:p-5 space-y-1.5">
                                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-earth font-medium">
                                  Continuidad del proceso
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
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ====================================================================
         INSPECTOR DE FOTOGRAFÍA COMPLETA SIN RECORTE CON ZOOM Y PANEO
         ==================================================================== */}
      <AnimatePresence>
        {lightboxMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24 }}
            onClick={() => setLightboxMedia(null)}
            className="fixed inset-0 z-50 bg-ink/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 no-print"
            role="dialog"
            aria-modal="true"
            aria-label={lightboxMedia.label}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 14 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-5xl w-full rounded-[28px] bg-cream-soft border border-earth/30 overflow-hidden shadow-2xl"
            >
              <TransformWrapper
                initialScale={1}
                minScale={1}
                maxScale={4}
                centerOnInit
                key={lightboxMedia.jpg}
              >
                {({ zoomIn, zoomOut, resetTransform }) => (
                  <>
                    <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-earth/15">
                      <span className="font-mono text-xs font-semibold text-forest truncate">
                        {lightboxMedia.label}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => zoomOut()}
                          className="rounded-full bg-cream border border-earth/20 px-3 py-1 text-xs font-semibold text-ink hover:bg-peach-pale cursor-pointer"
                        >
                          Alejar -
                        </button>
                        <button
                          type="button"
                          onClick={() => resetTransform()}
                          className="rounded-full bg-cream border border-earth/20 px-3 py-1 text-xs font-mono text-ink-soft hover:text-ink cursor-pointer"
                        >
                          100%
                        </button>
                        <button
                          type="button"
                          onClick={() => zoomIn()}
                          className="rounded-full bg-cream border border-earth/20 px-3 py-1 text-xs font-semibold text-ink hover:bg-peach-pale cursor-pointer"
                        >
                          Acercar +
                        </button>
                        <button
                          type="button"
                          onClick={() => setLightboxMedia(null)}
                          className="rounded-full bg-forest px-4 py-1 text-xs font-semibold text-cream hover:bg-forest-dark ml-1 cursor-pointer"
                        >
                          Cerrar
                        </button>
                      </div>
                    </div>

                    <div className="bg-ink/95 cursor-grab active:cursor-grabbing overflow-hidden flex items-center justify-center">
                      <TransformComponent
                        wrapperStyle={{ width: '100%', maxHeight: '72vh' }}
                        contentStyle={{ width: '100%' }}
                      >
                        <img
                          src={lightboxMedia.jpg}
                          alt={lightboxMedia.alt}
                          className="w-full max-h-[72vh] object-contain mx-auto select-none"
                        />
                      </TransformComponent>
                    </div>

                    <div className="px-5 py-3.5 bg-cream-soft border-t border-earth/15 text-center">
                      <p className="font-serif text-sm sm:text-base text-ink">
                        {lightboxMedia.subtitle}
                      </p>
                    </div>
                  </>
                )}
              </TransformWrapper>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
