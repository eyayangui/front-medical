import { Component, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {

  constructor(private router: Router) { }

  isLoginRoute(): boolean {
    return !this.router.url.includes('/login');
  }

  isSidebarVisible: boolean = false;
  @ViewChild(MatSidenav) sidenav!: MatSidenav;

  userRole = localStorage.getItem('role');

  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }


}
