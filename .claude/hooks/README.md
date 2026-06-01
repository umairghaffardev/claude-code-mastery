# Claude Code Hooks Configuration
# Hooks run shell commands automatically before/after Claude Code actions.
# This file is referenced by .claude/settings.json

# HOW HOOKS WORK:
# - PreToolUse: runs BEFORE Claude uses a tool (e.g. before editing a file)
# - PostToolUse: runs AFTER Claude uses a tool (e.g. after editing a file)
# - Stop: runs when Claude finishes a task

# See .claude/settings.json for the actual hook registration.
# This file documents what each hook does.

## post-edit-format
# Trigger: After any .ts or .tsx file is edited
# Command: cd frontend && npx prettier --write [file] 2>/dev/null || true
# Purpose: Auto-format TypeScript files after every edit

## post-edit-lint
# Trigger: After any .ts or .tsx file in frontend/ is edited
# Command: cd frontend && npx eslint [file] --fix 2>/dev/null || true
# Purpose: Auto-fix linting issues after edits

## pre-commit-typecheck
# Trigger: Before Claude runs git commit
# Command: cd frontend && npx tsc --noEmit && cd ../backend && npx tsc --noEmit
# Purpose: Ensure TypeScript compiles before committing

## post-prisma-migrate
# Trigger: After Claude runs `prisma migrate`
# Command: cd backend && npx prisma generate
# Purpose: Regenerate Prisma client after schema changes

## LEARNING NOTE:
# Hooks are the automation layer of Claude Code.
# They run shell commands at lifecycle events — no Claude tokens consumed.
# Use them for: formatting, linting, type-checking, git operations, notifications.
