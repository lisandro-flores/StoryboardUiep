import { useState, useEffect, useCallback, useRef, type KeyboardEvent } from 'react';
import {
  motion,
  AnimatePresence,
  MotionConfig,
  useMotionTemplate,
  useScroll,
  useTransform,
} from 'motion/react';
import useEmblaCarousel from 'embla-carousel-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { STORYBOARD_SCENES, type StoryboardScene } from '../data/storyboard';
import { soundscape } from '../utils/soundscape';
import AudioWave from './AudioWave';
import TiltPlate from './TiltPlate';
import { BlurFade } from '@/components/ui/blur-fade';
import { EASE_OUT_EXPO, SPRING_PILL, STAGGER } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type ViewMode = 'editorial' | 'documentary' | 'carousel' | 'technical';

interface StoryboardExperienceProps {
  baseUrl: string;
}

interface LightboxMedia {
  jpg: string;
  alt: string;
  label: string;
  subtitle: string;
}

const VIEW_MODES: ReadonlyArray<{ id: ViewMode; label: string }> = [
  { id: 'technical', label: 'Crónica completa' },
  { id: 'editorial', label: 'Recorrido horizontal' },
  { id: 'documentary', label: 'Presentación' },
  { id: 'carousel', label: 'Galería' },
];

const getPhaseLabel = (phase: string) => {
  const stageNumber = phase.match(/Etapa (\d+) de \d+/)?.[1];
  return stageNumber ? `Etapa ${stageNumber}` : phase.split(' · ')[0];
};

