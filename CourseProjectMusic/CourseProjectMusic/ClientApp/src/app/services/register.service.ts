import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../app-injection-tokens';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private httpClient: HttpClient,
    @Inject(API_URL) private apiUrl: string) { }

  register(email: string, login: string, password: string) {
    return this.httpClient.post(`${this.apiUrl}api/registeruser`, { mail: email, login, password });
  }
}
