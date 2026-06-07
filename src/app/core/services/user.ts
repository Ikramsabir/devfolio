import { Injectable } from '@angular/core';
import { StorageService } from './storage';

export interface ContactEntry {
  type: string; // instagram, email, linkedin, telephone, github, custom
  customName?: string; // Nom personnalisé si type = 'custom'
  value: string;
}

export interface Competence {
  nom: string;
  description?: string;
}

export interface User {
  id: number;
  nom: string;
  email: string;
  password?: string;
  titre: string;
  competences: Competence[];
  avatar?: string;
  bio?: string;
  contacts?: ContactEntry[];
  // Legacy contact support
  contact?: { instagram?: string; mail?: string; localisation?: string };
  cvUrl?: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private users: User[] = [];

  private readonly DATA_VERSION = 'v3';

  constructor(private storage: StorageService) {
    const storedVersion = this.storage.get<string>('usersVersion');
    const stored = this.storage.get<User[]>('users');
    // Force re-seed if version mismatch or no data
    const needsReseed = !stored || storedVersion !== this.DATA_VERSION || stored.length === 0
      || !Array.isArray(stored[0]?.competences)
      || (stored[0]?.competences.length > 0 && typeof stored[0].competences[0] === 'string');
    if (!needsReseed) {
      this.users = stored!;
    } else {
      this.users = this.getMockUsers();
      this.storage.set('usersVersion', this.DATA_VERSION);
      this.saveToLocal();
    }
  }

