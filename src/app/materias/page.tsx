"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll, useTransform, Variants } from "framer-motion";
import AppShell from "@/components/AppShell";
import { useAuth } from "@/providers/auth";
import { supabase } from "@/lib/supabase";

// Mantenemos tus variantes y colores para la UI
const subjectColors = [
  { primary: "#3b82f6", secondary: "#8b5cf6", accent: "#60a5fa" },
  { primary: "#ec4899", secondary: "#f43f5e", accent: "#f472b6" },
  { primary: "#10b981", secondary: "#06b6d4", accent: "#34d399" },
  { primary: "#f59e0b", secondary: "#ef4444", accent: "#fbbf24" },
];

export default function MateriasPage() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  
  // ESTADOS PARA DATOS REALES
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [hoveredSubject, setHoveredSubject] = useState<string | null>(null);

  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  // 1. CARGAR MATERIAS DESDE SUPABASE
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
      return;
    }

    const fetchSubjects = async () => {
      setIsLoading(true);
      try {
        // Consultamos las materias y los temas relacionados
        const { data, error } = await supabase
          .from("subjects")
          .select(`
            *,
            themes (id),
            student_subjects!inner (progress)
          `)
          .eq("student_subjects.student_id", user?.id);

        if (error) throw error;
        
        // Mapeamos para facilitar el acceso al progreso
        const formatted = data.map(s => ({
          ...s,
          progress: s.student_subjects[0]?.progress || 0
        }));

        setSubjects(formatted);
      } catch (err) {
        console.error("Error cargando materias:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubjects();
  }, [isLoggedIn, user, router]);

  const filteredSubjects = filter === "all" 
    ? subjects 
    : subjects.filter(s => s.progress > 0 && s.progress < 100);

  const globalProgress = subjects.length > 0 
    ? Math.round(subjects.reduce((acc, s) => acc + s.progress, 0) / subjects.length)
    : 0;

  if (isLoading) return (
    <AppShell>
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    </AppShell>
  );

  return (
    <AppShell>
      <div className="relative min-h-screen">
        {/* Tu fondo de video y gradientes se mantienen igual... */}
        
        <div className="relative z-10 space-y-8 max-w-7xl mx-auto pb-20">
          <motion.header
            style={{ opacity: headerOpacity }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl shadow-2xl"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-white">Mis Módulos</h1>
                <p className="text-slate-400 text-sm">
                  Carrera: <span className="text-blue-400 font-bold">{user?.program}</span>
                </p>
              </div>

              {/* Botones de Filtro */}
              <div className="flex gap-2">
                <button 
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === 'all' ? 'bg-white text-black' : 'bg-white/5 text-white border border-white/10'}`}
                >
                  TODOS
                </button>
                <button 
                  onClick={() => setFilter("active")}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === 'active' ? 'bg-white text-black' : 'bg-white/5 text-white border border-white/10'}`}
                >
                  EN CURSO
                </button>
              </div>
            </div>

            {/* Barra de Progreso Global Real */}
            <div className="mt-8 pt-6 border-t border-white/5">
              <div className="flex justify-between items-center mb-2 text-xs font-bold uppercase tracking-widest">
                <span className="text-slate-400">Progreso de Carrera</span>
                <span className="text-white">{globalProgress}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${globalProgress}%` }}
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                />
              </div>
            </div>
          </motion.header>

          {/* Grid de Materias */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {filteredSubjects.map((subject, index) => {
                const colors = subjectColors[index % subjectColors.length];
                return (
                  <motion.div
                    key={subject.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5 }}
                    className="group relative"
                  >
                    <Link href={`/materias/${subject.id}`}>
                      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-1 transition-all group-hover:border-white/30">
                        {/* Cabecera de la Card */}
                        <div 
                          className="h-24 rounded-t-xl opacity-40 transition-opacity group-hover:opacity-60"
                          style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` }}
                        />
                        
                        <div className="p-5">
                          <span className="text-[10px] font-mono font-bold text-blue-300/60 uppercase">{subject.code}</span>
                          <h3 className="text-lg font-bold text-white mt-1 group-hover:text-blue-400 transition-colors">
                            {subject.name}
                          </h3>
                          
                          <div className="mt-6 flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-[10px] text-slate-500 font-bold uppercase">Progreso</span>
                              <span className="text-sm font-bold text-white">{subject.progress}%</span>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                          
                          {/* Mini Progress Bar */}
                          <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                            <div 
                              className="h-full transition-all duration-1000"
                              style={{ width: `${subject.progress}%`, backgroundColor: colors.accent }}
                            />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </AppShell>
  );
}