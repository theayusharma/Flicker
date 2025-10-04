import type { Metadata } from "next";
import "./globals.css";
import DashboardWrap from "./dashboardWrap";
import { ThemeProvider } from "@/components/theme-provider";
import AuthProvider from "@/components/AuthProvider";
import TokenHandler from "@/components/TokenHandler";


export const metadata: Metadata = {
  title: "Flicker",
  description: "Project Management Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <TokenHandler />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <DashboardWrap>
              {children}
            </DashboardWrap>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
