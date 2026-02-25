import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message: string;

      switch (error.status) {
        case 0:
          message = 'Unable to reach the server. Please check your connection.';
          break;
        case 401:
          message = 'Your session has expired. Please log in again.';
          break;
        case 403:
          message = 'You do not have permission to perform this action.';
          break;
        case 404:
          message = 'The requested resource was not found.';
          break;
        case 422:
          message = error.error?.message || 'Validation failed. Please check your input.';
          break;
        case 500:
          message = 'An unexpected server error occurred. Please try again later.';
          break;
        default:
          message = error.error?.message || 'An unexpected error occurred.';
      }

      console.error(`[API Error] ${error.status} ${req.method} ${req.url}: ${message}`);

      return throwError(() => ({ status: error.status, message, originalError: error }));
    })
  );
};
