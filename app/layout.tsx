import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import "./globals.css";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { GrainOverlay } from "@/components/ui/GrainOverlay";
import { ScrollProgressBar } from "@/components/ui/ScrollProgressBar";
import { PageTransition } from "@/components/ui/PageTransition";
import { SmoothScrollProvider } from "@/components/ui/SmoothScrollProvider";
import { ToastProvider } from "@/components/ui/ToastProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");

  return {
    title: t("title"),
    description: t("description"),
    metadataBase: new URL("https://bearai.app"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${poppins.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-bg-primary font-sans text-text-primary antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SmoothScrollProvider>
            <ScrollProgressBar />
            <GrainOverlay />
            <CustomCursor />
            <PageTransition>{children}</PageTransition>
            <ToastProvider />
          </SmoothScrollProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
