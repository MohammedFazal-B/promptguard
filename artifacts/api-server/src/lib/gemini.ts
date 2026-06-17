import { GoogleGenAI } from "@google/genai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY must be set.");
}

export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function isRetryableError(err: unknown): boolean {
  if (err && typeof err === "object" && "status" in err) {
    const status = (err as { status: number }).status;
    return status === 429 || status === 503 || status === 500;
  }
  if (err instanceof Error) {
    return (
      err.message.includes("429") ||
      err.message.includes("503") ||
      err.message.includes("UNAVAILABLE") ||
      err.message.includes("RESOURCE_EXHAUSTED")
    );
  }
  return false;
}

function parseRetryDelayMs(err: unknown, fallbackMs: number): number {
  try {
    const msg =
      err instanceof Error
        ? err.message
        : typeof err === "object" && err !== null && "message" in err
          ? String((err as { message: unknown }).message)
          : "";
    // Gemini includes "Please retry in Xs" in the error message
    const match = msg.match(/retry in ([\d.]+)s/i);
    if (match) return Math.ceil(parseFloat(match[1]) * 1000) + 500;
  } catch {
    // ignore
  }
  return fallbackMs;
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 4,
  baseDelayMs = 5000,
): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      if (!isRetryableError(err) || attempt > maxRetries) throw err;
      const fallback = baseDelayMs * Math.pow(2, attempt - 1);
      const delay = parseRetryDelayMs(err, fallback);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
}
