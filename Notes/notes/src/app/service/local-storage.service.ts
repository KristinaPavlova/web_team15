import { Injectable } from '@angular/core';
import { Login } from '../models/login';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private readonly USER_NAME: string = "username";
  private readonly PASSWORD: string = "password";

  user:Login = {
    username:'',
    password: ''
  }

  constructor() { }

  setToken(user: Login): void {
    localStorage.setItem(this.USER_NAME, user.username);
    localStorage.setItem(this.PASSWORD, user.password);
  }

  getUsername(): string  {
    return <string>localStorage.getItem(this.USER_NAME);
  }

  getUser(): Login  {
    this.user.username = <string>localStorage.getItem(this.USER_NAME);
    this.user.password = <string>localStorage.getItem(this.PASSWORD);
    return this.user;
  }
}
