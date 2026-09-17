import { NextResponse } from "next/server";
import { extractTopicFromImage, generateScript } from "@/lib/generation";
import { generationRequestSchema } from "@/lib/schemas";

export const runtime = "nodejs";
export const maxDuration = 60;

function detectImageMediaType(base64: string): string {
  if (base64.startsWith("/9j/")) return "image/jpeg";
  if (base64.startsWith("iVBORw0KGgo")) return "image/png";
  if (base64.startsWith("UklGR")) return "image/webp";
  return "image/jpeg";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsedRequest = generationRequestSchema.safeParse(body);
  if (!parsedRequest.success) {
    return NextResponse.json(
      { error: "Invalid request.", details: parsedRequest.error.issues },
      { status: 400 },
    );
  }

  const { mode, topic, imageBase64, durationTarget, tone, aspectRatio, previewOnly } =
    parsedRequest.data;

  try {
    let resolvedTopic = topic ?? "";

    if (mode === "image" && imageBase64) {
      const rawBase64 = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64;
      const mediaType = detectImageMediaType(rawBase64);
      resolvedTopic = await extractTopicFromImage(rawBase64, mediaType);
    }

    if (!resolvedTopic.trim()) {
      return NextResponse.json(
        { error: "Could not resolve a topic to generate from." },
        { status: 400 },
      );
    }

    if (mode === "image" && previewOnly) {
      return NextResponse.json({ resolvedTopic });
    }

    const script = await generateScript({
      topic: resolvedTopic,
      durationTarget,
      tone,
      aspectRatio,
    });

    return NextResponse.json({
      ...script,
      resolvedTopic: mode === "image" ? resolvedTopic : undefined,
    });
  } catch (error) {
    console.error("[/api/generate] generation failed:", error);
    const message =
      error instanceof Error && error.message.includes("ANTHROPIC_API_KEY")
        ? "Server is missing an API key. Set ANTHROPIC_API_KEY in your environment."
        : "Generation failed. Please try again in a moment.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
