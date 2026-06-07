import { Routes } from '@angular/router';
import { AccueilComponent } from './pages/accueil/accueil';
import { RechercheComponent } from './pages/recherche/recherche';
import { ProjetDetailComponent } from './pages/projet-detail/projet-detail';
import { ProfilComponent } from './pages/profil/profil';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';

export const routes: Routes = [
  { path: '', redirectTo: 'accueil', pathMatch: 'full' },
  { path: 'accueil', component: AccueilComponent },
  { path: 'recherche', component: RechercheComponent },
  { path: 'projet/:id', component: ProjetDetailComponent },  // <-- nouvelle route
  { path: 'profil/:id', component: ProfilComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: 'accueil' }
];