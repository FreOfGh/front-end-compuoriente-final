"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import { mockSubjects } from "@/lib/mockData";
import { useAuth } from "@/providers/auth";
import { useEffect, useMemo, useState } from "react";

export default function SubjectDetailPage() {
  const { subjectId } = useParams() as { subjectId: string };
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, router]);

  const subject = useMemo(
    () => mockSubjects.find((subj) => subj.id === subjectId),
    [subjectId]
  );

  useEffect(() => {
    if (subject?.themes?.length) {
      setSelectedTheme(subject.themes[0].id);
    }
  }, [subject]);

  if (!subject) {
    return (
      <AppShell>
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-950">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Materia no encontrada</h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            Verifica el enlace o regresa a la lista de módulos.
          </p>
          <Link
            href="/materias"
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-[var(--theme-primary)] px-5 py-3 text-sm font-semibold text-white shadow hover:bg-[var(--theme-primary)]/90"
          >
            Volver a módulos
          </Link>
        </div>
      </AppShell>
    );
  }

  const selectedThemeData = subject.themes.find((theme) => theme.id === selectedTheme) ?? subject.themes[0];

  return (
    <AppShell>
      <div className="space-y-8">
        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{subject.name}</h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{subject.code}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                {subject.progress}% completado
              </span>
              <Link
                href="/materias"
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                ← Volver a módulos
              </Link>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-950">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">Ejes temáticos</h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
              Selecciona un eje para ver la clase, el video y el taller.
            </p>

            <ul className="mt-4 space-y-3">
              {subject.themes.map((theme) => {
                const active = theme.id === selectedTheme;
                return (
                  <li key={theme.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedTheme(theme.id)}
                      className={
                        "w-full rounded-xl border px-4 py-3 text-left transition " +
                        (active
                          ? "border-[var(--theme-primary)] bg-[var(--theme-primary)]/10 text-[var(--theme-primary)]"
                          : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900")
                      }
                    >
                      <p className="font-semibold">{theme.title}</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{theme.description}</p>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{selectedThemeData.title}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {selectedThemeData.description}
            </p>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Clase en video
                </h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Visualiza la clase para avanzar en el contenido.
                </p>
                <div className="mt-4 aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-sm dark:border-slate-700">
                  <iframe
                    className="h-full w-full"
                    src={selectedThemeData.class.videoUrl}
                    title={selectedThemeData.class.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Taller</h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Accede al taller relacionado y pon en práctica lo aprendido.
                </p>
                <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {selectedThemeData.class.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                      {selectedThemeData.class.description}
                    </p>
                  </div>
                  <a
                    href={selectedThemeData.class.workshopUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex w-fit items-center justify-center rounded-xl bg-[var(--theme-primary)] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[var(--theme-primary)]/90"
                  >
                    Abrir taller
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
