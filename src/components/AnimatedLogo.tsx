'use client';

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions
} from 'framer-motion';
import { useRef } from 'react';

export interface AnimatedLogoProps {
  src: string;
  alt?: string;
  size?: number;
  magnification?: number;
  distance?: number;
  spring?: SpringOptions;
  className?: string;
}

export default function AnimatedLogo({
  src,
  alt = 'Logo',
  size = 50,
  magnification = 70,
  distance = 200,
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  className = ''
}: AnimatedLogoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val: number) => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: size
    };
    return val - rect.x - size / 2;
  });

  const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [size, magnification, size]);
  const animatedSize = useSpring(targetSize, spring);

  return (
    <motion.div
      ref={ref}
      onMouseMove={(e) => {
        isHovered.set(1);
        mouseX.set(e.pageX);
      }}
      onMouseLeave={() => {
        isHovered.set(0);
        mouseX.set(Infinity);
      }}
      style={{
        width: animatedSize,
        height: animatedSize
      }}
      className={`relative inline-flex items-center justify-center rounded-xl overflow-hidden border-2 border-neutral-700 shadow-lg cursor-pointer ${className}`}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        draggable={false}
      />
    </motion.div>
  );
}
