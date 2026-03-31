"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase"; // Asegúrate de tener tu cliente configurado

const navItems = [
  { 
    href: "/dashboard", 
    label: "Inicio",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  { 
    href: "/materias", 
    label: "Módulos",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )
  },
  { 
    href: "/aulas-virtuales", 
    label: "Aulas virtuales",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- FUNCIÓN DE LOGOUT CON SUPABASE ---
  const onLogout = async () => {
    try {
      await supabase.auth.signOut(); // Cierra sesión en Supabase
      logout(); // Limpia el estado global de tu AuthProvider
      router.replace("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Video de fondo educativo */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover opacity-40"
          poster="https://images.pexels.com/photos/5940841/pexels-photo-5940841.jpeg"
        >
          <source
            src="https://videos.pexels.com/video-files/5940841/5940841-hd_1920_1080_24fps.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-blue-950/90" />
      </div>

      {/* Partículas flotantes */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Header dinámico */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`sticky top-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? "bg-white/10 backdrop-blur-xl border-b border-white/10 shadow-2xl" 
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <motion.div className="flex items-center gap-4" whileHover={{ scale: 1.02 }}>
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000" />
              <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-md flex items-center justify-center overflow-hidden">
                <img src="/logo.png" alt="Logo" className="w-10 h-10 object-contain" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent uppercase">
                Compuoriente
              </h1>
              <p className="text-[10px] text-blue-300/80 font-bold tracking-[0.2em]">POLITÉCNICO</p>
            </div>
          </motion.div>

          <div className="flex items-center gap-4">
            <motion.div className="hidden sm:flex flex-col items-end">
              <p className="text-sm font-semibold text-white">
                {user?.name || "Estudiante"}
              </p>
              <p className="text-[10px] uppercase tracking-tighter text-blue-200/60 font-bold">
                {user?.program || "Sin programa asignado"}
              </p>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogout}
              className="group relative px-5 py-2 rounded-full overflow-hidden border border-white/10"
            >
              <div className="absolute inset-0 bg-red-600/10 group-hover:bg-red-600 transition-colors" />
              <span className="relative text-xs font-bold text-white flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                SALIR
              </span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Layout principal */}
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-72">
          <nav className="sticky top-24 space-y-2">
            <motion.div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-2">
              <div className="px-4 py-3 border-b border-white/5 mb-2">
                <p className="text-[10px] font-bold text-blue-300/50 uppercase tracking-widest">
                  Menú Principal
                </p>
              </div>
              <ul className="space-y-1 p-2">
                {navItems.map((item, index) => {
                  const active = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link href={item.href}>
                        <motion.div
                          className={`group relative flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all ${
                            active 
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                              : "text-slate-400 hover:text-white hover:bg-white/5"
                          }`}
                          onHoverStart={() => setHoveredNav(item.href)}
                          onHoverEnd={() => setHoveredNav(null)}
                        >
                          <div className={active ? "text-white" : "text-blue-400/50"}>
                            {item.icon}
                          </div>
                          <span className="font-bold text-xs uppercase tracking-wide">{item.label}</span>
                        </motion.div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </motion.div>

            {/* Progreso dinámico del estudiante */}
            <motion.div className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/10 to-purple-600/10 backdrop-blur-xl p-5">
              <p className="text-[10px] font-bold text-blue-300/50 uppercase mb-3">Tu Progreso</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-bold text-lg">{user?.progress || 0}%</span>
                <span className="text-[10px] text-blue-200/50 italic">Semestre 2026-I</span>
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${user?.progress || 0}%` }}
                  className="h-full bg-gradient-to-r from-blue-400 to-purple-400" 
                />
              </div>
            </motion.div>
          </nav>
        </aside>

        {/* Contenido principal */}
        <main className="w-full min-h-[calc(100vh-200px)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 lg:p-8"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <footer className="relative z-10 mt-auto border-t border-white/10 bg-black/20 py-6">
        <div className="mx-auto max-w-7xl px-4 flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          <p>© 2026 Politécnico Compuoriente</p>
          <p>Marinilla - Antioquia</p>
        </div>
      </footer>
    </div>
  );
}