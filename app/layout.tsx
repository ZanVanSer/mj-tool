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
      <body className="min-h-screen bg-[var(--color-canvas)] font-sans text-[var(--color-ink)] antialiased">
        <ToastProvider>
          <div className="min-h-screen">
            <AppHeader />
            <main className="mx-auto flex w-full max-w-[1360px] flex-col px-4 py-8 sm:px-6 lg:px-8">
              {children}
            </main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
