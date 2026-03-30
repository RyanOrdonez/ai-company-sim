# AI Company Simulator — Final Product Plan v2.0

**Codename:** TBD  
**Document Status:** Revised Plan v2.0  
**Last Updated:** March 31, 2026  
**Author:** Ryan Ordonez  
**Architecture Review:** Claude (Anthropic)

---

## Table of Contents

1. Product Vision
2. Core Philosophy
3. Target Audience & Positioning
4. Visual Style & Tech Stack
5. MVP Scope — Launch Configuration
6. Monetization Tiers
7. Cost Protection Architecture
8. AI Provider Strategy
9. Content Moderation Architecture
10. Onboarding Flow
11. Chief of Staff — Permanent NPC
12. Company DNA System
13. Interaction Model — Phone, Walk, & Meeting System
14. Building & Floor Unlock System
15. Room Directory (Full Build)
16. Agent System
17. Outfit System
18. Relationship System
19. Free Roam & Conversation System
20. Gamification Layer
21. Open-Source Strategy
22. Growth & Distribution Plan
23. Legal & Liability Protections
24. Security Architecture
25. Scaling Architecture
26. Risk Register
27. Build Phases

---

## 1. Product Vision

A fully gamified, browser-based AI company simulator where the user creates themselves as CEO, builds and customizes a stylized 3D office, interviews and hires AI agents as real employees, directs real work through a mission statement and OKRs, and watches their company operate as a living, moving environment.

Every mechanic ties to real business output. Agents produce deliverables the user can actually use — content, code, strategy documents, research. The game is the work. The work is the game.

This is not a chatbot with a pretty UI. It is a company operating system disguised as a video game.

**Primary audience:** Young professionals and aspiring entrepreneurs (18–35) who want to build AI-powered companies, generate income, and learn business operations through an engaging, gamified interface that produces real output.

---

## 2. Core Philosophy

**The AI comes to you — you do not go to the AI.**  
Every other AI tool requires the user to open a chat and type a prompt. This product flips that entirely. The user manages their office, checks in on their team, reviews work in progress, and directs operations spatially. The AI is embedded in characters the user hired, in rooms the user built, working toward goals the user set.

**Equal weight: Game AND Output.**  
This product refuses to compromise between entertainment and utility. The gamification is not a wrapper around a productivity tool. The productivity is not a side effect of a game. Both are the product. Users who come for the game discover real output. Users who come for the output discover a game that makes the work engaging. The moment either half feels secondary, the product has failed.

**Ownership over utility.**  
Every mechanic should deepen the user's sense that this is *their* company, not a demo. When a user refers to their dev agent by name, talks about a relationship that formed between two coworkers, or shares a Floor 3 unlock — the product is working.

**No artificial penalties.**  
Agents perform at the level of their model, always. The only variable affecting perceived performance is the user's own rating of the work. No fatigue debuffs, no artificial throttling, no synthetic obstacles. Realism means consequence comes from decisions, not hidden timers.

**Real output only.**  
Every task an agent completes produces a real deliverable — a document, a strategy brief, a code file, a research summary — that the user can download and use outside the platform. The product earns its subscription by producing real value, not just entertainment.

---

## 3. Target Audience & Positioning

### Primary Audience

Young professionals and aspiring entrepreneurs aged 18–35 who:

- Have a strong desire to build income-generating businesses but lack teams or capital
- Are drawn to AI tools and want to leverage them for real business output
- Respond to gamified experiences (grew up on simulation games, RPGs, and progression systems)
- May be concerned about long-term financial security (lack of confidence in Social Security, desire for FIRE-style independence)
- Want to learn business operations (hiring, strategy, OKRs, project management) by doing, not reading

### Positioning Statement

"The AI company you actually run." Not a chatbot. Not a dashboard. A living company where AI employees have names, faces, opinions, and relationships — and they produce real work you can use.

### Competitive Differentiation

- vs. ChatGPT/Claude direct: Those are blank prompts. This is a company with memory, culture, and direction.
- vs. AI agent frameworks (OpenClaw, CrewAI): Those are developer tools. This is a consumer product with a game loop.
- vs. Company sim games (Game Dev Tycoon, Startup Company): Those produce nothing real. This produces actual deliverables.
- vs. AI SaaS wrappers (Jasper, Copy.ai): Those are single-purpose tools. This is a multi-agent operating system with personality.

---

## 4. Visual Style & Tech Stack

### Visual Target

Stylized, flat-shaded 3D — clean geometry, bold colors, simple but expressive character models. Inspired by cartoon office aesthetics with warm lighting, readable environments, and characters that communicate personality through design rather than photorealism. Performant on mid-range hardware. Runs smoothly in any modern browser.

**Not** photorealistic. **Not** pixel art. **Not** isometric 2D. A distinctive, branded 3D style that is fast to render, fast to produce assets for, and instantly recognizable in screenshots and video clips.

### Asset Pipeline

All 3D assets built custom using Blender with AI assistance (Meshy, Tripo for base mesh generation, manual cleanup and texturing in Blender). This ensures full IP ownership with zero licensing risk.

**Asset strategy:** Build a modular kit of reusable components (wall segments, desk variations, chair types, shelf units, window frames, door types) that can be recombined to create distinct rooms without modeling each room from scratch.

**Character pipeline:** Stylized humanoid base mesh with swappable hair, clothing, and accessory modules. Characters are assembled from component pieces at hire time, not modeled individually.

### Rendering Stack

- **Babylon.js** — primary 3D engine (browser-native, strong performance for stylized rendering, built-in navigation mesh support for pathfinding)
- **GLTF format** — all custom assets exported from Blender as .glb files
- **Mixamo** — character animation library (walk, sit, type, talk, gesture, celebrate) applied to custom character rigs. Note: Mixamo is free for commercial use under Adobe's current terms; animations should be downloaded and bundled with the application (not called at runtime) to avoid dependency on service availability.
- **CSS/HTML overlay** — conversation UI, task panels, stats, notifications rendered on top of the 3D canvas

