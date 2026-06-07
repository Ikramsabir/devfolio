import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../../core/services/theme';

@Component({
  selector: 'app-navbar-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar-profile.html',
  styleUrls: ['./navbar-profile.css']
})
export class NavbarProfileComponent {
  @Input() activeTab: string = 'projets';
  @Input() isOwner: boolean = false;
  @Input() unreadCount: number = 0;
  @Output() tabChange = new EventEmitter<string>();
  isDarkMode = false;

  constructor(private themeService: ThemeService) {
    this.isDarkMode = this.themeService.isDarkMode();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.tabChange.emit(tab);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
    this.isDarkMode = this.themeService.isDarkMode();
  }
}