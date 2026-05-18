# Animation d'Introduction Cinématique - Design Document

**Date:** 2026-05-18  
**Statut:** Validé  
**Auteur:** Claude Code

## Objectif

Moderniser l'animation de départ du Système Solaire 3D pour créer une expérience professionnelle, élégante et cinématique. L'animation doit être sobre, skipable, et établir immédiatement l'échelle du système solaire à travers un voyage fluide de caméra.

## Principe Directeur

**Élégance sobre > Extravagance**  
Chaque effet visuel doit servir l'immersion sans surcharger. L'utilisateur doit ressentir l'échelle cosmique à travers la fluidité du mouvement plutôt que par des effets tape-à-l'œil.

## Vue d'Ensemble

- **Durée totale:** 7 secondes
- **Skipable:** Oui (ESPACE, ECHAP, ou clic)
- **Trajectoire:** Voyage depuis l'extérieur du système solaire (au-delà de Neptune) vers la position finale standard
- **Esthétique:** Cinématique spatiale élégante avec effets subtils

## Architecture Technique

### Structure des Phases

L'animation se divise en 3 phases avec des courbes d'easing distinctes pour créer un rythme cinématique naturel.

```
Phase 1: Départ lointain (0-2s)     - ease-in
Phase 2: Voyage accéléré (2-5s)     - linear/ease-in-out
Phase 3: Arrivée (5-7s)              - ease-out
```

### Position de Caméra

**Position initiale:**
- x: 0
- y: 300 (vue élevée)
- z: 500 (très loin, au-delà de Neptune)
- lookAt: (0, 0, 0) - centre du système solaire

**Position finale:**
- x: 80
- y: 60
- z: 120
- lookAt: (0, 0, 0)

### Fonctionnalité Skip

**Why:** Les utilisateurs récurrents ne devraient pas être forcés de regarder l'animation à chaque visite. Le skip améliore l'expérience sans compromettre l'impression initiale.

**How to apply:**

