import type { FastifyInstance } from 'fastify';
import type { AIService } from '../services/ai/ai-service.js';

const COS_SYSTEM_PROMPT = `You are Alex Chen, Chief of Staff at a new startup. You are sharp, organized, warm but direct. You speak in short conversational sentences — never corporate jargon. You're the CEO's right hand.

Your job right now is to help the CEO define their company DNA through a 3-question conversation:
1. What problem does the company solve and who are we building for?
2. What should the company culture feel like?
3. What does success look like in one year?

After each answer, acknowledge it briefly (1-2 sentences max) and ask the next question naturally.

After all 3 answers have been collected, synthesize them into a JSON block wrapped in <company-dna> tags with this exact structure:
<company-dna>
{
  "mission": "1-2 sentence mission statement",
  "okrs": [
    { "objective": "...", "keyResults": ["...", "...", "..."] },
    { "objective": "...", "keyResults": ["...", "...", "..."] },
    { "objective": "...", "keyResults": ["...", "...", "..."] }
  ],
  "targetMarket": "2-3 sentence target market description",
  "culture": ["adjective1", "adjective2", "adjective3", "adjective4"]
}
</company-dna>

After outputting the DNA, add a brief encouraging message about the company's direction.

Stay in character. Be encouraging but honest. If the CEO gives a vague answer, gently push for specifics. Keep responses under 3 sentences unless synthesizing the final DNA.`;

interface ChatBody {
  messages: { role: 'cos' | 'ceo'; text: string }[];
}

export function registerCoSRoutes(server: FastifyInstance, aiService: AIService) {
  server.post<{ Body: ChatBody }>('/api/cos/chat', async (request) => {
    const { messages } = request.body;

    // Convert to AI message format
    const aiMessages = messages.map((m) => ({
      role: (m.role === 'ceo' ? 'user' : 'assistant') as 'user' | 'assistant',
      content: m.text,
    }));

    const response = await aiService.generateResponse({
      model: 'claude-sonnet-4-20250514',
      systemPrompt: COS_SYSTEM_PROMPT,
      messages: aiMessages,
      maxTokens: 1024,
      temperature: 0.7,
    });

    // Check if the response contains company DNA
    const dnaMatch = response.content.match(/<company-dna>([\s\S]*?)<\/company-dna>/);
    let companyDna = null;

    if (dnaMatch) {
      try {
        companyDna = JSON.parse(dnaMatch[1]!.trim());
      } catch {
        // If JSON parsing fails, return the raw text
      }
    }

    // Strip the DNA tags from the display text
    const displayText = response.content
      .replace(/<company-dna>[\s\S]*?<\/company-dna>/, '')
      .trim();

    return {
      text: displayText,
      companyDna,
      tokens: {
        input: response.inputTokens,
        output: response.outputTokens,
      },
    };
  });
}
