import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ZodError } from 'zod';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      map((res: any) => this.responseHandler(res, context)),
      catchError((error) =>
        throwError(() => this.errorHandler(error, context)),
      ),
    );
  }

  errorHandler(error: any, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if (error instanceof ZodError) {
      const errorMessage = error.errors
        .map((e) => `${e.path.join('.')} attribute: ${e.message}`)
        .join(', ');
      response.status(HttpStatus.BAD_REQUEST).json({
        status: false,
        statusCode: HttpStatus.BAD_REQUEST,
        path: request.url,
        message: errorMessage,
        data: null,
      });
    } else if (error instanceof HttpException) {
      response.status(error.getStatus()).json({
        status: false,
        statusCode: error.getStatus(),
        path: request.url,
        message: error.message,
        data: null,
      });
    }
  }

  responseHandler(data: any, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const statusCode = response.statusCode;

    return {
      status: true,
      path: request.url,
      statusCode,
      data: data, // Return the data directly without nesting it within the response object
    };
  }
}
