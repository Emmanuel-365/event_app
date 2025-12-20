# Plateforme de Gestion d'Événements

Ce projet est une application web full-stack conçue pour la gestion complète d'événements. Elle permet aux utilisateurs de créer, découvrir, s'inscrire et gérer des événements. La plateforme intègre des fonctionnalités pour différents rôles d'utilisateurs : administrateurs, organisateurs et participants.

## Philosophie du Projet : Conteneurisation

L'ensemble de l'application est conçu pour être exécuté dans des conteneurs Docker, à la fois pour le développement local et pour le déploiement en production. Cette approche garantit une parfaite cohérence entre les environnements et simplifie grandement la configuration.

-   **Développement local** : Le fichier `docker-compose.yml` orchestre tous les services nécessaires (backend, frontend, base de données).
-   **Déploiement en production** : Le fichier `render.yaml` sert de plan ("Blueprint") pour déployer l'application sur la plateforme Render en utilisant les mêmes conteneurs Docker.

## Table des matières

- [Stack Technique](#stack-technique)
- [Installation et Lancement (Docker)](#installation-et-lancement-avec-docker-recommandé)
- [Architecture de Conteneurisation](#architecture-de-conteneurisation)
- [Déploiement sur Render](#déploiement-sur-render)
- [Développement Local (Alternative sans Docker)](#développement-local-alternative-sans-docker)

## Stack Technique

| Domaine | Technologie | Description |
|---|---|---|
| **Backend** | Java, Spring Boot | Fournit une API RESTful robuste pour la logique métier. |
| **Frontend** | TypeScript, React | Interface utilisateur moderne et réactive construite avec Vite. |
| **Base de données** | PostgreSQL | SGBD relationnel, conteneurisé pour le développement. |
| **Styling** | Tailwind CSS | Framework CSS "utility-first". |
| **Conteneurisation**| Docker / Docker Compose | Pour l'isolation des environnements et la simplification du déploiement. |
| **Déploiement** | Render | Déploiement automatisé via un plan "Infrastructure as Code". |

## Installation et Lancement avec Docker (Recommandé)

C'est la méthode la plus simple et la plus fiable pour lancer l'ensemble de l'application en local.

### Prérequis

-   [Git](https://git-scm.com/)
-   [Docker](https://www.docker.com/get-started)
-   [Docker Compose](https://docs.docker.com/compose/install/)

### Étapes

1.  **Clonez le dépôt :**
    ```bash
    git clone <URL_DU_DEPOT>
    cd projet_CC
    ```

2.  **Lancez les conteneurs :**
    Cette commande va construire les images Docker (si elles n'existent pas) et démarrer tous les services.
    ```bash
    docker compose up --build -d
    ```

3.  **Accédez à l'application :**
    -   **Frontend** : [http://127.0.0.1:5173](http://127.0.0.1:5173)
    -   **API Backend** : [http://127.0.0.1:8080](http://127.0.0.1:8080)

Pour arrêter tous les services, exécutez `docker compose down`. Pour préserver les données de la base de données, ajoutez `-v` : `docker compose down -v`.

## Architecture de Conteneurisation

### `docker-compose.yml`

Ce fichier définit les 3 services qui composent l'application en environnement de développement :

-   `postgres` :
    -   Image : `postgres:16`.
    -   Rôle : Base de données de l'application.
    -   Persistance : Les données sont stockées dans un volume Docker nommé `postgres_data` pour survivre aux redémarrages des conteneurs.
    -   Santé : Un `healthcheck` s'assure que le backend ne démarre que lorsque la base de données est prête à accepter des connexions.

-   `backend` :
    -   Construction : Bâtit une image Docker à partir du `Dockerfile` situé dans `./projet_331`.
    -   Dépendance : Ne démarre qu'après que le service `postgres` soit déclaré "healthy".
    -   Configuration : Les variables d'environnement (URL de la base de données, identifiants) sont injectées pour se connecter au service `postgres`.

-   `frontend` :
    -   Construction : Bâtit une image à partir du `Dockerfile` dans `./frontend`.
    -   Configuration au build : Une `VITE_API_URL` (ici, `http://127.0.0.1:8080`) est passée à Vite au moment de la construction pour que le frontend sache où contacter l'API backend.
    -   Serveur : Le résultat du build (fichiers statiques HTML/CSS/JS) est servi par un serveur web Nginx léger et performant.

### `Dockerfile` (Backend & Frontend)

Les deux `Dockerfile` utilisent une approche de **construction multi-étapes (multi-stage build)** :

1.  **Étape `build`** : Un premier conteneur (ex: `maven:3.8.5-openjdk-17` pour le backend, `node:20` pour le frontend) est utilisé pour compiler le code source et construire l'artefact de production (`.jar` pour le backend, fichiers statiques pour le frontend).
2.  **Étape finale** : L'artefact est copié dans une image finale minimale (ex: `eclipse-temurin:17-jre` ou `nginx:alpine`). Cela produit une image légère, sécurisée et optimisée pour l'exécution, sans les outils de build.

## Déploiement sur Render

Le déploiement est entièrement automatisé grâce au fichier `render.yaml`.

-   **Services** : Il définit deux services web (`backend` et `frontend`) basés sur leurs `Dockerfile` respectifs.
-   **Base de Données** : Pour la production, vous devez créer une base de données PostgreSQL directement depuis le tableau de bord de Render. Le `render.yaml` contient des instructions commentées pour lier cette base de données à votre service backend.
-   **Liaison des Services** : La magie opère grâce aux variables d'environnement dynamiques de Render :
    -   L'URL publique du frontend est automatiquement fournie au backend (`app.frontend-url`).
    -   Plus important, la commande `dockerBuildCommand` du service frontend injecte l'URL publique du backend (`${backend.url}`) au moment du build du frontend. Le frontend est ainsi automatiquement configuré pour communiquer avec son API en production, sans aucune modification manuelle du code.

## Développement Local (Alternative sans Docker)

Cette méthode est utile pour travailler sur un seul service avec rechargement à chaud (hot-reloading).

**Prérequis** :
-   [Node.js](https://nodejs.org/) (v20+) et npm
-   [JDK](https://www.oracle.com/java/technologies/downloads/) (v17+) et [Maven](https://maven.apache.org/download.cgi)

**Important** : Le service sur lequel vous ne travaillez pas (ainsi que la base de données) doit quand même être lancé via Docker.

**Exemple : Travailler sur le frontend avec le backend conteneurisé**

1.  Lancez le backend et la base de données :
    ```bash
    docker compose up -d backend postgres
    ```
2.  Ouvrez un nouveau terminal et naviguez vers le répertoire du frontend :
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    Le serveur de développement Vite démarrera sur `http://127.0.0.1:5173` et communiquera avec le backend tournant dans Docker. L'inverse est bien sûr possible si vous souhaitez travailler sur le backend.
