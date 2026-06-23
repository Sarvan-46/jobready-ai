const VALID_OPENAI_KEY_PATTERN = /^sk-(proj-|svcacct-)?[A-Za-z0-9_-]{20,}$/;

export function getOpenAiKeyDiagnostics(apiKey = process.env.OPENAI_API_KEY) {
  const key = typeof apiKey === "string" ? apiKey.trim() : "";
  const startsWithValidPrefix = VALID_OPENAI_KEY_PATTERN.test(key);

  return {
    key,
    length: key.length,
    configured: Boolean(key),
    startsWithSk: key.startsWith("sk-"),
    startsWithProjectKey: key.startsWith("sk-proj-"),
    startsWithServiceAccountKey: key.startsWith("sk-svcacct-"),
    startsWithValidPrefix,
    hasWhitespace: key !== apiKey,
    isPlaceholder: !key || key === "your_openai_api_key_here",
  };
}

export function getOpenAiConfigStatus(apiKey = process.env.OPENAI_API_KEY) {
  const diagnostics = getOpenAiKeyDiagnostics(apiKey);

  return {
    configured: diagnostics.configured,
    keyLength: diagnostics.length,
    startsWithSk: diagnostics.startsWithSk,
    startsWithProjectKey: diagnostics.startsWithProjectKey,
    startsWithServiceAccountKey: diagnostics.startsWithServiceAccountKey,
    startsWithValidPrefix: diagnostics.startsWithValidPrefix,
    hasWhitespace: diagnostics.hasWhitespace,
    isPlaceholder: diagnostics.isPlaceholder,
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
  };
}

export function assertValidOpenAiApiKey(apiKey = process.env.OPENAI_API_KEY) {
  const diagnostics = getOpenAiKeyDiagnostics(apiKey);

  if (!diagnostics.configured) {
    const error = new Error("OpenAI API key is not configured.");
    error.code = "OPENAI_KEY_MISSING";
    error.status = 500;
    error.diagnostics = diagnostics;
    throw error;
  }

  if (diagnostics.isPlaceholder) {
    const error = new Error(
      "OpenAI API key is still set to the placeholder value. Replace OPENAI_API_KEY in .env with a real OpenAI key."
    );
    error.code = "OPENAI_KEY_PLACEHOLDER";
    error.status = 500;
    error.diagnostics = diagnostics;
    throw error;
  }

  if (!diagnostics.startsWithValidPrefix) {
    const error = new Error(
      "OpenAI API key format is invalid. Expected a key starting with sk-proj-, sk-svcacct-, or sk-."
    );
    error.code = "OPENAI_KEY_INVALID_FORMAT";
    error.status = 500;
    error.diagnostics = diagnostics;
    throw error;
  }

  return diagnostics.key;
}

export function formatOpenAiServerError(error) {
  const status = Number(error?.status) || 500;
  const code = typeof error?.code === "string" ? error.code : "OPENAI_REQUEST_FAILED";
  const message =
    error instanceof Error
      ? error.message
      : "Unable to complete OpenAI request.";

  return {
    status,
    body: {
      error: message,
      code,
      openAiConfig: error?.diagnostics
        ? {
            keyLength: error.diagnostics.length,
            startsWithSk: error.diagnostics.startsWithSk,
            startsWithProjectKey: error.diagnostics.startsWithProjectKey,
            startsWithServiceAccountKey:
              error.diagnostics.startsWithServiceAccountKey,
            startsWithValidPrefix: error.diagnostics.startsWithValidPrefix,
            hasWhitespace: error.diagnostics.hasWhitespace,
            isPlaceholder: error.diagnostics.isPlaceholder,
          }
        : getOpenAiConfigStatus(),
    },
  };
}
