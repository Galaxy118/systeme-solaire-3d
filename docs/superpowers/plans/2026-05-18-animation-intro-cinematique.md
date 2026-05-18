# Animation d'Introduction Cinématique - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Moderniser l'animation de départ avec un voyage cinématique de 7 secondes depuis l'extérieur du système solaire, skipable et avec effets visuels subtils.

**Architecture:** Remplacer l'animation simple actuelle par un système multi-phases avec courbes d'easing, effets de particules, labels temporaires et compteur de distance. Ajouter une fonctionnalité de skip avec indicateur visuel. Pas de post-processing bloom (hors scope pour simplicité).

**Tech Stack:** Three.js, vanilla JavaScript, CSS3 animations

---

## File Structure

**Modified files:**
- `main.js` - Animation logic, phase system, event listeners
- `style.css` - Skip indicator, distance counter, temporary planet labels
- `index.html` - Aucune modification nécessaire

**No new files created** - Pure enhancement of existing code

---

### Task 1: Add CSS for Skip Indicator and Distance Counter

**Files:**
- Modify: `style.css` (append at end)

- [ ] **Step 1: Add skip indicator styles**

Ajouter à la fin de `style.css`:

```css
/* ==========================================
   Animation Cinématique - UI Overlays
   ========================================== */

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
    pointer-events: none;
}

#skip-indicator.visible {
    opacity: 1;
}
```

- [ ] **Step 2: Add distance counter styles**

Ajouter après le skip indicator:

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
    pointer-events: none;
}

#distance-counter.visible {
    opacity: 1;
}
```

- [ ] **Step 3: Add temporary planet label styles**

Ajouter après le distance counter:

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

.temp-planet-label.visible {
    opacity: 1;
}
```

- [ ] **Step 4: Test CSS in browser**

Commande:
```bash
python3 -m http.server 8080
```

Ouvrir http://localhost:8080 et vérifier que la page charge sans erreur CSS.

- [ ] **Step 5: Commit CSS changes**

```bash
git add style.css
git commit -m "style: add CSS for cinematic intro overlays

Add styles for skip indicator, distance counter, and temporary planet labels"
```

---

### Task 2: Add Easing Functions and Global Variables

**Files:**
- Modify: `main.js:236-250` (global variables section)

- [ ] **Step 1: Add new global variables after line 250**

Localiser la ligne `let cameraAnimation = null;` (ligne 250) et ajouter après:

```javascript
let cinematicAnimation = null;
let skipIndicator = null;
let distanceCounter = null;
let activePlanetLabels = [];
```

- [ ] **Step 2: Add easing functions after global variables**

Ajouter après les variables globales (après ligne ~254):

```javascript
// ========================================
// Easing Functions pour Animation Cinématique
// ========================================

const EASING = {
    easeInCubic: (t) => t * t * t,
    easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    easeOutCubic: (t) => 1 - Math.pow(1 - t, 3)
};
```

- [ ] **Step 3: Test that file still loads**

Commande:
```bash
python3 -m http.server 8080
```

Ouvrir http://localhost:8080 et vérifier la console (pas d'erreurs).

- [ ] **Step 4: Commit easing functions**

```bash
git add main.js
git commit -m "feat: add easing functions and cinematic variables

Add cubic easing functions and global variables for cinematic animation system"
```

---

### Task 3: Create Helper Functions for UI Overlays

**Files:**
- Modify: `main.js` (add before `setupIntroAnimation` function ~line 740)

- [ ] **Step 1: Create skip indicator helper**

Ajouter avant la fonction `setupIntroAnimation()`:

```javascript
// ========================================
// Helpers pour Animation Cinématique
// ========================================

function createSkipIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'skip-indicator';
    indicator.textContent = 'Appuyez sur ESPACE ou cliquez pour passer';
    document.body.appendChild(indicator);
    return indicator;
}

function showSkipIndicator() {
    if (skipIndicator) {
        skipIndicator.classList.add('visible');
    }
}

function hideSkipIndicator() {
    if (skipIndicator) {
        skipIndicator.classList.remove('visible');
        setTimeout(() => {
            if (skipIndicator && skipIndicator.parentNode) {
                skipIndicator.parentNode.removeChild(skipIndicator);
            }
            skipIndicator = null;
        }, 500);
    }
}
```

