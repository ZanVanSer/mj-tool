"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "MJML Preview" },
  { href: "/output", label: "MJML to HTML" },
  { href: "/html-preview", label: "HTML Preview" },
  { href: "/analyze", label: "Analyze" },
  { href: "/settings", label: "Settings" },
];

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="mx-auto flex w-full max-w-[1360px] flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[6px] border border-[var(--color-border)] bg-slate-900 text-white">
            <MailIcon />
          </div>
          <div>
            <p className="text-[15px] font-semibold tracking-[-0.01em] text-slate-950">
              MJ Tool
            </p>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center gap-1.5">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <button
                key={item.href}
                type="button"
                onClick={() => router.push(item.href)}
                className={`inline-flex items-center justify-center rounded-[6px] border px-3.5 py-2 text-[14px] transition-colors ${
                  isActive
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-transparent text-slate-600 hover:border-[var(--color-border)] hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                {item.label}
              </button>
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
