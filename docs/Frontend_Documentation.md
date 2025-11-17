# Documentation du Frontend EFFETGRAFF

**Technologies :** Next.js 16 (App Router), React, TypeScript, Tailwind CSS v4
**Version :** 2.0
**Auteur :** Manus AI

## 1. Architecture Frontend

Le frontend est une application Next.js utilisant l'**App Router** [1], ce qui permet de tirer parti des Server Components pour le rendu côté serveur (SSR) et la génération statique (SSG), optimisant ainsi la performance et le référencement (SEO).

### 1.1. Structure des Dossiers

| Dossier | Rôle |
| :--- | :--- |
| `app/` | Contient toutes les routes et les pages de l'application. |
| `app/(public)/` | Pages accessibles à tous (Galerie, Éditions, etc.). |
| `app/(auth)/` | Pages liées à l'authentification (login, callback). |
| `app/(dashboard)/` | Routes protégées nécessitant une connexion. |
| `components/` | Composants React réutilisables (UI et métier). |
| `lib/` | Fonctions utilitaires et clients externes (Supabase, API). |
| `middleware.ts` | Logique de protection des routes et de gestion de session. |

### 1.2. Stratégies de Rendu

| Stratégie | Utilisation | Avantages |
| :--- | :--- | :--- |
| **Server Components (SSR/SSG)** | Pages publiques (`/fresques`, `/editions`) et récupération de données initiales dans les dashboards. | Performance maximale, SEO optimisé, accès direct aux données Supabase sans passer par l'API (pour les données publiques). |
| **Client Components (CSR)** | Formulaires, gestion de l'état de l'interface utilisateur, interactions utilisateur (boutons de déconnexion, onboarding). | Interactivité et gestion de l'état local. |

## 2. Gestion de l'Authentification (Supabase SSR)

L'authentification est gérée par le package `@supabase/auth-helpers-nextjs` [2], garantissant une gestion sécurisée des sessions en environnement SSR.

### 2.1. Flux d'Authentification

1.  **Client Supabase** : Les clients `createSupabaseServerClient` et `createSupabaseClientComponent` sont définis dans `lib/supabase/` pour interagir avec Supabase en fonction du contexte (serveur ou client).
2.  **Middleware** : Le fichier `middleware.ts` intercepte toutes les requêtes. Il vérifie la session Supabase et redirige les utilisateurs non connectés vers `/login` s'ils tentent d'accéder à une route protégée (`/dashboard/*`).
3.  **Page de Connexion** : La page `/login` utilise des boutons pour initier le flux OAuth (Google, GitHub, Discord, X).
4.  **Callback** : La route handler `/auth/callback/route.ts` gère le retour de Supabase et échange le code d'autorisation contre une session, puis redirige vers `/dashboard`.

### 2.2. Onboarding Forcé

Après la connexion, l'utilisateur est redirigé vers `/dashboard`.

*   Le composant `app/(dashboard)/dashboard/page.tsx` vérifie si le champ `onboarding_complete` du profil utilisateur est `false`.
*   Si c'est le cas, il force une redirection vers la page `/dashboard/onboarding`.
*   La page d'onboarding soumet les données du profil via l'API FastAPI (`PUT /api/v1/personnes/me`) et marque `onboarding_complete` à `true`.

## 3. Design System (Tailwind CSS v4)

L'interface utilise **Tailwind CSS v4** [3] pour une approche "utility-first".

*   **Composants UI** : Les composants de base (Card, Button, Input) sont construits dans `components/ui/` en utilisant la librairie `class-variance-authority` (CVA) pour gérer les variantes de style de manière structurée.
*   **Thème** : Le fichier `app/globals.css` définit les variables CSS pour le thème (couleurs primaires, secondaires, etc.), permettant une personnalisation facile de l'identité visuelle du festival.

## 4. Pages Publiques

Les pages publiques sont conçues pour être rapides et optimisées pour le SEO en utilisant les Server Components pour la récupération des données.

| Page | Description | Source de Données |
| :--- | :--- | :--- |
| `/` | Page d'accueil, mise en avant des faits marquants du festival. | Statique + données Supabase (ex: compteurs). |
| `/fresques` | Galerie des œuvres. Utilise le composant `FresqueCard`. | Supabase (via `createSupabaseServerClient`). |
| `/fresques/[id]` | Détail d'une fresque, incluant les artistes et les informations techniques. | Supabase (via `createSupabaseServerClient`). |
| `/artistes` | Liste des artistes dont le profil est `approuve`. | Supabase (via `createSupabaseServerClient`). |

---
**Références :**
[1] Next.js App Router Documentation - [https://nextjs.org/docs/app][1]
[2] Supabase Auth Helpers for Next.js - [https://supabase.com/docs/guides/auth/auth-helpers/nextjs][2]
[3] Tailwind CSS Documentation - [https://tailwindcss.com/][3]

[1]: https://nextjs.org/docs/app
[2]: https://supabase.com/docs/guides/auth/auth-helpers/nextjs
[3]: https://tailwindcss.com/
