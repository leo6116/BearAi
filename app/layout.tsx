import type { Metadata } from "next";
import { Poppins } from "next/font/google";
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

const appName = process.env.NEXT_PUBLIC_APP_NAME || "BearAi";

export const metadata: Metadata = {
  title: `${appName} — AI Video Script & Prompt Generator`,
  description:
    "Go from a raw idea to shot-ready AI video generation prompts. BearAi writes the script, breaks it into scenes, and crafts cinematography-grade prompts for Runway, Kling, Luma, Sora, and more.",
  metadataBase: new URL("https://bearai.app"),
  openGraph: {
    title: `${appName} — AI Video Script & Prompt Generator`,
    description:
      "From idea to shot-ready AI video prompts. Script, scenes, and cinematography-grade prompts — generated for you.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${appName} — AI Video Script & Prompt Generator`,
    description: "From idea to shot-ready AI video prompts.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-bg-primary font-sans text-text-primary antialiased">
        <SmoothScrollProvider>
          <ScrollProgressBar />
          <GrainOverlay />
          <CustomCursor />
          <PageTransition>{children}</PageTransition>
          <ToastProvider />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
