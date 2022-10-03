import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginData } from '../model/login.interface';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  url: string = 'http://localhost:1337';
  constructor(private http: HttpClient) { }

  login(loginData: LoginData): Observable<LoginData> {
    return this.http.post<LoginData>(this.url + '/api/login', loginData);
  }
}
