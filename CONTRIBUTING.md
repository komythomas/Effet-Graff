# 🤝 Guide de Contribution - EFFETGRAFF

Merci de votre intérêt pour contribuer à EFFETGRAFF ! Ce guide vous aidera à démarrer et à soumettre vos contributions de manière efficace.

## 📋 Table des Matières

- [Code de Conduite](#-code-de-conduite)
- [Comment Puis-je Contribuer ?](#-comment-puis-je-contribuer-)
- [Premiers Pas](#-premiers-pas)
- [Processus de Développement](#-processus-de-développement)
- [Standards de Code](#-standards-de-code)
- [Soumettre une Pull Request](#-soumettre-une-pull-request)
- [Processus de Review](#-processus-de-review)
- [Ressources Utiles](#-ressources-utiles)

---

## 📜 Code de Conduite

En participant à ce projet, vous acceptez de respecter notre [Code de Conduite](./CODE_OF_CONDUCT.md). Nous nous engageons à maintenir une communauté accueillante, respectueuse et inclusive pour tous.

---

## 💡 Comment Puis-je Contribuer ?

Il existe de nombreuses façons de contribuer à EFFETGRAFF, même sans écrire de code !

### 🐛 Signaler des Bugs

Vous avez trouvé un bug ? Aidez-nous à l'identifier et le corriger :

1. **Vérifiez** que le bug n'a pas déjà été signalé dans les [Issues](https://github.com/komythomas/Effet-Graff/issues)
2. **Créez une nouvelle issue** en utilisant le template "Bug Report"
3. **Incluez** :
   - Une description claire et concise du problème
   - Les étapes pour reproduire le bug
   - Le comportement attendu vs le comportement actuel
   - Des captures d'écran si pertinent
   - Votre environnement (OS, navigateur, version de Node.js, etc.)

### ✨ Proposer des Fonctionnalités

Vous avez une idée pour améliorer EFFETGRAFF ?

1. **Vérifiez** que la fonctionnalité n'a pas déjà été proposée dans les [Discussions](https://github.com/komythomas/Effet-Graff/discussions)
2. **Créez une Discussion** dans la catégorie "Ideas" pour en discuter avec la communauté
3. **Si approuvée**, une issue sera créée et vous pourrez commencer à travailler dessus

### 📝 Améliorer la Documentation

La documentation peut toujours être améliorée :
- Corriger des fautes de frappe ou des erreurs
- Clarifier des sections confuses
- Ajouter des exemples ou des tutoriels
- Traduire en d'autres langues
- Améliorer les commentaires dans le code

### 🔧 Corriger des Bugs ou Ajouter des Fonctionnalités

Consultez les issues étiquetées :
- `good first issue` : Parfait pour les nouveaux contributeurs
- `help wanted` : Nous recherchons activement de l'aide
- `bug` : Bugs confirmés à corriger
- `enhancement` : Nouvelles fonctionnalités approuvées

### 🎨 Design & UX

Vous êtes designer ? Contribuez :
- Améliorations de l'interface utilisateur
- Conception de nouveaux composants
- Optimisation de l'expérience utilisateur
- Accessibilité (WCAG compliance)

### 🌍 Traductions

Aidez-nous à rendre EFFETGRAFF accessible mondialement :
- Traduire l'interface utilisateur
- Traduire la documentation
- Réviser les traductions existantes

---

## 🚀 Premiers Pas

### Configuration de l'Environnement de Développement

#### Prérequis
- **Node.js** 18+ et npm/pnpm
- **Python** 3.9+ et pip
- **Git**
- Un compte **Supabase** (gratuit)
- Un éditeur de code (VS Code recommandé)

#### 1. Fork et Clone

```bash
# Forker le repository sur GitHub, puis :
git clone https://github.com/VOTRE-USERNAME/Effet-Graff.git
cd Effet-Graff

# Ajouter le repository original comme remote
git remote add upstream https://github.com/komythomas/Effet-Graff.git
```

#### 2. Installation des Dépendances

**Backend :**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Frontend :**
```bash
cd frontend
npm install
# ou : pnpm install
```

#### 3. Configuration

Suivez le [Guide de Démarrage](./docs/GETTING_STARTED.md) pour configurer vos variables d'environnement et Supabase.

#### 4. Lancer en Mode Développement

**Terminal 1 - Backend :**
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
```

**Terminal 2 - Frontend :**
```bash
cd frontend
npm run dev
```

Accédez à :
- Frontend : http://localhost:3000
- API : http://localhost:8000
- Docs API : http://localhost:8000/docs

---

## 🔄 Processus de Développement

### Workflow Git

Nous utilisons un workflow basé sur les **feature branches** :

```bash
# 1. Synchroniser avec upstream
git checkout main
git pull upstream main

# 2. Créer une nouvelle branche
git checkout -b feature/ma-nouvelle-fonctionnalite
# ou : fix/correction-du-bug
# ou : docs/amelioration-documentation

# 3. Faire vos modifications et commits
git add .
git commit -m "feat: ajout de la fonctionnalité X"

# 4. Pousser vers votre fork
git push origin feature/ma-nouvelle-fonctionnalite

# 5. Créer une Pull Request sur GitHub
```

### Convention de Nommage des Branches

- `feature/` : Nouvelles fonctionnalités
- `fix/` : Corrections de bugs
- `docs/` : Modifications de documentation
- `refactor/` : Refactoring sans changement fonctionnel
- `test/` : Ajout ou modification de tests
- `chore/` : Maintenance (dépendances, config, etc.)

### Convention de Messages de Commit

Nous suivons la convention [Conventional Commits](https://www.conventionalcommits.org/) :

```
<type>(<scope>): <description courte>

[corps optionnel]

[footer optionnel]
```

**Types :**
- `feat` : Nouvelle fonctionnalité
- `fix` : Correction de bug
- `docs` : Documentation uniquement
- `style` : Formatage, points-virgules, etc. (pas de changement de code)
- `refactor` : Refactoring de code (ni feat ni fix)
- `test` : Ajout ou modification de tests
- `chore` : Maintenance, dépendances, config

**Exemples :**
```bash
feat(frontend): ajout du composant de galerie d'images
fix(api): correction de l'authentification OAuth
docs(readme): mise à jour des instructions d'installation
refactor(backend): simplification de la logique de validation
test(api): ajout de tests pour les endpoints de fresques
chore(deps): mise à jour de Next.js vers v16.1
```

---

## 📐 Standards de Code

### Frontend (TypeScript/React)

#### Style de Code
```typescript
// ✅ Bon
export function FresqueCard({ fresque, onClick }: FresqueCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="rounded-lg shadow-md hover:shadow-lg transition-shadow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ... */}
    </div>
  );
}

// ❌ Mauvais
export function FresqueCard(props: any) {
  var hover = false;
  return <div className="card">{/* ... */}</div>;
}
```

#### Bonnes Pratiques
- ✅ Utiliser TypeScript strictement (pas de `any`)
- ✅ Composants fonctionnels avec hooks
- ✅ Props typées avec interfaces/types
- ✅ Naming en camelCase pour variables, PascalCase pour composants
- ✅ Utiliser les Server Components Next.js par défaut
- ✅ Client Components uniquement quand nécessaire (interactivité, état)

### Backend (Python/FastAPI)

#### Style de Code
```python
# ✅ Bon
from typing import List, Optional
from pydantic import BaseModel, EmailStr

class FresqueCreate(BaseModel):
    titre: str
    description: Optional[str] = None
    artiste_ids: List[str]
    
@app.post("/api/v1/fresques", response_model=Fresque)
async def create_fresque(
    fresque: FresqueCreate,
    current_user: dict = Depends(require_write_access)
) -> Fresque:
    """Créer une nouvelle fresque (Staff/Admin uniquement)."""
    # ...

# ❌ Mauvais
@app.post("/api/v1/fresques")
def create_fresque(data):
    # ...
```

#### Bonnes Pratiques
- ✅ Suivre PEP 8
- ✅ Type hints partout
- ✅ Modèles Pydantic pour validation
- ✅ Docstrings pour fonctions/classes
- ✅ Gestion d'erreurs explicite
- ✅ Async/await pour opérations I/O

### Base de Données (SQL/PostgreSQL)

```sql
-- ✅ Bon : Nommage explicite, commentaires, contraintes
CREATE TABLE fresques (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titre TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT titre_length CHECK (char_length(titre) <= 200)
);

COMMENT ON TABLE fresques IS 'Catalogue des œuvres d''art créées lors du festival';
COMMENT ON COLUMN fresques.titre IS 'Titre de la fresque (max 200 caractères)';

-- ❌ Mauvais
CREATE TABLE f (
    id INT,
    t TEXT,
    d TEXT
);
```

### Linting et Formatage

**Frontend :**
```bash
cd frontend
npm run lint       # ESLint
npm run format     # Prettier (si configuré)
```

**Backend :**
```bash
cd backend
black .            # Formatage automatique
flake8 .           # Linting
mypy .             # Type checking
```

**Avant chaque commit**, assurez-vous que :
- ✅ Le code passe le linting
- ✅ Les tests existants passent
- ✅ Vous avez ajouté des tests pour les nouvelles fonctionnalités
- ✅ La documentation est à jour

---

## 📤 Soumettre une Pull Request

### Checklist avant Soumission

Avant de créer une PR, vérifiez :

- [ ] **Code :**
  - [ ] Le code compile sans erreur
  - [ ] Le linting passe (ESLint/Black/Flake8)
  - [ ] Les tests existants passent
  - [ ] Vous avez ajouté des tests pour votre code
  - [ ] Pas de console.log() oublié ou de code commenté
  
- [ ] **Documentation :**
  - [ ] README mis à jour si nécessaire
  - [ ] Commentaires ajoutés pour code complexe
  - [ ] Documentation API mise à jour si changements d'endpoints
  
- [ ] **Git :**
  - [ ] Commits bien nommés (Conventional Commits)
  - [ ] Branche à jour avec main (`git pull upstream main`)
  - [ ] Pas de conflits de merge
  
- [ ] **Sécurité :**
  - [ ] Pas de secrets/clés API dans le code
  - [ ] Validation des inputs utilisateur
  - [ ] Pas de failles de sécurité évidentes

### Créer la Pull Request

1. **Poussez** votre branche vers votre fork
2. **Allez** sur GitHub et cliquez "Compare & pull request"
3. **Remplissez** le template de PR avec :
   - Description claire des changements
   - Référence à l'issue liée (`Fixes #123` ou `Closes #456`)
   - Captures d'écran si changements UI
   - Notes pour les reviewers
4. **Ajoutez** les labels appropriés (bug, enhancement, documentation, etc.)
5. **Assignez** des reviewers si vous en connaissez
6. **Créez** la Pull Request

### Template de PR

```markdown
## Description
Brève description des changements apportés.

## Type de Changement
- [ ] 🐛 Bug fix
- [ ] ✨ Nouvelle fonctionnalité
- [ ] 📝 Documentation
- [ ] ♻️ Refactoring
- [ ] ⚡️ Amélioration de performance

## Issue Liée
Closes #(numéro de l'issue)

## Changements Apportés
- Changement 1
- Changement 2
- Changement 3

## Screenshots (si applicable)
[Ajouter des captures d'écran ici]

## Tests
- [ ] J'ai ajouté des tests
- [ ] Tous les tests passent
- [ ] J'ai testé manuellement

## Checklist
- [ ] Mon code suit les standards du projet
- [ ] J'ai commenté les parties complexes
- [ ] J'ai mis à jour la documentation
- [ ] Mes commits suivent la convention
- [ ] Pas de conflits avec main
```

---

## 👀 Processus de Review

### Ce que Nous Regardons

Les reviewers examineront :
- ✅ **Qualité du code** : Lisibilité, maintenabilité, respect des standards
- ✅ **Fonctionnalité** : Le code fait-il ce qu'il prétend faire ?
- ✅ **Tests** : Couverture suffisante, tests pertinents
- ✅ **Sécurité** : Pas de failles, validation des inputs
- ✅ **Performance** : Pas de régressions
- ✅ **Documentation** : Clarté, exhaustivité

### Recevoir des Commentaires

- 💬 Les commentaires sont constructifs et bienveillants
- ❓ N'hésitez pas à demander des clarifications
- 🙏 Remerciez les reviewers pour leur temps
- 🔄 Adressez les commentaires rapidement
- ✅ Résolvez les conversations une fois adressées

### Après Approbation

Une fois votre PR approuvée :
1. Un mainteneur mergera votre PR dans `main`
2. Votre contribution apparaîtra dans la prochaine release
3. Vous serez ajouté à la liste des contributeurs 🎉

---

## 📚 Ressources Utiles

### Documentation du Projet
- [Guide de Démarrage](./docs/GETTING_STARTED.md)
- [Architecture du Système](./docs/ARCHITECTURE.md)
- [Documentation API](./docs/API_REFERENCE.md)

### Technologies Utilisées
- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

### Standards & Conventions
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [PEP 8 – Style Guide for Python](https://pep8.org/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)

### Outils de Développement
- [VS Code](https://code.visualstudio.com/) - Éditeur recommandé
- [GitHub CLI](https://cli.github.com/) - Gestion Git/GitHub en ligne de commande
- [Postman](https://www.postman.com/) - Tests d'API
- [TablePlus](https://tableplus.com/) - Client base de données

---

## ❓ Questions ?

Si vous avez des questions ou besoin d'aide :

- 💬 Rejoignez les [GitHub Discussions](https://github.com/komythomas/Effet-Graff/discussions)
- 🐛 Consultez les [Issues existantes](https://github.com/komythomas/Effet-Graff/issues)
- 📧 Contactez les mainteneurs : contact@effetgraff.com

---

## 🙏 Merci !

Chaque contribution, petite ou grande, est précieuse. En contribuant à EFFETGRAFF, vous participez à la valorisation de l'art urbain et aidez à construire une communauté plus forte.

**Bienvenue dans l'équipe ! 🎨**

---

<div align="center">

[⬆ Retour en haut](#-guide-de-contribution---effetgraff)

</div>
