'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';

export function HeroEntrance({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  return <motion.div className="hero-preview" initial={false} animate={reduced ? undefined : { opacity: [0.86, 1], y: [8, 0] }} transition={{duration:0.42,ease:'easeOut'}}>{children}</motion.div>;
}
