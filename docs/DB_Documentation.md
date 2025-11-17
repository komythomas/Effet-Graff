# Documentation de la Base de Données EFFETGRAFF

**Technologie :** PostgreSQL (via Supabase)
**Version :** 2.0
**Auteur :** Manus AI

## 1. Introduction

Cette documentation décrit le schéma de la base de données PostgreSQL utilisée pour le projet EFFETGRAFF. La conception est basée sur les principes de la normalisation relationnelle pour garantir l'intégrité des données, minimiser la redondance et optimiser les performances des requêtes.

## 2. Schéma Relationnel

Le schéma est organisé autour de cinq entités principales, liées par des tables pivots pour gérer les relations de type plusieurs-à-plusieurs.

### 2.1. Tables Principales

| Nom de la Table | Rôle | Clé Primaire | Notes |
| :--- | :--- | :--- | :--- |
| `personnes` | Catalogue de tous les individus (Artistes, Staff, Bénévoles, etc.). | `id` (UUID) | Lien avec `auth.users` via `auth_user_id`. Gère le statut de validation du profil. |
| `editions` | Détails de chaque édition annuelle du festival. | `id` (UUID) | Contient l'année, le thème, les dates et le statut. |
| `fresques` | Catalogue des œuvres d'art créées. | `id` (UUID) | Contient les détails techniques, les dimensions et le statut de l'œuvre. |
| `lieux` | Emplacements physiques des œuvres (murs, sites). | `id` (UUID) | Inclut les coordonnées GPS pour la géolocalisation. |
| `partenaires` | Liste des organisations et sponsors. | `id` (UUID) | Lien optionnel vers une `personne` contact. |
| `badges` | Enregistrement des badges numériques/physiques attribués aux membres validés. | `id` (UUID) | Lien unique vers `personne_id`. |

### 2.2. Tables de Liaison (Tables Pivots)

Ces tables gèrent les relations N-N (plusieurs-à-plusieurs).

| Nom de la Table | Clés Étrangères | Relation Gérée |
| :--- | :--- | :--- |
| `edition_personne` | `edition_id`, `personne_id` | Personnes impliquées dans une édition spécifique (avec un rôle). |
| `fresque_personne` | `fresque_id`, `personne_id` | Artistes ayant participé à la création d'une fresque. |
| `fresque_edition` | `fresque_id`, `edition_id` | L'édition à laquelle appartient une fresque. |
| `fresque_lieu` | `fresque_id`, `lieu_id` | L'emplacement physique d'une fresque. |
| `partenaire_edition` | `partenaire_id`, `edition_id` | Partenariats spécifiques à une édition. |
| `entite_hashtag` | `hashtag_id`, `fresque_id`, etc. | Association de tags à n'importe quelle entité. |

### 2.3. Tables d'Enrichissement et d'Audit

| Nom de la Table | Rôle | Notes |
| :--- | :--- | :--- |
| `media` | Stockage des métadonnées des fichiers (photos, vidéos). | Utilise `url_fichier` pour pointer vers Supabase Storage. Liens polymorphiques vers les entités principales. |
| `logs` | Audit des modifications importantes. | Utilise `BIGSERIAL` pour la clé primaire. |
| `hashtags` | Liste unique des tags. | Permet une taxonomie cohérente. |

## 3. Sécurité et Permissions (Row Level Security - RLS)

La sécurité est implémentée directement au niveau de la base de données via les politiques RLS de PostgreSQL, gérées par Supabase.

### 3.1. Fonction de Rôle

La fonction `get_user_role()` est utilisée pour lire le rôle (`admin`, `staff`, `public`) depuis le token JWT de l'utilisateur.

```sql
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN current_setting('request.jwt.claims', true)::jsonb->>'user_role';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 3.2. Politiques Clés sur la table `personnes`

| Politique | Accès | Condition | Objectif |
| :--- | :--- | :--- | :--- |
| **Admins** | ALL | `get_user_role() = 'admin'` | Accès complet pour la gestion du système. |
| **Création** | INSERT | `auth.uid() = auth_user_id` | Un utilisateur ne peut créer que son propre profil. |
| **Auto-Gestion** | SELECT, UPDATE | `auth.uid() = auth_user_id` | Permet l'onboarding et la mise à jour de son profil. |
| **Visibilité** | SELECT | `statut_profil = 'approuve'` | Les profils validés sont visibles par tous les membres authentifiés. |

### 3.3. Politiques sur les Données Publiques

Les tables `fresques` et `editions` sont publiques en lecture (`FOR SELECT USING (true)`).

L'écriture (`INSERT`, `UPDATE`, `DELETE`) est restreinte aux rôles `admin` et `staff` (via une politique RLS qui vérifie `get_user_role() IN ('admin', 'staff')`).

## 4. Recommandations d'Implémentation

*   **Triggers :** Il est recommandé d'ajouter un trigger PostgreSQL pour mettre à jour automatiquement la colonne `updated_at` sur les tables principales lors de chaque `UPDATE`.
*   **Indexation :** Des index doivent être créés sur les colonnes fréquemment utilisées pour la recherche ou le filtrage (ex: `annee` sur `editions`, `nom_artiste` sur `personnes`).
*   **Stockage :** Les fichiers médias ne doivent pas être stockés directement dans la base de données. La table `media` ne stocke que les métadonnées et l'URL du fichier, le fichier lui-même étant géré par **Supabase Storage**.

---
**Référence :**
[1] Supabase Documentation: Row Level Security (RLS) - [https://supabase.com/docs/guides/auth/row-level-security][1]

[1]: https://supabase.com/docs/guides/auth/row-level-security
