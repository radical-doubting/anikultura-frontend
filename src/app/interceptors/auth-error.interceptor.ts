import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthErrorInterceptor implements HttpInterceptor {
  private redirectTo = '/';

  constructor(private authService: AuthService) {}

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((httpErrorResponse: HttpErrorResponse) => {
        if (httpErrorResponse.status === 401) {
          this.authService.cleanup();
        }

        const error = httpErrorResponse.error || httpErrorResponse.statusText;
        return throwError(error);
      }),
    );
  }
}