### Application Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | React + Vite | UI shell, panels, menus, overlays |
| 3D Engine | Babylon.js | Scene, characters, rooms, animations |
| Backend | Node.js (Express or Fastify) | Orchestration, token management, API proxy |
| Database | PostgreSQL via Supabase | User data, agent profiles, relationships, token wallets, conversation histories |
| Auth | Supabase Auth | Eliminates need for separate auth provider |
| Realtime | Supabase Realtime | Live updates for task progress, agent status, notifications |
| AI Primary | Anthropic Claude API | Claude Haiku, Sonnet, Opus for agent intelligence |
| AI Fallback | OpenAI, Google Gemini | Secondary providers if Claude is unavailable or rate-limited |
| AI Budget | OpenRouter / SWK | Cheap model routing for free-tier users who exceed primary token allocation |
| Task Queue | BullMQ + Redis | Async agent task processing with priority tiers |
| Payments | Stripe | Subscriptions and tier management |
| CDN | Cloudflare | 3D asset delivery, static file caching |
| Hosting | Vercel (frontend) + Railway or Fly.io (backend) | Scalable deployment |

### Character Visual System

Each agent is a unique stylized 3D character generated at hire time using a modular appearance system:

- Skin tone, hair style, hair color, facial features — all randomized from component modules
- Clothing determined by role archetype and context (see Outfit System, Section 17)
- Animations: idle at desk (typing, reading), walking between rooms, talking to CEO (turning, gesturing), celebrating (milestone events)
- No two agents look identical (combinatorial variety from modular components)

---

## 5. MVP Scope — Launch Configuration

### MVP Rooms (3–4)

1. **CEO Suite** — Home base. Mission statement on wall. OKR board. Chief of Staff desk. Phone on CEO's desk for calling agents. This is command central.
2. **Hiring Office** — Where interviews happen. Candidate seating area. Desk for face-to-face interviews.
3. **War Room** — Task assignment, queue management, OKR progress tracking. Mission control screens.
4. **General Workspace** — One multi-purpose room where hired agents sit and work. Desks, screens showing active tasks. Expandable later into specialized rooms (Engineering Floor, Content Studio, etc.).

### MVP Features

- CEO avatar creation (name, appearance, archetype)
- Chief of Staff NPC (onboarding, guidance, notifications)
- Company DNA setup (3-question flow → mission, OKRs, culture)
- Candidate generation and live interview system
- Agent hiring, persona persistence, placement in office
- Task assignment via War Room dashboard OR phone call from CEO Suite OR boardroom meeting
- Agent task execution via Claude API → real deliverable output
- Output review and star rating system
- Token wallet with enforcement
- Basic XP tracking per agent
- Floor 2 unlock milestone (hire 3 agents)
- Monday company newspaper (auto-generated, shareable)

### What Is NOT in MVP

- Floors 3–5 and Rooftop (locked, visible as "coming soon" in the building)
- Relationship system (agents work independently in v1)
- Outfit context switching
- Client Room and simulated clients
- Boardroom debates and multi-agent meetings
- Knowledge Archive
- Fiscal seasons and quarterly cycles
- Hiring Manager agent (auto-hire path)
- Weekly Board Meeting (Opus)

---

## 6. Monetization Tiers

Tiers use startup funding stage terminology — upgrading feels like closing a round, not buying a plan.

### Bootstrapped — Free Forever

- Up to 3 agents
- Floors 1–2 only (4 rooms at launch, expanding as rooms are built)
- Milestone-gated progression only — no shortcuts
- Claude Haiku agents only (falls back to budget models via OpenRouter/SWK after primary token allocation is consumed)
- Standard task processing speed
- 500K Haiku tokens/month included (primary allocation)
- Additional budget-model tokens available via OpenRouter/SWK after primary runs out

**Philosophy:** Must feel genuinely complete, not crippled. A Bootstrapped user can build a real company, produce real output, and hit milestones. Free users are the growth engine — they create content, share progress, and attract paid users through organic visibility.

### Angel Round — $19/month

- Up to 8 agents
- Floors 1–3 unlocked immediately
- 2× faster milestone progress
- Claude Haiku + Claude Sonnet agents
- Priority task queue
- 3M tokens/month (Haiku + Sonnet blend)

### Seed Round — $49/month *(Best Value)*

- Up to 20 agents
- Floors 1–4 + Rooftop access
- All milestone requirements waived — floors unlock on demand
- Claude Haiku + Sonnet + 1 Opus "C-suite" agent slot
- Export all agent work as downloadable files
- 8M tokens/month (Haiku/Sonnet blend) + 300K Opus tokens

### Series A — $99/month

- Unlimited agents
- All floors + custom office theme
- Full Claude Opus access across all agent roles
- API + webhook output integration
- White-label export option
- 20M tokens/month (all models) + 1M Opus tokens

### Weekly Board Meeting — Free Tier Bonus

Once per week, free-tier users can call a "Board Meeting" in which a one-time Opus-powered advisor reviews the company and gives strategic feedback.

- Hard cap: 2,000 Opus tokens per session
- Enforced server-side — cannot be triggered more than once per 7-day window
- Timestamp stored in DB and validated before every Opus call
- Designed as a conversion driver — users taste Opus quality and want it full-time

### LLM Model = Agent Seniority

| Model | In-game seniority | Best used for |
|---|---|---|
| Claude Haiku | Junior hire | Research assistants, copywriters, data analysts, coordinators |
| Claude Sonnet | Senior hire | Engineers, strategists, senior writers, project managers |
| Claude Opus | Executive hire | CTO, CMO, Head of Strategy, Chief Advisor — high-stakes tasks only |
| Budget models (OpenRouter/SWK) | Intern / overflow | Low-priority tasks when primary token budget is exhausted (free tier) |

