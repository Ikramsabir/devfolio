import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavbarProfileComponent } from '../../shared/components/navbar-profile/navbar-profile';
import { UserService, User, Competence, ContactEntry } from '../../core/services/user';
import { ProjectService, Project, ProjectLink, ProjectDocument } from '../../core/services/project';
import { AuthService } from '../../core/services/auth';
import { MessageService, Message } from '../../core/services/message';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarProfileComponent],
  templateUrl: './profil.html',
  styleUrls: ['./profil.css']
})
export class ProfilComponent implements OnInit {
  user: User | undefined;
  allProjects: Project[] = [];
  filteredProjects: Project[] = [];
  techFilter: string = 'Tous';
  techList: string[] = ['Tous'];

  activeTab: string = 'projets';
  isLoggedIn = false;
  isOwner = false;

  // Messages
  messages: Message[] = [];
  unreadCount = 0;

  // Contact Form
  contactSubject = '';
  contactMessage = '';
  contactSuccess = false;

  // Settings Form
  editUser: any = {};

  // Project Form
  showProjectModal = false;
  editingProject: any = {};
  projectToDelete: number | null = null;

  // Competences
  showCompetenceModal = false;
  editingCompetence: Competence = { nom: '', description: '' };
  editingCompetenceIndex: number = -1; // -1 = new

  // Contacts dynamiques (settings)
  editContacts: ContactEntry[] = [];
  contactTypes = ['instagram', 'email', 'linkedin', 'telephone', 'github', 'twitter', 'custom'];

  // Avatar
  showAvatarModal = false;
  tempAvatar: string | null = null;

