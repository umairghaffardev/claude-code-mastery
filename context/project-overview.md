# Claude Code Mastery

## Overview

Claude Code Mastery is a full-stack reference project for learning how to use
Claude Code and its agentic features — Agent Skills, MCP servers, Hooks, and
Subagents — hands-on. It ships as a working Task Manager application (a
multi-user TODO/task tracker) built on a production-style stack, so each Claude
Code concept can be practiced against real code rather than toy examples. It is
aimed at developers who already know full-stack web development and want to
become fluent in Claude Code as a daily engineering tool.

## Goals

1. Teach the five core Claude Code building blocks — `CLAUDE.md`, Agent Skills,
   MCP servers, Hooks, and Subagents — through guided, runnable tasks.
2. Provide a realistic full-stack codebase (Next.js + NestJS + Prisma/Supabase)
   where those features can be exercised end to end.
3. Give a repeatable learning path (`PROMPT.md`) that walks a learner from
   environment validation through feature scaffolding, review, research, and tests.

## Core User Flow

1. Learner clones the repo and installs frontend + backend dependencies.
2. Learner configures `.env` files and sets up the Supabase database via Prisma
   migrations.
3. Learner runs the dev servers and launches Claude Code from the project root.
4. Learner pastes the master prompt from `PROMPT.md` and works through the
   tasks in order (MCP validation → scaffold Task feature → frontend dashboard →
   code review → research → hooks → tests → docs).
5. After each task, Claude explains which Claude Code concept was used and why,
   reinforcing the learning.

## Features

### Claude Code Configuration (the teaching layer)

- `CLAUDE.md` — project rules, architecture, and review standards loaded every session.
- Agent Skills in `.claude/skills/` — `task-manager` (CRUD scaffolding),
  `code-reviewer` (PR review checklist), plus `typescript-linting`.
- MCP servers in `.claude/mcp.json` — external service connections (e.g. Supabase/Postgres).
- Hooks in `.claude/hooks/` — automated pre/post-edit lint and format commands.
- Subagents — `researcher` (web research) and `tester` (test writing) for isolated, parallel work.

### Task Manager Application (the practice codebase)

- **Frontend** (Next.js 14 App Router, TypeScript, shadcn/ui, Tailwind):
  task dashboard, task cards with status/priority badges, and create/edit forms
  using react-hook-form + zod.
- **Backend** (NestJS + Prisma): `tasks`, `users`, and `agents` modules exposing
  a REST API under `/api/v1/` with DTO validation and a `{ data, error, meta }` envelope.
- **Data model** (Supabase PostgreSQL via Prisma): `User` and `Task` models, with
  `TaskStatus` (TODO / IN_PROGRESS / DONE) and `Priority` (LOW / MEDIUM / HIGH) enums.

## Scope

### In Scope

- A learnable, runnable example app demonstrating each Claude Code feature.
- Task CRUD across the full stack (API + dashboard UI).
- Pre-configured Skills, MCP servers, Hooks, and Subagents to study and extend.
- Guided learning prompts and supporting docs.

### Out of Scope

- Production-grade authentication/authorization (the `User.password` field exists
  but full auth flows are illustrative, not hardened).
- Deployment, CI/CD, and infrastructure automation.
- Real-time collaboration, notifications, or multi-tenant org features.
- Being a feature-complete, shippable task-management product.

## Success Criteria

1. A learner can run the full `PROMPT.md` sequence and end with a working Task
   feature scaffolded across backend and frontend.
2. Each of the five Claude Code concepts (`CLAUDE.md`, Skills, MCP, Hooks,
   Subagents) is demonstrably exercised at least once during the learning path.
3. The backend exposes working Task CRUD endpoints under `/api/v1/tasks` backed
   by Prisma migrations, and the frontend dashboard can create and list tasks.
4. TypeScript compiles cleanly (`npm run type-check`) and the linter passes
   (`npm run lint`) for code produced during the exercises.
