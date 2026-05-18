# Design Spec — Système Solaire : Corrections physiques + Refonte UI

**Date :** 2026-04-03
**Scope :** `main.js`, `style.css`, `index.html`
**Statut :** Approuvé

---

## 1. Corrections physiques

### 1.1 Échelle des planètes

Référence : Terre = rayon 1.3 (inchangé). Les autres planètes sont rescalées selon leur diamètre réel relatif à la Terre, avec compression logarithmique pour les géantes gazeuses afin qu'elles restent visibles sans écraser la scène.

| Clé | Nom | Rayon actuel | Rayon cible | Justification |
|---|---|---|---|---|
| `mercure` | Mercure | 0.8 | **0.5** | 0.383× Terre |
| `venus` | Vénus | 1.2 | **1.23** | 0.949× Terre |
| `terre` | Terre | 1.3 | 1.3 | Référence |
| `mars` | Mars | 1.0 | **0.7** | 0.532× Terre |
| `jupiter` | Jupiter | 4.0 | **5.5** | 11.2× → compressé |
| `saturne` | Saturne | 3.5 | **4.5** | 9.45× → compressé |
| `uranus` | Uranus | 2.2 | **2.8** | 4.01× → compressé |
| `neptune` | Neptune | 2.1 | **2.7** | 3.88× → compressé |

Le Soleil reste à rayon 8 (ratio réel serait ~141 si Terre=1.3 — visuellement inutilisable).

### 1.2 Rotations — Approche pivot axial

**Problème actuel :** La logique dans `animate()` fait `rotation.set(0,0,0)` puis `rotateZ(tilt)` puis `rotateOnAxis(...)` à chaque frame. Les anneaux sont enfants du `mesh` et héritent du spin complet → ils tournent dans tous les sens.

**Solution : Insérer un `axialPivot` entre `orbitContainer` et `mesh`.**

Structure cible par planète :
```
orbitContainer          (inclinaison orbitale, inchangé)
  └── axialPivot        (rotation.z = axialTilt en radians, FIXE, posé une fois à la création)
      ├── mesh          (rotation.y += delta × speed × direction, SEULEMENT ça)
      └── ring          (rotation.x = π/2, STATIQUE — enfant de axialPivot, pas de mesh)
```

**Changements dans `createPlanets()` :**
- Créer `axialPivot = new THREE.Object3D()` par planète
- `axialPivot.rotation.z = THREE.MathUtils.degToRad(data.axialTilt)`
- `axialPivot.position` suit la planète (mis à jour dans `updatePlanetPosition`)
- `mesh` est enfant de `axialPivot` avec `rotation = (0,0,0)` à la création
- Les anneaux (`createRings`) et la lune (`createMoon`) passent en enfants de `axialPivot`
- Stocker `axialPivot` dans `planets[key]`

**Changements dans `animate()` :**
- Supprimer les 3 lignes `rotation.set / rotateZ / rotateOnAxis`
- Remplacer par : `planet.mesh.rotation.y += delta * rotationSpeed * direction`
- `updatePlanetPosition` met à jour `axialPivot.position` (et non plus `mesh.position` directement)

