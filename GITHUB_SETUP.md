# Guide de Publication sur GitHub

Ce guide te montre comment publier ton projet sur GitHub de manière sécurisée.

## ✅ Vérifications de Sécurité Effectuées

- ✓ `.gitignore` créé pour exclure fichiers sensibles
- ✓ `.claude/` et `.superpowers/` retirés du suivi Git
- ✓ `.DS_Store` retiré du suivi Git
- ✓ Aucun fichier d'environnement (.env) présent
- ✓ Aucune clé API ou token dans le code
- ✓ Aucune information personnelle dans les commits

## 📋 Étapes pour Publier

### 1. Créer le Dépôt sur GitHub

1. Va sur https://github.com/new
2. Remplis les informations :
   - **Repository name** : `systeme-solaire-3d` (ou autre nom de ton choix)
   - **Description** : "Simulation interactive et scientifique du système solaire en 3D"
   - **Visibilité** : ✅ **Public**
   - **Ne PAS** initialiser avec README, .gitignore ou licence (on les a déjà)

3. Clique sur "Create repository"

### 2. Lier ton Dépôt Local à GitHub

Copie et exécute les commandes affichées sur GitHub (section "...or push an existing repository from the command line") :

```bash
cd "/Users/arielnoteris/Desktop/Projet/ES/Representation Systeme Solaire"

# Ajouter l'origine distante (remplace USERNAME par ton nom d'utilisateur GitHub)
git remote add origin https://github.com/USERNAME/systeme-solaire-3d.git

# Renommer la branche principale (si nécessaire)
git branch -M main

# Pousser vers GitHub
git push -u origin main
```

### 3. Configurer le Dépôt (Optionnel)

Sur la page GitHub de ton projet :

#### Ajouter des Topics
Settings → About (section en haut) → Ajouter des topics :
- `threejs`
- `solar-system`
- `3d-simulation`
- `javascript`
- `webgl`
- `astronomy`
- `educational`

#### Activer GitHub Pages (pour héberger le site)
Settings → Pages → Source : `main` branch → `/` (root) → Save

Ton site sera accessible à : `https://USERNAME.github.io/systeme-solaire-3d/`

### 4. Vérification Post-Publication

Après le push, vérifie sur GitHub :

✓ Le README.md s'affiche correctement
✓ Les images dans `img/` sont présentes
✓ Le fichier `.gitignore` est là
✓ Les dossiers `.claude/` et `.superpowers/` n'apparaissent PAS
✓ Aucun fichier `.DS_Store` visible

## 🔒 Rappels de Sécurité

### ❌ À NE JAMAIS Commit
- Fichiers `.env` ou variables d'environnement
- Clés API, tokens, mots de passe
- Informations personnelles (emails, adresses, etc.)
- Fichiers de configuration IDE personnels
- Fichiers système (.DS_Store, Thumbs.db)

### ✅ Bonnes Pratiques
- Toujours vérifier `git status` avant `git commit`
- Utiliser `git diff --cached` pour voir ce qui sera commité
- Garder `.gitignore` à jour
- Ne jamais forcer un push (`--force`) sur un dépôt public sans raison

## 🔄 Mises à Jour Futures

Quand tu fais des changements :

```bash
# Voir les fichiers modifiés
git status

# Voir les changements
git diff

# Ajouter les fichiers modifiés
git add main.js style.css  # ou autres fichiers

# Commit avec message descriptif
git commit -m "feat: ajout de nouvelle fonctionnalité"

# Pousser vers GitHub
git push
```

## 📊 Statistiques et Visibilité

Pour rendre ton projet plus visible :

1. **README attractif** : Déjà fait ✓
2. **LICENSE claire** : MIT License ✓
3. **Topics pertinents** : À ajouter
4. **GitHub Pages** : Optionnel mais recommandé
5. **Screenshots** : Ajoute des captures d'écran dans le README
6. **GIF démo** : Un GIF animé montre bien les fonctionnalités

## 🆘 En Cas de Problème

### J'ai commité un fichier sensible par erreur

```bash
# Retirer du dernier commit (avant push)
git rm --cached fichier_sensible
git commit --amend -m "Remove sensitive file"

# Retirer de l'historique (après push - plus complexe)
# Contacte-moi pour assistance
```

### Je veux changer le message du dernier commit

```bash
# Avant push
git commit --amend -m "Nouveau message"

# Après push (éviter si possible)
git commit --amend -m "Nouveau message"
git push --force
```

## ✨ C'est Prêt !

Ton projet est maintenant sécurisé et prêt à être partagé avec le monde ! 🌍

Aucune information sensible, configuration locale ou donnée personnelle ne sera exposée.
