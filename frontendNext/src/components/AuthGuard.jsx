"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isAuthDisabled = process.env.NEXT_PUBLIC_DISABLE_AUTH === 'true';

  useEffect(() => {
    if (isAuthDisabled) return; 
    
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
    }
  }, [session, status, router, isAuthDisabled]);

  if (isAuthDisabled) {
    return children; 
  }
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return children;
}
