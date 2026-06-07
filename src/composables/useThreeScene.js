import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const PALETTE = {
    oxfordBlue: 0x012340,
    ncsBlue: 0x048abf,
    skyCyan: 0x07b2d9,
    chineseBronze: 0xd98032,
};

function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function createSoftParticleTexture() {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    const center = size / 2;
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, center);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.45, 'rgba(255, 255, 255, 0.75)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}

function createRenderer(containerEl) {
    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.38;
    containerEl.appendChild(renderer.domElement);
    return renderer;
}

function resizeRenderer(renderer, camera, containerEl) {
    const { clientWidth, clientHeight } = containerEl;
    if (clientWidth === 0 || clientHeight === 0) return;

    renderer.setSize(clientWidth, clientHeight, false);
    if (camera.isPerspectiveCamera) {
        camera.aspect = clientWidth / clientHeight;
        camera.updateProjectionMatrix();
    }
}

function createSceneHandle({ renderer, scene, camera, containerEl, animate, onDispose = null }) {
    let animationId = null;
    let isPaused = false;
    const reducedMotion = prefersReducedMotion();

    const resizeObserver = new ResizeObserver(() => {
        resizeRenderer(renderer, camera, containerEl);
        if (reducedMotion || isPaused) {
            renderer.render(scene, camera);
        }
    });
    resizeObserver.observe(containerEl);
    resizeRenderer(renderer, camera, containerEl);

    const loop = () => {
        if (!isPaused && !reducedMotion) {
            animate?.();
            renderer.render(scene, camera);
        }
        animationId = requestAnimationFrame(loop);
    };

    const onVisibilityChange = () => {
        isPaused = document.hidden;
        if (!isPaused && !reducedMotion) {
            animate?.();
            renderer.render(scene, camera);
        }
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    if (reducedMotion) {
        animate?.(0);
        renderer.render(scene, camera);
    } else {
        animationId = requestAnimationFrame(loop);
    }

    const dispose = () => {
        if (animationId !== null) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        document.removeEventListener('visibilitychange', onVisibilityChange);
        resizeObserver.disconnect();
        onDispose?.();
        renderer.dispose();
        if (renderer.domElement.parentNode === containerEl) {
            containerEl.removeChild(renderer.domElement);
        }
    };

    return { renderer, scene, camera, animationId, resizeObserver, dispose };
}

function disposeObject3D(root) {
    if (!root) return;

    root.traverse((child) => {
        if (!child.isMesh) return;

        child.geometry?.dispose();

        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((material) => {
            if (!material) return;

            Object.values(material).forEach((value) => {
                if (value?.isTexture) {
                    value.dispose();
                }
            });
            material.dispose();
        });
    });
}

const HERO_MODEL_URL = `${import.meta.env.BASE_URL}assets/hero-laptop.glb`;

const HERO_LAPTOP_COLORS = {
    light: 0x1a3d5c,
    mid: 0x102a47,
    dark: 0x071528,
};

const HERO_TECH_LABELS = [
    { text: 'Vue 3', color: '#42b883' },
    { text: 'React', color: '#61dafb' },
    { text: 'Node.js', color: '#3c873a' },
    { text: 'Python', color: '#3776ab' },
    { text: 'TypeScript', color: '#3178c6' },
    { text: 'Firebase', color: '#ffca28' },
    { text: 'Vite', color: '#646cff' },
    { text: 'Tailwind', color: '#38bdf8' },
];

function normalizeHeroModel(model, targetSize = 2.25) {
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    model.position.sub(center);
    const scale = targetSize / Math.max(size.x, size.y, size.z);
    model.scale.setScalar(scale);
    model.position.y += (size.y * scale) * 0.42 - 0.22;

    return model;
}

function getMeshLuminance(material) {
    if (!material?.color) return 0.35;
    const { r, g, b } = material.color;
    return r * 0.299 + g * 0.587 + b * 0.114;
}

function dedupeHeroLaptopMeshes(model) {
    model.traverse((child) => {
        if (child.isMesh && /^laptop_3/.test(child.name)) {
            child.visible = false;
        }
    });
}

function recolorHeroLaptop(model) {
    const cyanAccent = new THREE.Color(PALETTE.skyCyan);

    model.traverse((child) => {
        if (!child.isMesh || !child.material || isScreenMesh(child)) return;

        const source = Array.isArray(child.material) ? child.material[0] : child.material;
        const luminance = getMeshLuminance(source);
        const tierColor = luminance > 0.55
            ? HERO_LAPTOP_COLORS.light
            : luminance > 0.3
                ? HERO_LAPTOP_COLORS.mid
                : HERO_LAPTOP_COLORS.dark;

        const emissive = new THREE.Color(tierColor).lerp(cyanAccent, 0.42);

        const material = new THREE.MeshStandardMaterial({
            color: tierColor,
            metalness: 0.35,
            roughness: 0.52,
            emissive,
            emissiveIntensity: 0.88,
        });
        child.material = material;
    });
}

const DETAILED_LAPTOP_MATERIAL_MAP = {
    phong1: { color: HERO_LAPTOP_COLORS.dark, metalness: 0.42, roughness: 0.58 },
    phong4: { color: HERO_LAPTOP_COLORS.mid, metalness: 0.38, roughness: 0.56 },
    lambert1: { color: 0x0d2238, metalness: 0.34, roughness: 0.6 },
    phong3: { color: 0x0f2842, metalness: 0.36, roughness: 0.58 },
};

function createNavyLaptopMaterial(colorHex, metalness = 0.38, roughness = 0.56, emissiveIntensity = 0.07) {
    const color = new THREE.Color(colorHex);
    const emissive = color.clone().multiplyScalar(0.45);

    return new THREE.MeshStandardMaterial({
        color,
        metalness,
        roughness,
        emissive,
        emissiveIntensity,
    });
}

function tintDetailedHeroLaptop(model) {
    model.traverse((child) => {
        if (!child.isMesh || !child.material || isScreenMesh(child)) return;

        const sources = Array.isArray(child.material) ? child.material : [child.material];
        const tinted = sources.map((source) => {
            if (source.name === 'phong2') {
                return new THREE.MeshStandardMaterial({
                    color: source.color?.clone() ?? new THREE.Color(0x1a3048),
                    metalness: 0.28,
                    roughness: 0.62,
                    emissive: new THREE.Color(HERO_LAPTOP_COLORS.dark),
                    emissiveIntensity: 0.04,
                });
            }

            const preset = DETAILED_LAPTOP_MATERIAL_MAP[source.name];
            const luminance = getMeshLuminance(source);

            if (preset) {
                return createNavyLaptopMaterial(
                    preset.color,
                    preset.metalness,
                    preset.roughness,
                    0.08,
                );
            }

            if (luminance < 0.14) {
                return createNavyLaptopMaterial(HERO_LAPTOP_COLORS.dark, 0.4, 0.58, 0.07);
            }

            const color = source.color?.clone() ?? new THREE.Color(HERO_LAPTOP_COLORS.mid);
            color.lerp(new THREE.Color(HERO_LAPTOP_COLORS.mid), 0.35);

            return createNavyLaptopMaterial(color.getHex(), 0.32, 0.6, 0.05);
        });

        child.material = Array.isArray(child.material) ? tinted : tinted[0];
    });
}

function isScreenMesh(mesh) {
    if (!mesh?.isMesh) return false;

    const material = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
    if (material?.name === 'blinn1' || mesh.name === 'pCube134_blinn1_0') {
        return true;
    }

    const vertexCount = mesh.geometry?.attributes?.position?.count ?? 0;
    if (vertexCount > 4) return false;

    const box = new THREE.Box3().setFromObject(mesh);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    return center.y > 0.07 && size.z < 0.08;
}

function countHeroMeshes(model) {
    let count = 0;
    model.traverse((child) => {
        if (child.isMesh) count += 1;
    });
    return count;
}

function createAnimatedCodeTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 384;
    const ctx = canvas.getContext('2d');
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;

    const codeLines = [
        'const app = createApp({',
        '  setup() {',
        '    return { hero }',
        '  }',
        '});',
        'app.mount("#app");',
        'export default app',
        'await fetch("/api");',
        'type Skill = { name: string }',
    ];

    return {
        canvas,
        ctx,
        texture,
        codeLines,
        scroll: 0,
        update() {
            const { width, height } = canvas;
            ctx.fillStyle = '#0f2038';
            ctx.fillRect(0, 0, width, height);

            const glow = ctx.createLinearGradient(0, 0, width, height);
            glow.addColorStop(0, 'rgba(7, 178, 217, 0.12)');
            glow.addColorStop(1, 'rgba(100, 108, 255, 0.08)');
            ctx.fillStyle = glow;
            ctx.fillRect(0, 0, width, height);

            ctx.font = '14px "DM Mono", monospace';
            ctx.fillStyle = '#5ce1ff';

            codeLines.forEach((line, index) => {
                const y = 42 + index * 30 - (this.scroll % 30);
                if (y > 20 && y < height - 10) {
                    ctx.fillText(line, 24, y);
                }
            });

            ctx.fillStyle = 'rgba(100, 108, 255, 0.85)';
            ctx.fillRect(24, height - 36, 120, 2);
            this.scroll += 0.35;
            texture.needsUpdate = true;
        },
    };
}

