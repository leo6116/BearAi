import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";

const appName = process.env.NEXT_PUBLIC_APP_NAME || "BearAi";

export async function Footer() {
  const t = await getTranslations("footer");
  const nav = await getTranslations("nav");

  const links = [
    { href: "/", label: nav("home") },
    { href: "/generate", label: t("generate") },
    { href: "/about", label: nav("about") },
  ];

  return (
    <footer className="px-6 py-16 md:px-20 md:py-20">
      <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-2xl font-black tracking-tightest text-text-primary">
            {appName}
            <span className="text-accent">.</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-text-secondary">
            {t("tagline")}
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-8 gap-y-3">
          {links.map((link) => (
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
        <p>{t("copyright", { year: new Date().getFullYear(), appName })}</p>
        <p>{t("signoff")}</p>
      </div>
    </footer>
  );
}
