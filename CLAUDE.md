# AI Company Simulator

## What This Is

A gamified, browser-based AI company simulator where users create a CEO avatar, hire AI agents with persistent personas, assign real work, and watch their company operate in a stylized 3D office environment. Agents produce real deliverables (documents, code, strategies) that users can download. The game IS the work. The work IS the game.

Full product plan: `docs/PLAN.md`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TypeScript |
| 3D Engine | Babylon.js (stylized flat-shaded 3D, NOT photorealistic) |
| Backend | Node.js (Fastify) + TypeScript |
| Database | PostgreSQL via Supabase (auth, realtime, RLS) |
| AI Primary | Anthropic Claude API (Haiku / Sonnet / Opus) |
| AI Fallback | OpenAI, Google Gemini, OpenRouter, SWK |
| Task Queue | BullMQ + Redis |
| Payments | Stripe |
| CDN | Cloudflare |
| 3D Assets | Custom Blender + AI-generated (.glb format) |
| Animations | Mixamo (downloaded and bundled, not runtime) |

---

## Architecture Principles

- **All AI calls go through the backend.** The client NEVER holds API keys or calls providers directly.
- **Multi-provider AI layer.** Abstract behind a unified provider interface. Claude is primary; OpenAI/Gemini are fallback; OpenRouter/SWK are budget tier for free users.
- **Supabase for everything auth/data.** Row-Level Security on all tables. No separate auth provider needed.
- **Token wallet is server-side.** Checked before every API call. Pre-flight check → hard per-task cap → streaming abort → exact deduction.
- **Content moderation is dual-layer.** Hard filter blocks explicit input pre-API. Soft filter via system prompt makes agents deflect inappropriate requests in-character as professional employees.
- **Agent personas are permanent.** Once hired, an agent's name, personality traits, communication style, and experience profile are saved to the DB and injected into every conversation via system prompt.
- **Company DNA is injected into every agent call.** Compressed to ~150-200 tokens: mission statement, OKRs, target market, culture personality.

---

## Project Structure

```
ai-company-sim/
├── CLAUDE.md                  # This file
├── README.md
├── docs/
│   └── PLAN.md                # Full product plan v2.0
├── packages/
│   ├── client/                # React + Vite frontend
│   │   ├── src/
│   │   │   ├── components/    # React UI components
│   │   │   ├── scenes/        # Babylon.js 3D scenes
│   │   │   ├── hooks/         # Custom React hooks
│   │   │   ├── stores/        # State management
│   │   │   ├── api/           # API client functions
│   │   │   └── types/         # Shared TypeScript types
│   │   └── public/
│   │       └── assets/        # 3D models (.glb), textures, animations
│   └── server/                # Node.js backend
│       ├── src/
│       │   ├── routes/        # API endpoints
│       │   ├── services/      # Business logic
│       │   │   ├── ai/        # Provider abstraction layer
│       │   │   ├── agents/    # Agent persona management
│       │   │   ├── tasks/     # Task assignment and execution
│       │   │   ├── wallet/    # Token wallet enforcement
│       │   │   └── moderation/# Content filtering
│       │   ├── queue/         # BullMQ workers and job definitions
│       │   ├── db/            # Supabase client and queries
│       │   └── types/         # Shared TypeScript types
│       └── supabase/
│           └── migrations/    # Database migration files
├── supabase/                  # Supabase project config
│   ├── config.toml
│   └── migrations/
└── assets-source/             # Blender source files (not deployed)
    ├── models/
    ├── characters/
    └── animations/
```

---

## Current Phase: Phase 1 — Foundation

### Phase 1 Deliverable
A user can create a company, meet their Chief of Staff, and see a named, styled office rendered in stylized 3D.

### Phase 1 Tasks

**Project Setup:**
- [ ] Initialize monorepo with pnpm workspaces (packages/client, packages/server)
- [ ] Set up React + Vite + TypeScript in packages/client
- [ ] Set up Fastify + TypeScript in packages/server
- [ ] Create Supabase project, configure auth
- [ ] Define initial DB schema (users, companies, agents, conversations, token_wallets)
- [ ] Set up Supabase RLS policies

