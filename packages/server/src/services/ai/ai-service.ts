import type { AIProvider, AIGenerateParams, AIResponse, AIStreamChunk } from '../../types/ai.js';

export class AIService {
  private providers: AIProvider[] = [];

  registerProvider(provider: AIProvider): void {
    this.providers.push(provider);
  }

  private getProvider(preferred?: string): AIProvider {
    if (this.providers.length === 0) {
      throw new Error('No AI providers registered');
    }

    if (preferred) {
      const found = this.providers.find((p) => p.name === preferred);
      if (found) return found;
    }

    // Return first registered provider (priority order)
    return this.providers[0]!;
  }

  async generateResponse(params: AIGenerateParams, preferredProvider?: string): Promise<AIResponse> {
    const provider = this.getProvider(preferredProvider);

    try {
      return await provider.generateResponse(params);
    } catch (error) {
      // Try fallback providers
      for (const fallback of this.providers) {
        if (fallback.name === provider.name) continue;
        try {
          return await fallback.generateResponse(params);
        } catch {
          continue;
        }
      }
      throw error;
    }
  }

  async *streamResponse(params: AIGenerateParams, preferredProvider?: string): AsyncIterable<AIStreamChunk> {
    const provider = this.getProvider(preferredProvider);
    yield* provider.streamResponse(params);
  }

  estimateTokens(text: string, preferredProvider?: string): number {
    const provider = this.getProvider(preferredProvider);
    return provider.estimateTokens(text);
  }
}