function applyScreenTexture(model, screenTextureState) {
    model.traverse((child) => {
        if (!isScreenMesh(child)) return;

        child.material = new THREE.MeshBasicMaterial({
            map: screenTextureState.texture,
            toneMapped: false,
            color: 0xffffff,
        });
        child.userData.isScreen = true;
    });
}

function createProceduralLaptopFallback(screenTextureState) {
    const workstation = new THREE.Group();

    const baseMaterial = new THREE.MeshStandardMaterial({
        color: HERO_LAPTOP_COLORS.mid,
        metalness: 0.58,
        roughness: 0.4,
        emissive: new THREE.Color(HERO_LAPTOP_COLORS.mid),
        emissiveIntensity: 0.22,
    });
    const accentMaterial = new THREE.MeshStandardMaterial({
        color: HERO_LAPTOP_COLORS.light,
        metalness: 0.58,
        roughness: 0.4,
        emissive: new THREE.Color(HERO_LAPTOP_COLORS.light),
        emissiveIntensity: 0.22,
    });

    const base = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.12, 1.6), baseMaterial);
    base.position.y = -0.06;
    workstation.add(base);

    const lidGroup = new THREE.Group();
    lidGroup.position.set(0, 0.06, -0.72);
    workstation.add(lidGroup);

    const lid = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.08, 1.5), accentMaterial);
    lid.position.set(0, 0.04, 0.75);
    lidGroup.add(lid);

    const screen = new THREE.Mesh(
        new THREE.PlaneGeometry(2.1, 1.35),
        new THREE.MeshBasicMaterial({
            map: screenTextureState.texture,
            toneMapped: false,
        }),
    );
    screen.position.set(0, 0.09, 0.76);
    screen.rotation.x = -Math.PI / 2;
    screen.userData.isScreen = true;
    lidGroup.add(screen);
    lidGroup.rotation.x = -Math.PI / 7;

    for (let row = 0; row < 4; row += 1) {
        for (let col = 0; col < 10; col += 1) {
            const key = new THREE.Mesh(
                new THREE.BoxGeometry(0.16, 0.02, 0.16),
                new THREE.MeshStandardMaterial({
                    color: HERO_LAPTOP_COLORS.dark,
                    metalness: 0.45,
                    roughness: 0.5,
                    emissive: new THREE.Color(HERO_LAPTOP_COLORS.dark),
                    emissiveIntensity: 0.18,
                }),
            );
            key.position.set(-0.9 + col * 0.2, 0.02, -0.45 + row * 0.22);
            workstation.add(key);
        }
    }

    workstation.userData.lidGroup = lidGroup;
    workstation.userData.isFallback = true;
    return workstation;
}

