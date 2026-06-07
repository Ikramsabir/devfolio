import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavbarProfileComponent } from '../../shared/components/navbar-profile/navbar-profile';
import { NavbarVisitorComponent } from '../../shared/components/navbar-visitor/navbar-visitor';
import { AuthService } from '../../core/services/auth';
import { ProjectService, Project } from '../../core/services/project';
import { UserService, User } from '../../core/services/user';

@Component({
  selector: 'app-projet-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarProfileComponent, NavbarVisitorComponent],
  templateUrl: './projet-detail.html',
  styleUrls: ['./projet-detail.css']
})
export class ProjetDetailComponent implements OnInit {
  project: Project | undefined;
  developer: User | undefined;
  isOwner = false;
  activeTab = 'projets';
  unreadCount = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.project = this.projectService.getProjectById(id);
    if (this.project) {
      this.developer = this.userService.getUserById(this.project.userId);
      const currentUser = this.authService.getCurrentUser();
      this.isOwner = !!currentUser && currentUser.id === this.project.userId;
    }
  }

  navigateToProfileTab(tab: string): void {
    if (this.developer) {
      this.router.navigate(['/profil', this.developer.id], { queryParams: { tab } });
    }
  }

  // Vérifie s'il existe au moins un lien non vide à afficher
  hasAnyLink(): boolean {
    if (!this.project) return false;
    if (this.project.liens && this.project.liens.some(l => l.url && l.url.trim() !== '')) {
      return true;
    }
    return false;
  }

  // Icône pour chaque type de lien
  getLinkIcon(type: string): string {
    const icons: Record<string, string> = {
      github: 'fab fa-github',
      instagram: 'fab fa-instagram',
      facebook: 'fab fa-facebook',
      demoweb: 'fas fa-globe',
      linkedin: 'fab fa-linkedin',
      custom: 'fas fa-link',
      twitter: 'fab fa-twitter',
      email: 'fas fa-envelope'
    };
    return icons[type] || 'fas fa-link';
  }

  // Libellé par défaut
  getLinkLabel(type: string): string {
    const labels: Record<string, string> = {
      github: 'GitHub',
      instagram: 'Instagram',
      facebook: 'Facebook',
      demoweb: 'Démo en ligne',
      linkedin: 'LinkedIn',
      custom: 'Lien',
      twitter: 'Twitter',
      email: 'Email'
    };
    return labels[type] || type;
  }

  // Classe CSS pour varier les couleurs
  getLinkClass(type: string): string {
    return `btn-link btn-${type}`;
  }

  // ------------------------------------------------------------------
  // Gestion des documents
  // ------------------------------------------------------------------

  // Retourne le nom à afficher pour le document
  getDocumentLabel(doc: any): string {
    // Priorité au fileName (uploadé) sinon au nom choisi dans le select
    return doc.fileName || doc.nom || 'Document';
  }

  // Simulation de téléchargement (à adapter si besoin)
  downloadDocument(doc: any): void {
    // Pour l'instant, alerte car pas de vrai fichier
    alert(`Téléchargement simulé : ${doc.fileName || doc.nom}`);
    // Si tu as une URL réelle, décommente :
    // window.open(doc.fileUrl, '_blank');
  }
}