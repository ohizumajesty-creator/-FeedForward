export function normalizeGeminiModel(value?: string): string {
  return (value?.trim() || "gemini-2.5-flash").replace(/^models\//, "").trim();
}

export function safeGeminiError(payload: unknown, apiKey: string): string | undefined {
  if (!payload || typeof payload !== "object" || !("error" in payload)) return;
  const error = payload.error;
  if (!error || typeof error !== "object" || !("message" in error) || typeof error.message !== "string") return;
  // Only expose the provider's message, never its request, headers or diagnostic details.
  let message = error.message;
  for (const secret of [apiKey, encodeURIComponent(apiKey)]) {
    if (secret) message = message.split(secret).join("[redacted]");
  }
  return message.replace(/AIza[\w-]+/g, "[redacted]").replace(/[\u0000-\u001f\u007f]/g, " ").slice(0, 1000).trim() || undefined;
}
