import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Token } from '../models/token';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../app-injection-tokens';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators'

export const ACCESS_TOKEN="access_token"

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private httpClient: HttpClient,
    @Inject(API_URL) private apiUrl: string,
    private jwjtHelper: JwtHelperService,
    private router: Router) { }

  login(email: string, password: string): Observable<Token> {
    return this.httpClient.post<Token>(`${this.apiUrl}api/authuser/login`, { email, password }).pipe(tap(
      token => {
        localStorage.setItem(ACCESS_TOKEN, token.access_token);
      }
    ))
  }

  isAuth(): boolean {
    var token = localStorage.getItem(ACCESS_TOKEN);
    return token && !this.jwjtHelper.isTokenExpired(token);
  }

  logout() {
    localStorage.removeItem(ACCESS_TOKEN);
    this.router.navigate(['']);
  }

  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN);
  }
}
