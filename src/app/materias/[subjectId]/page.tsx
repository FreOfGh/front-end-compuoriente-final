"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { useAuth } from "@/providers/auth";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../api/api";
export default function SubjectDetailPage() {
  const { subjectId } = useParams() as { subjectId: string };
  const { isLoggedIn, user } = useAuth();
  const router = useRouter();

  // Estados para datos reales
  const [subject, setSubject] = useState<any>(null);
  const [themes, setThemes] = useState<any[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
      return;
    }

const fetchFullSubjectData = async () => {
  setIsLoading(true);

  try {
    const { data } = await api.get(`/modulos/${subjectId}`);

    setSubject(data.subject);
    setThemes(data.themes);

    if (data.themes.length > 0) {
      setSelectedTheme(data.themes[0]);
    }

  } catch (err) {
    console.error("Error cargando módulo:", err);
  } finally {
    setIsLoading(false);
  }
};

    fetchFullSubjectData();
  }, [subjectId, isLoggedIn, router]);

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex h-96 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      </AppShell>
    );
  }

  if (!subject) {
    return (
      <AppShell>
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-xl">
          <h1 className="text-xl font-bold text-white">Módulo no encontrado</h1>
          <Link href="/materias" className="mt-4 inline-block text-blue-400 hover:underline">
            Volver a la lista
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header de la Materia */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl shadow-2xl"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{subject.code}</span>
                <span className="h-1 w-1 rounded-full bg-white/20" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aula Virtual</span>
              </div>
              <h1 className="text-3xl font-bold text-white">{subject.name}</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold text-slate-500 uppercase">Tu avance</p>
                <p className="text-lg font-bold text-white">{subject.progress}%</p>
              </div>
              <Link
                href="/materias"
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-white/10"
              >
                ← VOLVER
              </Link>
            </div>
          </div>
        </motion.header>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* Sidebar de Temas */}
          <aside className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
              <h2 className="text-xs font-bold text-blue-300/60 uppercase tracking-widest mb-4">Ejes Temáticos</h2>
              <div className="space-y-2">
                {themes.map((theme, index) => {
                  const isActive = selectedTheme?.id === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme)}
                      className={`group w-full rounded-2xl border p-4 text-left transition-all ${
                        isActive
                          ? "border-blue-500/50 bg-blue-500/10 shadow-lg shadow-blue-500/10"
                          : "border-white/5 bg-white/5 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold ${isActive ? "text-blue-400" : "text-slate-500"}`}>
                          0{index + 1}
                        </span>
                        <div>
                          <p className={`text-sm font-bold ${isActive ? "text-white" : "text-slate-300"}`}>
                            {theme.title}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Área de Visualización */}
          <section className="space-y-6">
            {selectedTheme ? (
              <motion.div 
                key={selectedTheme.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
              >
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedTheme.title}</h2>
                  <p className="text-slate-400 text-sm leading-relaxed">{selectedTheme.description}</p>
                </div>

                <div className="grid gap-6">
                  {/* Reproductor de Video */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-blue-400">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                        <path d="M10 8a2 2 0 100 4 2 2 0 000-4z" />
                      </svg>
                      <span className="text-[10px] font-bold uppercase tracking-widest">Sesión Grabada</span>
                    </div>
                    <div className="aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
                      <iframe
                        className="h-full w-full"
                        src={selectedTheme.video_url}
                        title={selectedTheme.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>

                  {/* Recursos Adicionales */}
                  <div className="rounded-2xl border border-white/5 bg-white/5 p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">Guía Práctica y Taller</p>
                        <p className="text-xs text-slate-500">Documento PDF - Descargable</p>
                      </div>
                    </div>
                    <a
                      href={selectedTheme.workshop_url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white transition hover:bg-blue-500"
                    >
                      ABRIR TALLER
                    </a>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex h-96 items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5">
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Selecciona un tema para comenzar</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </AppShell>
  );
}