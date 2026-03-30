export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIGenerateParams {
  model: string;
  systemPrompt: string;
  messages: Message[];
  maxTokens: number;
  temperature?: number;
}

export interface AIResponse {
  content: string;
  inputTokens: number;
  outputTokens: number;
  model: string;
  provider: string;
}

export interface AIStreamChunk {
  content: string;
  done: boolean;
}

export interface AIProvider {
  readonly name: string;

  generateResponse(params: AIGenerateParams): Promise<AIResponse>;

  streamResponse(params: AIGenerateParams): AsyncIterable<AIStreamChunk>;

  estimateTokens(text: string): number;
}
