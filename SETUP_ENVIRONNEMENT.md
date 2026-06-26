# P2 — Guide d'installation de l'environnement (Windows)

Outils nécessaires pour compiler, exécuter et tester le projet EtuBibliothèque.

## 1. Installer les outils (PowerShell en administrateur, via winget)

```powershell
winget install --id EclipseAdoptium.Temurin.21.JDK -e   # JDK 21
winget install --id Apache.Maven -e                      # Maven 3.9+
winget install --id Docker.DockerDesktop -e              # Docker Desktop (MySQL)
winget install --id OpenJS.NodeJS.LTS -e                 # Node.js LTS (Angular/Jest/Cypress)
winget install --id Git.Git -e                           # Git (si absent)
```

Ferme puis rouvre le terminal après installation.

## 2. Vérifier les versions

```powershell
java -version      # doit afficher 21.x
mvn -version       # 3.9+ et JDK 21
docker --version   # Docker présent + Docker Desktop lancé
node -v ; npm -v   # Node 18/20/22 LTS
```

> Important : JDK 21 obligatoire (le back-end ne compile pas en JDK 11/17).
> Lance **Docker Desktop** avant le back-end (la base MySQL démarre via `compose.yaml`).

## 3. Back-end (Spring Boot)

```powershell
cd "etudiant-app\back"
mvn spring-boot:run        # démarre MySQL (Docker) + l'API sur http://localhost:8080
```

Tests + couverture (rapport JaCoCo) :

```powershell
mvn verify
# Rapport HTML : back\target\site\jacoco\index.html
```

## 4. Front-end (Angular)

```powershell
cd "etudiant-app\front"
npm install
npm start                  # http://localhost:4200 (proxy vers le back via proxy.conf.json)
```

Tests unitaires (Jest) et E2E (Cypress) :

```powershell
npm test                   # Jest + couverture
npx cypress open           # E2E (le back et le front doivent tourner)
```

## 5. Dépôt GitHub (livrable)

Le livrable P2 = **un dépôt GitHub** contenant back + front + tests + rapports de couverture.

```powershell
cd "etudiant-app"
git init
git add .
git commit -m "feat: EtuBibliothèque - auth, CRUD étudiants et tests"
# Crée un repo VIDE sur github.com (sans README), puis :
git branch -M main
git remote add origin https://github.com/<ton-compte>/etudiant-app.git
git push -u origin main
```

Nom du livrable à déposer sur OpenClassrooms : `Ilyasse_<Prenom>_1_repo_062026` (zip ou lien).

> Je ne peux pas créer de compte GitHub ni pousser à ta place : ces deux étapes sont manuelles.
