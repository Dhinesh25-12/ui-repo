import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const notifications = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout();
        notifications.error('Your session has expired. Please log in again.');
        router.navigate(['/auth/login'], { queryParams: { redirect: router.url } });
      } else if (error.status === 403) {
        notifications.error('You do not have permission to perform this action.');
      } else if (error.status === 0) {
        notifications.error('Unable to reach the server. Please check your connection.');
      } else {
        const message = extractMessage(error);
        notifications.error(message);
      }
      return throwError(() => error);
    })
  );
};

function extractMessage(error: HttpErrorResponse): string {
  const body = error.error;
  if (typeof body === 'string' && body.trim().length > 0) {
    return body;
  }
  if (body && typeof body === 'object' && typeof body.message === 'string') {
    return body.message;
  }
  return `Something went wrong (${error.status}). Please try again.`;
}
