import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { UserModel } from './models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiBaseUrl = 'https://ponyracer.ninja-squad.com';

  userEvents: Subject<UserModel> = new Subject();

  constructor(private http: HttpClient) { }

  register(login: string, password: string, birthYear: number): Observable<UserModel> {
    return this.http.post(`${this.apiBaseUrl}/api/users`, {
      login, password, birthYear
    }) as Observable<UserModel>;
  }

  authenticate( credentials: { login: string, password: string}): Observable<UserModel> {
    return this.http
      .post<UserModel>(`${this.apiBaseUrl}/api/users/authentication`, credentials)
      .pipe(tap((user: UserModel) => {this.userEvents.next(user); }));
  }
}
