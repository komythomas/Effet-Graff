# Projet EFFETGRAFF : Plateforme Internationale d'Art Urbain

**Statut :** Initialisation du Développement
**Auteur :** Manus AI

## 1. Introduction

Ce projet est la plateforme numérique complète pour le festival international d'art urbain **EFFETGRAFF**. Il est conçu pour être à la fois une vitrine publique, une base de données historique et un outil de gestion interne pour les membres (Artistes, Staff, Bénévoles).

## 2. Architecture Technologique (Stack)

Le projet utilise une architecture moderne et découplée (Headless) :

| Composant | Technologie | Rôle |
| :--- | :--- | :--- |
| **Base de Données** | PostgreSQL / Supabase | Stockage des données, Authentification (Auth), Stockage de fichiers (Storage), Sécurité (RLS). |
| **Backend (API)** | FastAPI (Python) | Logique métier, API RESTful sécurisée. |
| **Frontend** | Next.js 16 (React) | Interface utilisateur, Rendu SSR/SSG, Expérience utilisateur. |
| **Design** | Tailwind CSS v4 | Design System et Styling. |

## 3. Démarrage Rapide

Pour lancer le projet, suivez les étapes de configuration pour chaque composant.

### 3.1. Configuration de la Base de Données (Supabase)

1.  Créez un nouveau projet Supabase.
2.  Configurez les fournisseurs OAuth (Google, GitHub, Discord, X) dans **Authentication -> Providers**.
3.  Exécutez le script `SQL_Schema.sql` dans le **SQL Editor** pour créer toutes les tables et les politiques RLS.
4.  Récupérez votre URL et votre clé Anon pour les variables d'environnement.

### 3.2. Lancement du Backend (FastAPI)

1.  Naviguez vers le dossier `backend/`.
2.  Créez un fichier `.env` avec vos clés Supabase (y compris le `JWT_SECRET`).
3.  Installez les dépendances : `pip install -r requirements.txt`
4.  Lancez l'API : `uvicorn app.main:app --reload`

### 3.3. Lancement du Frontend (Next.js)

1.  Naviguez vers le dossier `frontend/`.
2.  Créez un fichier `.env.local` avec vos clés Supabase publiques (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
3.  Installez les dépendances : `npm install` ou `pnpm install`
4.  Lancez l'application : `npm run dev` ou `pnpm dev`

## 4. Documentation Détaillée

Pour une compréhension approfondie de chaque partie du projet, veuillez consulter les documentations spécifiques :

*   **Base de Données :** [docs/DB_Documentation.md](docs/DB_Documentation.md)
*   **Backend & API :** [docs/Backend_API_Documentation.md](docs/Backend_API_Documentation.md)
*   **Frontend :** [docs/Frontend_Documentation.md](docs/Frontend_Documentation.md)

## 5. Gestion des Rôles et Permissions

Le projet implémente une gestion des rôles à plusieurs niveaux :

| Rôle | Accès Frontend | Accès Backend (API) | Droits BDD (RLS) |
| :--- | :--- | :--- | :--- |
| **Public** | Pages publiques (Lecture) | Lecture des données publiques. | Lecture des données publiques. |
| **Artiste/Bénévole** | Dashboard Utilisateur, Onboarding. | Lecture/Écriture de son propre profil. | Lecture/Écriture de son propre profil. |
| **Staff** | Dashboard Staff, Validation. | Accès en écriture aux données du festival (Fresques, Éditions, Personnes). | Accès en écriture aux données du festival. |
| **Admin** | Dashboard Admin, Validation. | Accès total (Admin). | Accès total (Admin). |

Le rôle `staff` est désormais intégré pour permettre la gestion des données sans avoir les droits d'administration complets sur le système.

---
**Avertissement :** Les clés secrètes et les variables d'environnement doivent être gérées avec soin et ne jamais être commises dans un dépôt public.
