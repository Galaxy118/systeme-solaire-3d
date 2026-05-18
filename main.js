import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ========================================
// Configuration du Système Solaire avec physique réaliste
// ========================================

const PLANETS_DATA = {
    soleil: {
        name: 'Soleil',
        radius: 8,
        distance: 0,
        orbitalPeriod: 0,
        rotationPeriod: 25.4,
        axialTilt: 7.25,
        color: 0xFFDD00, // Jaune vif
        info: {
            type: 'Étoile (naine jaune G2V)',
            age: '4.6 milliards d\'années',
            diameter: '1 392 700 km',
            masse: '1.989 × 10³⁰ kg',
            volume: '1.3 million × Terre',
            temperature_surface: '5 500°C',
            temperature_coeur: '15 millions °C',
            composition: '73% H, 25% He',
            luminosite: '3.828 × 10²⁶ W',
            distance_centre_galaxie: '26 000 années-lumière'
        }
    },
    mercure: {
        name: 'Mercure',
        radius: 0.5,
        distance: 15,
        eccentricity: 0.2056,
        orbitalPeriod: 88,
        rotationPeriod: 58.6,
        axialTilt: 0.034,
        orbitalInclination: 7.0,
        color: 0x8C8C8C,
        info: {
            type: 'Planète tellurique',
            diametre: '4 879 km',
            masse: '3.285 × 10²³ kg',
            distance_soleil: '57.9 millions km',
            periode_orbitale: '88 jours',
            temperature: '-180°C à +430°C',
            gravite: '3.7 m/s²',
            satellites: '0',
            atmosphere: 'Quasi inexistante'
        }
    },
    venus: {
        name: 'Vénus',
        radius: 1.23,
        distance: 22,
        eccentricity: 0.0068,
        orbitalPeriod: 225,
        rotationPeriod: -243,
        axialTilt: 177.4,
        orbitalInclination: 3.4,
        color: 0xE6C87A,
        info: {
            type: 'Planète tellurique',
            diametre: '12 104 km',
            masse: '4.867 × 10²⁴ kg',
            distance_soleil: '108.2 millions km',
            periode_orbitale: '225 jours',
            temperature: '465°C (moyenne)',
            gravite: '8.87 m/s²',
            satellites: '0',
            atmosphere: 'CO₂ dense (92 bars)',
            surnom: '"Étoile du berger"'
        }
    },
    terre: {
        name: 'Terre',
        radius: 1.3,
        distance: 30,
        eccentricity: 0.0167,
        orbitalPeriod: 365.25,
        rotationPeriod: 1,
        axialTilt: 23.44,
        orbitalInclination: 0,
        color: 0x4A90D9,
        hasMoon: true,
        info: {
            type: 'Planète tellurique',
            diametre: '12 742 km',
            masse: '5.972 × 10²⁴ kg',
            distance_soleil: '149.6 millions km',
            periode_orbitale: '365.25 jours',
            temperature: '-89°C à +57°C',
            gravite: '9.81 m/s²',
            satellites: '1 (Lune)',
            atmosphere: 'N₂ 78%, O₂ 21%',
            age: '4.54 milliards d\'années'
        }
    },
    mars: {
        name: 'Mars',
        radius: 0.7,
        distance: 40,
        eccentricity: 0.0934,
        orbitalPeriod: 687,
        rotationPeriod: 1.03,
        axialTilt: 25.19,
        orbitalInclination: 1.85,
        color: 0xC1440E,
        info: {
            type: 'Planète tellurique',
            diametre: '6 779 km',
            masse: '6.39 × 10²³ kg',
            distance_soleil: '227.9 millions km',
            periode_orbitale: '687 jours',
            temperature: '-87°C à -5°C',
            gravite: '3.71 m/s²',
            satellites: '2 (Phobos, Deimos)',
            atmosphere: 'CO₂ 95% (0.6% Terre)',
            surnom: '"Planète rouge"'
        }
    },
    jupiter: {
        name: 'Jupiter',
        radius: 5.5,
        distance: 65,
        eccentricity: 0.0489,
        orbitalPeriod: 4333,
        rotationPeriod: 0.41,
        axialTilt: 3.13,
        orbitalInclination: 1.3,
        color: 0xD4A574,
        info: {
            type: 'Géante gazeuse',
            diametre: '139 820 km',
            masse: '1.898 × 10²⁷ kg',
            distance_soleil: '778.5 millions km',
            periode_orbitale: '11.86 ans',
            temperature: '-145°C (nuages)',
            gravite: '24.79 m/s²',
            satellites: '95 connus',
            composition: 'H₂ 90%, He 10%',
            particularite: 'Grande Tache Rouge'
        }
    },
    saturne: {
        name: 'Saturne',
        radius: 4.5,
        distance: 90,
        eccentricity: 0.0565,
        orbitalPeriod: 10759,
        rotationPeriod: 0.44,
        axialTilt: 26.73,
        orbitalInclination: 2.49,
        color: 0xEAD6A6,
        hasRings: true,
        info: {
            type: 'Géante gazeuse',
            diametre: '116 460 km',
            masse: '5.683 × 10²⁶ kg',
            distance_soleil: '1.43 milliards km',
            periode_orbitale: '29.46 ans',
            temperature: '-178°C (nuages)',
            gravite: '10.44 m/s²',
            satellites: '146 connus',
            anneaux: '282 000 km de large',
            densite: '0.69 (flotte sur l\'eau!)'
        }
    },
    uranus: {
        name: 'Uranus',
        radius: 2.8,
        distance: 115,
        eccentricity: 0.0457,
        orbitalPeriod: 30687,
        rotationPeriod: -0.72,
        axialTilt: 97.77,
        orbitalInclination: 0.77,
        color: 0x7DE3F4,
        hasRings: true,
        info: {
            type: 'Géante de glace',
            diametre: '50 724 km',
            masse: '8.681 × 10²⁵ kg',
            distance_soleil: '2.87 milliards km',
            periode_orbitale: '84.01 ans',
            temperature: '-224°C',
            gravite: '8.69 m/s²',
            satellites: '28 connus',
            particularite: 'Tourne sur le côté (98°)',
            decouverte: '1781 (W. Herschel)'
        }
    },
    neptune: {
        name: 'Neptune',
        radius: 2.7,
        distance: 135,
        eccentricity: 0.0113,
        orbitalPeriod: 60190,
        rotationPeriod: 0.67,
        axialTilt: 28.32,
        orbitalInclination: 1.77,
        color: 0x4B70DD,
        info: {
            type: 'Géante de glace',
            diametre: '49 244 km',
            masse: '1.024 × 10²⁶ kg',
            distance_soleil: '4.5 milliards km',
            periode_orbitale: '164.8 ans',
            temperature: '-218°C',
            gravite: '11.15 m/s²',
            satellites: '16 connus',
            vents: 'Jusqu\'à 2 100 km/h',
            decouverte: '1846 (calculs math.)'
        }
    }
};

// Textures photo-réalistes (sources : NASA/JPL, Solar System Scope)
const TEXTURE_URLS = {
    soleil: { map: './img/2k_sun.jpg' },
    mercure: { map: './img/2k_mercury.jpg' },
    venus: { map: './img/2k_venus_surface.jpg' },
    terre: { map: './img/2k_earth_daymap.jpg' },
    mars: { map: './img/2k_mars.jpg' },
    jupiter: { map: './img/2k_jupiter.jpg' },
    saturne: { map: './img/2k_saturn.jpg' }, // pas de texture d'anneaux en local
    uranus: { map: './img/2k_uranus.jpg' },   // pas de texture d'anneaux en local
    neptune: { map: './img/2k_neptune.jpg' },
    lune: { map: './img/2k_moon.jpg' }
};

// ========================================
// Variables globales
// ========================================

let scene, camera, renderer, controls;
let planets = {};
let orbits = [];
let clock = new THREE.Clock();
let speedMultiplier = 1;
let isPaused = false;
let showOrbits = true;
let showLabels = true;
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let hoveredPlanet = null;
let lockedPlanet = null; // Planète dont les infos sont verrouillées
let introActive = true;
let showVelocity = false;
let velocityArrows = {};
let cameraAnimation = null;
let cinematicAnimation = null;
let skipIndicator = null;
let distanceCounter = null;
let activePlanetLabels = [];
let starParticles = []; // Cache for star particle systems

const textureLoader = new THREE.TextureLoader();
textureLoader.crossOrigin = 'anonymous';

// ========================================
// Easing Functions pour Animation Cinématique
// ========================================

const EASING = {
    easeInCubic: (t) => t * t * t,
    easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    easeOutCubic: (t) => 1 - Math.pow(1 - t, 3)
};

