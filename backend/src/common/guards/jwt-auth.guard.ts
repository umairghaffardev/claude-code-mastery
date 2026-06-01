import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthUser } from '../decorators/current-user.decorator';

/**
 * JwtAuthGuard — minimal but real JWT verification.
 *
 * Reads the `Authorization: Bearer <token>` header, verifies the token's
 * signature against JWT_SECRET, and attaches the decoded user to the request
 * so @CurrentUser() can read it.
 *
 * A full app would use @nestjs/passport's PassportStrategy; this hand-rolled
 * guard keeps the dependency surface small while staying production-shaped.
 */
interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<{ headers: Record<string, string>; user?: AuthUser }>();

    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or malformed bearer token');
    }

    const token = authHeader.slice('Bearer '.length).trim();

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.config.get<string>('JWT_SECRET'),
      });
      request.user = { id: payload.sub, email: payload.email };
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
