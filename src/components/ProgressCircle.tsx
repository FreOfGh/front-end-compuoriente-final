"use client";

import { useEffect, useState, useRef, useId } from "react";
import { motion, useSpring, useTransform, useMotionValue, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";

interface ProgressCircleProps {
  value: number;
  label?: string;
  size?: "sm" | "md" | "lg";
  showGlow?: boolean;
  onComplete?: () => void;
}

const sizeConfig = {
  sm: { radius: 30, stroke: 4, fontSize: "text-lg" },
  md: { radius: 50, stroke: 6, fontSize: "text-3xl" },
  lg: { radius: 70, stroke: 8, fontSize: "text-4xl" },
};

export default function ProgressCircle({
  value,
  label,
  size = "md",
  showGlow = true,
  onComplete,
}: ProgressCircleProps) {
  const { radius, stroke, fontSize } = sizeConfig[size];
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  
  // ID único para los gradientes SVG (Evita errores de hidratación)
  const gradientId = useId();
  
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Springs físicos
  const progress = useMotionValue(0);
  const springProgress = useSpring(progress, {
    stiffness: 40,
    damping: 15,
  });

  const strokeDashoffset = useTransform(
    springProgress,
    [0, 100],
    [circumference, 0]
  );

  useEffect(() => {
    if (isInView) {
      const duration = 1500;
      const startTime = Date.now();
      const startValue = displayValue;
      
      const animate = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const p = Math.min(elapsed / duration, 1);
        
        const easeOut = 1 - Math.pow(1 - p, 3);
        const current = startValue + (value - startValue) * easeOut;
        
        setDisplayValue(current);
        
        if (p < 1) {
          requestAnimationFrame(animate);
        } else if (value >= 100 && !showConfetti) {
          setShowConfetti(true);
          onComplete?.();
        }
      };
      
      requestAnimationFrame(animate);
      progress.set(value);
    }
  }, [value, isInView, progress, onComplete]); // Quitamos displayValue de dependencias para evitar loops

  const getGradientColors = (val: number) => {
    if (val >= 100) return ["#10b981", "#34d399", "#6ee7b7"];
    if (val >= 75) return ["#3b82f6", "#8b5cf6", "#d946ef"];
    if (val >= 50) return ["#f59e0b", "#f97316", "#ef4444"];
    return ["#ef4444", "#f87171", "#fca5a5"];
  };

  const colors = getGradientColors(value);

  return (
    <motion.div
      ref={ref}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      className="relative flex flex-col items-center justify-center gap-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow Effect */}
      <AnimatePresence>
        {showGlow && value > 0 && (
          <motion.div
            className="absolute inset-0 rounded-full blur-3xl pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: isHovered ? 0.4 : 0.2,
              scale: isHovered ? 1.1 : 1,
            }}
            style={{
              background: `radial-gradient(circle, ${colors[1]}60 0%, transparent 70%)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* SVG Container */}
      <div className="relative" style={{ width: radius * 2, height: radius * 2 }}>
        <svg
          width={radius * 2}
          height={radius * 2}
          className="rotate-[-90deg] drop-shadow-xl"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors[0]} />
              <stop offset="100%" stopColor={colors[1]} />
            </linearGradient>
          </defs>

          {/* Círculo de fondo */}
          <circle
            stroke="rgba(255,255,255,0.05)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />

          {/* Círculo de progreso */}
          <motion.circle
            stroke={`url(#${gradientId})`}
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset,
            }}
          />
        </svg>

        {/* Texto Central */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${fontSize} font-bold text-white tracking-tighter`}>
            {Math.round(displayValue)}%
          </span>
        </div>
      </div>

      {label && (
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
          {label}
        </span>
      )}
    </motion.div>
  );
}