// Helper de chargement avec logs
function loadTexture(path) {
    try {
        const tex = textureLoader.load(
            path,
            (t) => {
                t.colorSpace = THREE.SRGBColorSpace;
                t.needsUpdate = true;
                console.info(`Texture chargée : ${path}`);
            },
            undefined,
            (err) => console.warn(`Texture non chargée : ${path}`, err)
        );
        return tex || null;
    } catch (e) {
        console.warn(`Erreur de chargement texture : ${path}`, e);
        return null;
    }
}

// ========================================
// Générateur de bruit Simplex pour les textures
// ========================================

class SimplexNoise {
    constructor(seed = Math.random()) {
        this.p = new Uint8Array(256);
        for (let i = 0; i < 256; i++) this.p[i] = i;
        
        let n, q;
        for (let i = 255; i > 0; i--) {
            seed = (seed * 16807) % 2147483647;
            n = Math.floor((seed / 2147483647) * (i + 1));
            q = this.p[i];
            this.p[i] = this.p[n];
            this.p[n] = q;
        }
        
        this.perm = new Uint8Array(512);
        for (let i = 0; i < 512; i++) this.perm[i] = this.p[i & 255];
    }
    
    noise2D(x, y) {
        const F2 = 0.5 * (Math.sqrt(3) - 1);
        const G2 = (3 - Math.sqrt(3)) / 6;
        
        let s = (x + y) * F2;
        let i = Math.floor(x + s);
        let j = Math.floor(y + s);
        let t = (i + j) * G2;
        let X0 = i - t;
        let Y0 = j - t;
        let x0 = x - X0;
        let y0 = y - Y0;
        
        let i1, j1;
        if (x0 > y0) { i1 = 1; j1 = 0; }
        else { i1 = 0; j1 = 1; }
        
        let x1 = x0 - i1 + G2;
        let y1 = y0 - j1 + G2;
        let x2 = x0 - 1 + 2 * G2;
        let y2 = y0 - 1 + 2 * G2;
        
        let ii = i & 255;
        let jj = j & 255;
        
        let n0 = 0, n1 = 0, n2 = 0;
        
        let t0 = 0.5 - x0 * x0 - y0 * y0;
        if (t0 >= 0) {
            let gi0 = this.perm[ii + this.perm[jj]] % 12;
            t0 *= t0;
            n0 = t0 * t0 * this.dot2(gi0, x0, y0);
        }
        
        let t1 = 0.5 - x1 * x1 - y1 * y1;
        if (t1 >= 0) {
            let gi1 = this.perm[ii + i1 + this.perm[jj + j1]] % 12;
            t1 *= t1;
            n1 = t1 * t1 * this.dot2(gi1, x1, y1);
        }
        
        let t2 = 0.5 - x2 * x2 - y2 * y2;
        if (t2 >= 0) {
            let gi2 = this.perm[ii + 1 + this.perm[jj + 1]] % 12;
            t2 *= t2;
            n2 = t2 * t2 * this.dot2(gi2, x2, y2);
        }
        
        return 70 * (n0 + n1 + n2);
    }
    
