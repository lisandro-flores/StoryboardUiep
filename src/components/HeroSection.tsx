import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import TiltPlate from './TiltPlate';

gsap.registerPlugin(useGSAP);

interface HeroSectionProps {
  baseUrl: string;
}

const KEY_METRICS = [
  { figure: '08', label: 'Láminas narrativas' },
  { figure: '04', label: 'Etapas participativas' },
  { figure: '10', label: 'Estudiantes en brigada' },
  { figure: '03', label: 'Pasos para sumarte' },
];

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
            scale: 0.94,
            y: 28,
            opacity: 0,
            duration: 0.9,
          },
          '-=0.65'
        );
    },
    { scope: containerRef }
  );

  return (
    <header ref={containerRef} className="relative pt-6 pb-10 md:pt-10 md:pb-16 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Barra institucional superior */}
        <div className="hero-topbar flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-earth/20">
          <div className="flex items-center gap-4">
            <div className="bg-cream-soft border border-earth/20 rounded-2xl px-3 py-2 shadow-xs">
              <img
                src={`${baseUrl}assets/uieplogo.png`}
                alt="Universidad Intercultural del Estado de Puebla (UIEP)"
                className="h-11 sm:h-13 w-auto object-contain"
                width={116}
                height={86}
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

          <div className="inline-flex items-center gap-2.5 rounded-full bg-rose-pale/90 border border-rose px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-terracotta animate-pulse" aria-hidden="true" />
            <span className="text-xs sm:text-sm font-semibold tracking-tight text-ink">
              San José Buenavista, Puebla
            </span>
          </div>
        </div>

        {/* Escenario principal asimétrico */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center pt-8 md:pt-12">
          <div className="lg:col-span-7 space-y-6">
            <div className="hero-fade-up inline-flex items-center gap-3 rounded-full bg-olive-pale/85 border border-olive/35 px-4 py-1">
              <span className="font-mono text-[11px] font-semibold tracking-wider text-forest">
                RELATO INTERACTIVO QR
              </span>
              <span className="h-3 w-px bg-olive/40" aria-hidden="true" />
              <span className="text-xs font-medium text-forest">
                Abierto a todas las edades
              </span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.85rem] font-semibold leading-[1.03] tracking-[-0.025em] text-ink">
              <span className="block overflow-hidden pb-1">
                <span className="hero-mask-line block">Diagnóstico Comunitario</span>
              </span>
              <span className="block overflow-hidden pb-1">
                <span className="hero-mask-line block italic font-medium text-forest">
                  Participativo
                </span>
              </span>
            </h1>

            <p className="hero-fade-up text-base sm:text-lg text-ink-soft leading-relaxed max-w-xl">
              Bienvenida y bienvenido. Escaneaste el código QR de nuestra lona comunitaria:
              explora esta experiencia interactiva para conocer cómo vecinas, vecinos, comités,
              autoridades y estudiantes trabajamos unidos por{' '}
              <strong className="font-semibold text-ink">San José Buenavista</strong>.
            </p>

            <div className="hero-fade-up flex flex-wrap items-center gap-3 pt-1 no-print">
              <a
                href="#relato-interactivo"
                className="inline-flex items-center justify-center rounded-full bg-forest px-6 py-3 text-sm font-semibold text-cream shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-forest-dark"
              >
                Iniciar recorrido inmersivo
              </a>
              <a
                href="#mapa-territorial"
                className="inline-flex items-center justify-center rounded-full bg-cream-soft border border-earth/25 px-5 py-3 text-sm font-semibold text-ink transition-colors duration-200 hover:bg-peach-pale/80"
              >
                Explorar mapa de propuestas
              </a>
            </div>

            {/* Franja editorial de telemetría comunitaria */}
            <div className="hero-fade-up grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-earth/15">
              {KEY_METRICS.map((item) => (
                <div key={item.label} className="space-y-0.5">
                  <p className="font-serif text-2xl sm:text-3xl font-semibold text-forest leading-none">
                    {item.figure}
                  </p>
                  <p className="text-xs text-ink-muted font-medium">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Lámina 3D interactiva con inclinación física */}
          <div className="lg:col-span-5 hero-plate">
            <TiltPlate
              maxTilt={5.5}
              className="rounded-[30px] bg-cream-soft p-3.5 sm:p-4 border border-earth/25 shadow-[0_24px_60px_rgba(92,64,43,0.14)]"
            >
              <div className="overflow-hidden rounded-[22px] border border-earth/15 bg-cream-deep">
                <picture>
                  <source srcSet={`${baseUrl}assets/escena-01.webp`} type="image/webp" />
                  <img
                    src={`${baseUrl}assets/escena-01.jpg`}
                    alt="Bienvenida de la comunidad de San José Buenavista a la brigada de estudiantes de la UIEP"
                    className="w-full h-auto aspect-video object-cover"
                    width={1360}
                    height={759}
                  />
                </picture>
              </div>
              <div className="flex items-center justify-between gap-4 pt-3.5 px-1.5">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-earth">
                    Cuaderno de campo ilustrado
                  </p>
                  <p className="font-serif text-sm sm:text-base text-ink font-medium">
                    La palabra de la comunidad marca el rumbo
                  </p>
                </div>
                <span className="font-mono text-xs px-3 py-1 rounded-full bg-peach/50 text-ink font-semibold">
                  01 — 08
                </span>
              </div>
            </TiltPlate>
          </div>
        </div>
      </div>
    </header>
  );
}
