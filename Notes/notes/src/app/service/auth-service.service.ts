import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Register } from '../models/register';
import { Observable, map } from 'rxjs';
import { Login } from '../models/login';
import { LocalStorageService } from './local-storage.service';
import { Note } from '../models/model';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor(private http: HttpClient) { }

  register(user: Register) {
    return this.http.post("http://localhost:3000/users",
      {
        'username': user.username,
        'email': user.email,
        'password': user.password
      }).pipe(
        map((res) => { })
      );
  }

  login(user: Login): Observable<Array<Note>> {
    const params = new HttpParams()
      .set('username', user.username)
      .set('password', user.password);
    return this.http.get<Array<Note>>("http://localhost:3000/users/exists",
      { params });
  }
  
}