    dot2(gi, x, y) {
        const grad3 = [
            [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
            [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
            [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
        ];
        return grad3[gi][0] * x + grad3[gi][1] * y;
    }
    
    fbm(x, y, octaves = 4, persistence = 0.5) {
        let total = 0;
        let frequency = 1;
        let amplitude = 1;
        let maxValue = 0;
        
        for (let i = 0; i < octaves; i++) {
            total += this.noise2D(x * frequency, y * frequency) * amplitude;
            maxValue += amplitude;
            amplitude *= persistence;
            frequency *= 2;
        }
        
        return total / maxValue;
    }
}

const noise = new SimplexNoise(42);

// ========================================
// Génération de textures procédurales
// ========================================

function generatePlanetTexture(type, size = 1024) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size / 2;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const i = (y * canvas.width + x) * 4;
            
            // Coordonnées sphériques
            const u = x / canvas.width;
            const v = y / canvas.height;
            const theta = u * Math.PI * 2;
            const phi = v * Math.PI;
            
            // Position 3D sur la sphère
            const px = Math.sin(phi) * Math.cos(theta);
            const py = Math.sin(phi) * Math.sin(theta);
            const pz = Math.cos(phi);
            
            let r, g, b;
            
            switch(type) {
                case 'sun':
                    const sunNoise = noise.fbm(px * 3, py * 3, 6, 0.6);
                    const sunIntensity = 0.7 + sunNoise * 0.3;
                    r = Math.min(255, 255 * sunIntensity);
                    g = Math.min(255, 180 * sunIntensity + 50);
                    b = Math.min(255, 50 * sunIntensity);
                    break;
                    
                case 'mercury':
                    const mercNoise = noise.fbm(px * 8, py * 8, 5, 0.5);
                    const craters = Math.max(0, noise.fbm(px * 15, pz * 15, 3, 0.7));
                    const mercBase = 0.4 + mercNoise * 0.3 - craters * 0.2;
                    r = g = b = Math.max(80, Math.min(200, mercBase * 255));
                    break;
                    
                case 'venus':
                    const venusNoise = noise.fbm(px * 4, py * 4, 5, 0.6);
                    const venusClouds = noise.fbm(px * 6 + 100, py * 6, 4, 0.5);
                    const venusBase = 0.7 + venusNoise * 0.2 + venusClouds * 0.1;
                    r = Math.min(255, 230 * venusBase);
                    g = Math.min(255, 190 * venusBase);
                    b = Math.min(255, 120 * venusBase);
                    break;
                    
                case 'earth':
                    const elevation = noise.fbm(px * 4, pz * 4, 6, 0.5);
                    const detail = noise.fbm(px * 12, pz * 12, 4, 0.4);
                    const land = elevation > 0.1;
                    
                    if (land) {
                        // Terrain
                        const height = (elevation - 0.1) * 2;
                        if (height > 0.6) {
                            // Montagnes enneigées
                            r = 240; g = 240; b = 250;
                        } else if (height > 0.4) {
                            // Montagnes
                            r = 120 + detail * 30;
                            g = 100 + detail * 20;
                            b = 80;
                        } else if (height > 0.1) {
                            // Forêts
                            r = 34 + detail * 20;
                            g = 100 + detail * 30;
                            b = 34 + detail * 10;
                        } else {
                            // Plaines
                            r = 80 + detail * 40;
                            g = 140 + detail * 30;
                            b = 60 + detail * 20;
                        }
                    } else {
                        // Océan
                        const depth = Math.abs(elevation) * 2;
                        r = 20 + depth * 30;
                        g = 60 + depth * 40 + detail * 20;
                        b = 140 + depth * 60;
                    }
                    break;
                    
                case 'mars':
                    const marsNoise = noise.fbm(px * 5, pz * 5, 5, 0.5);
                    const marsDetail = noise.fbm(px * 15, pz * 15, 4, 0.4);
                    const marsHeight = 0.5 + marsNoise * 0.3 + marsDetail * 0.1;
                    
                    // Calottes polaires
                    const polar = Math.abs(pz) > 0.85;
                    if (polar) {
                        r = 240; g = 235; b = 230;
                    } else {
                        r = Math.min(255, 180 * marsHeight + 40);
                        g = Math.min(255, 80 * marsHeight + 20);
                        b = Math.min(255, 50 * marsHeight);
                    }
                    break;
                    
                case 'jupiter':
                    const jupLat = v * 2 - 1;
                    const jupBands = Math.sin(jupLat * 25) * 0.3;
                    const jupStorm = noise.fbm(px * 3 + jupLat * 2, py * 3, 4, 0.6);
                    const jupTurb = noise.fbm(px * 8, py * 8 + jupLat * 5, 5, 0.5);
                    
                    // Grande tache rouge
                    const spotX = px - 0.3;
                    const spotY = jupLat + 0.25;
                    const spotDist = Math.sqrt(spotX * spotX * 4 + spotY * spotY * 16);
                    const inSpot = spotDist < 0.3;
                    
                    const jupBase = 0.6 + jupBands * 0.2 + jupStorm * 0.15 + jupTurb * 0.1;
                    
                    if (inSpot) {
                        const spotSwirl = noise.fbm(spotX * 20 + Math.atan2(spotY, spotX) * 3, spotY * 20, 4, 0.5);
                        r = Math.min(255, 200 + spotSwirl * 40);
                        g = Math.min(255, 100 + spotSwirl * 30);
                        b = Math.min(255, 80 + spotSwirl * 20);
                    } else {
                        r = Math.min(255, 210 * jupBase + 20);
                        g = Math.min(255, 165 * jupBase + 30);
                        b = Math.min(255, 115 * jupBase + 20);
                    }
                    break;
                    
                case 'saturn':
                    const satLat = v * 2 - 1;
                    const satBands = Math.sin(satLat * 20) * 0.2;
                    const satNoise = noise.fbm(px * 4, py * 4 + satLat * 3, 5, 0.5);
                    const satBase = 0.7 + satBands * 0.15 + satNoise * 0.15;
                    
                    r = Math.min(255, 235 * satBase);
                    g = Math.min(255, 210 * satBase);
                    b = Math.min(255, 160 * satBase);
                    break;
                    
                case 'uranus':
                    const uraLat = v * 2 - 1;
                    const uraNoise = noise.fbm(px * 3, py * 3, 4, 0.4);
                    const uraBands = Math.sin(uraLat * 15) * 0.1;
                    const uraBase = 0.7 + uraNoise * 0.15 + uraBands;
                    
                    r = Math.min(255, 150 * uraBase);
                    g = Math.min(255, 220 * uraBase);
                    b = Math.min(255, 235 * uraBase);
                    break;
                    
                case 'neptune':
                    const nepLat = v * 2 - 1;
                    const nepNoise = noise.fbm(px * 4, py * 4, 5, 0.5);
                    const nepBands = Math.sin(nepLat * 12) * 0.15;
                    const nepStorm = noise.fbm(px * 8, py * 8, 3, 0.6);
                    const nepBase = 0.6 + nepNoise * 0.2 + nepBands;
                    
                    // Taches sombres occasionnelles
                    const darkSpot = nepStorm > 0.4 ? 0.85 : 1;
                    
                    r = Math.min(255, 65 * nepBase * darkSpot);
                    g = Math.min(255, 105 * nepBase * darkSpot);
                    b = Math.min(255, 225 * nepBase);
                    break;
                    
                case 'moon':
                    const moonNoise = noise.fbm(px * 10, pz * 10, 5, 0.5);
                    const moonCraters = Math.max(0, noise.fbm(px * 20, pz * 20, 3, 0.7));
                    const moonBase = 0.5 + moonNoise * 0.3 - moonCraters * 0.25;
                    r = g = b = Math.max(100, Math.min(220, moonBase * 255));
                    break;
                    
                default:
                    r = g = b = 128;
            }
            
            data[i] = r;
            data[i + 1] = g;
            data[i + 2] = b;
            data[i + 3] = 255;
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
}

// Générer texture de nuages pour la Terre
function generateCloudTexture(size = 1024) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size / 2;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const i = (y * canvas.width + x) * 4;
            
            const u = x / canvas.width;
            const v = y / canvas.height;
            const theta = u * Math.PI * 2;
            const phi = v * Math.PI;
            
            const px = Math.sin(phi) * Math.cos(theta);
            const py = Math.sin(phi) * Math.sin(theta);
            const pz = Math.cos(phi);
            
            const cloudNoise = noise.fbm(px * 5, py * 5, 5, 0.6);
            const cloudDetail = noise.fbm(px * 12, py * 12, 4, 0.5);
            
            const cloud = Math.max(0, cloudNoise * 0.7 + cloudDetail * 0.3 - 0.1);
            const alpha = Math.min(255, cloud * 400);
            
            data[i] = 255;
            data[i + 1] = 255;
            data[i + 2] = 255;
            data[i + 3] = alpha;
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
}

// Générer une normal map pour le relief
function generateNormalMap(type, size = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size / 2;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const data = imageData.data;
    
    const heightMap = [];
    
    // Calculer la heightmap
    for (let y = 0; y < canvas.height; y++) {
        heightMap[y] = [];
        for (let x = 0; x < canvas.width; x++) {
            const u = x / canvas.width;
            const v = y / canvas.height;
            const theta = u * Math.PI * 2;
            const phi = v * Math.PI;
            
            const px = Math.sin(phi) * Math.cos(theta);
            const py = Math.sin(phi) * Math.sin(theta);
            const pz = Math.cos(phi);
            
            let height;
            switch(type) {
                case 'earth':
                    height = noise.fbm(px * 4, pz * 4, 6, 0.5);
                    break;
                case 'mars':
                    height = noise.fbm(px * 5, pz * 5, 5, 0.5);
                    break;
                case 'moon':
                    height = noise.fbm(px * 10, pz * 10, 5, 0.5);
                    break;
                default:
                    height = noise.fbm(px * 6, pz * 6, 4, 0.5);
            }
            heightMap[y][x] = height;
        }
    }
    
    // Calculer les normales
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const i = (y * canvas.width + x) * 4;
            
            const left = heightMap[y][(x - 1 + canvas.width) % canvas.width];
            const right = heightMap[y][(x + 1) % canvas.width];
            const up = heightMap[Math.max(0, y - 1)][x];
            const down = heightMap[Math.min(canvas.height - 1, y + 1)][x];
            
            const dx = (right - left) * 2;
            const dy = (down - up) * 2;
            
            // Normaliser
            const len = Math.sqrt(dx * dx + dy * dy + 1);
            
            data[i] = ((dx / len) * 0.5 + 0.5) * 255;
            data[i + 1] = ((dy / len) * 0.5 + 0.5) * 255;
            data[i + 2] = ((1 / len) * 0.5 + 0.5) * 255;
            data[i + 3] = 255;
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
}

// ========================================
// Initialisation
// ========================================

function init() {
    // Scène
    scene = new THREE.Scene();
    
    // Caméra - Position initiale très éloignée
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(0, 300, 500);
    camera.lookAt(0, 0, 0);
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 2.5;
    document.getElementById('container').appendChild(renderer.domElement);
    
    // Contrôles orbitaux
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 20;
    controls.maxDistance = 400;
    controls.enablePan = true;
    controls.enabled = false; // Désactivé pendant l'intro
    
    // Créer les éléments
    createStarfield();
    createSun();
    createAsteroidBelt();
    createPlanets();
    createVelocityArrows();
    buildPlanetSelector();
    createAmbientLight();

    // Event listeners
    setupEventListeners();
    setupMenu();
    setupPlanetInfoFullscreen();
    setupDocumentation();
    setupIntroAnimation();
    
    // Démarrer l'animation
    animate();
}


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


// ========================================
// Animation Cinématique - Core Logic
// ========================================
// Duration: 7s total
// Phase 1 (0-2s): Slow acceleration, distance counter appears after 0.5s
// Phase 2 (2-5s): Fast travel with warp effect and planet labels
// Phase 3 (5-7s): Deceleration, UI elements fade in
// Skip indicator: Appears after 1s, allows instant skip to final position

function calculateCinematicProgress(elapsed) {
    const duration = 7000;
    const progress = Math.min(elapsed / duration, 1);

    let phase, phaseProgress, easedProgress;

    if (progress < 0.286) { // Phase 1: 0-2s (2/7 = 0.286)
        phase = 1;
        phaseProgress = progress / 0.286;
        easedProgress = EASING.easeInCubic(phaseProgress) * 0.2; // 0 to 0.2
    } else if (progress < 0.714) { // Phase 2: 2-5s (5/7 = 0.714)
        phase = 2;
        phaseProgress = (progress - 0.286) / 0.428;
        easedProgress = 0.2 + (EASING.easeInOutCubic(phaseProgress) * 0.6); // 0.2 to 0.8
    } else { // Phase 3: 5-7s
        phase = 3;
        phaseProgress = (progress - 0.714) / 0.286;
        easedProgress = 0.8 + (EASING.easeOutCubic(phaseProgress) * 0.2); // 0.8 to 1.0
    }

    return { progress, phase, phaseProgress, easedProgress };
}

function updateWarpEffect(intensity) {
    // Intensity: 0 (no warp) to 1 (max warp)
    // Use cached star particles instead of iterating all scene children
    for (let i = 0; i < starParticles.length; i++) {
        const material = starParticles[i].material;
        const baseSize = i === 0 ? 0.5 : 0.8; // First layer base size 0.5, second 0.8
        material.size = baseSize + (intensity * 0.3);
        material.opacity = (i === 0 ? 0.8 : 0.9) - (intensity * 0.2);
    }
}

function checkAndShowPlanetLabels(cameraPosition, phase) {
    if (phase !== 2) return;

    // Early exit if both labels already shown
    const jupiterShown = planets.jupiter && planets.jupiter.labelShown;
    const terreShown = planets.terre && planets.terre.labelShown;
    if (jupiterShown && terreShown) return;

    // Afficher Jupiter si caméra passe près
    if (!jupiterShown && planets.jupiter && planets.jupiter.mesh) {
        const distToJupiter = cameraPosition.distanceTo(planets.jupiter.mesh.position);
        if (distToJupiter < 80) {
            const jupiterPos = planets.jupiter.mesh.position.clone();
            jupiterPos.project(camera);
            const screenX = (jupiterPos.x * 0.5 + 0.5) * window.innerWidth;
            const screenY = (-(jupiterPos.y * 0.5) + 0.5) * window.innerHeight - 30;
            showPlanetLabel('Jupiter', screenX, screenY, 1600);
            planets.jupiter.labelShown = true;
        }
    }

    // Afficher Terre si caméra passe près
    if (!terreShown && planets.terre && planets.terre.mesh) {
        const distToTerre = cameraPosition.distanceTo(planets.terre.mesh.position);
        if (distToTerre < 50) {
            const terrePos = planets.terre.mesh.position.clone();
            terrePos.project(camera);
            const screenX = (terrePos.x * 0.5 + 0.5) * window.innerWidth;
            const screenY = (-(terrePos.y * 0.5) + 0.5) * window.innerHeight - 30;
            showPlanetLabel('Terre', screenX, screenY, 1600);
            planets.terre.labelShown = true;
        }
    }
}


// ========================================
// Skip fonctionnalité
// ========================================

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

