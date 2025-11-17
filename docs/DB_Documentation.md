# 🗄️ Documentation de la Base de Données EFFETGRAFF

**Technologie :** PostgreSQL 15+ (via Supabase)
**Version :** 2.0
**Dernière mise à jour :** Novembre 2024
**Mainteneur :** Équipe EFFETGRAFF

## 📋 Table des Matières

- [Introduction](#-introduction)
- [Vue d'Ensemble](#-vue-densemble)
- [Schéma Relationnel](#-schéma-relationnel)
- [Sécurité et Permissions (RLS)](#-sécurité-et-permissions-rls)
- [Diagramme Entité-Relations](#-diagramme-entité-relations)
- [Cas d'Usage](#-cas-dusage)
- [Maintenance et Optimisation](#-maintenance-et-optimisation)
- [Migration et Évolution](#-migration-et-évolution)

---

## 🎯 Introduction

Cette documentation décrit le schéma complet de la base de données PostgreSQL utilisée pour le projet EFFETGRAFF. La conception suit les principes de :

- ✅ **Normalisation relationnelle** : Minimiser la redondance et garantir l'intégrité
- ✅ **Sécurité par conception** : Row Level Security (RLS) intégrée
- ✅ **Performance** : Indexation stratégique et optimisation des requêtes
- ✅ **Extensibilité** : Architecture modulaire pour évoluer facilement
- ✅ **Traçabilité** : Audit logging de toutes les modifications importantes

### Pourquoi PostgreSQL via Supabase ?

| Avantage | Description |
|----------|-------------|
| 🔒 **Sécurité Native** | Row Level Security (RLS) au niveau de la base de données |
| 🚀 **Performance** | Moteur PostgreSQL optimisé avec extensions modernes |
| 🔐 **Authentification Intégrée** | Auth service natif avec OAuth2 |
| 📦 **Stockage Unifié** | Storage service pour médias avec CDN |
| 🔄 **Real-time** | Subscriptions temps réel natives |
| 🛠️ **Tooling** | Dashboard web complet pour administration |
| 💰 **Coût** | Tier gratuit généreux pour démarrer |

---

## 📊 Vue d'Ensemble

### Architecture Générale

```
┌─────────────────────────────────────────────────────────────┐
│                    COUCHE UTILISATEUR                        │
│         (Artistes, Staff, Bénévoles, Public)                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              SUPABASE AUTH & API LAYER                       │
│    • Authentification OAuth2 (Google, GitHub, etc.)          │
│    • JWT Token Management                                    │
│    • Row Level Security (RLS) Enforcement                    │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  POSTGRESQL DATABASE                         │
│  ┌───────────────┐  ┌─────────────┐  ┌──────────────┐      │
│  │   Tables      │  │   Policies  │  │   Functions  │      │
│  │  Principales  │  │     RLS     │  │  & Triggers  │      │
│  └───────────────┘  └─────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                 SUPABASE STORAGE                             │
│         (Images, Vidéos, Documents)                          │
└─────────────────────────────────────────────────────────────┘
```

### Statistiques du Schéma

- **Tables principales** : 6 (personnes, editions, fresques, lieux, partenaires, badges)
- **Tables de liaison** : 6 (relations many-to-many)
- **Tables d'enrichissement** : 3 (media, logs, hashtags)
- **Total** : **15 tables**
- **Fonctions SQL** : 2+ (get_user_role, triggers)
- **Politiques RLS** : 20+ (sécurité granulaire)

---

## 🏗️ Schéma Relationnel

Le schéma est organisé autour de **5 entités principales**, liées par des **tables pivots** pour gérer les relations de type plusieurs-à-plusieurs (N-N).

### 2.1. Tables Principales

#### 📋 Table `personnes`

**Rôle** : Catalogue universel de tous les individus participant au festival (artistes, staff, bénévoles, partenaires, etc.).

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Identifiant unique |
| `auth_user_id` | UUID | UNIQUE, REFERENCES auth.users(id) | Lien avec Supabase Auth |
| `type` | TEXT | NOT NULL, CHECK IN (...) | Type : 'artiste', 'staff', 'benevole', 'partenaire', 'autre' |
| `nom` | TEXT | | Nom de famille |
| `prenom` | TEXT | | Prénom |
| `nom_artiste` | TEXT | | Nom de scène / pseudonyme artistique |
| `bio` | TEXT | | Biographie / présentation |
| `email` | TEXT | UNIQUE | Email de contact |
| `telephone` | TEXT | | Numéro de téléphone |
| `site_web` | TEXT | | URL du site web personnel |
| `reseaux_sociaux` | JSONB | | { "instagram": "@...", "twitter": "@..." } |
| `statut_profil` | TEXT | NOT NULL, DEFAULT 'en_attente' | 'en_attente', 'approuve', 'rejete' |
| `onboarding_complete` | BOOLEAN | DEFAULT FALSE | Profil complété ? |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Date de création |
| `updated_at` | TIMESTAMPTZ | DEFAULT now() | Dernière modification |

**Commentaire** : Cette table est centrale. Elle permet l'onboarding des utilisateurs et la validation par les admins avant l'accès complet.

**Exemple de données** :
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "auth_user_id": "123e4567-e89b-12d3-a456-426614174000",
  "type": "artiste",
  "nom": "Banksy",
  "prenom": null,
  "nom_artiste": "Banksy",
  "bio": "Artiste de street art anonyme britannique...",
  "email": "contact@banksy-art.uk",
  "reseaux_sociaux": {
    "instagram": "@banksy",
    "website": "https://www.banksy.co.uk"
  },
  "statut_profil": "approuve",
  "onboarding_complete": true
}
```

#### 📅 Table `editions`

**Rôle** : Représente chaque édition annuelle du festival EFFETGRAFF avec ses métadonnées.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Identifiant unique |
| `annee` | INT | NOT NULL, UNIQUE | Année de l'édition (ex: 2024) |
| `theme` | TEXT | | Thématique de l'édition |
| `date_debut` | DATE | NOT NULL | Date de début du festival |
| `date_fin` | DATE | NOT NULL | Date de fin du festival |
| `statut` | TEXT | NOT NULL, DEFAULT 'planifiee' | 'planifiee', 'en_cours', 'terminee', 'annulee' |
| `description` | TEXT | | Description longue de l'édition |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Date de création de l'enregistrement |

**Exemple de données** :
```sql
INSERT INTO editions (annee, theme, date_debut, date_fin, statut, description) VALUES
(2024, 'Urban Renaissance', '2024-06-15', '2024-06-17', 'terminee', 
 'Première édition du festival EFFETGRAFF célébrant le renouveau de l''art urbain post-pandémie.');
```

#### 🎨 Table `fresques`

**Rôle** : Catalogue complet des œuvres d'art créées pendant le festival.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Identifiant unique |
| `titre` | TEXT | NOT NULL | Titre de la fresque |
| `description` | TEXT | | Description et contexte |
| `technique` | TEXT | | Technique utilisée (spray, pochoir, mosaïque...) |
| `dimensions` | TEXT | | Dimensions (ex: "5m x 3m") |
| `date_creation` | DATE | | Date de création |
| `statut` | TEXT | DEFAULT 'en_cours' | 'en_cours', 'terminee', 'detruite', 'restauree' |
| `notes` | TEXT | | Notes diverses |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Date de création de l'enregistrement |
| `updated_at` | TIMESTAMPTZ | DEFAULT now() | Dernière modification |

**Cas d'usage** : Permet de documenter l'évolution d'une fresque dans le temps (création → terminée → éventuellement détruite).

#### 📍 Table `lieux`

**Rôle** : Emplacements physiques des fresques (murs, bâtiments, espaces publics).

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Identifiant unique |
| `nom` | TEXT | NOT NULL | Nom du lieu (ex: "Mur du Centre Culturel") |
| `adresse` | TEXT | | Adresse complète |
| `coordonnees_gps` | POINT | | Coordonnées GPS (latitude, longitude) |
| `description` | TEXT | | Description du lieu |
| `type_lieu` | TEXT | | Type (ex: "mur", "facade", "sol", "mobilier urbain") |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Date de création |

**Note sur GPS** : Le type `POINT` permet des requêtes géospatiales natives PostgreSQL (ex: trouver les fresques à proximité).

**Exemple** :
```sql
INSERT INTO lieux (nom, adresse, coordonnees_gps, type_lieu) VALUES
('Mur du Centre Culturel', '123 Rue de l''Art, 75001 Paris', 
 POINT(48.8566, 2.3522), 'mur');
```

#### 🤝 Table `partenaires`

**Rôle** : Liste des organisations partenaires (sponsors, institutions, médias).

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Identifiant unique |
| `nom` | TEXT | NOT NULL | Nom de l'organisation |
| `type_partenaire` | TEXT | | 'sponsor', 'institution', 'media', 'fournisseur' |
| `description` | TEXT | | Présentation du partenaire |
| `logo_url` | TEXT | | URL du logo (Supabase Storage) |
| `site_web` | TEXT | | Site web du partenaire |
| `contact_personne_id` | UUID | REFERENCES personnes(id) | Personne de contact |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Date de création |

#### 🏅 Table `badges`

**Rôle** : Système de badges numériques attribués aux membres validés du festival.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Identifiant unique |
| `personne_id` | UUID | UNIQUE, NOT NULL, REFERENCES personnes(id) | Lien vers la personne |
| `numero_badge` | TEXT | UNIQUE | Numéro unique du badge (ex: "ART-2024-001") |
| `date_emission` | DATE | DEFAULT CURRENT_DATE | Date d'émission |
| `date_expiration` | DATE | | Date d'expiration (optionnelle) |
| `actif` | BOOLEAN | DEFAULT TRUE | Badge actif ? |

**Cas d'usage** : Badges physiques ou numériques pour accès aux zones staff, backstage, etc.

---

### 2.2. Tables de Liaison (Tables Pivots)

Ces tables gèrent les relations **N-N** (plusieurs-à-plusieurs) entre les entités principales.


#### 🔗 Table `edition_personne`

**Relation** : Personnes impliquées dans une édition spécifique avec leur rôle.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `edition_id` | UUID | REFERENCES editions(id) | Édition concernée |
| `personne_id` | UUID | REFERENCES personnes(id) | Personne impliquée |
| `role` | TEXT | | Rôle dans cette édition (ex: 'artiste', 'organisateur', 'benevole') |
| PRIMARY KEY | (edition_id, personne_id) | | Contrainte composite |

**Exemple** : Lier l'artiste Banksy à l'édition 2024 en tant qu'artiste invité.

#### 🎨 Table `fresque_personne`

**Relation** : Artistes ayant participé à la création d'une fresque (collaboration possible).

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `fresque_id` | UUID | REFERENCES fresques(id) | Fresque concernée |
| `personne_id` | UUID | REFERENCES personnes(id) | Artiste contributeur |
| PRIMARY KEY | (fresque_id, personne_id) | | Contrainte composite |

**Cas d'usage** : Une fresque peut avoir plusieurs artistes, un artiste peut avoir créé plusieurs fresques.

#### 📅 Table `fresque_edition`

**Relation** : Édition(s) à laquelle appartient une fresque.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `fresque_id` | UUID | REFERENCES fresques(id) | Fresque concernée |
| `edition_id` | UUID | REFERENCES editions(id) | Édition concernée |
| PRIMARY KEY | (fresque_id, edition_id) | | Contrainte composite |

**Note** : Une fresque peut théoriquement être exposée dans plusieurs éditions (rétrospective, exposition permanente).

#### 📍 Table `fresque_lieu`

**Relation** : Emplacement(s) physique(s) d'une fresque.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `fresque_id` | UUID | REFERENCES fresques(id) | Fresque concernée |
| `lieu_id` | UUID | REFERENCES lieux(id) | Lieu où elle se trouve |
| PRIMARY KEY | (fresque_id, lieu_id) | | Contrainte composite |

**Note** : Permet de gérer les fresques déplacées ou en itinérance.

#### 🤝 Table `partenaire_edition`

**Relation** : Partenariats spécifiques à une édition.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `partenaire_id` | UUID | REFERENCES partenaires(id) | Partenaire |
| `edition_id` | UUID | REFERENCES editions(id) | Édition sponsorisée |
| `type_partenariat` | TEXT | | Nature du partenariat (ex: 'sponsor principal', 'sponsor média') |
| `montant` | DECIMAL(10,2) | | Montant de la contribution (optionnel) |
| PRIMARY KEY | (partenaire_id, edition_id) | | Contrainte composite |

#### 🏷️ Table `entite_hashtag`

**Relation** : Association polymorphique de tags à n'importe quelle entité.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `hashtag_id` | UUID | REFERENCES hashtags(id) | Tag concerné |
| `entite_type` | TEXT | NOT NULL | Type d'entité ('fresque', 'personne', 'edition', etc.) |
| `entite_id` | UUID | NOT NULL | ID de l'entité taguée |
| PRIMARY KEY | (hashtag_id, entite_type, entite_id) | | Contrainte composite |

**Cas d'usage** : Permet une taxonomie flexible. Ex: tag #streetart, #graffiti, #mural peuvent être appliqués à des fresques, artistes, etc.

---

### 2.3. Tables d'Enrichissement et d'Audit

#### 📸 Table `media`

**Rôle** : Métadonnées des fichiers médias (photos, vidéos, documents) liés aux entités.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Identifiant unique |
| `url_fichier` | TEXT | NOT NULL | URL du fichier dans Supabase Storage |
| `type_media` | TEXT | NOT NULL | 'image', 'video', 'document' |
| `titre` | TEXT | | Titre ou légende |
| `description` | TEXT | | Description du média |
| `entite_type` | TEXT | NOT NULL | Type d'entité liée ('fresque', 'personne', etc.) |
| `entite_id` | UUID | NOT NULL | ID de l'entité liée |
| `ordre` | INT | DEFAULT 0 | Ordre d'affichage dans une galerie |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Date d'upload |

**Important** : Les fichiers eux-mêmes sont stockés dans **Supabase Storage**, pas dans la BDD. Seules les métadonnées sont ici.

**Exemple** :
```sql
INSERT INTO media (url_fichier, type_media, titre, entite_type, entite_id) VALUES
('https://xxx.supabase.co/storage/v1/object/public/fresques-images/fresque-001.jpg',
 'image', 
 'Vue de face de la fresque', 
 'fresque', 
 '550e8400-e29b-41d4-a716-446655440000');
```

#### 📝 Table `logs`

**Rôle** : Audit trail de toutes les modifications importantes dans le système.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | BIGSERIAL | PRIMARY KEY | ID auto-incrémenté |
| `table_name` | TEXT | NOT NULL | Table concernée |
| `record_id` | UUID | NOT NULL | ID de l'enregistrement modifié |
| `action` | TEXT | NOT NULL | 'INSERT', 'UPDATE', 'DELETE' |
| `old_data` | JSONB | | Données avant modification (pour UPDATE/DELETE) |
| `new_data` | JSONB | | Nouvelles données (pour INSERT/UPDATE) |
| `user_id` | UUID | REFERENCES auth.users(id) | Utilisateur ayant effectué l'action |
| `timestamp` | TIMESTAMPTZ | DEFAULT now() | Date et heure de l'action |

**Cas d'usage** : Traçabilité complète, possibilité de rollback, analyse des changements.

**Exemple d'implémentation** :
```sql
-- Trigger pour logger automatiquement les modifications
CREATE OR REPLACE FUNCTION log_changes()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO logs (table_name, record_id, action, old_data, new_data, user_id)
  VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) ELSE NULL END,
    auth.uid()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Appliquer aux tables importantes
CREATE TRIGGER fresques_audit AFTER INSERT OR UPDATE OR DELETE ON fresques
FOR EACH ROW EXECUTE FUNCTION log_changes();
```

#### 🏷️ Table `hashtags`

**Rôle** : Liste unique et normalisée de tous les tags utilisés.

| Colonne | Type | Contraintes | Description |
|---------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Identifiant unique |
| `nom` | TEXT | NOT NULL, UNIQUE | Nom du hashtag (ex: "streetart") |
| `description` | TEXT | | Description du tag |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Date de création |

**Avantage** : Évite les doublons (ex: "streetart" vs "street-art" vs "StreetArt"). Permet des suggestions autocomplete.

---

## 🔐 Sécurité et Permissions (Row Level Security - RLS)

La sécurité est implémentée **directement au niveau de la base de données** via les politiques RLS de PostgreSQL, gérées par Supabase. Cela signifie que même si l'API backend est compromise, les données restent protégées.

### 3.1. Fonction de Rôle

La fonction `get_user_role()` extrait le rôle de l'utilisateur depuis le JWT token.

```sql
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN current_setting('request.jwt.claims', true)::jsonb->>'user_role';
EXCEPTION
  WHEN OTHERS THEN
    RETURN 'public';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;
```

**Note** : Le rôle doit être ajouté dans les `custom claims` du JWT par Supabase Auth. Les valeurs possibles sont : `'admin'`, `'staff'`, `'public'`.

### 3.2. Politiques RLS sur `personnes`

La table `personnes` est la plus sensible car elle contient les données personnelles.

#### Politique 1 : Accès Admin Total

```sql
CREATE POLICY "Admins have full access"
ON personnes
FOR ALL
USING (get_user_role() = 'admin');
```

**Effet** : Les admins peuvent tout faire (SELECT, INSERT, UPDATE, DELETE) sur tous les profils.

#### Politique 2 : Création de Son Propre Profil

```sql
CREATE POLICY "Users can create their own profile"
ON personnes
FOR INSERT
WITH CHECK (auth.uid() = auth_user_id);
```

**Effet** : Un utilisateur nouvellement authentifié peut créer **uniquement** son propre profil (où `auth_user_id` = son ID Supabase).

#### Politique 3 : Gestion de Son Propre Profil

```sql
CREATE POLICY "Users can manage their own profile"
ON personnes
FOR SELECT, UPDATE
USING (auth.uid() = auth_user_id);
```

**Effet** : Un utilisateur peut voir et modifier **uniquement** son propre profil (onboarding, mise à jour infos).

#### Politique 4 : Visibilité des Profils Approuvés

```sql
CREATE POLICY "Authenticated users can view approved profiles"
ON personnes
FOR SELECT
USING (
  auth.role() = 'authenticated' 
  AND statut_profil = 'approuve'
);
```

**Effet** : Tous les membres authentifiés peuvent voir les profils validés (annuaire d'artistes public interne).

#### Politique 5 : Staff Peut Valider les Profils

```sql
CREATE POLICY "Staff can validate profiles"
ON personnes
FOR UPDATE
USING (get_user_role() IN ('admin', 'staff'))
WITH CHECK (get_user_role() IN ('admin', 'staff'));
```

**Effet** : Le staff peut modifier le champ `statut_profil` pour approuver ou rejeter des profils.

### 3.3. Politiques sur les Données Publiques

#### Fresques et Éditions : Lecture Publique

```sql
-- Lecture publique pour tout le monde (même non authentifié)
CREATE POLICY "Public read access"
ON fresques
FOR SELECT
USING (true);

CREATE POLICY "Public read access"
ON editions
FOR SELECT
USING (true);
```

**Effet** : N'importe qui peut voir la galerie de fresques et l'historique des éditions (pas besoin de compte).

#### Fresques et Éditions : Écriture Restreinte

```sql
-- Seuls les admins et staff peuvent créer/modifier/supprimer
CREATE POLICY "Staff and admins can write"
ON fresques
FOR INSERT, UPDATE, DELETE
USING (get_user_role() IN ('admin', 'staff'))
WITH CHECK (get_user_role() IN ('admin', 'staff'));

CREATE POLICY "Staff and admins can write"
ON editions
FOR INSERT, UPDATE, DELETE
USING (get_user_role() IN ('admin', 'staff'))
WITH CHECK (get_user_role() IN ('admin', 'staff'));
```

**Effet** : Seuls les membres du staff et admins peuvent gérer le contenu du festival.

### 3.4. Politiques sur les Médias

```sql
-- Lecture publique des médias liés aux fresques publiques
CREATE POLICY "Public can view media"
ON media
FOR SELECT
USING (true);

-- Membres authentifiés peuvent uploader des médias
CREATE POLICY "Authenticated users can upload media"
ON media
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Seul le créateur ou staff/admin peut supprimer un média
CREATE POLICY "Owner or staff can delete media"
ON media
FOR DELETE
USING (
  auth.uid() IN (
    SELECT auth_user_id FROM personnes WHERE id = 
      (SELECT entite_id FROM media WHERE media.id = media.id)
  )
  OR get_user_role() IN ('admin', 'staff')
);
```

### 3.5. Activer RLS sur Toutes les Tables

**Important** : RLS doit être activé explicitement sur chaque table :

```sql
ALTER TABLE personnes ENABLE ROW LEVEL SECURITY;
ALTER TABLE editions ENABLE ROW LEVEL SECURITY;
ALTER TABLE fresques ENABLE ROW LEVEL SECURITY;
ALTER TABLE lieux ENABLE ROW LEVEL SECURITY;
ALTER TABLE partenaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
-- ... etc pour toutes les tables
```

---

## 📐 Diagramme Entité-Relations

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│  personnes  │◄───────►│ edition_     │◄───────►│  editions   │
│             │         │   personne   │         │             │
│ • id (PK)   │         └──────────────┘         │ • id (PK)   │
│ • nom       │                                  │ • annee     │
│ • type      │         ┌──────────────┐         │ • theme     │
│ • statut    │◄───────►│  fresque_    │         │ • dates     │
└─────────────┘         │   personne   │         └─────────────┘
       │                └──────────────┘               │
       │                       │                       │
       │                       │                       │
       │                       ▼                       │
       │                ┌─────────────┐                │
       │                │  fresques   │◄───────────────┘
       │                │             │         (fresque_edition)
       │                │ • id (PK)   │
       │                │ • titre     │         ┌─────────────┐
       │                │ • technique │◄───────►│  fresque_   │
       │                │ • statut    │         │    lieu     │
       │                └─────────────┘         └─────────────┘
       │                       │                       │
       │                       │                       ▼
       │                       │                ┌─────────────┐
       │                       │                │    lieux    │
       │                       │                │             │
       │                       │                │ • id (PK)   │
       │                       │                │ • nom       │
       │                       │                │ • GPS       │
       │                       │                └─────────────┘
       │                       │
       │                       ▼
       │                ┌─────────────┐
       │                │    media    │
       │                │             │
       │                │ • id (PK)   │
       │                │ • url       │
       │                │ • entite_id │
       │                └─────────────┘
       │
       ▼
┌─────────────┐         ┌──────────────┐
│   badges    │         │  partenaires │
│             │         │              │
│ • id (PK)   │         │ • id (PK)    │
│ • personne  │         │ • nom        │
│ • numero    │         │ • type       │
└─────────────┘         └──────────────┘
                               │
                               │
                               ▼
                        ┌──────────────┐
                        │ partenaire_  │
                        │   edition    │
                        └──────────────┘
```

---

## 💼 Cas d'Usage

### Cas d'Usage 1 : Inscription d'un Nouvel Artiste

**Scénario** : Un artiste découvre EFFETGRAFF et souhaite rejoindre la communauté.

**Flux de données** :

1. **Authentification** (via Supabase Auth) :
```sql
-- L'utilisateur se connecte avec Google OAuth
-- Supabase Auth crée automatiquement un enregistrement dans auth.users
```

2. **Création du profil** (onboarding) :
```sql
INSERT INTO personnes (
  auth_user_id, type, nom, prenom, nom_artiste, 
  bio, email, reseaux_sociaux, statut_profil, onboarding_complete
) VALUES (
  'uuid-de-auth-users',  -- Lié au compte Supabase
  'artiste',
  'Dupont',
  'Marie',
  'MarieD Street',
  'Artiste de street art spécialisée dans les portraits muraux...',
  'marie.dupont@example.com',
  '{"instagram": "@mariedstreet", "website": "https://mariedstreet.com"}',
  'en_attente',  -- Attend validation
  true
);
```

3. **Validation par le staff** :
```sql
-- Un membre du staff review le profil et l'approuve
UPDATE personnes
SET statut_profil = 'approuve'
WHERE id = 'uuid-du-profil-marie';
```

4. **Attribution d'un badge** :
```sql
-- Création automatique d'un badge après approbation (via trigger ou API)
INSERT INTO badges (personne_id, numero_badge, date_emission)
VALUES ('uuid-du-profil-marie', 'ART-2024-042', CURRENT_DATE);
```

### Cas d'Usage 2 : Création d'une Fresque pendant le Festival

**Scénario** : Marie Dupont crée une fresque lors de l'édition 2024 d'EFFETGRAFF.

**Flux de données** :

1. **Création de la fresque** (par le staff) :
```sql
INSERT INTO fresques (titre, description, technique, dimensions, statut)
VALUES (
  'Espoir Urbain',
  'Portrait d''une jeune fille regardant vers l''avenir, symbolisant l''espoir.',
  'Spray paint, pochoirs multi-couches',
  '4m x 3m',
  'terminee'
) RETURNING id;  -- Récupère l'ID : let's say 'fresque-uuid-001'
```

2. **Association artiste ↔ fresque** :
```sql
INSERT INTO fresque_personne (fresque_id, personne_id)
VALUES ('fresque-uuid-001', 'uuid-du-profil-marie');
```

3. **Association fresque ↔ édition 2024** :
```sql
INSERT INTO fresque_edition (fresque_id, edition_id)
VALUES ('fresque-uuid-001', 'edition-2024-uuid');
```

4. **Association fresque ↔ lieu** :
```sql
-- La fresque est sur le "Mur du Centre Culturel"
INSERT INTO fresque_lieu (fresque_id, lieu_id)
VALUES ('fresque-uuid-001', 'lieu-centre-culturel-uuid');
```

5. **Ajout de photos** :
```sql
-- L'équipe upload des photos de la fresque
INSERT INTO media (url_fichier, type_media, titre, entite_type, entite_id, ordre)
VALUES
  ('https://xxx.supabase.co/.../espoir-urbain-1.jpg', 'image', 'Vue de face', 'fresque', 'fresque-uuid-001', 1),
  ('https://xxx.supabase.co/.../espoir-urbain-2.jpg', 'image', 'Détail du visage', 'fresque', 'fresque-uuid-001', 2),
  ('https://xxx.supabase.co/.../espoir-urbain-timelapse.mp4', 'video', 'Timelapse de création', 'fresque', 'fresque-uuid-001', 3);
```

6. **Ajout de hashtags** :
```sql
-- Créer les tags s'ils n'existent pas
INSERT INTO hashtags (nom) VALUES ('portrait'), ('streetart'), ('espoir')
ON CONFLICT (nom) DO NOTHING;  -- Ignore si déjà existant

-- Associer les tags à la fresque
INSERT INTO entite_hashtag (hashtag_id, entite_type, entite_id)
SELECT h.id, 'fresque', 'fresque-uuid-001'
FROM hashtags h
WHERE h.nom IN ('portrait', 'streetart', 'espoir');
```

### Cas d'Usage 3 : Recherche de Fresques par Tags

**Scénario** : Un visiteur du site recherche toutes les fresques avec le tag "portrait".

**Requête SQL** :
```sql
SELECT 
  f.id,
  f.titre,
  f.description,
  f.technique,
  array_agg(DISTINCT p.nom_artiste) AS artistes,
  array_agg(DISTINCT h.nom) AS tags,
  (SELECT json_agg(m) FROM media m WHERE m.entite_type = 'fresque' AND m.entite_id = f.id) AS medias
FROM fresques f
LEFT JOIN fresque_personne fp ON f.id = fp.fresque_id
LEFT JOIN personnes p ON fp.personne_id = p.id
LEFT JOIN entite_hashtag eh ON eh.entite_type = 'fresque' AND eh.entite_id = f.id
LEFT JOIN hashtags h ON eh.hashtag_id = h.id
WHERE f.id IN (
  SELECT eh2.entite_id
  FROM entite_hashtag eh2
  JOIN hashtags h2 ON eh2.hashtag_id = h2.id
  WHERE h2.nom = 'portrait' AND eh2.entite_type = 'fresque'
)
GROUP BY f.id
ORDER BY f.created_at DESC;
```

### Cas d'Usage 4 : Tableau de Bord Admin - Profils en Attente

**Scénario** : Le staff veut voir tous les profils en attente de validation.

**Requête SQL** :
```sql
SELECT 
  p.id,
  p.nom,
  p.prenom,
  p.nom_artiste,
  p.type,
  p.email,
  p.reseaux_sociaux,
  p.created_at,
  au.email AS auth_email,
  COUNT(m.id) AS nombre_medias
FROM personnes p
LEFT JOIN auth.users au ON p.auth_user_id = au.id
LEFT JOIN media m ON m.entite_type = 'personne' AND m.entite_id = p.id
WHERE p.statut_profil = 'en_attente'
GROUP BY p.id, au.email
ORDER BY p.created_at ASC;
```

### Cas d'Usage 5 : Statistiques d'une Édition

**Scénario** : Générer les stats de l'édition 2024 pour un rapport annuel.

**Requête SQL** :
```sql
SELECT 
  e.annee,
  e.theme,
  COUNT(DISTINCT fe.fresque_id) AS nombre_fresques,
  COUNT(DISTINCT ep.personne_id) FILTER (WHERE p.type = 'artiste') AS nombre_artistes,
  COUNT(DISTINCT ep.personne_id) FILTER (WHERE p.type = 'benevole') AS nombre_benevoles,
  COUNT(DISTINCT pe.partenaire_id) AS nombre_partenaires,
  COUNT(DISTINCT l.id) AS nombre_lieux,
  SUM(CASE WHEN f.statut = 'terminee' THEN 1 ELSE 0 END) AS fresques_terminees
FROM editions e
LEFT JOIN fresque_edition fe ON e.id = fe.edition_id
LEFT JOIN fresques f ON fe.fresque_id = f.id
LEFT JOIN edition_personne ep ON e.id = ep.edition_id
LEFT JOIN personnes p ON ep.personne_id = p.id
LEFT JOIN partenaire_edition pe ON e.id = pe.edition_id
LEFT JOIN fresque_lieu fl ON fe.fresque_id = fl.fresque_id
LEFT JOIN lieux l ON fl.lieu_id = l.id
WHERE e.annee = 2024
GROUP BY e.id;
```

---

## ⚡ Maintenance et Optimisation

### 4.1. Indexation Stratégique

Pour optimiser les performances, créez des index sur les colonnes fréquemment utilisées dans les WHERE, JOIN et ORDER BY.

```sql
-- Index sur les clés étrangères (important pour les JOINs)
CREATE INDEX idx_personnes_auth_user ON personnes(auth_user_id);
CREATE INDEX idx_fresque_personne_fresque ON fresque_personne(fresque_id);
CREATE INDEX idx_fresque_personne_personne ON fresque_personne(personne_id);
CREATE INDEX idx_media_entite ON media(entite_type, entite_id);

-- Index sur les colonnes de filtrage fréquent
CREATE INDEX idx_personnes_statut ON personnes(statut_profil);
CREATE INDEX idx_personnes_type ON personnes(type);
CREATE INDEX idx_fresques_statut ON fresques(statut);
CREATE INDEX idx_editions_annee ON editions(annee);
CREATE INDEX idx_hashtags_nom ON hashtags(nom);

-- Index sur les dates pour les tris chronologiques
CREATE INDEX idx_fresques_created_at ON fresques(created_at DESC);
CREATE INDEX idx_personnes_created_at ON personnes(created_at DESC);

-- Index géospatial pour les recherches de proximité
CREATE INDEX idx_lieux_gps ON lieux USING GIST(coordonnees_gps);

-- Index JSON pour recherche dans les réseaux sociaux
CREATE INDEX idx_personnes_reseaux ON personnes USING GIN(reseaux_sociaux);
```

**Impact** : Peut réduire les temps de requête de plusieurs secondes à quelques millisecondes sur de gros volumes.

### 4.2. Triggers Automatiques

#### Trigger pour `updated_at`

Mettre à jour automatiquement le champ `updated_at` lors des modifications :

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer aux tables concernées
CREATE TRIGGER update_personnes_updated_at 
  BEFORE UPDATE ON personnes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fresques_updated_at 
  BEFORE UPDATE ON fresques
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

#### Trigger pour Attribution Automatique de Badge

Attribuer un badge automatiquement quand un profil est approuvé :

```sql
CREATE OR REPLACE FUNCTION create_badge_on_approval()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.statut_profil = 'approuve' AND OLD.statut_profil != 'approuve' THEN
    INSERT INTO badges (personne_id, numero_badge, date_emission)
    VALUES (
      NEW.id,
      CONCAT(
        CASE NEW.type
          WHEN 'artiste' THEN 'ART'
          WHEN 'staff' THEN 'STF'
          WHEN 'benevole' THEN 'VOL'
          ELSE 'MBR'
        END,
        '-',
        EXTRACT(YEAR FROM CURRENT_DATE),
        '-',
        LPAD(nextval('badge_sequence')::TEXT, 4, '0')
      ),
      CURRENT_DATE
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer la séquence
CREATE SEQUENCE IF NOT EXISTS badge_sequence START 1;

-- Appliquer le trigger
CREATE TRIGGER create_badge_after_approval
  AFTER UPDATE ON personnes
  FOR EACH ROW
  WHEN (NEW.statut_profil = 'approuve' AND OLD.statut_profil != 'approuve')
  EXECUTE FUNCTION create_badge_on_approval();
```

### 4.3. Vues Matérialisées pour Performance

Pour les requêtes complexes fréquentes, créez des vues matérialisées :

```sql
-- Vue matérialisée : Statistiques par édition
CREATE MATERIALIZED VIEW stats_editions AS
SELECT 
  e.id AS edition_id,
  e.annee,
  e.theme,
  COUNT(DISTINCT fe.fresque_id) AS nb_fresques,
  COUNT(DISTINCT fp.personne_id) AS nb_artistes,
  COUNT(DISTINCT m.id) AS nb_medias
FROM editions e
LEFT JOIN fresque_edition fe ON e.id = fe.edition_id
LEFT JOIN fresque_personne fp ON fe.fresque_id = fp.fresque_id
LEFT JOIN media m ON m.entite_type = 'edition' AND m.entite_id = e.id
GROUP BY e.id;

-- Créer un index sur la vue
CREATE UNIQUE INDEX ON stats_editions(edition_id);

-- Rafraîchir la vue (à faire périodiquement, ex: daily cron)
REFRESH MATERIALIZED VIEW CONCURRENTLY stats_editions;
```

### 4.4. Nettoyage et Archivage

#### Archiver les Logs Anciens

```sql
-- Créer une table d'archive
CREATE TABLE logs_archive (LIKE logs INCLUDING ALL);

-- Déplacer les logs de plus d'un an
WITH moved AS (
  DELETE FROM logs
  WHERE timestamp < CURRENT_DATE - INTERVAL '1 year'
  RETURNING *
)
INSERT INTO logs_archive SELECT * FROM moved;
```

#### Supprimer les Médias Orphelins

```sql
-- Identifier les médias sans entité associée
SELECT m.* FROM media m
LEFT JOIN fresques f ON m.entite_type = 'fresque' AND m.entite_id = f.id
LEFT JOIN personnes p ON m.entite_type = 'personne' AND m.entite_id = p.id
WHERE f.id IS NULL AND p.id IS NULL;

-- Les supprimer (à faire avec précaution !)
-- DELETE FROM media WHERE id IN (...);
```

### 4.5. Monitoring et Alertes

#### Requêtes Utiles pour le Monitoring

```sql
-- Nombre de profils en attente de validation
SELECT COUNT(*) FROM personnes WHERE statut_profil = 'en_attente';

-- Taille de chaque table
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Requêtes les plus lentes (activer pg_stat_statements)
SELECT 
  query,
  calls,
  total_time / calls AS avg_time_ms,
  min_time,
  max_time
FROM pg_stat_statements
ORDER BY total_time DESC
LIMIT 10;
```

---

## 🔄 Migration et Évolution

### 5.1. Bonnes Pratiques de Migration

**Principe** : Toujours utiliser des migrations versionnées et testées.

**Exemple de structure** :
```
/migrations
  ├── 001_initial_schema.sql
  ├── 002_add_badges_table.sql
  ├── 003_add_media_order_column.sql
  └── 004_create_stats_view.sql
```

**Chaque migration doit** :
- ✅ Être idempotente (peut être exécutée plusieurs fois sans erreur)
- ✅ Inclure un rollback si possible
- ✅ Être testée sur une copie de la BDD de prod
- ✅ Être documentée avec un commentaire expliquant le "pourquoi"

**Exemple de migration** :
```sql
-- Migration 005: Ajouter un champ 'style_artistique' à la table fresques
-- Date: 2024-12-01
-- Auteur: Équipe EFFETGRAFF
-- Raison: Permettre une meilleure catégorisation des œuvres

-- Migration UP
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'fresques' AND column_name = 'style_artistique'
  ) THEN
    ALTER TABLE fresques 
    ADD COLUMN style_artistique TEXT;
    
    COMMENT ON COLUMN fresques.style_artistique IS 
      'Style artistique de la fresque (ex: graffiti, muralisme, pochoir)';
  END IF;
END $$;

-- Migration DOWN (rollback)
-- ALTER TABLE fresques DROP COLUMN IF EXISTS style_artistique;
```

### 5.2. Évolutions Futures Envisagées

**Version 2.1 (Q1 2025)** :
- [ ] Système de commentaires sur les fresques
- [ ] Notation et favoris par les utilisateurs
- [ ] Support multi-langue dans les contenus

**Version 3.0 (Q2 2025)** :
- [ ] Intégration de données de géolocalisation avancées (itinéraires, parcours)
- [ ] Système de messagerie interne entre membres
- [ ] API webhooks pour intégrations tierces

### 5.3. Backup et Restauration

**Backup Automatique Supabase** : Activé par défaut avec rétention de 7 jours (plan gratuit).

**Backup Manuel** :
```bash
# Dump complet de la BDD
pg_dump "postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres" \
  -Fc -f backup_$(date +%Y%m%d).dump

# Restauration
pg_restore -d "postgresql://..." backup_20241201.dump
```

**Backup Sélectif** (uniquement les tables publiques) :
```bash
pg_dump "postgresql://..." \
  -t public.personnes \
  -t public.fresques \
  -t public.editions \
  --data-only \
  > backup_data.sql
```

---

## 📚 Références et Ressources

### Documentation Officielle
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security (RLS) Guide](https://supabase.com/docs/guides/auth/row-level-security)

### Best Practices
- [Designing Data-Intensive Applications](https://dataintensive.net/) par Martin Kleppmann
- [Database Normalization](https://en.wikipedia.org/wiki/Database_normalization)
- [PostgreSQL Performance Optimization](https://wiki.postgresql.org/wiki/Performance_Optimization)

### Outils Utiles
- **TablePlus** : Client base de données GUI multiplateforme
- **DBeaver** : Client SQL open-source
- **pgAdmin** : Client officiel PostgreSQL
- **Postico** : Client PostgreSQL pour macOS

---

## 🆘 Support et Questions

### Problèmes Courants

**Q: Les politiques RLS bloquent mes requêtes même en tant qu'admin**
```sql
-- R: Vérifiez que le rôle est bien présent dans le JWT
SELECT get_user_role();  -- Devrait retourner 'admin'

-- Si null, vérifiez la configuration des custom claims dans Supabase
```

**Q: Comment désactiver temporairement RLS pour débugger ?**
```sql
-- Attention : Seulement pour développement local !
ALTER TABLE ma_table DISABLE ROW LEVEL SECURITY;

-- N'oubliez pas de réactiver :
ALTER TABLE ma_table ENABLE ROW LEVEL SECURITY;
```

**Q: Mes requêtes sont lentes, que faire ?**
```sql
-- Analysez le plan d'exécution
EXPLAIN ANALYZE SELECT ... ;

-- Vérifiez les index manquants
-- Consultez pg_stat_statements pour identifier les slow queries
```

### Obtenir de l'Aide

- 📖 [Documentation Complète](../GETTING_STARTED.md)
- 🐛 [Signaler un Bug](https://github.com/komythomas/Effet-Graff/issues)
- 💬 [Forum de Discussion](https://github.com/komythomas/Effet-Graff/discussions)
- 📧 Email : dev@effetgraff.com

---

<div align="center">

**Base de Données Maintenue avec ❤️ par l'Équipe EFFETGRAFF**

[⬆ Retour en haut](#-documentation-de-la-base-de-données-effetgraff)

</div>
