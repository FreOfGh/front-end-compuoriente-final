"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useAuth } from "@/providers/auth";

// 🔥 Simulación de Base de Datos con un usuario real
const MOCK_DB_USER = {
  id: "u-sistemas-001",
  name: "Estudiante Compuoriente",
  email: "estudiante@compuoriente.edu",
  password: "admin", // Contraseña para la prueba
  program: "Técnica en Sistemas",
};

export default function LoginPage() {
  const { isLoggedIn, login } = useAuth();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Redirección si ya está logueado
  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/dashboard");
    }
  }, [isLoggedIn, router]);

  // Efecto parallax con mouse
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

  const canProceed = useMemo(
    () => email.includes("@") && password.length > 0,
    [email, password]
  );

  const onSubmit = useCallback((event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    // Validación del paso 1 (Credenciales)
    if (step === 1) {
      if (email === MOCK_DB_USER.email && password === MOCK_DB_USER.password) {
        setStep(2);
      } else {
        setError("Correo o contraseña incorrectos. Intenta de nuevo.");
      }
      return;
    }

    // Paso 2 (Ingreso al Dashboard)
    setIsLoading(true);
    setTimeout(() => {
      login({
        id: MOCK_DB_USER.id,
        name: MOCK_DB_USER.name,
        email: MOCK_DB_USER.email,
        program: MOCK_DB_USER.program,
      });
      router.replace("/dashboard");
    }, 800);
  }, [step, email, password, login, router]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950">
      {/* Video de fondo educativo */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-full w-full object-cover opacity-60"
          poster="https://images.pexels.com/photos/5940841/pexels-photo-5940841.jpeg?auto=compress&cs=tinysrgb&w=1920"
        >
          <source
            src="https://videos.pexels.com/video-files/5940841/5940841-hd_1920_1080_24fps.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/70 to-blue-950/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
      </div>

      {/* Partículas flotantes decorativas */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/20 backdrop-blur-sm"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Contenedor principal */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <div
          className="w-full max-w-md transform transition-transform duration-300 ease-out"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          }}
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl backdrop-blur-xl dark:bg-slate-950/40">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 transition-opacity duration-500 hover:opacity-100 pointer-events-none" />
            
            <div className="relative mb-8 flex justify-center">
              <div className="group relative h-32 w-32 cursor-pointer">
                <div className="absolute inset-0 rounded-2xl bg-blue-500/30 animate-ping" />
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-75 blur-lg transition-opacity duration-500 group-hover:opacity-100 animate-pulse" />
                <div className="relative flex h-full w-full items-center justify-center rounded-2xl border border-white/30 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md shadow-xl transition-transform duration-300 group-hover:scale-105 overflow-hidden">
                  <img src={"./logo.png"} alt="Logo" />
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                </div>
              </div>
            </div>

            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-white bg-clip-text text-transparent drop-shadow-sm">
                Bienvenido a la plataforma educativa del politécnico Compuoriente
              </h1>
            </div>

            <form onSubmit={onSubmit} className="mt-8 space-y-5">
              <div className="relative overflow-hidden">
                {/* Paso 1: Login */}
                <div
                  className={`transition-all duration-500 ease-in-out ${
                    step === 1
                      ? "opacity-100 translate-x-0 relative"
                      : "opacity-0 -translate-x-full absolute inset-0 pointer-events-none"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="group">
                      <label className="mb-1.5 block text-xs font-medium text-blue-200/80 uppercase tracking-wider">
                        Correo institucional
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white placeholder-slate-400 outline-none transition-all duration-300 focus:border-blue-400/50 focus:bg-white/10 focus:ring-4 focus:ring-blue-400/20"
                          placeholder="estudiante@compuoriente.edu"
                          required
                        />
                      </div>
                    </div>

                    <div className="group">
                      <label className="mb-1.5 block text-xs font-medium text-blue-200/80 uppercase tracking-wider">
                        Contraseña
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-white placeholder-slate-400 outline-none transition-all duration-300 focus:border-blue-400/50 focus:bg-white/10 focus:ring-4 focus:ring-blue-400/20"
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    </div>

                    {error && (
                      <p className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg border border-red-400/20">
                        {error}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={!canProceed}
                      className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-blue-500/50 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Verificar credenciales
                        <svg className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </button>
                  </div>
                </div>

                {/* Paso 2: Confirmación */}
                <div
                  className={`transition-all duration-500 ease-in-out ${
                    step === 2
                      ? "opacity-100 translate-x-0 relative"
                      : "opacity-0 translate-x-full absolute inset-0 pointer-events-none"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-4 backdrop-blur-sm text-center">
                      <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-sm text-slate-300">
                        Credenciales correctas. Hola, <span className="text-white font-semibold">{MOCK_DB_USER.name}</span>.
                      </p>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-medium text-blue-200/80 uppercase tracking-wider">
                        Programa asignado
                      </label>
                      <div className="w-full rounded-xl border border-blue-400/30 bg-blue-500/10 px-4 py-3.5 text-sm text-blue-200 font-medium">
                        {MOCK_DB_USER.program}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setStep(1);
                          setPassword("");
                        }}
                        className="flex-1 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-medium text-slate-300 transition-all duration-300 hover:bg-white/10 hover:text-white"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-blue-500/50 hover:scale-[1.02] disabled:opacity-70"
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Ingresando...
                          </span>
                        ) : (
                          "Entrar al Panel"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </form>

            <div className="mt-8 flex justify-center gap-2">
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step === 1 ? "w-8 bg-blue-500" : "w-1.5 bg-white/20"
                }`}
              />
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step === 2 ? "w-8 bg-blue-500" : "w-1.5 bg-white/20"
                }`}
              />
            </div>

            <p className="mt-6 text-center text-xs text-slate-500/80">
              C Simón Torres
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) translateX(50px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}