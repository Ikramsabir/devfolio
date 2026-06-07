import { Injectable } from '@angular/core';
import { StorageService } from './storage';

export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  senderName: string;
  subject: string;
  content: string;
  attachments?: string[]; // Liens ou noms de fichiers joints
  timestamp: string;
  read?: boolean;
}

@Injectable({ providedIn: 'root' })
export class MessageService {
  private messages: Message[] = [];

  constructor(private storage: StorageService) {
    const stored = this.storage.get<Message[]>('messages');
    if (stored) {
      this.messages = stored;
    } else {
      this.messages = this.getMockMessages();
      this.saveToLocal();
    }
  }

  private getMockMessages(): Message[] {
    return [
      {
        id: 1,
        senderId: 2,
        receiverId: 1,
        senderName: 'Fatima Zahra',
        subject: 'Proposition de collaboration',
        content: 'Bonjour Ahmed, j\'ai vu ton profil et je serais intéressée pour collaborer sur un projet frontend/backend. Dis-moi si tu es disponible.',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        read: false
      }
    ];
  }

  private saveToLocal(): void {
    this.storage.set('messages', this.messages);
  }

  getMessagesForUser(userId: number): Message[] {
    return this.messages.filter(m => m.receiverId === userId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  getUnreadCount(userId: number): number {
    return this.messages.filter(m => m.receiverId === userId && !m.read).length;
  }

  markAllAsRead(userId: number): void {
    let updated = false;
    this.messages.forEach(m => {
      if (m.receiverId === userId && !m.read) {
        m.read = true;
        updated = true;
      }
    });
    if (updated) this.saveToLocal();
  }

  deleteUserMessages(userId: number): void {
    this.messages = this.messages.filter(m => m.receiverId !== userId && m.senderId !== userId);
    this.saveToLocal();
  }

  sendMessage(message: Omit<Message, 'id' | 'timestamp' | 'read'>): Message {
    const newMessage: Message = {
      ...message,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      read: false
    };
    this.messages.push(newMessage);
    this.saveToLocal();
    return newMessage;
  }
}
