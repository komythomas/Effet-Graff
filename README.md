# 🎨 EFFETGRAFF - Plateforme Internationale d'Art Urbain

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status](https://img.shields.io/badge/Status-Active%20Development-brightgreen)](https://github.com/komythomas/Effet-Graff)
[![Contributors Welcome](https://img.shields.io/badge/Contributors-Welcome-blue)](./CONTRIBUTING.md)

**Une plateforme communautaire open-source pour célébrer, documenter et gérer le festival international d'art urbain EFFETGRAFF**

[🚀 Démarrage Rapide](#démarrage-rapide) • [📖 Documentation](#documentation) • [🤝 Contribuer](./CONTRIBUTING.md) • [💬 Communauté](#communauté)

</div>

---

## 📋 Table des Matières

- [À Propos](#-à-propos)
- [Pour Qui ?](#-pour-qui-)
- [Fonctionnalités](#-fonctionnalités)
- [Architecture Technique](#-architecture-technique)
- [Démarrage Rapide](#-démarrage-rapide)
- [Documentation](#-documentation)
- [Contribution](#-contribution)
- [Sécurité](#-sécurité)
- [Licence](#-licence)
- [Contact & Communauté](#-contact--communauté)

---

## 🎯 À Propos

**EFFETGRAFF** est bien plus qu'un simple site web - c'est une plateforme complète qui réunit tous les acteurs du festival international d'art urbain. Notre mission est de :

- 🌍 **Célébrer l'art urbain** : Mettre en valeur les œuvres et les artistes de street art du monde entier
- 📚 **Préserver l'histoire** : Constituer une archive vivante de toutes les éditions du festival
- 🤝 **Faciliter la collaboration** : Connecter artistes, staff, bénévoles, sponsors et partenaires
- 🔓 **Favoriser l'open source** : Offrir un outil réutilisable pour d'autres festivals culturels

### Vision

Créer un écosystème numérique transparent, accessible et communautaire qui permette à chaque partie prenante du festival de participer activement, que ce soit pour créer, organiser, soutenir ou simplement découvrir l'art urbain.

---

## 👥 Pour Qui ?

Cette plateforme est conçue pour servir **tous** les acteurs du festival EFFETGRAFF :

### 🎨 **Artistes** (Passés, Actuels & Futurs)
- Créez et gérez votre portfolio d'œuvres
- Partagez votre histoire et votre démarche artistique
- Connectez-vous avec d'autres artistes de la communauté
- Postulez pour les prochaines éditions
- Suivez l'évolution de vos créations

### 👔 **Staff & Organisateurs**
- Gérez les éditions du festival (planification, suivi, archivage)
- Validez et modérez les profils et contenus
- Organisez les fresques, lieux et événements
- Accédez aux outils de reporting et statistiques
- Coordonnez les équipes et ressources

### 🤝 **Bénévoles**
- Inscrivez-vous pour participer au festival
- Consultez votre planning et vos missions
- Découvrez les coulisses de l'événement
- Faites partie de la communauté

### 💼 **Sponsors & Partenaires**
- Découvrez les opportunités de partenariat
- Consultez l'historique et l'impact du festival
- Accédez aux métriques de visibilité
- Rencontrez les artistes et l'équipe

### 🌟 **Sympathisants & Public**
- Explorez la galerie complète des œuvres
- Découvrez les artistes et leur univers
- Planifiez votre visite du festival
- Suivez l'actualité et les prochaines éditions

### 💻 **Développeurs Open Source**
- Contribuez au code et aux fonctionnalités
- Adaptez la plateforme pour d'autres festivals
- Proposez des améliorations
- Participez à un projet à impact culturel

---

## ✨ Fonctionnalités

### 🌐 Espace Public
- **Galerie Interactive** : Parcourez toutes les œuvres avec filtres avancés (année, artiste, lieu, style)
- **Annuaire des Artistes** : Découvrez les profils complets des street artists
- **Historique du Festival** : Explorez chaque édition avec photos, statistiques et anecdotes
- **Carte Interactive** : Localisez les fresques dans la ville
- **Multilingue** : Interface en français et anglais

### 🔐 Espace Membre
- **Authentification Sécurisée** : Connexion via Google, GitHub, Discord ou X
- **Onboarding Guidé** : Processus d'inscription intuitif et personnalisé
- **Dashboard Personnalisé** : Vue adaptée selon votre rôle (artiste, bénévole, staff)
- **Gestion de Profil** : Mise à jour de vos informations et portfolio

### 🛠️ Outils de Gestion (Staff/Admin)
- **Validation de Profils** : Modération des inscriptions d'artistes et bénévoles
- **Gestion des Fresques** : Ajout, modification et documentation des œuvres
- **Planification d'Éditions** : Organisation des festivals avec dates, thèmes et participants
- **Système de Badges** : Attribution de badges numériques aux membres validés
- **Logs d'Audit** : Traçabilité complète des modifications

### 📱 Expérience Utilisateur
- **Responsive Design** : Interface optimisée pour tous les écrans (mobile, tablette, desktop)
- **Performance** : Rendu côté serveur (SSR) pour un chargement ultra-rapide
- **SEO Optimisé** : Référencement naturel pour maximiser la visibilité
- **Accessibilité** : Respect des normes WCAG pour l'inclusion

---

## 🏗️ Architecture Technique

### Stack Technologique

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND                            │
│  Next.js 16 (App Router) + React + TypeScript          │
│  Tailwind CSS v4 • Responsive • SSR/SSG                 │
└─────────────────────────────────────────────────────────┘
                         ↕ HTTPS
┌─────────────────────────────────────────────────────────┐
│                   BACKEND API                           │
│  FastAPI (Python) • RESTful • OpenAPI/Swagger           │
│  JWT Authentication • Role-Based Access Control         │
└─────────────────────────────────────────────────────────┘
                         ↕ SQL
┌─────────────────────────────────────────────────────────┐
│              DATABASE & SERVICES                        │
│  PostgreSQL (Supabase) • Row Level Security (RLS)       │
│  Auth Service • Storage Service • Real-time             │
└─────────────────────────────────────────────────────────┘
```

| Composant | Technologie | Pourquoi ce choix ? |
|-----------|-------------|---------------------|
| **Frontend** | Next.js 16 (React, TypeScript) | Performance SSR/SSG, SEO optimal, expérience utilisateur moderne |
| **Styling** | Tailwind CSS v4 | Rapidité de développement, design system cohérent, personnalisation facile |
| **Backend** | FastAPI (Python) | Performance élevée, documentation automatique, validation native des données |
| **Base de Données** | PostgreSQL via Supabase | Robustesse, sécurité RLS intégrée, authentification et stockage inclus |
| **Authentification** | Supabase Auth + OAuth2 | Multi-providers (Google, GitHub, Discord, X), sécurité enterprise-grade |
| **Stockage** | Supabase Storage | CDN intégré, gestion automatique des médias, optimisation d'images |

### Principes Architecturaux

- ✅ **Headless Architecture** : Découplage total frontend/backend pour une flexibilité maximale
- ✅ **API-First** : Toutes les fonctionnalités exposées via API REST documentée
- ✅ **Security by Design** : Row Level Security (RLS), validation des données, protection CSRF
- ✅ **Progressive Enhancement** : Fonctionnalité de base sans JavaScript, amélioration progressive
- ✅ **Cloud-Native** : Déploiement facile sur Vercel (frontend) et services cloud (backend)

---

## 🚀 Démarrage Rapide

### Prérequis

Avant de commencer, assurez-vous d'avoir installé :
- **Node.js** 18+ et **npm/pnpm** (pour le frontend)
- **Python** 3.9+ et **pip** (pour le backend)
- **Git** (pour cloner le repository)
- Un compte **Supabase** (gratuit pour commencer)

### Installation en 5 Minutes

#### 1️⃣ Cloner le Repository

```bash
git clone https://github.com/komythomas/Effet-Graff.git
cd Effet-Graff
```

#### 2️⃣ Configurer la Base de Données (Supabase)

1. Créez un nouveau projet sur [supabase.com](https://supabase.com)
2. Dans **Settings → API**, copiez votre `URL` et `anon key`
3. Dans **SQL Editor**, exécutez le contenu de `SQL_Schema.sql`
4. Dans **Authentication → Providers**, activez les fournisseurs OAuth souhaités (Google, GitHub, etc.)

#### 3️⃣ Configurer et Lancer le Backend

```bash
cd backend

# Créer l'environnement virtuel Python
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt

# Créer le fichier .env
cat > .env << EOF
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_KEY=votre-anon-key
JWT_SECRET=votre-jwt-secret-depuis-supabase-settings
EOF

# Lancer l'API
uvicorn app.main:app --reload
# API disponible sur http://localhost:8000
# Documentation Swagger sur http://localhost:8000/docs
```

#### 4️⃣ Configurer et Lancer le Frontend

```bash
cd frontend

# Installer les dépendances
npm install
# ou avec pnpm : pnpm install

# Créer le fichier .env.local
cat > .env.local << EOF
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-anon-key
EOF

# Lancer l'application
npm run dev
# ou avec pnpm : pnpm dev
# Application disponible sur http://localhost:3000
```

#### 5️⃣ Accéder à l'Application

Ouvrez votre navigateur et accédez à :
- **Frontend** : http://localhost:3000
- **API Backend** : http://localhost:8000
- **Documentation API** : http://localhost:8000/docs

🎉 **Félicitations !** Votre environnement de développement est prêt !

### Prochaines Étapes

- 📖 Consultez le [Guide de Démarrage Détaillé](./docs/GETTING_STARTED.md) pour plus d'informations
- 🎨 Explorez l'[interface utilisateur](http://localhost:3000)
- 🔧 Testez l'[API interactive](http://localhost:8000/docs)
- 💻 Lisez le [Guide de Contribution](./CONTRIBUTING.md) pour commencer à coder

---

## 📚 Documentation

Notre documentation complète est organisée par audience et par sujet :

### 🎓 Pour Bien Démarrer
- **[Guide de Démarrage Complet](./docs/GETTING_STARTED.md)** - Installation détaillée, configuration, premiers pas
- **[Guide Utilisateur](./docs/USER_GUIDE.md)** - Utiliser la plateforme (artistes, bénévoles, staff)
- **[Guide des Parties Prenantes](./docs/STAKEHOLDER_GUIDE.md)** - Information pour sponsors et partenaires

### 🏛️ Documentation Technique
- **[Architecture du Système](./docs/ARCHITECTURE.md)** - Vue d'ensemble, diagrammes, décisions techniques
- **[Documentation de la Base de Données](./docs/DB_Documentation.md)** - Schéma, tables, relations, RLS
- **[Documentation Backend/API](./docs/Backend_API_Documentation.md)** - Endpoints, authentification, validation
- **[Documentation Frontend](./docs/Frontend_Documentation.md)** - Composants, pages, routing, state management
- **[Référence API Complète](./docs/API_REFERENCE.md)** - Tous les endpoints avec exemples

### 🔒 Sécurité & Déploiement
- **[Guide de Sécurité](./docs/SECURITY.md)** - Politiques, bonnes pratiques, reporting
- **[Guide de Déploiement](./docs/DEPLOYMENT.md)** - Production, CI/CD, monitoring

### 🛠️ Maintenance & Support
- **[Guide de Dépannage](./docs/TROUBLESHOOTING.md)** - Problèmes courants et solutions
- **[FAQ](./docs/FAQ.md)** - Questions fréquemment posées

### 🌍 Langues
- 🇫🇷 Français (principal)
- 🇬🇧 English (translations in progress)

---

## 🤝 Contribution

Nous accueillons chaleureusement les contributions de la communauté ! Que vous soyez développeur, designer, rédacteur ou simplement passionné, il y a de nombreuses façons de participer.

### Comment Contribuer ?

1. 📖 **Lisez le [Guide de Contribution](./CONTRIBUTING.md)** - Tout ce qu'il faut savoir pour contribuer
2. 🐛 **Signalez des bugs** - Utilisez les [GitHub Issues](https://github.com/komythomas/Effet-Graff/issues)
3. 💡 **Proposez des fonctionnalités** - Partagez vos idées dans les Discussions
4. 🔧 **Corrigez des bugs** - Consultez les issues étiquetées `good first issue`
5. ✨ **Ajoutez des fonctionnalités** - Fork, développez, soumettez une Pull Request
6. 📝 **Améliorez la documentation** - Chaque clarification compte !
7. 🌍 **Traduisez** - Aidez-nous à rendre la plateforme accessible internationalement

### Code de Conduite

Nous nous engageons à offrir une expérience accueillante et inclusive. En participant, vous acceptez de respecter notre [Code de Conduite](./CODE_OF_CONDUCT.md).

### Gestion des Rôles et Permissions

Pour comprendre comment les différents rôles fonctionnent dans la plateforme :

| Rôle | Accès Frontend | Accès API | Accès Base de Données |
|------|----------------|-----------|----------------------|
| **Public** | Pages publiques (lecture seule) | Lecture données publiques | Lecture données publiques (RLS) |
| **Artiste/Bénévole** | Dashboard personnel + Onboarding | Lecture/Écriture profil personnel | Lecture/Écriture profil personnel |
| **Staff** | Dashboard staff + Validation | Gestion festival (fresques, éditions) | Écriture données festival |
| **Admin** | Dashboard admin + Validation | Accès total (administration) | Accès total (bypass RLS) |

Consultez la [documentation détaillée des rôles](./docs/USER_GUIDE.md#gestion-des-rôles) pour plus d'informations.

---

## 🔐 Sécurité

La sécurité est notre priorité absolue. Nous implémentons :

- 🔒 **Authentification sécurisée** via OAuth2 et JWT
- 🛡️ **Row Level Security (RLS)** au niveau de la base de données
- ✅ **Validation des données** à tous les niveaux (frontend, API, BDD)
- 🔑 **Gestion sécurisée des secrets** (jamais commitées dans le code)
- 📝 **Audit logging** de toutes les actions sensibles
- 🚨 **Protection CSRF/XSS** natives dans Next.js et FastAPI

### Signaler une Vulnérabilité

Si vous découvrez une faille de sécurité, **ne créez PAS d'issue publique**. Envoyez un email à [security@effetgraff.com](mailto:security@effetgraff.com) ou consultez notre [Politique de Sécurité](./docs/SECURITY.md).

---

## 📄 Licence

Ce projet est sous licence **MIT** - voir le fichier [LICENSE](./LICENSE) pour les détails.

En bref :
- ✅ Usage commercial autorisé
- ✅ Modification autorisée
- ✅ Distribution autorisée
- ✅ Usage privé autorisé
- ⚠️ Responsabilité limitée
- ⚠️ Aucune garantie

---

## 💬 Contact & Communauté

### 👤 Mainteneur Principal
**Komi Thomas Agboguin**
- 🐙 GitHub: [@komythomas](https://github.com/komythomas)
- 📧 Email: contact@effetgraff.com

### 🌐 Liens Utiles
- 🎨 **Site Web du Festival** : [www.effetgraff.com](https://www.effetgraff.com) (à venir)
- 📱 **Réseaux Sociaux** : [@effetgraff](https://instagram.com/effetgraff) sur Instagram
- 💬 **Discussions GitHub** : [GitHub Discussions](https://github.com/komythomas/Effet-Graff/discussions)
- 🐛 **Issues GitHub** : [GitHub Issues](https://github.com/komythomas/Effet-Graff/issues)

### 🙏 Remerciements

Un grand merci à tous les contributeurs, artistes, bénévoles et supporters qui font vivre ce projet et le festival EFFETGRAFF !

---

<div align="center">

**Fait avec ❤️ pour la communauté street art**

[⬆ Retour en haut](#-effetgraff---plateforme-internationale-dart-urbain)

</div>
