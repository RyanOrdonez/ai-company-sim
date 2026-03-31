import type { FastifyInstance } from 'fastify';
import { getSupabaseAdmin } from '../db/supabase.js';

interface CreateCompanyBody {
  userId?: string;
  name: string;
  mission: string;
  okrs: { objective: string; keyResults: string[] }[];
  targetMarket: string;
  culture: string[];
  ceoName: string;
  ceoArchetype: string;
  avatarConfig: Record<string, unknown>;
}

export function registerCompanyRoutes(server: FastifyInstance) {
  server.post<{ Body: CreateCompanyBody }>('/api/company', async (request, reply) => {
    const { name, mission, okrs, targetMarket, culture, ceoName, ceoArchetype, avatarConfig } = request.body;
    const supabase = getSupabaseAdmin();

    // For now, create a guest user if no userId provided
    // Later this will use Supabase Auth
    let userId = request.body.userId;

    if (!userId) {
      const { data: user, error: userError } = await supabase
        .from('users')
        .insert({
          email: `guest_${Date.now()}@temp.local`,
          subscription_tier: 'free',
          avatar_config: avatarConfig,
        })
        .select('id')
        .single();

      if (userError) {
        return reply.status(500).send({ error: 'Failed to create user', details: userError.message });
      }
      userId = user.id;
    }

    // Create company
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .insert({
        user_id: userId,
        name,
        mission_statement: mission,
        okrs,
        target_market: targetMarket,
        culture,
      })
      .select('id, name')
      .single();

    if (companyError) {
      return reply.status(500).send({ error: 'Failed to create company', details: companyError.message });
    }

    // Create the CoS agent
    const { error: agentError } = await supabase
      .from('agents')
      .insert({
        company_id: company.id,
        name: 'Alex Chen',
        role: 'Chief of Staff',
        persona_config: {
          personality: 'sharp, organized, warm but direct',
          style: 'short conversational sentences, no jargon',
          background: 'Former operations lead at a Series B startup',
        },
        model_tier: 'sonnet',
        appearance_config: {
          skinTone: '#C68642',
          hairStyle: 'slicked',
          hairColor: '#1A1A1A',
          outfitColor: '#333333',
          accessory: 'glasses',
        },
        status: 'active',
      });

    if (agentError) {
      console.error('Failed to create CoS agent:', agentError.message);
    }

    // Create token wallet for user
    const now = new Date();
    const cycleEnd = new Date(now);
    cycleEnd.setMonth(cycleEnd.getMonth() + 1);

    const { error: walletError } = await supabase
      .from('token_wallets')
      .insert({
        user_id: userId,
        balance_haiku: 50000,  // Free tier starting balance
        balance_sonnet: 10000,
        balance_opus: 1000,
        balance_budget: 100000,
        cycle_start: now.toISOString(),
        cycle_end: cycleEnd.toISOString(),
      });

    if (walletError) {
      console.error('Failed to create token wallet:', walletError.message);
    }

    return {
      company: {
        id: company.id,
        name: company.name,
      },
      userId,
      ceoName,
      ceoArchetype,
    };
  });
}
