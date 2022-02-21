import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post('/api/' + 'signin', { //Removed AUTH_API changed to /api/ and create proxy.config.json to target the API
      username,
      password
    }, httpOptions);
  }

//   register(username: string, email: string, password: string): Observable<any> {
//     return this.http.post(AUTH_API + 'signup', {
//       username,
//       email,
//       password
//     }, httpOptions);
//   }
}
