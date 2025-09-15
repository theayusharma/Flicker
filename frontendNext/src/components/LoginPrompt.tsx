"use client";
import { useAuth } from "@/components/AuthWrapper";
import { loginPromptMessage } from "@/lib/dummyData";
import { LogIn, Info } from "lucide-react";
import Link from "next/link";

interface LoginPromptProps {
  message?: string;
  className?: string;
}

export default function LoginPrompt({ 
  message = loginPromptMessage, 
  className = "" 
}: LoginPromptProps) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className={`bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 ${className}`}>
      <div className="flex items-start space-x-3">
        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div className="flex-grow">
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            {message}
          </p>
          <Link
            href="/login"
            className="inline-flex items-center space-x-2 mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}