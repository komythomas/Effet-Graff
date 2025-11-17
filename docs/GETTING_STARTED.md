# 🚀 Guide de Démarrage Complet - EFFETGRAFF

Bienvenue ! Ce guide vous accompagne pas à pas dans l'installation et la configuration de la plateforme EFFETGRAFF, que vous soyez développeur, artiste, membre du staff ou simplement curieux.

## 📋 Table des Matières

- [Prérequis](#-prérequis)
- [Installation Rapide (5 min)](#-installation-rapide-5-min)
- [Configuration Détaillée](#-configuration-détaillée)
- [Premiers Pas](#-premiers-pas)
- [Résolution de Problèmes](#-résolution-de-problèmes)
- [Prochaines Étapes](#-prochaines-étapes)

---

## ✅ Prérequis

Avant de commencer, assurez-vous d'avoir installé les outils suivants sur votre machine :

### Outils Obligatoires

| Outil | Version Minimale | Installation |
|-------|------------------|--------------|
| **Node.js** | 18.0+ | [nodejs.org](https://nodejs.org/) |
| **Python** | 3.9+ | [python.org](https://www.python.org/downloads/) |
| **Git** | 2.0+ | [git-scm.com](https://git-scm.com/) |

### Outils Recommandés

- **npm** ou **pnpm** (gestionnaire de paquets JavaScript)
- **pip** (gestionnaire de paquets Python, généralement inclus avec Python)
- **VS Code** avec les extensions : ESLint, Prettier, Python
- **Un navigateur moderne** (Chrome, Firefox, Edge, Safari)

### Comptes Nécessaires

- **Supabase** : [Créer un compte gratuit](https://supabase.com)
- **GitHub** : [Créer un compte](https://github.com/signup) (si vous souhaitez contribuer)

### Vérifier Votre Installation

Ouvrez un terminal et exécutez :

```bash
node --version    # Devrait afficher v18.0.0 ou supérieur
python --version  # Devrait afficher Python 3.9.0 ou supérieur
git --version     # Devrait afficher git version 2.x.x
npm --version     # Devrait afficher 8.x.x ou supérieur
```

---

## ⚡ Installation Rapide (5 min)

### Étape 1 : Cloner le Repository

```bash
git clone https://github.com/komythomas/Effet-Graff.git
cd Effet-Graff
```

### Étape 2 : Configurer Supabase

1. **Créer un projet Supabase** :
   - Allez sur [supabase.com](https://supabase.com)
   - Cliquez sur "New Project"
   - Remplissez les informations (nom, mot de passe BDD, région)
   - Attendez la création (~2 minutes)

2. **Récupérer vos clés** :
   - Dans le dashboard Supabase, allez dans **Settings → API**
   - Copiez :
     - `Project URL` (ex: `https://xxxxx.supabase.co`)
     - `anon public key` (commence par `eyJ...`)

3. **Configurer l'authentification** :
   - Allez dans **Authentication → Providers**
   - Activez les providers souhaités (Google, GitHub, Discord, X)
   - Configurez les OAuth selon la [documentation Supabase](https://supabase.com/docs/guides/auth/social-login)

4. **Créer les tables** :
   - Allez dans **SQL Editor**
   - Cliquez sur "New query"
   - Copiez tout le contenu de `/SQL_Schema.sql` (dans le repository)
   - Cliquez sur "Run" pour exécuter le script
   - ✅ Vous devriez voir les tables créées dans **Table Editor**

### Étape 3 : Configurer le Backend

```bash
cd backend

# Créer l'environnement virtuel
python -m venv venv

# Activer l'environnement virtuel
# Sur macOS/Linux :
source venv/bin/activate
# Sur Windows :
venv\Scripts\activate

# Installer les dépendances
pip install -r requirements.txt

# Créer le fichier .env
cat > .env << 'EOF'
SUPABASE_URL=https://VOTRE-PROJET.supabase.co
SUPABASE_KEY=votre-anon-key-ici
JWT_SECRET=votre-jwt-secret-ici
EOF
```

**Note** : Pour obtenir le `JWT_SECRET`, allez dans **Settings → API** dans Supabase et copiez le "JWT Secret".

### Étape 4 : Configurer le Frontend

```bash
cd ../frontend

# Installer les dépendances
npm install
# ou avec pnpm :
pnpm install

# Créer le fichier .env.local
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://VOTRE-PROJET.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-anon-key-ici
EOF
```

### Étape 5 : Lancer l'Application

**Terminal 1 - Backend** :
```bash
cd backend
source venv/bin/activate  # ou venv\Scripts\activate sur Windows
uvicorn app.main:app --reload
```

Vous devriez voir :
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

**Terminal 2 - Frontend** :
```bash
cd frontend
npm run dev
# ou : pnpm dev
```

Vous devriez voir :
```
  ▲ Next.js 16.x.x
  - Local:        http://localhost:3000
  - ready in XXXms
```

### Étape 6 : Tester l'Installation

Ouvrez votre navigateur et accédez à :

- 🎨 **Frontend** : http://localhost:3000
- 🔌 **API Backend** : http://localhost:8000
- 📚 **Documentation API** : http://localhost:8000/docs

✅ **Si vous voyez les pages se charger, félicitations ! L'installation est réussie !** 🎉

---

## 🔧 Configuration Détaillée

### Configuration de la Base de Données

#### Comprendre le Schéma

Le fichier `SQL_Schema.sql` crée :
- **Tables principales** : `personnes`, `editions`, `fresques`, `lieux`, `partenaires`
- **Tables de liaison** : `edition_personne`, `fresque_personne`, etc.
- **Tables d'enrichissement** : `media`, `logs`, `hashtags`, `badges`
- **Politiques RLS** : Sécurité au niveau des lignes
- **Fonctions** : `get_user_role()`, triggers pour `updated_at`

#### Vérifier l'Installation

Dans Supabase, allez dans **Table Editor**. Vous devriez voir toutes ces tables :

| Table | Description |
|-------|-------------|
| `personnes` | Artistes, staff, bénévoles |
| `editions` | Éditions du festival |
| `fresques` | Œuvres d'art |
| `lieux` | Emplacements des fresques |
| `partenaires` | Sponsors et partenaires |
| `badges` | Badges numériques |
| `media` | Photos et vidéos |
| `hashtags` | Tags |
| `logs` | Audit trail |

#### Données de Test (Optionnel)

Pour avoir des données de test, vous pouvez créer :

```sql
-- Insérer une édition test
INSERT INTO editions (annee, theme, date_debut, date_fin, statut, description)
VALUES (2024, 'Urban Renaissance', '2024-06-15', '2024-06-17', 'terminee', 'Première édition du festival');

-- Insérer un lieu test
INSERT INTO lieux (nom, adresse, description)
VALUES ('Mur du Centre Culturel', '123 Rue de l''Art, Paris', 'Grand mur face à la place');
```

### Configuration de l'Authentification

#### OAuth Providers

Pour chaque provider OAuth que vous souhaitez activer :

**Google :**
1. Créez un projet sur [Google Cloud Console](https://console.cloud.google.com)
2. Activez l'API "Google+ API"
3. Créez des credentials OAuth 2.0
4. Ajoutez les URLs de callback Supabase
5. Copiez Client ID et Client Secret dans Supabase

**GitHub :**
1. Allez dans **Settings → Developer settings → OAuth Apps**
2. Cliquez "New OAuth App"
3. Remplissez les informations avec l'URL callback Supabase
4. Copiez Client ID et Client Secret dans Supabase

**Discord & X (Twitter)** : Suivez des processus similaires sur leurs plateformes respectives.

#### URL de Callback

L'URL de callback Supabase est généralement :
```
https://VOTRE-PROJET.supabase.co/auth/v1/callback
```

### Configuration des Variables d'Environnement

#### Backend `.env`

```bash
# Supabase Configuration
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=super-secret-jwt-key-from-supabase

# API Configuration (optionnel)
API_HOST=0.0.0.0
API_PORT=8000
API_DEBUG=true

# CORS (optionnel - pour production)
ALLOWED_ORIGINS=http://localhost:3000,https://votre-domaine.com
```

#### Frontend `.env.local`

```bash
# Supabase Public Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# API Backend URL (optionnel si différent)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Analytics (optionnel)
# NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**⚠️ Important** :
- Ne committez **JAMAIS** les fichiers `.env` dans Git
- Les variables préfixées par `NEXT_PUBLIC_` sont exposées au client
- Gardez les clés secrètes côté serveur uniquement

### Configuration du Stockage (Supabase Storage)

Pour gérer les images et médias :

1. Dans Supabase, allez dans **Storage**
2. Créez un bucket `fresques-images` (public)
3. Créez un bucket `profils-images` (public ou privé selon besoins)
4. Configurez les politiques d'accès :

```sql
-- Autoriser la lecture publique des images de fresques
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'fresques-images');

-- Autoriser les membres authentifiés à uploader
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'fresques-images' 
  AND auth.role() = 'authenticated'
);
```

---

## 🎯 Premiers Pas

### 1. Créer Votre Premier Compte Utilisateur

1. Lancez l'application (frontend + backend)
2. Allez sur http://localhost:3000
3. Cliquez sur "Se connecter"
4. Choisissez un provider OAuth (ex: Google)
5. Autorisez l'application
6. Vous serez redirigé vers `/dashboard`

### 2. Compléter l'Onboarding

Au premier login, vous devez compléter votre profil :

1. **Type de compte** : Sélectionnez "Artiste", "Bénévole", etc.
2. **Informations personnelles** : Nom, prénom, bio
3. **Contact** : Email, téléphone (optionnel)
4. **Réseaux sociaux** : Instagram, site web, etc.
5. Cliquez sur "Terminer l'inscription"

Votre profil est créé avec le statut `en_attente` et attend validation.

### 3. Accorder les Droits Admin (Développement)

Pour tester les fonctionnalités admin en développement local :

**Dans Supabase SQL Editor** :
```sql
-- Trouver votre ID utilisateur
SELECT id, email FROM auth.users;

-- Mettre à jour votre profil comme admin
UPDATE personnes 
SET statut_profil = 'approuve'
WHERE auth_user_id = 'VOTRE-UUID-ICI';

-- Ajouter le rôle admin dans les claims JWT (via Supabase Dashboard)
-- Settings → Auth → Custom Claims (nécessite configuration avancée)
```

**Alternative** : Modifier temporairement le code pour bypass les checks admin en dev.

### 4. Explorer les Fonctionnalités

**En tant qu'utilisateur authentifié** :
- ✅ Voir votre dashboard personnel
- ✅ Modifier votre profil
- ✅ Parcourir la galerie publique des fresques

**En tant qu'admin/staff** :
- ✅ Valider des profils en attente
- ✅ Créer des fresques
- ✅ Gérer les éditions du festival
- ✅ Attribuer des badges

### 5. Tester l'API

Accédez à la documentation interactive Swagger :
http://localhost:8000/docs

Vous pouvez :
- 📖 Voir tous les endpoints disponibles
- 🧪 Tester les requêtes directement
- 🔐 Authentifier vos requêtes avec un token JWT

**Obtenir un token JWT** :
1. Connectez-vous sur le frontend
2. Ouvrez la console développeur (F12)
3. Dans l'onglet "Application" → "Local Storage"
4. Cherchez la clé liée à Supabase contenant le token
5. Copiez le `access_token`
6. Dans Swagger, cliquez "Authorize" et collez le token

---

## 🐛 Résolution de Problèmes

### Le Backend ne démarre pas

**Erreur** : `ModuleNotFoundError: No module named 'fastapi'`
```bash
# Solution : Assurez-vous que l'environnement virtuel est activé
cd backend
source venv/bin/activate  # ou venv\Scripts\activate
pip install -r requirements.txt
```

**Erreur** : `Could not connect to Supabase`
```bash
# Solution : Vérifiez vos variables d'environnement
cat .env  # Vérifiez que les clés sont correctes
# Testez la connexion dans Python :
python
>>> import os
>>> from dotenv import load_dotenv
>>> load_dotenv()
>>> print(os.getenv('SUPABASE_URL'))
```

### Le Frontend ne démarre pas

**Erreur** : `Module not found: Can't resolve '@supabase/...'`
```bash
# Solution : Réinstallez les dépendances
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Erreur** : `NEXT_PUBLIC_SUPABASE_URL is not defined`
```bash
# Solution : Créez le fichier .env.local
cd frontend
ls -la  # Vérifiez que .env.local existe
cat .env.local  # Vérifiez le contenu
# Redémarrez le serveur Next.js
npm run dev
```

### Les tables ne sont pas créées dans Supabase

**Problème** : Erreur lors de l'exécution du SQL
```sql
-- Solution : Exécutez le script par sections
-- 1. D'abord les tables principales
-- 2. Puis les tables de liaison
-- 3. Puis les fonctions et triggers
-- 4. Enfin les politiques RLS

-- Vérifiez la création :
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

### L'authentification OAuth ne fonctionne pas

**Problème** : Redirection échoue après login

1. Vérifiez les URLs de callback dans les consoles OAuth
2. Vérifiez que les providers sont activés dans Supabase
3. Vérifiez la route `/auth/callback` dans le frontend
4. Consultez les logs dans la console du navigateur

### Erreur de permission (403 Forbidden)

**Problème** : "You don't have permission to access this resource"

```sql
-- Solution : Vérifiez les politiques RLS
-- Désactivez temporairement RLS pour tester :
ALTER TABLE personnes DISABLE ROW LEVEL SECURITY;

-- Après tests, réactivez :
ALTER TABLE personnes ENABLE ROW LEVEL SECURITY;

-- Vérifiez votre rôle :
SELECT get_user_role();  -- Devrait retourner 'admin', 'staff', etc.
```

### Plus d'aide ?

- 📖 Consultez le [Guide de Dépannage Complet](./TROUBLESHOOTING.md)
- 💬 Posez votre question dans [GitHub Discussions](https://github.com/komythomas/Effet-Graff/discussions)
- 🐛 Signalez un bug dans [GitHub Issues](https://github.com/komythomas/Effet-Graff/issues)

---

## 🎓 Prochaines Étapes

Maintenant que votre environnement est configuré, vous pouvez :

### Pour les Développeurs
- 📚 Lire l'[Architecture du Système](./ARCHITECTURE.md)
- 🔧 Consulter la [Documentation API Complète](./API_REFERENCE.md)
- 💻 Lire le [Guide de Contribution](../CONTRIBUTING.md)
- 🧪 Écrire vos premiers tests
- 🚀 Créer votre première fonctionnalité

### Pour les Utilisateurs
- 👤 Compléter votre profil artiste
- 🎨 Explorer la galerie de fresques
- 📸 Ajouter vos œuvres (si staff/admin)
- 🤝 Découvrir la communauté

### Pour les Administrateurs
- 🛠️ Configurer l'environnement de production
- 📊 Mettre en place le monitoring
- 🔐 Réviser les politiques de sécurité
- 📈 Configurer les analytics

### Ressources Complémentaires

- [Guide Utilisateur](./USER_GUIDE.md) - Utiliser la plateforme au quotidien
- [Guide des Parties Prenantes](./STAKEHOLDER_GUIDE.md) - Pour sponsors et partenaires
- [Documentation Backend](./Backend_API_Documentation.md) - Détails techniques API
- [Documentation Frontend](./Frontend_Documentation.md) - Détails techniques UI
- [Documentation Base de Données](./DB_Documentation.md) - Schéma et tables

---

## 💡 Conseils & Astuces

### Productivité en Développement

```bash
# Utiliser nodemon pour auto-reload du backend Python
pip install nodemon
nodemon --exec uvicorn app.main:app

# Activer le TypeScript strict dans Next.js (tsconfig.json)
"strict": true

# Utiliser pnpm au lieu de npm (plus rapide)
npm install -g pnpm
pnpm install
```

### Déboguer Efficacement

**Backend (FastAPI)** :
```python
# Ajouter des logs
import logging
logging.basicConfig(level=logging.DEBUG)

# Utiliser le debugger Python
import pdb; pdb.set_trace()
```

**Frontend (Next.js)** :
```typescript
// Console.log enrichi
console.log('[DEBUG]', { user, data, state });

// React DevTools pour inspecter l'état
// Chrome Extension: React Developer Tools
```

### Base de Données

```bash
# Connectez-vous directement à votre BDD Postgres
psql "postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"

# Ou utilisez TablePlus, DBeaver, pgAdmin
```

---

<div align="center">

**🎉 Vous êtes prêt à contribuer à EFFETGRAFF ! 🎨**

[⬆ Retour en haut](#-guide-de-démarrage-complet---effetgraff)

</div>
