import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthPayload, LoginBody } from '../types/auth-payload.type';
import { User } from '../types/user.type';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private loggedInUserSubject = new BehaviorSubject<User>(null);

  private readonly userLocalStorageKey = 'user';

  constructor(private http: HttpClient) {}

  public verify(): void {
    const user = localStorage.getItem(this.userLocalStorageKey);

    if (user === null) {
      return;
    }

    this.isLoggedInSubject.next(true);
    this.loggedInUserSubject.next(JSON.parse(user));
  }

  public login(loginBody: LoginBody): Observable<User> {
    return this.http.post<AuthPayload>('/api/auth/login', loginBody).pipe(
      map((data) => {
        const user = data.user;

        this.isLoggedInSubject.next(true);
        this.loggedInUserSubject.next(user);

        localStorage.setItem(this.userLocalStorageKey, JSON.stringify(user));

        return user;
      }),
    );
  }

  public logout(): Observable<void> {
    return this.http.post<AuthPayload>('/api/auth/logout', {}).pipe(
      map((data) => {
        this.cleanup();
      }),
    );
  }

  public cleanup(): void {
    this.isLoggedInSubject.next(false);
    this.loggedInUserSubject.next(null);
    localStorage.clear();
  }

  public isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  public getLoggedInUser(): Observable<User> {
    return this.loggedInUserSubject.asObservable();
  }
}
