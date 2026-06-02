---
name: typescript-linting
description: >
  Use this skill whenever writing or editing TypeScript / TSX in this project,
  so that new code also resolves TypeScript and ESLint issues automatically.
  Triggers on: "write", "add", "edit", "create component", "create service",
  "fix lint", "fix type errors", "typescript errors", "lint issues",
  "clean up types", any change to .ts / .tsx files.
---

# TypeScript Linting Skill

This skill ensures every TypeScript change in this project compiles cleanly and
passes ESLint. **Writing code is not done until lint + type-check pass.**

## Workflow (always follow this order)

1. **Write the code** following the rules below.
2. **Auto-fix as you go:**
   - Frontend (`frontend/`): `npm run lint -- --fix --prefix frontend` then `npm run format --prefix frontend`
   - Backend (`backend/`): `npm run lint --prefix backend` (its `lint` script already runs `eslint --fix`)
3. **Verify it compiles:** `npm run type-check` (runs `tsc --noEmit` on both apps).
4. **Re-read remaining errors** that `--fix` could not auto-resolve and fix them by hand — never suppress.
5. Only report the task complete once **both** lint and type-check exit clean.

> Scope: run the narrowest command that covers the files you touched. Use the
> root `npm run lint` / `npm run type-check` for cross-cutting changes.

## Hard Rules (enforced — fix, do not silence)

### No `any`
```typescript
// ❌ banned
function parse(input: any) { return input.value; }

// ✅ unknown + type guard
function parse(input: unknown): string {
  if (typeof input === 'object' && input !== null && 'value' in input) {
    return String((input as { value: unknown }).value);
  }
  throw new Error('Invalid input');
}
```

### No `@ts-ignore` without a reason
```typescript
// ❌ banned
// @ts-ignore
widget.legacyCall();

// ✅ explained, and prefer @ts-expect-error so it errors if the issue is fixed
// @ts-expect-error legacy SDK has no types — tracked in TICKET-123
widget.legacyCall();
```

### `interface` for object shapes, `type` for unions/primitives
```typescript
// ✅
interface Task { id: string; title: string }
type Status = 'TODO' | 'IN_PROGRESS' | 'DONE';
```

### Every async function handles errors
```typescript
// ❌ unhandled rejection
async function load() {
  const res = await fetch('/api/v1/tasks');
  return res.json();
}

// ✅
async function load(): Promise<Task[]> {
  try {
    const res = await fetch('/api/v1/tasks');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as Task[];
  } catch (err) {
    console.error('Failed to load tasks', err);
    throw err;
  }
}
```

## Common ESLint Fixes

| Rule | Fix |
| --- | --- |
| `@typescript-eslint/no-unused-vars` | Remove the unused symbol, or prefix an intentionally-unused arg with `_`. |
| `@typescript-eslint/no-explicit-any` | Replace with `unknown` + guard, a generic, or the real type. |
| `prefer-const` | Use `const` for never-reassigned bindings. |
| `@typescript-eslint/no-floating-promises` | `await` the promise or mark it `void promise`. |
| `@typescript-eslint/no-non-null-assertion` | Replace `x!` with a null check or optional chaining `x?.`. |
| `react-hooks/exhaustive-deps` | Add the missing dependency, or memoize it with `useCallback`/`useMemo`. |
| `@next/next/no-img-element` | Use `next/image` `<Image>` instead of `<img>`. |
| `import/order` | Let `--fix` reorder; group external → internal → relative. |

## Null Safety
```typescript
// ✅ optional chaining + nullish coalescing
const title = task?.title ?? 'Untitled';
```

## Exhaustive enums / unions
```typescript
function label(status: Status): string {
  switch (status) {
    case 'TODO': return 'To do';
    case 'IN_PROGRESS': return 'In progress';
    case 'DONE': return 'Done';
    default: {
      const _exhaustive: never = status; // compile error if a case is missing
      throw new Error(`Unhandled status: ${_exhaustive}`);
    }
  }
}
```

## Do / Don't

- ✅ Type function return values explicitly on exported/public functions.
- ✅ After Prisma schema changes, run `npm run db:generate` so types stay in sync before type-checking.
- ❌ Don't disable a rule project-wide to make one file pass.
- ❌ Don't leave `console.log` debug noise that the linter flags.
- ❌ Don't mark the task done while `type-check` or `lint` still report errors.
