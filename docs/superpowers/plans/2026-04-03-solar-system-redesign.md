# Solar System Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corriger les échelles planétaires, refaire le système de rotation (pivot axial), fixer les anneaux de Saturne/Uranus, et remplacer l'UI par 4 panneaux HUD rétractables sans superposition.

**Architecture:** Ajout d'un `axialPivot` Object3D entre `orbitContainer` et le mesh de chaque planète — il porte l'inclinaison axiale fixe, le mesh ne tourne que sur son Y local, les anneaux sont enfants du pivot (pas du mesh). L'UI est reconstruite en 4 divs `.hud-panel` positionnés en CSS avec `transform: translateX/Y` pour le slide.

**Tech Stack:** Three.js r160 (ESM, CDN), Vanilla JS, CSS3 transitions, Google Fonts Orbitron/Exo 2

---

## File Map

| Fichier | Ce qui change |
|---|---|
| `main.js` | Radii PLANETS_DATA · createPlanets() pivot · animate() rotation · updatePlanetPosition() · updateVelocityArrows() · updateCameraAnimation() · init() wiring · setupIntroAnimation() · nouveaux: buildPlanetSelector(), focusPlanet(), updateSelectorActive(), setupPanelToggles() |
| `style.css` | Supprimer #info-panel, #controls et leurs états hidden/visible · Ajouter .hud-panel et variants · Speed / toggle / planet-dot / hud-close styles |
| `index.html` | Remplacer `#info-panel` + `#controls` par 4 divs `.hud-panel` |

---

## Task 1 — Mettre à jour les radii des planètes

**Fichiers :**
- Modifier : `main.js` (lignes ~8-216, objet `PLANETS_DATA`)

- [ ] **Étape 1 : Modifier les 8 valeurs `radius` dans `PLANETS_DATA`**

Dans `main.js`, trouver les entrées suivantes et remplacer uniquement la propriété `radius` :

```js
mercure: { radius: 0.5,   /* was 0.8  — 0.38x Terre */ },
venus:   { radius: 1.23,  /* was 1.2  — 0.95x Terre */ },
// terre: 1.3 inchangé
mars:    { radius: 0.7,   /* was 1.0  — 0.53x Terre */ },
jupiter: { radius: 5.5,   /* was 4.0  — compressé  */ },
saturne: { radius: 4.5,   /* was 3.5  — compressé  */ },
uranus:  { radius: 2.8,   /* was 2.2  — compressé  */ },
neptune: { radius: 2.7,   /* was 2.1  — compressé  */ },
```

- [ ] **Étape 2 : Vérifier dans le navigateur**

Ouvrir `http://localhost:8080`. Après le clic sur "Commencer" :
- Jupiter doit être nettement plus grande que Saturne
- Mars plus petite que la Terre
- Mercure la plus petite planète tellurique

---

## Task 2 — Introduire l'axialPivot dans createPlanets()

**Fichiers :**
- Modifier : `main.js` (fonction `createPlanets`, ~ligne 1090)

- [ ] **Étape 1 : Remplacer la création du mesh + son positionnement**

Dans `createPlanets()`, trouver le bloc qui commence à `const planet = new THREE.Mesh(geometry, material)` et se termine après `planets[key] = { ... }`. Remplacer **entièrement** par :

```js
const planet = new THREE.Mesh(geometry, material);
planet.userData = { planetData: data, key: key };

// Pivot d'inclinaison axiale — fixe, ne tourne jamais
const axialPivot = new THREE.Object3D();
axialPivot.rotation.z = THREE.MathUtils.degToRad(data.axialTilt);
axialPivot.add(planet);
orbitContainer.add(axialPivot);

const initialAngle = Math.random() * Math.PI * 2;

planets[key] = {
    mesh: planet,
    axialPivot: axialPivot,
    container: orbitContainer,
    data: data,
    orbitalAngle: initialAngle,
    semiMajorAxis: a,
    semiMinorAxis: b,
    focalDistance: c,
    eccentricity: e
};

updatePlanetPosition(planets[key]);
```

- [ ] **Étape 2 : Passer axialPivot aux anneaux et à la lune**

Juste après ce bloc, remplacer :

```js
// AVANT
if (data.hasRings) { createRings(planet, data); }
if (data.hasMoon)  { createMoon(planet); }

// APRES
if (data.hasRings) { createRings(axialPivot, data); }
if (data.hasMoon)  { createMoon(axialPivot); }
```

