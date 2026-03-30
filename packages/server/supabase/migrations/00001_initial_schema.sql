-- Initial schema for AI Company Simulator
-- Core tables: users, companies, agents, conversations, tasks, token wallets

-- Users (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'starter', 'pro', 'enterprise')),
  avatar_config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Companies
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  mission_statement TEXT,
  okrs JSONB DEFAULT '[]',
  target_market TEXT,
  culture JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Agents
CREATE TABLE public.agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  persona_config JSONB NOT NULL DEFAULT '{}',
  model_tier TEXT NOT NULL DEFAULT 'haiku' CHECK (model_tier IN ('haiku', 'sonnet', 'opus', 'budget')),
  appearance_config JSONB DEFAULT '{}',
  xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'idle' CHECK (status IN ('idle', 'working', 'meeting', 'offline')),
  hired_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Agent Conversations
CREATE TABLE public.agent_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES public.agents(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  token_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tasks
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES public.agents(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'review', 'completed', 'failed')),
  output TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- Token Wallets
CREATE TABLE public.token_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  balance_haiku INTEGER NOT NULL DEFAULT 0,
  balance_sonnet INTEGER NOT NULL DEFAULT 0,
  balance_opus INTEGER NOT NULL DEFAULT 0,
  balance_budget INTEGER NOT NULL DEFAULT 0,
  cycle_start TIMESTAMPTZ NOT NULL DEFAULT now(),
  cycle_end TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '30 days')
);

-- Token Transactions
CREATE TABLE public.token_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES public.token_wallets(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  model TEXT NOT NULL,
  task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_companies_user_id ON public.companies(user_id);
CREATE INDEX idx_agents_company_id ON public.agents(company_id);
CREATE INDEX idx_agent_conversations_agent_id ON public.agent_conversations(agent_id);
CREATE INDEX idx_tasks_company_id ON public.tasks(company_id);
CREATE INDEX idx_tasks_agent_id ON public.tasks(agent_id);
CREATE INDEX idx_token_transactions_wallet_id ON public.token_transactions(wallet_id);

-- Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies: users can only access their own data
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own companies" ON public.companies FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create companies" ON public.companies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own companies" ON public.companies FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own agents" ON public.agents FOR SELECT
  USING (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()));
CREATE POLICY "Users can create agents" ON public.agents FOR INSERT
  WITH CHECK (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()));
CREATE POLICY "Users can update own agents" ON public.agents FOR UPDATE
  USING (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()));

CREATE POLICY "Users can view own conversations" ON public.agent_conversations FOR SELECT
  USING (agent_id IN (SELECT a.id FROM public.agents a JOIN public.companies c ON a.company_id = c.id WHERE c.user_id = auth.uid()));
CREATE POLICY "Users can create conversations" ON public.agent_conversations FOR INSERT
  WITH CHECK (agent_id IN (SELECT a.id FROM public.agents a JOIN public.companies c ON a.company_id = c.id WHERE c.user_id = auth.uid()));

CREATE POLICY "Users can view own tasks" ON public.tasks FOR SELECT
  USING (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()));
CREATE POLICY "Users can create tasks" ON public.tasks FOR INSERT
  WITH CHECK (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()));
CREATE POLICY "Users can update own tasks" ON public.tasks FOR UPDATE
  USING (company_id IN (SELECT id FROM public.companies WHERE user_id = auth.uid()));

CREATE POLICY "Users can view own wallet" ON public.token_wallets FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own transactions" ON public.token_transactions FOR SELECT
  USING (wallet_id IN (SELECT id FROM public.token_wallets WHERE user_id = auth.uid()));
