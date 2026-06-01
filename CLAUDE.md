# CLAUDE.md — Project Rules for Claude Code

This file is read by Claude Code at the start of every session.
It defines conventions, architecture decisions, and review standards.

---

## 🏗️ Architecture

- **Frontend**: Next.js 14 App Router with TypeScript. All pages are server components by default; use `"use client"` only when needed.
- **Backend**: NestJS with Prisma. Each domain (tasks, agents, users) lives in its own module under `src/modules/`.
- **Database**: Supabase PostgreSQL. Always use Prisma migrations — never write raw SQL schema changes.
- **API**: REST with `/api/v1/` prefix. All endpoints return `{ data, error, meta }` envelope.

---

## 📐 Coding Standards

### TypeScript
- Strict mode is ON. Never use `any` — use `unknown` + type guards instead.
- Prefer `interface` for object shapes, `type` for unions/primitives.
- All async functions must handle errors (try/catch or `.catch()`).

### React / Next.js
- Components: PascalCase. Files: kebab-case (`task-card.tsx`).
- Use `shadcn/ui` components before building custom ones.
- Forms: always use `react-hook-form` + `zod` for validation.
- No inline styles — use Tailwind CSS utility classes only.

### NestJS / Backend
- DTOs for all request/response bodies — use `class-validator` decorators.
- Services handle business logic. Controllers only handle HTTP concerns.
- Always return proper HTTP status codes.
- Use Prisma transactions for multi-step writes.

---

## 🗂️ File Organization

```
frontend/src/
  app/           # Next.js pages (App Router)
  components/
    ui/          # shadcn/ui primitives
    layout/      # Header, Sidebar, etc.
    features/    # Domain-specific components
  lib/           # Utilities, api client, hooks
  types/         # Shared TypeScript types

backend/src/
  modules/
    tasks/       # tasks.module, controller, service, dto
    agents/      # agents module
    users/       # users module
  common/        # Guards, interceptors, filters
  prisma/        # PrismaService
```

---

## ✅ Review Checklist

Before completing any task, verify:
- [ ] TypeScript compiles with no errors (`npm run type-check`)
- [ ] Linter passes (`npm run lint`)
- [ ] New API endpoints have DTOs with validation
- [ ] New Prisma models have a migration file
- [ ] New components are exported from the appropriate `index.ts`
- [ ] No hardcoded secrets or API keys in code

---

## 🤖 Claude Code Behaviour

- When adding a new feature, always check if a relevant **Skill** exists in `.claude/skills/` first.
- When researching unfamiliar topics, spawn the **researcher** subagent.
- When writing tests, use the **tester** subagent.
- Prefer running `npm run lint --fix` after editing frontend files.
- After database schema changes, always run `npx prisma generate`.

---

## 🚫 Never Do

- Never delete migration files.
- Never commit `.env` files.
- Never bypass TypeScript with `@ts-ignore` without a comment explaining why.
- Never install a new npm package without checking if an existing one already covers the need.