- [ ] **Étape 3 : Vérifier dans le navigateur**

Les planètes orbitent. Saturne a ses anneaux inclinés (~27°). Uranus a ses anneaux quasi verticaux (97°).

---

## Task 3 — Simplifier la rotation dans animate()

**Fichiers :**
- Modifier : `main.js` (fonction `animate`, ~ligne 1467)

- [ ] **Étape 1 : Remplacer le bloc rotation complexe**

Dans `animate()`, trouver le bloc commenté `// Rotation sur elle-même avec direction correcte` jusqu'à la fin de `planet.mesh.rotateOnAxis(...)`. Remplacer **tout ce bloc** par :

```js
// Rotation propre : seulement Y local du mesh
const rotationDirection = data.rotationPeriod < 0 ? -1 : 1;
const rotationSpeed = (2 * Math.PI) / (Math.abs(data.rotationPeriod) * 4);
planet.mesh.rotation.y += delta * rotationSpeed * speedMultiplier * rotationDirection;
```

Supprimer également la ligne `planet.rotationAngle += ...` si elle est encore présente — elle n'est plus nécessaire.

- [ ] **Étape 2 : Vérifier dans le navigateur**

Les anneaux de Saturne ne bougent plus. Vénus tourne dans le sens inverse des autres.

---

## Task 4 — Corriger updatePlanetPosition() et updateVelocityArrows()

**Fichiers :**
- Modifier : `main.js` (~lignes 1190 et 1347)

- [ ] **Étape 1 : Corriger updatePlanetPosition**

Remplacer la fonction entière :

```js
function updatePlanetPosition(planetObj) {
    const { semiMajorAxis: a, semiMinorAxis: b, focalDistance: c, orbitalAngle: theta } = planetObj;
    planetObj.axialPivot.position.x = a * Math.cos(theta) - c;
    planetObj.axialPivot.position.z = b * Math.sin(theta);
}
```

- [ ] **Étape 2 : Corriger updateVelocityArrows**

Dans `updateVelocityArrows()`, remplacer :

```js
// AVANT
const pos = planet.mesh.position.clone();

// APRES — mesh.position est (0,0,0) dans l'espace local du pivot
const pos = planet.axialPivot.position.clone();
```

- [ ] **Étape 3 : Corriger updateCameraAnimation pour les zooms futurs**

Remplacer `updateCameraAnimation` entière :

```js
function updateCameraAnimation() {
    if (!cameraAnimation || !cameraAnimation.active) return;

    const elapsed = Date.now() - cameraAnimation.startTime;
    const progress = Math.min(elapsed / cameraAnimation.duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);

    camera.position.x = cameraAnimation.startPos.x +
        (cameraAnimation.endPos.x - cameraAnimation.startPos.x) * eased;
    camera.position.y = cameraAnimation.startPos.y +
        (cameraAnimation.endPos.y - cameraAnimation.startPos.y) * eased;
    camera.position.z = cameraAnimation.startPos.z +
        (cameraAnimation.endPos.z - cameraAnimation.startPos.z) * eased;

    const lookTarget = cameraAnimation.lookTarget || new THREE.Vector3(0, 0, 0);
    camera.lookAt(lookTarget);

    if (progress >= 1) {
        cameraAnimation.active = false;
        controls.target.copy(lookTarget);
    }
}
```

- [ ] **Étape 4 : Vérifier dans le navigateur**

Les planètes orbitent correctement. Les vecteurs vitesse (toggle) s'affichent sur les planètes.

---

## Task 5 — Nouveau HTML (4 panneaux HUD)

**Fichiers :**
- Modifier : `index.html`

- [ ] **Étape 1 : Remplacer les deux anciens divs**

Supprimer les divs `id="info-panel"` et `id="controls"`. Les remplacer par :

