import { NextResponse } from "next/server";
import { regenerateScene } from "@/lib/generation";
import { regenerateSceneRequestSchema } from "@/lib/schemas";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = regenerateSceneRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request.", details: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    const scene = await regenerateScene(parsed.data);
    return NextResponse.json({ scene });
  } catch (error) {
    console.error("[/api/generate/scene] regeneration failed:", error);
    const message =
      error instanceof Error && error.message.includes("ANTHROPIC_API_KEY")
        ? "Server is missing an API key. Set ANTHROPIC_API_KEY in your environment."
        : "Scene regeneration failed. Please try again.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
