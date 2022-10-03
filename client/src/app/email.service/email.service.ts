import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EmailData } from '../email-client/email.interface';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  url: string = 'http://localhost:1337';
  constructor(private http: HttpClient) { }

  sendEmail(emailData: EmailData): Observable<EmailData> {
    return this.http.post<EmailData>(this.url + '/api/sendEmail', emailData);
  }
}
