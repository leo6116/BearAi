import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Nav } from "@/components/landing/Nav";
import { Button } from "@/components/ui/Button";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <>
      <Nav />
      <main className="flex min-h-[calc(100vh-88px)] flex-col items-center justify-center px-6 text-center">
        <p className="eyebrow mb-6">{t("eyebrow")}</p>
        <h1 className="mb-6 text-[clamp(3rem,10vw,8rem)] font-black leading-none tracking-tightest text-text-primary">
          {t("title")}
        </h1>
        <p className="mx-auto mb-10 max-w-md text-lg text-text-secondary">{t("description")}</p>
        <Link href="/">
          <Button size="lg">{t("cta")}</Button>
        </Link>
      </main>
    </>
  );
}
