# AGENT.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **MIRRORING RULE (required)**: `CLAUDE.md` and `AGENT.md` must always have **identical content**.
> Whenever you edit one, **immediately reflect the same change in the other**. (Only the title line `# CLAUDE.md` / `# AGENT.md` may differ.)

---

## Working Principles (Karpathy) — top priority, mandatory

- **State assumptions explicitly.** If multiple interpretations exist, surface them — don't pick silently. If something is unclear, stop and ask.
- **Push back when warranted.** If the user's ask has a flaw or a simpler path exists, say so — don't just comply.
- **Convert imperative tasks into verifiable goals.** ("add X" / "fix Y" → a test that fails, then make it pass; tests green before AND after a refactor.)
- **For multi-step work, decompose as `1. step → verify: check`** and execute step by step.

---

## Project

A club side project themed around **community ESG**. Keep it small — build **core features only**.
(See `dev/active/esg-frontend/plan.md` for the feature list and what to build.)

## Scope constraints (very important)

- **Frontend only.** Do **not** build any backend / DB / server.
- Do **not** create API endpoints that connect to a backend or DB (not needed yet).
- All data is driven by **mock data**. Import local mocks instead of calling an API.
- If a request involves "backend integration", "add an endpoint", or "DB schema", restate these constraints first and confirm before proceeding.

## Tech stack

- **Build/runtime**: Vite + React + TypeScript
- **Routing**: react-router-dom
- **Styling**: Tailwind CSS
- **Map**: Kakao Maps JS SDK (API key via `VITE_KAKAO_MAP_KEY` in `.env`, free)
- **State**: zustand for global state (e.g. mileage); React hooks/Context for local state

## Design conventions (must follow)

- **Icons: Tabler only** — `@tabler/icons-react`, named imports (e.g. `import { IconLeaf } from '@tabler/icons-react'`). Do not mix other icon sets.
- **Sharp (square) corners everywhere** — no rounded corners. This is enforced globally by overriding every `borderRadius` token to `0` in `tailwind.config.js`; keep it that way and don't add rounded corners via inline styles.
- **UI copy in Korean** — all labels, buttons, messages shown to the user are Korean.
- **Colors**: ESG green accent via the `esg-*` scale (`esg-600` primary) + neutral grays; report status colors via `status.received/progress/done`. Light background.
- **Reuse the shared primitives** in `src/components/ui/` (`Button`, `Card`, `Modal`, `Badge`/`StatusBadge`, `IconButton`) instead of re-styling ad hoc; they already encode the sharp-border look.

## Commands

```bash
npm install        # install dependencies
npm run dev        # dev server (Vite, default http://localhost:5173)
npm run build      # production build (tsc + vite build)
npm run preview    # preview the production build locally
npm run lint       # ESLint
```
> Before scaffolding, these scripts may not exist yet — check `package.json` first.

## Working rules

- New features should reach a state where the screen visibly works with mock data.
- When integrating external SDKs (e.g. Kakao Map), guard against a missing API key so the app doesn't break (placeholder / graceful fallback).
- Keep the implementation **plan** separate from this instruction file. What to build (plan) lives in `dev/active/*/plan.md`; how to work (rules) lives here.
