"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Video, Mic, TvMinimalPlay, Users, Wifi, WifiOff, ExternalLink, Loader2 } from "lucide-react";
import AppShell from "@/components/AppShell";

const rooms = [
  { id: "aula-21", label: "Aula 2.1", capacity: 30 },
  { id: "aula-22", label: "Aula 2.2", live: true, capacity: 25 },
  { id: "aula-23", label: "Aula 2.3", capacity: 30 },
  { id: "aula-24", label: "Aula 2.4", capacity: 20 },
  { id: "aula-25", label: "Aula 2.5", capacity: 35 },
  { id: "aula-33", label: "Aula 3.3", capacity: 30 },
  { id: "aula-31", label: "Aula 3.1", live: true, capacity: 40 },
  { id: "aula-32", label: "Aula 3.4", live: true, capacity: 25 },
  { id: "auditorio", label: "Auditorio", live: true, capacity: 120 },
];

function loadJitsiScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("No window"));

    if ((window as any).JitsiMeetExternalAPI) {
      return resolve();
    }

    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve());
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("No se pudo cargar Jitsi"));
    document.body.appendChild(script);
  });
}

export default function AulasVirtualesPage() {
  const [selectedRoom, setSelectedRoom] = useState(rooms[0].id);
  const [message, setMessage] = useState("Seleccione un aula y pulse 'Entrar a la reunión'.");
  const [isLoading, setIsLoading] = useState(false);
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [loaderProgress, setLoaderProgress] = useState(0);
  const [participants, setParticipants] = useState(0);

  const jitsiRef = useRef<any>(null);
  const loaderIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const loaderTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentRoom = useMemo(
    () => rooms.find((r) => r.id === selectedRoom),
    [selectedRoom]
  );

  // Limpiar timers y Jitsi al desmontar
  useEffect(() => {
    return () => {
      clearLoaderTimers();
      if (jitsiRef.current) {
        jitsiRef.current.dispose();
      }
    };
  }, []);

  // Limpiar al cambiar de sala
  useEffect(() => {
    clearLoaderTimers();
    if (jitsiRef.current) {
      jitsiRef.current.dispose();
      jitsiRef.current = null;
    }
    setIsJoined(false);
    setRoomUrl(null);
    setShowLoader(false);
    setLoaderProgress(0);
    setParticipants(0);
  }, [selectedRoom]);

  const clearLoaderTimers = () => {
    if (loaderIntervalRef.current) clearInterval(loaderIntervalRef.current);
    if (loaderTimeoutRef.current) clearTimeout(loaderTimeoutRef.current);
  };

  const startLoader = () => {
    setShowLoader(true);
    setLoaderProgress(0);
    
    // Barra de progreso que dura 5 segundos
    const startTime = Date.now();
    const duration = 5000;
    
    loaderIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setLoaderProgress(progress);
    }, 50);

    // Promise que resuelve exactamente a los 5s
    return new Promise<void>((resolve) => {
      loaderTimeoutRef.current = setTimeout(() => {
        clearInterval(loaderIntervalRef.current!);
        setLoaderProgress(100);
        resolve();
      }, duration);
    });
  };

  const handleJoin = async () => {
    setIsLoading(true);
    setMessage("Iniciando conexión segura...");
    setParticipants(0);

    try {
      const tokenResp = await fetch(
        `/api/jitsi-token?room=${encodeURIComponent(selectedRoom)}`
      );

      if (!tokenResp.ok) {
        throw new Error("Error al generar el token de acceso");
      }

      const { token, room } = await tokenResp.json();

      // Cargar script Y esperar los 5 segundos del loader simultáneamente
      const [, , apiReady] = await Promise.all([
        loadJitsiScript("https://8x8.vc/external_api.js"),
        startLoader(), // Esto dura exactamente 5 segundos
        new Promise<void>((resolve) => {
          // Simular datos de participantes
          setTimeout(() => setParticipants(Math.floor(Math.random() * 8) + 2), 2000);
          resolve();
        }),
      ]);

      const domain = process.env.NEXT_PUBLIC_JITSI_DOMAIN || "8x8.vc";
      const container = document.getElementById("jitsi-container");

      if (!container) throw new Error("No existe el contenedor");

      if (jitsiRef.current) {
        jitsiRef.current.dispose();
        jitsiRef.current = null;
      }

      container.innerHTML = "";

      const api = new (window as any).JitsiMeetExternalAPI(domain, {
        roomName: room,
        parentNode: container,
        jwt: token,
        lang: "es",
        userInfo: {
          displayName: "Estudiante",
        },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          prejoinPageEnabled: false,
          defaultLanguage: "es",
        },
        interfaceConfigOverwrite: {
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          TOOLBAR_BUTTONS: [
            "microphone",
            "camera",
            "chat",
            "desktop",
            "raisehand",
            "tileview",
            "hangup",
            "fullscreen",
            "recording",
          ],
        },
      });

      jitsiRef.current = api;

      api.addEventListener("videoConferenceJoined", () => {
        setMessage("✅ Conectado correctamente");
        setIsJoined(true);
        setShowLoader(false);
      });

      api.addEventListener("videoConferenceLeft", () => {
        setMessage("Has salido de la sala");
        setIsJoined(false);
      });

      api.addEventListener("readyToClose", () => {
        api.dispose();
        setIsJoined(false);
      });

      api.addEventListener("participantJoined", () => {
        setParticipants((prev) => prev + 1);
      });

      api.addEventListener("participantLeft", () => {
        setParticipants((prev) => Math.max(0, prev - 1));
      });

      setRoomUrl(`https://${domain}/${room}`);
    } catch (error) {
      console.error(error);
      setMessage("❌ Error: " + (error as Error).message);
      setShowLoader(false);
      setLoaderProgress(0);
    } finally {
      setIsLoading(false);
      clearLoaderTimers();
    }
  };

  const handleLeave = () => {
    if (jitsiRef.current) {
      jitsiRef.current.executeCommand("hangup");
      jitsiRef.current.dispose();
      jitsiRef.current = null;
    }
    setIsJoined(false);
    setRoomUrl(null);
    setMessage("Sesión finalizada");
    setParticipants(0);
  };

  return (
    <AppShell>
      <div className="min-h-[calc(100vh-90px)] bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">
          
          {/* Header */}
          <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-4 sm:p-6 lg:p-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-blue-400 font-medium">
                  Aulas virtuales 8x8 / Jitsi
                </p>
                <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white mt-1">
                  Aulas virtuales
                </h1>
                <p className="mt-1 text-slate-400 text-xs sm:text-sm max-w-xl">
                  Selecciona un aula disponible y únete a la videollamada en tiempo real.
                </p>
              </div>
              
              {isJoined && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30 text-green-400 text-xs sm:text-sm font-medium self-start sm:self-auto">
                  <Wifi className="w-3.5 h-3.5 animate-pulse" />
                  <span>En vivo</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            
            {/* Sidebar - Selector de aulas */}
            <div className="lg:col-span-1 space-y-4">
              <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-4 sm:p-5 shadow-2xl">
                <h2 className="text-sm sm:text-base font-semibold text-white mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  Salas disponibles
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                  {rooms.map((room) => (
                    <button
                      key={room.id}
                      onClick={() => setSelectedRoom(room.id)}
                      disabled={isLoading || isJoined}
                      className={`group relative rounded-xl border px-3 sm:px-4 py-3 text-left transition-all duration-200 ${
                        selectedRoom === room.id
                          ? "border-blue-500/50 bg-blue-500/15 shadow-lg shadow-blue-500/10"
                          : "border-white/10 bg-slate-800/40 hover:border-white/25 hover:bg-slate-800/60"
                      } ${(isLoading || isJoined) ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-white text-sm sm:text-base truncate flex items-center gap-2">
                            {room.label}
                            {room.live && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/30">
                                <TvMinimalPlay className="w-3 h-3 text-red-400" />
                                <span className="text-[10px] text-red-400 font-medium">LIVE</span>
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] sm:text-xs text-slate-400 mt-0.5">
                            Sala: {room.id} • Cap: {room.capacity}
                          </p>
                        </div>
                        
                        {selectedRoom === room.id && (
                          <div className="w-2 h-2 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50 flex-shrink-0 ml-2" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Info card */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-xl p-4 text-xs text-slate-400 hidden lg:block">
                <p className="flex items-start gap-2">
                  <Video className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  Asegúrate de tener cámara y micrófono habilitados antes de ingresar.
                </p>
              </div>
            </div>

            {/* Main content */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Controls */}
              <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-slate-900/60 backdrop-blur-xl p-4 sm:p-6 shadow-2xl">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-400">Sala seleccionada</p>
                    <p className="text-lg sm:text-xl font-bold text-white">
                      {currentRoom?.label}
                      {currentRoom?.live && (
                        <span className="ml-2 text-xs font-normal text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                          EN VIVO
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                    {!isJoined ? (
                      <button
                        disabled={isLoading}
                        onClick={handleJoin}
                        className="flex-1 sm:flex-none rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-white transition-all hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:hover:scale-100 shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Conectando...
                          </>
                        ) : (
                          <>
                            <Video className="w-4 h-4" />
                            Entrar a {currentRoom?.label}
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={handleLeave}
                        className="flex-1 sm:flex-none rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-white transition-all hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-500/25 flex items-center justify-center gap-2"
                      >
                        <WifiOff className="w-4 h-4" />
                        Salir de la sala
                      </button>
                    )}

                    {roomUrl && (
                      <a
                        href={roomUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 sm:flex-none rounded-xl border border-white/20 px-4 py-2.5 text-xs sm:text-sm text-slate-300 hover:bg-white/10 hover:text-white transition flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Nueva pestaña
                      </a>
                    )}
                  </div>
                </div>

                {/* Estado */}
                <div className={`mt-4 rounded-xl border p-3 text-xs sm:text-sm flex items-center gap-2 transition-colors ${
                  message.includes("✅") 
                    ? "border-green-500/30 bg-green-500/10 text-green-400" 
                    : message.includes("❌")
                    ? "border-red-500/30 bg-red-500/10 text-red-400"
                    : "border-white/10 bg-slate-800/50 text-slate-300"
                }`}>
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    message.includes("✅") ? "bg-green-400" : 
                    message.includes("❌") ? "bg-red-400" : 
                    isLoading ? "bg-blue-400 animate-pulse" : "bg-slate-500"
                  }`} />
                  <span className="truncate">{message.replace(/[✅❌]/g, "").trim()}</span>
                  {isJoined && participants > 0 && (
                    <span className="ml-auto flex-shrink-0 text-xs bg-white/10 px-2 py-0.5 rounded-full">
                      {participants} participante{participants !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>
              </div>

              {/* Video Container */}
              <div className="relative w-full rounded-2xl sm:rounded-3xl border border-white/20 bg-black overflow-hidden shadow-2xl" style={{ aspectRatio: "16/9" }}>
                
                <div id="jitsi-container" className="h-full w-full" />

                {/* Loader de 5 segundos mejorado */}
                {showLoader && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-md z-20">
                    
                    {/* Spinner animado */}
                    <div className="relative mb-6">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-slate-700" />
                      <div 
                        className="absolute inset-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-t-blue-500 border-r-indigo-500 border-b-transparent border-l-transparent animate-spin"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg sm:text-xl font-bold text-white">
                          {Math.round(loaderProgress)}%
                        </span>
                      </div>
                    </div>

                    {/* Barra de progreso */}
                    <div className="w-48 sm:w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden mb-6">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-100 ease-linear"
                        style={{ width: `${loaderProgress}%` }}
                      />
                    </div>

                    {/* Mensaje con iconos */}
                    <div className="text-center px-6 max-w-md space-y-3">
                      <p className="text-sm sm:text-base text-white font-medium">
                        Preparando sala...
                      </p>
                      <p className="text-xs sm:text-sm text-slate-400 flex flex-wrap items-center justify-center gap-1.5 leading-relaxed">
                        Activa
                        <Video className="w-3.5 h-3.5 text-red-400 inline" />
                        cámara y
                        <Mic className="w-3.5 h-3.5 text-red-400 inline" />
                        micrófono. Saluda al ingresar para que el profesor registre tu asistencia.
                      </p>
                    </div>

                    {/* Indicadores de pasos */}
                    <div className="mt-6 flex items-center gap-3">
                      {[
                        { label: "Token", done: loaderProgress > 20 },
                        { label: "Script", done: loaderProgress > 50 },
                        { label: "Sala", done: loaderProgress > 80 },
                        { label: "Listo", done: loaderProgress >= 100 },
                      ].map((step, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className={`flex flex-col items-center gap-1 transition-colors duration-300 ${
                            step.done ? "text-blue-400" : "text-slate-600"
                          }`}>
                            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              step.done ? "bg-blue-400 scale-125 shadow-lg shadow-blue-400/50" : "bg-slate-700"
                            }`} />
                            <span className="text-[10px] font-medium">{step.label}</span>
                          </div>
                          {i < 3 && (
                            <div className={`w-6 sm:w-8 h-px transition-colors duration-300 ${
                              step.done ? "bg-blue-500/50" : "bg-slate-800"
                            }`} />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Estado vacío */}
                {!isJoined && !showLoader && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 z-10">
                    <Video className="w-12 h-12 sm:w-16 sm:h-16 mb-3 opacity-30" />
                    <p className="text-sm sm:text-base font-medium">No conectado</p>
                    <p className="text-xs text-slate-600 mt-1">Selecciona un aula y presiona entrar</p>
                  </div>
                )}

                {/* Overlay cuando está conectado */}
                {isJoined && (
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs text-white">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      REC
                    </div>
                    {participants > 0 && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs text-white">
                        <Users className="w-3 h-3" />
                        {participants}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
