"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function TokenHandler() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.backendToken) {
      localStorage.setItem('userToken', session.user.backendToken);
    }
  }, [session]);

  return null;
}