"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/auth";
import AppShell from "@/components/AppShell";
import ProgressCircle from "@/components/ProgressCircle";
import ScheduleList from "@/components/ScheduleList";
import Link from "next/link";

export default function DashboardPage() {
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const [schedule, setSchedule] = useState<any[]>([]);
  const [stats, setStats] = useState({ modules: 0, progress: 0 });
  const [isDataLoading, setIsDataLoading] = useState(true);

  // 1. Manejo de Redirección Protegida
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, authLoading, router]);

  // 2. Carga de Datos Reales de Supabase
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) return;
      setIsDataLoading(true);

      try {
        // Obtener prefijo de carrera (SIST, CRIM, VET, etc) para el horario
        const programName = user.program || "";
        const prefix = programName.split(' ')[2]?.substring(0, 3).toUpperCase() || "SIST";

        // Query A: Materias e Inscripciones (Para Stats y Progreso)
        const { data: studentSubjects, count } = await supabase
          .from("student_subjects")
          .select(`progress, subjects!inner(id, name, code)`, { count: 'exact' })
          .eq('student_id', user.id);

        // Query B: Horario filtrado por la carrera del usuario
        const { data: scheduleData } = await supabase
          .from("schedules")
          .select(`*, subjects!inner(name, code)`)
          .ilike('subjects.code', `${prefix}%`)
          .order('day', { ascending: true });

        // Cálculos
        const totalProgress = studentSubjects?.length 
          ? Math.round(studentSubjects.reduce((acc, s) => acc + s.progress, 0) / studentSubjects.length)
          : 0;

        setSchedule(scheduleData || []);
        setStats({
          modules: count || 0,
          progress: totalProgress
        });
      } catch (error) {
        console.error("Error en Dashboard:", error);
      } finally {
        setIsDataLoading(false);
      }
    };

    if (isLoggedIn && user?.id) {
      fetchDashboardData();
    }
  }, [user, isLoggedIn]);

  // Formateador para el componente ScheduleList
  const formattedSchedule: any = useMemo(() => 
    schedule.map(s => ({
      id: s.id,
      day: s.day,
      time: s.time_range,
      subjectName: s.subjects?.name || "Materia",
      location: s.location,
      teacher: s.teacher
    })), [schedule]);

  // Evitamos que la pantalla se quede oscura bloqueando el renderizado
  return (
    <AppShell>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="max-w-5xl mx-auto space-y-8 pb-10"
      >
        {/* Banner de Bienvenida Simplificado */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            
            <div className="space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 border border-blue-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest">Estudiante en Línea</span>
              </div>
              
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {isDataLoading ? "Cargando..." : `Hola, ${user?.name?.split(' ')[0]}`}
                </h1>
                <p className="text-slate-400 text-sm font-medium">
                  {user?.program || "Politécnico Compuoriente"}
                </p>
              </div>
            </div>

            {/* Stats Compactas */}
            <div className="flex items-center gap-10">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{stats.modules}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Módulos</p>
              </div>
              <div className="h-12 w-px bg-white/10" />
              <ProgressCircle value={stats.progress} size="md" />
            </div>
          </div>
        </div>

        {/* Sección de Horario Personalizado */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Mi Horario Semanal
          </h2>

          <div className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden shadow-xl">
            {isDataLoading ? (
              <div className="p-20 flex justify-center">
                <div className="h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : formattedSchedule.length > 0 ? (
              <ScheduleList entries={formattedSchedule} />
            ) : (
              <div className="p-16 text-center">
                <p className="text-slate-500 text-sm italic">No hay clases programadas para tu carrera esta semana.</p>
              </div>
            )}
          </div>
        </section>

        {/* Accesos Directos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/materias" className="group p-6 bg-blue-600 hover:bg-blue-500 rounded-2xl transition-all shadow-lg shadow-blue-900/40 text-center">
            <span className="text-white font-bold block group-hover:scale-105 transition-transform">IR A MIS CLASES</span>
          </Link>
          <Link href="/aulas-virtuales" className="group p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all text-center">
            <span className="text-slate-300 font-bold block group-hover:text-white">AULAS VIRTUALES</span>
          </Link>
        </div>

      </motion.div>
    </AppShell>
  );
}