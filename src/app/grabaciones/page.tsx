"use client";

import { useEffect, useState, useMemo } from "react";
import AppShell from "@/components/AppShell";
import { useAuth } from "@/providers/auth";
import { 
  Search, 
  Calendar, 
  Video, 
  Download, 
  Play, 
  Filter,
  ChevronDown,
  FolderOpen,
  Clock
} from "lucide-react";

type Recording = {
  id: number;
  room_name: string;
  date: string;
  video_url: string;
  duration?: string;
  file_size?: string;
};

export default function Recordings() {
  const [videos, setVideos] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "name">("date");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/recordings")
      .then((res) => res.json())
      .then((data) => {
        // Simular datos extra si no vienen del backend
        const enriched = data.map((v: Recording) => ({
          ...v,
          duration: v.duration || "45:32",
          file_size: v.file_size || "128 MB",
        }));
        setVideos(enriched);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Filtrar y ordenar videos
  const filteredVideos = useMemo(() => {
    let result = [...videos];

    // Filtro de búsqueda
    if (searchTerm) {
      result = result.filter((v) =>
        v.room_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro de fecha
    if (selectedDate) {
      result = result.filter((v) => v.date.startsWith(selectedDate));
    }

    // Ordenamiento
    result.sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return a.room_name.localeCompare(b.room_name);
    });

    return result;
  }, [videos, searchTerm, selectedDate, sortBy]);

  // Extraer fechas únicas para el filtro
  const availableDates = useMemo(() => {
    const dates = videos.map((v) => v.date.split("T")[0]);
    return [...new Set(dates)].sort().reverse();
  }, [videos]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Video className="w-8 h-8 text-blue-600" />
            Mis Grabaciones
          </h1>
          <p className="mt-2 text-gray-600">
            {filteredVideos.length} {filteredVideos.length === 1 ? "grabación" : "grabaciones"} disponibles
          </p>
        </div>

        {/* Filtros y Búsqueda */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre de sala..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            {/* Filtro de Fecha */}
            <div className="relative min-w-[200px]">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white cursor-pointer"
              >
                <option value="">Todas las fechas</option>
                {availableDates.map((date) => (
                  <option key={date} value={date}>
                    {new Date(date).toLocaleDateString("es-ES")}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>

            {/* Ordenamiento */}
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
              <button
                onClick={() => setSortBy("date")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  sortBy === "date"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Más recientes
              </button>
              <button
                onClick={() => setSortBy("name")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  sortBy === "name"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Nombre
              </button>
            </div>

            {/* Vista Grid/List */}
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                title="Vista de cuadrícula"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-all ${
                  viewMode === "list"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
                title="Vista de lista"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* Filtros activos */}
          {(searchTerm || selectedDate) && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">Filtros activos:</span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  Búsqueda: "{searchTerm}"
                  <button onClick={() => setSearchTerm("")} className="hover:text-blue-900">×</button>
                </span>
              )}
              {selectedDate && (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                  Fecha: {new Date(selectedDate).toLocaleDateString("es-ES")}
                  <button onClick={() => setSelectedDate("")} className="hover:text-green-900">×</button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Estado vacío */}
        {filteredVideos.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No se encontraron grabaciones
            </h3>
            <p className="text-gray-500">
              {searchTerm || selectedDate
                ? "Intenta ajustar los filtros de búsqueda"
                : "Aún no tienes grabaciones disponibles"}
            </p>
          </div>
        )}

        {/* Grid View */}
        {viewMode === "grid" && filteredVideos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                {/* Thumbnail / Video */}
                <div className="relative aspect-video bg-gray-900">
                  {playingVideo === video.id ? (
                    <video
                      src={video.video_url}
                      controls
                      autoPlay
                      className="w-full h-full"
                      onEnded={() => setPlayingVideo(null)}
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <button
                        onClick={() => setPlayingVideo(video.id)}
                        className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform"
                      >
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                          <Play className="w-8 h-8 text-white fill-white ml-1" />
                        </div>
                      </button>
                      <div className="absolute bottom-3 right-3 flex items-center gap-2">
                        <span className="px-2 py-1 bg-black/70 text-white text-xs rounded-md flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {video.duration}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1" title={video.room_name}>
                    {video.room_name}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(video.date)}
                    </span>
                    <span>{video.file_size}</span>
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => setPlayingVideo(video.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      <Play className="w-4 h-4" />
                      Reproducir
                    </button>
                    <a
                      href={video.video_url}
                      download
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      title="Descargar"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === "list" && filteredVideos.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {filteredVideos.map((video, index) => (
              <div
                key={video.id}
                className={`flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${
                  index !== filteredVideos.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                {/* Thumbnail pequeño */}
                <div className="relative w-32 h-20 bg-gray-900 rounded-lg overflow-hidden flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <button
                    onClick={() => setPlayingVideo(video.id)}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Play className="w-6 h-6 text-white fill-white" />
                  </button>
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 text-white text-xs rounded">
                    {video.duration}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {video.room_name}
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(video.date)}
                    </span>
                    <span>{video.file_size}</span>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPlayingVideo(video.id)}
                    className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm font-medium"
                  >
                    <Play className="w-4 h-4" />
                    Ver
                  </button>
                  <a
                    href={video.video_url}
                    download
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Descargar"
                  >
                    <Download className="w-5 h-5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de video fullscreen */}
      {playingVideo && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setPlayingVideo(null)}
        >
          <div className="w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <video
              src={videos.find((v) => v.id === playingVideo)?.video_url}
              controls
              autoPlay
              className="w-full rounded-lg"
            />
          </div>
        </div>
      )}
    </AppShell>
  );
}