# Simulation du Système Solaire 3D

Une simulation interactive et scientifiquement exacte du système solaire en 3D, construite avec Three.js et JavaScript vanilla.

![Système Solaire 3D](https://img.shields.io/badge/Three.js-0.160.0-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![License](https://img.shields.io/badge/license-MIT-green)

## 🌟 Caractéristiques

### Simulation Scientifique
- **Orbites képlériennes** : Calcul précis des orbites elliptiques avec excentricité réelle
- **2ème loi de Kepler** : Vitesse orbitale variable selon la distance au Soleil
- **Rotations réalistes** : Périodes de rotation et inclinaisons axiales authentiques
- **Données NASA/JPL** : Textures photographiques 2K pour toutes les planètes

### Fonctionnalités Interactives
- 🎬 **Animation d'introduction cinématique** : Voyage de 7 secondes depuis l'extérieur du système
- ⏸️ **Contrôle du temps** : Pause, ralentissement (×0.125) et accélération (×64)
- 🖱️ **Navigation 3D** : OrbitControls pour explorer librement
- 📊 **Informations détaillées** : Cliquez sur n'importe quel corps céleste pour voir ses caractéristiques
- 👁️ **Options d'affichage** : Orbites, labels, vecteurs de vitesse

### Interface Professionnelle
- Design scientifique moderne avec palette de bleus professionnels
- Menu burger avec documentation intégrée
- Responsive (desktop et mobile)
- Animations fluides 60 FPS

## 🚀 Démarrage Rapide

### Prérequis
Un serveur HTTP local (requis pour le chargement des textures et modules ES6)

### Installation et Lancement

**Option 1 : Python** (recommandé)
```bash
python3 -m http.server 8080
```

**Option 2 : Node.js**
```bash
npx serve .
```

Puis ouvrez http://localhost:8080 dans votre navigateur.

> ⚠️ **Important** : Ne pas ouvrir `index.html` directement (`file://`) - cela échouera à cause des restrictions CORS.

## 📁 Structure du Projet

```
.
├── index.html          # Structure HTML et UI
├── main.js             # Logique de simulation (2300+ lignes)
├── style.css           # Styles et animations
├── img/                # Textures NASA/JPL 2K
│   ├── 2k_sun.jpg
│   ├── 2k_mercury.jpg
│   ├── 2k_venus_surface.jpg
│   └── ...
└── docs/               # Documentation technique
```

## 🛠️ Technologies

- **Three.js 0.160.0** : Rendu 3D WebGL
- **JavaScript ES6+** : Modules, classes, async/await
- **CSS3** : Variables, animations, media queries
- **Aucune dépendance** : Pas de build, pas de npm

## 🎓 Aspects Scientifiques

### Modèle Orbital
- Éléments orbitaux kepleriens (demi-grand axe, excentricité, inclinaison)
- Calcul de position sur ellipse avec anomalie vraie
- Conservation du moment cinétique (2ème loi de Kepler)

### Échelles
- **Distances** : Compressées logarithmiquement pour visibilité
- **Tailles** : Légèrement exagérées pour perception
- **Vitesses** : Accélérées mais proportionnelles

### Données Réelles
- Périodes orbitales en jours terrestres
- Périodes de rotation (avec rétrogrades pour Vénus et Uranus)
- Inclinaisons axiales en degrés
- Compositions atmosphériques

## 📚 Documentation

### Fichiers Importants
- `CLAUDE.md` : Guide pour les développeurs IA
- `docs/superpowers/specs/` : Spécifications de conception
- `docs/superpowers/plans/` : Plans d'implémentation

### Sections du Code (main.js)
| Section | Lignes | Description |
|---------|--------|-------------|
| PLANETS_DATA | 8-230 | Configuration des planètes |
| Textures | 232-268 | URLs et chargement |
| Init | 700-750 | Configuration Three.js |
| Animation | 1743-1850 | Boucle de rendu |
| UI | 1890-2000 | Gestionnaires d'événements |

## 🎮 Contrôles

### Navigation
- **Clic gauche + glisser** : Rotation de la caméra
- **Molette** : Zoom avant/arrière
- **Clic droit + glisser** : Pan (déplacement latéral)

### Interface
- **Clic sur planète/Soleil** : Afficher informations complètes
- **Menu burger** : Contrôles de simulation
- **ESPACE / ECHAP** : Skip animation d'intro

## 🤝 Contribution

Les contributions sont les bienvenues ! 

### Comment contribuer
1. Fork le projet
2. Créer une branche (`git checkout -b feature/amelioration`)
3. Commit vos changements (`git commit -m 'Ajout fonctionnalité'`)
4. Push vers la branche (`git push origin feature/amelioration`)
5. Ouvrir une Pull Request

### Idées d'amélioration
- Ajout de comètes et astéroïdes nommés
- Mode comparaison (plusieurs planètes côte à côte)
- Export de trajectoires au format CSV
- Support VR/AR
- Modes historiques (système solaire à différentes époques)

## 📝 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- **NASA/JPL** : Textures planétaires haute résolution
- **Three.js** : Bibliothèque 3D exceptionnelle
- **Claude Code** : Assistant de développement IA

## 📧 Contact

Pour questions, suggestions ou bugs, ouvrez une issue sur GitHub.

---

**Note scientifique** : Cette simulation est éducative et représente le système solaire avec des compromis entre exactitude scientifique et lisibilité visuelle. Les échelles de distance et de taille sont adaptées pour permettre une exploration interactive.
