import { motion } from 'motion/react';

/**
 * Lienzo atmosférico vivo con curvas de nivel topográficas de San José Buenavista
 * y halos de acuarela orgánica en movimiento lento GPU-acelerado.
 */
export default function AmbientBackdrop() {
  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none no-print"
      aria-hidden="true"
    >
      {/* Halos cálidos tipo lavado de acuarela */}
      <motion.div
        animate={{
          x: [0, 36, -18, 0],
          y: [0, -28, 20, 0],
          scale: [1, 1.08, 0.96, 1],
        }}
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-28 -left-24 w-[32rem] h-[32rem] rounded-full bg-peach/28 blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -32, 24, 0],
          y: [0, 30, -22, 0],
          scale: [1, 0.94, 1.06, 1],
        }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[22%] -right-32 w-[30rem] h-[30rem] rounded-full bg-olive/16 blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, 22, -26, 0],
          y: [0, -20, 24, 0],
        }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-32 left-[25%] w-[34rem] h-[26rem] rounded-full bg-rose/22 blur-3xl"
      />

      {/* Curvas de nivel topográficas sutiles del valle semiárido */}
      <svg
        viewBox="0 0 1440 900"
        fill="none"
        className="absolute inset-0 w-full h-full opacity-[0.065]"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M-120 220 C 220 110, 480 310, 820 190 C 1100 90, 1290 260, 1560 170"
          stroke="#8E6545"
          strokeWidth="1.4"
        />
        <path
          d="M-100 280 C 250 170, 510 370, 850 250 C 1130 150, 1310 320, 1580 230"
          stroke="#8E6545"
          strokeWidth="1"
          strokeDasharray="6 8"
        />
        <path
          d="M-140 640 C 180 530, 520 740, 890 610 C 1180 510, 1340 690, 1580 590"
          stroke="#1F4A23"
          strokeWidth="1.2"
        />
        <path
          d="M-110 710 C 210 600, 550 810, 920 680 C 1210 580, 1370 760, 1600 660"
          stroke="#7D9154"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
