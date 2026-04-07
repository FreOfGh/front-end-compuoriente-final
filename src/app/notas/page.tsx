"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import api from "../api/api";
import {
  BookOpen,
  GraduationCap,
  Lock,
  PlayCircle,
  TrendingUp,
  AlertCircle,
  Calendar,
  Award,
  ChevronRight,
  FileText
} from "lucide-react";

type Nota = {
  modulo: string;
  notas_parciales: number[];
  nota_final: number | null;
  bloqueado: boolean;
};

export default function NotasPage() {
  const [notas, setNotas] = useState<Nota[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchNotas = async () => {
      try {
        const { data } = await api.get("/mis-notas");
        setNotas(data.data);
      } catch (error) {
        console.error("Error cargando notas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotas();
  }, []);

  // Calcular estadísticas
  const stats = {
    totalModulos: notas.length,
    completados: notas.filter((n) => n.bloqueado).length,
    enCurso: notas.filter((n) => !n.bloqueado).length,
    promedioGeneral: notas.length > 0 
      ? (notas.reduce((acc, curr) => acc + (curr.nota_final || 0), 0) / notas.filter(n => n.nota_final).length).toFixed(1)
      : "0.0"
  };

  const getEstadoColor = (bloqueado: boolean, notaFinal: number | null) => {
    if (!bloqueado) return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    if (notaFinal && notaFinal >= 3.0) return "bg-green-500/20 text-green-300 border-green-500/30";
    return "bg-red-500/20 text-red-300 border-red-500/30";
  };

  const getEstadoIcon = (bloqueado: boolean) => {
    return bloqueado ? <Lock className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />;
  };

  const getEstadoTexto = (bloqueado: boolean, notaFinal: number | null) => {
    if (!bloqueado) return "En curso";
    if (notaFinal && notaFinal >= 3.0) return "Aprobado";
    return "Reprobado";
  };

  if (loading) {
    return (
      <AppShell>
        <div className="flex flex-col justify-center items-center h-96">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
            <GraduationCap className="w-8 h-8 text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="mt-6 text-gray-400 animate-pulse">Cargando tus notas...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Header con estadísticas */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-blue-500" />
                Mis Notas
              </h1>
              <p className="mt-2 text-gray-400">
                Seguimiento académico de tus módulos
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
              <Award className="w-5 h-5 text-yellow-500" />
              <span className="text-white font-semibold">Promedio: {stats.promedioGeneral}</span>
            </div>
          </div>

          {/* Cards de estadísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/20 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-300">Total Módulos</p>
                  <p className="text-2xl font-bold text-white mt-1">{stats.totalModulos}</p>
                </div>
                <FileText className="w-10 h-10 text-blue-500/50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-500/20 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-300">Completados</p>
                  <p className="text-2xl font-bold text-white mt-1">{stats.completados}</p>
                </div>
                <Award className="w-10 h-10 text-green-500/50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/20 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-300">En Curso</p>
                  <p className="text-2xl font-bold text-white mt-1">{stats.enCurso}</p>
                </div>
              <PlayCircle className="w-10 h-10 text-purple-500/50" />
              </div>
            </div>
          </div>
        </div>

        {/* Lista de módulos */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gray-400" />
            Detalle por Módulo
          </h2>

          {notas.length === 0 ? (
            <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
              <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No hay notas registradas</h3>
              <p className="text-gray-400">Aún no tienes módulos asignados</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {notas.map((item, index) => (
                <div
                  key={index}
                  className={`group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:bg-white/10 hover:border-white/20 ${
                    expandedIndex === index ? 'ring-2 ring-blue-500/50' : ''
                  }`}
                >
                  {/* Header de la tarjeta */}
                  <div
                    className="p-6 cursor-pointer"
                    onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                            {item.modulo}
                          </h3>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getEstadoColor(item.bloqueado, item.nota_final)}`}>
                            {getEstadoIcon(item.bloqueado)}
                            {getEstadoTexto(item.bloqueado, item.nota_final)}
                          </span>
                        </div>
                        
                        {/* Preview de notas */}
                        <div className="flex items-center gap-6 text-sm text-gray-400 mt-3">
                          <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {item.notas_parciales.length} parcial{item.notas_parciales.length !== 1 ? 'es' : ''}
                          </span>
                          {item.nota_final && (
                            <span className="flex items-center gap-2">
                              <Award className="w-4 h-4" />
                              Final: <span className={`font-semibold ${item.nota_final >= 3.0 ? 'text-green-400' : 'text-red-400'}`}>{item.nota_final}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <ChevronRight className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${expandedIndex === index ? 'rotate-90' : ''}`} />
                    </div>
                  </div>

                  {/* Contenido expandible */}
                  <div className={`overflow-hidden transition-all duration-300 ${expandedIndex === index ? 'max-h-96' : 'max-h-0'}`}>
                    <div className="px-6 pb-6 pt-2 border-t border-white/10">
                      {/* Notas parciales */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Notas Parciales
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {item.notas_parciales.length > 0 ? (
                            item.notas_parciales.map((nota, i) => (
                              <div
                                key={i}
                                className={`px-4 py-2 rounded-xl font-semibold text-sm ${
                                  nota >= 3.0
                                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                    : 'bg-red-500/20 text-red-300 border border-red-500/30'
                                }`}
                              >
                                Parcial {i + 1}: {nota}
                              </div>
                            ))
                          ) : (
                            <span className="text-gray-500 italic">Sin calificaciones parciales</span>
                          )}
                        </div>
                      </div>

                      {/* Nota final destacada */}
                      <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Nota Final del Módulo</span>
                          {item.nota_final ? (
                            <span className={`text-2xl font-bold ${item.nota_final >= 3.0 ? 'text-green-400' : 'text-red-400'}`}>
                              {item.nota_final}
                            </span>
                          ) : (
                            <span className="text-gray-500 italic">Pendiente</span>
                          )}
                        </div>
                        {item.nota_final && (
                          <div className="mt-2 w-full bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${
                                item.nota_final >= 3.0 ? 'bg-green-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min((item.nota_final / 5) * 100, 100)}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}