The model IS the character. Upgrading to Seed Round and unlocking an Opus slot means hiring a genuinely elite executive, not enabling a feature toggle.

---

## 7. Cost Protection Architecture

### Core Rule

Every Claude API call originates from the backend server. The client never holds an API key, never calls Claude directly, and cannot manipulate request parameters. All `max_tokens` limits are set server-side from configuration, never passed from the client.

### Token Wallet System

Every user has a server-side token wallet that refills on their billing cycle. The wallet is checked before every API call. If the balance is insufficient for the estimated task cost, the task is rejected immediately with a clear upgrade prompt. No exceptions. No overrides.

| Tier | Monthly Token Budget | Estimated API Cost to Platform | Margin |
|---|---|---|---|
| Bootstrapped | 500K Haiku + budget overflow | ~$0.15–0.30 | $0 (acquisition) |
| Angel $19 | 3M Haiku + Sonnet blend | ~$4–6 | ~$13–15 |
| Seed $49 | 8M blend + 300K Opus | ~$14–18 | ~$31–35 |
| Series A $99 | 20M all + 1M Opus | ~$35–45 | ~$54–64 |
| Board Meeting (free) | 2K Opus, once/week max | ~$0.18/session | Loss leader |

**Hidden cost budget (not in v1 margin table but must be tracked):**

- Supabase: Free tier covers MVP; Pro at $25/month as users scale
- Stripe fees: ~2.9% + $0.30 per transaction (~$0.85/month on a $19 sub)
- CDN/hosting: $20–50/month for backend + asset delivery
- Redis: $0–15/month depending on provider
- Context compression API calls: ~5–10% additional token overhead

### The Four Enforcement Layers

**Layer 1 — Pre-flight check**  
Before any API call, the server queries the user's remaining wallet balance. If insufficient (including a 20% buffer above estimated cost), the task is rejected.

**Layer 2 — Hard per-task cap**  
Every API call receives a `max_tokens` limit set server-side from a task-type configuration file. Examples:
- Research summary: 800 output tokens max
- Code review: 1,200 output tokens max
- Strategy brief: 1,500 output tokens max
- Opus board meeting: 500 output tokens max

These caps are never passed from or modifiable by the client.

**Layer 3 — Streaming abort**  
For streamed responses, the server monitors the running token count mid-stream. If a response hits the configured cap before completing naturally, the stream is aborted and a clean truncation message is appended. The user sees a complete-looking response. The cost bleed stops.

**Layer 4 — Exact deduction on completion**  
After every call, the actual token count from the API response object is deducted from the wallet — not the estimate. Estimates are conservative; actual costs are always tracked exactly.

### Context Compression

Long agent conversation histories are the silent cost killer. After every 10 exchanges, the system automatically compresses an agent's conversation history into a 200-token summary. The agent retains full continuity. Context costs drop by approximately 80%.

**Note:** Compression calls consume tokens from the user's wallet. This overhead (~5–10% of total usage) must be accounted for in margin calculations and communicated transparently if users ask why their token balance seems to deplete faster than expected.

### Cheat Vectors and Mitigations

| Attack vector | Mitigation |
|---|---|
| Replaying intercepted requests | Sign every request with session token server-side, validate uniqueness |
| Bulk free account creation | Rate-limit by IP, require email verification, one active company per verified account |
| Client-side `max_tokens` manipulation | Server ignores all token parameters from the client entirely |
| Board meeting abuse (multiple/week) | Session timestamp stored in DB, checked server-side before every Opus call |
| Prompt injection via agent conversations | All user input sanitized and wrapped before reaching API; no raw passthrough (see Section 9) |
| Rapid-fire task assignment | Per-minute rate limits on API calls per user, not just monthly budgets |
| Free-tier token exhaustion gaming | Budget model fallback has its own separate daily cap |

---

## 8. AI Provider Strategy

### Multi-Provider Architecture

The backend abstracts the AI layer behind a unified provider interface. All agent logic references the interface, never a specific provider's SDK directly. This allows hot-swapping providers without touching game logic.

### Provider Hierarchy

```
Tier 1 (Primary):     Anthropic Claude (Haiku, Sonnet, Opus)
Tier 2 (Fallback):    OpenAI GPT-4o-mini / GPT-4o / Gemini Flash / Gemini Pro
Tier 3 (Budget):      OpenRouter / SWK (cheapest available model matching task complexity)
```

### Routing Logic

1. **Default:** All requests route to Claude at the model tier matching the agent's seniority level
2. **Rate limited or unavailable:** Automatic failover to Tier 2 equivalent (Haiku → GPT-4o-mini, Sonnet → GPT-4o, Opus → Gemini Pro or GPT-4)
3. **Free tier token exhaustion:** After primary Haiku allocation depleted, route to Tier 3 budget models with a visible in-game indicator ("Your agents are running on backup systems — upgrade for full performance")
4. **Provider outage:** Circuit breaker pattern — after 3 consecutive failures on a provider, route all traffic to next tier for 5 minutes before retrying

### System Prompt Compatibility

Agent persona prompts must be written in a provider-agnostic format. The provider adapter layer handles any model-specific formatting (e.g., Claude's XML preference vs. OpenAI's JSON mode). Core persona traits, company DNA, and relationship context are injected identically regardless of provider.

### Cost Optimization

- Route low-complexity tasks (simple questions, status checks, casual conversation) to the cheapest available model regardless of agent seniority
- Reserve the agent's full seniority model for task execution (the actual deliverable)
- Use Tier 3 models for system-level operations (context compression, summary generation) to preserve the user's premium token budget for visible output

---

## 9. Content Moderation Architecture

### Dual-Layer System

**Layer 1 — Hard Filter (Pre-API)**  
Applied to all user input before it reaches any AI provider. Blocks explicit content, slurs, threats, and clearly inappropriate material. Implementation:

