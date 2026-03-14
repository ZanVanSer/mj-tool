import type { Metadata } from "next";

import { AppHeader } from "@/components/header";
import { ToastProvider } from "@/components/toast-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "MJ Tool",
  description: "A personal workflow app for converting, reviewing, and shipping MJML emails.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="min-h-screen bg-[var(--color-canvas)] font-sans text-slate-950 antialiased"
      >
        <ToastProvider>
          <div className="relative min-h-screen overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.22),transparent_38%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.16),transparent_30%),linear-gradient(180deg,#fbfdff_0%,#f4f7fb_45%,#eef3f8_100%)]" />
            <div className="pointer-events-none absolute inset-x-0 top-[96px] -z-10 h-px bg-[linear-gradient(90deg,transparent,rgba(148,163,184,0.45),transparent)]" />

            <AppHeader />

            <main className="mx-auto flex w-full max-w-[1500px] flex-col px-3 pb-8 pt-6 sm:px-4 lg:px-5">
              {children}
            </main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
