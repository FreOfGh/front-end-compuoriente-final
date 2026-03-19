"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
    { 
    href: "/settings", 
    label: "Ajustes",
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

  const onLogout = () => {
    logout();
    router.push("/login");
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
        {/* Overlays gradientes */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-blue-950/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
      </div>

      {/* Partículas flotantes */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
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
            ? "bg-white/10 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/20" 
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          {/* Logo Cuadrado Animado */}
          <motion.div 
            className="flex items-center gap-4"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative group cursor-pointer">
              {/* Efecto de glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
              
              {/* Container del logo */}
              <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-md flex items-center justify-center overflow-hidden group-hover:border-white/40 transition-colors">
                {/* Aquí va tu logo - reemplazar el SVG */}
                <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                
                {/* Efecto shine */}
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
            </div>

            <div className="hidden sm:block">
              <h1 className="text-lg font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Politécnico
              </h1>
              <p className="text-xs text-blue-300/80 font-medium tracking-wider">COMPUORIENTE</p>
            </div>
          </motion.div>

          {/* Perfil y Logout */}
          <div className="flex items-center gap-4">
            <motion.div 
              className="hidden sm:flex flex-col items-end"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-sm font-semibold text-white drop-shadow-md">
                {user?.name ?? "Estudiante"}
              </p>
              <p className="text-xs text-blue-200/80">{user?.program}</p>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLogout}
              className="group relative px-6 py-2.5 rounded-full overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-white/10 rounded-full backdrop-blur-sm transition-all group-hover:border-white/30" />
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative text-sm font-medium text-white flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Salir</span>
              </span>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Layout principal */}
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 lg:flex-row">
        {/* Sidebar navegación */}
        <aside className="w-full shrink-0 lg:w-72">
          <nav className="sticky top-24 space-y-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-2 shadow-2xl"
            >
              <div className="px-4 py-3 border-b border-white/5 mb-2">
                <p className="text-xs font-bold text-blue-300/80 uppercase tracking-widest">
                  Navegación
                </p>
              </div>
              
              <ul className="space-y-1 p-2">
                {navItems.map((item, index) => {
                  const active = pathname === item.href;
                  return (
                    <motion.li 
                      key={item.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                    >
                      <Link href={item.href}>
                        <motion.div
                          className={`group relative flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-300 overflow-hidden ${
                            active 
                              ? "bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white shadow-lg shadow-blue-500/25" 
                              : "text-slate-300 hover:text-white hover:bg-white/5"
                          }`}
                          onHoverStart={() => setHoveredNav(item.href)}
                          onHoverEnd={() => setHoveredNav(null)}
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {/* Indicador lateral */}
                          {active && (
                            <motion.div 
                              layoutId="activeIndicator"
                              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" 
                            />
                          )}
                          
                          {/* Icono con animación */}
                          <motion.div
                            animate={{
                              scale: hoveredNav === item.href ? 1.1 : 1,
                              rotate: hoveredNav === item.href ? 5 : 0,
                            }}
                            className={active ? "text-white" : "text-blue-400/70 group-hover:text-blue-300"}
                          >
                            {item.icon}
                          </motion.div>
                          
                          <span className="font-medium text-sm">{item.label}</span>
                          
                          {/* Badge de notificación (ejemplo) */}
                          {item.href === "/materias" && (
                            <span className="ml-auto bg-red-500/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                              3
                            </span>
                          )}
                          
                          {/* Efecto de brillo al hover */}
                          <div className={`absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-purple-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ${active ? 'hidden' : ''}`} />
                        </motion.div>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </motion.div>

            {/* Tarjeta de estado/info adicional */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-xl p-5"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <svg className="w-5 h-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Período Académico</p>
                  <p className="text-xs text-blue-200/70 mt-1">2026-I en curso</p>
                  <div className="mt-3 h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full" />
                  </div>
                  <p className="text-[10px] text-blue-300/60 mt-1">66% completado</p>
                </div>
              </div>
            </motion.div>
          </nav>
        </aside>

        {/* Contenido principal con animación de página */}
        <main className="w-full min-h-[calc(100vh-200px)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 lg:p-8 shadow-2xl"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Footer decorativo */}
      <footer className="relative z-10 mt-auto border-t border-white/10 bg-black/20 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>© 2026 Politécnico Compuoriente de Marinilla</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-blue-400 transition-colors">Términos</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-blue-400 transition-colors">Ayuda</a>
          </div>
        </div>
      </footer>
    </div>
  );
}