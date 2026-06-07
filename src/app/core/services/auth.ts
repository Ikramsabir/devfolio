import { Injectable } from '@angular/core';
import { StorageService } from './storage';
import { UserService, User } from './user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser: User | null = null;

  constructor(private storage: StorageService, private userService: UserService) {
    const userId = this.storage.get<number>('currentUserId');
    if (userId) {
      this.currentUser = this.userService.getUserById(userId) || null;
    }
  }

  login(email: string, password: string): boolean {
    const user = this.userService.getUsers().find(u => u.email === email && u.password === password);
    if (user) {
      this.currentUser = user;
      this.storage.set('currentUserId', user.id);
      return true;
    }
    return false;
  }

  logout(): void {
    this.currentUser = null;
    this.storage.remove('currentUserId');
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}