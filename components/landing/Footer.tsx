import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const appName = process.env.NEXT_PUBLIC_APP_NAME || "BearAi";

export function Footer() {
  return (
    <footer className="px-6 py-16 md:px-20 md:py-20">
      <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-2xl font-black tracking-tightest text-text-primary">
            {appName}
            <span className="text-accent">.</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-text-secondary">
            AI video script &amp; prompt generator — from idea to shot-ready, instantly.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-8 gap-y-3">
          {[
            { href: "/", label: "Home" },
            { href: "/generate", label: "Generate" },
            { href: "/about", label: "About" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              data-cursor-hover
              className="group inline-flex items-center gap-1 text-sm font-medium text-text-secondary transition-colors duration-300 hover:text-accent"
            >
              {link.label}
              <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-16 flex flex-col gap-4 border-t border-border pt-8 text-xs text-text-secondary md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {appName}. All rights reserved.
        </p>
        <p>Built for creators who&apos;d rather direct than type prompts.</p>
      </div>
    </footer>
  );
}