function createTechLabelPlane(text, color) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = '600 22px "DM Sans", sans-serif';
    const metrics = ctx.measureText(text);
    canvas.width = Math.ceil(metrics.width) + 28;
    canvas.height = 40;

    ctx.font = '600 22px "DM Sans", sans-serif';
    ctx.fillStyle = color;
    ctx.fillText(text, 14, 27);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const aspect = canvas.width / canvas.height;
    const height = 0.22;
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(height * aspect, height), material);
    mesh.userData.baseOpacity = 0.92;
    return mesh;
}

function createLabelSprite(text, options = {}) {
    const { color = '#07B2D9', transparentBg = false } = typeof options === 'string'
        ? { color: options }
        : options;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = '600 28px "DM Sans", sans-serif';
    const metrics = ctx.measureText(text);
    canvas.width = Math.ceil(metrics.width) + 24;
    canvas.height = 44;

    ctx.font = '600 28px "DM Sans", sans-serif';
    if (!transparentBg) {
        ctx.fillStyle = 'rgba(1, 35, 64, 0.85)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.fillStyle = color;
    ctx.fillText(text, 12, 30);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
    });
    const sprite = new THREE.Sprite(material);
    const scale = 0.35;
    sprite.scale.set((canvas.width / canvas.height) * scale, scale, 1);
    return sprite;
}

function fibonacciSphere(count, radius) {
    const points = [];
    const goldenRatio = (1 + Math.sqrt(5)) / 2;

    for (let i = 0; i < count; i += 1) {
        const theta = (2 * Math.PI * i) / goldenRatio;
        const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
        points.push({
            x: radius * Math.sin(phi) * Math.cos(theta),
            y: radius * Math.sin(phi) * Math.sin(theta),
            z: radius * Math.cos(phi),
        });
    }

    return points;
}

function proficiencyColor(proficiency) {
    const t = Math.min(Math.max(proficiency / 100, 0), 1);
    const low = new THREE.Color(PALETTE.ncsBlue);
    const high = new THREE.Color(PALETTE.skyCyan);
    return low.lerp(high, t);
}

function hexToThreeColor(hex) {
    return new THREE.Color(hex);
}

function createSkillLabelPill(name, accentHex, proficiency, showProficiency = true) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const displayName = name.length > 16 ? `${name.slice(0, 15)}…` : name;
    const badge = `${proficiency}%`;

    ctx.font = '600 13px "DM Sans", sans-serif';
    const nameWidth = ctx.measureText(displayName).width;
    const padX = 10;
    const gap = 8;
    let badgeWidth = 0;

    if (showProficiency) {
        ctx.font = '600 11px "DM Mono", monospace';
        badgeWidth = ctx.measureText(badge).width;
    }

    canvas.width = Math.ceil(nameWidth + (showProficiency ? badgeWidth + gap : 0) + padX * 2);
    canvas.height = 30;

    const radius = 8;
    ctx.beginPath();
    ctx.moveTo(radius, 0);
    ctx.lineTo(canvas.width - radius, 0);
    ctx.quadraticCurveTo(canvas.width, 0, canvas.width, radius);
    ctx.lineTo(canvas.width, canvas.height - radius);
    ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - radius, canvas.height);
    ctx.lineTo(radius, canvas.height);
    ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius);
    ctx.lineTo(0, radius);
    ctx.quadraticCurveTo(0, 0, radius, 0);
    ctx.closePath();
    ctx.fillStyle = 'rgba(1, 35, 64, 0.88)';
    ctx.fill();
    ctx.strokeStyle = `${accentHex}66`;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.font = '600 13px "DM Sans", sans-serif';
    ctx.fillStyle = '#e8f1fb';
    ctx.fillText(displayName, padX, 19);

    if (showProficiency) {
        ctx.font = '600 11px "DM Mono", monospace';
        ctx.fillStyle = accentHex;
        ctx.fillText(badge, padX + nameWidth + gap, 19);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const aspect = canvas.width / canvas.height;
    const height = 0.19;
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(height * aspect, height), material);
    mesh.userData.baseOpacity = 0.94;
    return mesh;
}

function createCategoryLabelSprite(category, colorHex) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const text = category.length > 18 ? `${category.slice(0, 17)}…` : category;

    ctx.font = '700 15px "Syne", sans-serif';
    const metrics = ctx.measureText(text);
    canvas.width = Math.ceil(metrics.width) + 24;
    canvas.height = 32;

    ctx.font = '700 15px "Syne", sans-serif';
    ctx.fillStyle = 'rgba(1, 35, 64, 0.72)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = colorHex;
    ctx.fillText(text, 12, 21);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        opacity: 0.9,
    });
    const sprite = new THREE.Sprite(material);
    const scale = 0.42;
    sprite.scale.set((canvas.width / canvas.height) * scale, scale, 1);
    return sprite;
}

