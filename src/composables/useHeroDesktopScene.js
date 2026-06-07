import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const MODEL_URL = `${import.meta.env.BASE_URL}assets/hero-desktop-pc/scene.gltf`;
const MOBILE_QUERY = '(max-width: 500px)';
const ENTRANCE_DURATION = 1.35;
const IDLE_RESUME_MS = 1800;
const IDLE_SWAY_AMPLITUDE = 0.28;
const IDLE_SWAY_SPEED = 0.42;
const RETURN_TO_FRONT_DURATION = 1.15;

// Same viewing angle as the reference Computers.jsx camera [20, 3, 5] → origin.
const CAMERA_VIEW_DIRECTION = new THREE.Vector3(20, 3, 5).normalize();
const cameraOffset = new THREE.Vector3();
const orbitOffset = new THREE.Vector3();
const orbitSpherical = new THREE.Spherical();

function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function easeOutCubic(t) {
    return 1 - (1 - t) ** 3;
}

function getDesktopTransform(isMobile) {
    return {
        scale: isMobile ? 0.62 : 0.68,
        position: new THREE.Vector3(0, isMobile ? -2.85 : -3, isMobile ? -1.8 : -1.35),
        rotation: new THREE.Euler(-0.01, -0.2, -0.1),
    };
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

function prepareHeroDesktopModel(model) {
    model.traverse((child) => {
        if (!child.isMesh) return;

        if (/PewDiePie-Logo/i.test(child.name)) {
            child.visible = false;
        }

        child.castShadow = true;
        child.receiveShadow = true;
    });
}

function applyDesktopTransform(model, isMobile) {
    const transform = getDesktopTransform(isMobile);
    model.scale.setScalar(transform.scale);
    model.position.copy(transform.position);
    model.rotation.copy(transform.rotation);
    return transform;
}

function getBoxCorners(box) {
    const { min, max } = box;
    return [
        new THREE.Vector3(min.x, min.y, min.z),
        new THREE.Vector3(min.x, min.y, max.z),
        new THREE.Vector3(min.x, max.y, min.z),
        new THREE.Vector3(min.x, max.y, max.z),
        new THREE.Vector3(max.x, min.y, min.z),
        new THREE.Vector3(max.x, min.y, max.z),
        new THREE.Vector3(max.x, max.y, min.z),
        new THREE.Vector3(max.x, max.y, max.z),
    ];
}

function cornersFitViewport(corners, camera, margin = 0.04) {
    const projected = new THREE.Vector3();

    return corners.every((corner) => {
        projected.copy(corner).project(camera);
        return (
            projected.x >= -1 + margin
            && projected.x <= 1 - margin
            && projected.y >= -1 + margin
            && projected.y <= 1 - margin
            && projected.z >= -1
            && projected.z <= 1
        );
    });
}

function fitDesktopInView(model, camera, controls, distanceMultiplier = 1) {
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    const corners = getBoxCorners(box);

    controls.target.copy(center);

    const vFov = (camera.fov * Math.PI) / 180;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
    const fitHeightDistance = sphere.radius / Math.sin(vFov / 2);
    const fitWidthDistance = sphere.radius / Math.sin(hFov / 2);
    let distance = Math.max(fitHeightDistance, fitWidthDistance) * 1.02 * distanceMultiplier;

    for (let attempt = 0; attempt < 12; attempt += 1) {
        camera.position.copy(center).add(CAMERA_VIEW_DIRECTION.clone().multiplyScalar(distance));
        camera.lookAt(center);
        camera.updateProjectionMatrix();

        if (cornersFitViewport(corners, camera)) {
            break;
        }

        distance *= 1.06;
    }

    camera.near = Math.max(0.1, distance * 0.01);
    camera.far = distance * 20;
    camera.updateProjectionMatrix();
    controls.update();

    return { center: center.clone(), distance };
}

function readCameraOrbit(camera, controls) {
    orbitOffset.subVectors(camera.position, controls.target);
    orbitSpherical.setFromVector3(orbitOffset);
    return orbitSpherical;
}

function setCameraOrbit(camera, controls, spherical) {
    orbitOffset.setFromSpherical(spherical);
    camera.position.copy(controls.target).add(orbitOffset);
}

/**
 * Vue/raw-Three.js port of project_3D_developer_portfolio ComputersCanvas + Computers.
 */
export function initHeroDesktopScene(containerEl, callbacks = {}) {
    if (!containerEl) return null;

    const { onProgress, onLoad, onError } = callbacks;
    const reducedMotion = prefersReducedMotion();
    const clock = new THREE.Clock();

    const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.background = 'transparent';
    renderer.domElement.style.outline = 'none';
    renderer.domElement.style.cursor = 'grab';
    containerEl.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 200);
    camera.position.set(20, 3, 5);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x000000, 0.15));

    const spotLight = new THREE.SpotLight(0xffffff, 1);
    spotLight.position.set(-20, 50, 10);
    spotLight.angle = 0.12;
    spotLight.penumbra = 1;
    spotLight.castShadow = true;
    spotLight.shadow.mapSize.set(1024, 1024);
    scene.add(spotLight);

    scene.add(new THREE.PointLight(0xffffff, 1));

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.maxPolarAngle = Math.PI / 2;
    controls.minPolarAngle = Math.PI / 2;
    controls.minAzimuthAngle = -Infinity;
    controls.maxAzimuthAngle = Infinity;
    controls.target.set(0, 0, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    let idleResumeTimer = null;
    let isUserInteracting = false;
    let returningToFront = false;
    let returnElapsed = 0;
    let returnStartTheta = 0;
    let frontAzimuth = 0;
    let entranceElapsed = 0;
    let entranceComplete = reducedMotion;
    let targetTransform = null;
    let cameraFit = null;

    const captureFrontAzimuth = () => {
        frontAzimuth = readCameraOrbit(camera, controls).theta;
    };

    const getFrontSwayTheta = (elapsed) => (
        frontAzimuth + Math.sin(elapsed * IDLE_SWAY_SPEED) * IDLE_SWAY_AMPLITUDE
    );

    controls.addEventListener('start', () => {
        isUserInteracting = true;
        returningToFront = false;
        if (idleResumeTimer !== null) {
            clearTimeout(idleResumeTimer);
            idleResumeTimer = null;
        }
        renderer.domElement.style.cursor = 'grabbing';
    });
    controls.addEventListener('end', () => {
        isUserInteracting = false;
        renderer.domElement.style.cursor = 'grab';
        if (!reducedMotion) {
            idleResumeTimer = setTimeout(() => {
                returnStartTheta = readCameraOrbit(camera, controls).theta;
                returnElapsed = 0;
                returningToFront = true;
                idleResumeTimer = null;
            }, IDLE_RESUME_MS);
        }
    });

    let desktopModel = null;
    let isMobile = window.matchMedia(MOBILE_QUERY).matches;
    let animationId = null;
    let hasRendered = false;

    const applyIdleMotion = (elapsed) => {
        if (!desktopModel || !targetTransform || isUserInteracting || !entranceComplete || reducedMotion) {
            return;
        }

        desktopModel.position.y = targetTransform.position.y + Math.sin(elapsed * 0.85) * 0.045;
    };

    const applyIdleSway = (elapsed, delta) => {
        if (!desktopModel || !cameraFit || isUserInteracting || !entranceComplete || reducedMotion) {
            return;
        }

        const spherical = readCameraOrbit(camera, controls);
        const swayTheta = getFrontSwayTheta(elapsed);

        if (returningToFront) {
            returnElapsed += delta;
            const progress = Math.min(returnElapsed / RETURN_TO_FRONT_DURATION, 1);
            spherical.theta = THREE.MathUtils.lerp(returnStartTheta, swayTheta, easeOutCubic(progress));

            if (progress >= 1) {
                returningToFront = false;
            }
        } else {
            spherical.theta = swayTheta;
        }

        setCameraOrbit(camera, controls, spherical);
    };

    const updateEntrance = (delta) => {
        if (!desktopModel || !targetTransform || entranceComplete) {
            return;
        }

        entranceElapsed += delta;
        const progress = Math.min(entranceElapsed / ENTRANCE_DURATION, 1);
        const eased = easeOutCubic(progress);

        desktopModel.scale.setScalar(
            THREE.MathUtils.lerp(targetTransform.scale * 0.84, targetTransform.scale, eased),
        );
        desktopModel.position.y = THREE.MathUtils.lerp(
            targetTransform.position.y + 0.28,
            targetTransform.position.y,
            eased,
        );

        if (cameraFit) {
            const zoomedDistance = THREE.MathUtils.lerp(cameraFit.distance * 1.1, cameraFit.distance, eased);
            camera.position.copy(cameraFit.center).add(
                cameraOffset.copy(CAMERA_VIEW_DIRECTION).multiplyScalar(zoomedDistance),
            );
            camera.lookAt(cameraFit.center);
            controls.update();
        }

        if (progress >= 1) {
            entranceComplete = true;
            desktopModel.scale.setScalar(targetTransform.scale);
            desktopModel.position.copy(targetTransform.position);
            captureFrontAzimuth();
        }
    };

    const render = () => {
        renderer.render(scene, camera);
        hasRendered = true;
    };

    const resize = () => {
        const { clientWidth, clientHeight } = containerEl;
        if (!clientWidth || !clientHeight) return;

        renderer.setSize(clientWidth, clientHeight, false);
        camera.aspect = clientWidth / clientHeight;
        camera.updateProjectionMatrix();

        if (desktopModel && entranceComplete) {
            cameraFit = fitDesktopInView(desktopModel, camera, controls);
            captureFrontAzimuth();
        }

        render();
    };

    const resizeObserver = new ResizeObserver(() => {
        resize();
    });
    resizeObserver.observe(containerEl);

    requestAnimationFrame(() => {
        resize();
        if (!hasRendered) {
            render();
        }
    });

    const loader = new GLTFLoader();
    loader.setResourcePath(MODEL_URL.slice(0, MODEL_URL.lastIndexOf('/') + 1));

    loader.load(
        MODEL_URL,
        (gltf) => {
            desktopModel = gltf.scene;
            prepareHeroDesktopModel(desktopModel);
            targetTransform = applyDesktopTransform(desktopModel, isMobile);
            scene.add(desktopModel);

            if (reducedMotion) {
                cameraFit = fitDesktopInView(desktopModel, camera, controls);
                captureFrontAzimuth();
            } else {
                desktopModel.scale.setScalar(targetTransform.scale * 0.84);
                desktopModel.position.y = targetTransform.position.y + 0.28;
                cameraFit = fitDesktopInView(desktopModel, camera, controls, 1.1);
                entranceElapsed = 0;
                entranceComplete = false;
            }

            onLoad?.();
            render();
        },
        (xhr) => {
            if (xhr.total) {
                onProgress?.((xhr.loaded / xhr.total) * 100);
            }
        },
        (error) => {
            console.error('Hero desktop model failed:', error);
            onError?.(error);
        },
    );

    const handleMobileChange = (event) => {
        isMobile = event.matches;
        if (!desktopModel) return;

        targetTransform = applyDesktopTransform(desktopModel, isMobile);
        cameraFit = fitDesktopInView(desktopModel, camera, controls);
        captureFrontAzimuth();
        render();
    };

    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    mediaQuery.addEventListener('change', handleMobileChange);

    const onVisibilityChange = () => {
        if (!document.hidden) {
            render();
        }
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const loop = () => {
        animationId = requestAnimationFrame(loop);
        const delta = clock.getDelta();
        const elapsed = clock.elapsedTime;

        updateEntrance(delta);
        applyIdleSway(elapsed, delta);
        applyIdleMotion(elapsed);
        controls.update();

        if (desktopModel || !hasRendered) {
            render();
        }
    };
    loop();

    const dispose = () => {
        if (animationId !== null) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }

        if (idleResumeTimer !== null) {
            clearTimeout(idleResumeTimer);
            idleResumeTimer = null;
        }

        mediaQuery.removeEventListener('change', handleMobileChange);
        document.removeEventListener('visibilitychange', onVisibilityChange);
        resizeObserver.disconnect();
        controls.dispose();

        if (desktopModel) {
            scene.remove(desktopModel);
            disposeObject3D(desktopModel);
            desktopModel = null;
        }

        renderer.dispose();
        if (renderer.domElement.parentNode === containerEl) {
            containerEl.removeChild(renderer.domElement);
        }
    };

    return { dispose, render };
}
