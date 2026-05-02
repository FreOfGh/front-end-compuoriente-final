"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {Video, Mic, TvMinimalPlay} from "lucide-react"
import AppShell from "@/components/AppShell";

const rooms = [
  { id: "aula-21", label: "Aula 2.1" },
  { id: "aula-22", label: "Aula 2.2", live: true },
  { id: "aula-23", label: "Aula 2.3" },
  { id: "aula-24", label: "Aula 2.4" },
  { id: "aula-25", label: "Aula 2.5" },
  { id: "aula-33", label: "Aula 3.3" },
  { id: "aula-31", label: "Aula 3.1", live: true  },
  { id: "aula-32", label: "Aula 3.4", live: true  },
  { id: "auditorio", label: "Auditorio" },
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
  const [message, setMessage] = useState(
    "Seleccione un aula y pulse 'Entrar a la reunión'."
  );
  const [isLoading, setIsLoading] = useState(false);
  const [roomUrl, setRoomUrl] = useState<string | null>(null);
  const [isJoined, setIsJoined] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const jitsiRef = useRef<any>(null);

  const currentRoomLabel = useMemo(
    () => rooms.find((r) => r.id === selectedRoom)?.label ?? "Aula",
    [selectedRoom]
  );

  // limpiar al desmontar
  useEffect(() => {
    return () => {
      if (jitsiRef.current) {
        jitsiRef.current.dispose();
      }
    };
  }, []);

  // limpiar al cambiar de sala
  useEffect(() => {
    if (jitsiRef.current) {
      jitsiRef.current.dispose();
      jitsiRef.current = null;
      setIsJoined(false);
      setRoomUrl(null);
    }
  }, [selectedRoom]);

  const handleJoin = async () => {
    setIsLoading(true);
    setShowLoader(true);
    setMessage("Preparando aula virtual...");

    try {
      const tokenResp = await fetch(
        `/api/jitsi-token?room=${encodeURIComponent(selectedRoom)}`
      );

      if (!tokenResp.ok) {
        throw new Error("Error al generar el token");
      }

      const { token, room } = await tokenResp.json();

      // cargar script + esperar 5s mínimo
      await Promise.all([
        loadJitsiScript("https://8x8.vc/external_api.js"),
        new Promise((res) => setTimeout(res, 5000)),
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
        setMessage("Conectado correctamente");
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

      setRoomUrl(`https://${domain}/${room}`);
    } catch (error) {
      console.error(error);
      setMessage("Error: " + (error as Error).message);
      setShowLoader(false);
      setIsJoined(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="relative min-h-[calc(100vh-90px)] z-10 px-4 py-6 text-white">
        <div className="mx-auto max-w-5xl space-y-6 rounded-3xl border border-white/10 bg-slate-900/70 p-5 backdrop-blur-xl shadow-2xl">
          
          {/* Header */}
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-blue-300">
              Aulas virtuales 8x8 / Jitsi
            </p>
            <h1 className="text-2xl font-bold md:text-3xl">
              Aulas virtuales
            </h1>
            <p className="mt-1 text-slate-300 text-sm">
              Selecciona un aula y entra a la videollamada.
            </p>
          </div>

          {/* Aulas */}
          <div className="grid gap-3 md:grid-cols-2">
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room.id)}
                className={`rounded-xl border px-4 py-3 text-left transition ${
                  selectedRoom === room.id
                    ? "border-blue-400 bg-blue-500/20"
                    : "border-white/10 bg-slate-800/40 hover:border-white/30"
                }`}
              >
                <p className="font-semibold flex items-center gap-2">
  {room.label}

  {room.live && (
    <TvMinimalPlay className="w-4 h-4 text-red-500" />
  )}
</p>
                <p className="text-xs text-slate-300">Sala: {room.id}</p>
              </button>
            ))}
          </div>

          {/* Botones */}
          <div className="flex flex-wrap gap-3">
            <button
              disabled={isLoading}
              onClick={handleJoin}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 font-semibold transition hover:brightness-110 disabled:opacity-60"
            >
              {isLoading
                ? "Conectando..."
                : `Entrar a ${currentRoomLabel}`}
            </button>

            {roomUrl && (
              <a
                href={roomUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-white/20 px-4 py-2.5 text-xs hover:bg-white/10"
              >
                Abrir en nueva pestaña
              </a>
            )}
          </div>

          {/* Estado */}
          <div className="rounded-xl border border-white/10 bg-slate-900/50 p-3 text-sm">
            <p>{message}</p>
          </div>

          {/* Jitsi responsive */}
          <div className="relative w-full aspect-video rounded-2xl border border-white/20 bg-black overflow-hidden">
            
            <div id="jitsi-container" className="h-full w-full" />

            {/* Loader */}
            {showLoader && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-10">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-white/20 border-t-blue-500 mb-3" />
                <p className="text-sm text-slate-300">
                  Preparando aula virtual...
                </p>
              </div>
            )}

            {/* Estado vacío */}
            {!isJoined && !showLoader && (
              <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                No conectado
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