**Changements dans `updateVelocityArrows()` :**
- `planet.mesh.position` est désormais toujours `(0,0,0)` en espace local (le mesh est centré dans l'axialPivot)
- Remplacer `const pos = planet.mesh.position.clone()` par `const pos = planet.axialPivot.position.clone()`
- La direction tangente (`dx`, `dz`) et le calcul de vitesse (`r`) restent inchangés mais se basent sur `pos` (position de l'axialPivot)

**Cas particuliers :**
- **Vénus** (`rotationPeriod = -243`) : `direction = -1` → rotation rétrograde ✓
- **Uranus** (`rotationPeriod = -0.72`, `axialTilt = 97.77°`) : couché sur le côté, anneaux quasi verticaux ✓
- **Saturne** (`axialTilt = 26.73°`) : anneaux inclinés à 26.73° par rapport au plan orbital ✓
- **Lune** : enfant de `axialPivot` de la Terre, orbite synchrone inchangée ✓

---

## 2. Refonte UI

### 2.1 Architecture des panneaux

4 panneaux rétractables, chacun dans une zone dédiée. **Règle fondamentale : aucun chevauchement possible**, les zones sont calculées statiquement pour ne jamais se croiser même si tous les 4 sont ouverts.

| Panel | Bord | Zone CSS | Contenu |
|---|---|---|---|
| ① Info planète | Gauche | `top:18% → bottom:18%`, largeur 200px | Nom, type, stats, lock |
| ② Vitesse | Droite-haut | `top:8%`, hauteur 90px, largeur 90px | Valeur × , boutons − + |
| ③ Options | Droite-bas | `top: calc(8% + 98px)`, hauteur 80px, largeur 90px | Toggles Orbites / Labels / Vitesse |
| ④ Planètes | Bas | `left:200px → right:90px`, hauteur 62px | 9 dots cliquables |

### 2.2 Comportement rétractable

Chaque panneau a deux états : **réduit** (seul un onglet étroit dépasse du bord) et **déployé** (panneau complet visible).

- **Transition :** `transform: translateX/Y` animé en CSS, `transition: 0.35s cubic-bezier(0.4, 0, 0.2, 1)`
- **Onglet réduit :** bande de ~20px avec texte vertical (`writing-mode: vertical-lr`), toujours visible
- **Toggle :** clic sur l'onglet → déploie ; clic sur le bouton "REFERMER" dans le panel → réduit
- Tous les 4 peuvent être ouverts ou fermés indépendamment

### 2.3 Panel ① — Info planète

- Accent coloré dynamique : la couleur du nom et de la bordure change selon la planète active (`data.color`)
- Contenu : point coloré + nom (Orbitron, bold) + type + liste de stats (`display:flex justify-content:space-between`)
- Indicateur 🔒 intégré dans la ligne du nom quand la planète est verrouillée
- Hint "Cliquez à nouveau pour déverrouiller" en bas, séparé par une bordure
- Affiché au survol (hover), verrouillé au clic sur la planète (comportement existant conservé)

### 2.4 Panel ② — Vitesse

- Affiche valeur actuelle (`1×`, `2×`, `0.5×`…) en grand (Orbitron 1.2rem, teal)
- Boutons `−` et `+` (remplacent `◀◀` / `▶▶`)
- Plage : 0.125× → 64× (inchangée)

### 2.5 Panel ③ — Options

- 3 toggles verticaux : **ORBITES**, **LABELS**, **VITESSE →**
- État actif : fond teal semi-transparent + bordure teal
- État inactif : fond bleu très sombre + couleur atténuée

### 2.6 Panel ④ — Sélecteur planètes

- 9 points colorés (couleur = `data.color` de chaque planète) + nom en dessous (Orbitron, 0.42rem)
- Planète active : point avec glow + nom blanc
- Clic : zoom caméra vers la planète (animation ease-out cubic 3s existante réutilisée) + verrouillage du panel info
- Hover sur un point : légère augmentation d'opacité (pas de tooltip, le nom est déjà affiché)

### 2.7 Suppression / nettoyage HTML

- Supprimer `id="controls"` (la barre bas actuelle) de `index.html`
- Les boutons `speed-up`, `speed-down`, `toggle-orbits`, `toggle-labels`, `toggle-velocity` sont recréés dans les nouveaux panneaux
- Les IDs peuvent être conservés pour ne pas casser les event listeners JS existants

### 2.8 CSS

- Nouvelles classes : `.hud-panel`, `.hud-tab`, `.hud-panel--open` (toggle via JS)
- Variables CSS pour les couleurs de planètes (optionnel, ou inline style via JS)
- Conserver les fonts Orbitron + Exo 2, le thème dark, les gradients existants
- Transition sur tous les états hover des boutons et dots (déjà partiellement en place)

---

## 3. Fichiers modifiés

| Fichier | Modifications |
|---|---|
| `main.js` | `PLANETS_DATA` radii, `createPlanets()` structure pivot, `animate()` rotation, `updatePlanetPosition()`, `createVelocityArrows()`, event listeners nouveaux IDs |
| `style.css` | Remplacer `#controls`, ajouter `.hud-panel`, `.hud-tab`, états open/closed, transition slide |
| `index.html` | Remplacer `#controls` par les 4 nouveaux divs de panneaux |

---

## 4. Ce qui ne change pas

- Mécanique orbitale (ellipses de Kepler, 2ème loi)
- Champ d'étoiles
- Ceinture d'astéroïdes et de Kuiper
- Glow / corona du Soleil
- Écran d'introduction
- OrbitControls (zoom, pan, rotate)
- Raycaster hover/click
- Textures photo-réalistes et fallback procédural