function layoutSkillConstellation(skillsFlat) {
    const byCategory = new Map();
    skillsFlat.forEach((skill) => {
        if (!byCategory.has(skill.category)) byCategory.set(skill.category, []);
        byCategory.get(skill.category).push(skill);
    });

    const categories = [...byCategory.keys()];
    const layouts = [];
    const categoryMeta = [];

    categories.forEach((category, catIndex) => {
        const skills = byCategory.get(category);
        const sectorAngle = (Math.PI * 2) / categories.length;
        const sectorCenter = catIndex * sectorAngle - Math.PI / 2 + sectorAngle / 2;
        const categoryColor = skills[0]?.categoryColor ?? '#07B2D9';

        categoryMeta.push({
            category,
            color: categoryColor,
            angle: sectorCenter,
            skills,
        });

        skills.forEach((skill, skillIndex) => {
            const spread = sectorAngle * 0.68;
            const t = skills.length === 1 ? 0.5 : skillIndex / (skills.length - 1);
            const angle = sectorCenter + (t - 0.5) * spread;
            const radius = 0.95 + (skillIndex % 3) * 0.14 + (skill.proficiency / 100) * 0.18;
            const elevation = ((skill.proficiency / 100) - 0.5) * 0.42;

            layouts.push({
                skill,
                category,
                position: new THREE.Vector3(
                    Math.cos(angle) * radius,
                    elevation,
                    Math.sin(angle) * radius * 0.72,
                ),
            });
        });
    });

    return { layouts, categoryMeta };
}

function seededUnit(index, salt = 0) {
    const value = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43758.5453;
    return value - Math.floor(value);
}

function layoutScatteredSkills(skillsFlat) {
    const count = skillsFlat.length;
    const cols = Math.max(3, Math.ceil(Math.sqrt(count * 1.45)));
    const rows = Math.ceil(count / cols);
    const spacingX = 0.52;
    const spacingY = 0.38;
    const layouts = [];

    skillsFlat.forEach((skill, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        const itemsInRow = Math.min(cols, count - row * cols);
        const rowOffsetX = -((itemsInRow - 1) * spacingX) / 2;

        layouts.push({
            skill,
            category: skill.category,
            index,
            position: new THREE.Vector3(
                rowOffsetX + col * spacingX + (seededUnit(index, 1) - 0.5) * 0.22,
                ((rows - 1) / 2 - row) * spacingY + (seededUnit(index, 2) - 0.5) * 0.16,
                (seededUnit(index, 3) - 0.5) * 0.28,
            ),
        });
    });

    return { layouts, categoryMeta: [] };
}