            // Faire apparaître le bouton menu burger
            const menuToggle = document.getElementById('menu-toggle');
            if (menuToggle) {
                menuToggle.classList.add('visible');
            }
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


// ========================================
// Animation d'introduction
// ========================================

function setupIntroAnimation() {
    const startBtn = document.getElementById('start-btn');
    const introScreen = document.getElementById('intro-screen');

    // Setup skip listeners (active dès le début)
    setupSkipListeners();

    startBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent skip listener from catching this click
        introScreen.classList.add('fade-out');
        startCinematicAnimation();

        setTimeout(() => {
            introScreen.classList.add('hidden');
            // Note: introActive et controls seront gérés par l'animation
        }, 1500);
    });
}

function startCinematicAnimation() {
    // Use current camera position as start (in case it was moved by controls or other animations)
    const startPos = { x: camera.position.x, y: camera.position.y, z: camera.position.z };
    const endPos = { x: 80, y: 60, z: 120 };
    const duration = 7000;
    const startTime = Date.now();

    cinematicAnimation = {
        startPos,
        endPos,
        duration,
        startTime,
        active: true,
        skipped: false,
        counterShown: false,
        counterHidden: false
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

function updateCinematicAnimation() {
    if (!cinematicAnimation || !cinematicAnimation.active) return;

    const elapsed = Date.now() - cinematicAnimation.startTime;
    const progress = Math.min(elapsed / cinematicAnimation.duration, 1);

    // Smooth easing: ease-in-out cubic for elegant movement
    const t = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    // Update camera position
    camera.position.x = cinematicAnimation.startPos.x + (cinematicAnimation.endPos.x - cinematicAnimation.startPos.x) * t;
    camera.position.y = cinematicAnimation.startPos.y + (cinematicAnimation.endPos.y - cinematicAnimation.startPos.y) * t;
    camera.position.z = cinematicAnimation.startPos.z + (cinematicAnimation.endPos.z - cinematicAnimation.startPos.z) * t;

    camera.lookAt(0, 0, 0);

    // Show distance counter after 0.5s
    if (elapsed > 500 && !cinematicAnimation.counterShown && distanceCounter) {
        distanceCounter.classList.add('visible');
        cinematicAnimation.counterShown = true;
    }

    // Update distance counter
    if (distanceCounter && cinematicAnimation.counterShown) {
        const remainingDistance = camera.position.length();
        const distanceInAU = Math.round(remainingDistance / 1.5);
        distanceCounter.textContent = `${distanceInAU} UA`;
    }

    // Hide counter at 90% progress
    if (progress > 0.9 && !cinematicAnimation.counterHidden && distanceCounter) {
        distanceCounter.classList.remove('visible');
        cinematicAnimation.counterHidden = true;
    }

    // Very subtle warp effect (only if intensity is significant)
    if (progress > 0.2 && progress < 0.8) {
        const warpProgress = (progress - 0.2) / 0.6; // Normalize to 0-1
        const warpIntensity = Math.sin(warpProgress * Math.PI) * 0.15; // Gentle sine curve, max 0.15

        // Direct material access - no array iteration
        if (starParticles[0]) {
            starParticles[0].material.size = 0.5 + warpIntensity * 0.2;
            starParticles[0].material.opacity = 0.8 - warpIntensity * 0.1;
        }
        if (starParticles[1]) {
            starParticles[1].material.size = 0.8 + warpIntensity * 0.2;
            starParticles[1].material.opacity = 0.9 - warpIntensity * 0.1;
        }
    } else if (progress <= 0.2 || progress >= 0.8) {
        // Reset to base values at start and end
        if (starParticles[0]) {
            starParticles[0].material.size = 0.5;
            starParticles[0].material.opacity = 0.8;
        }
        if (starParticles[1]) {
            starParticles[1].material.size = 0.8;
            starParticles[1].material.opacity = 0.9;
        }
    }

    // Animation complete
    if (progress >= 1) {
        cinematicAnimation.active = false;
        controls.enabled = true;
        controls.target.set(0, 0, 0);
        introActive = false;
        hideSkipIndicator();

        // Faire apparaître le bouton menu burger
        const menuToggle = document.getElementById('menu-toggle');
        if (menuToggle) {
            menuToggle.classList.add('visible');
        }

        // Reset star particles
        if (starParticles[0]) {
            starParticles[0].material.size = 0.5;
            starParticles[0].material.opacity = 0.8;
        }
        if (starParticles[1]) {
            starParticles[1].material.size = 0.8;
            starParticles[1].material.opacity = 0.9;
        }
    }
}

// ========================================
// Création du champ d'étoiles
// ========================================

function createStarfield() {
    const starsGeometry = new THREE.BufferGeometry();
    const starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.5,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });
    
    const starsVertices = [];
    for (let i = 0; i < 15000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starsVertices.push(x, y, z);
    }
    
    starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);
    starParticles.push(stars); // Cache reference for warp effect
    
    // Deuxième couche d'étoiles colorées
    const starsGeometry2 = new THREE.BufferGeometry();
    const starsVertices2 = [];
    const starsColors = [];
    
    for (let i = 0; i < 5000; i++) {
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        starsVertices2.push(x, y, z);
        
        // Couleurs variées pour les étoiles
        const colorChoice = Math.random();
        if (colorChoice < 0.3) {
            starsColors.push(1, 0.9, 0.8); // Jaune
        } else if (colorChoice < 0.5) {
            starsColors.push(0.8, 0.9, 1); // Bleu
        } else if (colorChoice < 0.6) {
            starsColors.push(1, 0.8, 0.7); // Orange
        } else {
            starsColors.push(1, 1, 1); // Blanc
        }
    }
    
    starsGeometry2.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices2, 3));
    starsGeometry2.setAttribute('color', new THREE.Float32BufferAttribute(starsColors, 3));
    
    const starsMaterial2 = new THREE.PointsMaterial({
        size: 0.8,
        transparent: true,
        opacity: 0.9,
        sizeAttenuation: true,
        vertexColors: true
    });
    
    const stars2 = new THREE.Points(starsGeometry2, starsMaterial2);
    scene.add(stars2);
    starParticles.push(stars2); // Cache reference for warp effect
}

// ========================================
// Création du Soleil
// ========================================

function createSun() {
    const sunData = PLANETS_DATA.soleil;
    
    // Géométrie et matériau du soleil (texture réelle)
    const sunGeometry = new THREE.SphereGeometry(sunData.radius, 64, 64);
    const sunMap = textureLoader.load(TEXTURE_URLS.soleil.map);
    if (sunMap) {
        sunMap.colorSpace = THREE.SRGBColorSpace;
    }
    const sunMaterial = new THREE.MeshBasicMaterial({
        color: sunData.color,
        map: sunMap
    });
    
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.userData = { planetData: sunData, key: 'soleil' };
    
    // Appliquer l'inclinaison axiale
    sun.rotation.x = THREE.MathUtils.degToRad(sunData.axialTilt);
    
    scene.add(sun);
    planets.soleil = { mesh: sun, data: sunData };
    
    // Lueur du soleil (glow effect)
    const glowGeometry = new THREE.SphereGeometry(sunData.radius * 1.3, 32, 32);
    const glowMaterial = new THREE.ShaderMaterial({
        uniforms: {
            c: { value: 0.1 },
            p: { value: 4.5 },
            glowColor: { value: new THREE.Color(0xff6600) },
            viewVector: { value: camera.position }
        },
        vertexShader: `
            uniform vec3 viewVector;
            varying float intensity;
            void main() {
                vec3 vNormal = normalize(normalMatrix * normal);
                vec3 vNormel = normalize(normalMatrix * viewVector);
                intensity = pow(0.7 - dot(vNormal, vNormel), 2.0);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 glowColor;
            varying float intensity;
            void main() {
                vec3 glow = glowColor * intensity;
                gl_FragColor = vec4(glow, intensity * 0.8);
            }
        `,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        transparent: true
    });
    
    const sunGlow = new THREE.Mesh(glowGeometry, glowMaterial);
    sun.add(sunGlow);
    
    // Corona effect
    const coronaGeometry = new THREE.SphereGeometry(sunData.radius * 1.6, 32, 32);
    const coronaMaterial = new THREE.ShaderMaterial({
        uniforms: {
            glowColor: { value: new THREE.Color(0xff4400) },
            viewVector: { value: camera.position }
        },
        vertexShader: `
            uniform vec3 viewVector;
            varying float intensity;
            void main() {
                vec3 vNormal = normalize(normalMatrix * normal);
                vec3 vNormel = normalize(normalMatrix * viewVector);
                intensity = pow(0.5 - dot(vNormal, vNormel), 3.0);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 glowColor;
            varying float intensity;
            void main() {
                vec3 glow = glowColor * intensity;
                gl_FragColor = vec4(glow, intensity * 0.4);
            }
        `,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        transparent: true
    });
    
    const corona = new THREE.Mesh(coronaGeometry, coronaMaterial);
    sun.add(corona);
    
    // Lumière du soleil
    const sunLight = new THREE.PointLight(0xffffff, 6, 500);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);
}