**3D Foundation:**
- [ ] Initialize Babylon.js scene in React
- [ ] Build or source CEO Suite room model (.glb) — stylized flat-shaded aesthetic
- [ ] Implement basic camera system (fixed angle with pan/zoom, NOT free-fly)
- [ ] Render CEO Suite with desk, chair, phone, window, CoS desk area
- [ ] Basic lighting setup (warm office lighting, no complex PBR)

**CEO Avatar:**
- [ ] Avatar creation UI (name, appearance options, CEO archetype selection)
- [ ] Modular character assembly system (base mesh + hair + clothing components)
- [ ] Place CEO avatar in the CEO Suite

**Chief of Staff:**
- [ ] CoS character model and placement in CEO Suite
- [ ] CoS conversation system (text overlay on 3D canvas)
- [ ] CoS personality and intro dialogue

**Company DNA (Onboarding):**
- [ ] 3-question conversational flow via CoS
- [ ] Claude API integration for generating mission statement, OKRs, culture from answers
- [ ] Review/edit screen for generated DNA before confirming
- [ ] Save company DNA to Supabase

### Phase 1 Does NOT Include
- Hiring system (Phase 2)
- War Room or other rooms (Phase 3)
- Task assignment or AI work output (Phase 4)
- Any gamification (Phase 5)
- Payments (Phase 6)

---

## Coding Conventions

- **TypeScript everywhere.** No plain JavaScript files.
- **Strict mode enabled.** No `any` types except when wrapping third-party libs.
- **File naming:** kebab-case for files (`agent-service.ts`), PascalCase for components (`AgentCard.tsx`).
- **Comments:** Explain WHY, not WHAT. No commented-out code in commits.
- **Error handling:** All API calls wrapped in try/catch. All Supabase queries check for errors. All AI provider calls have timeout and retry logic.
- **Environment variables:** All secrets in `.env` files, never hardcoded. `.env.example` in repo with placeholder values.
- **Git commits:** Conventional commits format (`feat:`, `fix:`, `chore:`, `docs:`).

---

## AI Provider Interface

All AI providers implement this interface. Game logic NEVER imports a specific provider SDK.

```typescript
interface AIProvider {
  generateResponse(params: {
    model: string;
    systemPrompt: string;
    messages: Message[];
    maxTokens: number;
    temperature?: number;
  }): Promise<AIResponse>;

  streamResponse(params: {
    model: string;
    systemPrompt: string;
    messages: Message[];
    maxTokens: number;
    temperature?: number;
  }): AsyncIterable<AIStreamChunk>;

  estimateTokens(text: string): number;
}

interface AIResponse {
  content: string;
  inputTokens: number;
  outputTokens: number;
  model: string;
  provider: string;
}
```

Provider routing priority:
1. Claude (primary) → 2. OpenAI/Gemini (fallback) → 3. OpenRouter/SWK (budget)

---

## Database Schema (Core Tables)

```sql
-- Users & Companies
users (id, email, created_at, subscription_tier, avatar_config)
companies (id, user_id, name, mission_statement, okrs, target_market, culture, created_at)

-- Agents
agents (id, company_id, name, role, persona_config, model_tier, appearance_config, xp, level, status, hired_at)
agent_conversations (id, agent_id, role, content, token_count, created_at)

-- Tasks & Output
tasks (id, company_id, agent_id, title, description, status, output, rating, created_at, completed_at)

-- Token Management
token_wallets (id, user_id, balance_haiku, balance_sonnet, balance_opus, balance_budget, cycle_start, cycle_end)
token_transactions (id, wallet_id, amount, model, task_id, created_at)
```

---

## Key Reminders

- The plan doc at `docs/PLAN.md` is the source of truth for product decisions. Read relevant sections when working on a feature.
- MVP is 4 rooms only: CEO Suite, Hiring Office, War Room, General Workspace.
- Art style is stylized flat-shaded 3D (like a cartoon office), NOT photorealistic.
- Users interact via: walking to agents, phone from CEO desk, or calling meetings.
- Free tier is generous by design — free users are the growth engine.
- Form NC LLC before Stripe goes live.
