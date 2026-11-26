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
import { EASE_OUT_EXPO, STAGGER } from '@/lib/motion';

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

const VIEW_MODES: ReadonlyArray<{ id: ViewMode; label: string }> = [
  { id: 'technical', label: 'Ficha Completa' },
  { id: 'editorial', label: 'Recorrido en campo' },
  { id: 'documentary', label: 'Modo Documental' },
  { id: 'carousel', label: 'Carrusel Táctil' },
];

const getPhaseLabel = (phase: string) => {
  const stageNumber = phase.match(/Etapa (\d+) de \d+/)?.[1];
  return stageNumber ? `Etapa ${stageNumber}` : phase.split(' · ')[0];
};

export default function StoryboardExperience({ baseUrl }: StoryboardExperienceProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('technical');
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  // Permite alternar entre las dos fotografías de algunas tarjetas
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

  // GSAP ScrollTrigger: parallax suave sobre fotografías reales e hilo conductor central
  useGSAP(
    () => {
      if (viewMode !== 'technical') return;
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;

      const images = gsap.utils.toArray<HTMLElement>('.gsap-parallax-img');
      images.forEach((img) => {
        gsap.fromTo(
          img,
          // Sin desenfoque: en fotografías documentales el blur se percibe como "carga fallida"
          { scale: 1.1, yPercent: -3, opacity: 0.88 },
          {
            scale: 1.02,
            yPercent: 2,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: img.parentElement,
              start: 'top 82%',
              end: 'center 44%',
              scrub: 0.5,
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>('.gsap-story-copy').forEach((copy) => {
        const card = copy.closest<HTMLElement>('[data-scene-card]');
        if (!card) return;

        gsap.fromTo(
          copy,
          { y: 28, opacity: 0.78 },
          {
            y: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top 86%',
              end: 'top 42%',
              scrub: 0.45,
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

  // Escuchar eventos desde el Mapa Territorial o el Archivo Fotográfico
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
    const onKeyDown = (e: KeyboardEvent) => {
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
    return `Tarjeta ${scene.number}: ${scene.title}. ${scene.howDescription}`;
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
        label: `TARJETA ${scene.numeral} · ${scene.locationTag}`,
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
      {/* INTRODUCCIÓN DE SECCIÓN (oculta en Recorrido en campo para no duplicar su cabecera fija) */}
      {viewMode !== 'editorial' && (
        <header className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-5 sm:pb-7">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl space-y-2">
              <BlurFade inView delay={0}>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-earth font-medium">
                  El proceso, paso a paso
                </p>
              </BlurFade>
              <BlurFade inView delay={STAGGER}>
                <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-ink leading-[1.06] tracking-[-0.02em] [text-wrap:balance]">
                  De la escucha en campo a{' '}
                  <span className="italic font-medium text-forest">propuestas compartidas</span>
                </h2>
              </BlurFade>
            </div>
            <BlurFade inView delay={STAGGER * 2}>
              <p className="text-xs sm:text-sm text-ink-muted max-w-xs leading-relaxed">
                Ocho tarjetas con evidencia real en territorio y cuatro modos para explorarlas a tu ritmo.
              </p>
            </BlurFade>
          </div>
        </header>
      )}

      {/* BARRA ADHERENTE DE MODOS, PROGRESO Y ACCESIBILIDAD */}
      <div className="sticky top-2.5 z-40 max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 mb-4 sm:mb-6 no-print">
        <div className="flex items-center justify-between gap-2 rounded-full border border-earth/20 bg-cream-soft/92 px-2.5 py-1.5 shadow-[0_10px_28px_rgba(55,35,18,0.08)] backdrop-blur-xl">
          {/* Indicador compacto de ubicación actual */}
          <div className="flex items-center gap-2 pl-2 min-w-0">
            <span className="font-mono text-[11px] font-semibold text-forest tabular-nums shrink-0">
              {currentScene.numeral}/{String(STORYBOARD_SCENES.length).padStart(2, '0')}
            </span>
            <span className="h-3.5 w-px bg-earth/20 shrink-0" aria-hidden="true" />
            <span className="truncate text-xs font-medium text-ink-soft md:max-w-[9rem] lg:max-w-none">
              <span className="md:hidden">
                {VIEW_MODES.find((m) => m.id === viewMode)?.label}
              </span>
              <span className="hidden md:inline">{getPhaseLabel(currentScene.phase)}</span>
            </span>
          </div>

          {/* Selector directo de modos en pantallas medianas y grandes */}
          <div
            className="hidden md:inline-flex items-center rounded-full bg-cream-deep/70 p-1 border border-earth/15"
            role="tablist"
            aria-label="Modo de visualización del proceso"
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
                  className={`relative px-3 lg:px-3.5 py-1.5 text-xs font-semibold rounded-full transition-colors cursor-pointer ${
                    active ? 'text-cream' : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="activeViewModePillDesktop"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-forest shadow-xs"
                    />
                  )}
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Acciones rápidas: voz + cajón de opciones y salto rápido */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={toggleSpeakAll}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border transition-colors cursor-pointer ${
                isPlayingAll
                  ? 'bg-terracotta text-cream border-terracotta'
                  : 'bg-cream text-ink border-earth/25 hover:border-forest/50'
              }`}
            >
              <AudioWave active={isPlayingAll} light={isPlayingAll} />
              <span className="hidden sm:inline">
                {isPlayingAll ? 'Detener' : 'Escuchar'}
              </span>
              <span className="sr-only sm:hidden">
                {isPlayingAll ? 'Detener explicación por voz' : 'Escuchar explicación por voz'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setControlsOpen((open) => !open)}
              aria-label={controlsOpen ? 'Ocultar herramientas y tarjetas' : 'Mostrar herramientas y tarjetas'}
              aria-expanded={controlsOpen}
              aria-controls="mobile-story-controls"
              className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition-colors duration-300 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest ${
                controlsOpen
                  ? 'border-forest bg-forest text-cream'
                  : 'border-earth/20 bg-cream text-ink-soft hover:bg-cream-deep/70 hover:text-forest'
              }`}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`h-4 w-4 transition-transform duration-500 ease-out-expo ${controlsOpen ? 'rotate-90' : ''}`}
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
                <circle cx="16" cy="6" r="2.1" fill="currentColor" />
                <circle cx="8" cy="12" r="2.1" fill="currentColor" />
                <circle cx="13" cy="18" r="2.1" fill="currentColor" />
              </svg>
              <span className="md:hidden">Modos</span>
              <span className="hidden md:inline">Tarjetas</span>
            </button>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {controlsOpen && (
            <motion.div
              key="story-controls"
              id="mobile-story-controls"
              initial={{ opacity: 0, y: -8, scale: 0.98, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6, scale: 0.98, filter: 'blur(4px)' }}
              transition={{ duration: 0.28, ease: EASE_OUT_EXPO }}
              style={{ transformOrigin: 'top right' }}
              className="mt-2 rounded-inner border border-earth/20 bg-cream-soft/96 p-3 shadow-[0_14px_36px_rgba(55,35,18,0.12)] backdrop-blur-xl space-y-2.5"
            >
              {/* Modos en móvil */}
              <div
                className="flex md:hidden flex-wrap items-center gap-1 rounded-2xl bg-cream-deep/70 p-1 border border-earth/15"
                role="tablist"
                aria-label="Modo de visualización del proceso"
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
                      className={`relative flex-1 min-w-[46%] px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors cursor-pointer ${
                        active ? 'text-cream' : 'text-ink-soft hover:text-ink'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="activeViewModePillMobile"
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                          className="absolute inset-0 rounded-xl bg-forest shadow-xs"
                        />
                      )}
                      <span className="relative z-10">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
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
                </div>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="hidden lg:inline-flex items-center rounded-full bg-cream px-3 py-1.5 text-xs font-medium text-ink-soft border border-earth/20 hover:text-ink transition-colors cursor-pointer"
                >
                  Guardar PDF
                </button>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-earth/10">
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
                        TARJETA {scene.numeral}
                      </span>
                      <span className="relative z-10 hidden md:inline">
                        {getPhaseLabel(scene.phase)}
                      </span>
                    </button>
                  );
                })}
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
             MODO DOCUMENTAL CON FOTOS REALES Y EFECTO KEN BURNS
             ---------------------------------------------------------------- */
          <motion.div
            key="documentary-mode"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45 }}
            className="space-y-5"
          >
            <div className="relative rounded-card overflow-hidden bg-ink border border-earth/30 shadow-[0_26px_70px_rgba(28,22,18,0.28)]">
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
                        aria-label={`Saltar a la tarjeta ${s.number} de ${STORYBOARD_SCENES.length}: ${s.title}`}
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
                    <span className="text-xs sm:text-sm font-medium text-cream/90">
                      {currentScene.locationTag}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] tracking-wide text-cream/60">
                      <span aria-hidden="true">
                        {currentScene.numeral}/{String(STORYBOARD_SCENES.length).padStart(2, '0')}
                      </span>
                      <span className="sr-only">
                        Tarjeta {currentScene.numeral} de {STORYBOARD_SCENES.length}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => speakSingleScene(activeSceneIndex)}
                      className="rounded-full bg-cream/15 backdrop-blur-md border border-cream/25 px-3.5 py-1 text-xs font-semibold text-cream hover:bg-cream/25 transition-colors cursor-pointer"
                    >
                      {speakingIndex === activeSceneIndex ? 'Silenciar voz' : 'Narrar tarjeta'}
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

              <div className="relative">
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
                </div>

                {/* En móvil se apila bajo la foto 4:3 para no tapar rostros ni chocar con la barra superior; en sm+ es lower-third cinematográfico */}
                <div className="relative border-t border-cream/10 bg-ink px-5 py-4 sm:border-t-0 sm:bg-transparent sm:absolute sm:inset-x-0 sm:bottom-0 sm:z-20 sm:bg-gradient-to-t sm:from-ink/95 sm:via-ink/65 sm:to-transparent sm:px-10 sm:pb-8 sm:pt-20">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentScene.number}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.35 }}
                      className="max-w-3xl space-y-1.5 sm:space-y-2"
                    >
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-peach">
                        {getPhaseLabel(currentScene.phase)}
                      </p>
                      <h2 className="font-serif text-lg sm:text-3xl font-medium text-cream leading-snug">
                        {currentScene.title}
                      </h2>
                      <p className="text-xs sm:text-base text-cream/85 leading-relaxed max-w-2xl">
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
                className="rounded-full bg-cream-soft border border-earth/25 px-5 py-2.5 text-xs sm:text-sm font-semibold text-ink disabled:opacity-35 hover:bg-peach-pale transition-colors cursor-pointer"
              >
                Tarjeta anterior
              </button>

              <button
                type="button"
                onClick={(event) =>
                  openScenePhoto(currentScene, false, event.currentTarget)
                }
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
                Siguiente tarjeta
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
              className="overflow-hidden rounded-card border border-earth/25 bg-cream-soft shadow-[0_20px_50px_rgba(70,45,25,0.1)]"
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
                    <div key={scene.number} className="flex-[0_0_100%] min-w-0 relative select-none">
                      <button
                        type="button"
                        onClick={(event) =>
                          openScenePhoto(scene, showSecondarySlide, event.currentTarget)
                        }
                        aria-label={`Ampliar fotografía de la tarjeta ${scene.numeral}: ${slideAlt}`}
                        className="relative block w-full cursor-zoom-in overflow-hidden bg-cream-deep p-0 text-left aspect-[4/3] sm:aspect-video focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-cream"
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
                        <div className="absolute top-4 left-4 rounded-full bg-cream-soft/92 backdrop-blur-md border border-earth/20 px-3.5 py-1">
                          <span className="font-mono text-xs font-semibold text-forest">
                            {scene.locationTag}
                          </span>
                        </div>
                        <span className="absolute top-4 right-4 rounded-full bg-ink/55 px-2.5 py-1 font-mono text-[10px] tracking-wide text-cream/80 backdrop-blur-sm">
                          <span aria-hidden="true">
                            {scene.numeral}/{String(STORYBOARD_SCENES.length).padStart(2, '0')}
                          </span>
                          <span className="sr-only">
                            Tarjeta {scene.numeral} de {STORYBOARD_SCENES.length}
                          </span>
                        </span>
                        <div className="absolute bottom-3 right-4 rounded-full bg-ink/75 backdrop-blur-xs px-3 py-1 text-[11px] font-medium text-cream">
                          Toca para ver foto completa
                        </div>
                      </button>
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
                className="rounded-full bg-cream-soft border border-earth/25 px-5 py-2.5 text-xs sm:text-sm font-semibold text-ink disabled:opacity-35 hover:bg-peach-pale transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                Tarjeta anterior
              </button>

              <span className="font-mono text-xs sm:text-sm text-ink-muted">
                Desliza con el dedo
              </span>

              <button
                type="button"
                onClick={() => emblaApi?.scrollNext()}
                disabled={activeSceneIndex === STORYBOARD_SCENES.length - 1}
                className="rounded-full bg-forest px-5 py-2.5 text-xs sm:text-sm font-semibold text-cream disabled:opacity-35 hover:bg-forest-dark transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                Siguiente tarjeta
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentScene.number}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.32, ease: 'easeOut' }}
                className="rounded-card bg-cream-soft border border-earth/20 p-6 sm:p-8 shadow-sm space-y-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="space-y-1">
                    <span
                      className={`inline-block rounded-full border px-3 py-0.5 text-xs font-semibold ${
                        ACCENT_STYLES[currentScene.accent].pill
                      }`}
                    >
                      {getPhaseLabel(currentScene.phase)}
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
                      {speakingIndex === activeSceneIndex ? 'Detener voz' : 'Escuchar tarjeta'}
                    </span>
                  </button>
                </div>

                <p className="text-sm sm:text-base text-ink-soft leading-relaxed">
                  {currentScene.howDescription}
                </p>

                {currentScene.secondaryPhoto && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="font-mono text-[11px] text-ink-muted">Evidencias:</span>
                    <div className="inline-flex flex-wrap rounded-full bg-cream-deep/75 p-0.5 border border-earth/15">
                      <button
                        type="button"
                        aria-pressed={!secondaryActiveMap[currentScene.number]}
                        onClick={() =>
                          setSecondaryActiveMap((m) => ({ ...m, [currentScene.number]: false }))
                        }
                        className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                          !secondaryActiveMap[currentScene.number]
                            ? 'bg-forest text-cream'
                            : 'text-ink-soft hover:text-ink'
                        }`}
                      >
                        {currentScene.secondaryPhoto.primaryLabel}
                      </button>
                      <button
                        type="button"
                        aria-pressed={Boolean(secondaryActiveMap[currentScene.number])}
                        onClick={() =>
                          setSecondaryActiveMap((m) => ({ ...m, [currentScene.number]: true }))
                        }
                        className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                          secondaryActiveMap[currentScene.number]
                            ? 'bg-forest text-cream'
                            : 'text-ink-soft hover:text-ink'
                        }`}
                      >
                        {currentScene.secondaryPhoto.label}
                      </button>
                    </div>
                  </div>
                )}

                <p className="pt-3 border-t border-earth/15 text-xs sm:text-sm text-ink-muted">
                  <strong className="font-mono text-[10px] uppercase tracking-[0.14em] text-earth mr-2">
                    Siguiente paso:
                  </strong>
                  {currentScene.transitionNote}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        ) : (
          /* ----------------------------------------------------------------
             RECORRIDO EN CAMPO / FICHA COMPLETA
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
            {viewMode === 'technical' && (
              <div
                className="hidden lg:block absolute left-1/2 top-8 bottom-8 w-px bg-earth/15 -translate-x-1/2 pointer-events-none no-print"
                aria-hidden="true"
              >
                <div className="gsap-spine-progress w-full h-full bg-gradient-to-b from-forest via-olive to-terracotta origin-top" />
              </div>
            )}

            <div className={viewMode === 'editorial' ? 'field-scroll-sticky relative z-10' : 'relative z-10'}>
              {viewMode === 'editorial' && (
                <div className="field-scroll-heading">
                  <div>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-earth">
                      Recorrido por el territorio
                    </p>
                    <h2 className="mt-1 font-serif text-2xl font-semibold leading-tight text-ink sm:text-3xl">
                      De la escucha a las propuestas
                    </h2>
                  </div>
                  <p className="hidden max-w-xs text-right text-sm leading-relaxed text-ink-muted sm:block">
                    Explora los ocho momentos del diagnóstico.
                  </p>
                </div>
              )}

              <div
                ref={fieldViewportRef}
                className={viewMode === 'editorial' ? 'field-scroll-viewport' : 'contents'}
                role={viewMode === 'editorial' ? 'region' : undefined}
                aria-label={
                  viewMode === 'editorial'
                    ? 'Recorrido horizontal de ocho tarjetas. Usa las flechas izquierda y derecha.'
                    : undefined
                }
                tabIndex={viewMode === 'editorial' ? 0 : undefined}
                onKeyDown={(event) => {
                  if (event.target !== event.currentTarget) return;
                  if (event.key === 'ArrowRight' && activeSceneIndex < STORYBOARD_SCENES.length - 1) {
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
                viewMode === 'editorial'
                  ? { transform: horizontalTransform }
                  : undefined
              }
              className={
                viewMode === 'editorial'
                  ? 'field-scroll-track'
                  : 'space-y-8 md:space-y-12 lg:space-y-20 relative z-10'
              }
            >
              {STORYBOARD_SCENES.map((scene, index) => {
                const isEditorial = viewMode === 'editorial';
                const isReversed = index % 2 === 1 && viewMode === 'technical';
                const isTechExpanded = viewMode === 'technical';
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
                  <div
                    key={scene.number}
                    className={`relative print-scene-break ${
                      viewMode === 'editorial' ? 'field-scroll-item' : ''
                    }`}
                  >
                    <motion.article
                      id={`escena-${scene.number}`}
                      data-scene-card
                      data-scene-index={index}
                      initial={{ opacity: 0, y: 34 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-75px' }}
                      transition={{ duration: 0.72, ease: EASE_OUT_EXPO }}
                      className={`group/card scroll-mt-6 sm:scroll-mt-36 rounded-inner sm:rounded-card bg-cream-soft/95 backdrop-blur-xs border border-earth/20 shadow-card transition-[box-shadow,border-color] duration-500 ease-out-expo hover:shadow-card-hover hover:border-earth/30 overflow-hidden ${
                        isEditorial ? 'p-4 sm:p-5 lg:p-6' : 'p-4 sm:p-6 lg:p-8'
                      }`}
                    >
                      <div
                        className={
                          isEditorial
                            ? 'grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-7 items-center'
                            : 'grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center'
                        }
                      >
                        {/* Columna de fotografía real en campo */}
                        <div
                          className={`space-y-2.5 ${
                            isEditorial
                              ? 'md:col-span-6'
                              : `lg:col-span-6 ${isReversed ? 'lg:order-2' : 'lg:order-1'}`
                          }`}
                        >
                          <TiltPlate
                            maxTilt={3.8}
                            onClick={(trigger) => openScenePhoto(scene, showSecondary, trigger)}
                            ariaLabel={`Ampliar fotografía real de la tarjeta ${scene.number}: ${scene.title}`}
                            className="group overflow-hidden rounded-inner border border-earth/20 bg-cream-deep cursor-zoom-in"
                          >
                            <div className="overflow-hidden aspect-[4/3]">
                              {/* Zoom suave al pasar el cursor (independiente del parallax GSAP del <img>) */}
                              <picture className="block h-full w-full transition-transform duration-700 ease-out-expo group-hover:scale-[1.04]">
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
                            <span className="absolute top-3.5 right-3.5 rounded-full bg-ink/55 px-2.5 py-1 font-mono text-[10px] tracking-wide text-cream/80 backdrop-blur-sm">
                              <span aria-hidden="true">
                                {scene.numeral}/{String(STORYBOARD_SCENES.length).padStart(2, '0')}
                              </span>
                              <span className="sr-only">
                                Tarjeta {scene.numeral} de {STORYBOARD_SCENES.length}
                              </span>
                            </span>

                            <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4 no-print">
                              <span className="translate-y-2 rounded-full bg-cream-soft/95 px-3.5 py-1 text-xs font-semibold text-ink shadow-sm transition-transform duration-500 ease-out-expo group-hover:translate-y-0">
                                Ver foto completa con zoom
                              </span>
                            </div>
                          </TiltPlate>

                          {/* Selector de segunda fotografía real cuando la tarjeta tiene dos evidencias */}
                          {scene.secondaryPhoto && (
                            <div className="flex items-center gap-2 px-1 no-print">
                              <div className="inline-flex flex-wrap rounded-full bg-cream-deep/75 p-0.5 border border-earth/15">
                                <button
                                  type="button"
                                  aria-pressed={!showSecondary}
                                  onClick={() =>
                                    setSecondaryActiveMap((m) => ({ ...m, [scene.number]: false }))
                                  }
                                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                                    !showSecondary
                                      ? 'bg-forest text-cream'
                                      : 'text-ink-soft hover:text-ink'
                                  }`}
                                >
                                  {scene.secondaryPhoto.primaryLabel}
                                </button>
                                <button
                                  type="button"
                                  aria-pressed={showSecondary}
                                  onClick={() =>
                                    setSecondaryActiveMap((m) => ({ ...m, [scene.number]: true }))
                                  }
                                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                                    showSecondary
                                      ? 'bg-forest text-cream'
                                      : 'text-ink-soft hover:text-ink'
                                  }`}
                                >
                                  {scene.secondaryPhoto.label}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Columna explicativa clara: relato humano + contexto fotográfico */}
                        <div
                          className={`space-y-3.5 ${
                            isEditorial
                              ? 'md:col-span-6'
                              : `lg:col-span-6 ${isReversed ? 'lg:order-1' : 'lg:order-2'}`
                          } gsap-story-copy`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <span className="font-mono text-xs font-semibold text-terracotta">
                                {scene.numeral}
                              </span>
                              <span
                                className={`inline-block rounded-full border px-3 py-0.5 text-xs font-semibold ${accent.pill}`}
                              >
                                {getPhaseLabel(scene.phase)}
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

                          <h3
                            className={`font-serif font-semibold leading-tight text-ink [text-wrap:balance] ${
                              isEditorial ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-[1.72rem]'
                            }`}
                          >
                            {scene.title}
                          </h3>

                          <p className="text-sm sm:text-[15px] text-ink-soft leading-relaxed">
                            {scene.howDescription}
                          </p>

                          {/* Ficha: ahora vive junto al título y equilibra la columna (antes quedaba vacía) */}
                          <AnimatePresence initial={false}>
                            {isTechExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.35, ease: EASE_OUT_EXPO }}
                                className="overflow-hidden"
                              >
                                <div className="pt-4 mt-1 border-t border-earth/15 space-y-4 text-sm">
                                  <div className="rounded-inner bg-cream/80 border border-earth/15 p-4 sm:p-5 space-y-1.5 transition-colors duration-500 group-hover/card:bg-cream">
                                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-forest font-medium">
                                      Contexto de la imagen
                                    </p>
                                    <p className="text-ink-soft leading-relaxed">
                                      {scene.visualDescription}
                                    </p>
                                  </div>

                                  <div className="relative pl-5 space-y-1">
                                    <span
                                      aria-hidden="true"
                                      className="absolute left-0 top-1 bottom-1 w-0.5 rounded-full bg-gradient-to-b from-terracotta/70 to-peach/40"
                                    />
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
                  <span className="font-mono text-[10px] font-semibold tracking-[0.16em] text-forest">
                    {currentScene.numeral}/{String(STORYBOARD_SCENES.length).padStart(2, '0')}
                  </span>
                  <span className="field-scroll-scroll-hint font-mono text-[9px] uppercase tracking-[0.13em] text-ink-muted">
                    Desplázate para continuar
                  </span>
                  <span className="field-scroll-swipe-hint font-mono text-[9px] uppercase tracking-[0.13em] text-ink-muted">
                    Desliza horizontalmente
                  </span>
                </div>
              )}
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
            exit={{ opacity: 0, transition: { duration: 0.18 } }}
            transition={{ duration: 0.24 }}
            onClick={() => setLightboxMedia(null)}
            className="fixed inset-0 z-50 bg-ink/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 no-print"
            role="dialog"
            aria-modal="true"
            aria-labelledby="lightbox-title"
            aria-describedby="lightbox-description"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 14 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{
                scale: 0.96,
                opacity: 0,
                y: 10,
                transition: { duration: 0.18, ease: EASE_OUT_EXPO },
              }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              ref={lightboxDialogRef}
              className="max-w-5xl w-full rounded-card bg-cream-soft border border-earth/30 overflow-hidden shadow-2xl"
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
                      <span id="lightbox-title" className="font-mono text-xs font-semibold text-forest truncate">
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
                          ref={lightboxCloseButtonRef}
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
                      <p id="lightbox-description" className="font-serif text-sm sm:text-base text-ink">
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