// ========================================
// Création des planètes
// ========================================

// ========================================
// Création de la ceinture d'astéroïdes
// ========================================

function createAsteroidBelt() {
    const asteroidGroup = new THREE.Group();
    
    // Ceinture principale entre Mars (40) et Jupiter (65)
    const innerRadius = 48;
    const outerRadius = 58;
    const numAsteroids = 1500;
    
    // Matériau pour les astéroïdes
    const asteroidMaterial = new THREE.MeshPhongMaterial({
        color: 0x8B7355,
        emissive: 0x222222,
        emissiveIntensity: 0.3,
        shininess: 5,
        flatShading: true
    });
    
    for (let i = 0; i < numAsteroids; i++) {
        // Distribution aléatoire dans la ceinture
        const distance = innerRadius + Math.random() * (outerRadius - innerRadius);
        const angle = Math.random() * Math.PI * 2;
        const height = (Math.random() - 0.5) * 2; // Variation en hauteur
        
        // Taille variable des astéroïdes
        const size = 0.05 + Math.random() * 0.15;
        
        // Géométrie irrégulière (plusieurs formes)
        let geometry;
        const shapeType = Math.random();
        if (shapeType < 0.33) {
            geometry = new THREE.DodecahedronGeometry(size, 0);
        } else if (shapeType < 0.66) {
            geometry = new THREE.IcosahedronGeometry(size, 0);
        } else {
            geometry = new THREE.TetrahedronGeometry(size, 0);
        }
        
        const asteroid = new THREE.Mesh(geometry, asteroidMaterial);
        
        // Position sur l'orbite circulaire
        asteroid.position.x = distance * Math.cos(angle);
        asteroid.position.z = distance * Math.sin(angle);
        asteroid.position.y = height;
        
        // Rotation aléatoire
        asteroid.rotation.x = Math.random() * Math.PI * 2;
        asteroid.rotation.y = Math.random() * Math.PI * 2;
        asteroid.rotation.z = Math.random() * Math.PI * 2;
        
        // Stocker les données d'orbite pour l'animation
        asteroid.userData = {
            distance: distance,
            angle: angle,
            rotationSpeed: 0.001 + Math.random() * 0.003,
            orbitalSpeed: 0.0001 + Math.random() * 0.0002
        };
        
        asteroidGroup.add(asteroid);
    }
    
    // Ceinture de Kuiper (au-delà de Neptune)
    const kuiperInnerRadius = 145;
    const kuiperOuterRadius = 160;
    const numKuiperObjects = 800;
    
    const kuiperMaterial = new THREE.MeshPhongMaterial({
        color: 0x9BAAB3,
        emissive: 0x111111,
        emissiveIntensity: 0.2,
        shininess: 3,
        flatShading: true
    });
    
    for (let i = 0; i < numKuiperObjects; i++) {
        const distance = kuiperInnerRadius + Math.random() * (kuiperOuterRadius - kuiperInnerRadius);
        const angle = Math.random() * Math.PI * 2;
        const height = (Math.random() - 0.5) * 4; // Plus de variation en hauteur
        
        const size = 0.08 + Math.random() * 0.2;
        
        let geometry;
        const shapeType = Math.random();
        if (shapeType < 0.5) {
            geometry = new THREE.IcosahedronGeometry(size, 0);
        } else {
            geometry = new THREE.DodecahedronGeometry(size, 0);
        }
        
        const kuiperObject = new THREE.Mesh(geometry, kuiperMaterial);
        
        kuiperObject.position.x = distance * Math.cos(angle);
        kuiperObject.position.z = distance * Math.sin(angle);
        kuiperObject.position.y = height;
        
        kuiperObject.rotation.x = Math.random() * Math.PI * 2;
        kuiperObject.rotation.y = Math.random() * Math.PI * 2;
        kuiperObject.rotation.z = Math.random() * Math.PI * 2;
        
        kuiperObject.userData = {
            distance: distance,
            angle: angle,
            rotationSpeed: 0.0005 + Math.random() * 0.002,
            orbitalSpeed: 0.00005 + Math.random() * 0.0001
        };
        
        asteroidGroup.add(kuiperObject);
    }
    
    scene.add(asteroidGroup);
    window.asteroidBelt = asteroidGroup; // Pour pouvoir l'animer
}

function createPlanets() {
    Object.keys(PLANETS_DATA).forEach(key => {
        if (key === 'soleil') return;
        
        const data = PLANETS_DATA[key];
        
        // Paramètres de l'ellipse
        const e = data.eccentricity || 0; // Excentricité
        const a = data.distance; // Demi-grand axe
        const b = a * Math.sqrt(1 - e * e); // Demi-petit axe
        const c = a * e; // Distance centre-foyer (le Soleil est au foyer)
        
        // Conteneur pour l'orbite (plan orbital incliné)
        const orbitContainer = new THREE.Object3D();
        if (data.orbitalInclination) {
            orbitContainer.rotation.x = THREE.MathUtils.degToRad(data.orbitalInclination);
        }
        scene.add(orbitContainer);
        
        // Planète (texture photo-réaliste)
        const geometry = new THREE.SphereGeometry(data.radius, 64, 64);
        const textureDef = TEXTURE_URLS[key] || {};
        const map = textureDef.map ? loadTexture(textureDef.map) : null;
        const material = new THREE.MeshPhongMaterial({
            color: map ? 0xffffff : data.color, // ne pas assombrir la texture
            map: map || undefined,
            emissive: map ? 0x555555 : 0x333333,
            emissiveMap: map || undefined,
            emissiveIntensity: map ? 1.5 : 0.6,
            shininess: 16
        });
        
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
        
        // Créer la ligne d'orbite elliptique
        const orbitGeometry = new THREE.BufferGeometry();
        const orbitPoints = [];
        const segments = 256; // Plus de segments pour une ellipse lisse
        
        for (let i = 0; i <= segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            // Équation paramétrique de l'ellipse, décalée pour que le Soleil soit au foyer
            const x = a * Math.cos(angle) - c;
            const z = b * Math.sin(angle);
            orbitPoints.push(x, 0, z);
        }
        orbitGeometry.setAttribute('position', new THREE.Float32BufferAttribute(orbitPoints, 3));
        
        const orbitMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3
        });
        
        const orbitLine = new THREE.LineLoop(orbitGeometry, orbitMaterial);
        orbitContainer.add(orbitLine);
        orbits.push(orbitLine);
        
        // Anneaux pour Saturne et Uranus
        if (data.hasRings) {
            createRings(axialPivot, data);
        }

        // Lune pour la Terre
        if (data.hasMoon) {
            createMoon(axialPivot);
        }
    });
}

// Fonction pour calculer la position sur l'ellipse
function updatePlanetPosition(planetObj) {
    const { semiMajorAxis: a, semiMinorAxis: b, focalDistance: c, orbitalAngle: theta } = planetObj;
    planetObj.axialPivot.position.x = a * Math.cos(theta) - c;
    planetObj.axialPivot.position.z = b * Math.sin(theta);
}

// ========================================
// Création de l'atmosphère
// ========================================

