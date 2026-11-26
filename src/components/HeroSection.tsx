import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import TiltPlate from './TiltPlate';

gsap.registerPlugin(useGSAP);

interface HeroSectionProps {
  baseUrl: string;
}

export default function HeroSection({ baseUrl }: HeroSectionProps) {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) return;

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.hero-topbar', { y: -18, opacity: 0, duration: 0.65 })
        .from(
          '.hero-mask-line',
          {
            yPercent: 110,
            opacity: 0,
            duration: 0.85,
            stagger: 0.1,
          },
          '-=0.35'
        )
        .from(
          '.hero-fade-up',
          {
            y: 20,
            opacity: 0,
            duration: 0.65,
            stagger: 0.08,
          },
          '-=0.45'
        )
        .from(
          '.hero-plate',
          {
            scale: 0.95,
            y: 26,
            opacity: 0,
            duration: 0.9,
          },
          '-=0.65'
        );
    },
    { scope: containerRef }
  );

  return (
    <header ref={containerRef} className="relative pt-4 pb-8 sm:pt-10 sm:pb-14 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Barra institucional superior */}
        <div className="hero-topbar flex flex-wrap items-center justify-between gap-3 pb-4 sm:pb-6 border-b border-earth/20">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="shrink-0">
              <img
                src={`${baseUrl}assets/uieplogo-transparent.png`}
                alt="Universidad Intercultural del Estado de Puebla (UIEP)"
                className="h-11 sm:h-13 w-auto object-contain"
                width={150}
                height={112}
              />
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-earth font-medium">
                Vinculación Comunitaria · UIEP
              </p>
              <p className="text-sm sm:text-base font-semibold text-ink">
                Ingeniería Civil Sustentable
              </p>
            </div>
          </div>
        </div>

        {/* Escenario principal con fotografía documental real */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center pt-1 sm:pt-2">
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            <p className="hero-fade-up text-[15px] sm:text-lg text-ink-soft leading-relaxed max-w-xl">
              Este diagnóstico reúne la experiencia de habitantes de{' '}
              <strong className="font-semibold text-ink">San José Buenavista</strong> y el trabajo
              técnico de estudiantes de Ingeniería Civil Sustentable de la UIEP. Su propósito es
              identificar prioridades locales y aportar una base clara para desarrollar propuestas
              pertinentes al territorio.
            </p>
            <p className="hero-fade-up text-sm sm:text-base text-ink-soft leading-relaxed max-w-xl">
              El proceso integró coordinación con autoridades, recorridos de campo, encuestas,
              conversatorios, mapa social y análisis de información. Así, las propuestas se
              fundamentan en necesidades expresadas por la comunidad y en criterios de ingeniería
              sustentable.
            </p>

            <div className="hero-fade-up flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 pt-1 no-print">
              <a
                href="#relato-interactivo"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-forest px-6 py-3 text-sm font-semibold text-cream shadow-[0_8px_20px_rgba(31,74,35,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-forest-dark sm:w-fit"
              >
                Explorar el proceso
              </a>
            </div>
          </div>

          {/* Fotografía real principal de la brigada en San José Buenavista */}
          <div className="lg:col-span-5 hero-plate">
            <TiltPlate
              maxTilt={4.5}
              className="rounded-[30px] bg-cream-soft p-3.5 sm:p-4 border border-earth/25 shadow-[0_24px_60px_rgba(92,64,43,0.14)]"
            >
              <div className="overflow-hidden rounded-[22px] border border-earth/15 bg-cream-deep">
                <picture>
                  <source srcSet={`${baseUrl}assets/foto-01.webp`} type="image/webp" />
                  <img
                    src={`${baseUrl}assets/foto-01.jpg`}
                    alt="Brigada estudiantil de Ingeniería Civil Sustentable de la UIEP en las calles de San José Buenavista"
                    className="w-full h-auto aspect-[4/3] object-cover"
                    style={{ objectPosition: '50% 42%' }}
                    width={1599}
                    height={1191}
                  />
                </picture>
              </div>
              <div className="flex items-center justify-between gap-4 pt-3.5 px-1.5">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-earth">
                    Registro fotográfico de campo
                  </p>
                  <p className="font-serif text-sm sm:text-base text-ink font-medium">
                    Brigada UIEP en San José Buenavista
                  </p>
                </div>
              </div>
            </TiltPlate>
          </div>
        </div>

      </div>
    </header>
  );
}
