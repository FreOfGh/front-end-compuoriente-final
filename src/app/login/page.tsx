"use client";
  import api from "../api/api";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/providers/auth";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const { isLoggedIn, login } = useAuth();
  const router = useRouter();

  const [nroDocumento, setNroDocumento] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Redirección si ya hay sesión
  useEffect(() => {
    if (isLoggedIn) router.replace("/dashboard");
  }, [isLoggedIn, router]);

  // Parallax del fondo
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (window.innerWidth - e.pageX * 2) / 100,
        y: (window.innerHeight - e.pageY * 2) / 100,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setIsLoading(true);

  try {
    console.log("📤 Enviando:", {
      nro_documento: nroDocumento,
      password,
    });

    const response = await api.post("/login", {
      nro_documento: nroDocumento,
      password,
    });

    console.log("📥 RESPUESTA COMPLETA:", response);
    console.log("📥 DATA:", response.data);

    localStorage.setItem("token", response.data.access_token);

    await login(response.data.access_token);

    setIsLoading(false);
    router.replace("/dashboard");

  } catch (err: any) {
    console.log("❌ ERROR COMPLETO:", err);
    console.log("❌ RESPONSE:", err.response);
    console.log("❌ DATA:", err.response?.data);

    setIsLoading(false);

    if (err.response) {
      setError(err.response.data?.message || "Error al iniciar sesión");
    } else {
      setError("Error de conexión con el servidor");
    }
  }
};
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 flex items-center justify-center p-4">
      {/* Fondo Dinámico con Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay muted loop playsInline
          className="h-full w-full object-cover opacity-40"
          src="https://videos.pexels.com/video-files/5940841/5940841-hd_1920_1080_24fps.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-blue-950/90" />
      </div>

      {/* Tarjeta de Login Glassmorphism */}
      <motion.div
        animate={{ x: mousePosition.x, y: mousePosition.y }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden">
          
          {/* Logo y Encabezado */}
          <div className="text-center mb-10">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-30 animate-pulse" />
              <img 
                src="/logo.png" 
                alt="Compuoriente" 
                className="relative w-24 h-24 mx-auto object-contain drop-shadow-2xl" 
              />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">
              Compuoriente
            </h1>
            <p className="text-blue-300/60 text-xs font-bold tracking-[0.3em] mt-2 uppercase">
              Plataforma Académica
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="group">
                <label className="text-[10px] font-bold text-blue-300/50 uppercase tracking-widest ml-1">Número de cédula</label>
<input
  type="text"
  value={nroDocumento}
  onChange={(e) => setNroDocumento(e.target.value)}
  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
  placeholder="Número de documento"
  required
/>
              </div>

              <div className="group">
                <label className="text-[10px] font-bold text-blue-300/50 uppercase tracking-widest ml-1">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-xl p-3"
                >
                  <p className="text-red-400 text-xs text-center font-medium">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/30 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>AUTENTICANDO...</span>
                </div>
              ) : (
                "INGRESAR A LA PLATAFORMA"
              )}
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-white/5 text-center">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              Sede Marinilla • 2026
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}