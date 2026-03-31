"use client";

import Link from "next/link";
import { motion, useScroll, useSpring, Variants } from "framer-motion";
import AppShell from "@/components/AppShell";
import ProgressCircle from "@/components/ProgressCircle";
import ScheduleList from "@/components/ScheduleList";
import { useAuth } from "@/providers/auth";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 100 } },
};

export default function DashboardPage() {
  const { user, isLoggedIn, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  // ESTADOS PARA DATOS REALES
  const [schedule, setSchedule] = useState<any[]>([]);
  const [stats, setStats] = useState({ modules: 0, credits: 0, gpa: "0.0" });
  const [isDataLoading, setIsDataLoading] = useState(true);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.replace("/login");
      return;
    }

    const fetchDashboardData = async () => {
      if (!user?.id) return;
      setIsDataLoading(true);

      try {
        // 1. Obtener Horario Real
        const { data: scheduleData } = await supabase
          .from("schedules")
          .select(`*, subjects(name)`)
          .order('day', { ascending: true });

        // 2. Obtener conteo de materias activas
        const { count } = await supabase
          .from("student_subjects")
          .select('*', { count: 'exact', head: true })
          .eq('student_id', user.id);

        setSchedule(scheduleData || []);
        setStats({
          modules: count || 0,
          credits: (count || 0) * 3, // Asumiendo 3 créditos por materia
          gpa: "4.2" // Este dato podría venir de una tabla de notas
        });
      } catch (error) {
        console.error("Error cargando dashboard:", error);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, isLoggedIn, authLoading, router]);

  // Formatear horario para el componente ScheduleList
  const formattedSchedule: any = useMemo(() => {
    return schedule.map(s => ({
      id: s.id,
      day: s.day,
      time: s.time_range,
      subjectName: s.subjects?.name || "Materia",
      location: s.location,
      teacher: s.teacher
    }));
  }, [schedule]);

  if (authLoading || isDataLoading) {
    return (
      <AppShell>
        <div className="flex h-[60vh] items-center justify-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent"
          />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <motion.div className="fixed top-0 left-0 right-0 h-1 bg-blue-500 origin-left z-50" style={{ scaleX }} />

      <motion.div
        className="relative space-y-8 max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.header variants={cardVariants} className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                  Estudiante Activo • {user?.program}
                </span>
              </div>

              <div className="space-y-2">
                <h1 className="text-4xl font-bold text-white lg:text-5xl">
                  Hola, <span className="text-blue-400">{user?.name?.split(' ')[0]}</span> 👋
                </h1>
                <p className="max-w-lg text-sm text-slate-400 leading-relaxed">
                  Bienvenido de nuevo al Politécnico Compuoriente. Aquí tienes el resumen de tus actividades para hoy.
                </p>
              </div>

              {/* Stats Dinámicas */}
              <div className="flex flex-wrap gap-3 pt-4">
                <StatBox label="Módulos" value={stats.modules} color="text-blue-400" />
                <StatBox label="Créditos" value={stats.credits} color="text-purple-400" />
                <StatBox label="Promedio" value={stats.gpa} color="text-emerald-400" />
              </div>
            </div>

            {/* Progreso Real del Usuario */}
            <div className="relative flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 min-w-[280px]">
              <ProgressCircle 
                value={user?.progress || 0} 
                label="Progreso Total"
                size="lg"
                showGlow={true}
              />
              <Link href="/materias" className="w-full">
                <button className="w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white hover:bg-blue-500 transition-all">
                  IR A MIS MÓDULOS
                </button>
              </Link>
            </div>
          </div>
        </motion.header>

        {/* Sección de Horario Real */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Horario Semanal</h2>
            <span className="text-[10px] font-bold text-slate-500 uppercase">Sede Marinilla</span>
          </div>
          
          {formattedSchedule.length > 0 ? (
            <ScheduleList entries={formattedSchedule} />
          ) : (
            <div className="rounded-3xl border border-dashed border-white/10 p-12 text-center">
              <p className="text-slate-500 text-sm italic">No hay clases programadas para esta semana.</p>
            </div>
          )}
        </section>
      </motion.div>
    </AppShell>
  );
}

// Componente auxiliar para las estadísticas
function StatBox({ label, value, color }: { label: string, value: any, color: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
      <span className={`text-lg font-bold ${color}`}>{value}</span>
      <span className="ml-2 text-[10px] font-bold text-slate-500 uppercase">{label}</span>
    </div>
  );
}