1. **Indicateur visuel:**
   - Texte: "Appuyez sur ESPACE ou cliquez pour passer"
   - Position: Bas-droite, petite taille (0.75rem)
   - Apparition: fade-in après 1s (laisse le temps d'apprécier le départ)
   - Style: Opacité 0.5, police Exo 2

2. **Déclencheurs:**
   - Touche ESPACE
   - Touche ECHAP
   - Clic n'importe où sur l'écran

3. **Comportement:**
   - Transition douce vers position finale en 0.5s (pas de téléportation brutale)
   - Tous les effets (particules, labels, compteur) disparaissent immédiatement en fade
   - HUD panels apparaissent normalement

## Phases Détaillées

### Phase 1: Départ Lointain (0-2s)

**Objectif:** Établir le contexte spatial et lancer le voyage.

**Caméra:**
- Commence à la position initiale (0, 300, 500)
- Mouvement lent avec ease-in
- Progression: 0-20% de la distance totale

**Effets visuels:**
- Écran d'intro (#intro-screen) commence son fade-out (1.5s)
- Champ d'étoiles visible avec légère parallaxe naturelle (déjà implémenté dans Three.js)
- Compteur de distance fade-in en haut à droite après 0.5s

**Compteur de distance:**
- Format: "Distance: 450 UA"
- Police: Monospace (Space Mono ou Courier New)
- Taille: 0.8rem
- Position: top: 5%, right: 5%
- Opacité: 0.6
- Couleur: rgba(255, 255, 255, 0.7)

### Phase 2: Voyage Accéléré (2-5s)

**Objectif:** Phase d'action principale avec vitesse maximale et effets de voyage.

**Why:** C'est le moment le plus cinématique où l'utilisateur ressent vraiment le voyage à travers l'espace. Les effets subtils renforcent la sensation de vitesse sans devenir distrayants.

**Caméra:**
- Accélération progressive (ease-in-out)
- Parcourt 60% de la distance totale
- Vitesse maximale atteinte vers 3.5s

**Effet Warp sur les Étoiles:**
- **Implémentation:** Modifier le shader des étoiles pour étirer légèrement les points en fonction de la vélocité de caméra
- **Intensité:** Maximum 20-30% d'étirement (subtil, pas de lignes épaisses)
- **Direction:** Opposée à la direction du mouvement de caméra
- **Timing:** Monte progressivement de 2s à 3.5s, plateau jusqu'à 4.5s, puis descend
- **Opacité:** Les étoiles étirées ont une opacité légèrement réduite (0.6) pour rester discrètes

**Labels de Planètes:**
- **Planètes affichées:** Maximum 2-3 (ex: Jupiter à ~3s, Terre à ~4.5s)
- **Critère d'apparition:** Quand la caméra passe à moins de 40 unités de la planète
- **Animation:**
  - Fade-in: 0.3s
  - Visible: 1s
  - Fade-out: 0.3s
- **Style:**
  - Police: Orbitron, 1rem
  - Couleur: blanc avec glow subtil (text-shadow: 0 0 10px rgba(255,255,255,0.5))
  - Position: Au-dessus de la planète, légèrement décalé pour ne pas bloquer la vue

**Compteur de Distance:**
- Défile plus rapidement
- Les unités décrémentent de manière fluide (interpolation)
- Exemple: "450 UA" → "150 UA" → "20 UA"

**Bloom sur le Soleil:**
- **Intensité:** Augmente progressivement de 0 à 0.3
- **Why:** Le bloom donne de la présence au Soleil et guide visuellement l'œil vers le centre du système solaire sans être aveuglant
- **How to apply:** Post-processing UnrealBloomPass de Three.js avec strength: 0.3, radius: 0.5

### Phase 3: Arrivée et Stabilisation (5-7s)

**Objectif:** Décélération fluide et activation progressive de l'interface utilisateur.

**Caméra:**
- Décélération douce (ease-out cubique)
- Parcourt les 20% de distance restants
- Arrive précisément à (80, 60, 120)
- lookAt reste fixé sur (0, 0, 0)

**Désactivation des Effets:**
- Effet warp disparaît progressivement (5-6s)
- Compteur de distance: fade-out à 6s
- Bloom: reste actif (fait partie de la scène finale)
- Labels: disparaissent naturellement après leur temps de visibilité

**Activation UI:**
- À 6.5s: HUD panels slide-in depuis leurs positions cachées
- À 7s: OrbitControls s'active, animation terminée
- Indicateur de skip disparaît en fade

## Spécifications Techniques d'Implémentation

### Modifications JavaScript (main.js)

**Variables globales à ajouter:**
```javascript
let cinematicAnimation = null;
let skipIndicator = null;
```

**Structure de l'objet cinematicAnimation:**
```javascript
{
  active: boolean,
  startTime: number,
  duration: 7000,
  startPos: { x, y, z },
  endPos: { x, y, z },
  currentPhase: 1|2|3,
  distanceCounter: HTMLElement,
  warpIntensity: number,
  skipped: boolean
}
```

**Fonctions à créer/modifier:**

1. `startCinematicAnimation()` - Remplace `startCameraAnimation()`
   - Initialise l'objet cinematicAnimation
   - Crée le compteur de distance
   - Crée l'indicateur de skip
   - Configure les event listeners pour skip

2. `updateCinematicAnimation()` - Remplace `updateCameraAnimation()`
   - Calcule la phase actuelle selon le temps
   - Met à jour la position de caméra avec easing approprié
   - Gère les effets de chaque phase
   - Vérifie les labels de planètes à afficher

3. `skipCinematicAnimation()`
   - Transition douce vers position finale (0.5s)
   - Nettoyage de tous les effets temporaires
   - Activation immédiate des controls et HUD

4. `updateWarpEffect(intensity)`
   - Modifie l'opacité et la taille des particules d'étoiles selon l'intensité
   - Intensité: 0 (aucun effet) à 1 (maximum)

5. `showPlanetLabel(planetName, duration)`
   - Crée un label HTML temporaire
   - Positionne au-dessus de la planète en coordonnées écran
   - Gère l'animation fade-in/out

6. `updateDistanceCounter(distanceInAU)`
   - Met à jour le texte du compteur avec interpolation
   - Format avec arrondi approprié

### Modifications CSS (style.css)

**Nouveau: Indicateur de skip**
```css
#skip-indicator {
  position: fixed;
  bottom: 5%;
  right: 5%;
  font-family: 'Exo 2', sans-serif;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  opacity: 0;
  transition: opacity 0.5s ease;
  z-index: 1001;
}
```

**Nouveau: Compteur de distance**
```css
#distance-counter {
  position: fixed;
  top: 5%;
  right: 5%;
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  opacity: 0;
  transition: opacity 0.5s ease;
  z-index: 1001;
  letter-spacing: 1px;
}
```

**Nouveau: Labels de planètes temporaires**
```css
.temp-planet-label {
  position: fixed;
  font-family: 'Orbitron', sans-serif;
  font-size: 1rem;
  color: white;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  pointer-events: none;
  z-index: 1001;
  opacity: 0;
  transition: opacity 0.3s ease;
}
```

### Courbes d'Easing

**Phase 1 (ease-in):**
```javascript
t => t * t * t  // cubic ease-in
```

**Phase 2 (ease-in-out):**
```javascript
t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
```

**Phase 3 (ease-out):**
```javascript
t => 1 - Math.pow(1 - t, 3)  // cubic ease-out
```

### Post-Processing (Bloom)

**Dépendances Three.js nécessaires:**
- EffectComposer
- RenderPass
- UnrealBloomPass

**Configuration:**
```javascript
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.3,  // strength (subtil)
  0.5,  // radius
  0.85  // threshold
);
```

**Application sélective:**
Le bloom doit s'appliquer uniquement au Soleil. Utiliser une approche selective bloom avec deux passes de rendu.

## Points de Vigilance

### Performance

- L'effet warp ne doit pas créer de nouveaux objets Three.js à chaque frame
- Les labels de planètes doivent être réutilisés (pool) plutôt que créés/détruits
- Le bloom en post-processing peut impacter les performances sur mobile - prévoir une version simplifiée ou un fallback

### UX

- L'indicateur de skip doit être visible mais non intrusif
- Le skip doit fonctionner immédiatement (pas de délai de traitement)
- Si l'animation est skippée, ne pas la rejouer automatiquement lors de la prochaine session (utiliser localStorage)

### Compatibilité

- Tester sur différentes tailles d'écran (le compteur et l'indicateur doivent rester lisibles)
- Vérifier que les labels de planètes ne sortent pas de l'écran
- S'assurer que le bloom fonctionne sur tous les navigateurs supportant WebGL2

## Métriques de Succès

1. **Performance:** Animation maintient 60fps sur desktop, 30fps sur mobile
2. **Skip rate:** Tracking du pourcentage d'utilisateurs qui skip après première visite
3. **Durée moyenne:** La plupart des nouveaux utilisateurs regardent l'animation complète (>80%)
4. **Fluidité:** Aucun à-coup visible dans le mouvement de caméra

## Extensions Futures (Hors Scope)

- Version alternative "orbit preview" pour utilisateurs récurrents
- Easter egg: trajectoires alternatives aléatoires (passage près de comètes)
- Mode "ultra performance" qui désactive bloom et warp
- Narration audio optionnelle avec faits sur le système solaire

---

**Validation requise avant implémentation**
