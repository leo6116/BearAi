import type { GenerationRequest, GenerationResult, RegenerateSceneRequest, Scene } from "@/types";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function parseErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const body = await response.json();
    if (typeof body?.error === "string") return body.error;
  } catch {
    // response had no JSON body
  }
  return fallback;
}

export async function requestGeneration(
  payload: GenerationRequest,
): Promise<GenerationResult & { resolvedTopic?: string }> {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new ApiError(
      await parseErrorMessage(response, "Generation failed. Please try again."),
      response.status,
    );
  }

  return response.json();
}

export async function requestImageAnalysis(imageBase64: string): Promise<string> {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode: "image", imageBase64, previewOnly: true }),
  });

  if (!response.ok) {
    throw new ApiError(
      await parseErrorMessage(response, "Could not analyze the image. Please try again."),
      response.status,
    );
  }

  const data = await response.json();
  return data.resolvedTopic as string;
}

export async function requestSceneRegeneration(payload: RegenerateSceneRequest): Promise<Scene> {
  const response = await fetch("/api/generate/scene", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new ApiError(
      await parseErrorMessage(response, "Scene regeneration failed. Please try again."),
      response.status,
    );
  }

  const data = await response.json();
  return data.scene;
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1] ?? result);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
