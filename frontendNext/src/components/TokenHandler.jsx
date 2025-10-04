"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function TokenHandler() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.backendToken) {
      localStorage.setItem('userToken', session.user.backendToken);
    } else if (status === "unauthenticated") {
      localStorage.removeItem('userToken');
    }
  }, [session, status]);

  return null;
}