```html
<!-- Panel info planete — bord gauche -->
<div id="panel-info" class="hud-panel hud-panel--left hidden">
    <div class="hud-tab" id="tab-info">INFOS</div>
    <div class="hud-panel-body">
        <div id="planet-info">
            <p class="hint">Survolez une planete pour plus d'infos</p>
        </div>
        <div class="hud-close" id="close-info">REFERMER</div>
    </div>
</div>

<!-- Panel vitesse — bord droite haut -->
<div id="panel-speed" class="hud-panel hud-panel--right-top hidden">
    <div class="hud-tab" id="tab-speed">VITESSE</div>
    <div class="hud-panel-body">
        <span class="speed-label">VITESSE</span>
        <span id="speed-display" class="speed-value">1x</span>
        <div class="speed-btns">
            <button id="speed-down">-</button>
            <button id="speed-up">+</button>
        </div>
    </div>
</div>

<!-- Panel options — bord droite bas -->
<div id="panel-options" class="hud-panel hud-panel--right-bottom hidden">
    <div class="hud-tab" id="tab-options">OPTIONS</div>
    <div class="hud-panel-body">
        <button id="toggle-orbits" class="hud-toggle active">
            <span class="toggle-dot"></span>ORBITES
        </button>
        <button id="toggle-labels" class="hud-toggle active">
            <span class="toggle-dot"></span>LABELS
        </button>
        <button id="toggle-velocity" class="hud-toggle">
            <span class="toggle-dot"></span>VITESSE
        </button>
    </div>
</div>

<!-- Panel planetes — bord bas -->
<div id="panel-planets" class="hud-panel hud-panel--bottom hidden">
    <div class="hud-tab" id="tab-planets">PLANETES</div>
    <div class="hud-panel-body" id="planet-selector"></div>
</div>
```

- [ ] **Étape 2 : Vérifier**

La page charge sans erreur JS. L'écran d'intro s'affiche normalement.

---

## Task 6 — Refonte CSS (panneaux HUD)

**Fichiers :**
- Modifier : `style.css`

- [ ] **Étape 1 : Supprimer les anciens styles**

Supprimer ces blocs dans `style.css` (les garder si indiqués) :

- `#info-panel { ... }` → supprimer
- `#info-panel h1 { ... }` → supprimer
- `#planet-info h2 { ... }` → supprimer (remplacé par `.planet-name-header`)
- `#controls { ... }` → supprimer
- `#controls button { ... }` → supprimer
- `#controls button:hover { ... }` → supprimer
- `#controls button:active { ... }` → supprimer
- `#controls button.active { ... }` → supprimer
- `#speed-display { ... }` → supprimer
- `#info-panel.hidden, #controls.hidden { ... }` → supprimer
- `#info-panel.visible, #controls.visible { ... }` → supprimer
- `#controls.visible { ... }` → supprimer
- `#controls.hidden { ... }` → supprimer

Garder : `#planet-info`, `.stat`, `.stat-label`, `.stat-value`, `.hint`, `.lock-icon`, `.lock-hint`, `.planet-label`, `.hidden` globale.

- [ ] **Étape 2 : Ajouter les nouveaux styles**

Ajouter à la fin de `style.css` :

