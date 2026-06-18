import OpenAI from "openai";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("OPENROUTER_API_KEY or GEMINI_API_KEY must be set.");
}

export const ai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.GEMINI_API_KEY,
});

function isRetryableError(err: unknown): boolean {
  if (err && typeof err === "object" && "status" in err) {
    const status = (err as { status: number }).status;
    return status === 429 || status === 503 || status === 500 || status === 502;
  }
  if (err instanceof Error) {
    return (
      err.message.includes("429") ||
      err.message.includes("503") ||
      err.message.includes("502") ||
      err.message.includes("UNAVAILABLE") ||
      err.message.includes("rate limit") ||
      err.message.includes("timeout")
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
  baseDelayMs = 2000,
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
