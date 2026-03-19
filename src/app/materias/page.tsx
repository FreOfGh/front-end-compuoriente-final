"use client";

import Link from "next/link";
import { motion, AnimatePresence, useScroll, useTransform, Variants } from "framer-motion";
import AppShell from "@/components/AppShell";
import { mockSubjects } from "@/lib/mockData";
import { useAuth } from "@/providers/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Colores dinámicos para cada materia
const subjectColors = [
  { primary: "#3b82f6", secondary: "#8b5cf6", accent: "#60a5fa" }, // Blue-Purple
  { primary: "#ec4899", secondary: "#f43f5e", accent: "#f472b6" }, // Pink-Red
  { primary: "#10b981", secondary: "#06b6d4", accent: "#34d399" }, // Emerald-Cyan
  { primary: "#f59e0b", secondary: "#ef4444", accent: "#fbbf24" }, // Amber-Red
  { primary: "#8b5cf6", secondary: "#ec4899", accent: "#a78bfa" }, // Violet-Pink
  { primary: "#06b6d4", secondary: "#3b82f6", accent: "#22d3ee" }, // Cyan-Blue
];

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


const cardVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    rotateX: -15,
    scale: 0.9 
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
      mass: 0.8,
    },
  },
};

export default function MateriasPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [hoveredSubject, setHoveredSubject] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const headerScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.98]);

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, router]);

  const filteredSubjects = filter === "all" 
    ? mockSubjects 
    : mockSubjects.filter(s => s.progress > 0);

  return (
    <AppShell>
      <div className="relative min-h-screen">
        {/* Video de fondo educativo */}
        <div className="fixed inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover opacity-25"
            poster="https://images.pexels.com/photos/5940841/pexels-photo-5940841.jpeg"
          >
            <source
              src="https://videos.pexels.com/video-files/3209828/3209828-hd_1920_1080_25fps.mp4"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/90 to-slate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 space-y-8 max-w-7xl mx-auto pb-20">
          {/* Header Animado */}
          <motion.header
            style={{ opacity: headerOpacity, scale: headerScale }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-2">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md"
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    <span className="text-xs font-medium text-slate-300">
                      {mockSubjects.length} Módulos disponibles
                    </span>
                  </motion.div>
                  
                  <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent">
                    Mis Módulos
                  </h1>
                  <p className="text-slate-400 max-w-2xl text-sm lg:text-base leading-relaxed">
                    Explora tu contenido académico: ejes temáticos, clases grabadas, 
                    videos educativos y talleres prácticos.
                  </p>
                </div>

                {/* Filtros */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex gap-2"
                >
                  {[
                    { id: "all", label: "Todas", icon: "📚" },
                    { id: "active", label: "En curso", icon: "▶️" },
                  ].map((f) => (
                    <motion.button
                      key={f.id}
                      onClick={() => setFilter(f.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        filter === f.id
                          ? "bg-white text-slate-900"
                          : "bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <span className="mr-2">{f.icon}</span>
                      {f.label}
                      {filter === f.id && (
                        <motion.div
                          layoutId="activeFilter"
                          className="absolute inset-0 bg-white rounded-xl -z-10"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </motion.button>
                  ))}
                </motion.div>
              </div>

              {/* Barra de progreso global */}
              <div className="mt-8 pt-6 border-t border-white/5">
                <div className="flex justify-between items-center mb-2 text-sm">
                  <span className="text-slate-400">Progreso general del semestre</span>
                  <span className="text-white font-semibold">
                    {Math.round(mockSubjects.reduce((acc, s) => acc + s.progress, 0) / mockSubjects.length)}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${mockSubjects.reduce((acc, s) => acc + s.progress, 0) / mockSubjects.length}%` 
                    }}
                    transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                  />
                </div>
              </div>
            </motion.div>
          </motion.header>

          {/* Grid de Materias */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 perspective-1000"
          >
            <AnimatePresence mode="popLayout">
              {filteredSubjects.map((subject, index) => {
                const colors = subjectColors[index % subjectColors.length];
                const isHovered = hoveredSubject === subject.id;
                const isCompleted = subject.progress === 100;

                return (
                  <motion.div
                    key={subject.id}
                    layout
                    variants={cardVariants}
                    whileHover={{ 
                      y: -8, 
                      scale: 1.02,
                      transition: { type: "spring", stiffness: 300, damping: 20 }
                    }}
                    onHoverStart={() => setHoveredSubject(subject.id)}
                    onHoverEnd={() => setHoveredSubject(null)}
                    className="group relative"
                  >
                    <Link href={`/materias/${subject.id}`}>
                      {/* Glow Effect */}
                      <motion.div
                        className="absolute -inset-0.5 rounded-2xl opacity-0 blur-xl transition-opacity duration-500"
                        style={{
                          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
                        }}
                        animate={{
                          opacity: isHovered ? 0.5 : 0,
                          scale: isHovered ? 1.05 : 1,
                        }}
                      />

                      <div className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-500 group-hover:border-white/30 group-hover:bg-white/10">
                        
                        {/* Header con gradiente */}
                        <div className="relative h-32 overflow-hidden">
                          <motion.div
                            className="absolute inset-0"
                            style={{
                              background: `linear-gradient(135deg, ${colors.primary}40, ${colors.secondary}40)`,
                            }}
                            animate={{
                              opacity: isHovered ? 0.8 : 0.4,
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 to-transparent" />
                          
                          {/* Icono/Code */}
                          <div className="absolute top-4 left-4">
                            <motion.div
                              animate={{ rotate: isHovered ? 5 : 0 }}
                              className="rounded-xl bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5"
                            >
                              <span className="text-xs font-mono font-semibold text-white/90">
                                {subject.code}
                              </span>
                            </motion.div>
                          </div>

                          {/* Progress Badge */}
                          <div className="absolute top-4 right-4">
                            <motion.div
                              animate={{ scale: isHovered ? 1.1 : 1 }}
                              className={`rounded-full px-3 py-1.5 text-xs font-bold backdrop-blur-md border ${
                                isCompleted 
                                  ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" 
                                  : "bg-white/10 border-white/20 text-white"
                              }`}
                            >
                              {subject.progress}%
                              {isCompleted && <span className="ml-1">✓</span>}
                            </motion.div>
                          </div>

                          {/* Título */}
                          <div className="absolute bottom-4 left-4 right-4">
                            <motion.h3
                              className="text-xl font-bold text-white leading-tight"
                              animate={{ y: isHovered ? -2 : 0 }}
                            >
                              {subject.name}
                            </motion.h3>
                          </div>
                        </div>

                        {/* Contenido */}
                        <div className="p-5 space-y-4">
                          {/* Stats */}
                          <div className="flex items-center gap-4 text-xs text-slate-400">
                            <div className="flex items-center gap-1.5">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                              <span>{subject.themes.length} ejes temáticos</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{Math.round(subject.progress / 10)}h contenido</span>
                            </div>
                          </div>

                          {/* Mini Progress Bar */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-400">Avance</span>
                              <span style={{ color: colors.accent }}>{subject.progress}%</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${subject.progress}%` }}
                                transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                                className="h-full rounded-full"
                                style={{ 
                                  background: `linear-gradient(90deg, ${colors.primary}, ${colors.secondary})` 
                                }}
                              />
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-2">
                            <span 
                              className="text-xs font-medium group-hover:translate-x-1 transition-transform"
                              style={{ color: colors.accent }}
                            >
                              Ver detalles
                            </span>
                            <motion.div
                              animate={{ x: isHovered ? 5 : 0 }}
                              className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors"
                            >
                              <svg 
                                className="w-4 h-4 text-white/70" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </motion.div>
                          </div>
                        </div>

                        {/* Shine Effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {filteredSubjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/5 mb-6 border border-white/10">
                <svg className="w-12 h-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No hay módulos activos</h3>
              <p className="text-slate-400">Comienza tu primer curso para verlo aquí.</p>
            </motion.div>
          )}
        </div>
      </div>
    </AppShell>
  );
}