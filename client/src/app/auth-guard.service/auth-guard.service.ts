import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  url: string = 'http://localhost:1337';

  constructor(private http: HttpClient) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return this.isAuthorized(this.url);
  }
  private isAuthorized(url: string) {
    return new Promise((resolve, reject) => {
      this.http.get(url + '/api/userInfo')
        .subscribe((data) => {
          console.log('data :: ', data)
          resolve(true);
        }, (error) => {
          reject(false);
          console.log('error :: ', error)
        })
    })
      .then(() => {
        return true;
      }).catch(() => {
        return false;
      })
  }
}