```css
/* ==========================================
   HUD PANELS — panneaux retractables
   ========================================== */

.hud-panel {
    position: fixed;
    z-index: 100;
    display: flex;
    transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.hud-panel.hidden {
    display: none;
}

.hud-tab {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-family: 'Orbitron', sans-serif;
    font-size: 0.42rem;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    backdrop-filter: blur(8px);
    transition: opacity 0.2s ease;
    user-select: none;
}

.hud-tab:hover { opacity: 0.8; }

.hud-panel-body {
    background: linear-gradient(135deg, rgba(8,8,28,0.93) 0%, rgba(15,15,46,0.9) 100%);
    backdrop-filter: blur(12px);
}

/* Panel gauche (info planete) */
.hud-panel--left {
    left: 0;
    top: 18%;
    bottom: 18%;
    flex-direction: row;
    transform: translateX(calc(-100% + 20px));
    --planet-accent: rgba(74,144,217,0.5);
}

.hud-panel--left.open {
    transform: translateX(0);
}

.hud-panel--left .hud-tab {
    order: 2;
    width: 20px;
    background: linear-gradient(90deg, rgba(8,8,28,0.95), rgba(15,15,45,0.9));
    border: 1px solid var(--planet-accent);
    border-left: none;
    border-radius: 0 8px 8px 0;
    color: var(--planet-accent);
    writing-mode: vertical-lr;
    padding: 8px 0;
}

.hud-panel--left .hud-panel-body {
    order: 1;
    width: 200px;
    padding: 14px 16px;
    border: 1px solid var(--planet-accent);
    border-left: none;
    border-right: none;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    max-height: 100%;
}

/* Panel droite haut (vitesse) */
.hud-panel--right-top {
    right: 0;
    top: 8%;
    flex-direction: row-reverse;
    transform: translateX(calc(100% - 20px));
}

.hud-panel--right-top.open {
    transform: translateX(0);
}

.hud-panel--right-top .hud-tab {
    width: 20px;
    height: 90px;
    background: linear-gradient(270deg, rgba(8,8,28,0.95), rgba(15,15,45,0.9));
    border: 1px solid rgba(78,205,196,0.45);
    border-right: none;
    border-radius: 8px 0 0 8px;
    color: #4ecdc4;
    writing-mode: vertical-rl;
    padding: 8px 0;
}

.hud-panel--right-top .hud-panel-body {
    width: 90px;
    height: 90px;
    padding: 10px 12px;
    border: 1px solid rgba(78,205,196,0.4);
    border-right: none;
    border-radius: 10px 0 0 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
}

/* Panel droite bas (options) */
.hud-panel--right-bottom {
    right: 0;
    top: calc(8% + 98px);
    flex-direction: row-reverse;
    transform: translateX(calc(100% - 20px));
}

.hud-panel--right-bottom.open {
    transform: translateX(0);
}

.hud-panel--right-bottom .hud-tab {
    width: 20px;
    height: 80px;
    background: linear-gradient(270deg, rgba(8,8,28,0.95), rgba(15,15,45,0.9));
    border: 1px solid rgba(100,150,255,0.4);
    border-right: none;
    border-radius: 8px 0 0 8px;
    color: rgba(150,180,255,0.7);
    writing-mode: vertical-rl;
    padding: 8px 0;
}

.hud-panel--right-bottom .hud-panel-body {
    width: 90px;
    height: 80px;
    padding: 8px 10px;
    border: 1px solid rgba(100,150,255,0.35);
    border-right: none;
    border-radius: 10px 0 0 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    justify-content: center;
}

/* Panel bas (selecteur planetes) */
.hud-panel--bottom {
    bottom: 0;
    left: 220px;
    right: 110px;
    flex-direction: column-reverse;
    transform: translateY(calc(100% - 18px));
}

.hud-panel--bottom.open {
    transform: translateY(0);
}

.hud-panel--bottom .hud-tab {
    height: 18px;
    width: 100%;
    background: linear-gradient(180deg, rgba(8,8,28,0.95), rgba(15,15,45,0.9));
    border: 1px solid rgba(168,85,247,0.4);
    border-bottom: none;
    border-radius: 8px 8px 0 0;
    color: rgba(168,85,247,0.7);
    padding: 0 12px;
    font-size: 0.4rem;
}

.hud-panel--bottom .hud-panel-body {
    height: 62px;
    width: 100%;
    padding: 8px 16px;
    border: 1px solid rgba(168,85,247,0.3);
    border-bottom: none;
    border-radius: 10px 10px 0 0;
    display: flex;
    align-items: center;
    justify-content: space-around;
}

/* Contenu vitesse */
.speed-label {
    font-family: 'Orbitron', sans-serif;
    font-size: 0.42rem;
    letter-spacing: 2px;
    color: rgba(78,205,196,0.55);
    text-transform: uppercase;
}

.speed-value {
    font-family: 'Orbitron', sans-serif;
    font-size: 1.1rem;
    font-weight: 700;
    color: #4ecdc4;
    line-height: 1;
    text-align: center;
    display: block;
}

.speed-btns {
    display: flex;
    gap: 4px;
    justify-content: center;
}

.speed-btns button {
    background: rgba(78,205,196,0.12);
    border: 1px solid rgba(78,205,196,0.3);
    border-radius: 4px;
    color: #4ecdc4;
    padding: 2px 8px;
    font-family: 'Orbitron', sans-serif;
    font-size: 0.65rem;
    cursor: pointer;
    transition: background 0.2s ease;
}

.speed-btns button:hover {
    background: rgba(78,205,196,0.25);
}

/* Toggles options */
.hud-toggle {
    display: flex;
    align-items: center;
    gap: 5px;
    font-family: 'Orbitron', sans-serif;
    font-size: 0.45rem;
    letter-spacing: 1px;
    padding: 4px 8px;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
    background: rgba(68,163,255,0.07);
    border: 1px solid rgba(68,163,255,0.18);
    color: rgba(255,255,255,0.38);
}

.hud-toggle.active {
    background: rgba(78,205,196,0.18);
    border-color: rgba(78,205,196,0.4);
    color: #4ecdc4;
}

.toggle-dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: currentColor;
    flex-shrink: 0;
}

/* Selecteur planetes — dots */
.planet-dot {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    cursor: pointer;
    opacity: 0.5;
    transition: opacity 0.2s ease;
    background: none;
    border: none;
    padding: 0;
}

.planet-dot:hover,
.planet-dot.active { opacity: 1; }

.planet-dot-circle {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    transition: box-shadow 0.2s ease;
}

.planet-dot.active .planet-dot-circle {
    box-shadow: 0 0 8px 2px var(--planet-color);
}

.planet-dot-name {
    font-family: 'Orbitron', sans-serif;
    font-size: 0.4rem;
    letter-spacing: 1px;
    color: rgba(255,255,255,0.4);
    text-transform: uppercase;
}

.planet-dot.active .planet-dot-name { color: #fff; }

/* Bouton fermer */
.hud-close {
    font-family: 'Orbitron', sans-serif;
    font-size: 0.48rem;
    color: rgba(100,150,220,0.45);
    text-align: center;
    margin-top: auto;
    padding-top: 8px;
    border-top: 1px solid rgba(74,144,217,0.15);
    cursor: pointer;
    letter-spacing: 1px;
    transition: color 0.2s ease;
}

.hud-close:hover { color: rgba(100,150,220,0.8); }

/* En-tete planete dans le panel info */
.planet-name-header {
    display: flex;
    align-items: center;
    gap: 7px;
    font-family: 'Orbitron', sans-serif;
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 2px;
    margin-bottom: 2px;
}

.planet-name-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
}

.planet-name-text {
    color: var(--planet-accent, #4A90D9);
}

.planet-name-type {
    font-size: 0.6rem;
    color: rgba(255,255,255,0.33);
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 10px;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
}
```