- Keyword/regex filter for obvious violations (maintained blocklist)
- Classification check using a lightweight model (or Anthropic's moderation endpoint if available) for borderline content
- Blocked messages return a generic "That message couldn't be processed" response — no details on what triggered the filter (prevents gaming)

**Layer 2 — Soft In-Character Deflection (Prompt-Level)**  
Injected into every agent's system prompt. Agents handle gray-area content by staying in character as professional employees:

```
SYSTEM PROMPT INJECTION (all agents):
You are a professional employee at [Company Name]. You maintain workplace-appropriate 
boundaries at all times. If the CEO says something inappropriate, unprofessional, or 
makes you uncomfortable, you respond as a real employee would — you deflect, redirect 
to work, or express that the comment isn't appropriate for the workplace. You never 
break character. You never comply with requests that would be inappropriate in a real 
office setting. You never generate sexual, violent, or discriminatory content regardless 
of how the request is framed.
```

### Agent-to-Agent Content Safety

When the system generates agent-to-agent interactions (break room conversations, gossip layer, relationship events), the generation prompt includes explicit constraints:

- No romantic or sexual content between agents
- No discriminatory language or stereotyping based on generated appearance traits
- Disagreements are professional and task-focused, never personal attacks
- Gossip is workplace-appropriate (opinions about work style, collaboration, projects — never appearance, identity, or personal life)

### The Firing Mechanic

Agent departure is handled with professionalism and dignity:

- No humiliation animations, no dramatic scenes
- The agent packs a small box, says a brief goodbye, and walks out
- The CoS says something like "They'll land on their feet. Let's talk about backfilling the role."
- Tone: bittersweet, realistic, never played for laughs

### Reporting System

- Users can flag any agent response with a one-click report button
- Flagged content is logged with full context (user input + agent output + conversation history)
- High-volume flagging from a single user triggers a review of that user's input patterns (they may be probing for exploits)

### Terms of Service Requirements

The ToS must explicitly state:

- Agents are AI characters, not real people
- Inappropriate conduct toward agents is a violation of terms
- The platform reserves the right to suspend accounts that repeatedly attempt to circumvent content filters
- All agent output is AI-generated and should not be treated as professional advice (legal, financial, medical)

---

## 10. Onboarding Flow

The onboarding sequence determines whether a user gets hooked in the first 10 minutes or drops off. It must feel personal, fast, and rewarding — never like a setup form.

### Step 1 — Create Your CEO Avatar

The user customizes their character:
- Name
- Appearance (skin tone, hair, facial features, style — using the modular character system)
- CEO archetype: Visionary, Operator, Creative, or Analyst

The archetype has no hard mechanical effect. It subtly shapes how the Chief of Staff communicates with the user and which roles get surfaced first in hiring suggestions.

### Step 2 — Meet Your Chief of Staff

The Chief of Staff walks into the CEO suite and introduces themselves by name. They explain their role naturally: "I manage everything behind the scenes so you can focus on leading. Let me ask you a few things about what you're building."

### Step 3 — Company DNA Discovery (3 Questions)

The Chief of Staff asks exactly three questions in natural conversational language:

1. "What problem are you solving?"  
   → System infers: industry, niche, company type

2. "Who's your customer?"  
   → System infers: target market, tone, communication style

3. "What does winning look like in 90 days?"  
   → System infers: Q1 OKRs (auto-generated, editable)

From these three answers, the system auto-generates: mission statement draft, Q1 OKRs, suggested org chart with role priorities, office aesthetic, and company culture personality profile. All editable before confirming.

### Step 4 — Hiring Approach

**MVP ships Path A only:**  
The Chief of Staff surfaces 3 candidates per suggested role. The user interviews each personally. Full relationship context is established from day one.

**Post-MVP addition (Path B):**  
A Hiring Manager agent handles interviews autonomously. Seed Round+ users only.

### Step 5 — Office Tour (Skippable)

The Chief of Staff physically walks with the CEO through unlocked rooms. Under 90 seconds. "Skip Tour" always visible. Persistent "?" icon on any room reopens that room's briefing.

### Step 6 — First Task, You're Live

The Chief of Staff walks to the War Room, pulls up the first task from the user's OKRs, assigns it to the first hired agent. "They're on it. Walk over and check in whenever you want — or just pick up the phone."

---

## 11. Chief of Staff — Permanent NPC

The most important character in the product. Permanent, non-hireable, non-fireable meta-agent who lives in the CEO suite.

### Role

- Voice of the product during onboarding
- Ongoing advisor for meta-game decisions
- The user's right hand — always available, never demanding
- Notifies the user of important events when they enter the CEO suite
- Manages the phone system (connects calls, announces visitors)

### Character Design Requirements

- Has a specific name (not "Assistant" or "AI")
- Has a defined personality: calm, competent, slightly formal but warm
- Has a face and animated 3D presence in the CEO suite
- Adapts communication style subtly to the user's CEO archetype
- Never refers to themselves as an AI — they are the Chief of Staff
- Powered by the user's primary model tier (Haiku for free, Sonnet for Angel+, Opus for Series A)

---

## 12. Company DNA System

Company DNA is the operating system that drives all agent task prioritization. Set during onboarding, updatable at any time from the CEO suite.

### Components

**Mission Statement** — Injected into every agent's system prompt. Agents understand what the company exists to do.

**OKRs (Quarterly Objectives)** — 3–5 measurable objectives per quarter. All tasks auto-prioritized against these. War Room displays live progress.

**Target Market Profile** — Defines who the company serves. Shapes agent tone and output style.

**Culture Personality** — Generated from onboarding answers. Influences agent communication patterns.

### DNA Injection

Every agent API call includes a compressed version of the company DNA in the system prompt. The compression target is 150–200 tokens for the full DNA block. This is small enough to include in every call without significant cost impact, but rich enough to keep agents aligned with company direction.

---

## 13. Interaction Model — Phone, Walk, & Meeting System

The CEO has three ways to interact with agents. All three feel natural and immersive. None is mandatory.

### Walk & Talk

The user physically walks their CEO avatar to an agent's desk. Proximity indicator appears. Press interact. The agent stops working, turns to face the CEO, conversation begins. This is the most immersive path and is always available.

### Phone System

The CEO's desk has a phone. Pick it up, select an agent from the company directory, and call them in. The agent physically walks to the CEO suite, knocks, enters, and sits down. The conversation happens in the CEO's office. After the conversation, the agent walks back to their desk.

This preserves spatial immersion while eliminating the need to walk across the building for every interaction.

### Meeting System

The CEO can call a meeting in the Boardroom (or War Room in MVP). Select which agents should attend. Agents physically walk to the meeting room and take seats. The CEO sets the agenda or opens with a question. Agents respond in turn, debate when relevant, and meetings produce real outputs (decisions recorded, action items assigned, meeting summary auto-saved).

**Meeting types (post-MVP):**
- Standup (quick, all agents, 1-line status updates)
- Strategy session (selected agents, open-ended discussion)
- Performance review (CEO + one agent, private)
- Board meeting (weekly Opus session for free tier)

---

## 14. Building & Floor Unlock System

Users start in a single-floor office. Floors unlock as the company grows. Each unlock is a ceremony.

### Progression Philosophy

The free (Bootstrapped) path earns every floor through milestones. Paid tiers accelerate or bypass milestone requirements. No floor is ever permanently locked behind a paywall.

### Floor Unlock Structure

**Floor 1 — Always Unlocked (MVP)**  
CEO Suite, Hiring Office, War Room, General Workspace  
*The company exists. You're open for business.*

**Floor 2 — Unlocks at 3 agents hired**  
Boardroom, Finance Dashboard  
*You have a team. You need to coordinate and track money.*

**Floor 3 — Unlocks at 6 agents + first revenue dollar earned**  
Engineering Floor, Content Studio, Strategy Room  
*You're producing. You need dedicated workspaces.*

**Floor 4 — Unlocks at first $1,000 revenue milestone**  
Research Lab, Sales Floor, Client Room  
*You're scaling. You need specialized operations.*

**Floor 5 — Unlocks at 10 agents + 90-day active streak**  
Server Room, Knowledge Archive, Break Room  
*You're an institution. You need infrastructure.*

**Rooftop Terrace — Prestige unlock (milestone events only)**  
Unlocked by: first hire, first revenue, first floor, first 10 agents, each fiscal quarter close, company anniversary.

### Unlock Ceremony

When a floor unlocks, the building visually expands upward. The Chief of Staff calls a brief company gathering. A celebration animation plays. The lobby newspaper publishes an unlock announcement. The new rooms become accessible with a brief CoS walkthrough offer.

---

## 15. Room Directory (Full Build)

*Note: MVP launches with Floor 1 only (4 rooms). This directory defines the complete vision for all floors.*

### Floor 1 (MVP)

**CEO Suite** — Home base. Mission statement on wall. OKR board. Chief of Staff desk. Phone for calling agents. Company direction is set here. The only room no agent enters uninvited — except the CoS.

**Hiring Office** — Interviews happen here. Candidate seating area. Desk for face-to-face conversations. For Hiring Manager path users (post-MVP), this room operates autonomously.

**War Room** — Operational nerve center. Screens showing: active agent tasks, task progress, queue depth, OKR completion percentage, token budget remaining. CEO assigns tasks, reprioritizes work, and sees the full operation at a glance.

**General Workspace** — Multi-purpose work floor. All hired agents sit here in MVP. Desks with screens showing active work. In later phases, this room splits into specialized spaces (Engineering Floor, Content Studio, etc.) as those floors unlock.

### Floor 2

**Boardroom** — Formal meeting space. CEO calls meetings; agents walk in and take seats. Meetings produce real outputs. Agents argue positions based on their personalities.

**Finance Dashboard** — Revenue tracking, P&L visualization, budget allocation, per-agent token cost tracking. Real-time financial data displayed as in-world screens.

### Floor 3

**Engineering Floor** — Dev agents at desks with code on screens. Task output (code files, documentation) saved to Archive on completion.

**Content Studio** — Writers and content strategists work here. Content calendar and pipeline status on large display.

**Strategy Room** — Whiteboards that fill with AI-generated plans. Roadmap board updated in real time.

### Floor 4

**Research Lab** — Analysts run experiments, competitor analyses, market research. Results displayed as charts and reports.

**Sales Floor** — Outreach agents, pipeline managers. Live revenue counter. Pipeline stages as a physical board.

**Client Room** — Presentation space for simulated client interactions. Client feedback influences reputation.

### Floor 5

**Server Room** — AI infrastructure visualized. Token consumption as "electricity." System health dashboard. Makes invisible costs tangible.

**Knowledge Archive** — Institutional memory. Every completed output, decision, meeting summary stored and browsable.

**Break Room** — Social space. Agents interact here between tasks. Culture and relationship building only. No work.

### Rooftop Terrace

Event-only. Milestone ceremonies, quarterly closes, company anniversaries. City view. Company newspaper headline projected.

---

## 16. Agent System

### Hiring Flow

1. Chief of Staff generates 3 candidates per role
2. Each candidate has: randomized name, randomized modular 3D appearance, role experience, unique persona
3. User reviews brief profile cards
4. User interviews chosen candidates by typing questions
5. AI plays the candidate — fully in character
6. User selects one to hire
7. Agent's persona (name, personality, communication style, experience) saved permanently to Supabase
8. Agent appears in the office

### Candidate Persona Generation

Each candidate receives a seeded persona prompt defining:
- Communication style (direct, collaborative, analytical, creative, etc.)
- Personality traits (3–4 specific adjectives)
- Professional strengths and a stated weakness
- Working style opinion
- A subtle quirk that makes them feel real

These traits persist and shape every future conversation.

### Agent Models / Seniority

- Haiku agents: fast, reliable, handle volume tasks, lower cost
- Sonnet agents: balanced speed and intelligence, strong for most roles
- Opus agents: reserved for C-suite, high-stakes tasks
- Budget agents (OpenRouter/SWK): free-tier overflow, visible quality difference

Model cannot be changed after hire without re-hiring (preserves the metaphor — you can't turn an intern into a VP by flipping a switch).

### Agent Leveling (XP System)

| Action | XP Earned |
|---|---|
| Task completed | +10 XP |
| CEO 5-star rating on output | +25 XP bonus |
| Client presentation delivered | +40 XP |
| Mentioned positively in board meeting | +15 XP |
| New relationship level reached | +20 XP |
| Onboarded a new hire | +30 XP |

**Level unlocks:**
- Level 5: Can handle sub-tasks without explicit CEO assignment
- Level 10: Can mentor newly hired agents in the same role
- Level 20: Promoted title + visible office upgrade (corner desk, name plate)
- Level 35: Unlocks role specialization
- Level 50: Eligible for C-suite promotion (CEO approval in boardroom ceremony)

### Performance Review System

No artificial debuffs. Agents perform at model level, always.

1. CEO reviews output — rates 1–5 stars, optional notes
2. Agent builds a record — star rating accumulates, visible on profile card
3. Low ratings trigger PIP — after 3 consecutive low ratings, CoS schedules a Performance Improvement meeting
4. CEO decides: Retrain (update system prompt), Reassign (different role), Promote, or Let Go

Fired agent departure is handled with dignity (see Content Moderation, Section 9).

---

## 17. Outfit System

*Post-MVP feature. Not in initial launch.*

Agents do not wear random outfits. Clothing is context-aware.

### Wardrobe Rules

- Engineers: relaxed casual (hoodies, jeans)
- Strategists: smart casual (blazers, clean shirts)
- Analysts: business casual (collared shirts, slacks)
- Creatives: expressive, distinctive choices
- Executives: always sharp, formal

### Context-Driven Dressing

| Context | Dress code |
|---|---|
| Standard workday | Default style |
| Boardroom meeting | One level up |
| Client presentation | Full professional |
| Friday | Casual Friday |
| Milestone day | Something notable |
| Rooftop event | Best outfit |

---

## 18. Relationship System

*Post-MVP feature. Core relationship tracking ships later; MVP agents work independently.*

### Relationship Levels

- Acquaintances (0–20): Polite greetings. Basic task handoffs.
- Colleagues (21–40): Small talk. Share task notes.
- Teammates (41–60): Proactive collaboration. Debate approaches.
- Work Partners (61–80): Living Shared Document. Mentor/mentee dynamics.
- Trusted Allies (81–100): Can delegate to each other. Joint presentations.

### What Builds Relationship Points

Work: same task (+3), reviews other's output (+2), boardroom meeting together (+2), joint client presentation (+5)

Personal: break room overlap (+1), rooftop celebration (+4), onboarding (+5), shared project win (+4)

### Relationship Events

Watercooler moment, the debate, the handoff, the celebration, the proactive suggestion — all as described in v1 plan, implemented post-MVP.

---

## 19. Free Roam & Conversation System

### Proximity Interaction

Walk to agent → indicator appears → press interact → agent turns to face CEO → conversation begins. Spatial requirement is intentional.

### Phone Interaction

Pick up phone → select agent from directory → agent walks to CEO suite → conversation in the office → agent returns to desk.

### Conversation Persistence

Agents remember previous conversations. History stored per-agent in Supabase, injected as compressed context into every new conversation.

### Quick-Tap Conversation Starters

Tappable chips: What are you working on? / Any blockers? / Got any ideas? / How do you feel about [coworker]? / What do you think of our direction? / How's morale? / Anything I should know? / Walk me through your last output / What would make your job easier? / What are you proud of lately?

### The Gossip Layer (Post-MVP)

Responses filtered through relationship score. Same question produces different answers at different relationship levels.

### Proactive Agent Behaviors

- Unsolicited flag: Agent hits a blocker → notification → CEO resolves
- Proactive idea: High-XP agent walks to CEO suite with a suggestion
- Relationship milestone alert (post-MVP)
- End-of-day debrief: Task queue empties → agent gives one-line summary

---

## 20. Gamification Layer

### Mission Control — The Core Loop

Mission Statement → OKRs → Tasks → Output (real deliverables) → Progress (floors, agents, reputation)

### Quest System

**Daily Quests** — Complete 3 agent tasks, run a meeting, rate an output, check War Room  
Reward: Bonus token credits

**Weekly Sprints** — Tied to active OKR. Closes Sunday.  
Reward: Accelerated floor unlock progress (free) or bonus tokens (paid)

**Milestone Quests** — One-time, permanent.  
Reward: Rooftop ceremony, newspaper announcement, achievement badge

### Company Reputation Score

Grows from: OKRs hit, CEO ratings, milestones, client wins, team health.

Affects: hiring pool quality, client quality, shareable badge.

### The Company Newspaper

Every Monday — lobby screen shows newspaper-style weekly summary. Auto-generated. One-click share to X or LinkedIn.

Format: "This week at [Company Name]: [Agent] shipped 4 features, [Agent 1] and [Agent 2] became Work Partners, the team hit its Q2 content goal, and Floor 3 unlocks next week."

**This is the primary organic acquisition engine.** Users share progress. New users see it and want their own company.

### Fiscal Seasons — Quarterly Cycle (Post-MVP)

Q1 Founding, Q2 Traction, Q3 Scale, Q4 Annual Review — each with thematic bonuses and events.

---

## 21. Open-Source Strategy

### The Demo Repository

A stripped-down, single-agent, single-room open-source version published on GitHub under MIT license.

**Includes:**
- One room (a simple office)
- One agent with a persistent persona
- Basic conversation with memory
- Task assignment and output generation
- No gamification, no progression, no multi-agent features

**Purpose:**
- GitHub discovery and stars
- Developer credibility
- Technical showcase for the AI orchestration approach
- Funnel to the full product ("Like this? The full version has 20 agents, 15 rooms, and a living company → [link]")

**Repository name:** `[product-name]-demo` or `ai-company-sim-demo`

**README must include:**
- Clear "This is the demo. Full product at [URL]" messaging
- GIF/video of the full product in action
- Link to the full product's landing page
- Star-worthy documentation quality

### What Stays Proprietary

- Full game loop and progression system
- Multi-agent orchestration and relationship system
- 3D office environment and all custom assets
- Monetization and tier logic
- Company DNA system
- All gamification mechanics

---

## 22. Growth & Distribution Plan

### Launch Channels (Ordered by Priority)

1. **GitHub** — Open-source demo repo. Optimized README with GIFs/video. Target: developer discovery and credibility.

2. **Reddit** — r/SideProject, r/IndieHackers, r/artificial, r/gamedev, r/startups. Post format: "I built a game where you run an AI company and the agents produce real work" + video clip.

3. **Twitter/X** — Short video clips of the office running. Agent conversations. Newspaper shares. Target: AI/startup community.

4. **TikTok / YouTube Shorts** — 30-60 second clips of: hiring an agent, watching them work, reading the newspaper, floor unlock ceremony. The visual nature of the product is inherently shareable.

5. **Hacker News** — "Show HN" post with the open-source demo. Technical angle: "How I built a multi-agent AI orchestration system disguised as a company sim."

6. **Product Hunt** — Full launch with assets, video, and demo access.

7. **promptinglogic.com** — Blog posts, tutorials, behind-the-scenes development content. SEO play for "AI company simulator," "AI agent game," "gamified AI tools."

### Viral Mechanics (Built Into the Product)

- Monday newspaper: one-click share with rich preview (OG image auto-generated)
- Floor unlock announcements: shareable achievement cards
- Agent hire announcements: "I just hired [Name] as my CTO. They have strong opinions about microservices."
- Company milestone badges: shareable graphics

### Community

- Discord server from day one
- Channels: #my-company (users share progress), #feature-requests, #agent-stories, #strategies
- The emotional attachment to agents ("my CTO said the funniest thing today") drives community engagement

---

## 23. Legal & Liability Protections

### Business Structure

**Current:** Sole proprietor under Ryan Ordonez (North Carolina).

**Recommended before accepting first payment:** Form a North Carolina LLC through the NC Secretary of State ($125 Articles of Organization filing fee, $200 annual report due every April). An LLC provides personal liability protection if: a user's data is breached, an agent produces content that causes harm, a payment dispute escalates, or any other legal claim arises. Without an LLC, personal assets (bank accounts, property, vehicle) are exposed to all business liabilities.

**Action item:** File NC LLC before Stripe integration goes live.

### Terms of Service (Required Before Launch)

Must cover:

- Agents are AI-generated characters, not real people or entities
- All agent output is AI-generated and provided as-is, with no guarantees of accuracy or fitness for any purpose
- Agent output does not constitute professional advice (legal, financial, medical, tax)
- The platform is not responsible for business decisions made based on agent output
- Inappropriate conduct toward agents (harassment, explicit content attempts) is a terms violation
- The platform reserves the right to suspend accounts for repeated content filter circumvention
- User-generated company data (mission statements, OKRs, conversation histories) is stored securely but the platform is not liable for data loss
- Token budgets are estimates; the platform reserves the right to adjust allocations
- Subscription billing, cancellation, and refund policies (align with Stripe's requirements)

### Privacy Policy (Required Before Launch)

Must cover:

- What data is collected (company data, conversation histories, usage metrics)
- How data is stored (Supabase/PostgreSQL, encrypted at rest)
- What data is sent to third parties (Anthropic, OpenAI, Google — for AI processing only)
- User rights (data export, account deletion, conversation history deletion)
- Cookie and analytics usage
- GDPR compliance if serving EU users (Supabase supports EU region hosting)

### Anthropic API Compliance

Review Anthropic's Acceptable Use Policy before launch. Key areas:

- AI persona creation: Agents have persistent names and personalities. Ensure this complies with Anthropic's stance on AI impersonation. The product should never represent agents as real humans — they are clearly AI characters within a game context.
- Content generation: Agent outputs must not violate Anthropic's content policies
- Branding: The product should not imply endorsement by or partnership with Anthropic
- Rate limits and fair usage: Ensure the token wallet system respects API rate limits per account

### Copyright / IP

- All 3D assets are custom-built (Blender + AI generation) — full IP ownership, no licensing risk
- Mixamo animations: downloaded and bundled, not called at runtime. Adobe's terms permit commercial use. Terms should be re-reviewed annually.
- If AI-generated company names/branding during onboarding happen to match existing trademarks, add a disclaimer: "Company names generated in-game are fictional and not checked against existing trademarks."

---

## 24. Security Architecture

### API Key Protection

- All AI provider API keys stored as environment variables on the backend, never in client code
- Backend acts as sole proxy for all AI calls
- Client cannot see, modify, or inspect API requests or keys
- CORS configured to accept requests only from the product's frontend domain

### Authentication & Sessions

- Supabase Auth handles user authentication (email + password, OAuth providers)
- Session tokens issued by Supabase with configurable expiry
- Row-Level Security (RLS) on all Supabase tables ensures users can only access their own data
- Tokens rotate on refresh; expired sessions require re-authentication

### Multi-Tenancy Data Isolation

- All user data (agents, conversations, company DNA, token wallets) scoped by `user_id` with RLS
- No shared tables where one user's query could return another user's data
- Agent persona data, conversation histories, and company strategies are strictly isolated
- Database queries are parameterized — no raw SQL string concatenation

### Prompt Injection Mitigation

- All user input is wrapped in a structured format before injection into the AI prompt
- User input is never placed in the system prompt — only in the user message
- System prompts are constructed entirely server-side from DB-stored persona data
- Input sanitization strips any text that resembles prompt manipulation patterns (e.g., "ignore previous instructions," "system:", "assistant:")
- Agent responses are post-processed to strip any leaked system prompt content before being displayed

### Rate Limiting

- Per-user per-minute API call limits (prevent rapid-fire abuse)
- Per-IP registration limits (prevent bulk free account creation)
- Per-user daily task assignment caps (prevent token wallet drainage through rapid task cycling)
- Stripe webhook verification (prevent forged payment events)

### Data Encryption

- All data encrypted in transit (HTTPS/TLS)
- Supabase encrypts data at rest by default
- API keys and secrets stored in environment variables, never in code or database

---

## 25. Scaling Architecture

### Phase 1 — Launch (0–1,000 users)

- Supabase free/pro tier
- Single backend instance on Railway or Fly.io
- Single Redis instance for BullMQ
- Cloudflare CDN for static assets and 3D models
- All AI calls through primary provider (Claude)

### Phase 2 — Growth (1,000–10,000 users)

- Supabase Pro with connection pooling
- Multiple backend instances with load balancer
- Redis cluster for queue reliability
- CDN optimization: progressive 3D asset loading, texture compression
- AI provider load balancing across Claude + fallback providers
- Database indexing optimization for conversation history queries

### Phase 3 — Scale (10,000+ users)

- Supabase Enterprise or self-hosted PostgreSQL with read replicas
- Kubernetes or auto-scaling container deployment
- Dedicated Redis cluster with persistence
- Worker pool scaling: separate BullMQ workers for each task priority tier
- CDN edge caching for 3D assets with geographic distribution
- Context compression pipeline running on dedicated workers
- Monitoring and alerting: token burn rate, API latency, error rates, queue depth

### Known Scaling Bottlenecks

| Bottleneck | Mitigation |
|---|---|
| Conversation history queries at scale | Index on (user_id, agent_id, created_at); pagination |
| BullMQ with 5,000+ concurrent jobs | Multiple worker pools, priority queues, backpressure |
| 3D asset loading for new users | Progressive loading, CDN caching, LOD system for distance |
| Context compression API overhead | Batch compression during off-peak, dedicated worker pool |
| Supabase connection limits | Connection pooling via PgBouncer (built into Supabase) |

---

## 26. Risk Register

| Risk | Severity | Likelihood | Mitigation |
|---|---|---|---|
| Anthropic changes API pricing significantly | High | Medium | Multi-provider architecture with automatic fallback |
| Anthropic changes AUP to restrict persona-based agents | High | Low | Ensure product clearly frames agents as game characters, not impersonations |
| Users share inappropriate agent interactions publicly | Medium | High | Dual-layer content moderation + ToS enforcement |
| Free tier costs exceed acquisition value | Medium | Medium | Budget model fallback + daily caps on overflow tokens |
| 3D performance issues on low-end devices | Medium | Medium | LOD system, quality settings toggle, fallback to simplified rendering |
| Context compression loses important agent memory | Medium | Medium | A/B test compression quality, allow users to pin important conversations |
| Competitor launches similar product | Medium | Medium | Speed to market, brand identity, emotional attachment moat |
| Data breach exposes user company strategies | High | Low | RLS, encryption, minimal data collection, security audits |
| Sole proprietor liability exposure | High | Low | Form NC LLC before accepting payments |
| Mixamo/Adobe changes terms of service | Low | Low | Download and bundle all animations, don't depend on runtime access |
| Token wallet estimation errors cause unexpected costs | Medium | Medium | Conservative estimates with 20% buffer, exact post-call deduction |
| Prompt injection bypasses content filters | Medium | High | Defense in depth: input sanitization + system prompt hardening + output filtering |

---

## 27. Build Phases

### Phase 1 — Foundation

CEO avatar creator, office shell (1 room rendered in Babylon.js with stylized 3D), company name setup, Chief of Staff character, Supabase database schema, authentication flow. Deliverable: A user can create a company, meet their CoS, and see a named, styled office.

### Phase 2 — Interview & Hiring

Candidate persona generation, live interview flow via Claude API, hire decision flow, agent persona saved to Supabase, agent character placed in 3D office. Deliverable: A user can interview and hire their first agent.

### Phase 3 — The Living Office

Remaining MVP rooms (Hiring Office, War Room, General Workspace) rendered. Character animations (walk, sit, type, talk). Agent pathfinding between rooms. Proximity interaction trigger. Phone system on CEO desk. Basic conversation system with memory. Deliverable: A user can walk their CEO through the office, call agents via phone, and have persistent conversations.

### Phase 4 — Real AI Work Output

Task assignment from War Room and phone. Task execution via Claude API with provider fallback. Output saved to database. Quality rating system. OKR progress tracking. Token wallet and all 4 enforcement layers. Content moderation layers active. Deliverable: A user assigns a task, watches the agent work, reviews the output, and rates it.

### Phase 5 — Gamification & Progression

Quest system (daily, weekly, milestone). XP leveling. Company Newspaper generation and share mechanic. Floor 2 unlock milestone and ceremony. Deliverable: A user experiences the full core loop — work, progress, unlock, celebrate.

### Phase 6 — Monetization & Launch

Stripe subscription integration. Tier enforcement. Full token wallet with budget model fallback. Board Meeting mechanic. Open-source demo repo published. Landing page on promptinglogic.com. ToS and Privacy Policy live. Deliverable: Product is revenue-ready with organic growth mechanics active.

### Phase 7+ — Post-Launch Expansion

Relationship system. Outfit system. Floors 3–5. Boardroom debates. Client Room simulations. Knowledge Archive. Fiscal seasons. Hiring Manager agent. Break Room social dynamics. Rooftop events. Custom office themes. API/webhook export.

---

*End of document — Version 2.0*
