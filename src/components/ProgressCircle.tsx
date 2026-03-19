"use client";

import { useEffect, useState, useRef } from "react";
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
  
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayValue, setDisplayValue] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Springs físicos para animación natural
  const progress = useMotionValue(0);
  const springProgress = useSpring(progress, {
    stiffness: 50,
    damping: 20,
    mass: 1,
  });

  const strokeDashoffset = useTransform(
    springProgress,
    [0, 100],
    [circumference, 0]
  );

  // Animación de contador numérico
  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const startTime = Date.now();
      const startValue = displayValue;
      
      const animate = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing ease-out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = startValue + (value - startValue) * easeOut;
        
        setDisplayValue(current);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else if (value >= 100 && !showConfetti) {
          setShowConfetti(true);
          onComplete?.();
        }
      };
      
      requestAnimationFrame(animate);
      progress.set(value);
    }
  }, [value, isInView, displayValue, progress, onComplete, showConfetti]);

  // Colores dinámicos basados en el valor
  const getGradientColors = (val: number) => {
    if (val >= 100) return ["#10b981", "#34d399", "#6ee7b7"]; // Emerald
    if (val >= 75) return ["#3b82f6", "#8b5cf6", "#d946ef"]; // Blue to Purple
    if (val >= 50) return ["#f59e0b", "#f97316", "#ef4444"]; // Orange to Red
    return ["#ef4444", "#f87171", "#fca5a5"]; // Red tones
  };

  const colors = getGradientColors(value);
  const gradientId = `gradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <motion.div
      ref={ref}
      className="relative flex flex-col items-center justify-center gap-4"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow Effect */}
      <AnimatePresence>
        {showGlow && value > 0 && (
          <motion.div
            className="absolute inset-0 rounded-full blur-3xl"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: isHovered ? 0.6 : 0.3,
              scale: isHovered ? 1.2 : 1,
            }}
            exit={{ opacity: 0 }}
            style={{
              background: `radial-gradient(circle, ${colors[1]}40 0%, transparent 70%)`,
            }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Confetti Celebration */}
      <AnimatePresence>
        {showConfetti && (
          <>
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                initial={{ 
                  scale: 0,
                  x: 0,
                  y: 0,
                  backgroundColor: colors[i % colors.length],
                }}
                animate={{
                  scale: [0, 1, 0],
                  x: Math.cos((i * 30 * Math.PI) / 180) * 80,
                  y: Math.sin((i * 30 * Math.PI) / 180) * 80,
                  opacity: [1, 1, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 1,
                  delay: i * 0.05,
                  ease: "easeOut",
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* SVG Container */}
      <div className="relative" style={{ width: radius * 2, height: radius * 2 }}>
        <motion.svg
          width={radius * 2}
          height={radius * 2}
          className="rotate-[-90deg] drop-shadow-2xl"
          whileHover={{ scale: 1.05, rotate: -85 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <defs>
            {/* Gradiente dinámico */}
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors[0]} />
              <stop offset="50%" stopColor={colors[1]} />
              <stop offset="100%" stopColor={colors[2]} />
            </linearGradient>
            
            {/* Filtro de glow */}
            <filter id={`glow-${gradientId}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Círculo de fondo con glassmorphism */}
          <circle
            stroke="rgba(255,255,255,0.1)"
            fill="rgba(255,255,255,0.02)"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            className="backdrop-blur-sm"
          />

          {/* Círculo de progreso animado */}
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
              filter: isHovered ? `url(#glow-${gradientId})` : "none",
            }}
            initial={{ strokeDashoffset: circumference }}
          />

          {/* Círculo decorativo de puntos */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x = radius + Math.cos(angle) * (normalizedRadius + stroke + 4);
            const y = radius + Math.sin(angle) * (normalizedRadius + stroke + 4);
            return (
              <motion.circle
                key={i}
                cx={x}
                cy={y}
                r={1.5}
                fill={colors[1]}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: value >= (i + 1) * 8.33 ? 1 : 0.2,
                  scale: value >= (i + 1) * 8.33 ? 1.2 : 1,
                }}
                transition={{ delay: i * 0.05 }}
              />
            );
          })}
        </motion.svg>

        {/* Contenido Central */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`${fontSize} font-bold bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent drop-shadow-lg`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.span
              key={Math.round(displayValue)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {Math.round(displayValue)}%
            </motion.span>
          </motion.span>
          
          {value >= 100 && (
            <motion.svg
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.5 }}
              className="absolute -bottom-2 w-6 h-6 text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </motion.svg>
          )}
        </div>
      </div>

      {/* Label Animado */}
      {label && (
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.span
            className="text-xs font-medium uppercase tracking-widest text-slate-400"
            animate={{
              color: isHovered ? colors[1] : "rgb(148, 163, 184)",
            }}
            transition={{ duration: 0.3 }}
          >
            {label}
          </motion.span>
          
          {/* Barra de progreso lineal debajo del label */}
          <motion.div
            className="mt-2 h-1 rounded-full overflow-hidden bg-white/10"
            initial={{ width: 0 }}
            animate={{ width: 60 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ 
                background: `linear-gradient(90deg, ${colors[0]}, ${colors[1]})`,
                width: `${value}%`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(value, 100)}%` }}
              transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
            />
          </motion.div>
        </motion.div>
      )}

      {/* Tooltip flotante en hover */}
      <AnimatePresence>
        {isHovered && value < 100 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            className="absolute -top-12 px-3 py-1.5 rounded-lg bg-slate-800/90 backdrop-blur-md border border-white/10 text-xs font-medium text-white shadow-xl whitespace-nowrap"
          >
            {Math.round(100 - value)}% restante
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-slate-800/90 rotate-45 border-r border-b border-white/10" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}