- [ ] **Étape 3 : Vérifier dans le navigateur**

Après l'intro, les 4 onglets dépassent des bords. Chaque clic sur un onglet fait glisser le panneau. Quand les 4 sont ouverts simultanément, aucun chevauchement.

---

## Task 7 — Câblage JS des nouveaux panneaux

**Fichiers :**
- Modifier : `main.js`

- [ ] **Étape 1 : Ajouter setupPanelToggles()**

Ajouter avant `init()` :

```js
// ========================================
// Toggle des panneaux HUD
// ========================================

function setupPanelToggles() {
    document.querySelectorAll('.hud-panel').forEach(panel => {
        const tab = panel.querySelector('.hud-tab');
        const closeBtn = panel.querySelector('.hud-close');

        tab.addEventListener('click', () => {
            panel.classList.toggle('open');
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                panel.classList.remove('open');
            });
        }
    });
}
```

- [ ] **Étape 2 : Mettre à jour setupIntroAnimation()**

Dans `setupIntroAnimation()`, trouver les lignes qui récupèrent `infoPanel` et `controlsPanel` et qui les rendent visibles. Remplacer toute cette logique par :

```js
function setupIntroAnimation() {
    const startBtn = document.getElementById('start-btn');
    const introScreen = document.getElementById('intro-screen');

    startBtn.addEventListener('click', () => {
        introScreen.classList.add('fade-out');
        startCameraAnimation();

        setTimeout(() => {
            introScreen.classList.add('hidden');
            introActive = false;
            controls.enabled = true;

            // Rendre tous les panneaux HUD visibles (onglets sur les bords)
            document.querySelectorAll('.hud-panel').forEach(p => p.classList.remove('hidden'));
        }, 1500);
    });
}
```

- [ ] **Étape 3 : Mettre à jour updateInfoPanel() — accent couleur et nouveau markup**

Remplacer la fonction `updateInfoPanel` entière :