- [ ] **Step 2: Create distance counter helper**

Ajouter après les fonctions du skip indicator:

```javascript
function createDistanceCounter() {
    const counter = document.createElement('div');
    counter.id = 'distance-counter';
    counter.textContent = 'Distance: 450 UA';
    document.body.appendChild(counter);
    return counter;
}

function updateDistanceCounter(distanceInAU) {
    if (distanceCounter) {
        const rounded = Math.round(distanceInAU);
        distanceCounter.textContent = `Distance: ${rounded} UA`;
    }
}

function hideDistanceCounter() {
    if (distanceCounter) {
        distanceCounter.classList.remove('visible');
        setTimeout(() => {
            if (distanceCounter && distanceCounter.parentNode) {
                distanceCounter.parentNode.removeChild(distanceCounter);
            }
            distanceCounter = null;
        }, 500);
    }
}
```

- [ ] **Step 3: Create planet label helpers**

Ajouter après les fonctions du distance counter:

```javascript
function showPlanetLabel(planetName, screenX, screenY, duration) {
    const label = document.createElement('div');
    label.className = 'temp-planet-label';
    label.textContent = planetName;
    label.style.left = screenX + 'px';
    label.style.top = screenY + 'px';
    document.body.appendChild(label);
    
    activePlanetLabels.push(label);
    
    setTimeout(() => label.classList.add('visible'), 10);
    
    setTimeout(() => {
        label.classList.remove('visible');
        setTimeout(() => {
            if (label.parentNode) {
                label.parentNode.removeChild(label);
            }
            const index = activePlanetLabels.indexOf(label);
            if (index > -1) {
                activePlanetLabels.splice(index, 1);
            }
        }, 300);
    }, duration);
}

function clearAllPlanetLabels() {
    activePlanetLabels.forEach(label => {
        if (label.parentNode) {
            label.parentNode.removeChild(label);
        }
    });
    activePlanetLabels = [];
}
```

- [ ] **Step 4: Test file loads without errors**

Commande:
```bash
python3 -m http.server 8080
```

Ouvrir http://localhost:8080 et vérifier console (pas d'erreurs).

- [ ] **Step 5: Commit helper functions**

```bash
git add main.js
git commit -m "feat: add UI overlay helper functions

Add functions to create and manage skip indicator, distance counter, and planet labels"
```

---

### Task 4: Create Core Cinematic Animation Functions

**Files:**
- Modify: `main.js` (add before `setupIntroAnimation` ~line 740)

- [ ] **Step 1: Create animation calculator function**

Ajouter avant `setupIntroAnimation()`:

```javascript
// ========================================
// Animation Cinématique - Core Logic
// ========================================

function calculateCinematicProgress(elapsed) {
    const duration = 7000;
    const progress = Math.min(elapsed / duration, 1);
    
    let phase, phaseProgress, easedProgress;
    
    if (progress < 0.286) { // Phase 1: 0-2s (2/7 = 0.286)
        phase = 1;
        phaseProgress = progress / 0.286;
        easedProgress = EASING.easeInCubic(phaseProgress);
    } else if (progress < 0.714) { // Phase 2: 2-5s (5/7 = 0.714)
        phase = 2;
        phaseProgress = (progress - 0.286) / 0.428;
        easedProgress = 0.2 + (EASING.easeInOutCubic(phaseProgress) * 0.6);
    } else { // Phase 3: 5-7s
        phase = 3;
        phaseProgress = (progress - 0.714) / 0.286;
        easedProgress = 0.8 + (EASING.easeOutCubic(phaseProgress) * 0.2);
    }
    
    return { progress, phase, phaseProgress, easedProgress };
}
```

