"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { ScheduleEntry } from "@/lib/mockData";

interface ScheduleListProps {
  entries: ScheduleEntry[];
  highlightCurrent?: boolean;
}

const dayColors: Record<string, string[]> = {
  Lunes: ["#3b82f6", "#1d4ed8"],      // Blue
  Martes: ["#8b5cf6", "#6d28d9"],     // Violet
  Miércoles: ["#ec4899", "#be185d"],  // Pink
  Jueves: ["#f59e0b", "#d97706"],     // Amber
  Viernes: ["#10b981", "#059669"],    // Emerald
  Sábado: ["#6366f1", "#4f46e5"],     // Indigo
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 50, 
    scale: 0.8,
    rotateX: -15,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.5,
    transition: { duration: 0.2 },
  },
};

export default function ScheduleList({ entries, highlightCurrent = true }: ScheduleListProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Actualizar hora actual cada minuto para highlight de clase actual
  useEffect(() => {
    if (!highlightCurrent) return;
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, [highlightCurrent]);

  // Función para determinar si una clase está en curso (mock logic)
  const isCurrentClass = (entry: ScheduleEntry) => {
    if (!highlightCurrent) return false;
    // Lógica simple: si el día coincide y la hora está en rango (mock)
    const currentDay = currentTime.toLocaleDateString('es-ES', { weekday: 'long' });
    return entry.day.toLowerCase() === currentDay.toLowerCase() && entry.time.includes(":");
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 py-8">
      {/* Video de fondo educativo */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover opacity-30"
          poster="https://images.pexels.com/photos/5940841/pexels-photo-5940841.jpeg"
        >
          <source
            src="https://videos.pexels.com/video-files/2048065/2048065-hd_1920_1080_24fps.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/60 to-slate-950/90" />
      </div>

      {/* Grid de horarios */}
      <motion.div
        className="relative z-10 mx-auto max-w-7xl px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="mb-8 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
          >
            Mi Horario
          </motion.h2>
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mx-auto mt-2 h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          />
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 perspective-1000">
          <AnimatePresence mode="popLayout">
            {entries.map((entry, index) => {
              const colors = dayColors[entry.day] || ["#64748b", "#475569"];
              const isCurrent = isCurrentClass(entry);
              const isHovered = hoveredId === entry.id;

              return (
                <motion.div
                  key={entry.id}
                  layout
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.03, 
                    y: -5,
                    transition: { type: "spring", stiffness: 300, damping: 20 }
                  }}
                  whileTap={{ scale: 0.98 }}
                  onHoverStart={() => setHoveredId(entry.id)}
                  onHoverEnd={() => setHoveredId(null)}
                  className="group relative"
                >
                  {/* Efecto de glow dinámico */}
                  <motion.div
                    className="absolute -inset-0.5 rounded-2xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-70"
                    style={{
                      background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
                    }}
                    animate={{
                      opacity: isHovered ? 0.6 : 0,
                      scale: isHovered ? 1.05 : 1,
                    }}
                  />

                  {/* Card principal */}
                  <div className={`
                    relative overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300
                    ${isCurrent 
                      ? 'border-white/30 bg-white/10 shadow-[0_0_30px_rgba(59,130,246,0.3)]' 
                      : 'border-white/10 bg-white/5 group-hover:border-white/20 group-hover:bg-white/10'
                    }
                  `}>
                    
                    {/* Barra de color superior animada */}
                    <motion.div 
                      className="h-1 w-full"
                      style={{ background: `linear-gradient(90deg, ${colors[0]}, ${colors[1]})` }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
                    />

                    {/* Indicador "En Curso" */}
                    {isCurrent && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="absolute right-3 top-3 flex items-center gap-1.5"
                      >
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                        </span>
                        <span className="text-[10px] font-bold text-green-400 uppercase tracking-wider">Ahora</span>
                      </motion.div>
                    )}

                    <div className="p-5">
                      {/* Header con día y hora */}
                      <div className="flex items-start justify-between mb-4">
                        <motion.div 
                          className="flex flex-col"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 + 0.2 }}
                        >
                          <span 
                            className="text-xs font-bold uppercase tracking-widest"
                            style={{ color: colors[0] }}
                          >
                            {entry.day}
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5">
                            Semana {Math.ceil((new Date().getDate()) / 7)}
                          </span>
                        </motion.div>

                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 border border-white/5"
                        >
                          <svg className="w-3.5 h-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-xs font-mono font-semibold text-slate-200">
                            {entry.time}
                          </span>
                        </motion.div>
                      </div>

                      {/* Nombre de la materia */}
                      <motion.h3 
                        className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-transparent group-hover:bg-clip-text transition-all duration-300"
                        style={{
                          backgroundImage: `linear-gradient(135deg, white, ${colors[0]})`,
                          backgroundSize: "200% 200%",
                        }}
                        whileHover={{ backgroundPosition: "100% 0" }}
                      >
                        {entry.subjectName}
                      </motion.h3>

                      {/* Detalles con iconos */}
                      <div className="space-y-2 mt-4">
                        <motion.div 
                          className="flex items-center gap-2 text-sm text-slate-300"
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 + 0.3 }}
                        >
                          <div className="p-1.5 rounded-lg bg-white/5 text-slate-400">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <span className="truncate">{entry.location}</span>
                        </motion.div>

                        <motion.div 
                          className="flex items-center gap-2 text-sm text-slate-300"
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 + 0.4 }}
                        >
                          <div className="p-1.5 rounded-lg bg-white/5 text-slate-400">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <span className="truncate">{entry.teacher}</span>
                        </motion.div>
                      </div>

                      {/* Barra de progreso decorativa */}
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1.5">
                          <span>Progreso</span>
                          <span>{Math.floor(Math.random() * 30 + 70)}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: `linear-gradient(90deg, ${colors[0]}, ${colors[1]})` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.floor(Math.random() * 30 + 70)}%` }}
                            transition={{ delay: index * 0.1 + 0.5, duration: 1, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Efecto de brillo en hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {entries.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-4">
              <svg className="w-10 h-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-slate-400 text-lg">No hay clases programadas</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}