```js
function updateInfoPanel(data, isLocked = false) {
    const panelEl = document.getElementById('panel-info');
    const infoEl  = document.getElementById('planet-info');

    // Couleur accent dynamique selon la planete
    const hexColor = '#' + data.color.toString(16).padStart(6, '0');
    if (panelEl) {
        panelEl.style.setProperty('--planet-accent', hexColor + '99');
    }

    // Vider et reconstruire avec createElement (pas de contenu utilisateur)
    while (infoEl.firstChild) infoEl.removeChild(infoEl.firstChild);

    // En-tete : point colore + nom + icone verrou
    const header = document.createElement('div');
    header.className = 'planet-name-header';

    const dot = document.createElement('div');
    dot.className = 'planet-name-dot';
    dot.style.background = hexColor;
    dot.style.boxShadow = '0 0 6px ' + hexColor + 'aa';
    header.appendChild(dot);

    const nameSpan = document.createElement('span');
    nameSpan.className = 'planet-name-text';
    nameSpan.textContent = data.name;
    header.appendChild(nameSpan);

    if (isLocked) {
        const lockSpan = document.createElement('span');
        lockSpan.className = 'lock-icon';
        lockSpan.textContent = ' \uD83D\uDD12';
        header.appendChild(lockSpan);
    }

    infoEl.appendChild(header);

    // Sous-titre type
    const typeEl = document.createElement('div');
    typeEl.className = 'planet-name-type';
    typeEl.textContent = data.info.type || '';
    infoEl.appendChild(typeEl);

    // Stats rotation/inclinaison
    const rotPeriod = Math.abs(data.rotationPeriod);
    const rotDirection = data.rotationPeriod < 0 ? ' (retrograde)' : '';
    const rotValue = rotPeriod < 1
        ? (rotPeriod * 24).toFixed(1) + 'h'
        : rotPeriod.toFixed(2) + ' jours';

    const statsToInject = [
        { label: 'Inclinaison axiale', value: data.axialTilt.toFixed(2) + '\u00B0' },
        { label: 'Rotation', value: rotValue + rotDirection }
    ];

    if (data.name === 'Soleil') {
        statsToInject[1].value = data.rotationPeriod.toFixed(1) + ' jours (equateur)';
    }

    statsToInject.forEach(s => {
        const row = document.createElement('div');
        row.className = 'stat';
        const lbl = document.createElement('span');
        lbl.className = 'stat-label';
        lbl.textContent = s.label;
        const val = document.createElement('span');
        val.className = 'stat-value';
        val.textContent = s.value;
        row.appendChild(lbl);
        row.appendChild(val);
        infoEl.appendChild(row);
    });

    // Reste des infos
    Object.keys(data.info).forEach(key => {
        if (key === 'type') return; // deja affiche
        const row = document.createElement('div');
        row.className = 'stat';
        const lbl = document.createElement('span');
        lbl.className = 'stat-label';
        lbl.textContent = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const val = document.createElement('span');
        val.className = 'stat-value';
        val.textContent = data.info[key];
        row.appendChild(lbl);
        row.appendChild(val);
        infoEl.appendChild(row);
    });

    // Hint deverrouillage
    if (isLocked) {
        const hint = document.createElement('p');
        hint.className = 'lock-hint';
        hint.textContent = 'Cliquez a nouveau pour deverrouiller';
        infoEl.appendChild(hint);
    }
}
```

- [ ] **Étape 4 : Corriger resetInfoPanel()**

```js
function resetInfoPanel() {
    const infoEl = document.getElementById('planet-info');
    while (infoEl.firstChild) infoEl.removeChild(infoEl.firstChild);
    const hint = document.createElement('p');
    hint.className = 'hint';
    hint.textContent = "Survolez une planete pour plus d'infos";
    infoEl.appendChild(hint);

    // Reinitialiser l'accent
    const panelEl = document.getElementById('panel-info');
    if (panelEl) panelEl.style.setProperty('--planet-accent', 'rgba(74,144,217,0.5)');

    updateSelectorActive('');
}
```

- [ ] **Étape 5 : Corriger le speed display**

Dans les deux handlers `speed-up` et `speed-down`, remplacer `'x'` par `'\u00D7'` :

```js
document.getElementById('speed-display').textContent = speedMultiplier + '\u00D7';
```

- [ ] **Étape 6 : Ajouter les appels dans init()**

Dans `init()`, apres `setupEventListeners()`, ajouter :

```js
setupPanelToggles();
```

- [ ] **Étape 7 : Vérifier dans le navigateur**

- Les 4 onglets apparaissent après l'intro
- Le panel info change de couleur d'accent selon la planète survolée/cliquée
- `1×`, `2×`, `0.5×` s'affichent correctement

---

## Task 8 — Sélecteur planètes (dots + zoom caméra)

**Fichiers :**
- Modifier : `main.js`

- [ ] **Étape 1 : Ajouter buildPlanetSelector(), focusPlanet(), updateSelectorActive()**