  // Delete Account
  showDeleteAccountModal = false;
  deleteConfirmText = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private projectService: ProjectService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      this.loadUser(id);
    });
    this.route.queryParams.subscribe(params => {
      const tab = params['tab'];
      if (tab) {
        this.activeTab = tab;
      }
    });
  }

  loadUser(id: number): void {
    this.user = this.userService.getUserById(id);
    this.isLoggedIn = this.authService.isAuthenticated();
    const currentUser = this.authService.getCurrentUser();
    this.isOwner = this.isLoggedIn && currentUser?.id === id;

    if (this.user) {
      if (this.isOwner) {
        this.allProjects = this.projectService.getProjectsByUserId(this.user.id);
        this.messages = this.messageService.getMessagesForUser(this.user.id);
        this.unreadCount = this.messageService.getUnreadCount(this.user.id);
        this.editUser = {
          ...this.user,
          contact: { ...(this.user.contact || {}) }
        };
        // Init editContacts from user.contacts or legacy contact
        this.editContacts = this.user.contacts ? [...this.user.contacts] : [];
      } else {
        this.allProjects = this.projectService.getPublicProjectsByUserId(this.user.id);
      }
      this.buildTechList();
      this.filterProjects();
      this.activeTab = 'projets';
    }
  }

  buildTechList(): void {
    const techSet = new Set<string>();
    this.allProjects.forEach(project => {
      project.technologies.forEach(tech => techSet.add(tech));
    });
    this.techList = ['Tous', ...Array.from(techSet).sort()];
  }

  filterProjects(): void {
    if (this.techFilter === 'Tous') {
      this.filteredProjects = [...this.allProjects];
    } else {
      this.filteredProjects = this.allProjects.filter(p =>
        p.technologies.some(t => t === this.techFilter)
      );
    }
  }

  setTechFilter(tech: string): void {
    this.techFilter = tech;
    this.filterProjects();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    if (tab === 'inbox' && this.isOwner && this.user) {
      this.messageService.markAllAsRead(this.user.id);
      this.unreadCount = 0;
      this.messages = this.messageService.getMessagesForUser(this.user.id);
    }
  }

  // ─── Messages ─────────────────────────────────────────────────────────────

  sendMessage(): void {
    if (!this.contactSubject || !this.contactMessage) return;
    const sender = this.authService.getCurrentUser();
    if (sender && this.user) {
      this.messageService.sendMessage({
        senderId: sender.id,
        receiverId: this.user.id,
        senderName: sender.nom,
        subject: this.contactSubject,
        content: this.contactMessage,
      });
      this.contactSuccess = true;
      this.contactSubject = '';
      this.contactMessage = '';
    }
  }

  closeContactSuccess(): void {
    this.contactSuccess = false;
  }

  // ─── CV ────────────────────────────────────────────────────────────────────

  triggerCvUpload(): void {
    document.getElementById('cvUpload')?.click();
  }

  onCvUpload(event: any): void {
    const file = event.target.files[0];
    if (file && this.user) {
      this.userService.updateUser(this.user.id, { cvUrl: file.name });
      this.user.cvUrl = file.name;
    }
  }

  downloadCV(): void {
    if (this.user?.cvUrl) {
      const link = document.createElement('a');
      link.href = '#';
      link.download = this.user.cvUrl;
      link.click();
    } else {
      alert('Aucun CV disponible pour ce profil.');
    }
  }

  // ─── Avatar ───────────────────────────────────────────────────────────────

  triggerAvatarUpload(): void {
    document.getElementById('avatarUpload')?.click();
  }

  onAvatarUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.tempAvatar = e.target.result;
        this.showAvatarModal = true;
      };
      reader.readAsDataURL(file);
    }
  }

  saveAvatar(): void {
    if (this.user && this.tempAvatar) {
      this.userService.updateUser(this.user.id, { avatar: this.tempAvatar });
      this.user.avatar = this.tempAvatar;
      this.tempAvatar = null;
      this.showAvatarModal = false;
    }
  }

  removeAvatar(): void {
    if (this.user) {
      this.userService.updateUser(this.user.id, { avatar: '' });
      this.user.avatar = '';
    }
  }

  // ─── Suppression Compte ────────────────────────────────────────────────────

  confirmDeleteAccount(): void {
    this.deleteConfirmText = '';
    this.showDeleteAccountModal = true;
  }

  closeDeleteAccountModal(): void {
    this.showDeleteAccountModal = false;
    this.deleteConfirmText = '';
  }

  executeDeleteAccount(): void {
    if (this.deleteConfirmText !== 'SUPPRIMER' || !this.user) return;
    this.userService.deleteUser(this.user.id);
    this.authService.logout();
    this.router.navigate(['/accueil']);
  }

  closeAvatarModal(): void {
    this.showAvatarModal = false;
    this.tempAvatar = null;
  }

  // ─── Paramètres ────────────────────────────────────────────────────────────

  saveSettings(): void {
    if (this.user) {
      const updatedData: Partial<User> = {
        nom: this.editUser.nom,
        titre: this.editUser.titre,
        bio: this.editUser.bio,
        contacts: [...this.editContacts]
      };
      if (this.editUser.newPassword) {
        updatedData.password = this.editUser.newPassword;
      }
      this.userService.updateUser(this.user.id, updatedData);
      // Also update auth service current user
      const currentUser = this.authService.getCurrentUser();
      if (currentUser && this.isOwner) {
        Object.assign(currentUser, updatedData);
      }
      this.user = { ...this.user, ...updatedData };
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  }

  // Contact entries (settings)
  addContactEntry(): void {
    this.editContacts.push({ type: 'email', value: '' });
  }

  removeContactEntry(i: number): void {
    this.editContacts.splice(i, 1);
  }

  getContactLabel(type: string): string {
    const labels: Record<string, string> = {
      instagram: 'Instagram', email: 'Email', linkedin: 'LinkedIn',
      telephone: 'Téléphone', github: 'GitHub', twitter: 'Twitter', custom: 'Autre'
    };
    return labels[type] || type;
  }

  getContactIcon(type: string): string {
    const icons: Record<string, string> = {
      instagram: 'fab fa-instagram', email: 'fas fa-envelope', linkedin: 'fab fa-linkedin',
      telephone: 'fas fa-phone', github: 'fab fa-github', twitter: 'fab fa-twitter', custom: 'fas fa-link'
    };
    return icons[type] || 'fas fa-link';
  }

  // ─── Projets ───────────────────────────────────────────────────────────────

  openProjectModal(project?: Project): void {
    if (project) {
      this.editingProject = { ...project };
      this.editingProject.techString = project.technologies.join(', ');
      this.editingProject.liens = project.liens ? [...project.liens.map(l => ({...l}))] : [];
      this.editingProject.documents = project.documents ? [...project.documents.map(d => ({...d}))] : [];
    } else {
      const currentYear = new Date().getFullYear().toString();
      this.editingProject = {
        titre: '',
        description: '',
        fullDescription: '',
        status: 'public',
        userId: this.user?.id,
        techString: '',
        date: currentYear,
        liens: [],
        documents: []
      };
    }
    this.showProjectModal = true;
  }

  closeProjectModal(): void {
    this.showProjectModal = false;
  }

  saveProject(): void {
    if (this.user && this.editingProject.titre) {
      const techs = (this.editingProject.techString || '').split(',').map((s: string) => s.trim()).filter((s: string) => s);
      this.editingProject.technologies = techs;
      const status = (['public', 'private'].includes(this.editingProject.status) ? this.editingProject.status : 'public');
      const projectData: any = {
        titre: this.editingProject.titre,
        description: this.editingProject.description,
        fullDescription: this.editingProject.fullDescription,
        technologies: techs,
        status,
        userId: this.user.id,
        date: this.editingProject.date,
        liens: this.editingProject.liens || [],
        documents: this.editingProject.documents || []
      };
      if (this.editingProject.id) {
        projectData.id = this.editingProject.id;
        this.projectService.updateProject(this.editingProject.id, projectData as Project);
      } else {
        this.projectService.addProject(projectData as Omit<Project, 'id'>);
      }
      this.closeProjectModal();
      this.loadUser(this.user.id);
    }
  }

  addProjectLink(): void {
    if (!this.editingProject.liens) this.editingProject.liens = [];
    this.editingProject.liens.push({ type: 'github', url: '' });
  }

  removeProjectLink(index: number): void {
    this.editingProject.liens.splice(index, 1);
  }

  addProjectDocument(): void {
    if (!this.editingProject.documents) this.editingProject.documents = [];
    if (this.editingProject.documents.length < 3) {
      this.editingProject.documents.push({ nom: '', fileName: '', description: '' });
    }
  }

  removeProjectDocument(index: number): void {
    this.editingProject.documents.splice(index, 1);
  }

  onProjectDocUpload(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64 = e.target.result;
        this.editingProject.documents[index].fileName = file.name;
        this.editingProject.documents[index].content = base64;
        this.editingProject.documents[index].mimeType = file.type;
      };
      reader.readAsDataURL(file);
    }
  }

  getLinkIcon(type: string): string {
    const icons: Record<string, string> = {
      github: 'fab fa-github', instagram: 'fab fa-instagram', facebook: 'fab fa-facebook',
      demoweb: 'fas fa-globe', linkedin: 'fab fa-linkedin', custom: 'fas fa-link'
    };
    return icons[type] || 'fas fa-link';
  }

  deleteProject(id: number): void {
    this.projectToDelete = id;
  }

  executeDeleteProject(): void {
    if (this.projectToDelete !== null) {
      this.projectService.deleteProject(this.projectToDelete);
      this.projectToDelete = null;
      if (this.user) {
        this.loadUser(this.user.id);
      }
    }
  }

  cancelDeleteProject(): void {
    this.projectToDelete = null;
  }

  // ─── Compétences ───────────────────────────────────────────────────────────

  openCompetenceModal(index?: number): void {
    if (index !== undefined && this.user) {
      this.editingCompetenceIndex = index;
      this.editingCompetence = { ...this.user.competences[index] };
    } else {
      this.editingCompetenceIndex = -1;
      this.editingCompetence = { nom: '', description: '' };
    }
    this.showCompetenceModal = true;
  }

  closeCompetenceModal(): void {
    this.showCompetenceModal = false;
  }

  saveCompetence(): void {
    if (!this.editingCompetence.nom || !this.user) return;
    const competences = [...this.user.competences];
    if (this.editingCompetenceIndex === -1) {
      competences.push({ ...this.editingCompetence });
    } else {
      competences[this.editingCompetenceIndex] = { ...this.editingCompetence };
    }
    this.userService.updateUser(this.user.id, { competences });
    this.user.competences = competences;
    this.closeCompetenceModal();
  }

  deleteCompetence(index: number): void {
    if (!this.user) return;
    const competences = [...this.user.competences];
    competences.splice(index, 1);
    this.userService.updateUser(this.user.id, { competences });
    this.user.competences = competences;
  }
}