- [ ] **Step 2: Create warp effect function**

Ajouter après `calculateCinematicProgress`:

```javascript
function updateWarpEffect(intensity) {
    // Intensity: 0 (no warp) to 1 (max warp)
    // Modifier la taille des particules d'étoiles pour simuler l'étirement
    scene.children.forEach(child => {
        if (child.type === 'Points') {
            const material = child.material;
            if (material.size) {
                const baseSize = 0.5;
                material.size = baseSize + (intensity * 0.3);
                material.opacity = 0.8 - (intensity * 0.2);
            }
        }
    });
}
```

- [ ] **Step 3: Create planet label trigger function**

Ajouter après `updateWarpEffect`:

```javascript
function checkAndShowPlanetLabels(cameraPosition, phase) {
    if (phase !== 2) return;
    
    // Afficher Jupiter si caméra passe près
    if (planets.jupiter && planets.jupiter.mesh) {
        const distToJupiter = cameraPosition.distanceTo(planets.jupiter.mesh.position);
        if (distToJupiter < 80 && !planets.jupiter.labelShown) {
            const jupiterPos = planets.jupiter.mesh.position.clone();
            jupiterPos.project(camera);
            const screenX = (jupiterPos.x * 0.5 + 0.5) * window.innerWidth;
            const screenY = (-(jupiterPos.y * 0.5) + 0.5) * window.innerHeight - 30;
            showPlanetLabel('Jupiter', screenX, screenY, 1600);
            planets.jupiter.labelShown = true;
        }
    }
    
    // Afficher Terre si caméra passe près
    if (planets.terre && planets.terre.mesh) {
        const distToTerre = cameraPosition.distanceTo(planets.terre.mesh.position);
        if (distToTerre < 50 && !planets.terre.labelShown) {
            const terrePos = planets.terre.mesh.position.clone();
            terrePos.project(camera);
            const screenX = (terrePos.x * 0.5 + 0.5) * window.innerWidth;
            const screenY = (-(terrePos.y * 0.5) + 0.5) * window.innerHeight - 30;
            showPlanetLabel('Terre', screenX, screenY, 1600);
            planets.terre.labelShown = true;
        }
    }
}
```

- [ ] **Step 4: Test file loads**

Commande:
```bash
python3 -m http.server 8080
```

Ouvrir http://localhost:8080 et vérifier console (pas d'erreurs).

- [ ] **Step 5: Commit core animation functions**

```bash
git add main.js
git commit -m "feat: add core cinematic animation functions

Add progress calculator, warp effect, and planet label triggers"
```

---

### Task 5: Implement Main Cinematic Animation Update Loop

**Files:**
- Modify: `main.js` (replace `updateCameraAnimation` function ~line 772)

- [ ] **Step 1: Locate and backup old animation update**

Localiser la fonction `updateCameraAnimation()` (ligne ~772). Commenter l'ancienne fonction:

```javascript
// DEPRECATED - Replaced by updateCinematicAnimation
// function updateCameraAnimation() {
//     if (!cameraAnimation || !cameraAnimation.active) return;
//     ... (garder le code commenté pour référence)
// }
```

- [ ] **Step 2: Write new cinematic update function**

Ajouter la nouvelle fonction après l'ancienne commentée:

```javascript
function updateCinematicAnimation() {
    if (!cinematicAnimation || !cinematicAnimation.active) return;
    
    const elapsed = Date.now() - cinematicAnimation.startTime;
    const { progress, phase, phaseProgress, easedProgress } = calculateCinematicProgress(elapsed);
    
    // Update camera position
    camera.position.x = cinematicAnimation.startPos.x + 
        (cinematicAnimation.endPos.x - cinematicAnimation.startPos.x) * easedProgress;
    camera.position.y = cinematicAnimation.startPos.y + 
        (cinematicAnimation.endPos.y - cinematicAnimation.startPos.y) * easedProgress;
    camera.position.z = cinematicAnimation.startPos.z + 
        (cinematicAnimation.endPos.z - cinematicAnimation.startPos.z) * easedProgress;
    
    camera.lookAt(0, 0, 0);
    
    // Phase 1: Show counters
    if (phase === 1 && elapsed > 500 && distanceCounter) {
        distanceCounter.classList.add('visible');
    }
    
    // Phase 2: Warp effect and labels
    if (phase === 2) {
        const warpIntensity = phaseProgress < 0.5 
            ? phaseProgress * 2  // Ramp up
            : 1 - ((phaseProgress - 0.5) * 2);  // Ramp down
        updateWarpEffect(warpIntensity);
        checkAndShowPlanetLabels(camera.position, phase);
    } else {
        updateWarpEffect(0);
    }
    
    // Update distance counter
    const remainingDistance = camera.position.length();
    const distanceInAU = remainingDistance / 1.5; // Rough AU conversion
    updateDistanceCounter(Math.max(distanceInAU, 1));
    
    // Phase 3: Hide counters
    if (phase === 3 && phaseProgress > 0.5) {
        hideDistanceCounter();
    }
    
    // Animation complete
    if (progress >= 1) {
        cinematicAnimation.active = false;
        controls.target.set(0, 0, 0);
        hideSkipIndicator();
        clearAllPlanetLabels();
        updateWarpEffect(0);
        
        // Reset label flags
        Object.values(planets).forEach(planet => {
            if (planet.labelShown) delete planet.labelShown;
        });
    }
}
```

- [ ] **Step 3: Update animate loop to call new function**

Localiser la fonction `animate()` et remplacer l'appel à `updateCameraAnimation()` par `updateCinematicAnimation()`:

Chercher la ligne contenant `updateCameraAnimation();` dans la fonction `animate()` et remplacer par:
```javascript
updateCinematicAnimation();
```

- [ ] **Step 4: Test file loads**

Commande:
```bash
python3 -m http.server 8080
```

Ouvrir http://localhost:8080 et vérifier console (pas d'erreurs).

- [ ] **Step 5: Commit update loop**

```bash
git add main.js
git commit -m "feat: implement cinematic animation update loop

Replace old camera animation with new multi-phase cinematic system"
```

---

### Task 6: Implement Skip Functionality

**Files:**
- Modify: `main.js` (add before `setupIntroAnimation` ~line 740)

- [ ] **Step 1: Create skip animation function**

Ajouter avant `setupIntroAnimation()`:

```javascript
function skipCinematicAnimation() {
    if (!cinematicAnimation || !cinematicAnimation.active) return;
    
    // Mark as skipped
    cinematicAnimation.skipped = true;
    cinematicAnimation.active = false;
    
    // Smooth transition to final position (0.5s)
    const currentPos = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
    const targetPos = { x: 80, y: 60, z: 120 };
    const skipDuration = 500;
    const skipStartTime = Date.now();
    
    function skipTransition() {
        const elapsed = Date.now() - skipStartTime;
        const progress = Math.min(elapsed / skipDuration, 1);
        const eased = EASING.easeOutCubic(progress);
        
        camera.position.x = currentPos.x + (targetPos.x - currentPos.x) * eased;
        camera.position.y = currentPos.y + (targetPos.y - currentPos.y) * eased;
        camera.position.z = currentPos.z + (targetPos.z - currentPos.z) * eased;
        camera.lookAt(0, 0, 0);
        
        if (progress < 1) {
            requestAnimationFrame(skipTransition);
        } else {
            // Finalize
            controls.enabled = true;
            controls.target.set(0, 0, 0);
            introActive = false;
            document.querySelectorAll('.hud-panel').forEach(p => p.classList.remove('hidden'));
        }
    }
    
    // Clean up effects immediately
    hideSkipIndicator();
    hideDistanceCounter();
    clearAllPlanetLabels();
    updateWarpEffect(0);
    
    // Reset label flags
    Object.values(planets).forEach(planet => {
        if (planet.labelShown) delete planet.labelShown;
    });
    
    // Start transition
    skipTransition();
}
```

