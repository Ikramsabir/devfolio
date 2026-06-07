import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { NavbarVisitorComponent } from '../../shared/components/navbar-visitor/navbar-visitor';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarVisitorComponent],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    if (this.authService.login(this.email, this.password)) {
      // Rediriger vers la page d'accueil après connexion
      this.router.navigate(['/accueil']);
    } else {
      this.errorMessage = 'Email ou mot de passe incorrect';
    }
  }
}