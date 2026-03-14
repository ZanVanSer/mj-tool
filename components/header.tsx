"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/output", label: "Convert MJML" },
  { href: "/analyze", label: "Analyze" },
  { href: "/settings", label: "Settings" },
];

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/78 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#2563eb,#4f46e5)] text-white shadow-[0_14px_30px_rgba(37,99,235,0.32)]">
            <MailIcon />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-tight text-slate-950">
              MJ Tool
            </p>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-2">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium transition ${
                  item.label === "Convert MJML"
                    ? "bg-[linear-gradient(135deg,#2563eb,#4f46e5)] text-white shadow-[0_14px_24px_rgba(37,99,235,0.22)] hover:brightness-105"
                    : isActive
                      ? "border border-slate-300 bg-slate-950 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

function MailIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m6 8 6 5 6-5" />
    </svg>
  );
}
