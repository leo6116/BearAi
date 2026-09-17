import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

/**
 * Thin adapter layer so the generation routes never talk to a specific
 * vendor SDK directly. Swap providers via the AI_PROVIDER env var
 * ("anthropic" | "openai") without touching call sites.
 */

const AI_PROVIDER = (process.env.AI_PROVIDER || "anthropic").toLowerCase();
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o";

let anthropicClient: Anthropic | null = null;
function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not set");
    }
    anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return anthropicClient;
}

let openaiClient: OpenAI | null = null;
function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set");
    }
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

export interface JSONSchema {
  type: "object";
  properties: Record<string, unknown>;
  required: string[];
  [key: string]: unknown;
}

export interface StructuredCompletionParams {
  systemPrompt: string;
  userPrompt: string;
  toolName: string;
  toolDescription: string;
  schema: JSONSchema;
  imageBase64?: string;
  imageMediaType?: string;
  maxTokens?: number;
}

/**
 * Requests a JSON object matching `schema` using forced tool-use / function
 * calling, never freeform text + regex parsing. Returns the raw parsed
 * object (unvalidated) — callers run it through the matching zod schema.
 */
export async function generateStructured(
  params: StructuredCompletionParams,
): Promise<unknown> {
  if (AI_PROVIDER === "openai") {
    return generateStructuredOpenAI(params);
  }
  return generateStructuredAnthropic(params);
}

async function generateStructuredAnthropic(
  params: StructuredCompletionParams,
): Promise<unknown> {
  const client = getAnthropicClient();
  const { systemPrompt, userPrompt, toolName, toolDescription, schema, imageBase64, imageMediaType, maxTokens } =
    params;

  const content: Anthropic.MessageParam["content"] = imageBase64
    ? [
        {
          type: "image",
          source: {
            type: "base64",
            media_type: (imageMediaType || "image/jpeg") as
              | "image/jpeg"
              | "image/png"
              | "image/webp"
              | "image/gif",
            data: imageBase64,
          },
        },
        { type: "text", text: userPrompt },
      ]
    : [{ type: "text", text: userPrompt }];

  const message = await client.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: maxTokens ?? 4096,
    system: systemPrompt,
    messages: [{ role: "user", content }],
    tools: [
      {
        name: toolName,
        description: toolDescription,
        input_schema: schema,
      },
    ],
    tool_choice: { type: "tool", name: toolName },
  });

  const toolUseBlock = message.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use",
  );

  if (!toolUseBlock) {
    throw new Error("LLM did not return a tool_use block");
  }

  return toolUseBlock.input;
}

async function generateStructuredOpenAI(
  params: StructuredCompletionParams,
): Promise<unknown> {
  const client = getOpenAIClient();
  const { systemPrompt, userPrompt, toolName, toolDescription, schema, imageBase64, imageMediaType, maxTokens } =
    params;

  const userContent: OpenAI.Chat.Completions.ChatCompletionContentPart[] = imageBase64
    ? [
        {
          type: "image_url",
          image_url: { url: `data:${imageMediaType || "image/jpeg"};base64,${imageBase64}` },
        },
        { type: "text", text: userPrompt },
      ]
    : [{ type: "text", text: userPrompt }];

  const completion = await client.chat.completions.create({
    model: OPENAI_MODEL,
    max_tokens: maxTokens ?? 4096,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent },
    ],
    tools: [
      {
        type: "function",
        function: {
          name: toolName,
          description: toolDescription,
          parameters: schema,
        },
      },
    ],
    tool_choice: { type: "function", function: { name: toolName } },
  });

  const toolCall = completion.choices[0]?.message?.tool_calls?.[0];
  if (!toolCall || toolCall.type !== "function") {
    throw new Error("LLM did not return a tool call");
  }

  return JSON.parse(toolCall.function.arguments);
}