function createAtmosphere(planet, data) {
    const atmosphereGeometry = new THREE.SphereGeometry(data.radius * 1.05, 32, 32);
    const atmosphereMaterial = new THREE.ShaderMaterial({
        uniforms: {
            atmosphereColor: { value: new THREE.Color(data.atmosphereColor) }
        },
        vertexShader: `
            varying vec3 vNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform vec3 atmosphereColor;
            varying vec3 vNormal;
            void main() {
                float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
                gl_FragColor = vec4(atmosphereColor, intensity * 0.4);
            }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
    });
    
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    planet.add(atmosphere);
}

// ========================================
// Création des nuages (Terre)
// ========================================

function createClouds(planet, data) {
    const cloudTexture = generateCloudTexture(1024);
    
    const cloudGeometry = new THREE.SphereGeometry(data.radius * 1.02, 48, 48);
    const cloudMaterial = new THREE.MeshStandardMaterial({
        map: cloudTexture,
        transparent: true,
        opacity: 0.8,
        depthWrite: false
    });
    
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    clouds.userData = { isClouds: true };
    planet.add(clouds);
    
    planets.earthClouds = clouds;
}

// ========================================
// Création des anneaux
// ========================================

function createRings(planet, planetData) {
    const innerRadius = planetData.radius * 1.4;
    const outerRadius = planetData.radius * (planetData.name === 'Saturne' ? 2.5 : 1.8);
    
    const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
    
    // Texture réaliste si disponible, sinon couleur unie
    const textureDef = TEXTURE_URLS[planetData.name.toLowerCase()];
    const ringTexture = textureDef?.ring ? loadTexture(textureDef.ring) : null;
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: ringTexture ? 0xffffff : (planetData.name === 'Saturne' ? 0xD2B48C : 0xAABBCC),
        map: ringTexture || undefined,
        alphaMap: ringTexture || undefined,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
    });
    
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    
    planet.add(ring);
}

// ========================================
// Création de la Lune
// ========================================

function createMoon(earth) {
    const moonGeometry = new THREE.SphereGeometry(0.35, 32, 32);
    const moonTexture = TEXTURE_URLS.lune.map ? loadTexture(TEXTURE_URLS.lune.map) : null;
    const moonMaterial = new THREE.MeshPhongMaterial({
        color: moonTexture ? 0xffffff : 0xAAAAAA, // Gris clair si la texture tarde à charger
        map: moonTexture || undefined,
        emissive: moonTexture ? 0x222222 : 0x080808,
        emissiveMap: moonTexture || undefined,
        emissiveIntensity: moonTexture ? 0.6 : 0.2,
        shininess: 10
    });
    
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.userData = { isMoon: true, name: 'Lune' };
    
    // Inclinaison orbitale de la Lune (5.14°)
    const moonOrbit = new THREE.Object3D();
    moonOrbit.rotation.x = THREE.MathUtils.degToRad(5.14);
    moonOrbit.add(moon);
    moon.position.x = 3.5;
    
    // Rotation synchrone (toujours la même face vers la Terre)
    moon.rotation.y = Math.PI;
    
    earth.add(moonOrbit);
    
    planets.lune = { mesh: moon, orbit: moonOrbit };
}

// ========================================
// Création des vecteurs vitesse
// ========================================

function createVelocityArrows() {
    Object.keys(planets).forEach(key => {
        // Créer pour toutes les planètes (pas le soleil ni la lune)
        if (key === 'soleil' || key === 'lune') return;
        
        const planet = planets[key];
        if (!planet.mesh) return;
        
        // Créer une flèche pour le vecteur vitesse - PLUS GRANDE ET VISIBLE
        const dir = new THREE.Vector3(0, 0, 1);
        const origin = new THREE.Vector3(0, 0, 0);
        const length = 10; // Plus long
        const color = 0xffff00; // Jaune vif pour meilleure visibilité
        
        const arrow = new THREE.ArrowHelper(dir, origin, length, color, 3, 1.5);
        arrow.visible = false; // Caché par défaut
        
        // Rendre la ligne plus épaisse
        arrow.line.material.linewidth = 3;
        
        // Ajouter au conteneur orbital pour qu'il suive la planète
        planet.container.add(arrow);
        velocityArrows[key] = arrow;
        
        console.log(`Vecteur vitesse créé pour ${key}`);
    });
}

function updateVelocityArrows() {
    if (!showVelocity) return;

    Object.keys(planets).forEach(key => {
        if (key === 'soleil' || key === 'lune') return;

        const planet = planets[key];
        const arrow = velocityArrows[key];
        if (!planet.mesh || !arrow) return;

        // Position de la planète
        const pos = planet.axialPivot.position.clone();
        
        // Calculer la direction tangente à l'orbite (perpendiculaire au rayon)
        // Le vecteur vitesse est tangent à l'ellipse
        const { semiMajorAxis: a, semiMinorAxis: b, orbitalAngle: theta } = planet;
        
        // Dérivée de la position par rapport à theta (direction de la vitesse)
        const dx = -a * Math.sin(theta);
        const dz = b * Math.cos(theta);
        
        // Normaliser et obtenir la direction
        const velocity = new THREE.Vector3(dx, 0, dz).normalize();
        
        // Calculer la vitesse (2ème loi de Kepler - plus rapide au périhélie)
        const r = Math.sqrt(pos.x * pos.x + pos.z * pos.z);
        const speedFactor = (a * a) / (r * r);
        
        // Longueur proportionnelle à la vitesse - PLUS GRANDE
        const baseLength = 8; // Augmenté
        const arrowLength = baseLength * Math.sqrt(speedFactor);
        
        // Mettre à jour la flèche
        arrow.position.copy(pos);
        arrow.setDirection(velocity);
        arrow.setLength(arrowLength, arrowLength * 0.35, arrowLength * 0.2);
    });
}

// ========================================
// Lumière ambiante
// ========================================

function createAmbientLight() {
    const ambientLight = new THREE.AmbientLight(0x666688, 1.2);
    scene.add(ambientLight);
    
    // Lumière de remplissage douce
    const fillLight = new THREE.DirectionalLight(0x6688cc, 1.2);
    fillLight.position.set(-120, 120, -60);
    scene.add(fillLight);
}

// ========================================
// Animation
// ========================================

function animate() {
    requestAnimationFrame(animate);

    const delta = isPaused ? 0 : clock.getDelta();
    const elapsed = clock.getElapsedTime();

    // Animation de la caméra (intro)
    updateCinematicAnimation();

    // Animation des planètes (seulement si pas en pause)
    if (!isPaused) {
        Object.keys(planets).forEach(key => {
        if (key === 'soleil') {
            // Rotation du soleil sur son axe
            const sunData = planets.soleil.data;
            const sunRotSpeed = (2 * Math.PI) / (sunData.rotationPeriod * 10);
            planets.soleil.mesh.rotation.y += delta * sunRotSpeed * speedMultiplier;
            
            // Mise à jour du glow
            if (planets.soleil.mesh.children[0]) {
                planets.soleil.mesh.children[0].material.uniforms.viewVector.value = 
                    new THREE.Vector3().subVectors(camera.position, planets.soleil.mesh.position);
            }
            return;
        }
        
        if (key === 'lune') {
            // Orbite de la lune autour de la Terre (période: 27.3 jours)
            planets.lune.orbit.rotation.y += delta * 0.25 * speedMultiplier;
            return;
        }
        
        const planet = planets[key];
        if (!planet.data) return;
        
        const data = planet.data;
        
        // Vitesse orbitale de base (basée sur la période orbitale réelle)
        const baseOrbitalSpeed = (2 * Math.PI) / (data.orbitalPeriod * 0.02);
        
        // 2ème loi de Kepler : la vitesse varie selon la distance au Soleil
        // Calcul basé sur l'équation de l'ellipse pour plus de stabilité
        const a = planet.semiMajorAxis;
        const e = planet.eccentricity || 0;
        
        // Distance actuelle au foyer (Soleil)
        // r = a(1-e²) / (1 + e*cos(theta)) - formule de l'ellipse
        const r = Math.max(a * (1 - e), Math.sqrt(
            planet.axialPivot.position.x * planet.axialPivot.position.x +
            planet.axialPivot.position.z * planet.axialPivot.position.z
        ));
        
        // Facteur de Kepler limité pour éviter les accélérations brutales
        // La vraie formule est a²/r², mais on limite le ratio
        const minR = a * (1 - e); // périhélie
        const maxR = a * (1 + e); // aphélie
        const keplerFactor = Math.min(2.5, (a / r) * (a / r));
        
        // Mettre à jour l'angle orbital
        planet.orbitalAngle += delta * baseOrbitalSpeed * keplerFactor * speedMultiplier;
        
        // Mettre à jour la position sur l'ellipse
        updatePlanetPosition(planet);
        
        // Rotation propre : seulement Y local du mesh
        const rotationDirection = data.rotationPeriod < 0 ? -1 : 1;
        const rotationSpeed = (2 * Math.PI) / (Math.abs(data.rotationPeriod) * 4);
        planet.mesh.rotation.y += delta * rotationSpeed * speedMultiplier * rotationDirection;
        });
    }

    // Animation de la ceinture d'astéroïdes (seulement si pas en pause)
    if (!isPaused && window.asteroidBelt) {
        window.asteroidBelt.children.forEach(asteroid => {
            const data = asteroid.userData;

            // Rotation sur lui-même
            asteroid.rotation.x += data.rotationSpeed;
            asteroid.rotation.y += data.rotationSpeed * 0.7;

            // Mouvement orbital
            data.angle += data.orbitalSpeed * speedMultiplier;
            asteroid.position.x = data.distance * Math.cos(data.angle);
            asteroid.position.z = data.distance * Math.sin(data.angle);
        });
    }
    
    // Mise à jour des contrôles (sauf pendant l'animation cinématique)
    if (!cinematicAnimation || !cinematicAnimation.active) {
        controls.update();
    }
    
    // Mise à jour des labels
    if (showLabels) {
        updateLabels();
    }
    
    // Mise à jour des vecteurs vitesse
    if (showVelocity) {
        updateVelocityArrows();
    }
    
    // Rendu
    renderer.render(scene, camera);
}

// ========================================
// Mise à jour des labels
// ========================================

function updateLabels() {
    // Supprimer les anciens labels
    document.querySelectorAll('.planet-label').forEach(el => el.remove());
    
    Object.keys(planets).forEach(key => {
        if (key === 'lune') return;
        
        const planetObj = planets[key];
        if (!planetObj.mesh) return;
        
        const mesh = planetObj.mesh;
        const data = planetObj.data;
        
        // Obtenir la position mondiale
        const worldPos = new THREE.Vector3();
        mesh.getWorldPosition(worldPos);
        
        // Projeter sur l'écran
        worldPos.project(camera);
        
        const x = (worldPos.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-(worldPos.y * 0.5) + 0.5) * window.innerHeight;
        
        // Vérifier si visible
        if (worldPos.z < 1) {
            const label = document.createElement('div');
            label.className = 'planet-label';
            label.textContent = data.name;
            label.style.left = x + 'px';
            label.style.top = (y - (key === 'soleil' ? 60 : 30)) + 'px';
            document.body.appendChild(label);
        }
    });
}

// ========================================
// Event Listeners
// ========================================

function setupEventListeners() {
    // Redimensionnement
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Toggle pause
    document.getElementById('toggle-pause').addEventListener('click', (e) => {
        isPaused = !isPaused;
        const button = e.currentTarget;
        const icon = button.querySelector('.pause-icon');
        const text = button.querySelector('.pause-text');

        if (isPaused) {
            button.classList.add('paused');
            icon.textContent = '▶';
            text.textContent = 'Reprendre';
        } else {
            button.classList.remove('paused');
            icon.textContent = '⏸';
            text.textContent = 'Mettre en pause';
        }
    });


    // Contrôles de vitesse
    document.getElementById('speed-up').addEventListener('click', () => {
        speedMultiplier = Math.min(speedMultiplier * 2, 64);
        document.getElementById('speed-display').textContent = speedMultiplier + '\u00D7';
    });

    document.getElementById('speed-down').addEventListener('click', () => {
        speedMultiplier = Math.max(speedMultiplier / 2, 0.125);
        document.getElementById('speed-display').textContent = speedMultiplier + '\u00D7';
    });
    
    // Toggle orbites
    document.getElementById('toggle-orbits').addEventListener('click', (e) => {
        showOrbits = !showOrbits;
        orbits.forEach(orbit => orbit.visible = showOrbits);
        e.currentTarget.classList.toggle('active', showOrbits);
    });
    document.getElementById('toggle-orbits').classList.add('active');

    // Toggle labels
    document.getElementById('toggle-labels').addEventListener('click', (e) => {
        showLabels = !showLabels;
        if (!showLabels) {
            document.querySelectorAll('.planet-label').forEach(el => el.remove());
        }
        e.currentTarget.classList.toggle('active', showLabels);
    });
    document.getElementById('toggle-labels').classList.add('active');

    // Toggle vecteurs vitesse
    document.getElementById('toggle-velocity').addEventListener('click', (e) => {
        showVelocity = !showVelocity;
        // Afficher/masquer les flèches
        Object.keys(velocityArrows).forEach(key => {
            velocityArrows[key].visible = showVelocity;
        });
        e.currentTarget.classList.toggle('active', showVelocity);
    });
    
    // Survol des planètes
    window.addEventListener('mousemove', onMouseMove);
    
    // Clic sur les planètes pour verrouiller les infos
    window.addEventListener('click', onMouseClick);
}

// ========================================
// Détection du survol des planètes
// ========================================

function onMouseMove(event) {
    // Survol désactivé - on affiche les infos uniquement au clic
    // Le curseur peut changer pour indiquer qu'on peut cliquer
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const meshes = [];
    Object.keys(planets).forEach(key => {
        if (key === 'lune') return;
        if (planets[key].mesh) {
            meshes.push(planets[key].mesh);
        }
    });

    const intersects = raycaster.intersectObjects(meshes, true); // Recursive

    // Changer le curseur quand on survole une planète ou le Soleil
    if (intersects.length > 0) {
        let object = intersects[0].object;
        // Vérifier si c'est un objet cliquable (a des userData ou son parent en a)
        if (object.userData.planetData || (object.parent && object.parent.userData.planetData)) {
            document.body.style.cursor = 'pointer';
        } else {
            document.body.style.cursor = 'default';
        }
    } else {
        document.body.style.cursor = 'default';
    }
}

// ========================================
// Clic sur les planètes pour verrouiller les infos
// ========================================

function onMouseClick(event) {
    // Ignorer si l'intro est active
    if (introActive) return;

    // Ignorer les clics sur les boutons UI et éléments interactifs
    if (event.target.tagName === 'BUTTON' || event.target.closest('.side-menu, .menu-toggle, .planet-info-fullscreen')) {
        return;
    }

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Collecter tous les meshes (y compris le Soleil)
    const meshes = [];
    Object.keys(planets).forEach(key => {
        if (key === 'lune') return;
        if (planets[key].mesh) {
            meshes.push(planets[key].mesh);
        }
    });

    const intersects = raycaster.intersectObjects(meshes, true); // Recursive pour inclure les enfants

    if (intersects.length > 0) {
        let planet = intersects[0].object;

        // Si on clique sur un enfant (glow du Soleil), remonter au parent
        if (!planet.userData.planetData && planet.parent && planet.parent.userData.planetData) {
            planet = planet.parent;
        }

        if (planet.userData.planetData) {
            // Afficher la fenêtre plein écran
            lockedPlanet = planet.userData.key;
            hoveredPlanet = planet.userData.key;
            showPlanetInfoFullscreen(planet.userData.planetData, planet.userData.key);
        }
    }
}

// ========================================
// Mise à jour du panneau d'information
// ========================================

function updateInfoPanel(data, isLocked = false) {
    // Fonction d\u00E9sactiv\u00E9e - on utilise maintenant showPlanetInfoFullscreen
}

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
    // Fonction désactivée - le sélecteur de planètes n'est plus utilisé
}

function focusPlanet(key) {
    // Fonction désactivée
}

function updateSelectorActive(key) {
    // Fonction désactivée
}

function resetInfoPanel() {
    // Fonction désactivée - on utilise maintenant la fenêtre plein écran
}

// ========================================
// Menu latéral (3 tirets)
// ========================================

function setupMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const sideMenu = document.getElementById('side-menu');
    const menuOverlay = document.getElementById('menu-overlay');

    // Ouvrir/fermer le menu
    menuToggle.addEventListener('click', () => {
        const isOpen = sideMenu.classList.contains('open');

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Fermer avec l'overlay
    menuOverlay.addEventListener('click', closeMenu);

    function openMenu() {
        sideMenu.classList.add('open');
        menuOverlay.classList.add('active');
        menuToggle.classList.add('active');
    }

    function closeMenu() {
        sideMenu.classList.remove('open');
        menuOverlay.classList.remove('active');
        menuToggle.classList.remove('active');
    }
}

// ========================================
// Fenêtre plein écran info planète
// ========================================

function setupPlanetInfoFullscreen() {
    const fullscreenEl = document.getElementById('planet-info-fullscreen');
    const closeBtn = document.getElementById('close-planet-info');

    closeBtn.addEventListener('click', () => {
        closePlanetInfo();
    });

    // Fermer avec Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && fullscreenEl.classList.contains('visible')) {
            closePlanetInfo();
        }
    });
}

function showPlanetInfoFullscreen(data, planetKey) {
    const contentEl = document.getElementById('planet-info-content');

    // Vider le contenu
    contentEl.textContent = '';

    // Créer les éléments DOM de manière sécurisée
    const isSun = planetKey === 'soleil';
    const planetName = isSun ? 'Le Soleil' : data.name;
    const planetType = isSun ? 'Étoile' : (data.type || 'Planète');

    const title = document.createElement('h2');
    title.textContent = planetName;
    contentEl.appendChild(title);

    const type = document.createElement('div');
    type.className = 'planet-type';
    type.textContent = planetType;
    contentEl.appendChild(type);

    // Créer les stats
    const stats = [];
    if (isSun) {
        stats.push({ label: 'Type', value: data.info.type });
        stats.push({ label: 'Âge', value: data.info.age });
        stats.push({ label: 'Diamètre', value: data.info.diameter });
        stats.push({ label: 'Masse', value: data.info.masse });
        stats.push({ label: 'Température de surface', value: data.info.temperature_surface });
        stats.push({ label: 'Température du cœur', value: data.info.temperature_coeur });
        stats.push({ label: 'Composition', value: data.info.composition });
        stats.push({ label: 'Luminosité', value: data.info.luminosite });
        stats.push({ label: 'Distance du centre galactique', value: data.info.distance_centre_galaxie });
    } else {
        stats.push({ label: 'Type', value: data.info.type });
        stats.push({ label: 'Diamètre', value: data.info.diametre });
        stats.push({ label: 'Masse', value: data.info.masse });
        stats.push({ label: 'Distance du Soleil', value: data.info.distance_soleil });
        stats.push({ label: 'Période orbitale', value: data.info.periode_orbitale });
        stats.push({ label: 'Période de rotation', value: Math.abs(data.rotationPeriod) + ' jours terrestres' });
    }

    stats.forEach(stat => {
        const statDiv = document.createElement('div');
        statDiv.className = 'stat';

        const label = document.createElement('span');
        label.className = 'stat-label';
        label.textContent = stat.label;

        const value = document.createElement('span');
        value.className = 'stat-value';
        value.textContent = stat.value;

        statDiv.appendChild(label);
        statDiv.appendChild(value);
        contentEl.appendChild(statDiv);
    });

    const hint = document.createElement('div');
    hint.className = 'lock-hint';
    if (isSun) {
        hint.textContent = '☀️ Le Soleil représente 99,86% de la masse totale du système solaire. Cliquez sur une planète pour explorer les autres corps célestes.';
    } else {
        hint.textContent = '💡 Cliquez sur une autre planète ou sur le Soleil pour afficher d\'autres informations.';
    }
    contentEl.appendChild(hint);

    document.getElementById('planet-info-fullscreen').classList.add('visible');
}

function closePlanetInfo() {
    const fullscreenEl = document.getElementById('planet-info-fullscreen');
    fullscreenEl.classList.remove('visible');
    lockedPlanet = null;
}

// ========================================
// Documentation
// ========================================

function setupDocumentation() {
    const docBtn = document.getElementById('show-doc');

    docBtn.addEventListener('click', () => {
        showDocumentation();
        // Fermer le menu
        const sideMenu = document.getElementById('side-menu');
        const menuOverlay = document.getElementById('menu-overlay');
        const menuToggle = document.getElementById('menu-toggle');
        sideMenu.classList.remove('open');
        menuOverlay.classList.remove('active');
        menuToggle.classList.remove('active');
    });
}

function showDocumentation() {
    const contentEl = document.getElementById('planet-info-content');
    contentEl.textContent = '';

    // Titre principal
    const title = document.createElement('h2');
    title.textContent = 'Simulation du Système Solaire';
    contentEl.appendChild(title);

    const subtitle = document.createElement('div');
    subtitle.className = 'planet-type';
    subtitle.textContent = 'Documentation scientifique et technique';
    contentEl.appendChild(subtitle);

    // Section 1: Importance
    const h3_1 = document.createElement('h3');
    h3_1.textContent = 'Pourquoi représenter le système solaire ?';
    contentEl.appendChild(h3_1);

    const p1 = document.createElement('p');
    p1.textContent = 'La représentation du système solaire est fondamentale pour la compréhension de notre place dans l\'univers. Elle permet de visualiser les échelles astronomiques, les relations gravitationnelles entre les corps célestes, et les dynamiques orbitales qui régissent notre environnement cosmique.';
    contentEl.appendChild(p1);

    const p2 = document.createElement('p');
    p2.textContent = 'Au-delà de l\'aspect éducatif, ces simulations sont utilisées par les agences spatiales (NASA, ESA) pour la planification de missions, le calcul de trajectoires interplanétaires, et la prédiction de phénomènes astronomiques. Elles constituent un outil essentiel pour la recherche en mécanique céleste et l\'astronomie.';
    contentEl.appendChild(p2);

    // Section 2: Complexité
    const h3_2 = document.createElement('h3');
    h3_2.textContent = 'La complexité de la représentation';
    contentEl.appendChild(h3_2);

    const p3 = document.createElement('p');
    p3.textContent = 'Représenter fidèlement le système solaire pose plusieurs défis scientifiques et techniques majeurs :';
    contentEl.appendChild(p3);

    const ul1 = document.createElement('ul');
    const challenges = [
        'Échelles de distances : Le rapport entre la taille du Soleil et l\'orbite de Neptune dépasse 1:4000, rendant impossible une représentation à l\'échelle réelle.',
        'Échelles de tailles : Jupiter est 1000 fois plus petit que le Soleil, la Terre 10 fois plus petite que Jupiter. Une échelle fidèle rendrait les planètes invisibles.',
        'Excentricité des orbites : Les orbites elliptiques varient de quasi-circulaires (Vénus, e=0.007) à très excentriques (Mercure, e=0.206).',
        'Inclinaisons orbitales : Les plans orbitaux sont inclinés de 0° à 7° par rapport au plan de l\'écliptique.',
        'Lois de Kepler : La vitesse orbitale varie selon la distance au Soleil (2ème loi), nécessitant des calculs continus.'
    ];

    challenges.forEach(challenge => {
        const li = document.createElement('li');
        li.textContent = challenge;
        ul1.appendChild(li);
    });
    contentEl.appendChild(ul1);

    // Section 3: Fonctionnement
    const h3_3 = document.createElement('h3');
    h3_3.textContent = 'Fonctionnement de cette simulation';
    contentEl.appendChild(h3_3);

    const p4 = document.createElement('p');
    p4.innerHTML = '<strong>Modèle orbital :</strong> Utilisation des éléments orbitaux kepleriens pour calculer la position de chaque planète. Les orbites elliptiques sont simulées avec leur excentricité réelle, et la vitesse angulaire varie selon la 2ème loi de Kepler (v² ∝ 1/r).';
    contentEl.appendChild(p4);

    const p5 = document.createElement('p');
    p5.innerHTML = '<strong>Rotations :</strong> Chaque corps céleste tourne sur son axe avec sa période et son inclinaison axiale réelles. Vénus et Uranus ont une rotation rétrograde (sens inverse).';
    contentEl.appendChild(p5);

    const p6 = document.createElement('p');
    p6.innerHTML = '<strong>Échelles adaptatives :</strong> Les distances sont compressées logarithmiquement pour rendre le système visible, tandis que les tailles des planètes sont légèrement exagérées pour rester perceptibles.';
    contentEl.appendChild(p6);

    const p7 = document.createElement('p');
    p7.innerHTML = '<strong>Rendu 3D :</strong> Utilisation de Three.js (WebGL) pour le rendu temps réel, avec textures photographiques NASA/JPL et calculs d\'éclairage basés sur la position du Soleil.';
    contentEl.appendChild(p7);

    const p8 = document.createElement('p');
    p8.innerHTML = '<strong>Performances :</strong> Optimisation via requestAnimationFrame (60 FPS), instancing pour la ceinture d\'astéroïdes (10000+ objets), et frustum culling pour les objets hors champ.';
    contentEl.appendChild(p8);

    // Note finale
    const hint = document.createElement('div');
    hint.className = 'lock-hint';
    hint.textContent = 'Cette simulation éducative offre un compromis entre exactitude scientifique et lisibilité visuelle, permettant d\'explorer les concepts fondamentaux de la mécanique céleste de manière interactive.';
    contentEl.appendChild(hint);

    document.getElementById('planet-info-fullscreen').classList.add('visible');
}

// ========================================
// Toggle des panneaux HUD (DÉSACTIVÉ)
// ========================================

function setupPanelToggles() {
    // Fonction désactivée - les anciens panels sont cachés
}

// ========================================
// Démarrage
// ========================================

init();
