import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { User } from '../../../core/services/user';
import { ThemeService } from '../../../core/services/theme';
import { MessageService } from '../../../core/services/message';

@Component({
  selector: 'app-navbar-visitor',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar-visitor.html',
  styleUrls: ['./navbar-visitor.css']
})
export class NavbarVisitorComponent implements OnInit {
  isLoggedIn = false;
  isDarkMode = false;
  currentUser: User | null = null;
  unreadCount: number = 0;

  constructor(
    private authService: AuthService,
    private themeService: ThemeService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    this.isDarkMode = this.themeService.isDarkMode();
    if (this.isLoggedIn) {
      this.currentUser = this.authService.getCurrentUser();
      this.updateUnreadCount();
    }
  }

  updateUnreadCount() {
    if (this.currentUser) {
      this.unreadCount = this.messageService.getUnreadCount(this.currentUser.id);
    }
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
    window.location.href = '/accueil';
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
    this.isDarkMode = this.themeService.isDarkMode();
  }
}