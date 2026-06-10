import { Injectable } from '@angular/core';
import { StorageService } from './storage';

export interface ProjectLink {
  type: string; // 'github', 'demoweb', 'instagram', 'facebook', 'linkedin', 'custom', etc.
  customName?: string;
  url: string;
}

export interface ProjectDocument {
  nom: string;
  description?: string;
  fileName: string; // Fichier simulé
}

export interface Project {
  id: number;
  titre: string;
  description: string;
  fullDescription?: string;
  technologies: string[];
  userId: number;
  status: 'public' | 'private' | 'draft';
  imageUrl?: string;
  date?: string;
  liens?: ProjectLink[];
  documents?: ProjectDocument[];
}

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private projects: Project[] = [];

  constructor(private storage: StorageService) {
    const stored = this.storage.get<Project[]>('projects');
    if (stored && stored.length >= 20) {
      this.projects = stored;
    } else {
      this.projects = this.getMockProjects();
      this.saveToLocal();
    }
  }

  private getMockProjects(): Project[] {
    return [
      // 1 public
      {
        id: 1,  titre: 'DevFolio', description: 'Portfolio dev',
        fullDescription: 'DevFolio est le projet que vous êtes en train de développer : une plateforme où les développeurs peuvent créer leur portfolio, gérer leurs projets et compétences, et contacter d\'autres développeurs. L\'authentification est locale (simulée) et les données sont persistées dans localStorage. Mode sombre, recherche avancée.',
        technologies: ['Angular', 'LocalStorage', 'RxJS'], userId: 4, status: 'public', imageUrl: 'assets/devfolio.png', date: '2025',
        liens: [
          { type: 'github', url: 'https://github.com/Ikramsabir/devfolio' },
          { type: 'demoweb', url: 'https://ikramsabir.github.io/devfolio/' }
        ]
      },
      // 2 public
      {
        id: 2, titre: 'ShopNow', description: 'Boutique e-commerce',
        fullDescription: 'ShopNow est une plateforme e-commerce complète avec panier d\'achat, intégration Stripe pour les paiements, dashboard administrateur, gestion de produits et de commandes. L\'API backend est construite avec Node.js et Express, la base de données MongoDB. Le site supporte le multilingue et le mode sombre.',
        technologies: ['Angular', 'Node.js', 'Express', 'MongoDB'], userId: 1, status: 'public', imageUrl: 'assets/shopnow.png', date: '2024',
        liens: [
          { type: 'github', url: 'https://github.com/example/shopnow' },
          { type: 'demoweb', url: 'https://shopnow.demo.com' }
        ]
      },
      // 3 public
      {
        id: 3, titre: 'MétéoCity', description: 'Météo API',
        fullDescription: 'MétéoCity utilise l\'API OpenWeatherMap pour afficher la météo actuelle et les prévisions sur 5 jours. L\'application propose la recherche de villes, la géolocalisation automatique, l\'ajout de favoris (stockés dans localStorage) et des graphiques de températures. Idéale pour suivre la météo en déplacement.',
        technologies: ['Angular', 'REST API', 'RxJS'], userId: 1, status: 'public', imageUrl: 'assets/meteocity.png', date: '2023',
        liens: [
          { type: 'github', url: 'https://github.com/example/meteocity' },
          { type: 'demoweb', url: 'https://meteocity.demo.com' }
        ]
      },
      // 4 private (ne s'affiche pas publiquement)
      {
        id: 4, titre: 'Portfolio React', description: 'Portfolio moderne',
        fullDescription: 'Un portfolio professionnel développé avec React. Il intègre des animations GSAP pour des transitions fluides, un mode sombre, un filtrage de projets par technologie et un formulaire de contact fonctionnel avec EmailJS. Le site est responsive et optimisé pour le référencement.',
        technologies: ['React', 'Framer Motion', 'EmailJS'], userId: 2, status: 'private', imageUrl: 'assets/portfolio-react.png', date: '2024',
        liens: [
          { type: 'github', url: 'https://github.com/example/portfolio-react' },
          { type: 'demoweb', url: 'https://portfolio-react.demo.com' }
        ]
      },
      // 5 public
      {
        id: 5, titre: 'EduQuiz', description: 'Plateforme quiz',
        fullDescription: 'EduQuiz permet aux enseignants de créer des quiz et aux étudiants de s\'entraîner avec des tests chronométrés. Les fonctionnalités incluent un tableau des scores, un feedback immédiat après chaque question, la génération de certificats PDF et une interface admin pour gérer les questions et catégories.',
        technologies: ['Angular', 'Node.js', 'MongoDB'], userId: 4, status: 'public', imageUrl: 'assets/eduquiz.png', date: '2024',
        liens: [
          { type: 'github', url: 'https://github.com/example/eduquiz' },
          { type: 'demoweb', url: 'https://eduquiz.demo.com' }
        ]
      },
      // 6 public
      {
        id: 6,  titre: 'TaskFlow', description: 'Application Kanban',
        fullDescription: 'TaskFlow est une application complète de gestion de tâches inspirée de Trello. Elle permet de créer des tableaux, des listes et des cartes, d\'assigner des membres, de fixer des dates d\'échéance et de suivre la progression en temps réel. Le backend utilise Firebase pour l\'authentification, les notifications par email et la synchronisation en direct.',
        technologies: ['Angular', 'RxJS', 'Firebase'], userId: 4, status: 'public', imageUrl: 'assets/taskflow.png', date: '2024',
        liens: [
          { type: 'github', url: 'https://github.com/example/taskflow' },
          { type: 'demoweb', url: 'https://taskflow.demo.com' }
        ]
      },
      // 7 public
      {
        id: 7, titre: 'Food Delivery App', description: 'Livraison repas',
        fullDescription: 'Application mobile et web pour commander des repas auprès de restaurants partenaires. Le client peut suivre sa commande en temps réel, payer en ligne via Stripe, consulter son historique et noter les restaurants. Les livreurs reçoivent les notifications push.',
        technologies: ['React Native', 'Node.js', 'MongoDB', 'Stripe'], userId: 3, status: 'public', imageUrl: 'assets/food-delivery.png', date: '2024',
        liens: [
          { type: 'github', url: 'https://github.com/example/food-delivery' },
          { type: 'demoweb', url: 'https://food-delivery.demo.com' }
        ]
      },
      // 8 draft (brouillon)
      {
        id: 8, titre: 'Chat instantané', description: 'Messagerie temps réel',
        fullDescription: 'Application de chat en temps réel utilisant Socket.io. Les utilisateurs peuvent créer des salles privées, envoyer des messages textes, des images et des emojis. Les notifications de présence (en ligne/hors ligne) sont affichées et l’historique des conversations est stocké en base de données MongoDB.',
        technologies: ['Vue.js', 'Express', 'MongoDB', 'Socket.io'], userId: 2, status: 'draft', imageUrl: 'assets/chat.png', date: '2023',
        liens: [
          { type: 'github', url: 'https://github.com/example/chat' },
          { type: 'demoweb', url: 'https://chat.demo.com' }
        ]
      },
      // 9 public
      {
        id: 9, titre: 'Gestion des stocks', description: 'ERP',
        fullDescription: 'ERP complet pour petites entreprises : gestion des stocks, des commandes fournisseurs, des ventes, génération de rapports PDF, tableaux de bord analytiques et authentification multi-rôles. Le backend utilise Spring Boot (Java) et MySQL.',
        technologies: ['Angular', 'Spring Boot', 'MySQL'], userId: 5, status: 'public', imageUrl: 'assets/stock-management.png', date: '2023',
        liens: [
          { type: 'github', url: 'https://github.com/example/stock-management' },
          { type: 'demoweb', url: 'https://stock.demo.com' }
        ]
      },
      // 10 public
      {
        id: 10, titre: 'Blog Voyage', description: 'Blog voyage',
        fullDescription: 'Blog de voyage avec articles, catégories, tags, système de commentaires imbriqués, recherche par mot-clé, galerie photos et une carte interactive des destinations visitées. L’administration se fait via une interface WordPress personnalisée.',
        technologies: ['WordPress', 'PHP', 'MySQL'], userId: 6, status: 'public', imageUrl: 'assets/travel-blog.png', date: '2022',
        liens: [
          { type: 'github', url: 'https://github.com/example/travel-blog' },
          { type: 'demoweb', url: 'https://travel-blog.demo.com' }
        ]
      },
      // 11 public
      {
        id: 11, titre: 'Site E-commerce (Next.js)', description: 'Boutique Next.js',
        fullDescription: 'Boutique e-commerce moderne développée avec Next.js et Tailwind CSS. Le site inclut un panier, un système de checkout, l’intégration Stripe, l’optimisation SEO, des images optimisées (next/image) et le mode sombre. Le déploiement se fait sur Vercel.',
        technologies: ['Next.js', 'Tailwind', 'Stripe', 'Vercel'], userId: 7, status: 'public', imageUrl: 'assets/next-ecommerce.png', date: '2024',
        liens: [
          { type: 'github', url: 'https://github.com/example/next-ecommerce' },
          { type: 'demoweb', url: 'https://next-ecommerce.demo.com' }
        ]
      },
      // 12 public
      {
        id: 12, titre: 'Application Fitness', description: 'Suivi fitness',
        fullDescription: 'Application de suivi d’entraînement avec catalogue d’exercices, compteur de calories, graphiques de progression et planning personnalisé. Les données sont synchronisées avec Firebase (authentification, stockage en temps réel). Disponible sur mobile et web.',
        technologies: ['Flutter', 'Firebase'], userId: 8, status: 'public', imageUrl: 'assets/fitness.png', date: '2024',
        liens: [
          { type: 'github', url: 'https://github.com/example/fitness' },
          { type: 'demoweb', url: 'https://fitness.demo.com' }
        ]
      },
      // 13 private
      {
        id: 13, titre: 'Dashboard Admin', description: 'Dashboard',
        fullDescription: 'Dashboard administrateur complet avec graphiques dynamiques (Chart.js), gestion des utilisateurs, statistiques en temps réel, export de rapports CSV et mode sombre. L’état global est géré avec NgRx et le routage est lazy-loaded.',
        technologies: ['Angular', 'Chart.js', 'NgRx'], userId: 9, status: 'private', imageUrl: 'assets/dashboard.png', date: '2024',
        liens: [
          { type: 'github', url: 'https://github.com/example/dashboard' },
          { type: 'demoweb', url: 'https://dashboard.demo.com' }
        ]
      },
      // 14 public
      {
        id: 14, titre: 'Clone de Twitter', description: 'Réseau social',
        fullDescription: 'Clone simplifié de Twitter avec gestion des tweets, likes, retweets, profils utilisateurs, abonnements et timeline en temps réel (Socket.io). L’authentification est gérée par JWT et les données sont stockées dans MongoDB.',
        technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB'], userId: 10, status: 'public', imageUrl: 'assets/twitter-clone.png', date: '2024',
        liens: [
          { type: 'github', url: 'https://github.com/example/twitter-clone' },
          { type: 'demoweb', url: 'https://twitter-clone.demo.com' }
        ]
      },
      // 15 public
      {
        id: 15, titre: 'Application de notes', description: 'Prise de notes',
        fullDescription: 'Application de prise de notes avec catégories, recherche, éditeur de texte enrichi, export PDF et sauvegarde automatique dans IndexedDB. Les notes sont stockées localement et peuvent être partagées par lien.',
        technologies: ['Vue.js', 'IndexedDB', 'Vuex'], userId: 11, status: 'public', imageUrl: 'assets/notes.png', date: '2023',
        liens: [
          { type: 'github', url: 'https://github.com/example/notes' },
          { type: 'demoweb', url: 'https://notes.demo.com' }
        ]
      },
      // 16 public
      {
        id: 16, titre: 'Portfolio Photographe', description: 'Galerie photo',
        fullDescription: 'Galerie photo animée avec lightbox, filtre par catégorie, téléchargement en haute résolution et formulaire de contact pour devis. Les animations sont réalisées avec GSAP et le formulaire utilise EmailJS pour l’envoi des messages.',
        technologies: ['React', 'GSAP', 'EmailJS'], userId: 12, status: 'public', imageUrl: 'assets/photography.png', date: '2023',
        liens: [
          { type: 'github', url: 'https://github.com/example/photography' },
          { type: 'demoweb', url: 'https://photography.demo.com' }
        ]
      },
      // 17 public
      {
        id: 17, titre: 'Gestion de tâches (Trello like)', description: 'Kanban',
        fullDescription: 'Application de gestion de tâches en style Kanban avec glisser-déposer (Dragula), création de tableaux/colonnes/cartes, assignation de membres, dates d’échéance et commentaires. L’état est géré avec NgRx et les données sont sauvegardées dans une API REST.',
        technologies: ['Angular', 'NgRx', 'Dragula'], userId: 13, status: 'public', imageUrl: 'assets/trello-like.png', date: '2024',
        liens: [
          { type: 'github', url: 'https://github.com/example/trello-like' },
          { type: 'demoweb', url: 'https://trello-like.demo.com' }
        ]
      },
      // 18 draft
      {
        id: 18, titre: 'Site de réservation de voyages', description: 'Réservation hôtels',
        fullDescription: 'Plateforme de réservation d’hôtels avec recherche avancée (dates, nombre de personnes, filtres), paiement sécurisé (Stripe), avis clients et carte interactive des établissements. Le backend est en Node.js/Express et MongoDB.',
        technologies: ['Angular', 'Express', 'MongoDB', 'Stripe'], userId: 14, status: 'draft', imageUrl: 'assets/travel-booking.png', date: '2024',
        liens: [
          { type: 'github', url: 'https://github.com/example/travel-booking' },
          { type: 'demoweb', url: 'https://travel-booking.demo.com' }
        ]
      },
      // 19 public
      {
        id: 19, titre: 'Application météo (version Flutter)', description: 'Météo mobile',
        fullDescription: 'Version mobile (Flutter) de l’application météo. Elle utilise l’API OpenWeatherMap, la géolocalisation, et affiche les icônes météo dynamiques, les prévisions sur 7 jours et permet de sauvegarder des villes favorites via SharedPreferences.',
        technologies: ['Flutter', 'OpenWeatherMap', 'SharedPreferences'], userId: 3, status: 'public', imageUrl: 'assets/flutter-weather.png', date: '2024',
        liens: [
          { type: 'github', url: 'https://github.com/example/flutter-weather' },
          { type: 'demoweb', url: 'https://flutter-weather.demo.com' }
        ]
      },
      // 20 public
      {
        id: 20, titre: 'Plateforme de cours en ligne', description: 'E-learning',
        fullDescription: 'Plateforme e-learning proposant des modules vidéo, des quiz interactifs, le suivi de progression de l’utilisateur et la génération de certificats PDF. Un forum de discussion est intégré. Le backend utilise Node.js, MySQL et AWS S3 pour le stockage des vidéos.',
        technologies: ['React', 'Node.js', 'MySQL', 'AWS S3'], userId: 15, status: 'public', imageUrl: 'assets/elearning.png', date: '2025',
        liens: [
          { type: 'github', url: 'https://github.com/example/elearning' },
          { type: 'demoweb', url: 'https://elearning.demo.com' }
        ]
      }
    ];
  }

  private saveToLocal(): void {
    this.storage.set('projects', this.projects);
  }

  getProjects(): Project[] {
    return this.projects;
  }

  getPublicProjects(): Project[] {
    return this.projects.filter(p => p.status === 'public');
  }

  getProjectsByUserId(userId: number): Project[] {
    return this.projects.filter(p => p.userId === userId);
  }

  getPublicProjectsByUserId(userId: number): Project[] {
    return this.projects.filter(p => p.userId === userId && p.status === 'public');
  }

  getProjectById(id: number): Project | undefined {
    return this.projects.find(p => p.id === id);
  }

  addProject(project: Omit<Project, 'id'>): void {
    const newId = Date.now();
    this.projects.push({ ...project, id: newId });
    this.saveToLocal();
  }

  updateProject(id: number, updated: Project): void {
    const index = this.projects.findIndex(p => p.id === id);
    if (index !== -1) {
      this.projects[index] = updated;
      this.saveToLocal();
    }
  }

  deleteProject(id: number): void {
    this.projects = this.projects.filter(p => p.id !== id);
    this.saveToLocal();
  }

  deleteProjectsByUserId(userId: number): void {
    this.projects = this.projects.filter(p => p.userId !== userId);
    this.saveToLocal();
  }
}