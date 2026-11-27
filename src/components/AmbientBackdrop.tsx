/**
 * Lienzo de fondo sobrio: únicamente curvas de nivel topográficas muy sutiles
 * sobre papel cálido, sin esferas de colores difuminadas tipo landing comercial.
 */
export default function AmbientBackdrop() {
  return (
    <div
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none no-print"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 900"
        fill="none"
        className="absolute inset-0 w-full h-full opacity-[0.045]"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M-120 220 C 220 110, 480 310, 820 190 C 1100 90, 1290 260, 1560 170"
          stroke="#7C583C"
          strokeWidth="1.2"
        />
        <path
          d="M-100 280 C 250 170, 510 370, 850 250 C 1130 150, 1310 320, 1580 230"
          stroke="#7C583C"
          strokeWidth="0.9"
          strokeDasharray="6 8"
        />
        <path
          d="M-140 640 C 180 530, 520 740, 890 610 C 1180 510, 1340 690, 1580 590"
          stroke="#1F4722"
          strokeWidth="1.1"
        />
        <path
          d="M-110 710 C 210 600, 550 810, 920 680 C 1210 580, 1370 760, 1600 660"
          stroke="#6E8248"
          strokeWidth="0.9"
        />
      </svg>
    </div>
  );
}
