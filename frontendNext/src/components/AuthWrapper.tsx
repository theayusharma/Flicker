"use client";
import { useSession } from "next-auth/react";
import { ReactNode, createContext, useContext } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  session: any;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  session: null,
});

export const useAuth = () => useContext(AuthContext);

interface AuthWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function AuthWrapper({ children, fallback }: AuthWrapperProps) {
  const { data: session, status } = useSession();
  
  const authContextValue: AuthContextType = {
    isAuthenticated: !!session,
    isLoading: status === "loading",
    session,
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}