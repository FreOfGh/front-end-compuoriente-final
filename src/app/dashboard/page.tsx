"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, useSpring, AnimatePresence, Variants } from "framer-motion";
import AppShell from "@/components/AppShell";
import ProgressCircle from "@/components/ProgressCircle";
import ScheduleList from "@/components/ScheduleList";
import { mockSchedule, mockStudent } from "@/lib/mockData";
import { useAuth } from "@/providers/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Variantes de animación
// Variantes de animación
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, rotateX: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 80,
      damping: 12,
    },
  },
};

export default function DashboardPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    } else {
      setIsLoaded(true);
    }
  }, [isLoggedIn, router]);

  if (!isLoaded) return null;

  return (
    <AppShell>
      {/* Barra de progreso de scroll */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 origin-left z-50"
        style={{ scaleX }}
      />

      <motion.div
        className="relative space-y-8 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section con Glassmorphism Avanzado */}
        <motion.header
          variants={cardVariants}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl"
        >
          {/* Efectos de fondo animados */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute -top-20 -right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                x: [0, -100, 0],
                y: [0, 50, 0],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"
            />
          </div>

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            {/* Texto de bienvenida animado */}
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs font-medium text-slate-300">
                  Sesión activa • {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                </span>
              </motion.div>

              <div className="space-y-2">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-sm font-medium text-blue-400"
                >
                  Hola, {mockStudent.name} 👋
                </motion.p>
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent lg:text-5xl"
                >
                  Bienvenido a tu
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    Espacio Académico
                  </span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="max-w-lg text-sm text-slate-400 leading-relaxed"
                >
                  Consulta tu horario semanal, monitorea tu progreso académico y 
                  accede a todas tus Módulos activos desde un solo lugar.
                </motion.p>
              </div>

              {/* Stats rápidas (Corregido Tailwind) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap gap-3 pt-2"
              >
                {[
                  { label: "Módulos", value: "6", colorClass: "text-blue-400" },
                  { label: "Créditos", value: "18", colorClass: "text-purple-400" },
                  { label: "Promedio", value: "4.2", colorClass: "text-emerald-400" },
                ].map((stat) => (
                  <motion.div
                    key={stat.label}
                    whileHover={{ scale: 1.05, y: -2 }}
                    onHoverStart={() => setHoveredStat(stat.label)}
                    onHoverEnd={() => setHoveredStat(null)}
                    className="relative group cursor-default"
                  >
                    <div className={`rounded-xl border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm transition-all duration-300 ${hoveredStat === stat.label ? 'border-white/30 bg-white/10' : ''}`}>
                      <span className={`text-lg font-bold ${stat.colorClass}`}>{stat.value}</span>
                      <span className="ml-1.5 text-xs text-slate-400">{stat.label}</span>
                    </div>
                    {hoveredStat === stat.label && (
                      <motion.div
                        layoutId="statHighlight"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 -z-10 blur-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Card de Progreso Mejorada */}
            <motion.div
              variants={itemVariants}
              className="relative flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-md lg:min-w-[280px]"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 transition-opacity duration-500 hover:opacity-100" />
              
              <div className="relative">
                <ProgressCircle 
                  value={mockStudent.progress} 
                  label="Avance del Programa"
                  size="lg"
                  showGlow={true}
                  onComplete={() => console.log("¡Progreso completado!")}
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="w-full space-y-3"
              >
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Semestre actual</span>
                  <span className="text-white font-medium">4to de 8</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "50%" }}
                    transition={{ delay: 1.2, duration: 1.5, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                  />
                </div>
                
                {/* Corregido error de anidación <Link> -> <button> */}
                <Link href="/materias" className="block mt-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 cursor-pointer"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Ver Módulos activos
                      <motion.svg
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </motion.svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.header>

        {/* Sección de Horario */}
        <motion.section variants={itemVariants} className="space-y-6">
          <motion.div 
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/20">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Horario de Clases
                </h2>
                <p className="text-sm text-slate-400">
                  Semana del {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                </p>
              </div>
            </div>

            <motion.div 
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md"
              whileHover={{ scale: 1.05 }}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
              </span>
              <span className="text-xs font-medium text-slate-300">
                Actualizado hace unos minutos
              </span>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="relative"
          >
            {/* Decoración de fondo */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 blur-xl -z-10" />
            
            <ScheduleList entries={mockSchedule} />
          </motion.div>
        </motion.section>

        {/* Floating Action Button para móvil (Corregido anidación y z-index) */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, type: "spring" }}
          className="fixed bottom-6 right-6 lg:hidden z-50"
        >
          <Link href="/materias">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl shadow-blue-500/40 cursor-pointer"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>
    </AppShell>
  );
}