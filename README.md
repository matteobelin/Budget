# Application de Gestion de Budget

Une application de gestion de budget personnelle avec des fonctionnalités avancées d'analyse et de conseil financier.

## Description du Projet

Cette application de gestion de budget permet aux utilisateurs de suivre leurs dépenses, de les catégoriser, d'analyser leurs habitudes financières et de recevoir des conseils personnalisés. Elle utilise une architecture de persistance polyglotte avec plusieurs bases de données spécialisées pour optimiser chaque aspect du système.

### Fonctionnalités Principales

- **Gestion des Dépenses**: Création, visualisation, modification et suppression des dépenses
- **Gestion des Catégories**: Organisation des dépenses en catégories personnalisées
- **Analyse et Statistiques**: Visualisations et analyses détaillées des habitudes de dépenses
- **Conseils Financiers Personnalisés**: Conseils basés sur l'IA adaptés aux habitudes de dépenses
- **Authentification et Gestion des Utilisateurs**: Sécurisation de l'accès aux données personnelles

### Architecture Technique

- **Frontend**: React, TypeScript, Vite, TailwindCSS
- **Backend**: Node.js, Express.js, TypeScript
- **Bases de données**:
  - MongoDB: Stockage des utilisateurs et catégories
  - Neo4j: Gestion des dépenses et leurs connections
  - Redis: Cache et gestion des sessions
  - ChromaDB: Stockage vectoriel pour les fonctionnalités d'IA

## Configuration de l'Environnement de Développement

### Prérequis

- [Node.js](https://nodejs.org/) (v18 ou supérieur)
- [Docker](https://www.docker.com/) et [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

### Installation

1. Cloner le dépôt:
   ```bash
   git clone https://github.com/matteobelin/Budget.git
   cd budget-app
   ```

2. Lancer les services avec Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. Installer les dépendances et démarrer l'API:
   ```bash
   cd api
   npm install
   npm run dev
   ```

4. Dans un nouveau terminal, installer les dépendances et démarrer le frontend:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. L'application sera accessible à l'adresse [http://localhost:5173](http://localhost:5173)

### Configuration des Variables d'Environnement

Créez un fichier `.env` dans le dossier `api` avec les variables suivantes:

```
# MongoDB
MONGODB_URI=mongodb://localhost:27017/budget

# Neo4j
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=passw0rd

# Redis
REDIS_URL=redis://localhost:6379

# ChromaDB
CHROMA_URL=http://localhost:8000

# JWT
JWT_SECRET=votre_secret_jwt
JWT_EXPIRES_IN=7d

# API
PORT=3000
```

## Règles de Contribution

### Workflow Git

1. Créez une branche pour chaque nouvelle fonctionnalité ou correction:
   ```bash
   git checkout -b feature/nom-de-la-fonctionnalite
   # ou
   git checkout -b fix/nom-du-correctif
   ```

2. Effectuez vos modifications et commitez régulièrement:
   ```bash
   git add .
   git commit -m "Description claire des modifications"
   ```

3. Poussez votre branche vers le dépôt distant:
   ```bash
   git push origin feature/nom-de-la-fonctionnalite
   ```

4. Créez une Pull Request sur GitHub pour faire réviser votre code

### Conventions de Commit

Nous utilisons des messages de commit conventionnels pour faciliter la génération automatique de changelogs:

- `feat:` - Nouvelle fonctionnalité
- `fix:` - Correction de bug
- `docs:` - Modifications de la documentation
- `style:` - Formatage, point-virgules manquants, etc. (pas de changement de code)
- `refactor:` - Refactorisation du code
- `test:` - Ajout ou correction de tests

Exemple:
```
feat/date-filter : ajouter la fonctionnalité de filtrage par date
```

### Pull Requests

- Chaque PR doit être liée à une issue
- Incluez une description claire de ce que fait la PR
- Assurez-vous que tous les tests passent
- Le merge sera effectué par l'approbateur de la PR après revue

### Standards de Code

- Utilisez ESLint et Prettier pour formater votre code
- Suivez les principes SOLID et les bonnes pratiques de programmation
- Documentez les fonctions et composants complexes
