# Documentation du Backend et de l'API EFFETGRAFF

**Technologie :** FastAPI (Python)
**Version :** 2.0
**Auteur :** Manus AI

## 1. Architecture du Backend

Le backend est une API RESTful construite avec **FastAPI** [1], choisie pour sa haute performance, sa documentation automatique (via Swagger/OpenAPI) et son support natif des validations de données via Pydantic.

### 1.1. Structure du Projet

Le projet est organisé de manière modulaire pour séparer les préoccupations (séparation des schémas, des dépendances et des routes).

```
/backend
├── app/
│   ├── main.py             # Point d'entrée de l'application
│   ├── config.py           # Gestion des variables d'environnement
│   ├── dependencies.py     # Logique d'authentification et de dépendances
│   ├── routers/            # Modules de routes (fresques, personnes, ...)
│   └── schemas/            # Modèles Pydantic (validation des données)
└── requirements.txt        # Dépendances Python
```

### 1.2. Configuration et Dépendances Clés

*   **`config.py`** : Utilise `pydantic-settings` pour charger les variables d'environnement (`SUPABASE_URL`, `SUPABASE_KEY`, `JWT_SECRET`) de manière sécurisée.
*   **`requirements.txt`** : Liste les dépendances nécessaires, notamment `fastapi`, `uvicorn` (serveur ASGI), `supabase-py` (client BDD), et `python-jose` (gestion JWT).

## 2. Gestion de l'Authentification et des Permissions

La sécurité de l'API repose sur l'utilisation du token JWT émis par Supabase Auth.

### 2.1. Dépendances de Sécurité (`dependencies.py`)

Le fichier `dependencies.py` centralise la logique de sécurité et définit les niveaux d'accès :

| Dépendance | Rôle | Description |
| :--- | :--- | :--- |
| `get_current_user_id` | Authentification | Extrait l'ID utilisateur du token JWT. |
| `require_auth` | Authentifié | Lève une erreur 401 si aucun token valide n'est présent. |
| `require_admin` | Admin | Lève une erreur 403 si le rôle n'est pas `admin`. |
| **`require_write_access`** | **Staff ou Admin** | Lève une erreur 403 si le rôle n'est ni `admin` ni `staff`. **C'est la dépendance utilisée pour les routes de modification des données du festival.** |

### 2.2. Flux d'Autorisation

1.  Le Frontend envoie une requête à l'API avec le token JWT Supabase dans l'en-tête `Authorization: Bearer <token>`.
2.  La dépendance `get_current_user_claims` décode le token en utilisant la clé secrète JWT de Supabase.
3.  Les dépendances de niveau supérieur (`require_write_access`, `require_admin`) vérifient le `user_role` dans les *claims* du token pour accorder ou refuser l'accès.

## 3. Structure de l'API (Endpoints)

L'API est versionnée (`/api/v1`) et organisée par ressource.

### 3.1. Routes Publiques (Lecture)

Ces routes sont accessibles sans authentification (mais la RLS de Supabase s'applique toujours pour les données publiques).

| Méthode | URL | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/fresques` | Liste toutes les fresques. |
| `GET` | `/api/v1/fresques/{id}` | Détails d'une fresque. |
| `GET` | `/api/v1/editions` | Liste des éditions. |

### 3.2. Routes Protégées (Utilisateur)

Ces routes nécessitent un utilisateur authentifié (`require_auth`).

| Méthode | URL | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/personnes/me` | Récupère le profil de l'utilisateur connecté. |
| `PUT` | `/api/v1/personnes/me` | Met à jour le profil (utilisé pour l'onboarding). |

### 3.3. Routes Protégées (Staff/Admin)

Ces routes nécessitent un accès en écriture (`require_write_access`).

| Méthode | URL | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/fresques` | Créer une nouvelle fresque. |
| `PUT` | `/api/v1/fresques/{id}` | Modifier une fresque. |
| `GET` | `/api/v1/personnes/pending` | Liste les profils en attente de validation. |
| `POST` | `/api/v1/personnes/{id}/approve` | Valide un profil. |
| `POST` | `/api/v1/personnes` | Créer manuellement un profil. |

## 4. Validation des Données (Pydantic)

Tous les échanges de données sont validés par **Pydantic** [2].

*   **Schémas `Create`** : Utilisés pour les requêtes `POST` et `PUT` (ex: `FresqueCreate`). Ils garantissent que les données entrantes sont conformes aux types attendus.
*   **Schémas `Response`** : Utilisés pour les réponses (ex: `Fresque`). Ils garantissent que l'API renvoie des données structurées et peuvent filtrer les champs sensibles.

---
**Références :**
[1] FastAPI Documentation - [https://fastapi.tiangolo.com/][1]
[2] Pydantic Documentation - [https://docs.pydantic.dev/][2]

[1]: https://fastapi.tiangolo.com/
[2]: https://docs.pydantic.dev/
