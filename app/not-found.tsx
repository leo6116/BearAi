import Link from "next/link";
import { Nav } from "@/components/landing/Nav";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="flex min-h-[calc(100vh-88px)] flex-col items-center justify-center px-6 text-center">
        <p className="eyebrow mb-6">404</p>
        <h1 className="mb-6 text-[clamp(3rem,10vw,8rem)] font-black leading-none tracking-tightest text-text-primary">
          Scene not found.
        </h1>
        <p className="mx-auto mb-10 max-w-md text-lg text-text-secondary">
          This shot didn&apos;t make the final cut. The page you&apos;re looking for doesn&apos;t
          exist.
        </p>
        <Link href="/">
          <Button size="lg">Back to the homepage</Button>
        </Link>
      </main>
    </>
  );
}
