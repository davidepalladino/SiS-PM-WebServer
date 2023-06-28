import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor
} from "@nestjs/common";
import { catchError, Observable, throwError } from "rxjs";

@Injectable()
export class AppInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<string> {
    return next.handle().pipe(
      catchError((error: { code; stderr }) => {
        switch (error.code) {
          case 2:
            return throwError(
              () =>
                new InternalServerErrorException(
                  "MISSING_KEYWORD_COMMAND_PERMISSION"
                )
            );
          case 126:
            return throwError(
              () => new InternalServerErrorException("MISSING_PERMISSION")
            );
          case 127:
            return throwError(
              () => new InternalServerErrorException("MISSING_COMMAND")
            );
          case 255:
            return throwError(
              () => new InternalServerErrorException("UNKNOWN")
            );
          default:
            return throwError(
              () => new InternalServerErrorException("UNKNOWN", error.stderr)
            );
        }
      })
    );
  }
}
