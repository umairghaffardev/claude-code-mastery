# Claude Code Concepts Reference

> Generated reference for the claude-code-mastery project.
> Update this as you complete PROMPT.md tasks.

---

## The Five Layers of Claude Code

```
┌─────────────────────────────────────────────────────┐
│                   YOUR TASK / PROMPT                │
└──────────────────────────┬──────────────────────────┘
                           │
           ┌───────────────▼───────────────┐
           │         CLAUDE.md             │ ← Project rules, always loaded
           └───────────────┬───────────────┘
                           │
     ┌─────────────────────▼─────────────────────┐
     │              Agent Skills                  │ ← Domain knowledge modules
     │  .claude/skills/task-manager/SKILL.md      │   Loaded dynamically by context
     │  .claude/skills/code-reviewer/SKILL.md     │
     └─────────────────────┬─────────────────────┘
                           │
     ┌─────────────────────▼─────────────────────┐
     │              MCP Servers                   │ ← External connections
     │  filesystem, postgres, web-search          │   USB-C for AI tools
     └─────────────────────┬─────────────────────┘
                           │
     ┌─────────────────────▼─────────────────────┐
     │              Subagents                     │ ← Isolated parallel work
     │  .claude/agents/researcher.md              │
     │  .claude/agents/tester.md                  │
     └─────────────────────┬─────────────────────┘
                           │
     ┌─────────────────────▼─────────────────────┐
     │                Hooks                       │ ← Automation at lifecycle events
     │  PostEdit: format + lint                   │
     │  PreCommit: type-check                     │
     └───────────────────────────────────────────┘
```

---

## Feature Comparison Table

| Feature | What it is | When to use | Defined in |
|---------|-----------|-------------|------------|
| **CLAUDE.md** | Project rules read every session | Coding standards, architecture, review checklist | `CLAUDE.md` |
| **Agent Skills** | Markdown modules with domain knowledge | Task-specific workflows, code patterns, schemas | `.claude/skills/*/SKILL.md` |
| **MCP Servers** | Protocol for connecting to external tools | DB queries, file system, web search, APIs | `.claude/mcp.json` |
| **Subagents** | Isolated Claude instances for parallel work | Research, testing, review — separate context window | `.claude/agents/*.md` |
| **Hooks** | Shell commands at lifecycle events | Auto-format, lint, type-check, git operations | `.claude/settings.json` |

---

## Key Insight: Skills vs System Prompts

| | System Prompt | Agent Skill |
|--|--------------|-------------|
| Loading | Always loaded | Loaded **on demand** when description matches |
| Size | Token-limited | Can be large (only loaded when needed) |
| Structure | Free text | Structured: metadata + instructions + code |
| Portability | Platform-specific | Works across Claude Code, Claude.ai, API |
| Discovery | Explicit | **Automatic** — Claude reads description, decides relevance |

---

## MCP Protocol Explained

MCP (Model Context Protocol) is an open standard — think of it as "USB-C for AI tools."

Before MCP: every AI tool needed custom integration code for every service.
After MCP: one protocol, thousands of compatible servers.

```
Claude Code ←──[MCP protocol]──→ Postgres server
Claude Code ←──[MCP protocol]──→ Filesystem server
Claude Code ←──[MCP protocol]──→ GitHub server
Claude Code ←──[MCP protocol]──→ Your custom server
```

By early 2026: 10,000+ active public MCP servers. Adopted by ChatGPT, Cursor, Gemini, VS Code.

---

## Subagents vs Main Agent

| | Main Agent | Subagent |
|--|-----------|---------|
| Context | Full project context | Isolated, focused context |
| Purpose | Orchestration | Specialized task |
| Token budget | Shared | Separate |
| Use case | Coordinate work | Research, testing, review |

---

## Learning Exercises (After completing PROMPT.md)

1. **Create a custom Skill**: Write a `.claude/skills/api-designer/SKILL.md` that encodes REST API design standards for this project.
2. **Add a new MCP server**: Connect the GitHub MCP server and have Claude create a GitHub issue for each TODO in the codebase.
3. **Build a Hook**: Add a post-edit hook that runs `npx prisma validate` whenever `schema.prisma` is edited.
4. **Extend the schema**: Ask Claude to add a `Comment` model to tasks, using the task-manager Skill as a reference pattern.
5. **Chain subagents**: Have the researcher find auth best practices, then hand findings to the tester to write auth tests.