  private getMockUsers(): User[] {
    return [
  {
    id: 1,
    nom: 'Ahmed Alaoui',
    email: 'ahmed@test.com',
    password: '1234',
    titre: 'Développeur Full-Stack',
    competences: [
      { nom: 'Angular', description: 'Applications web avancées.' },
      { nom: 'Node.js', description: 'APIs REST performantes.' }
    ],
    bio: 'Développeur passionné par les technologies web modernes.',
    contacts: [
      { type: 'email', value: 'ahmed@test.com' },
      { type: 'custom', customName: 'Localisation', value: 'Casablanca' }
    ]
  },

  {
    id: 2,
    nom: 'Fatima Zahra',
    email: 'fatima@test.com',
    password: '1234',
    titre: 'Développeuse Front-End',
    competences: [
      { nom: 'React', description: 'Interfaces modernes.' },
      { nom: 'Tailwind CSS', description: 'Design responsive.' }
    ],
    bio: 'Créatrice d’interfaces utilisateur élégantes.',
    contacts: [
      { type: 'email', value: 'fatima@test.com' },
      { type: 'custom', customName: 'Localisation', value: 'Rabat' }
    ]
  },

  {
    id: 3,
    nom: 'Marwa Riad',
    email: 'marwa@test.com',
    password: '1234',
    titre: 'Développeuse Mobile',
    competences: [
      { nom: 'Flutter', description: 'Applications mobiles.' },
      { nom: 'Firebase', description: 'Backend mobile.' }
    ],
    bio: 'Spécialisée dans le développement mobile.',
    contacts: [
      { type: 'email', value: 'marwa@test.com' },
      { type: 'custom', customName: 'Localisation', value: 'Marrakech' }
    ]
  },

  {
    id: 4,
    nom: 'Ikram Sabir',
    email: 'ikram@test.com',
    password: '123456',
    titre: 'Développeur Angular',
    competences: [
      { nom: 'Angular', description: 'SPA performantes.' },
      { nom: 'TypeScript', description: 'Développement structuré.' }
    ],
    bio: 'Expert Angular et applications web.',
    contacts: [
      { type: 'email', value: 'ikram@test.com' },
      { type: 'custom', customName: 'Localisation', value: 'Casablanca' }
    ]
  },

  {
    id: 5,
    nom: 'Salma Idrissi',
    email: 'salma@test.com',
    password: '1234',
    titre: 'Développeuse Java',
    competences: [
      { nom: 'Spring Boot', description: 'Applications backend.' },
      { nom: 'MySQL', description: 'Gestion BD.' }
    ],
    bio: 'Développeuse backend Java.',
    contacts: [
      { type: 'email', value: 'salma@test.com' },
      { type: 'custom', customName: 'Localisation', value: 'Agadir' }
    ]
  },

  {
    id: 6,
    nom: 'Omar Chafik',
    email: 'omar@test.com',
    password: '1234',
    titre: 'Développeur PHP',
    competences: [
      { nom: 'PHP', description: 'Applications web.' },
      { nom: 'WordPress', description: 'CMS avancé.' }
    ],
    bio: 'Passionné par le développement PHP.',
    contacts: [
      { type: 'email', value: 'omar@test.com' },
      { type: 'custom', customName: 'Localisation', value: 'Tanger' }
    ]
  },

  {
    id: 7,
    nom: 'Nadia El Fassi',
    email: 'nadia@test.com',
    password: '1234',
    titre: 'Développeuse Next.js',
    competences: [
      { nom: 'Next.js', description: 'SSR et SEO.' },
      { nom: 'Tailwind', description: 'UI moderne.' }
    ],
    bio: 'Développeuse spécialisée Next.js.',
    contacts: [
      { type: 'email', value: 'nadia@test.com' },
      { type: 'custom', customName: 'Localisation', value: 'Casablanca' }
    ]
  },

  {
    id: 8,
    nom: 'Karim Toumi',
    email: 'karim@test.com',
    password: '1234',
    titre: 'Développeur Flutter',
    competences: [
      { nom: 'Flutter', description: 'Apps cross-platform.' },
      { nom: 'Firebase', description: 'Services cloud.' }
    ],
    bio: 'Créateur d’applications mobiles modernes.',
    contacts: [
      { type: 'email', value: 'karim@test.com' },
      { type: 'custom', customName: 'Localisation', value: 'Meknès' }
    ]
  },

  {
    id: 9,
    nom: 'Hajar Amrani',
    email: 'hajar@test.com',
    password: '1234',
    titre: 'Développeuse Angular',
    competences: [
      { nom: 'Angular', description: 'Dashboard avancés.' },
      { nom: 'Chart.js', description: 'Visualisation données.' }
    ],
    bio: 'Développeuse d’interfaces analytiques.',
    contacts: [
      { type: 'email', value: 'hajar@test.com' },
      { type: 'custom', customName: 'Localisation', value: 'Oujda' }
    ]
  },

  {
    id: 10,
    nom: 'Ayoub Lahlou',
    email: 'ayoub@test.com',
    password: '1234',
    titre: 'Développeur MERN',
    competences: [
      { nom: 'React', description: 'Front-end.' },
      { nom: 'MongoDB', description: 'Base NoSQL.' }
    ],
    bio: 'Développeur MERN Stack.',
    contacts: [
      { type: 'email', value: 'ayoub@test.com' },
      { type: 'custom', customName: 'Localisation', value: 'Casablanca' }
    ]
  },

  {
    id: 11,
    nom: 'Sara El Ghazi',
    email: 'sara@test.com',
    password: '1234',
    titre: 'Développeuse Vue.js',
    competences: [
      { nom: 'Vue.js', description: 'SPA modernes.' },
      { nom: 'Vuex', description: 'Gestion état.' }
    ],
    bio: 'Passionnée par Vue.js.',
    contacts: [
      { type: 'email', value: 'sara@test.com' },
      { type: 'custom', customName: 'Localisation', value: 'Rabat' }
    ]
  },

  {
    id: 12,
    nom: 'Mehdi El Mansouri',
    email: 'mehdi@test.com',
    password: '1234',
    titre: 'Développeur React',
    competences: [
      { nom: 'React', description: 'Interfaces dynamiques.' },
      { nom: 'GSAP', description: 'Animations.' }
    ],
    bio: 'Développeur créatif et designer web.',
    contacts: [
      { type: 'email', value: 'mehdi@test.com' },
      { type: 'custom', customName: 'Localisation', value: 'Kénitra' }
    ]
  },

  {
    id: 13,
    nom: 'Imane Berrada',
    email: 'imane@test.com',
    password: '1234',
    titre: 'Développeuse Angular',
    competences: [
      { nom: 'NgRx', description: 'Gestion d’état.' },
      { nom: 'Angular', description: 'Applications complexes.' }
    ],
    bio: 'Experte Angular et architecture logicielle.',
    contacts: [
      { type: 'email', value: 'imane@test.com' },
      { type: 'custom', customName: 'Localisation', value: 'Tétouan' }
    ]
  },

  {
    id: 14,
    nom: 'Zakaria Ait Said',
    email: 'zakaria@test.com',
    password: '1234',
    titre: 'Développeur Back-End',
    competences: [
      { nom: 'Express.js', description: 'API REST.' },
      { nom: 'MongoDB', description: 'Gestion des données.' }
    ],
    bio: 'Développeur orienté backend.',
    contacts: [
      { type: 'email', value: 'zakaria@test.com' },
      { type: 'custom', customName: 'Localisation', value: 'El Jadida' }
    ]
  },

  {
    id: 15,
    nom: 'Lina Akhrif',
    email: 'lina@test.com',
    password: '1234',
    titre: 'Développeuse Full-Stack',
    competences: [
      { nom: 'React', description: 'Front-end.' },
      { nom: 'Node.js', description: 'Backend.' }
    ],
    bio: 'Développeuse full-stack passionnée par l’e-learning.',
    contacts: [
      { type: 'email', value: 'lina@test.com' },
      { type: 'custom', customName: 'Localisation', value: 'Casablanca' }
    ]
  }
];
  }

  private saveToLocal(): void {
    this.storage.set('users', this.users);
  }

  getUsers(): User[] {
    return this.users;
  }

  getUserById(id: number): User | undefined {
    return this.users.find(u => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  addUser(user: Omit<User, 'id'>): User {
    const newId = Date.now();
    const newUser: User = { 
      ...user, 
      id: newId,
      competences: user.competences || [],
      contacts: user.contacts || []
    };
    this.users.push(newUser);
    this.saveToLocal();
    return newUser;
  }

  updateUser(id: number, updatedUser: Partial<User>): void {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...updatedUser };
      this.saveToLocal();
    }
  }

  deleteUser(id: number): void {
    this.users = this.users.filter(u => u.id !== id);
    this.saveToLocal();
  }
}