export default function StoryboardExperience({ baseUrl }: StoryboardExperienceProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('technical');
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [secondaryActiveMap, setSecondaryActiveMap] = useState<Record<number, boolean>>({});
  const [lightboxMedia, setLightboxMedia] = useState<LightboxMedia | null>(null);

  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [ambientOn, setAmbientOn] = useState(false);
  const [comfortReading, setComfortReading] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);

  const [docPlaying, setDocPlaying] = useState(true);
  const [docProgress, setDocProgress] = useState(0);
  const [horizontalDistance, setHorizontalDistance] = useState(0);

  const editorialListRef = useRef<HTMLDivElement>(null);
  const fieldViewportRef = useRef<HTMLDivElement>(null);
  const fieldTrackRef = useRef<HTMLDivElement>(null);
  const lightboxDialogRef = useRef<HTMLDivElement>(null);
  const lightboxCloseButtonRef = useRef<HTMLButtonElement>(null);
  const lightboxTriggerRef = useRef<HTMLElement | null>(null);

  const openLightbox = useCallback((media: LightboxMedia, trigger?: HTMLElement) => {
    lightboxTriggerRef.current =
      trigger ??
      (document.activeElement instanceof HTMLElement ? document.activeElement : null);
    setLightboxMedia(media);
  }, []);

  const { scrollYProgress: editorialScrollProgress } = useScroll({
    target: editorialListRef,
    offset: ['start start', 'end end'],
  });
  const horizontalOffset = useTransform(
    editorialScrollProgress,
    [0, 1],
    [0, -horizontalDistance]
  );
  const horizontalTransform = useMotionTemplate`translateX(${horizontalOffset}px)`;

  const scrollWithLenis = useCallback(
    (target: number | string | HTMLElement, options?: { offset?: number; immediate?: boolean }) => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) {
        if (typeof target === 'number') {
          window.scrollTo({ top: target + (options?.offset ?? 0), behavior: 'auto' });
        } else {
          const el =
            typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
          el?.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
        return;
      }
      window.dispatchEvent(
        new CustomEvent('uiep:lenis-scroll', {
          detail: { target, offset: options?.offset ?? 0, immediate: Boolean(options?.immediate) },
        })
      );
    },
    []
  );

  const scrollToEditorialScene = useCallback(
    (index: number) => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const behavior = prefersReduced ? 'auto' : 'smooth';

      if (prefersReduced || window.innerHeight <= 640 || window.innerWidth <= 767) {
        const target = fieldTrackRef.current?.children.item(index);
        target?.scrollIntoView({ behavior, block: 'nearest', inline: 'center' });
        return;
      }

      const container = editorialListRef.current;
      if (!container) return;

      const progress = index / (STORYBOARD_SCENES.length - 1);
      const top =
        window.scrollY + container.getBoundingClientRect().top + horizontalDistance * progress;
      scrollWithLenis(top);
    },
    [horizontalDistance, scrollWithLenis]
  );

  useEffect(() => {
    if (viewMode !== 'editorial') {
      setHorizontalDistance(0);
      return;
    }

    const updateDistance = () => {
      const track = fieldTrackRef.current;
      const viewport = fieldViewportRef.current;
      if (!track || !viewport) return;

      const nextDistance = Math.max(0, track.scrollWidth - viewport.clientWidth);
      setHorizontalDistance((current) =>
        current === nextDistance ? current : nextDistance
      );
    };

    updateDistance();
    window.addEventListener('resize', updateDistance);

    const resizeObserver =
      typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateDistance);
    if (resizeObserver && fieldTrackRef.current && fieldViewportRef.current) {
      resizeObserver.observe(fieldTrackRef.current);
      resizeObserver.observe(fieldViewportRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateDistance);
      resizeObserver?.disconnect();
    };
  }, [viewMode]);

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

  // Parallax fotográfico discreto en la crónica completa
  useGSAP(
    () => {
      if (viewMode !== 'technical') return;
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;

      const images = gsap.utils.toArray<HTMLElement>('.gsap-parallax-img');
      images.forEach((img) => {
        gsap.fromTo(
          img,
          { scale: 1.05, yPercent: -1.5 },
          {
            scale: 1.0,
            yPercent: 1.5,
            ease: 'none',
            scrollTrigger: {
              trigger: img.parentElement,
              start: 'top 85%',
              end: 'bottom 25%',
              scrub: 0.4,
            },
          }
        );
      });
    },
    { dependencies: [viewMode], scope: editorialListRef }
  );

  const carouselStartRef = useRef(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'center',
    skipSnaps: false,
    startIndex: carouselStartRef.current,
  });

  const onEmblaSelect = useCallback(() => {
    if (!emblaApi || viewMode !== 'carousel') return;
    const snap = emblaApi.selectedScrollSnap();
    setActiveSceneIndex(snap);
    if (ambientOn) soundscape.playHarmonicNote(snap);
  }, [emblaApi, viewMode, ambientOn]);

  useEffect(() => {
    if (!emblaApi || viewMode !== 'carousel') return;
    emblaApi.scrollTo(carouselStartRef.current, true);
    onEmblaSelect();
    emblaApi.on('select', onEmblaSelect);
    emblaApi.on('reInit', onEmblaSelect);
    return () => {
      emblaApi.off('select', onEmblaSelect);
      emblaApi.off('reInit', onEmblaSelect);
    };
  }, [emblaApi, viewMode, onEmblaSelect]);

  useEffect(() => {
    const gotoHandler = (e: Event) => {
      const custom = e as CustomEvent<{ sceneNumber: number }>;
      const idx = (custom.detail?.sceneNumber ?? 1) - 1;
      if (idx >= 0 && idx < STORYBOARD_SCENES.length) {
        if (viewMode === 'carousel' || viewMode === 'documentary') {
          carouselStartRef.current = idx;
          setActiveSceneIndex(idx);
          emblaApi?.scrollTo(idx);
          scrollWithLenis('#relato-interactivo', { offset: -8 });
        } else if (viewMode === 'editorial') {
          scrollToEditorialScene(idx);
        } else {
          scrollWithLenis(`#escena-${idx + 1}`, { offset: -84 });
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
      if (custom.detail) openLightbox(custom.detail);
    };

    window.addEventListener('uiep:goto-scene', gotoHandler);
    window.addEventListener('uiep:open-photo', lightboxHandler);
    return () => {
      window.removeEventListener('uiep:goto-scene', gotoHandler);
      window.removeEventListener('uiep:open-photo', lightboxHandler);
    };
  }, [viewMode, emblaApi, openLightbox, scrollToEditorialScene, scrollWithLenis]);

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
      {
        root: viewMode === 'editorial' ? fieldViewportRef.current : null,
        rootMargin:
          viewMode === 'editorial'
            ? '0px -42% 0px -42%'
            : '-28% 0px -52% 0px',
        threshold: 0.1,
      }
    );

    document.querySelectorAll('[data-scene-card]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [viewMode]);

  useEffect(() => {
    const onKeyDown = (e: globalThis.KeyboardEvent) => {
      if (lightboxMedia) {
        if (e.key === 'Escape') setLightboxMedia(null);
        if (e.key === 'Tab') {
          const dialog = lightboxDialogRef.current;
          const focusable = dialog?.querySelectorAll<HTMLElement>(
            'button:not(:disabled), [href], [tabindex]:not([tabindex="-1"])'
          );
          if (!dialog || !focusable?.length) {
            e.preventDefault();
            return;
          }

          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          const active = document.activeElement;
          if (e.shiftKey && (active === first || !dialog.contains(active))) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && (active === last || !dialog.contains(active))) {
            e.preventDefault();
            first.focus();
          }
        }
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
    if (!lightboxMedia) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    lightboxCloseButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      if (lightboxTriggerRef.current?.isConnected) lightboxTriggerRef.current.focus();
    };
  }, [lightboxMedia]);

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
    return `Paso ${scene.number}: ${scene.title}. ${scene.howDescription}`;
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
    setControlsOpen(false);
    if (ambientOn) soundscape.playHarmonicNote(index);

    if (viewMode === 'carousel' && emblaApi) {
      emblaApi.scrollTo(index);
      return;
    }
    if (viewMode === 'documentary') {
      setDocProgress(0);
      return;
    }
    if (viewMode === 'editorial') {
      scrollToEditorialScene(index);
      return;
    }
    const target = document.getElementById(`escena-${index + 1}`);
    if (target) {
      scrollWithLenis(target, { offset: -84 });
    }
  };

  const handleModeSwitch = (mode: ViewMode) => {
    stopSpeech();
    setControlsOpen(false);
    carouselStartRef.current = activeSceneIndex;
    setViewMode(mode);

    if (mode === 'editorial') {
      setActiveSceneIndex(0);
      requestAnimationFrame(() => scrollToEditorialScene(0));
    } else {
      if (mode === 'documentary') {
        setDocPlaying(true);
        setDocProgress(0);
      }
      requestAnimationFrame(() => {
        const section = document.getElementById('relato-interactivo');
        if (section && section.getBoundingClientRect().top < -24) {
          scrollWithLenis(section, { offset: -8, immediate: true });
        }
        ScrollTrigger.refresh();
      });
    }
    if (ambientOn) soundscape.playHarmonicNote(activeSceneIndex);
  };

  useEffect(() => {
    const exploreFullStory = () => {
      stopSpeech();
      setViewMode('technical');
      setActiveSceneIndex(0);
      setControlsOpen(false);
    };

    window.addEventListener('storyboard:explore', exploreFullStory);
    return () => window.removeEventListener('storyboard:explore', exploreFullStory);
  }, [stopSpeech]);

  const openScenePhoto = (
    scene: StoryboardScene,
    useSecondary = false,
    trigger?: HTMLElement
  ) => {
    const media = useSecondary && scene.secondaryPhoto ? scene.secondaryPhoto : null;
    openLightbox(
      {
        jpg: `${baseUrl}${media ? media.jpg : scene.imageJpg}`,
        alt: media ? media.alt : scene.imageAlt,
        label: `Paso ${scene.numeral} · ${scene.locationTag}`,
        subtitle: `${scene.whatLines[0]} ${scene.whatLines[1]}`,
      },
      trigger
    );
  };

  const currentScene = STORYBOARD_SCENES[activeSceneIndex] ?? STORYBOARD_SCENES[0];

  const handleViewModeKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const tabs = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]')
    );
    const currentIndex = tabs.findIndex((tab) => tab === document.activeElement);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;
    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = tabs.length - 1;
    else return;

    event.preventDefault();
    tabs[nextIndex].focus();
    tabs[nextIndex].click();
  };

  return (
    <MotionConfig reducedMotion="user">
      <section id="relato-interactivo" className="relative pb-20 scroll-mt-4">
        {/* ENCABEZADO EDITORIAL DIRECTO (sin trucos de palabras en cursiva bicolor ni cuadrículas) */}
        {viewMode !== 'editorial' && (
          <header className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-6 sm:pb-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl space-y-1.5">
                <BlurFade inView delay={0}>
                  <p className="text-sm font-semibold text-terracotta">
                    Paso a paso en San José Buenavista
                  </p>
                </BlurFade>
                <BlurFade inView delay={STAGGER}>
                  <h2 className="font-serif text-3xl sm:text-5xl font-bold text-ink leading-[1.06] tracking-[-0.01em] [text-wrap:balance]">
                    Así trabajamos junto con la comunidad
                  </h2>
                </BlurFade>
              </div>
              <BlurFade inView delay={STAGGER * 2}>
                <p className="text-sm sm:text-base text-ink-muted max-w-sm leading-relaxed">
                  Conoce en ocho pasos los recorridos, pláticas y propuestas realizadas con vecinas,
                  vecinos y autoridades.
                </p>
              </BlurFade>
            </div>
          </header>
        )}

        {/* CINTA EDITORIAL DE NAVEGACIÓN (líneas limpias sobre papel, sin píldoras tipo app) */}
        <div className="sticky top-0 z-40 border-y border-earth/25 bg-cream/95 backdrop-blur-md mb-6 sm:mb-10 no-print">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-3 min-h-12">
              {/* Indicador de paso actual */}
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-xs sm:text-sm font-bold text-terracotta tabular-nums shrink-0">
                  {currentScene.numeral}/{String(STORYBOARD_SCENES.length).padStart(2, '0')}
                </span>
                <span className="h-3.5 w-px bg-earth/25 shrink-0" aria-hidden="true" />
                <span className="truncate text-xs sm:text-sm font-medium text-ink-soft">
                  <span className="md:hidden">
                    {VIEW_MODES.find((m) => m.id === viewMode)?.label}
                  </span>
                  <span className="hidden md:inline">{getPhaseLabel(currentScene.phase)}</span>
                </span>
              </div>

              {/* Pestañas con subrayado editorial en pantallas medianas y grandes */}
              <div
                className="hidden md:flex items-center gap-1 self-stretch"
                role="tablist"
                aria-label="Modo de lectura"
                onKeyDown={handleViewModeKeyDown}
              >
                {VIEW_MODES.map((tab) => {
                  const active = viewMode === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      id={`story-view-tab-${tab.id}`}
                      aria-controls="story-view-panel"
                      aria-selected={active}
                      tabIndex={active ? 0 : -1}
                      onClick={() => handleModeSwitch(tab.id)}
                      className={`relative px-3.5 py-3 text-sm transition-colors cursor-pointer ${
                        active
                          ? 'font-bold text-forest'
                          : 'font-medium text-ink-muted hover:text-ink'
                      }`}
                    >
                      <span>{tab.label}</span>
                      {active && (
                        <motion.span
                          layoutId="activeViewModeLineDesktop"
                          transition={SPRING_PILL}
                          className="absolute inset-x-2 -bottom-px h-[2.5px] bg-forest"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Controles discretos: voz y menú de lectura */}
              <div className="flex items-center gap-2 shrink-0 py-1.5">
                <button
                  type="button"
                  onClick={toggleSpeakAll}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs sm:text-sm font-semibold border transition-colors cursor-pointer ${
                    isPlayingAll
                      ? 'bg-terracotta text-cream border-terracotta'
                      : 'bg-cream-soft text-ink border-earth/25 hover:border-forest/60'
                  }`}
                >
                  <AudioWave active={isPlayingAll} light={isPlayingAll} />
                  <span className="hidden sm:inline">
                    {isPlayingAll ? 'Detener audio' : 'Escuchar todo'}
                  </span>
                  <span className="sr-only sm:hidden">
                    {isPlayingAll ? 'Detener audio' : 'Escuchar todo'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setControlsOpen((open) => !open)}
                  aria-label={
                    controlsOpen ? 'Cerrar opciones de lectura' : 'Abrir opciones de lectura'
                  }
                  aria-expanded={controlsOpen}
                  aria-controls="mobile-story-controls"
                  className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest ${
                    controlsOpen
                      ? 'border-forest bg-forest text-cream'
                      : 'border-earth/25 bg-cream-soft text-ink-soft hover:text-forest'
                  }`}
                >
                  <span className="md:hidden">Vistas y letra</span>
                  <span className="hidden md:inline">Opciones</span>
                </button>
              </div>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {controlsOpen && (
              <motion.div
                key="story-controls"
                id="mobile-story-controls"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.24, ease: EASE_OUT_EXPO }}
                className="overflow-hidden border-t border-earth/20 bg-cream-soft"
              >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-3">
                  {/* Selector de vistas en móvil */}
                  <div
                    className="grid grid-cols-2 gap-1.5 md:hidden"
                    role="tablist"
                    aria-label="Modo de lectura"
                    onKeyDown={handleViewModeKeyDown}
                  >
                    {VIEW_MODES.map((tab) => {
                      const active = viewMode === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          role="tab"
                          aria-controls="story-view-panel"
                          aria-selected={active}
                          tabIndex={active ? 0 : -1}
                          onClick={() => handleModeSwitch(tab.id)}
                          className={`px-3 py-2 text-xs font-semibold rounded-md border text-left transition-colors cursor-pointer ${
                            active
                              ? 'bg-forest text-cream border-forest'
                              : 'bg-cream text-ink-soft border-earth/20 hover:text-ink'
                          }`}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={toggleComfortReading}
                        aria-pressed={comfortReading}
                        className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs sm:text-sm font-medium border transition-colors cursor-pointer ${
                          comfortReading
                            ? 'bg-peach/70 text-ink border-earth/50 font-semibold'
                            : 'bg-cream text-ink-soft border-earth/25 hover:text-ink'
                        }`}
                      >
                        {comfortReading ? 'Letra normal' : 'Letra más grande'}
                      </button>

                      <button
                        type="button"
                        onClick={handleToggleAmbient}
                        aria-pressed={ambientOn}
                        className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs sm:text-sm font-medium border transition-colors cursor-pointer ${
                          ambientOn
                            ? 'bg-olive-pale text-forest border-olive font-semibold'
                            : 'bg-cream text-ink-soft border-earth/25 hover:text-ink'
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            ambientOn ? 'bg-forest' : 'bg-earth/40'
                          }`}
                          aria-hidden="true"
                        />
                        <span>Sonido suave de fondo</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="hidden lg:inline-flex items-center rounded-md bg-cream px-3 py-1.5 text-xs sm:text-sm font-medium text-ink-soft border border-earth/25 hover:text-ink transition-colors cursor-pointer"
                    >
                      Imprimir o guardar PDF
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-earth/15">
                    <span className="text-xs text-ink-muted mr-1 shrink-0">Ir al paso:</span>
                    {STORYBOARD_SCENES.map((scene, idx) => {
                      const isCurrent = activeSceneIndex === idx;
                      return (
                        <button
                          key={scene.number}
                          type="button"
                          onClick={() => jumpToScene(idx)}
                          className={`shrink-0 px-2.5 py-1 rounded text-xs tabular-nums transition-colors cursor-pointer ${
                            isCurrent
                              ? 'bg-forest text-cream font-semibold'
                              : 'bg-cream text-ink-soft border border-earth/20 hover:text-ink'
                          }`}
                        >
                          <span>Paso {scene.numeral}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* CONTENIDO PRINCIPAL */}
        <div
          id="story-view-panel"
          role="tabpanel"
          aria-labelledby={`story-view-tab-${viewMode}`}
          tabIndex={0}
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          {viewMode === 'documentary' ? (
            /* ----------------------------------------------------------------
               PRESENTACIÓN AUTOMÁTICA CON FOTOGRAFÍAS REALES
               ---------------------------------------------------------------- */
            <motion.div
              key="documentary-mode"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
              className="space-y-5"
            >
              <div className="relative rounded-card overflow-hidden bg-ink border border-earth/35 shadow-card">
                <div className="absolute top-0 left-0 right-0 z-20 p-3.5 sm:p-5 bg-gradient-to-b from-ink/85 to-transparent">
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
                          aria-label={`Ir al paso ${s.number} de ${STORYBOARD_SCENES.length}: ${s.title}`}
                          className="h-1 bg-cream/25 overflow-hidden cursor-pointer"
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
                    <span className="text-xs sm:text-sm font-medium text-cream/90">
                      {currentScene.locationTag}
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="text-xs tabular-nums text-cream/70">
                        {currentScene.numeral}/{String(STORYBOARD_SCENES.length).padStart(2, '0')}
                      </span>
                      <button
                        type="button"
                        onClick={() => speakSingleScene(activeSceneIndex)}
                        className="rounded bg-ink/60 backdrop-blur-xs border border-cream/30 px-3 py-1 text-xs font-semibold text-cream hover:bg-ink/80 transition-colors cursor-pointer"
                      >
                        {speakingIndex === activeSceneIndex ? 'Silenciar' : 'Narrar'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDocPlaying((p) => !p)}
                        className="rounded bg-peach text-ink px-3.5 py-1 text-xs font-semibold hover:bg-peach-pale transition-colors cursor-pointer"
                      >
                        {docPlaying ? 'Pausar' : 'Reanudar'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <div className="relative aspect-[4/3] sm:aspect-video w-full overflow-hidden bg-ink">
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={currentScene.number}
                        src={`${baseUrl}${currentScene.imageJpg}`}
                        alt={currentScene.imageAlt}
                        style={{ objectPosition: currentScene.objectPosition }}
                        initial={{ opacity: 0.3 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0.3 }}
                        transition={{ duration: 0.55 }}
                        className={`w-full h-full object-cover ${
                          docPlaying ? 'ken-burns-active' : ''
                        }`}
                      />
                    </AnimatePresence>
                  </div>

                  <div className="relative border-t border-cream/15 bg-ink px-5 py-4 sm:border-t-0 sm:bg-transparent sm:absolute sm:inset-x-0 sm:bottom-0 sm:z-20 sm:bg-gradient-to-t sm:from-ink/95 sm:via-ink/65 sm:to-transparent sm:px-8 sm:pb-7 sm:pt-20">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentScene.number}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.3 }}
                        className="max-w-3xl space-y-1.5"
                      >
                        <p className="text-xs font-semibold text-peach">
                          Paso {currentScene.numeral} · {getPhaseLabel(currentScene.phase)}
                        </p>
                        <h3 className="font-serif text-xl sm:text-3xl font-bold text-cream leading-snug">
                          {currentScene.title}
                        </h3>
                        <p className="text-sm sm:text-base text-cream/88 leading-relaxed max-w-2xl">
                          {currentScene.whatLines[0]} {currentScene.whatLines[1]}
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
                  className="rounded-md bg-cream-soft border border-earth/30 px-4 py-2 text-xs sm:text-sm font-semibold text-ink disabled:opacity-35 hover:bg-cream-deep/60 transition-colors cursor-pointer"
                >
                  ← Paso anterior
                </button>

                <button
                  type="button"
                  onClick={(event) => openScenePhoto(currentScene, false, event.currentTarget)}
                  className="text-xs sm:text-sm font-semibold text-forest underline underline-offset-4 cursor-pointer"
                >
                  Ampliar fotografía
                </button>

                <button
                  type="button"
                  disabled={activeSceneIndex === STORYBOARD_SCENES.length - 1}
                  onClick={() => {
                    setActiveSceneIndex((p) => Math.min(STORYBOARD_SCENES.length - 1, p + 1));
                    setDocProgress(0);
                  }}
                  className="rounded-md bg-forest px-4 py-2 text-xs sm:text-sm font-semibold text-cream disabled:opacity-35 hover:bg-forest-dark transition-colors cursor-pointer"
                >
                  Siguiente paso →
                </button>
              </div>
            </motion.div>
          ) : viewMode === 'carousel' ? (
            /* ----------------------------------------------------------------
               GALERÍA DESLIZABLE CON PIES DE FOTO LIMPIOS (sin etiquetas sobre la imagen)
               ---------------------------------------------------------------- */
            <motion.div
              key="carousel-view"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="space-y-5"
            >
              <div
                className="overflow-hidden rounded-card border border-earth/30 bg-cream-soft shadow-card"
                ref={emblaRef}
              >
                <div className="flex touch-pan-y">
                  {STORYBOARD_SCENES.map((scene) => {
                    const showSecondarySlide = Boolean(
                      secondaryActiveMap[scene.number] && scene.secondaryPhoto
                    );
                    const slideWebp =
                      showSecondarySlide && scene.secondaryPhoto
                        ? scene.secondaryPhoto.webp
                        : scene.imageWebp;
                    const slideJpg =
                      showSecondarySlide && scene.secondaryPhoto
                        ? scene.secondaryPhoto.jpg
                        : scene.imageJpg;
                    const slideAlt =
                      showSecondarySlide && scene.secondaryPhoto
                        ? scene.secondaryPhoto.alt
                        : scene.imageAlt;
                    const slidePos =
                      showSecondarySlide && scene.secondaryPhoto
                        ? scene.secondaryPhoto.objectPosition
                        : scene.objectPosition;

                    return (
                      <div key={scene.number} className="flex-[0_0_100%] min-w-0 select-none">
                        <button
                          type="button"
                          onClick={(event) =>
                            openScenePhoto(scene, showSecondarySlide, event.currentTarget)
                          }
                          aria-label={`Ampliar fotografía del paso ${scene.numeral}: ${slideAlt}`}
                          className="block w-full cursor-zoom-in overflow-hidden bg-cream-deep p-0 text-left aspect-[4/3] sm:aspect-video focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-cream"
                        >
                          <picture>
                            <source srcSet={`${baseUrl}${slideWebp}`} type="image/webp" />
                            <img
                              src={`${baseUrl}${slideJpg}`}
                              alt={slideAlt}
                              style={{ objectPosition: slidePos }}
                              className="w-full h-full object-cover"
                            />
                          </picture>
                        </button>
                        <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-t border-earth/20 bg-cream-soft text-xs text-ink-muted">
                          <span>
                            <strong className="font-semibold text-ink">{scene.locationTag}</strong>{' '}
                            · Paso {scene.numeral} de {String(STORYBOARD_SCENES.length).padStart(2, '0')}
                          </span>
                          <span className="text-forest font-semibold underline underline-offset-2">
                            Toca la imagen para ampliar
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => emblaApi?.scrollPrev()}
                  disabled={activeSceneIndex === 0}
                  className="rounded-md bg-cream-soft border border-earth/30 px-4 py-2 text-xs sm:text-sm font-semibold text-ink disabled:opacity-35 hover:bg-cream-deep/60 transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  ← Anterior
                </button>

                <span className="text-xs sm:text-sm text-ink-muted">
                  Desliza hacia los lados
                </span>

                <button
                  type="button"
                  onClick={() => emblaApi?.scrollNext()}
                  disabled={activeSceneIndex === STORYBOARD_SCENES.length - 1}
                  className="rounded-md bg-forest px-4 py-2 text-xs sm:text-sm font-semibold text-cream disabled:opacity-35 hover:bg-forest-dark transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                  Siguiente →
                </button>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentScene.number}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="border-t border-earth/25 pt-5 space-y-3.5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-terracotta">
                        Paso {currentScene.numeral} · {currentScene.phase}
                      </p>
                      <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ink leading-snug">
                        {currentScene.title}
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() => speakSingleScene(activeSceneIndex)}
                      className="inline-flex items-center gap-2 rounded-md bg-cream-soft border border-earth/25 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-forest hover:border-forest/60 transition-colors cursor-pointer"
                    >
                      <AudioWave active={speakingIndex === activeSceneIndex} />
                      <span>
                        {speakingIndex === activeSceneIndex ? 'Detener audio' : 'Escuchar paso'}
                      </span>
                    </button>
                  </div>

                  <p className="text-base text-ink-soft leading-relaxed max-w-3xl">
                    {currentScene.howDescription}
                  </p>

                  {currentScene.secondaryPhoto && (
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs sm:text-sm">
                      <span className="text-ink-muted">Dos fotografías en este paso:</span>
                      <button
                        type="button"
                        aria-pressed={!secondaryActiveMap[currentScene.number]}
                        onClick={() =>
                          setSecondaryActiveMap((m) => ({ ...m, [currentScene.number]: false }))
                        }
                        className={`px-2.5 py-1 rounded border font-semibold transition-colors cursor-pointer ${
                          !secondaryActiveMap[currentScene.number]
                            ? 'bg-forest text-cream border-forest'
                            : 'bg-cream-soft text-ink-soft border-earth/25 hover:text-ink'
                        }`}
                      >
                        1. {currentScene.secondaryPhoto.primaryLabel}
                      </button>
                      <button
                        type="button"
                        aria-pressed={Boolean(secondaryActiveMap[currentScene.number])}
                        onClick={() =>
                          setSecondaryActiveMap((m) => ({ ...m, [currentScene.number]: true }))
                        }
                        className={`px-2.5 py-1 rounded border font-semibold transition-colors cursor-pointer ${
                          secondaryActiveMap[currentScene.number]
                            ? 'bg-forest text-cream border-forest'
                            : 'bg-cream-soft text-ink-soft border-earth/25 hover:text-ink'
                        }`}
                      >
                        2. {currentScene.secondaryPhoto.label}
                      </button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          ) : (
            /* ----------------------------------------------------------------
               CRÓNICA COMPLETA SOBRE PAPEL / RECORRIDO HORIZONTAL
               ---------------------------------------------------------------- */
            <div
              ref={editorialListRef}
              className={viewMode === 'editorial' ? 'field-scroll-container relative' : 'relative'}
              style={
                viewMode === 'editorial'
                  ? { height: `calc(100svh + ${horizontalDistance}px)` }
                  : undefined
              }
            >
              <div
                className={
                  viewMode === 'editorial' ? 'field-scroll-sticky relative z-10' : 'relative z-10'
                }
              >
                {viewMode === 'editorial' && (
                  <div className="field-scroll-heading">
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-terracotta">
                        Paso a paso
                      </p>
                      <h2 className="mt-0.5 font-serif text-2xl font-bold leading-tight text-ink sm:text-3xl">
                        Así trabajamos junto con la comunidad
                      </h2>
                    </div>
                    <p className="hidden max-w-xs text-right text-sm leading-relaxed text-ink-muted sm:block">
                      Conoce los ocho pasos del trabajo realizado.
                    </p>
                  </div>
                )}

                <div
                  ref={fieldViewportRef}
                  className={viewMode === 'editorial' ? 'field-scroll-viewport' : 'contents'}
                  role={viewMode === 'editorial' ? 'region' : undefined}
                  aria-label={
                    viewMode === 'editorial'
                      ? 'Recorrido horizontal de ocho pasos. Usa las flechas izquierda y derecha.'
                      : undefined
                  }
                  tabIndex={viewMode === 'editorial' ? 0 : undefined}
                  onKeyDown={(event) => {
                    if (event.target !== event.currentTarget) return;
                    if (
                      event.key === 'ArrowRight' &&
                      activeSceneIndex < STORYBOARD_SCENES.length - 1
                    ) {
                      event.preventDefault();
                      jumpToScene(activeSceneIndex + 1);
                    } else if (event.key === 'ArrowLeft' && activeSceneIndex > 0) {
                      event.preventDefault();
                      jumpToScene(activeSceneIndex - 1);
                    }
                  }}
                  onFocusCapture={(event) => {
                    const card = (event.target as HTMLElement).closest<HTMLElement>(
                      '[data-scene-index]'
                    );
                    const index = Number(card?.dataset.sceneIndex);
                    if (card && Number.isInteger(index)) {
                      setActiveSceneIndex(index);
                      scrollToEditorialScene(index);
                    }
                  }}
                >
                  <motion.div
                    ref={fieldTrackRef}
                    style={
                      viewMode === 'editorial' ? { transform: horizontalTransform } : undefined
                    }
                    className={
                      viewMode === 'editorial'
                        ? 'field-scroll-track'
                        : 'divide-y divide-earth/25 relative z-10'
                    }
                  >
                    {STORYBOARD_SCENES.map((scene, index) => {
                      const isEditorial = viewMode === 'editorial';
                      const isReversed = index % 2 === 1 && viewMode === 'technical';
                      const showSecondary = Boolean(
                        secondaryActiveMap[scene.number] && scene.secondaryPhoto
                      );
                      const activeWebp =
                        showSecondary && scene.secondaryPhoto
                          ? scene.secondaryPhoto.webp
                          : scene.imageWebp;
                      const activeJpg =
                        showSecondary && scene.secondaryPhoto
                          ? scene.secondaryPhoto.jpg
                          : scene.imageJpg;
                      const activeAlt =
                        showSecondary && scene.secondaryPhoto
                          ? scene.secondaryPhoto.alt
                          : scene.imageAlt;
                      const activePos =
                        showSecondary && scene.secondaryPhoto
                          ? scene.secondaryPhoto.objectPosition
                          : scene.objectPosition;

                      const isSpeakingThis = speakingIndex === index;

                      return (
                        <div
                          key={scene.number}
                          className={`relative print-scene-break ${
                            isEditorial ? 'field-scroll-item' : 'py-10 sm:py-14 first:pt-2'
                          }`}
                        >
                          <motion.article
                            id={`escena-${scene.number}`}
                            data-scene-card
                            data-scene-index={index}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-60px' }}
                            transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
                            className={
                              isEditorial
                                ? 'rounded-card bg-cream-soft border border-earth/25 shadow-card p-4 sm:p-6'
                                : 'scroll-mt-8 sm:scroll-mt-28'
                            }
                          >
                            <div
                              className={
                                isEditorial
                                  ? 'grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-7 items-center'
                                  : 'grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center'
                              }
                            >
                              {/* Fotografía limpia de extremo a extremo + pie de foto impreso debajo */}
                              <figure
                                className={`space-y-2 ${
                                  isEditorial
                                    ? 'md:col-span-6'
                                    : `lg:col-span-6 ${isReversed ? 'lg:order-2' : 'lg:order-1'}`
                                }`}
                              >
                                <TiltPlate
                                  maxTilt={2.2}
                                  onClick={(trigger) =>
                                    openScenePhoto(scene, showSecondary, trigger)
                                  }
                                  ariaLabel={`Ampliar fotografía del paso ${scene.number}: ${scene.title}`}
                                  className="group overflow-hidden rounded-inner border border-earth/25 bg-cream-deep cursor-zoom-in shadow-xs"
                                >
                                  <div className="overflow-hidden aspect-[4/3]">
                                    <picture className="block h-full w-full transition-transform duration-500 ease-out-expo group-hover:scale-[1.025]">
                                      <source
                                        srcSet={`${baseUrl}${activeWebp}`}
                                        type="image/webp"
                                      />
                                      <img
                                        src={`${baseUrl}${activeJpg}`}
                                        alt={activeAlt}
                                        loading={index === 0 ? 'eager' : 'lazy'}
                                        style={{ objectPosition: activePos }}
                                        className="gsap-parallax-img w-full h-full object-cover will-change-transform"
                                      />
                                    </picture>
                                  </div>
                                </TiltPlate>

                                <figcaption className="flex flex-wrap items-center justify-between gap-2 text-xs text-ink-muted">
                                  <span>
                                    <strong className="font-semibold text-ink-soft">
                                      {scene.locationTag}
                                    </strong>{' '}
                                    · Foto {scene.numeral} de{' '}
                                    {String(STORYBOARD_SCENES.length).padStart(2, '0')}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={(e) =>
                                      openScenePhoto(scene, showSecondary, e.currentTarget)
                                    }
                                    className="font-semibold text-forest underline underline-offset-2 hover:text-forest-dark cursor-pointer no-print"
                                  >
                                    Ampliar imagen
                                  </button>
                                </figcaption>

                                {scene.secondaryPhoto && (
                                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5 no-print">
                                    <span className="text-xs text-ink-muted mr-1">Ver foto:</span>
                                    <button
                                      type="button"
                                      aria-pressed={!showSecondary}
                                      onClick={() =>
                                        setSecondaryActiveMap((m) => ({
                                          ...m,
                                          [scene.number]: false,
                                        }))
                                      }
                                      className={`px-2.5 py-0.5 rounded border text-xs font-semibold transition-colors cursor-pointer ${
                                        !showSecondary
                                          ? 'bg-forest text-cream border-forest'
                                          : 'bg-cream-soft text-ink-soft border-earth/25 hover:text-ink'
                                      }`}
                                    >
                                      1. {scene.secondaryPhoto.primaryLabel}
                                    </button>
                                    <button
                                      type="button"
                                      aria-pressed={showSecondary}
                                      onClick={() =>
                                        setSecondaryActiveMap((m) => ({
                                          ...m,
                                          [scene.number]: true,
                                        }))
                                      }
                                      className={`px-2.5 py-0.5 rounded border text-xs font-semibold transition-colors cursor-pointer ${
                                        showSecondary
                                          ? 'bg-forest text-cream border-forest'
                                          : 'bg-cream-soft text-ink-soft border-earth/25 hover:text-ink'
                                      }`}
                                    >
                                      2. {scene.secondaryPhoto.label}
                                    </button>
                                  </div>
                                )}
                              </figure>

                              {/* Columna de crónica editorial: número, etapa, relato humano y continuidad */}
                              <div
                                className={`space-y-3.5 ${
                                  isEditorial
                                    ? 'md:col-span-6'
                                    : `lg:col-span-6 ${isReversed ? 'lg:order-1' : 'lg:order-2'}`
                                }`}
                              >
                                <div className="flex items-baseline justify-between gap-3 border-b border-earth/20 pb-2.5">
                                  <div className="flex items-baseline gap-2.5">
                                    <span className="font-serif text-2xl sm:text-3xl font-bold text-terracotta tabular-nums leading-none">
                                      {scene.numeral}.
                                    </span>
                                    <span className="text-xs sm:text-sm font-semibold text-forest">
                                      {scene.phase}
                                    </span>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => speakSingleScene(index)}
                                    className={`no-print inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-semibold border transition-colors cursor-pointer shrink-0 ${
                                      isSpeakingThis
                                        ? 'bg-forest text-cream border-forest'
                                        : 'bg-cream-soft text-forest border-earth/25 hover:border-forest/60'
                                    }`}
                                  >
                                    <AudioWave active={isSpeakingThis} light={isSpeakingThis} />
                                    <span>{isSpeakingThis ? 'Detener' : 'Escuchar'}</span>
                                  </button>
                                </div>

                                <h3
                                  className={`font-serif font-bold leading-snug text-ink [text-wrap:balance] ${
                                    isEditorial ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl'
                                  }`}
                                >
                                  {scene.title}
                                </h3>

                                {!isEditorial && (
                                  <p className="text-base sm:text-lg font-medium text-ink leading-relaxed">
                                    {scene.whatLines[0]} {scene.whatLines[1]}
                                  </p>
                                )}

                                <p className="text-sm sm:text-base text-ink-soft leading-relaxed">
                                  {scene.howDescription}
                                </p>

                                {!isEditorial && (
                                  <p className="pt-2 text-sm italic text-ink-muted">
                                    {scene.transitionNote}
                                  </p>
                                )}
                              </div>
                            </div>
                          </motion.article>
                        </div>
                      );
                    })}
                  </motion.div>
                </div>

                {viewMode === 'editorial' && (
                  <div className="field-scroll-footer" aria-hidden="true">
                    <span className="text-xs font-bold tabular-nums text-forest">
                      Paso {currentScene.numeral} de{' '}
                      {String(STORYBOARD_SCENES.length).padStart(2, '0')}
                    </span>
                    <span className="field-scroll-scroll-hint text-xs text-ink-muted">
                      Desplázate hacia abajo para avanzar →
                    </span>
                    <span className="field-scroll-swipe-hint text-xs text-ink-muted">
                      Desliza hacia los lados →
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* INSPECTOR DE FOTOGRAFÍA COMPLETA CON ZOOM Y PANEO */}
        <AnimatePresence>
          {lightboxMedia && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.18 } }}
              transition={{ duration: 0.22 }}
              onClick={() => setLightboxMedia(null)}
              className="fixed inset-0 z-50 bg-ink/92 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 no-print"
              role="dialog"
              aria-modal="true"
              aria-labelledby="lightbox-title"
              aria-describedby="lightbox-description"
            >
              <motion.div
                initial={{ scale: 0.96, opacity: 0, y: 10 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{
                  scale: 0.97,
                  opacity: 0,
                  y: 8,
                  transition: { duration: 0.18, ease: EASE_OUT_EXPO },
                }}
                transition={{ type: 'spring', stiffness: 340, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
                ref={lightboxDialogRef}
                className="max-w-5xl w-full rounded-card bg-cream-soft border border-earth/35 overflow-hidden shadow-2xl"
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
                      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-earth/20">
                        <span
                          id="lightbox-title"
                          className="text-xs sm:text-sm font-bold text-forest truncate"
                        >
                          {lightboxMedia.label}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => zoomOut()}
                            className="rounded bg-cream border border-earth/25 px-3 py-1 text-xs font-semibold text-ink hover:bg-cream-deep/60 cursor-pointer"
                          >
                            Alejar −
                          </button>
                          <button
                            type="button"
                            onClick={() => resetTransform()}
                            className="rounded bg-cream border border-earth/25 px-3 py-1 text-xs tabular-nums text-ink-soft hover:text-ink cursor-pointer"
                          >
                            100%
                          </button>
                          <button
                            type="button"
                            onClick={() => zoomIn()}
                            className="rounded bg-cream border border-earth/25 px-3 py-1 text-xs font-semibold text-ink hover:bg-cream-deep/60 cursor-pointer"
                          >
                            Acercar +
                          </button>
                          <button
                            type="button"
                            onClick={() => setLightboxMedia(null)}
                            ref={lightboxCloseButtonRef}
                            className="rounded bg-forest px-3.5 py-1 text-xs font-semibold text-cream hover:bg-forest-dark ml-1 cursor-pointer"
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

                      <div className="px-5 py-3 bg-cream-soft border-t border-earth/20 text-center">
                        <p id="lightbox-description" className="text-sm sm:text-base text-ink-soft">
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
    </MotionConfig>
  );
}
