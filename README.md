# 🤖 Claude Code Mastery — Starter Project

> A full-stack reference project to learn Claude Code, Agent Skills, MCP, Hooks, and Subagents hands-on.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 · TypeScript · shadcn/ui · React Hook Form · Tailwind CSS |
| Backend | NestJS · Prisma ORM · Supabase PostgreSQL |
| AI Layer | Claude Code · Agent Skills · MCP Servers · Hooks · Subagents |

---

## 📁 Project Structure

```
claude-code-mastery/
├── frontend/              # Next.js 14 App Router
├── backend/               # NestJS REST API
├── .claude/               # Claude Code configuration
│   ├── skills/            # Agent Skills (.md files)
│   ├── agents/            # Subagent definitions
│   └── hooks/             # Automation hooks
├── CLAUDE.md              # Project rules for Claude Code
├── PROMPT.md              # 🎯 Master prompt for Claude Code
└── docs/                  # Learning docs
```

---

## 🚀 Quick Start

### 1. Prerequisites
```bash
node >= 18
npm >= 9
Claude Code: npm install -g @anthropic-ai/claude-code
```

### 2. Install Dependencies
```bash
# Frontend
cd frontend && npm install

# Backend
cd backend && npm install
```

### 3. Configure Environment
```bash
# Frontend
cp frontend/.env.example frontend/.env.local

# Backend
cp backend/.env.example backend/.env
```

### 4. Database Setup
```bash
cd backend
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Run Dev Servers
```bash
# Terminal 1 — Backend
cd backend && npm run start:dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

### 6. Launch Claude Code
```bash
# From project root
claude
```

---

## 🧠 Claude Code Concepts Covered

### 1. CLAUDE.md
The `CLAUDE.md` file in the project root is read by Claude Code at every session start.
It sets coding standards, architecture rules, and project context.

### 2. Agent Skills
Located in `.claude/skills/`. Skills are markdown files that Claude discovers and loads dynamically.
- `task-manager/SKILL.md` — CRUD task workflow skill
- `code-reviewer/SKILL.md` — PR review checklist skill

### 3. MCP Servers
Model Context Protocol lets Claude connect to external services.
See `.claude/mcp.json` for configured servers (filesystem, Postgres, web search).

### 4. Hooks
Located in `.claude/hooks/`. Run shell commands before/after Claude actions.
- Pre-edit: lint check
- Post-edit: auto-format

### 5. Subagents
Located in `.claude/agents/`. Define isolated agents for parallel tasks.
- `researcher.md` — web research subagent
- `tester.md` — test writing subagent

---

## 📚 Learning Path

1. **Start here**: Read `PROMPT.md` and run it with Claude Code
2. **Understand context**: Read `CLAUDE.md`
3. **Explore Skills**: Browse `.claude/skills/`
4. **Try MCP**: Check `.claude/mcp.json` and connect Postgres
5. **Use Hooks**: Trigger a file edit and watch hooks fire
6. **Spawn Subagents**: Ask Claude to use the researcher agent

---

## 🔗 Official Resources

- [Claude Code Docs](https://code.claude.com/docs/en/overview)
- [Agent Skills Overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- [MCP Protocol](https://modelcontextprotocol.io)
- [Anthropic API Docs](https://docs.claude.com)
