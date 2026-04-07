"use client";

import Link from "next/link";
import { Wifi, Home, BookOpen, LogOut, User, GraduationCap, ChevronRight, VideoIcon,CheckCheckIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../app/api/api";
const navItems = [
  { 
    href: "/", 
    label: "Inicio",
    icon: Home,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20"
  },
  { 
    href: "/materias", 
    label: "Módulos",
    icon: BookOpen,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20"
  },
  { 
    href: "/aulas-virtuales", 
    label: "Aulas virtuales",
    icon: Wifi,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20"
  },
    { 
    href: "/grabaciones", 
    label: "Clases grabadas",
    icon: VideoIcon,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20"
  },
  { 
    href: "/notas", 
    label: "Notas",
    icon: CheckCheckIcon,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20"
  },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout, setUser } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await api.get("/me");
        setUser(data);
        setProgress(data.progress || 0);
      } catch (err) {
        console.error("Error cargando usuario:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [setUser]);

  const onLogout = async () => {
    try {
      await api.post("/logout");
      localStorage.removeItem("token");
      logout();
      router.replace("/login");
    } catch (error) {
      console.error("Error logout:", error);
    }
  };

  // Animación de entrada para el progreso
  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        // La animación se maneja con CSS
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoading, progress]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      
      {/* HEADER MODERNO SIN BLUR */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          isScrolled 
            ? "bg-slate-900/95 border-slate-800 shadow-2xl shadow-black/50" 
            : "bg-slate-900 border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo y Brand */}
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg opacity-50 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-700">
                  <GraduationCap className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">
                  Compuoriente
                </h1>
                <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                  Politécnico
                </p>
              </div>
            </div>

            {/* User Info y Logout */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white leading-tight">
                    {user?.name || "Estudiante"}
                  </p>
                  <p className="text-xs text-slate-400 leading-tight">
                    {user?.program || "Sin programa"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* LAYOUT PRINCIPAL */}
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* SIDEBAR ELEGANTE */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="sticky top-24 space-y-6">
              
              {/* Navegación */}
              <nav className="bg-slate-900 rounded-2xl border border-slate-800 p-2 shadow-xl shadow-black/20">
                <div className="px-4 py-3 border-b border-slate-800 mb-2">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Menú Principal
                  </p>
                </div>
                <ul className="space-y-1">
                  {navItems.map((item) => {
                    const active = pathname === item.href;
                    const Icon = item.icon;
                    
                    return (
                      <li key={item.href}>
                        <Link href={item.href}>
                          <motion.div
                            whileHover={{ x: 4 }}
                            className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                              active 
                                ? `${item.bgColor} ${item.borderColor} border` 
                                : "hover:bg-slate-800/50 border border-transparent"
                            }`}
                          >
                            <div className={`p-2 rounded-lg ${
                              active ? "bg-slate-950" : "bg-slate-800 group-hover:bg-slate-700"
                            } transition-colors`}>
                              <Icon className={`w-5 h-5 ${active ? item.color : "text-slate-400 group-hover:text-slate-300"}`} />
                            </div>
                            <div className="flex-1">
                              <span className={`text-sm font-semibold ${
                                active ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                              }`}>
                                {item.label}
                              </span>
                            </div>
                            {active && (
                              <motion.div
                                layoutId="activeIndicator"
                                className={`w-1.5 h-1.5 rounded-full ${item.color.replace('text-', 'bg-')}`}
                              />
                            )}
                            <ChevronRight className={`w-4 h-4 transition-transform ${
                              active ? "text-slate-600 rotate-90" : "text-slate-600 opacity-0 group-hover:opacity-100"
                            }`} />
                          </motion.div>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Progreso Mejorado */}
              <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl shadow-black/20">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Progreso Académico
                    </p>
                    <p className="text-2xl font-bold text-white">
                      {progress}%
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-2 border-blue-500/30 flex items-center justify-center">
                    <span className="text-xs font-bold text-blue-400">
                      {Math.round(progress / 10)}/100%
                    </span>
                  </div>
                </div>

                {/* Barra de progreso animada */}
                <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="absolute h-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-full"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                  </motion.div>
                </div>

                <div className="mt-4 flex justify-between text-xs text-slate-500">
                  <span>Iniciado</span>
                  <span className="text-slate-400">Meta: 100%</span>
                </div>

            
              </div>


            </div>
          </aside>

          {/* CONTENIDO PRINCIPAL */}
          <main className="flex-1 min-h-[calc(100vh-200px)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-slate-900 rounded-2xl border border-slate-800 p-6 lg:p-8 shadow-xl shadow-black/20 min-h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-slate-900 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-slate-600" />
              <span className="text-sm font-semibold text-slate-400">
                Politécnico Compuoriente
              </span>
            </div>
            <div className="flex items-center gap-6 text-xs text-slate-500">
              <span>© 2026 Todos los derechos reservados</span>
              <span className="hidden sm:inline">•</span>
              <span>Marinilla, Antioquia</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Estilos para animación shimmer */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}