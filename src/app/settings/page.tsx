"use client";

import AppShell from "@/components/AppShell";
import { useTheme } from "@/providers/theme";
import { useAuth } from "@/providers/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, router]);

  const { primary, accent, background, foreground, setPrimary, setAccent, setBackground, setForeground } = useTheme();

  return (
    <AppShell>
      <div className="space-y-6">
        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Ajustes de apariencia</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Personaliza los colores del portal. Los cambios se guardan automáticamente.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Color principal</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Este color se usa en botones, enlaces y encabezados importantes.
            </p>
            <input
              type="color"
              value={primary}
              onChange={(event) => setPrimary(event.target.value)}
              className="mt-4 h-12 w-full cursor-pointer rounded-xl border border-slate-200 bg-white p-1 shadow-sm transition dark:border-slate-700 dark:bg-slate-900"
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Color de acento</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Se utiliza para estados secundarios y destacar información.
            </p>
            <input
              type="color"
              value={accent}
              onChange={(event) => setAccent(event.target.value)}
              className="mt-4 h-12 w-full cursor-pointer rounded-xl border border-slate-200 bg-white p-1 shadow-sm transition dark:border-slate-700 dark:bg-slate-900"
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Fondo</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Ajusta el color de fondo de toda la app.
            </p>
            <input
              type="color"
              value={background}
              onChange={(event) => setBackground(event.target.value)}
              className="mt-4 h-12 w-full cursor-pointer rounded-xl border border-slate-200 bg-white p-1 shadow-sm transition dark:border-slate-700 dark:bg-slate-900"
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-950">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Texto</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Cambia el color principal del texto en el portal.
            </p>
            <input
              type="color"
              value={foreground}
              onChange={(event) => setForeground(event.target.value)}
              className="mt-4 h-12 w-full cursor-pointer rounded-xl border border-slate-200 bg-white p-1 shadow-sm transition dark:border-slate-700 dark:bg-slate-900"
            />
          </div>
        </section>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">
          <p>
            Tip: puedes volver a los valores predeterminados refrescando la página o eliminando los datos de "Local Storage" para
            el sitio.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