- [ ] **Step 2: Add event listeners for skip**

Ajouter après la fonction `skipCinematicAnimation`:

```javascript
function setupSkipListeners() {
    const handleSkip = (e) => {
        if (cinematicAnimation && cinematicAnimation.active) {
            if (e.type === 'keydown' && (e.key === ' ' || e.key === 'Escape')) {
                e.preventDefault();
                skipCinematicAnimation();
            } else if (e.type === 'click') {
                skipCinematicAnimation();
            }
        }
    };
    
    document.addEventListener('keydown', handleSkip);
    document.addEventListener('click', handleSkip);
}
```

- [ ] **Step 3: Test file loads**

Commande:
```bash
python3 -m http.server 8080
```

Ouvrir http://localhost:8080 et vérifier console (pas d'erreurs).

- [ ] **Step 4: Commit skip functionality**

```bash
git add main.js
git commit -m "feat: implement skip functionality

Add skip animation with smooth transition and event listeners"
```

---

### Task 7: Modify Intro Setup to Use Cinematic Animation

**Files:**
- Modify: `main.js:740-755` (functions `setupIntroAnimation` and `startCameraAnimation`)

- [ ] **Step 1: Locate setupIntroAnimation function**

Trouver la fonction `setupIntroAnimation()` (ligne ~740).

- [ ] **Step 2: Replace setupIntroAnimation**

Remplacer la fonction complète par:

```javascript
function setupIntroAnimation() {
    const startBtn = document.getElementById('start-btn');
    const introScreen = document.getElementById('intro-screen');
    
    // Setup skip listeners (active dès le début)
    setupSkipListeners();

    startBtn.addEventListener('click', () => {
        introScreen.classList.add('fade-out');
        startCinematicAnimation();

        setTimeout(() => {
            introScreen.classList.add('hidden');
            // Note: introActive et controls seront gérés par l'animation
        }, 1500);
    });
}
```

- [ ] **Step 3: Replace startCameraAnimation with startCinematicAnimation**

Remplacer la fonction `startCameraAnimation()` (ligne ~757) par:

```javascript
function startCinematicAnimation() {
    const startPos = { x: 0, y: 300, z: 500 };
    const endPos = { x: 80, y: 60, z: 120 };
    const duration = 7000;
    const startTime = Date.now();
    
    cinematicAnimation = {
        startPos,
        endPos,
        duration,
        startTime,
        active: true,
        skipped: false
    };
    
    // Create UI overlays
    skipIndicator = createSkipIndicator();
    distanceCounter = createDistanceCounter();
    
    // Show skip indicator after 1s
    setTimeout(() => {
        if (cinematicAnimation && cinematicAnimation.active) {
            showSkipIndicator();
        }
    }, 1000);
    
    // Reset planet label flags
    Object.values(planets).forEach(planet => {
        if (planet.labelShown) delete planet.labelShown;
    });
}
```

- [ ] **Step 4: Test the complete animation flow**

Commande:
```bash
python3 -m http.server 8080
```

1. Ouvrir http://localhost:8080
2. Cliquer sur "Commencer l'exploration"
3. Observer l'animation complète de 7s
4. Vérifier que le compteur de distance apparaît
5. Vérifier que l'indicateur de skip apparaît après 1s

- [ ] **Step 5: Test skip functionality**

1. Rafraîchir la page
2. Cliquer sur "Commencer l'exploration"
3. Appuyer sur ESPACE pendant l'animation
4. Vérifier que l'animation se termine en douceur en 0.5s
5. Vérifier que les controls fonctionnent

Répéter avec:
- Touche ECHAP
- Clic pendant l'animation

- [ ] **Step 6: Commit complete integration**

```bash
git add main.js
git commit -m "feat: integrate cinematic animation into intro flow

Replace old animation system with new cinematic animation.
Add 7s multi-phase journey with skip functionality."
```

