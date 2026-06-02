# Research Notes

> Produced for **PROMPT.md → Task 5** via web research (researcher subagent failed on a tool-call parse error, so the lead agent ran the searches inline using WebSearch + WebFetch).
> **Last verified:** 2026-06-02

---

## Topic 1 — Prisma + Supabase Connection Pooling (Best Practices)

### TL;DR
Supabase fronts Postgres with **Supavisor** (its connection pooler, the successor to PgBouncer). You configure **two** connection strings in Prisma:

| Variable | Used by | Port | Mode | Why |
|----------|---------|------|------|-----|
| `DATABASE_URL` | Prisma Client (runtime queries) | **6543** | Transaction (pooled, via Supavisor) | Handles many short-lived connections — essential for serverless/edge where each invocation opens a connection. |
| `DIRECT_URL` | Prisma CLI / Migrate (`migrate`, `db push`, introspection) | **5432** | Session / direct | Migrations need a persistent session and operations the pooler can't proxy (advisory locks, DDL, prepared statements). |

This is the single most important takeaway: **the app talks to the pooler (6543); migrations bypass it (5432).** Pointing migrations at the pooled URL causes errors like `prepared statement "s0" already exists` and advisory-lock failures.

### Supavisor vs PgBouncer
- Supabase has migrated from PgBouncer to **Supavisor**, its own cloud-native pooler. New projects use Supavisor by default; the hostname looks like `...pooler.supabase.com`.
- For Prisma you still append **`?pgbouncer=true`** to the pooled URL — it tells Prisma to disable prepared statements (incompatible with transaction-mode pooling) and not to manage the pool itself.
- **Transaction mode (port 6543):** a connection is assigned per-transaction, then returned to the pool. Best for serverless / high connection churn. No session-level features (no prepared statements, no `SET`/`LISTEN`).
- **Session mode (port 5432 via pooler, or direct):** connection held for the whole client session. Use for migrations and long-lived servers.

### Connection-string parameters that matter
- `pgbouncer=true` — **required** on the pooled URL for Prisma (disables prepared statements).
- `connection_limit=N` — cap Prisma's own pool. In serverless, set this **low (e.g. 1)** per function instance to avoid exhausting Supabase's max connections (many instances × big pool = outage).
- `pool_timeout=N` — seconds Prisma waits for a free connection before throwing. Raise it if you see `Timed out fetching a new connection from the connection pool`.
- Supabase guidance: if you lean heavily on the PostgREST data API, keep your pool ≤ **40%** of the DB's max connections; otherwise you can use up to ~**80%**, leaving headroom for the Auth server and other utilities.

### Recommended `schema.prisma` datasource block
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL") // pooled, port 6543, ?pgbouncer=true
  directUrl = env("DIRECT_URL")   // direct/session, port 5432 — used by Migrate
}
```
> ⚠️ Newer Prisma (v6+) is moving connection config into `prisma.config.ts`, where the CLI reads the **direct** string. The `directUrl` field in `schema.prisma` remains the widely-used, stable approach and is what this project uses.

### Recommended `.env`
```env
# Pooled — Supavisor transaction mode (runtime). Note port 6543 + pgbouncer=true.
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Direct — session mode (migrations & introspection). Note port 5432.
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
```

### Serverless / edge gotchas
- **Connection exhaustion:** every cold start opens connections. Use transaction mode (6543) + a tiny `connection_limit`. This is the #1 cause of `too many connections` on Supabase + Vercel/Lambda.
- **Prepared statements:** not supported in transaction mode — that's exactly what `pgbouncer=true` disables. Forgetting it surfaces as `prepared statement "s0" already exists`.
- **Migrations in CI/CD:** run `prisma migrate deploy` against `DIRECT_URL`, never the pooled URL.
- **Edge runtimes** (Vercel Edge, Cloudflare): the standard Prisma engine may not run; consider Prisma Accelerate or the driver-adapter path. For plain Node serverless, the dual-URL setup above is sufficient.

### How this project is configured (verified)
`backend/prisma/schema.prisma` already uses `url = env("DATABASE_URL")` + `directUrl = env("DIRECT_URL")` — matching the recommended pattern. ✅

---

## Topic 2 — JWT Authentication in NestJS (Recommended 2025 Approach)

### Stack
`@nestjs/jwt` + `@nestjs/passport` + `passport-jwt`, plus `bcrypt` (or `argon2`) for password hashing and `@nestjs/config` for secrets.

```bash
npm i @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
npm i -D @types/passport-jwt @types/bcrypt
```

### Recommended token model
- **Access token:** short-lived (**15 min**, JWT in `Authorization: Bearer <token>` header). Stateless.
- **Refresh token:** long-lived (**7 days**), **rotated on every use**, and stored **hashed** (bcrypt) in the DB. For web clients, deliver it in an **httpOnly + Secure + SameSite cookie** (mitigates XSS theft) and add CSRF protection.
- **Use different secrets** for access vs refresh tokens.
- Algorithm: `HS256` with a strong secret is fine for a single backend; use `RS256` (asymmetric) if multiple services must verify tokens without sharing the signing key.
- Load secrets from env via `ConfigService` — never hardcode (aligns with this project's "no hardcoded secrets" rule in CLAUDE.md).

### 1) JWT strategy (`passport-jwt`)
```ts
// common/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload { sub: string; email: string; }

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
    });
  }

  // return value is attached to request.user
  async validate(payload: JwtPayload) {
    return { id: payload.sub, email: payload.email };
  }
}
```

### 2) Auth module registration
```ts
// modules/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '../../common/strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow('JWT_ACCESS_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  providers: [JwtStrategy /*, AuthService */],
})
export class AuthModule {}
```

### 3) Guard + global protection with a `@Public()` escape hatch
```ts
// common/guards/jwt-auth.guard.ts
import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) { super(); }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    return super.canActivate(context);
  }
}
```
```ts
// common/decorators/public.decorator.ts
import { SetMetadata } from '@nestjs/common';
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```
Register the guard globally so routes are **secure by default**:
```ts
// app.module.ts providers
{ provide: APP_GUARD, useClass: JwtAuthGuard }
```

### 4) Issuing tokens + password hashing
```ts
// modules/auth/auth.service.ts (essentials)
import * as bcrypt from 'bcrypt';