function createSkillChipMesh(accentHex, index = 0) {
    const width = 0.16 + seededUnit(index, 4) * 0.05;
    const height = 0.09 + seededUnit(index, 5) * 0.03;
    const depth = 0.035;
    const accent = hexToThreeColor(accentHex);
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const material = new THREE.MeshStandardMaterial({
        color: accent,
        emissive: accent,
        emissiveIntensity: 0.4,
        metalness: 0.22,
        roughness: 0.58,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.z = (seededUnit(index, 6) - 0.5) * 0.4;
    mesh.rotation.x = (seededUnit(index, 7) - 0.5) * 0.22;
    return { mesh, geometry, material };
}

function createConstellationLines(layouts, categoryMeta) {
    const lines = [];

    categoryMeta.forEach(({ category, color, skills }) => {
        const categoryLayouts = layouts.filter((entry) => entry.category === category);
        if (categoryLayouts.length === 0) return;

        const centroid = new THREE.Vector3();
        categoryLayouts.forEach((entry) => centroid.add(entry.position));
        centroid.multiplyScalar(1 / categoryLayouts.length);

        const threeColor = hexToThreeColor(color);
        const hubGeometry = new THREE.SphereGeometry(0.045, 12, 12);
        const hubMaterial = new THREE.MeshStandardMaterial({
            color: threeColor,
            emissive: threeColor,
            emissiveIntensity: 0.55,
            metalness: 0.2,
            roughness: 0.5,
        });
        const hub = new THREE.Mesh(hubGeometry, hubMaterial);
        hub.position.copy(centroid);
        lines.push({ mesh: hub, dispose: () => { hubGeometry.dispose(); hubMaterial.dispose(); } });

        categoryLayouts.forEach((entry) => {
            const points = [centroid, entry.position];
            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = new THREE.LineBasicMaterial({
                color: threeColor,
                transparent: true,
                opacity: 0.28,
                depthWrite: false,
            });
            const line = new THREE.Line(geometry, material);
            lines.push({
                mesh: line,
                category,
                dispose: () => { geometry.dispose(); material.dispose(); },
            });
        });
    });

    return lines;
}

export function initHeroScene(containerEl, options = {}) {
    if (!containerEl) return null;

    try {
        const renderer = createRenderer(containerEl);
        renderer.domElement.style.cursor = 'grab';
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100);
        camera.position.set(0, 0.85, 5.4);
        camera.lookAt(0, 0.18, 0);

        scene.add(new THREE.HemisphereLight(0x7ec8e3, 0x05080f, 0.85));
        scene.add(new THREE.AmbientLight(0x3d6f8f, 0.55));
        const keyLight = new THREE.PointLight(PALETTE.skyCyan, 2.2, 18);
        keyLight.position.set(2.2, 3.2, 2.4);
        scene.add(keyLight);
        const fillLight = new THREE.PointLight(0x048abf, 1.1, 16);
        fillLight.position.set(-2.4, 1.8, 1.6);
        scene.add(fillLight);
        const rimLight = new THREE.PointLight(0x646cff, 0.9, 14);
        rimLight.position.set(-1.8, 2.2, -2);
        scene.add(rimLight);

        const workstation = new THREE.Group();
        scene.add(workstation);

        const screenTextureState = createAnimatedCodeTexture();
        screenTextureState.update();

        let laptopRoot = null;
        let usingFallback = false;
        const laptopMeshes = [];

        const mountLaptop = (model, isFallback = false) => {
            if (laptopRoot) {
                workstation.remove(laptopRoot);
                disposeObject3D(laptopRoot);
            }

            laptopRoot = model;
            usingFallback = isFallback;
            laptopMeshes.length = 0;

            if (!isFallback) {
                const isDetailedModel = countHeroMeshes(laptopRoot) > 20;

                if (isDetailedModel) {
                    tintDetailedHeroLaptop(laptopRoot);
                } else {
                    dedupeHeroLaptopMeshes(laptopRoot);
                    recolorHeroLaptop(laptopRoot);
                }

                normalizeHeroModel(
                    laptopRoot,
                    options.modelScale ?? (isDetailedModel ? 1.35 : 1.65),
                );
                applyScreenTexture(laptopRoot, screenTextureState);
            }

            laptopRoot.traverse((child) => {
                if (child.isMesh && !child.userData.isScreen) {
                    laptopMeshes.push(child);
                }
            });

            workstation.add(laptopRoot);
            renderer.render(scene, camera);
        };

        const modelUrl = options.modelUrl ?? HERO_MODEL_URL;
        const loader = new GLTFLoader();

        loader.load(
            modelUrl,
            (gltf) => mountLaptop(gltf.scene),
            undefined,
            (error) => {
                console.warn('Hero laptop GLB failed, using procedural fallback:', error);
                mountLaptop(createProceduralLaptopFallback(screenTextureState), true);
            },
        );

        const techLabels = options.techLabels ?? HERO_TECH_LABELS;
        const orbitLabels = [];

        techLabels.forEach((labelDef, index) => {
            const label = typeof labelDef === 'string'
                ? { text: labelDef, color: '#07B2D9' }
                : labelDef;
            const plane = createTechLabelPlane(label.text, label.color);
            plane.userData.orbitAngle = (index / techLabels.length) * Math.PI * 2 + Math.random() * 0.4;
            plane.userData.orbitRadius = 1.3 + index * 0.11;
            plane.userData.orbitSpeed = (0.0016 + index * 0.00025) * (index % 2 === 0 ? 1 : -1);
            plane.userData.orbitCenterY = 0.62 + index * 0.1;
            plane.userData.orbitTilt = 0.2 + index * 0.11;
            plane.userData.orbitPlaneY = (index / techLabels.length) * Math.PI * 2;
            plane.userData.pulsePhase = index * 0.9;
            orbitLabels.push(plane);
            scene.add(plane);
        });

        const burstParticles = [];
        const burstColors = [0x07b2d9, 0x048abf, 0x646cff, 0x38bdf8, 0x9b5de5];
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();

        let isDragging = false;
        let dragPointerId = null;
        let lastDragX = 0;
        let lastDragY = 0;
        let dragDistance = 0;
        let userRotationX = 0;
        let userRotationY = 0;
        let autoSpin = 0;
        let targetParallaxX = 0;
        let targetParallaxY = 0;
        let parallaxX = 0;
        let parallaxY = 0;
        const maxTilt = (8 * Math.PI) / 180;
        const BACK_ORBIT_FADE_START = -0.08;
        const BACK_ORBIT_FADE_END = -0.62;

        const spawnBurst = (origin) => {
            for (let i = 0; i < 48; i += 1) {
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.random() * Math.PI;
                const speed = 0.02 + Math.random() * 0.05;
                burstParticles.push({
                    x: origin.x,
                    y: origin.y,
                    z: origin.z,
                    vx: Math.sin(phi) * Math.cos(theta) * speed,
                    vy: Math.sin(phi) * Math.sin(theta) * speed + 0.01,
                    vz: Math.cos(phi) * speed,
                    life: 1,
                    decay: 0.018 + Math.random() * 0.02,
                    color: burstColors[Math.floor(Math.random() * burstColors.length)],
                });
            }
        };

        const updatePointerFromEvent = (event) => {
            const rect = containerEl.getBoundingClientRect();
            pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            targetParallaxY = pointer.x * maxTilt;
            targetParallaxX = -pointer.y * maxTilt;
        };

        const onPointerDown = (event) => {
            if (event.button !== 0) return;
            isDragging = true;
            dragPointerId = event.pointerId;
            lastDragX = event.clientX;
            lastDragY = event.clientY;
            dragDistance = 0;
            renderer.domElement.style.cursor = 'grabbing';
            renderer.domElement.setPointerCapture?.(event.pointerId);
        };

        const onPointerMove = (event) => {
            updatePointerFromEvent(event);

            if (!isDragging || event.pointerId !== dragPointerId) return;

            const deltaX = event.clientX - lastDragX;
            const deltaY = event.clientY - lastDragY;
            lastDragX = event.clientX;
            lastDragY = event.clientY;
            dragDistance += Math.abs(deltaX) + Math.abs(deltaY);

            userRotationY += deltaX * 0.008;
            userRotationX += deltaY * 0.006;
            userRotationX = THREE.MathUtils.clamp(userRotationX, -1.1, 1.1);
        };

        const onPointerUp = (event) => {
            if (event.pointerId !== dragPointerId) return;
            isDragging = false;
            dragPointerId = null;
            renderer.domElement.style.cursor = 'grab';
            renderer.domElement.releasePointerCapture?.(event.pointerId);
        };

        const onPointerLeave = () => {
            targetParallaxX = 0;
            targetParallaxY = 0;
        };

        const onClick = (event) => {
            if (!laptopMeshes.length || dragDistance > 6) return;

            updatePointerFromEvent(event);
            raycaster.setFromCamera(pointer, camera);
            const hits = raycaster.intersectObjects(laptopMeshes, false);
            if (hits.length === 0) return;

            spawnBurst(hits[0].point);
        };

        containerEl.addEventListener('pointerdown', onPointerDown);
        containerEl.addEventListener('pointermove', onPointerMove);
        containerEl.addEventListener('pointerup', onPointerUp);
        containerEl.addEventListener('pointerleave', onPointerLeave);
        containerEl.addEventListener('click', onClick);

        const burstGeometry = new THREE.BufferGeometry();
        burstGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(48 * 3), 3));
        burstGeometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(48 * 3), 3));
        const particleSprite = createSoftParticleTexture();
        const burstMaterial = new THREE.PointsMaterial({
            size: 0.09,
            map: particleSprite,
            alphaMap: particleSprite,
            vertexColors: true,
            transparent: true,
            opacity: 0.92,
            depthWrite: false,
            sizeAttenuation: true,
        });
        const burstPoints = new THREE.Points(burstGeometry, burstMaterial);
        burstPoints.visible = false;
        scene.add(burstPoints);

        const burstColorScratch = new THREE.Color();
        let elapsed = 0;

        const handle = createSceneHandle({
            renderer,
            scene,
            camera,
            containerEl,
            animate: (time = performance.now()) => {
                elapsed = typeof time === 'number' ? time * 0.001 : elapsed + 0.016;

                screenTextureState.update();

                if (!isDragging) {
                    autoSpin += 0.003;
                    userRotationX = THREE.MathUtils.lerp(userRotationX, 0, 0.04);
                    userRotationY = THREE.MathUtils.lerp(userRotationY, 0, 0.04);
                }

                parallaxX = THREE.MathUtils.lerp(parallaxX, targetParallaxX, 0.08);
                parallaxY = THREE.MathUtils.lerp(parallaxY, targetParallaxY, 0.08);
                workstation.rotation.x = parallaxX + userRotationX;
                workstation.rotation.y = parallaxY + userRotationY + autoSpin;

                if (usingFallback && laptopRoot?.userData?.lidGroup) {
                    laptopRoot.userData.lidGroup.rotation.x = -Math.PI / 7 + Math.sin(elapsed * 1.2) * 0.04;
                }

                orbitLabels.forEach((plane) => {
                    const angle = plane.userData.orbitAngle + elapsed * plane.userData.orbitSpeed * 60;
                    const radius = plane.userData.orbitRadius;
                    const tilt = plane.userData.orbitTilt;
                    const planeY = plane.userData.orbitPlaneY;
                    const centerY = plane.userData.orbitCenterY;

                    const localX = Math.cos(angle) * radius;
                    const localZ = Math.sin(angle) * radius;
                    const y = centerY + localZ * Math.sin(tilt);
                    const flatZ = localZ * Math.cos(tilt);
                    const x = localX * Math.cos(planeY) - flatZ * Math.sin(planeY);
                    const z = localX * Math.sin(planeY) + flatZ * Math.cos(planeY);

                    plane.position.set(x, y, z);
                    plane.lookAt(camera.position);

                    const depthFade = THREE.MathUtils.smoothstep(z, BACK_ORBIT_FADE_END, BACK_ORBIT_FADE_START);
                    const pulse = 0.72 + Math.sin(elapsed * 2.2 + plane.userData.pulsePhase) * 0.22;
                    plane.material.opacity = depthFade * pulse * plane.userData.baseOpacity;
                    plane.visible = plane.material.opacity > 0.04;
                });

                for (let i = burstParticles.length - 1; i >= 0; i -= 1) {
                    const particle = burstParticles[i];
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    particle.z += particle.vz;
                    particle.life -= particle.decay;

                    if (particle.life <= 0) {
                        burstParticles.splice(i, 1);
                    }
                }

                if (burstParticles.length > 0) {
                    const positionAttr = burstGeometry.attributes.position;
                    const colorAttr = burstGeometry.attributes.color;

                    burstParticles.forEach((particle, index) => {
                        positionAttr.setXYZ(index, particle.x, particle.y, particle.z);
                        burstColorScratch.setHex(particle.color);
                        colorAttr.setXYZ(
                            index,
                            burstColorScratch.r * particle.life,
                            burstColorScratch.g * particle.life,
                            burstColorScratch.b * particle.life,
                        );
                    });

                    positionAttr.needsUpdate = true;
                    colorAttr.needsUpdate = true;
                    burstGeometry.setDrawRange(0, burstParticles.length);
                    burstPoints.visible = true;
                } else {
                    burstPoints.visible = false;
                }
            },
            onDispose: () => {
                containerEl.removeEventListener('pointerdown', onPointerDown);
                containerEl.removeEventListener('pointermove', onPointerMove);
                containerEl.removeEventListener('pointerup', onPointerUp);
                containerEl.removeEventListener('pointerleave', onPointerLeave);
                containerEl.removeEventListener('click', onClick);
                screenTextureState.texture.dispose();
                disposeObject3D(laptopRoot);
                orbitLabels.forEach((plane) => {
                    plane.material.map?.dispose();
                    plane.material.dispose();
                    plane.geometry.dispose();
                });
                burstGeometry.dispose();
                particleSprite.dispose();
                burstMaterial.dispose();
            },
        });

        return handle;
    } catch (error) {
        console.error('initHeroScene failed:', error);
        return null;
    }
}

