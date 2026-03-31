# AI Company Simulator — Task Tracker

**Current Phase:** Phase 1 — Foundation
**Goal:** A user can create a company, meet their Chief of Staff, and see a named, styled office rendered in stylized 3D.

---

## Phase 1 — Foundation

### 1. Project Setup
- [x] **T-001** Initialize monorepo with pnpm workspaces
- [x] **T-002** Set up React + Vite + TypeScript in packages/client
- [x] **T-003** Set up Fastify + TypeScript in packages/server
- [x] **T-004** Define initial DB schema (users, companies, agents, conversations, token_wallets)
- [x] **T-005** Set up Supabase RLS policies
- [x] **T-006** Build AI provider abstraction interface (AIProvider, AIService, ClaudeProvider)
- [x] **T-007** Create Supabase project online, configure auth, add keys to .env

### 2. 3D Foundation
- [x] **T-008** Initialize Babylon.js scene in React (basic scene running)
- [x] **T-009** Build CEO Suite room model — stylized flat-shaded walls, floor, dollhouse view
- [x] **T-010** Implement proper camera system (fixed angle, pan/zoom, room boundaries)
- [x] **T-011** Furnish CEO Suite — desk, chair, phone, window, CoS desk area
- [x] **T-012** Lighting pass — warm office lighting, directional shadows

### 3. CEO Avatar
- [x] **T-013** Avatar creation UI — name input, appearance options, CEO archetype selection
- [x] **T-014** Modular character assembly system (base mesh + hair + clothing components)
- [x] **T-015** Place CEO avatar in CEO Suite with idle animation

### 4. Chief of Staff (CoS)
- [x] **T-016** CoS character model and placement at their desk in CEO Suite
- [x] **T-017** CoS conversation system — text overlay UI on 3D canvas
- [x] **T-018** CoS personality definition and intro dialogue script

### 5. Company DNA (Onboarding)
- [x] **T-019** 3-question conversational flow via CoS (industry, vision, culture)
- [x] **T-020** Claude API integration — generate mission statement, OKRs, culture from answers
- [x] **T-021** Review/edit screen for generated Company DNA before confirming
- [x] **T-022** Save company DNA to Supabase and display in CEO Suite

---

## Phase 2 — Interview & Hiring

### 6. Candidate System
- [ ] **T-023** Candidate persona generator — name, personality, skills, appearance via Claude
- [ ] **T-024** Hiring Office room model and 3D scene
- [ ] **T-025** Candidate character model placed in interview seating area

### 7. Interview Flow
- [ ] **T-026** Live interview conversation UI (CEO asks questions, candidate responds via Claude)
- [ ] **T-027** Interview evaluation — strengths/weaknesses summary after interview
- [ ] **T-028** Hire/pass decision flow with confirmation

### 8. Agent Persistence
- [ ] **T-029** Save hired agent persona to Supabase (name, role, personality, appearance)
- [ ] **T-030** Place hired agent character in General Workspace with desk assignment
- [ ] **T-031** Agent status system (idle, working, meeting, offline)

---

## Phase 3 — The Living Office

### 9. Room Expansion
- [ ] **T-032** War Room model and 3D scene (mission control screens, task boards)
- [ ] **T-033** General Workspace model and 3D scene (desks, screens)
- [ ] **T-034** Room navigation system — move between rooms with transitions

### 10. Character Animation
- [ ] **T-035** Integrate Mixamo animations (walk, sit, type, talk, gesture)
- [ ] **T-036** Agent pathfinding between rooms using Babylon.js nav mesh
- [ ] **T-037** Proximity-based interaction triggers (walk near agent to talk)

### 11. Communication Systems
- [ ] **T-038** Phone system on CEO desk — call any agent from CEO Suite
- [ ] **T-039** Persistent conversation system with memory per agent
- [ ] **T-040** Context compression — auto-summarize after every 10 exchanges

---

## Phase 4 — Real AI Work Output

### 12. Task Assignment
- [ ] **T-041** War Room task dashboard — create, assign, track tasks
- [ ] **T-042** Phone-based task assignment (call agent, describe task)
- [ ] **T-043** Task type definitions with max_tokens caps per type

### 13. Task Execution
- [ ] **T-044** BullMQ + Redis task queue with priority tiers
- [ ] **T-045** Agent task execution via Claude API with streaming
- [ ] **T-046** Provider fallback routing (Claude → OpenAI/Gemini → Budget)
- [ ] **T-047** Output saved to database, downloadable as file

### 14. Quality & Cost Control
- [ ] **T-048** Output review UI with 1–5 star rating system
- [ ] **T-049** OKR progress tracking tied to completed tasks
- [ ] **T-050** Token wallet enforcement — all 4 layers (pre-flight, cap, streaming abort, exact deduction)
- [ ] **T-051** Content moderation — hard filter + soft filter via system prompt

---

## Phase 5 — Gamification & Progression

### 15. Progression Systems
- [ ] **T-052** Quest system — daily, weekly, milestone quests
- [ ] **T-053** XP and leveling system per agent
- [ ] **T-054** Floor 2 unlock milestone (hire 3 agents) with unlock ceremony

### 16. Social & Sharing
- [ ] **T-055** Monday Company Newspaper — auto-generated weekly summary
- [ ] **T-056** Newspaper share mechanic (social image export)

---

## Phase 6 — Monetization & Launch

### 17. Payments
- [ ] **T-057** Stripe subscription integration (Bootstrapped, Angel, Seed, Series A)
- [ ] **T-058** Tier enforcement — agent limits, model access, floor access per tier
- [ ] **T-059** Token wallet with budget model fallback for free tier

### 18. Launch Prep
- [ ] **T-060** Weekly Board Meeting mechanic (Opus, free tier, 1x/week)
- [ ] **T-061** Landing page on promptinglogic.com
- [ ] **T-062** ToS and Privacy Policy
- [ ] **T-063** Open-source demo repo published
- [ ] **T-064** Form NC LLC before Stripe goes live

---

## Phase 7+ — Post-Launch

- [ ] **T-065** Agent relationship system
- [ ] **T-066** Outfit context switching system
- [ ] **T-067** Floors 3–5 and Rooftop
- [ ] **T-068** Boardroom debates (multi-agent meetings)
- [ ] **T-069** Client Room simulations
- [ ] **T-070** Knowledge Archive
- [ ] **T-071** Fiscal seasons and quarterly cycles
- [ ] **T-072** Hiring Manager agent (auto-hire)
- [ ] **T-073** Break Room social dynamics
- [ ] **T-074** Custom office themes
- [ ] **T-075** API/webhook export integration

---

## How to Use

Tell Claude: **"Start task T-XXX"** and it will know exactly what to build next.

**Recommended next task:** `T-007` (set up Supabase project) or `T-009` (build the CEO Suite 3D room model) — either path unblocks the rest of Phase 1.
