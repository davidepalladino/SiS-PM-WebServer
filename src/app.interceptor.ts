import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor
} from "@nestjs/common";
import { catchError, Observable, throwError } from "rxjs";
import { IBash } from "./entities/entities";

@Injectable()
export class AppInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<string> {
    return next.handle().pipe(
      catchError((bash: IBash) => {
        console.log(bash);

        switch (bash.code) {
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
            if (bash.stderr.includes("Check USB connections, please!")) {
              return throwError(
                () => new InternalServerErrorException("DEVICE_NOT_CONNECTED")
              );
            }

            return throwError(() => new BadRequestException(bash.stderr));
        }
      })
    );
  }
}
