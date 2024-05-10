import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationRequest } from 'src/models/authentication-request';
import { AuthenticationResponse } from 'src/models/authentication-response';
import { AuthenticationService } from 'src/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent  {

  authRequest: AuthenticationRequest = {};
  authResponse: AuthenticationResponse = {};

  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {
  }

  isLoggedIn: boolean = false;


  /* authenticate() {
    this.authService.login(this.authRequest)
      .subscribe({
        next: (response) => {
          localStorage.setItem('token', response.accessToken as string);
          this.router.navigate(['welcome']);
        }
      });
  } */

  authenticate() {
    this.authService.login(this.authRequest).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.accessToken as string);
        // Store user's role in local storage
        localStorage.setItem('role', response.role as string);
        this.isLoggedIn = true; // Set to true after successful login
        const userRole = response.role as string;
        if (userRole === 'ADMIN') {
          this.router.navigate(['listpatient']);
        }
      }
    });
  }




  togglePasswordVisibility(passField: HTMLInputElement, showBtn: HTMLElement): void {
    if (passField.type === 'password') {
      passField.type = 'text';
      showBtn.textContent = 'HIDE';
      showBtn.style.color = '#3498db';
    } else {
      passField.type = 'password';
      showBtn.textContent = 'SHOW';
      showBtn.style.color = '#222';
    }
  }






}
