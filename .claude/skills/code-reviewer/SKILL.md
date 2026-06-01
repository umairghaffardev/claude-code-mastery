---
name: code-reviewer
description: >
  Use this skill when asked to review code, audit a file, check quality,
  find bugs, assess security, or perform a PR review.
  Triggers on: "review this", "audit", "check my code", "is this secure",
  "find issues in", "code quality check", "PR review".
---

# Code Reviewer Skill

This skill provides a structured review framework for this project's stack.

## Review Dimensions

Always review across these 5 dimensions:

### 1. 🔒 Security
- **Input validation**: Are all user inputs validated with DTOs / zod schemas?
- **SQL injection**: Are all DB queries through Prisma (parameterized)? No raw SQL with string interpolation?
- **Authentication**: Are protected routes guarded with `@UseGuards(JwtAuthGuard)`?
- **Authorization**: Does every service method check `userId` ownership before mutating?
- **XSS**: Does the frontend sanitize any user-generated content before rendering?
- **Secrets**: Are there any hardcoded API keys, tokens, or passwords?

### 2. ⚡ Performance
- **N+1 queries**: Does any `findMany` loop then call `findOne` for each result? Use `include` instead.
- **Missing indexes**: Are Prisma models missing `@@index` on frequently queried fields?
- **React re-renders**: Are expensive components wrapped in `React.memo`? Are callbacks using `useCallback`?
- **Bundle size**: Are large libraries imported with tree-shaking (`import { x } from 'lib'` not `import lib`)?
- **Server vs Client components**: Are components unnecessarily marked `"use client"`?

### 3. 🏷️ TypeScript Quality
- **No `any`**: Are there any `any` types? Replace with `unknown` + type guard or proper type.
- **Null safety**: Are optional chaining (`?.`) and nullish coalescing (`??`) used correctly?
- **Error handling**: Do all async functions have try/catch? Are errors typed?
- **Exhaustive enums**: Are `switch` statements on enums exhaustive with a `default: throw`?

### 4. 🧹 Code Quality
- **Single responsibility**: Does each function do one thing?
- **DRY**: Is there duplicated logic that should be a shared utility?
- **Naming**: Are names clear and consistent with project conventions?
- **Magic numbers/strings**: Are constants extracted to named variables?

### 5. 🧪 Testability
- **Dependency injection**: Is the NestJS service properly injectable?
- **Pure functions**: Are utility functions pure (no side effects)?
- **Test coverage gaps**: What branches/conditions are NOT covered?

## Output Format

For each file reviewed, produce:

```
## Review: [filename]

### 🔴 Critical Issues (must fix)
- [issue]: [explanation] → [fix]

### 🟡 Warnings (should fix)
- [issue]: [explanation] → [fix]

### 🟢 Suggestions (nice to have)
- [suggestion]: [explanation]

### ✅ Good Patterns
- [what was done well]
```

## Common Patterns to Flag

### NestJS
```typescript
// ❌ Missing ownership check — any user can delete any task
async remove(id: string) {
  return this.prisma.task.delete({ where: { id } });
}

// ✅ Correct — ownership enforced
async remove(id: string, userId: string) {
  const task = await this.prisma.task.findFirst({ where: { id, userId } });
  if (!task) throw new NotFoundException();
  return this.prisma.task.delete({ where: { id } });
}
```

```typescript
// ❌ N+1 query
const tasks = await this.prisma.task.findMany();
for (const task of tasks) {
  task.user = await this.prisma.user.findUnique({ where: { id: task.userId } });
}

// ✅ Eager loading
const tasks = await this.prisma.task.findMany({ include: { user: true } });
```

### React / Next.js
```typescript
// ❌ Unnecessary "use client" — no interactivity
"use client";
export default function TaskList({ tasks }: { tasks: Task[] }) {
  return <ul>{tasks.map(t => <li>{t.title}</li>)}</ul>;
}

// ✅ Server component — no client JS sent to browser
export default function TaskList({ tasks }: { tasks: Task[] }) {
  return <ul>{tasks.map(t => <li>{t.title}</li>)}</ul>;
}
```

```typescript
// ❌ Missing zod validation — form data trusted as-is
const onSubmit = (data: any) => {
  fetch('/api/tasks', { method: 'POST', body: JSON.stringify(data) });
};

// ✅ Validated with zod resolver
const form = useForm<CreateTaskInput>({
  resolver: zodResolver(createTaskSchema),
});
```
