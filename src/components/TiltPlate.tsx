import { useRef, type ReactNode } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from 'motion/react';

interface TiltPlateProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
  onClick?: (trigger: HTMLDivElement) => void;
  ariaLabel?: string;
}

/**
 * Marco interactivo con física 3D sutil y reflejo cálido de luz solar
 */
export default function TiltPlate({
  children,
  className = '',
  maxTilt = 4.5,
  onClick,
  ariaLabel,
}: TiltPlateProps) {
  const ref = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const smoothX = useSpring(mouseX, { stiffness: 220, damping: 26 });
  const smoothY = useSpring(mouseY, { stiffness: 220, damping: 26 });

  const rotateX = useTransform(smoothY, [0, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(smoothX, [0, 1], [-maxTilt, maxTilt]);

  const glareX = useTransform(smoothX, [0, 1], [0, 100]);
  const glareY = useTransform(smoothY, [0, 1], [0, 100]);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 251, 244, 0.32) 0%, transparent 62%)`;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch' || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    mouseX.set(Math.max(0, Math.min(1, px)));
    mouseY.set(Math.max(0, Math.min(1, py)));
  };

  const handlePointerLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const handleClick = () => {
    if (onClick && ref.current) onClick(ref.current);
  };

  return (
    <div className="perspective-stage">
      <motion.div
        ref={ref}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={onClick ? handleClick : undefined}
        onKeyDown={
          onClick
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleClick();
                }
              }
            : undefined
        }
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        aria-label={ariaLabel}
        className={`relative will-change-transform ${className}`}
      >
        {children}
        <motion.div
          style={{ background: glareBackground }}
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 hover:opacity-100 transition-opacity duration-300"
          aria-hidden="true"
        />
      </motion.div>
    </div>
  );
}
