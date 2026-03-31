const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export interface CompanyDna {
  mission: string;
  okrs: { objective: string; keyResults: string[] }[];
  targetMarket: string;
  culture: string[];
}

export interface CoSChatResponse {
  text: string;
  companyDna: CompanyDna | null;
  tokens: { input: number; output: number };
}

export async function sendCoSMessage(
  messages: { role: 'cos' | 'ceo'; text: string }[],
): Promise<CoSChatResponse> {
  const res = await fetch(`${API_BASE}/api/cos/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) {
    throw new Error(`CoS chat failed: ${res.status}`);
  }

  return res.json();
}
