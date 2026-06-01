# 🎯 PROMPT.md — Master Claude Code Learning Prompt

> Copy and paste this prompt into Claude Code (`claude`) from the project root to kick off your learning journey.
> Claude Code will read `CLAUDE.md`, discover Skills, connect MCP servers, and execute the tasks below step by step.

---

## HOW TO USE

```bash
# From the project root:
claude

# Then paste the prompt below into the Claude Code session.
```

---

## THE PROMPT

```
You are my expert full-stack engineering pair. This is a learning project to help me master Claude Code, Agent Skills, MCP servers, Hooks, and Subagents. The stack is Next.js 14 + TypeScript + shadcn/ui + React Hook Form + Tailwind CSS on the frontend, and NestJS + Prisma + Supabase PostgreSQL on the backend.

Please read CLAUDE.md now for project conventions, then complete the following tasks in order. After each task, explain what Claude Code concept you used and why, so I can learn.

---

### TASK 1 — Environment Validation (MCP: Filesystem + Postgres)
Check that:
- All required files exist (package.json in frontend/ and backend/, prisma/schema.prisma, .env files)
- The Postgres MCP server can connect to the Supabase database
- List the current Prisma models

Explain: What is MCP? How does the Postgres MCP server give you database access without writing connection code?

---

### TASK 2 — Scaffold a New Feature: Task Manager (Agent Skill)
Load the `.claude/skills/task-manager/SKILL.md` skill and use it to:
1. Add a `Task` Prisma model (id, title, description, status: TODO|IN_PROGRESS|DONE, priority: LOW|MEDIUM|HIGH, createdAt, updatedAt, userId)
2. Run a Prisma migration: `npx prisma migrate dev --name add-tasks`
3. Scaffold the NestJS Tasks module: `tasks.module.ts`, `tasks.controller.ts`, `tasks.service.ts`, `create-task.dto.ts`, `update-task.dto.ts`
4. Implement full CRUD endpoints: POST /api/v1/tasks, GET /api/v1/tasks, GET /api/v1/tasks/:id, PATCH /api/v1/tasks/:id, DELETE /api/v1/tasks/:id

Explain: What is an Agent Skill? How does SKILL.md differ from a system prompt? How does Claude discover and load skills dynamically?

---

### TASK 3 — Frontend Task Dashboard (Skills + shadcn/ui)
Using the task-manager skill and project conventions:
1. Create `frontend/src/app/tasks/page.tsx` — server component that fetches tasks from the API
2. Create `frontend/src/components/features/task-card.tsx` — displays a single task with status badge
3. Create `frontend/src/components/features/task-form.tsx` — uses react-hook-form + zod for create/edit
4. Create `frontend/src/components/features/task-list.tsx` — renders a list of TaskCards
5. Wire up the form to POST /api/v1/tasks and refresh the list on success

Ensure:
- All form validation uses zod schemas
- shadcn/ui components (Button, Input, Select, Badge, Card) are used throughout
- Loading and error states are handled
- TypeScript is strict — no `any` types

Explain: How do you use react-hook-form with zod resolver? Show me the pattern.

---

### TASK 4 — Code Review (Agent Skill: code-reviewer)
Load `.claude/skills/code-reviewer/SKILL.md` and perform a full review of:
- `backend/src/modules/tasks/tasks.service.ts`
- `frontend/src/components/features/task-form.tsx`

For each file, produce:
1. A security checklist (input validation, SQL injection via Prisma, XSS vectors)
2. A performance checklist (unnecessary re-renders, N+1 queries)
3. A TypeScript quality check (strict types, error handling)
4. A list of specific improvements with code snippets

Explain: How does the code-reviewer Skill give Claude structured domain knowledge without a large system prompt?

---

### TASK 5 — Research & Documentation (Subagent: researcher)
Spawn the researcher subagent defined in `.claude/agents/researcher.md` to:
1. Find the current best practices for Prisma + Supabase connection pooling (search the web)
2. Find the recommended way to handle JWT authentication in NestJS in 2025
3. Summarize findings and write them to `docs/research-notes.md`

Explain: What is a subagent? How does it differ from the main Claude Code agent? When should you use subagents vs tools vs skills?

---

### TASK 6 — Hooks Demo
Demonstrate the project's configured hooks by:
1. Editing any TypeScript file in the frontend
2. Showing what the post-edit hook runs automatically
3. Triggering a lint error intentionally, then using the pre-commit hook to catch it

Explain: What are Claude Code Hooks? What shell commands are they running? Where is the hook configuration?

---

### TASK 7 — Add MCP: Supabase Postgres Direct Query
Using the Postgres MCP server:
1. Query the tasks table directly to get task counts by status
2. Write the result as a JSON file to `docs/task-stats.json`
3. Use the result to render a stats bar at the top of the tasks dashboard

Explain: How does MCP differ from a REST API call? What is the protocol and why is it becoming the standard for AI tool connections?

---

### TASK 8 — Write Tests (Subagent: tester)
Spawn the tester subagent defined in `.claude/agents/tester.md` to:
1. Write unit tests for `tasks.service.ts` using Jest + Prisma mock
2. Write integration tests for the tasks API endpoints using supertest
3. Write a frontend component test for `task-form.tsx` using React Testing Library

Run all tests and report results.

---

### TASK 9 — Memory & CLAUDE.md Update
Based on everything built in this session:
1. Update `CLAUDE.md` with any new conventions discovered (e.g. zod schema location pattern, Prisma transaction pattern used)
2. Add a `## Session Learnings` section to `CLAUDE.md` with key decisions made

Explain: How does Claude Code auto-memory work? What is the difference between CLAUDE.md (manual) and auto-memory (automatic)?

---

### TASK 10 — Final Summary
Produce a `docs/session-summary.md` file that contains:
1. A map of every file created/modified and which Claude Code feature was responsible
2. A comparison table: Skills vs MCP vs Subagents vs Hooks — when to use each
3. Three custom Skills I could build for my personal workflow based on what you observed about how I work
4. Recommended next learning exercises

---

After completing all tasks, tell me:
- Which task was most complex and why
- Which Claude Code feature gave the biggest productivity boost
- What I should learn next to go deeper
```

---

## 💡 Tips for Getting the Most from This Prompt

| Tip | Why |
|-----|-----|
| Run from the project root | So Claude Code can find `CLAUDE.md` and `.claude/` config |
| Have your `.env` files set up first | Tasks 1, 5, 7 need real DB connection |
| Use `claude --verbose` | See exactly which tools Claude calls |
| Interrupt and ask "why" at any task | Claude Code will explain the concept in depth |
| After each task, run `git diff` | See exactly what files changed |

---

## 🔄 Incremental Learning Prompts

Use these shorter prompts to focus on one concept at a time:

### MCP Only
```
Connect to the Postgres MCP server and show me all tables in the database. Then run a query to count rows in the users table. Explain what MCP is and how it works under the hood.
```

### Skills Only
```
Load the task-manager skill from .claude/skills/task-manager/SKILL.md and walk me through what it contains. Then use it to create a new 'Comment' feature following the same patterns.
```

### Hooks Only
```
Show me the hooks configured in .claude/hooks/. Trigger each hook and show me the output. Then add a new post-edit hook that runs `npx tsc --noEmit` after any TypeScript file is edited.
```

### Subagents Only
```
Spawn the researcher subagent and have it research the best React state management libraries in 2025. Then spawn the tester subagent and have it write tests for the TaskCard component. Run both in parallel.
```