---

### Task 8: Final Testing and Polish

**Files:**
- Modify: `main.js`, `style.css` (si ajustements nécessaires)

- [ ] **Step 1: Test complete user journey**

Commande:
```bash
python3 -m http.server 8080
```

Scénarios à tester:
1. **Premier chargement complet:**
   - Animation complète de 7s
   - Compteur de distance visible
   - Labels apparaissent pour Jupiter et/ou Terre
   - Effet warp subtil visible sur les étoiles
   - Skip indicator visible après 1s
   - HUD panels apparaissent à la fin

2. **Skip rapide (avant 2s):**
   - Skip fonctionne immédiatement
   - Transition douce vers position finale
   - Pas d'artefacts visuels

3. **Skip tardif (après 5s):**
   - Skip fonctionne en fin d'animation
   - Transition reste fluide

4. **Responsive:**
   - Tester sur fenêtre réduite
   - Vérifier que les overlays restent lisibles

- [ ] **Step 2: Adjust timing if needed**

Si les timings ne correspondent pas aux attentes:
- Ajuster les seuils de phase dans `calculateCinematicProgress`
- Ajuster les délais d'apparition du skip indicator
- Ajuster la durée des labels de planètes

Documenter tout ajustement dans un commentaire.

- [ ] **Step 3: Verify no console errors**

Ouvrir DevTools console et vérifier:
- Aucune erreur JavaScript
- Aucun warning de Three.js
- Aucun élément DOM orphelin

- [ ] **Step 4: Performance check**

1. Ouvrir DevTools > Performance
2. Enregistrer l'animation complète
3. Vérifier FPS stable (>30fps minimum, idéal >50fps)
4. Si problème de performance, réduire la complexité de `updateWarpEffect`

- [ ] **Step 5: Code cleanup**

Retirer le code commenté de l'ancienne animation (`updateCameraAnimation` commentée).

- [ ] **Step 6: Final commit**

```bash
git add main.js style.css
git commit -m "polish: final testing and adjustments

Complete cinematic intro animation with all effects tested and verified"
```

---

## Self-Review

**Spec Coverage Check:**

✓ **7s animation with 3 phases** - Task 4 (calculateCinematicProgress), Task 5 (phase logic)  
✓ **Camera journey from (0,300,500) to (80,60,120)** - Task 7 (startCinematicAnimation)  
✓ **Skip functionality (SPACE/ESC/click)** - Task 6 (skipCinematicAnimation, setupSkipListeners)  
✓ **Skip indicator** - Task 1 (CSS), Task 3 (helpers), Task 7 (display logic)  
✓ **Distance counter** - Task 1 (CSS), Task 3 (helpers), Task 5 (update logic)  
✓ **Planet labels (Jupiter, Terre)** - Task 1 (CSS), Task 3 (helpers), Task 4 (checkAndShowPlanetLabels)  
✓ **Warp effect on stars** - Task 4 (updateWarpEffect), Task 5 (phase 2 trigger)  
✓ **Smooth skip transition (0.5s)** - Task 6 (skipTransition with easing)  
✓ **Easing curves per phase** - Task 2 (EASING object), Task 4 (phase-specific application)

**Placeholder Scan:** No TBD, TODO, or vague placeholders. All code blocks are complete and executable.

**Type Consistency:**
- `cinematicAnimation` object structure defined in Task 7 and used consistently in Tasks 5-6
- Helper function names match across tasks (e.g., `showSkipIndicator` defined in Task 3, called in Task 5)
- CSS class names match between Task 1 and JavaScript usage (e.g., `.visible`, `#skip-indicator`)

**No Gaps Found** - All spec requirements have corresponding implementation tasks.

---

## Plan Complete

**Total Tasks:** 8  
**Estimated Time:** ~60-90 minutes  
**Files Modified:** 2 (main.js, style.css)  
**Files Created:** 0
