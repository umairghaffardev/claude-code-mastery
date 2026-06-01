import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * The standard API envelope mandated by CLAUDE.md:
 *   { data, error, meta }
 */
export interface ApiResponse<T> {
  data: T;
  error: string | null;
  meta: { timestamp: string };
}

/**
 * TransformInterceptor — wraps every successful controller return value in the
 * project's { data, error, meta } envelope automatically.
 *
 * This keeps controllers clean: they return raw entities, and the envelope is
 * applied in one place. Registered globally via APP_INTERCEPTOR in AppModule.
 * (Errors are shaped separately by exception filters, so `error` is always null
 * on the success path.)
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    _context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        data,
        error: null,
        meta: { timestamp: new Date().toISOString() },
      })),
    );
  }
}