async signTokens(userId: string, email: string) {
  const [accessToken, refreshToken] = await Promise.all([
    this.jwt.signAsync({ sub: userId, email },
      { secret: this.config.getOrThrow('JWT_ACCESS_SECRET'), expiresIn: '15m' }),
    this.jwt.signAsync({ sub: userId, email },
      { secret: this.config.getOrThrow('JWT_REFRESH_SECRET'), expiresIn: '7d' }),
  ]);
  // store bcrypt hash of refreshToken on the user row for rotation/revocation
  await this.users.setRefreshHash(userId, await bcrypt.hash(refreshToken, 10));
  return { accessToken, refreshToken };
}
```

### 5) Protected controller
```ts
@Controller('tasks')
export class TasksController {
  @Get()            // protected by the global JwtAuthGuard
  findAll(@CurrentUser() user: { id: string }) { /* ... */ }

  @Public()         // opt out
  @Post('login')
  login(/* ... */) { /* ... */ }
}
```

### Security checklist
- ✅ Short access-token TTL (15m); rotate refresh tokens on every refresh.
- ✅ Store refresh tokens **hashed** server-side → enables revocation and survives a DB leak.
- ✅ httpOnly + Secure + SameSite cookies for refresh tokens on web; add CSRF defense.
- ✅ Separate secrets for access vs refresh; load via `ConfigService`.
- ✅ Hash passwords with bcrypt (cost ≥ 10) or argon2id.
- ⚠️ Stateless JWTs can't be force-revoked before expiry — keep access tokens short, and check the stored refresh hash on rotation to invalidate sessions.

### How this project relates (verified)
`backend/src/common/guards/jwt-auth.guard.ts` and `backend/src/common/decorators/current-user.decorator.ts` already exist as scaffolding — the pattern above is the recommended way to flesh them out. There is **no `auth` module yet**; building one per this section is a natural next step.

---

## Sources

**Prisma + Supabase pooling**
- [Prisma | Supabase Docs](https://supabase.com/docs/guides/database/prisma)
- [Supabase | Prisma Documentation](https://www.prisma.io/docs/orm/v6/overview/databases/supabase)
- [Troubleshooting Prisma errors | Supabase Docs](https://supabase.com/docs/guides/database/prisma/prisma-troubleshooting)
- [Supavisor FAQ | Supabase Docs](https://supabase.com/docs/guides/troubleshooting/supavisor-faq-YyP5tI)
- [Connect to your database | Supabase Docs](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [Connection management | Supabase Docs](https://supabase.com/docs/guides/database/connection-management)
- [Configure Prisma Client with PgBouncer | Prisma Docs](https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections/pgbouncer)

**NestJS JWT auth**
- [Authentication | NestJS Docs](https://docs.nestjs.com/security/authentication)
- [How to Implement Refresh Tokens with Token Rotation in NestJS (DEV)](https://dev.to/zenstok/how-to-implement-refresh-tokens-with-token-rotation-in-nestjs-1deg)
- [NestJS JWT Authentication with Refresh Tokens — Elvis Duru](https://www.elvisduru.com/blog/nestjs-jwt-authentication-refresh-token)
- [NestJS Authentication Guide 2026 — Encore](https://encore.dev/articles/nestjs-authentication-guide)
- [vladwulf/nestjs-jwts (reference implementation)](https://github.com/vladwulf/nestjs-jwts)
