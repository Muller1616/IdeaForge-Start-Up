"use client";

import { createContext, useContext, ReactNode } from "react";
import { User } from "@/lib/db";

interface AuthContextType {
  user: User | null;
}

const AuthContext = createContext<AuthContextType>({ user: null });

export function AuthProvider({
  children,
  user,
}: {
  children: ReactNode;
  user: User | null;
}) {
  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
