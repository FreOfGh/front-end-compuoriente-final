"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "@/app/api/api";

export type User = {
  id: number;
  name: string;
  email?: string;  // ✅ Agregar email
  program: string;
  progress?: number;
};

type AuthContextValue = {
  user: User | null;
  isLoggedIn: boolean;
  login: (token: string, userData?: User) => Promise<void>;  // ✅ Firma corregida
  logout: () => void;
  isLoading: boolean;
  setUser: (user: User | null) => void;  // ✅ Permitir null
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔥 Cargar usuario si hay token - CON MANEJO DE ERRORES MEJORADO
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setIsLoading(false);  // ✅ Siempre desactivar loading
          return;
        }

        const { data } = await api.get("/me");
        setUser(data);
      } catch (error) {
        console.error("Token inválido:", error);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        // ✅ GARANTIZAR que loading se desactive SIEMPRE
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // 🔐 LOGIN - Corregido para aceptar token opcionalmente userData
  const login = async (token: string, userData?: User) => {
    localStorage.setItem("token", token);

    if (userData) {
      // Si nos pasan los datos directamente, usarlos
      setUser(userData);
    } else {
      // Si no, fetch a /me
      try {
        const { data } = await api.get("/me");
        setUser(data);
      } catch (error) {
        console.error("Error al obtener usuario:", error);
      }
    }
  };

  // 🚪 LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isLoggedIn: Boolean(user),
      login,
      logout,
      isLoading,
      setUser,
    }),
    [user, isLoading]
  );

  return (
    <AuthContext.Provider value={value}>
      {/* ✅ SIEMPRE renderizar children, nunca bloquear */}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}