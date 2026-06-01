import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * The authenticated user shape attached to the request by JwtAuthGuard.
 * Keep this minimal — it's derived from the JWT payload, not the DB row.
 */
export interface AuthUser {
  id: string;
  email: string;
}

/**
 * @CurrentUser() — extracts the authenticated user from the request.
 *
 * Usage:
 *   findAll(@CurrentUser() user: AuthUser) { ... }
 *
 * The user is populated by JwtAuthGuard, so this decorator must only be used
 * on routes protected by @UseGuards(JwtAuthGuard).
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest<{ user: AuthUser }>();
    return request.user;
  },
);
