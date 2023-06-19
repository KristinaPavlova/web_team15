import { Component } from '@angular/core';
import { AuthServiceService } from '../service/auth-service.service';
import { Router } from '@angular/router';
import { Login } from '../models/login';
import { LocalStorageService } from '../service/local-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  constructor (private registerService: AuthServiceService, private router:Router, private storage: LocalStorageService){

  }
  user:Login = {
    username:'',
    password: ''
  }

  login(): void{
    console.log(this.user.username)
    this.registerService.login(this.user).subscribe({
      next: () => {
        this.storage.setToken(this.user);
        this.router.navigate(['/notes']);
      },
      error: err => {
        alert("Invalid email or password. Please try again.");
      }
    })
  }

  openRegister(): void{
    
        this.router.navigate(['/register']);
      
  }
}