export function initParticleBg(containerEl) {
    if (!containerEl) return null;

    try {
        const renderer = createRenderer(containerEl);
        renderer.domElement.style.pointerEvents = 'none';

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
        camera.position.z = 5;

        const particleCount = 120;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const velocities = [];

        const navy = new THREE.Color(PALETTE.oxfordBlue);
        const cyan = new THREE.Color(PALETTE.skyCyan);

        for (let i = 0; i < particleCount; i += 1) {
            positions[i * 3] = (Math.random() - 0.5) * 14;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 8;

            const mixed = navy.clone().lerp(cyan, Math.random());
            colors[i * 3] = mixed.r;
            colors[i * 3 + 1] = mixed.g;
            colors[i * 3 + 2] = mixed.b;

            velocities.push({
                x: (Math.random() - 0.5) * 0.004,
                y: (Math.random() - 0.5) * 0.004,
                z: (Math.random() - 0.5) * 0.002,
            });
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleSprite = createSoftParticleTexture();
        const material = new THREE.PointsMaterial({
            size: 0.055,
            map: particleSprite,
            alphaMap: particleSprite,
            vertexColors: true,
            transparent: true,
            opacity: 0.55,
            depthWrite: false,
            sizeAttenuation: true,
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        const handle = createSceneHandle({
            renderer,
            scene,
            camera,
            containerEl,
            animate: () => {
                const positionAttr = geometry.attributes.position;
                for (let i = 0; i < particleCount; i += 1) {
                    let x = positionAttr.getX(i) + velocities[i].x;
                    let y = positionAttr.getY(i) + velocities[i].y;
                    let z = positionAttr.getZ(i) + velocities[i].z;

                    if (x > 7) x = -7;
                    if (x < -7) x = 7;
                    if (y > 5) y = -5;
                    if (y < -5) y = 5;
                    if (z > 4) z = -4;
                    if (z < -4) z = 4;

                    positionAttr.setXYZ(i, x, y, z);
                }
                positionAttr.needsUpdate = true;
            },
            onDispose: () => {
                geometry.dispose();
                particleSprite.dispose();
                material.dispose();
            },
        });

        return handle;
    } catch (error) {
        console.error('initParticleBg failed:', error);
        return null;
    }
}

export function initSkillsGalaxy(containerEl, skillsFlat, options = {}) {
    if (!containerEl || !Array.isArray(skillsFlat) || skillsFlat.length === 0) return null;

    try {
        const { onHover = null, layoutMode = 'categories' } = options;
        const isScattered = layoutMode === 'additional';
        const renderer = createRenderer(containerEl);
        renderer.domElement.style.cursor = 'default';

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
        camera.position.set(0, isScattered ? 0.1 : 0.35, isScattered ? 4.8 : 4.2);
        camera.lookAt(0, isScattered ? 0 : 0.1, 0);

        scene.add(new THREE.HemisphereLight(0x7ec8e3, 0x05080f, 0.65));
        scene.add(new THREE.AmbientLight(0x3d6f8f, 0.4));
        const keyLight = new THREE.PointLight(PALETTE.skyCyan, 1.4, 18);
        keyLight.position.set(2.5, 2.8, 3.5);
        scene.add(keyLight);

        const galaxyGroup = new THREE.Group();
        scene.add(galaxyGroup);

        let coreGeometry = null;
        let coreMaterial = null;
        let coreMesh = null;

        if (!isScattered) {
            coreGeometry = new THREE.IcosahedronGeometry(0.11, 1);
            coreMaterial = new THREE.MeshStandardMaterial({
                color: PALETTE.skyCyan,
                emissive: PALETTE.skyCyan,
                emissiveIntensity: 0.65,
                metalness: 0.35,
                roughness: 0.35,
            });
            coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
            galaxyGroup.add(coreMesh);
        }

        const { layouts, categoryMeta } = isScattered
            ? layoutScatteredSkills(skillsFlat)
            : layoutSkillConstellation(skillsFlat);
        const nodes = [];
        const labels = [];
        const disposables = [];

        layouts.forEach((entry) => {
            const { skill, position, index = 0 } = entry;
            let mesh;
            let geometry;
            let material;
            let labelOffset = 0.16;

            if (isScattered) {
                const chip = createSkillChipMesh(skill.accentColor, index);
                mesh = chip.mesh;
                geometry = chip.geometry;
                material = chip.material;
                labelOffset = 0.12;
            } else {
                const accent = hexToThreeColor(skill.accentColor);
                const size = skill.nodeScale
                    ?? (0.055 + ((skill.proficiency ?? 60) / 100) * 0.1);
                labelOffset = size + 0.16;
                geometry = new THREE.SphereGeometry(size, 20, 20);
                material = new THREE.MeshStandardMaterial({
                    color: accent,
                    emissive: accent,
                    emissiveIntensity: 0.42,
                    metalness: 0.3,
                    roughness: 0.4,
                });
                mesh = new THREE.Mesh(geometry, material);

                const ringGeometry = new THREE.TorusGeometry(size * 1.55, 0.006, 8, 32);
                const ringMaterial = new THREE.MeshBasicMaterial({
                    color: accent,
                    transparent: true,
                    opacity: 0.55,
                    depthWrite: false,
                });
                const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                ring.position.copy(position);
                ring.rotation.x = Math.PI / 2;
                galaxyGroup.add(ring);
                mesh.userData.ring = ring;
                disposables.push(() => { ringGeometry.dispose(); ringMaterial.dispose(); });
            }

            mesh.position.copy(position);
            mesh.userData.skill = skill;
            mesh.userData.label = null;
            mesh.userData.basePosition = position.clone();
            mesh.userData.floatPhase = index * 0.7;
            galaxyGroup.add(mesh);
            nodes.push(mesh);
            disposables.push(() => { geometry.dispose(); material.dispose(); });

            const label = createSkillLabelPill(
                skill.name,
                skill.accentColor,
                skill.proficiency ?? 0,
                skill.showProficiency !== false,
            );
            label.position.set(position.x, position.y - labelOffset, position.z);
            label.userData.skill = skill;
            label.userData.parentNode = mesh;
            label.userData.basePosition = label.position.clone();
            label.userData.floatPhase = index * 0.7;
            mesh.userData.label = label;
            galaxyGroup.add(label);
            labels.push(label);
            disposables.push(() => {
                label.material.map?.dispose();
                label.material.dispose();
                label.geometry.dispose();
            });
        });

        if (!isScattered) {
            const constellationLines = createConstellationLines(layouts, categoryMeta);
            constellationLines.forEach((entry) => {
                galaxyGroup.add(entry.mesh);
                disposables.push(entry.dispose);
            });
        }

        if (layoutMode !== 'additional') {
            categoryMeta.forEach(({ category, color, angle }) => {
                const labelRadius = 1.72;
                const sprite = createCategoryLabelSprite(category, color);
                sprite.position.set(
                    Math.cos(angle) * labelRadius,
                    0.62,
                    Math.sin(angle) * labelRadius * 0.72,
                );
                galaxyGroup.add(sprite);
                labels.push(sprite);
                disposables.push(() => {
                    sprite.material.map?.dispose();
                    sprite.material.dispose();
                });
            });
        }

        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();
        let highlightedNode = null;
        let tick = 0;

        const setHighlight = (node) => {
            if (highlightedNode === node) return;

            if (highlightedNode) {
                highlightedNode.scale.set(1, 1, 1);
                highlightedNode.material.emissiveIntensity = 0.42;
                if (highlightedNode.userData.ring) {
                    highlightedNode.userData.ring.material.opacity = 0.55;
                }
                if (highlightedNode.userData.label) {
                    highlightedNode.userData.label.material.opacity = highlightedNode.userData.label.userData.baseOpacity;
                }
            }

            highlightedNode = node;

            if (highlightedNode) {
                highlightedNode.scale.set(1.3, 1.3, 1.3);
                highlightedNode.material.emissiveIntensity = 0.85;
                if (highlightedNode.userData.ring) {
                    highlightedNode.userData.ring.material.opacity = 0.95;
                }
                if (highlightedNode.userData.label) {
                    highlightedNode.userData.label.material.opacity = 1;
                }
                renderer.domElement.style.cursor = 'pointer';
                onHover?.(highlightedNode.userData.skill);
            } else {
                renderer.domElement.style.cursor = 'default';
                onHover?.(null);
            }
        };

        const onPointerMove = (event) => {
            const rect = containerEl.getBoundingClientRect();
            pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(pointer, camera);
            const hits = raycaster.intersectObjects(nodes);
            setHighlight(hits[0]?.object ?? null);
        };

        const onPointerLeave = () => {
            setHighlight(null);
        };

        containerEl.addEventListener('pointermove', onPointerMove);
        containerEl.addEventListener('pointerleave', onPointerLeave);

        const handle = createSceneHandle({
            renderer,
            scene,
            camera,
            containerEl,
            animate: () => {
                tick += 1;

                if (isScattered) {
                    nodes.forEach((node) => {
                        const base = node.userData.basePosition;
                        const phase = node.userData.floatPhase ?? 0;
                        const drift = Math.sin(tick * 0.018 + phase) * 0.03;
                        node.position.y = base.y + drift;

                        const label = node.userData.label;
                        if (label?.userData.basePosition) {
                            label.position.y = label.userData.basePosition.y + drift;
                        }
                    });
                } else {
                    galaxyGroup.rotation.y += 0.0012;
                    if (coreMesh) {
                        coreMesh.rotation.y = tick * 0.001;
                        coreMesh.rotation.x = Math.sin(tick * 0.0008) * 0.25;
                    }
                }

                labels.forEach((label) => {
                    label.lookAt(camera.position);
                });
            },
            onDispose: () => {
                containerEl.removeEventListener('pointermove', onPointerMove);
                containerEl.removeEventListener('pointerleave', onPointerLeave);
                disposables.forEach((dispose) => dispose());
                coreGeometry?.dispose();
                coreMaterial?.dispose();
            },
        });

        return handle;
    } catch (error) {
        console.error('initSkillsGalaxy failed:', error);
        return null;
    }
}

export function destroyScene(handle) {
    if (!handle?.dispose) return;
    handle.dispose();
}
