import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user';
import { AuthService } from '../../core/services/auth';
import { NavbarVisitorComponent } from '../../shared/components/navbar-visitor/navbar-visitor';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarVisitorComponent],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  nom = '';
  email = '';
  password = '';
  titre = '';
  competences = '';
  errorMessage = '';
  showWelcome = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  onRegister(): void {
    if (!this.nom || !this.email || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }
    // Check if email already exists
    const existing = this.userService.getUserByEmail(this.email);
    if (existing) {
      this.errorMessage = 'Cet email est déjà utilisé.';
      return;
    }
    // Convert string competences to structured objects
    const competencesArray = this.competences
      .split(',')
      .map((c: string) => c.trim())
      .filter((c: string) => c)
      .map((nom: string) => ({ nom, description: '' }));

    const newUser = this.userService.addUser({
      nom: this.nom,
      email: this.email,
      password: this.password,
      titre: this.titre || 'Développeur',
      competences: competencesArray,
      contacts: [{ type: 'email', value: this.email }],
      bio: ''
    });
    // Auto-login après inscription
    this.authService.login(this.email, this.password);
    this.showWelcome = true;
    setTimeout(() => {
      this.router.navigate(['/accueil']);
    }, 3000);
  }
}