import { Component } from '@angular/core';
import { Register } from '../models/register';
import { AuthServiceService } from '../service/auth-service.service';
import { Router } from '@angular/router';
import { LocalStorageService } from '../service/local-storage.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(private registerService: AuthServiceService, private router: Router, private storage: LocalStorageService) {

  }

  user: Register = {
    username: '',
    email: '',
    password: ''
  }

  register(): void {
    console.log(this.user.username)
    this.registerService.register(this.user).subscribe({
      next: () => {
        this.storage.setToken(this.user);
        this.router.navigate(['/notes']);
      },
      error: err => {
        alert("An account with this username or email already exists. Please try again with a different email.");
       }
    })
  }

  openLogin():void{
    this.router.navigate(['/login'])
  }
}

