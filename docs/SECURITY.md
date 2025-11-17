# 🔐 Politique de Sécurité - EFFETGRAFF

**Version :** 2.0
**Dernière mise à jour :** Novembre 2024

## 📋 Table des Matières

- [Vue d'Ensemble](#-vue-densemble)
- [Signaler une Vulnérabilité](#-signaler-une-vulnérabilité)
- [Architecture de Sécurité](#-architecture-de-sécurité)
- [Bonnes Pratiques](#-bonnes-pratiques)
- [Gestion des Données](#-gestion-des-données)
- [Conformité](#-conformité)

---

## 🛡️ Vue d'Ensemble

La sécurité est une priorité absolue pour EFFETGRAFF. Nous nous engageons à protéger les données de nos utilisateurs, artistes, bénévoles et partenaires contre tout accès non autorisé, modification ou divulgation.

### Nos Engagements

✅ **Transparence** : Communication claire sur nos pratiques de sécurité
✅ **Protection des Données** : Conformité RGPD et meilleures pratiques internationales
✅ **Réponse Rapide** : Traitement prioritaire des vulnérabilités signalées
✅ **Mise à Jour Continue** : Veille et application des derniers correctifs de sécurité
✅ **Audit Régulier** : Revues de code et tests de sécurité périodiques

---

## 🚨 Signaler une Vulnérabilité

### Politique de Divulgation Responsable

Nous encourageons les chercheurs en sécurité et la communauté à nous signaler toute vulnérabilité de manière responsable.

**⚠️ IMPORTANT : Ne créez PAS d'issue publique sur GitHub pour les vulnérabilités de sécurité.**

### Comment Signaler ?

#### 📧 Email Sécurisé (Recommandé)

Envoyez un email détaillé à : **security@effetgraff.com**

**Objet** : `[SECURITY] Brief description`

**Contenu à inclure** :
- Description détaillée de la vulnérabilité
- Étapes pour reproduire le problème
- Impact potentiel (sévérité : critique, haute, moyenne, faible)
- Version affectée (URL, commit hash, etc.)
- Environnement (OS, navigateur, version, etc.)
- Preuve de concept (PoC) si disponible
- Votre nom/pseudonyme si vous souhaitez être crédité

#### 🔒 Chiffrement PGP (Optionnel)

Pour des vulnérabilités critiques, vous pouvez chiffrer votre message avec notre clé PGP publique :

```
Key ID: [À définir]
Fingerprint: [À définir]
Public Key: [Lien vers la clé]
```

### Processus de Traitement

| Étape | Délai | Action |
|-------|-------|--------|
| **1. Accusé de réception** | 24-48h | Confirmation de réception de votre rapport |
| **2. Évaluation initiale** | 3-5 jours | Validation et triage de la vulnérabilité |
| **3. Développement du correctif** | Variable (selon sévérité) | Patch et tests |
| **4. Déploiement** | Selon sévérité | Mise en production du correctif |
| **5. Divulgation publique** | 30-90 jours | Publication d'un advisory (avec votre crédit) |

### Système de Récompense (Bug Bounty)

Nous n'avons pas encore de programme de bug bounty monétaire, mais nous offrons :
- 🏆 **Reconnaissance publique** (si vous le souhaitez) dans nos notes de version et advisory
- 🎖️ **Badge spécial** sur votre profil EFFETGRAFF (si vous êtes membre)
- 📧 **Lettre de remerciement** officielle
- 🎁 **Goodies** du festival (selon la criticité)

### Critères de Sévérité

**🔴 Critique** : Traitement immédiat (< 24h)
- Exécution de code à distance (RCE)
- Injection SQL permettant l'extraction de données
- Contournement complet de l'authentification
- Accès non autorisé à l'infrastructure

**🟠 Haute** : Traitement rapide (< 7 jours)
- Escalade de privilèges (user → admin)
- Contournement de Row Level Security (RLS)
- XSS stocké affectant tous les utilisateurs
- Divulgation d'informations sensibles (tokens, secrets)

**🟡 Moyenne** : Traitement normal (< 30 jours)
- XSS réfléchi
- CSRF sur actions non critiques
- Divulgation d'informations non sensibles
- Déni de service (DoS) partiel

**🟢 Faible** : Traitement standard (< 90 jours)
- Problèmes de configuration mineurs
- Fuites d'informations non exploitables
- Améliorations de sécurité suggérées

### Ce qui N'EST PAS Considéré

❌ **Hors scope** (ne seront pas traités comme vulnérabilités) :
- Attaques par force brute sans preuve de faiblesse
- Vulnérabilités dans des dépendances obsolètes sans exploit démontré
- Problèmes nécessitant un accès physique à l'appareil
- Attaques de social engineering
- Spam ou activités malveillantes
- Rapport de bugs fonctionnels (utilisez GitHub Issues standard)
- Problèmes déjà connus et documentés

---

## 🏗️ Architecture de Sécurité

### Défense en Profondeur

Notre architecture implémente plusieurs couches de sécurité :

```
┌──────────────────────────────────────────────────────┐
│          UTILISATEUR (Navigateur)                    │
└────────────────┬─────────────────────────────────────┘
                 │ HTTPS/TLS 1.3
                 ▼
┌──────────────────────────────────────────────────────┐
│          FRONTEND (Next.js)                          │
│  • CSP Headers                                       │
│  • CSRF Protection                                   │
│  • XSS Prevention                                    │
│  • Input Sanitization                                │
└────────────────┬─────────────────────────────────────┘
                 │ JWT Token (Bearer)
                 ▼
┌──────────────────────────────────────────────────────┐
│          BACKEND API (FastAPI)                       │
│  • JWT Verification                                  │
│  • Rate Limiting                                     │
│  • Input Validation (Pydantic)                       │
│  • CORS Configuration                                │
│  • Security Headers                                  │
└────────────────┬─────────────────────────────────────┘
                 │ Authenticated Queries
                 ▼
┌──────────────────────────────────────────────────────┐
│          DATABASE (PostgreSQL/Supabase)              │
│  • Row Level Security (RLS)                          │
│  • Encrypted at Rest                                 │
│  • Prepared Statements (SQL Injection Prevention)    │
│  • Audit Logging                                     │
└──────────────────────────────────────────────────────┘
```

### Authentification et Autorisation

**🔐 Authentification**
- OAuth2 via Supabase Auth (Google, GitHub, Discord, X)
- Tokens JWT avec expiration (1 heure par défaut)
- Refresh tokens sécurisés (stockés en httpOnly cookies)
- MFA/2FA recommandé pour les comptes admin/staff

**🔑 Autorisation**
- Row Level Security (RLS) au niveau base de données
- Vérification des rôles à chaque requête API
- Principe du moindre privilège appliqué partout
- Séparation stricte des rôles (public, user, staff, admin)

**Flux d'Authentification** :
```
1. Utilisateur clique "Se connecter avec Google"
2. Redirection vers Google OAuth
3. Google retourne un code d'autorisation
4. Supabase échange le code contre un JWT
5. JWT contient : user_id, email, role, exp
6. Frontend stocke le token de manière sécurisée
7. Chaque requête API inclut : Authorization: Bearer <token>
8. Backend vérifie signature JWT avec clé secrète
9. Backend extrait user_id et role pour autorisation
10. Database RLS applique les politiques selon le role
```

### Protection des Données

**Chiffrement** :
- ✅ **En transit** : TLS 1.3 pour toutes les connexions (HTTPS obligatoire)
- ✅ **Au repos** : Chiffrement AES-256 de la base de données Supabase
- ✅ **Secrets** : Variables d'environnement jamais committées, gérées via Supabase/Vercel

**Stockage des Mots de Passe** :
- Nous n'avons PAS de mots de passe (OAuth uniquement)
- Aucun mot de passe stocké côté EFFETGRAFF
- Supabase gère l'authentification de manière sécurisée

**Tokens et Secrets** :
```bash
# ❌ JAMAIS faire cela
git add .env
git commit -m "Add config"

# ✅ Toujours faire cela
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
```

### Sécurité des APIs

**Protection CSRF** :
- Tokens CSRF pour toutes les mutations
- Vérification de l'origine des requêtes
- SameSite cookies

**Rate Limiting** :
```python
# Exemple de rate limiting FastAPI
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/api/v1/fresques")
@limiter.limit("10/minute")  # Max 10 créations par minute
async def create_fresque(...)
```

**Validation des Inputs** :
```python
# Validation stricte avec Pydantic
from pydantic import BaseModel, EmailStr, constr

class UserCreate(BaseModel):
    email: EmailStr  # Validation format email
    nom: constr(min_length=1, max_length=100)  # Longueur contrôlée
    bio: constr(max_length=5000) | None = None
```

### Sécurité Frontend

**Content Security Policy (CSP)** :
```typescript
// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];
```

**Protection XSS** :
```typescript
// Sanitization automatique avec React
// ✅ Bon (échappement automatique)
<p>{user.bio}</p>

// ❌ Dangereux (à éviter)
<p dangerouslySetInnerHTML={{__html: user.bio}} />

// ✅ Si HTML nécessaire, utiliser DOMPurify
import DOMPurify from 'dompurify';
<p dangerouslySetInnerHTML={{
  __html: DOMPurify.sanitize(user.bio)
}} />
```

---

## 🔒 Bonnes Pratiques

### Pour les Développeurs

**🔐 Gestion des Secrets**
```bash
# ✅ Utiliser des variables d'environnement
SUPABASE_KEY=${SUPABASE_KEY}

# ❌ Jamais hardcoder
const key = "eyJhbGciOiJIUzI1NiIs...";  // NON !
```

**🛡️ Validation Systématique**
```python
# ✅ Toujours valider les inputs
@app.post("/api/v1/users")
async def create_user(user: UserCreate):  # Pydantic validation
    # ...

# ❌ Jamais faire confiance aux inputs
@app.post("/api/v1/users")
async def create_user(request: Request):
    data = await request.json()  # Non validé = dangereux
```

**🔍 Logging Sécurisé**
```python
# ✅ Log sans données sensibles
logger.info(f"User {user_id} logged in")

# ❌ Ne jamais logger de secrets
logger.info(f"User logged in with token {jwt_token}")  # NON !
```

### Pour les Utilisateurs

**🔑 Protection de Compte**
- ✅ Utilisez un compte OAuth fiable (Google, GitHub)
- ✅ Activez la 2FA/MFA sur votre compte OAuth
- ✅ Déconnectez-vous sur les ordinateurs partagés
- ✅ Vérifiez les permissions demandées lors de l'OAuth

**📧 Vigilance Phishing**
- ⚠️ EFFETGRAFF ne vous demandera JAMAIS votre mot de passe
- ⚠️ Vérifiez l'URL avant de vous connecter (https://effetgraff.com)
- ⚠️ Méfiez-vous des emails suspects demandant des actions urgentes

**📱 Sécurité des Appareils**
- ✅ Gardez votre OS et navigateur à jour
- ✅ Utilisez un antivirus/anti-malware
- ✅ Évitez les réseaux Wi-Fi publics non sécurisés pour les actions sensibles

---

## 📊 Gestion des Données

### Minimisation des Données

Nous collectons uniquement les données nécessaires :

| Donnée | Nécessaire ? | Utilisation | Rétention |
|--------|--------------|-------------|-----------|
| Email | ✅ Oui | Authentification, communication | Tant que compte actif |
| Nom/Prénom | ✅ Oui (profil public) | Identification | Tant que compte actif |
| Bio | ⚪ Optionnel | Portfolio artiste | Tant que compte actif |
| Téléphone | ⚪ Optionnel | Contact urgence (bénévoles) | Tant que compte actif |
| Logs d'activité | ✅ Oui | Sécurité, audit | 1 an puis archive |
| Adresse IP | ✅ Oui | Sécurité, rate limiting | 30 jours |

### Droits des Utilisateurs (RGPD)

En tant qu'utilisateur, vous avez le droit de :

**📖 Accès** : Obtenir une copie de toutes vos données
- Email : privacy@effetgraff.com
- Réponse sous 30 jours

**✏️ Rectification** : Corriger vos données inexactes
- Directement dans votre profil
- Ou via : privacy@effetgraff.com

**🗑️ Effacement** : Supprimer votre compte et données
- Paramètres → Supprimer mon compte
- Ou email : privacy@effetgraff.com
- ⚠️ Les fresques et contributions restent (anonymisées)

**📤 Portabilité** : Exporter vos données dans un format lisible
- Format JSON fourni sur demande

**🚫 Opposition** : Vous opposer au traitement de certaines données
- Email : privacy@effetgraff.com avec demande spécifique

### Partage de Données

**🔒 Nous ne vendons JAMAIS vos données.**

**Partage limité à** :
- ✅ Supabase (hébergement base de données) - [Privacy Policy](https://supabase.com/privacy)
- ✅ Vercel (hébergement frontend) - [Privacy Policy](https://vercel.com/legal/privacy-policy)
- ✅ Fournisseurs OAuth (Google, GitHub, etc.) - Uniquement pour authentification

**En cas d'obligation légale** :
- Nous pouvons être contraints de partager des données sur demande judiciaire
- Nous vous en informerons sauf interdiction légale

---

## ⚖️ Conformité

### Réglementations

**🇪🇺 RGPD (Règlement Général sur la Protection des Données)**
- ✅ Base légale : Consentement explicite (opt-in)
- ✅ Transparence complète sur l'utilisation des données
- ✅ Droits des utilisateurs respectés et facilités
- ✅ DPO (Data Protection Officer) : privacy@effetgraff.com

**🇫🇷 CNIL (Commission Nationale de l'Informatique et des Libertés)**
- ✅ Déclaration effectuée
- ✅ Registre des traitements maintenu
- ✅ Analyse d'impact (DPIA) réalisée

**🌍 Standards Internationaux**
- ✅ OWASP Top 10 : Mitigations implémentées
- ✅ ISO 27001 : Inspiration pour nos processus
- ✅ SOC 2 : Via nos fournisseurs (Supabase, Vercel)

### Audits et Certifications

**📅 Audits de Sécurité**
- Revue de code trimestrielle
- Tests de pénétration annuels (prévu)
- Scan automatique des dépendances (Dependabot, Snyk)

**📜 Certifications Visées** (roadmap)
- [ ] ISO 27001 (Gestion de la sécurité de l'information)
- [ ] SOC 2 Type II (Contrôles de sécurité)

---

## 🆘 Incidents de Sécurité

### Plan de Réponse

En cas d'incident de sécurité, nous suivons ce protocole :

**1. Détection** (immédiate)
- Monitoring actif 24/7
- Alertes automatiques
- Signalements communauté

**2. Confinement** (< 1h)
- Isolation des systèmes affectés
- Blocage de l'attaque en cours
- Préservation des preuves

**3. Éradication** (< 24h)
- Identification de la cause racine
- Développement et test du patch
- Déploiement du correctif

**4. Récupération** (< 48h)
- Restauration des services
- Vérification de l'intégrité des données
- Monitoring renforcé

**5. Communication** (< 72h si données affectées)
- Notification des utilisateurs impactés
- Publication d'un post-mortem public
- Recommandations pour les utilisateurs

**6. Post-Mortem** (< 2 semaines)
- Analyse détaillée de l'incident
- Identification des améliorations
- Mise à jour des procédures

### Historique des Incidents

**Transparence totale** : Tous les incidents de sécurité significatifs seront documentés publiquement ici.

*Aucun incident majeur à ce jour (dernière mise à jour : Nov 2024)*

---

## 📞 Contact Sécurité

**🚨 Signaler une Vulnérabilité** : security@effetgraff.com
**🔒 Questions RGPD/Privacy** : privacy@effetgraff.com
**📧 Contact Général** : contact@effetgraff.com

**Équipe Sécurité** :
- Responsable Sécurité : [Nom]
- DPO (Data Protection Officer) : [Nom]

---

## 📚 Ressources

### Pour en Savoir Plus

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security](https://supabase.com/docs/guides/platform/security)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [CNIL - Guide RGPD](https://www.cnil.fr/fr/rgpd-de-quoi-parle-t-on)

### Outils Recommandés

- **Password Managers** : 1Password, Bitwarden, LastPass
- **2FA Apps** : Google Authenticator, Authy, Microsoft Authenticator
- **VPN** : ProtonVPN, NordVPN, Mullvad

---

<div align="center">

**🔐 La sécurité est l'affaire de tous. Merci de votre vigilance !**

[⬆ Retour en haut](#-politique-de-sécurité---effetgraff)

</div>