Ajouter avant `init()` :

```js
// ========================================
// Selecteur de planetes (panel bas)
// ========================================

const PLANET_COLORS_HEX = {
    soleil:  '#FFD700',
    mercure: '#8C8C8C',
    venus:   '#E6C87A',
    terre:   '#4A90D9',
    mars:    '#C1440E',
    jupiter: '#D4A574',
    saturne: '#EAD6A6',
    uranus:  '#7DE3F4',
    neptune: '#4B70DD'
};

function buildPlanetSelector() {
    const container = document.getElementById('planet-selector');
    if (!container) return;

    Object.keys(PLANET_COLORS_HEX).forEach(key => {
        const data = PLANETS_DATA[key];
        if (!data) return;

        const btn = document.createElement('button');
        btn.className = 'planet-dot';
        btn.dataset.key = key;
        btn.style.setProperty('--planet-color', PLANET_COLORS_HEX[key]);

        const circle = document.createElement('div');
        circle.className = 'planet-dot-circle';
        circle.style.background = PLANET_COLORS_HEX[key];
        btn.appendChild(circle);

        const name = document.createElement('span');
        name.className = 'planet-dot-name';
        name.textContent = data.name;
        btn.appendChild(name);

        btn.addEventListener('click', () => focusPlanet(key));
        container.appendChild(btn);
    });
}

function focusPlanet(key) {
    const planetObj = planets[key];
    if (!planetObj) return;

    const worldPos = new THREE.Vector3();
    if (key === 'soleil') {
        worldPos.set(0, 0, 0);
    } else {
        planetObj.axialPivot.getWorldPosition(worldPos);
    }

    const radius = planetObj.data ? planetObj.data.radius : 8;
    const dist = radius * 8 + 20;

    cameraAnimation = {
        startPos: { x: camera.position.x, y: camera.position.y, z: camera.position.z },
        endPos: {
            x: worldPos.x + dist * 0.7,
            y: worldPos.y + dist * 0.4,
            z: worldPos.z + dist * 0.7
        },
        duration: 2000,
        startTime: Date.now(),
        active: true,
        lookTarget: worldPos.clone()
    };

    lockedPlanet = key;
    hoveredPlanet = key;
    updateInfoPanel(planetObj.data, true);
    updateSelectorActive(key);

    // Ouvrir le panel info s'il est ferme
    const panelInfo = document.getElementById('panel-info');
    if (panelInfo) panelInfo.classList.add('open');
}

function updateSelectorActive(key) {
    document.querySelectorAll('.planet-dot').forEach(d => d.classList.remove('active'));
    if (!key) return;
    const dot = document.querySelector('.planet-dot[data-key="' + key + '"]');
    if (dot) dot.classList.add('active');
}
```

- [ ] **Étape 2 : Appeler updateSelectorActive() lors du hover/clic scène**

Dans `onMouseMove()`, après `updateInfoPanel(...)` :

```js
updateSelectorActive(planet.userData.key);
```

Dans `onMouseClick()`, apres chaque `updateInfoPanel(...)` (les deux occurrences) :

```js
updateSelectorActive(planet.userData.key);
```

- [ ] **Étape 3 : Appeler buildPlanetSelector() dans init()**

Dans `init()`, apres `createVelocityArrows()` :

```js
buildPlanetSelector();
```

- [ ] **Étape 4 : Vérifier dans le navigateur**

- Ouvrir le panel "PLANETES" (onglet bas) → 9 dots colorés avec noms
- Cliquer "Jupiter" → zoom caméra vers Jupiter, panel info ouvert avec ses données, dot Jupiter actif
- Survoler Mars dans la scène → dot Mars s'active
- Cliquer dans le vide → tous les dots se désélectionnent

---

## Checklist de verification finale

- [ ] Uranus a ses anneaux quasi verticaux (inclinaison 97.77°)
- [ ] Saturne a ses anneaux inclinés (~27°), stables — ne tournent pas avec la planete
- [ ] Venus tourne en sens inverse (retrograde)
- [ ] Jupiter est plus grande que Saturne, Mars plus petite que la Terre
- [ ] Les 4 panels s'ouvrent/ferment sans se superposer
- [ ] Clic sur un dot planete → zoom camera + info verrouillée
- [ ] Les vecteurs vitesse (toggle Options) s'affichent correctement
- [ ] Aucune erreur console dans le navigateur
