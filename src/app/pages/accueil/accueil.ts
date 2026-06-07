import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarVisitorComponent } from '../../shared/components/navbar-visitor/navbar-visitor';
import { ProjectService, Project } from '../../core/services/project';
import { AuthService } from '../../core/services/auth';
import { User } from '../../core/services/user';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarVisitorComponent],
  templateUrl: './accueil.html',
  styleUrls: ['./accueil.css']
})
export class AccueilComponent implements OnInit {
  featuredProjects: Project[] = [];
  isConnected = false;
  currentUser: User | null = null;

  constructor(
    private projectService: ProjectService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.featuredProjects = this.projectService.getPublicProjects().slice(0, 8);
    this.isConnected = this.authService.isAuthenticated();
    if (this.isConnected) {
      this.currentUser = this.authService.getCurrentUser();
    }
  }
}