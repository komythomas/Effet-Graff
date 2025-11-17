# 🔧 Guide de Dépannage EFFETGRAFF

**Résolution des Problèmes Courants**
**Version :** 2.0
**Dernière mise à jour :** Novembre 2024

## 📋 Table des Matières

- [Problèmes d'Installation](#-problèmes-dinstallation)
- [Problèmes d'Authentification](#-problèmes-dauthentification)
- [Problèmes Frontend](#-problèmes-frontend)
- [Problèmes Backend/API](#-problèmes-backendapi)
- [Problèmes Base de Données](#-problèmes-base-de-données)
- [Problèmes de Performance](#-problèmes-de-performance)
- [Erreurs Courantes](#-erreurs-courantes)
- [Obtenir de l'Aide](#-obtenir-de-laide)

---

## 🛠️ Problèmes d'Installation

### ❌ `node: command not found`

**Symptôme** : La commande `node` ou `npm` n'est pas reconnue.

**Solution** :
```bash
# Vérifier si Node.js est installé
which node

# Si non installé, télécharger depuis https://nodejs.org/
# Ou avec nvm (recommandé)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
node --version  # Devrait afficher v18.x.x
```

---

### ❌ `python: command not found`

**Symptôme** : Python n'est pas trouvé.

**Solution** :
```bash
# Sur macOS/Linux, essayez python3
python3 --version

# Créer un alias si nécessaire
alias python=python3
echo "alias python=python3" >> ~/.bashrc  # ou ~/.zshrc

# Ou installer Python depuis https://www.python.org/
```

---

### ❌ `pip install` échoue avec des erreurs de permissions

**Symptôme** : Erreur `Permission denied` lors de `pip install`.

**Solution** :
```bash
# ✅ Toujours utiliser un environnement virtuel
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# ❌ Ne jamais utiliser sudo pip
# sudo pip install ...  # NON !
```

---

### ❌ `npm install` échoue avec des erreurs

**Symptôme** : Erreurs lors de l'installation des dépendances npm.

**Solutions** :

**1. Nettoyer le cache npm**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**2. Vérifier la version de Node**
```bash
node --version  # Doit être >= 18.0.0
npm --version   # Doit être >= 8.0.0
```

**3. Utiliser pnpm (alternative)**
```bash
npm install -g pnpm
pnpm install
```

---

## 🔐 Problèmes d'Authentification

### ❌ OAuth Callback échoue (Erreur 400/404)

**Symptôme** : Après l'autorisation OAuth, erreur "Callback URL mismatch" ou 404.

**Solutions** :

**1. Vérifier les URLs de callback dans Supabase**
```
✅ URL correcte :
http://localhost:3000/auth/callback (dev)
https://votre-domaine.com/auth/callback (prod)

❌ URLs incorrectes :
http://localhost:3000/callback
http://localhost:3000/api/auth/callback
```

**2. Vérifier dans le provider OAuth**
- **Google** : Console Cloud → Credentials → OAuth 2.0 Client IDs
- **GitHub** : Settings → Developer settings → OAuth Apps
- Les URLs de callback doivent correspondre EXACTEMENT

**3. Vérifier le fichier callback route**
```typescript
// frontend/app/auth/callback/route.ts doit exister
export async function GET(request: Request) {
  // ...logic
}
```

---

### ❌ Token JWT invalide (401 Unauthorized)

**Symptôme** : Erreur 401 sur les requêtes API protégées.

**Solutions** :

**1. Vérifier que le token existe**
```typescript
// Dans la console du navigateur (F12)
localStorage.getItem('supabase.auth.token')
// Ou
document.cookie
```

**2. Vérifier l'expiration du token**
```typescript
// Décoder le JWT (sans vérification)
const token = "eyJ...";
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Expire à:', new Date(payload.exp * 1000));
```

**3. Forcer un refresh**
```typescript
// Dans le code ou console
const { data, error } = await supabase.auth.refreshSession();
```

**4. Vérifier le JWT_SECRET côté backend**
```bash
# backend/.env
JWT_SECRET=votre-jwt-secret-depuis-supabase
# Doit correspondre à Settings → API → JWT Secret dans Supabase
```

---

### ❌ "User role not found" (403 Forbidden)

**Symptôme** : Erreur 403 même avec un token valide.

**Cause** : Le rôle utilisateur (`user_role`) n'est pas dans le JWT.

**Solution** :

**1. Vérifier les custom claims dans Supabase**
```sql
-- Dans Supabase SQL Editor
SELECT raw_user_meta_data, raw_app_meta_data 
FROM auth.users 
WHERE id = 'votre-user-id';
```

**2. Ajouter le rôle manuellement (dev)**
```sql
-- Mettre à jour le profil
UPDATE personnes 
SET statut_profil = 'approuve'
WHERE auth_user_id = 'votre-user-id';

-- Les custom claims JWT doivent être configurés 
-- via un hook Supabase ou Edge Function
```

**3. Configuration Supabase Hook** (à implémenter)
```typescript
// Supabase Edge Function pour ajouter user_role au JWT
export async function handler(req: Request) {
  const user = req.body.user;
  // Récupérer le rôle depuis la table personnes
  const { data } = await supabase
    .from('personnes')
    .select('type, statut_profil')
    .eq('auth_user_id', user.id)
    .single();
  
  return {
    user_metadata: {
      ...user.user_metadata,
      user_role: data?.statut_profil === 'approuve' ? 'user' : 'public'
    }
  };
}
```

---

## 🖥️ Problèmes Frontend

### ❌ Page blanche après `npm run dev`

**Symptôme** : Le navigateur affiche une page blanche, rien ne se charge.

**Solutions** :

**1. Vérifier la console du navigateur (F12)**
```javascript
// Cherchez des erreurs rouges
// Erreurs communes :
// - Module not found
// - Syntax error
// - Failed to fetch
```

**2. Vérifier les variables d'environnement**
```bash
# frontend/.env.local doit exister et contenir :
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# ⚠️ Redémarrez TOUJOURS après modification .env
# Ctrl+C puis npm run dev
```

**3. Vérifier les logs du terminal**
```bash
# Le terminal devrait afficher :
#   ▲ Next.js 16.x.x
#   - Local:        http://localhost:3000
# Si erreur de compilation, elle s'affichera ici
```

---

### ❌ Erreur "Hydration failed"

**Symptôme** : Erreur React `Hydration failed` dans la console.

**Cause** : Différence entre le HTML rendu côté serveur et côté client.

**Solutions** :

**1. Vérifier les composants utilisant du state**
```typescript
// ❌ Mauvais (cause l'erreur)
export default function Component() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => setMounted(true), []);
  
  return <div>{mounted ? "Client" : "Server"}</div>;
}

// ✅ Bon (utiliser dynamic import)
import dynamic from 'next/dynamic';

const ClientOnly = dynamic(() => import('./ClientComponent'), {
  ssr: false
});
```

**2. Vérifier les timestamps**
```typescript
// ❌ Mauvais
<div>{new Date().toLocaleString()}</div>

// ✅ Bon
<div suppressHydrationWarning>
  {new Date().toLocaleString()}
</div>
```

---

### ❌ Images ne se chargent pas

**Symptôme** : Images cassées (icône 🖼️❌).

**Solutions** :

**1. Vérifier l'URL de l'image**
```typescript
// ✅ Bon (chemins relatifs)
<Image src="/images/logo.png" alt="Logo" />

// ✅ Bon (URLs complètes)
<Image src="https://xxx.supabase.co/storage/v1/..." alt="Fresque" />

// ❌ Mauvais (chemin absolu sans configuration)
<Image src="https://example.com/image.jpg" alt="..." />
// → Ajouter le domaine dans next.config.js
```

**2. Configurer les domaines autorisés**
```javascript
// next.config.ts
const nextConfig = {
  images: {
    domains: ['xxx.supabase.co', 'autre-domaine.com'],
    // Ou remotePatterns pour Next.js 13+
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
};
```

**3. Vérifier les CORS Supabase Storage**
```sql
-- Dans Supabase : Storage → Policies
-- Créer une politique "Public Read"
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'public-bucket');
```

---

## 🔌 Problèmes Backend/API

### ❌ `ModuleNotFoundError: No module named 'fastapi'`

**Symptôme** : Erreur lors du lancement de l'API.

**Solution** :
```bash
cd backend

# Vérifier que l'environnement virtuel est activé
which python  # Devrait pointer vers backend/venv/bin/python

# Si non activé :
source venv/bin/activate  # macOS/Linux
# ou
venv\Scripts\activate  # Windows

# Réinstaller les dépendances
pip install -r requirements.txt
```

---

### ❌ `Could not connect to Supabase`

**Symptôme** : Erreur de connexion à la base de données.

**Solutions** :

**1. Vérifier les variables d'environnement**
```bash
cd backend
cat .env

# Doit contenir :
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=eyJhbGci...
JWT_SECRET=super-secret-jwt-key

# Vérifier qu'il n'y a pas d'espaces avant/après les =
```

**2. Tester la connexion manuellement**
```python
# test_connection.py
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

print(f"URL: {url}")
print(f"Key: {key[:20]}...")  # Afficher les 20 premiers caractères

supabase = create_client(url, key)
response = supabase.table("personnes").select("*").limit(1).execute()
print("Connexion réussie !", response)
```

**3. Vérifier le firewall Supabase**
- Allez dans Supabase Dashboard → Settings → API
- Vérifiez que votre IP n'est pas bloquée
- En dev, désactivez temporairement les restrictions IP

---

### ❌ 500 Internal Server Error sur l'API

**Symptôme** : Toutes les requêtes API retournent 500.

**Solutions** :

**1. Consulter les logs FastAPI**
```bash
# Les logs s'affichent dans le terminal où vous avez lancé uvicorn
# Cherchez le traceback complet de l'erreur

# Activer les logs de debug
uvicorn app.main:app --reload --log-level debug
```

**2. Tester l'endpoint avec curl**
```bash
# Test basique
curl http://localhost:8000/

# Test avec authentification
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:8000/api/v1/personnes/me
```

**3. Vérifier Swagger UI**
```
Ouvrez : http://localhost:8000/docs
Testez les endpoints directement dans l'interface
```

---

## 🗄️ Problèmes Base de Données

### ❌ Tables non créées dans Supabase

**Symptôme** : La table `personnes` ou d'autres n'existent pas.

**Solution** :

**1. Exécuter le script SQL**
```sql
-- Dans Supabase SQL Editor
-- Copiez TOUT le contenu de SQL_Schema.sql
-- Cliquez sur "Run"

-- Vérifier la création
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
-- Devrait lister : personnes, editions, fresques, etc.
```

**2. Exécuter par sections si échec**
```sql
-- Si erreur globale, exécutez section par section :
-- 1. Tables principales d'abord
-- 2. Puis tables de liaison
-- 3. Puis fonctions
-- 4. Enfin politiques RLS
```

---

### ❌ Row Level Security bloque tout

**Symptôme** : Aucune requête ne fonctionne, erreur "permission denied".

**Solutions** :

**1. Vérifier que RLS est activé**
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
-- rowsecurity doit être TRUE
```

**2. Lister les politiques**
```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';
```

**3. Temporairement désactiver RLS (dev uniquement !)**
```sql
-- ⚠️ Seulement pour tester localement
ALTER TABLE personnes DISABLE ROW LEVEL SECURITY;

-- Tests...

-- Réactiver IMMÉDIATEMENT après
ALTER TABLE personnes ENABLE ROW LEVEL SECURITY;
```

**4. Vérifier la fonction get_user_role()**
```sql
SELECT get_user_role();
-- Devrait retourner 'admin', 'staff', ou 'public'
-- Si NULL, le JWT n'a pas le claim user_role
```

---

### ❌ Données dupliquées ou incohérentes

**Symptôme** : Doublons dans les tables.

**Solutions** :

**1. Vérifier les contraintes**
```sql
-- Lister les contraintes
SELECT conname, contype, conrelid::regclass 
FROM pg_constraint 
WHERE conrelid = 'personnes'::regclass;

-- Ajouter une contrainte UNIQUE si manquante
ALTER TABLE personnes 
ADD CONSTRAINT personnes_email_unique UNIQUE (email);
```

**2. Nettoyer les doublons**
```sql
-- Identifier les doublons
SELECT email, COUNT(*) 
FROM personnes 
GROUP BY email 
HAVING COUNT(*) > 1;

-- Supprimer les doublons (garder le plus récent)
DELETE FROM personnes a
USING personnes b
WHERE a.id < b.id 
  AND a.email = b.email;
```

---

## ⚡ Problèmes de Performance

### ❌ L'application est lente

**Symptômes** : Temps de chargement élevés, latence.

**Solutions** :

**1. Activer le cache Next.js**
```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  // Activer le cache statique
  output: 'standalone',
};
```

**2. Optimiser les requêtes database**
```sql
-- Analyser les requêtes lentes
EXPLAIN ANALYZE 
SELECT * FROM fresques 
WHERE ...;

-- Créer des index manquants
CREATE INDEX idx_fresques_created_at ON fresques(created_at DESC);
```

**3. Réduire la taille des payloads**
```typescript
// ❌ Mauvais (récupère tout)
const { data } = await supabase
  .from('fresques')
  .select('*');

// ✅ Bon (sélectionne uniquement les champs nécessaires)
const { data } = await supabase
  .from('fresques')
  .select('id, titre, description, created_at');
```

**4. Utiliser la pagination**
```typescript
// ❌ Mauvais (charge toutes les fresques)
const { data } = await supabase
  .from('fresques')
  .select('*');

// ✅ Bon (pagination)
const { data } = await supabase
  .from('fresques')
  .select('*')
  .range(0, 19);  // 20 premiers résultats
```

---

## ❌ Erreurs Courantes

### `EADDRINUSE: address already in use`

**Cause** : Le port 3000 ou 8000 est déjà utilisé.

**Solution** :
```bash
# Trouver le processus utilisant le port
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Tuer le processus
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Ou utiliser un autre port
npm run dev -- -p 3001
uvicorn app.main:app --port 8001
```

---

### `Cannot find module '@supabase/...'`

**Cause** : Dépendance manquante ou mal installée.

**Solution** :
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install

# Ou installer la dépendance spécifique
npm install @supabase/supabase-js@latest
```

---

### `CORS policy: No 'Access-Control-Allow-Origin'`

**Cause** : Le backend n'autorise pas le frontend.

**Solution** :
```python
# backend/app/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Dev
        "https://votre-domaine.com"  # Prod
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 🆘 Obtenir de l'Aide

### Auto-Diagnostic

Avant de demander de l'aide, essayez cette checklist :

- [ ] J'ai lu le message d'erreur complet
- [ ] J'ai vérifié les logs (terminal, console navigateur)
- [ ] J'ai cherché l'erreur dans cette documentation
- [ ] J'ai vérifié mes variables d'environnement
- [ ] J'ai redémarré les serveurs frontend et backend
- [ ] J'ai testé sur un navigateur différent
- [ ] J'ai vidé le cache du navigateur (Ctrl+Shift+R)

### Comment Demander de l'Aide

**📝 Préparez ces informations** :

1. **Description du problème** : Que tentez-vous de faire ?
2. **Comportement attendu** : Que devrait-il se passer ?
3. **Comportement actuel** : Que se passe-t-il réellement ?
4. **Message d'erreur complet** : Copiez-collez le texte exact (avec traceback)
5. **Environnement** :
   ```
   OS : macOS 14.0 / Windows 11 / Ubuntu 22.04
   Node.js : 18.17.0
   Python : 3.11.0
   Navigateur : Chrome 120 / Firefox 121 / Safari 17
   ```
6. **Code pertinent** : Si applicable (utilisez des blocs de code markdown)
7. **Ce que vous avez déjà essayé** : Quelles solutions avez-vous testées ?

### Canaux de Support

**💬 GitHub Discussions** (Recommandé pour questions)
- URL : https://github.com/komythomas/Effet-Graff/discussions
- Catégories : Q&A, Help Wanted, Ideas

**🐛 GitHub Issues** (Pour les bugs confirmés)
- URL : https://github.com/komythomas/Effet-Graff/issues
- Utilisez le template "Bug Report"

**📧 Email** (Pour questions privées)
- Support : support@effetgraff.com
- Réponse sous 24-48h (jours ouvrés)

**📚 Documentation**
- [Guide de Démarrage](./GETTING_STARTED.md)
- [FAQ](./FAQ.md)
- [Guide Utilisateur](./USER_GUIDE.md)

---

## 🔍 Debug Avancé

### Activer les Logs de Debug

**Frontend (Next.js)** :
```bash
# .env.local
NEXT_PUBLIC_DEBUG=true

# Puis dans le code
if (process.env.NEXT_PUBLIC_DEBUG) {
  console.log('[DEBUG]', data);
}
```

**Backend (FastAPI)** :
```python
# app/main.py
import logging
logging.basicConfig(level=logging.DEBUG)

# Dans le code
logger = logging.getLogger(__name__)
logger.debug(f"User data: {user}")
```

**Supabase** :
```typescript
// Activer les logs Supabase
const supabase = createClient(url, key, {
  auth: {
    debug: true  // Logs d'authentification
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'effetgraff-debug'
    }
  }
});
```

### Outils de Debug

**Browser DevTools** :
- **Console** (F12) : Logs JavaScript
- **Network** : Requêtes HTTP, timing
- **Application** : LocalStorage, Cookies, Cache
- **React DevTools** : Extension pour inspecter les composants

**Postman/Insomnia** :
- Tester les endpoints API isolément
- Vérifier les headers et responses

**Database Clients** :
- TablePlus, DBeaver, pgAdmin
- Inspecter directement les données

---

<div align="center">

**🔧 Toujours pas résolu ? Contactez-nous !**

**support@effetgraff.com**

[⬆ Retour en haut](#-guide-de-dépannage-effetgraff)

</div>
