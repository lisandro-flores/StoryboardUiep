import { motion, useReducedMotion } from 'motion/react';

interface AudioWaveProps {
  active: boolean;
  light?: boolean;
}

/**
 * Indicador cinético de voz mediante barras animadas con Motion (cero iconos ni emojis)
 */
export default function AudioWave({ active, light = false }: AudioWaveProps) {
  const shouldReduceMotion = useReducedMotion();
  const barColor = light ? 'bg-cream' : 'bg-forest';
  const heights = [
    [4, 13, 6, 15, 4],
    [7, 16, 5, 11, 7],
    [5, 11, 15, 6, 5],
    [6, 14, 7, 12, 6],
  ];

  return (
    <span className="inline-flex items-center gap-[2.5px] h-4 px-0.5" aria-hidden="true">
      {heights.map((seq, i) => (
        <motion.span
          key={i}
          className={`w-[2.2px] rounded-full ${barColor}`}
          animate={
            active && !shouldReduceMotion
              ? { height: seq }
              : { height: i % 2 === 0 ? 5 : 9, opacity: 0.65 }
          }
          transition={
            active && !shouldReduceMotion
              ? {
                  duration: 0.85 + i * 0.08,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
              : { duration: 0.25 }
          }
        />
      ))}
    </span>
  );
}
