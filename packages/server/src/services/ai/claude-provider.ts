import Anthropic from '@anthropic-ai/sdk';
import type { AIProvider, AIGenerateParams, AIResponse, AIStreamChunk } from '../../types/ai.js';

export class ClaudeProvider implements AIProvider {
  readonly name = 'claude';
  private client: Anthropic;

  constructor(apiKey: string) {
    this.client = new Anthropic({ apiKey });
  }

  async generateResponse(params: AIGenerateParams): Promise<AIResponse> {
    const response = await this.client.messages.create({
      model: params.model,
      max_tokens: params.maxTokens,
      system: params.systemPrompt,
      messages: params.messages.map((m) => ({
        role: m.role === 'system' ? 'user' : m.role,
        content: m.content,
      })),
      temperature: params.temperature,
    });

    const textBlock = response.content.find((block) => block.type === 'text');

    return {
      content: textBlock?.text ?? '',
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      model: response.model,
      provider: this.name,
    };
  }

  async *streamResponse(params: AIGenerateParams): AsyncIterable<AIStreamChunk> {
    const stream = this.client.messages.stream({
      model: params.model,
      max_tokens: params.maxTokens,
      system: params.systemPrompt,
      messages: params.messages.map((m) => ({
        role: m.role === 'system' ? 'user' : m.role,
        content: m.content,
      })),
      temperature: params.temperature,
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        yield { content: event.delta.text, done: false };
      }
    }

    yield { content: '', done: true };
  }

  estimateTokens(text: string): number {
    // Rough estimation: ~4 characters per token for English text
    return Math.ceil(text.length / 4);
  }
}
