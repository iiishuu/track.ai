import type { AIProvider, AIQueryRequest, AIQueryResponse } from "@/shared/types";
import { env } from "@/backend/config/env";

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 2000;

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class PerplexityProvider implements AIProvider {
  name = "perplexity";

  async query(request: AIQueryRequest): Promise<AIQueryResponse> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      if (attempt > 0) {
        // Exponential backoff: 2s, 4s, 8s + jitter
        const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1) + Math.random() * 1000;
        await sleep(delay);
      }

      const response = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.perplexityApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "sonar",
          messages: [
            {
              role: "user",
              content: request.query,
            },
          ],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content ?? "";
        const citations: string[] = data.citations ?? [];

        return {
          content,
          sources: citations,
          provider: this.name,
        };
      }

      // Retry on 429 (rate limit) and 5xx (server errors)
      if (response.status === 429 || response.status >= 500) {
        lastError = new Error(
          `Perplexity API error: ${response.status} ${response.statusText}`
        );
        continue;
      }

      // Non-retryable error
      throw new Error(
        `Perplexity API error: ${response.status} ${response.statusText}`
      );
    }

    throw lastError ?? new Error("Perplexity API error: max retries exceeded");
  }
}

export function createAIProvider(name: string = "perplexity"): AIProvider {
  switch (name) {
    case "perplexity":
      return new PerplexityProvider();
    default:
      throw new Error(`Unknown AI provider: ${name}`);
  }
}
