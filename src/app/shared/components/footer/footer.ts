import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrls: ['./footer.css'],
})
export class FooterComponent implements OnInit {
  isConnected = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Note: since this is a global component, it needs to be aware of auth changes.
    // In a real app we'd use a BehaviorSubject, but we can poll or rely on routing to recreate it.
    // However, if the user logs in, the page might not full reload. 
    // We will just do a check on doCheck or rely on a simple getter if we want it reactive.
    this.isConnected = this.authService.isAuthenticated();
  }
  
  // Getter is better for reactivity without subjects
  get isLoggedIn() {
    return this.authService.isAuthenticated();
  }
}
