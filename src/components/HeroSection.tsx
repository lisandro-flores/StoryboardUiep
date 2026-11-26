import { useRef } from 'react';
import { motion, MotionConfig, useScroll, useTransform } from 'motion/react';
import { BlurFade } from '@/components/ui/blur-fade';
import { TextAnimate } from '@/components/ui/text-animate';
import { STAGGER } from '@/lib/motion';

interface HeroSectionProps {
  baseUrl: string;
}

const METHODS = [
  'Recorridos de campo',
  'Encuestas y conversatorios',
  'Mapa social',
  'Análisis técnico',
];

export default function HeroSection({ baseUrl }: HeroSectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const backgroundTransform = useTransform(
    scrollYProgress,
    [0, 0.82, 1],
    ['scale(1)', 'scale(1.24)', 'scale(1.3)']
  );
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.82, 1], [1, 0.9, 0.5]);
  const backgroundFilter = useTransform(
    scrollYProgress,
    [0, 1],
    ['blur(0px)', 'blur(4px)']
  );
  const textTransform = useTransform(
    scrollYProgress,
    [0, 0.65, 1],
    ['translateY(0%)', 'translateY(-5%)', 'translateY(-12%)']
  );
  const textOpacity = useTransform(scrollYProgress, [0, 0.65, 0.92, 1], [1, 0.96, 0.3, 0]);
  // Cortina crema que disuelve la foto oscura hacia el relato (evita el corte duro)
  const curtainOpacity = useTransform(scrollYProgress, [0.45, 1], [0, 1]);

  return (
    <MotionConfig reducedMotion="user">
      <section ref={containerRef} className="scroll-zoom-hero relative">
        <header className="scroll-zoom-stage sticky top-0 isolate flex min-h-svh flex-col overflow-hidden bg-ink text-cream">
          <motion.div
            className="scroll-zoom-background absolute inset-0"
            style={{
              transform: backgroundTransform,
              opacity: backgroundOpacity,
              filter: backgroundFilter,
            }}
          >
            {/* Entrada cinematográfica: la foto se asienta de 1.08 → 1 al cargar */}
            <motion.picture
              className="block h-full w-full"
              initial={{ scale: 1.08, opacity: 0.6 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <source srcSet={`${baseUrl}assets/foto-01.webp`} type="image/webp" />
              <img
                src={`${baseUrl}assets/foto-01.jpg`}
                alt="Brigada estudiantil de Ingeniería Civil Sustentable de la UIEP en las calles de San José Buenavista"
                className="h-full w-full object-cover object-[50%_42%]"
                width={1599}
                height={1191}
                fetchPriority="high"
              />
            </motion.picture>
          </motion.div>

          <div
            className="absolute inset-0 bg-gradient-to-r from-[#171b12]/90 via-[#171b12]/65 to-[#171b12]/25"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#171b12]/35 via-transparent to-[#171b12]/65"
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-7xl flex-1 flex-col px-5 pb-5 pt-3 sm:px-8 sm:pb-7 sm:pt-6 lg:px-12">
            <BlurFade delay={0} offset={8} className="hero-topbar flex items-center justify-between gap-4">
              <div className="inline-flex max-w-full items-center gap-3 rounded-2xl border border-white/35 bg-cream/95 px-3 py-2 text-ink shadow-lg backdrop-blur-md sm:px-4 sm:py-2.5">
                <img
                  src={`${baseUrl}assets/uieplogo-transparent.png`}
                  alt="Universidad Intercultural del Estado de Puebla (UIEP)"
                  className="h-9 w-auto shrink-0 object-contain sm:h-11"
                  width={150}
                  height={112}
                />
                <div className="min-w-0">
                  <p className="truncate font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-earth sm:text-[10px]">
                    Vinculación Comunitaria · UIEP
                  </p>
                  <p className="text-xs font-semibold text-ink sm:text-sm">
                    Ingeniería Civil Sustentable
                  </p>
                </div>
              </div>
              <p className="hidden font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-cream/80 sm:block">
                San José Buenavista · Puebla
              </p>
            </BlurFade>

            <div className="flex flex-1 items-center py-2 sm:py-10">
              <div className="w-full max-w-4xl">
                <motion.div
                  className="scroll-zoom-copy"
                  style={{ transform: textTransform, opacity: textOpacity }}
                >
                  {/* Titular revelado palabra por palabra (Magic UI · TextAnimate) */}
                  <h1 className="max-w-4xl font-serif text-[clamp(2.4rem,8vw,6.25rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-cream [text-wrap:balance]">
                    <TextAnimate
                      as="span"
                      by="word"
                      animation="blurInUp"
                      startOnView={false}
                      once
                      delay={0.15}
                      duration={0.5}
                    >
                      Diagnóstico Comunitario
                    </TextAnimate>{' '}
                    <TextAnimate
                      as="span"
                      by="word"
                      animation="blurInUp"
                      startOnView={false}
                      once
                      delay={0.45}
                      duration={0.55}
                      className="italic font-medium text-peach"
                    >
                      Participativo
                    </TextAnimate>
                  </h1>

                  <BlurFade delay={0.85} offset={10}>
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-cream/90 sm:mt-6 sm:text-lg">
                      Un trabajo conjunto entre habitantes, autoridades y estudiantes de la UIEP
                      para identificar prioridades y orientar propuestas de ingeniería sustentable
                      en <strong className="font-semibold text-white">San José Buenavista</strong>.
                    </p>
                  </BlurFade>

                  <div className="mt-4 sm:mt-7">
                    <BlurFade delay={1}>
                      <p className="mb-2 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] text-cream/70 sm:text-[10px]">
                        Así se realizó
                      </p>
                    </BlurFade>
                    <ul
                      aria-label="Métodos del diagnóstico"
                      className="flex flex-wrap gap-2 text-[10px] text-cream sm:text-xs"
                    >
                      {METHODS.map((method, idx) => (
                        <motion.li
                          key={method}
                          initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                          transition={{
                            delay: 1.05 + idx * STAGGER,
                            duration: 0.45,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="rounded-full border border-white/30 bg-ink/25 px-3 py-1.5 backdrop-blur-sm transition-colors duration-300 hover:border-peach/70 hover:bg-ink/40"
                        >
                          {method}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* El CTA ahora vive dentro del grupo que se desvanece con el scroll */}
                  <BlurFade delay={1.4} offset={10}>
                    <div className="mt-5 flex flex-col items-start gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-5">
                      <a
                        href="#relato-interactivo"
                        onClick={() => window.dispatchEvent(new Event('storyboard:explore'))}
                        className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-cream px-6 py-3 text-sm font-semibold text-forest shadow-[0_8px_24px_rgba(0,0,0,0.24)] transition-[background-color,box-shadow,transform] duration-300 ease-out-expo hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_14px_34px_rgba(0,0,0,0.32)] active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cream"
                      >
                        Explorar el proceso
                        <span className="grid h-7 w-7 place-items-center rounded-full bg-forest text-cream transition-transform duration-300 ease-out-expo group-hover:rotate-45">
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-3.5 w-3.5"
                          >
                            <path d="M7 17 17 7M7 7h10v10" />
                          </svg>
                        </span>
                      </a>
                    </div>
                  </BlurFade>
                </motion.div>
              </div>
            </div>

            <BlurFade delay={1.7} offset={0}>
              <div className="flex items-center justify-between gap-4 border-t border-white/25 pt-3">
                <p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.13em] text-cream/85 sm:text-[10px]">
                  Desliza para descubrir
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4 animate-scroll-cue"
                  >
                    <path d="M12 5v14m-7-7 7 7 7-7" />
                  </svg>
                </p>
              </div>
            </BlurFade>
          </div>

          <motion.div
            aria-hidden="true"
            style={{ opacity: curtainOpacity }}
            className="scroll-zoom-curtain pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[45%] bg-gradient-to-b from-transparent via-cream/70 to-cream"
          />
        </header>
      </section>
    </MotionConfig>
  );
}
