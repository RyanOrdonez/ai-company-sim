import type { CompanyDna } from './cos';
import type { AvatarConfig } from '../types/avatar';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export interface CreateCompanyResult {
  company: { id: string; name: string };
  userId: string;
  ceoName: string;
  ceoArchetype: string;
}

export async function createCompany(
  companyName: string,
  dna: CompanyDna,
  avatarConfig: AvatarConfig,
): Promise<CreateCompanyResult> {
  const res = await fetch(`${API_BASE}/api/company`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: companyName,
      mission: dna.mission,
      okrs: dna.okrs,
      targetMarket: dna.targetMarket,
      culture: dna.culture,
      ceoName: avatarConfig.name,
      ceoArchetype: avatarConfig.archetype,
      avatarConfig,
    }),
  });

  if (!res.ok) {
    throw new Error(`Create company failed: ${res.status}`);
  }

  return res.json();
}
