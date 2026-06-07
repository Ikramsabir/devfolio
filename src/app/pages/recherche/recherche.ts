import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarVisitorComponent } from '../../shared/components/navbar-visitor/navbar-visitor';
import { ProjectService, Project } from '../../core/services/project';
import { UserService, User } from '../../core/services/user';

@Component({
  selector: 'app-recherche',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarVisitorComponent],
  templateUrl: './recherche.html',
  styleUrls: ['./recherche.css']
})
export class RechercheComponent implements OnInit {
  searchTerm = '';
  filter: 'tous' | 'projets' | 'profils' = 'tous';

  allProjects: Project[] = [];
  allUsers: User[] = [];

  filteredProjects: Project[] = [];
  filteredUsers: User[] = [];

  constructor(
    private projectService: ProjectService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // On ne charge que les projets publics
    this.allProjects = this.projectService.getPublicProjects();
    this.allUsers = this.userService.getUsers();
    this.filteredProjects = [];
    this.filteredUsers = [];
  }

  onSearch(): void {
    if (this.searchTerm.trim() === '') {
      this.filteredProjects = [];
      this.filteredUsers = [];
    } else {
      this.applyFilter();
    }
  }

  setFilter(f: 'tous' | 'projets' | 'profils'): void {
    this.filter = f;
    if (this.searchTerm.trim() !== '') {
      this.applyFilter();
    }
  }

  private applyFilter(): void {
    const term = this.searchTerm.toLowerCase().trim();

    this.filteredProjects = this.allProjects.filter(p =>
      p.titre.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.technologies.some(t => t.toLowerCase().includes(term))
    );

    this.filteredUsers = this.allUsers.filter(u =>
      u.nom.toLowerCase().includes(term) ||
      u.titre.toLowerCase().includes(term) ||
      u.competences.some(c => c.nom.toLowerCase().includes(term))
    );
  }
}