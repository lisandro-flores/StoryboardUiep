import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface SmoothScrollDetail {
  target: number | string | HTMLElement;
  offset?: number;
  immediate?: boolean;
}

/**
 * Motor unificado de scroll inercial Lenis sincronizado al ticker de GSAP ScrollTrigger
 */
export default function SmoothScroll() {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.12,
      smoothWheel: true,
      wheelMultiplier: 0.92,
      touchMultiplier: 1.2,
      anchors: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    const handleProgrammaticScroll = (event: Event) => {
      const detail = (event as CustomEvent<SmoothScrollDetail>).detail;
      if (!detail) return;
      lenis.resize();
      lenis.scrollTo(detail.target, {
        offset: detail.offset ?? 0,
        immediate: Boolean(detail.immediate),
      });
    };

    window.addEventListener('uiep:lenis-scroll', handleProgrammaticScroll);
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      window.removeEventListener('uiep:lenis-scroll', handleProgrammaticScroll);
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
    };
  }, []);

  return null;
}
