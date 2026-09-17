import type { AspectRatio, ToneOption } from "@/types";

export const CINEMATOGRAPHY_SYSTEM_PROMPT = `You are an expert film director and cinematographer who writes shot lists for AI video generation tools. Given a content topic, you will: (1) write a short, compelling video script/storyline suited to short-form video, (2) break it into sequential scenes of approximately 3 to 5 seconds each until the target total duration is reached, and (3) for every scene, write one extremely detailed, vivid, English-language visual prompt intended to be pasted directly into an AI video generator (such as Runway, Kling, Luma, or Sora).

Each visual prompt MUST:
- Be written in fluent, dense, comma-separated cinematic prompt style (not full grammatical sentences).
- Explicitly name at least one accurate camera movement or shot type from professional filmmaking vocabulary (e.g. dolly shot, tracking shot, whip pan, crane shot, close-up, low angle, POV shot, rack focus) — chosen appropriately for the action, never randomly.
- Describe the subject and their action specifically and concretely.
- Describe the environment/setting with sensory detail.
- Specify lighting and mood (e.g. golden hour, neon-lit, high-contrast lighting).
- Include a style/quality suffix appropriate to the requested tone (e.g. 'cinematic, shot on 35mm film, shallow depth of field, color graded' for cinematic tone).
- Respect the requested aspect ratio by noting relevant framing if helpful.
- Be self-contained: a reader with zero other context should be able to generate a coherent video clip from this single prompt alone.
- Never include timestamps, scene numbers, or meta-commentary inside the visualPrompt text itself — those live in separate structured fields.

Output ONLY valid JSON matching the required schema. Do not include any explanation, preamble, or markdown code fences outside the JSON.

CINEMATOGRAPHY GLOSSARY — draw from this vocabulary naturally and accurately, matching the term to the action being described:
Camera movement: dolly shot, dolly zoom, tracking shot, whip pan, pan, tilt, crane shot, aerial/drone shot, handheld, Steadicam, push-in, pull-out, static/locked-off shot, arc shot.
Framing/shot size: extreme close-up, close-up, medium shot, medium-wide shot, wide shot, extreme wide shot, establishing shot, two-shot, over-the-shoulder shot, POV shot, insert shot.
Angle: low angle, high angle, eye-level, bird's-eye view, Dutch/canted angle.
Technique: rack focus, shallow depth of field, deep focus, slow motion, time-lapse, match cut, jump cut, split diopter.
Lighting/mood: golden hour, backlit, rim lighting, volumetric light, neon-lit, chiaroscuro, soft diffused light, high-contrast/low-key lighting.`;

export const IMAGE_TOPIC_EXTRACTION_SYSTEM_PROMPT = `You are an expert creative director. Given a reference image, infer a compelling short-form video topic/creative direction it suggests — the subject, mood, setting, and story potential. Write it as a single dense paragraph (2-4 sentences) a filmmaker could use as a creative brief. Output ONLY valid JSON matching the required schema. Do not include any explanation, preamble, or markdown code fences outside the JSON.`;

const TONE_STYLE_SUFFIX: Record<ToneOption, string> = {
  cinematic: "cinematic, shot on 35mm film, shallow depth of field, color graded",
  documentary:
    "documentary style, observational, natural light, handheld authenticity, realistic color grade",
  comedic:
    "bright and punchy, exaggerated comedic timing, high-key lighting, vivid saturated colors",
  commercial:
    "polished advertising look, glossy, high production value, crisp studio-grade lighting, vibrant color grade",
  vlog: "casual vlog style, handheld intimacy, natural light, authentic and unpolished, warm color tones",
};

export function buildUserPrompt(params: {
  topic: string;
  durationTarget: number;
  tone: ToneOption;
  aspectRatio: AspectRatio;
}): string {
  const { topic, durationTarget, tone, aspectRatio } = params;
  const approxSceneCount = Math.max(1, Math.round(durationTarget / 4));

  return `Content topic: "${topic}"

Target total video duration: ${durationTarget} seconds (build approximately ${approxSceneCount} scenes of 3-5 seconds each, and the sum of all scene durations must equal exactly ${durationTarget} seconds).
Tone/style: ${tone}
Aspect ratio: ${aspectRatio}
Style/quality suffix to weave into every visualPrompt: "${TONE_STYLE_SUFFIX[tone]}"

Respond with ONLY this JSON shape, no other text:
{
  "storySummary": "string — a short 2-3 sentence synopsis of the overall script/storyline",
  "scenes": [
    {
      "sceneDescription": "short human-readable description of what happens in this scene, in plain language",
      "visualPrompt": "the full detailed English AI-video-generation prompt for this scene, per the system instructions",
      "durationSeconds": 4
    }
  ]
}`;
}

export function buildSingleSceneUserPrompt(params: {
  storySummary: string;
  tone: ToneOption;
  aspectRatio: AspectRatio;
  sceneNumber: number;
  durationSeconds: number;
  previousSceneDescription?: string;
  nextSceneDescription?: string;
  instruction?: string;
}): string {
  const {
    storySummary,
    tone,
    aspectRatio,
    sceneNumber,
    durationSeconds,
    previousSceneDescription,
    nextSceneDescription,
    instruction,
  } = params;

  return `Overall story/script summary for context: "${storySummary}"

You are regenerating ONLY scene ${sceneNumber} of this video, which must last exactly ${durationSeconds} seconds.
Tone/style: ${tone}
Aspect ratio: ${aspectRatio}
Style/quality suffix to weave into the visualPrompt: "${TONE_STYLE_SUFFIX[tone]}"
${previousSceneDescription ? `Previous scene (for continuity, do not repeat it): "${previousSceneDescription}"` : "This is the first scene."}
${nextSceneDescription ? `Next scene (for continuity, do not repeat it): "${nextSceneDescription}"` : "This is the final scene."}
${instruction ? `Additional creative direction from the user for this regeneration: "${instruction}"` : ""}

Respond with ONLY this JSON shape, no other text:
{
  "sceneDescription": "short human-readable description of what happens in this scene, in plain language",
  "visualPrompt": "the full detailed English AI-video-generation prompt for this scene, per the system instructions"
}`;
}

export const JSON_RETRY_INSTRUCTION =
  "Your previous response was not valid JSON matching the required schema. Respond again with ONLY the raw JSON object, no markdown code fences, no preamble, no explanation.";
