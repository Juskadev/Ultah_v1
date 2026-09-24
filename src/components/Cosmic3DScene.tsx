import { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface Photo {
  src: string;
  caption: string;
}

interface Cosmic3DSceneProps {
  photos: Photo[];
  onPhotoClick?: (index: number) => void;
  scrollProgress?: number; // 0 to 1
}

// Generate circular canvas texture for photo
function createCircleTexture(imageSrc: string): Promise<THREE.CanvasTexture> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const size = 512;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - 8, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, 0, 0, size, size);
        ctx.restore();

        // Glowing border
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - 8, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(244, 114, 182, 0.9)';
        ctx.lineWidth = 14;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - 4, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(167, 139, 250, 0.6)';
        ctx.lineWidth = 8;
        ctx.stroke();
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      resolve(texture);
    };
    img.onerror = () => {
      // Fallback procedural texture
      const size = 256;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(size / 2, size / 2, 10, size / 2, size / 2, size / 2);
        grad.addColorStop(0, '#f472b6');
        grad.addColorStop(0.5, '#a78bfa');
        grad.addColorStop(1, '#3b0764');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 8;
        ctx.stroke();

        ctx.font = '70px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('❤️', size / 2, size / 2);
      }
      const texture = new THREE.CanvasTexture(canvas);
      resolve(texture);
    };
    img.src = imageSrc;
  });
}

// Procedural glow corona texture
function createSunGlowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
  grad.addColorStop(0, 'rgba(255, 230, 150, 1)');
  grad.addColorStop(0.2, 'rgba(251, 191, 36, 0.8)');
  grad.addColorStop(0.5, 'rgba(244, 114, 182, 0.35)');
  grad.addColorStop(0.8, 'rgba(167, 139, 250, 0.1)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(canvas);
}

export default function Cosmic3DScene({ photos, onPhotoClick, scrollProgress = 0 }: Cosmic3DSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(scrollProgress);
  scrollRef.current = scrollProgress;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    // --- 1. Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0e1a, 0.0018);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 2000);
    camera.position.set(0, 45, 140);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // --- 2. Ambient & Sun Lighting ---
    const ambientLight = new THREE.AmbientLight(0x2d1b4e, 1.8);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xffdf88, 3.5, 600, 1.2);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    const violetAccentLight = new THREE.PointLight(0xa78bfa, 2.0, 500, 1.5);
    violetAccentLight.position.set(0, 30, -50);
    scene.add(violetAccentLight);

    // --- 3. Central Glowing 3D Sun ---
    const sunGroup = new THREE.Group();
    scene.add(sunGroup);

    // Sun core mesh
    const sunGeo = new THREE.SphereGeometry(14, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({
      color: 0xfffae0,
    });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    sunGroup.add(sunMesh);

    // Sun corona layers
    const glowTexture = createSunGlowTexture();
    const coronaGeo = new THREE.PlaneGeometry(55, 55);
    const coronaMat1 = new THREE.MeshBasicMaterial({
      map: glowTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const corona1 = new THREE.Mesh(coronaGeo, coronaMat1);
    sunGroup.add(corona1);

    const coronaMat2 = coronaMat1.clone();
    const corona2 = new THREE.Mesh(coronaGeo, coronaMat2);
    corona2.scale.set(1.4, 1.4, 1.4);
    sunGroup.add(corona2);

    // --- 4. 3D Planetary Orbits (Rings) ---
    const orbitRadii = [42, 68, 98, 130];
    const orbitTiltedAngles = [0.15, -0.22, 0.1, -0.18];

    orbitRadii.forEach((radius, i) => {
      const ringGeo = new THREE.RingGeometry(radius - 0.3, radius + 0.3, 128);
      const ringMat = new THREE.MeshBasicMaterial({
        color: i === 1 ? 0xf472b6 : 0xa78bfa,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: i === 1 ? 0.45 : 0.25,
        blending: THREE.AdditiveBlending,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2 + orbitTiltedAngles[i];
      ring.rotation.y = orbitTiltedAngles[i] * 0.5;
      scene.add(ring);
    });

    // --- 5. 3D Photo Planets orbiting Sun ---
    const photoMeshes: {
      group: THREE.Group;
      mesh: THREE.Mesh;
      ring: THREE.Mesh;
      radius: number;
      speed: number;
      angle: number;
      index: number;
      tiltX: number;
    }[] = [];

    const raycastTargets: THREE.Object3D[] = [];

    const effectivePhotos = photos.slice(0, 6);
    const photoOrbitRadius = 68;

    effectivePhotos.forEach((photo, idx) => {
      const photoGroup = new THREE.Group();
      scene.add(photoGroup);

      const angle = (idx / effectivePhotos.length) * Math.PI * 2;
      const planetSize = 9.5;

      // Outer glowing ring
      const haloGeo = new THREE.RingGeometry(planetSize * 0.52, planetSize * 0.62, 48);
      const haloMat = new THREE.MeshBasicMaterial({
        color: idx % 2 === 0 ? 0xf472b6 : 0xa78bfa,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      photoGroup.add(haloMesh);

      // Photo disc plane
      const planeGeo = new THREE.CircleGeometry(planetSize * 0.5, 48);
      const defaultMat = new THREE.MeshBasicMaterial({
        color: 0x33104d,
        side: THREE.DoubleSide,
      });
      const photoMesh = new THREE.Mesh(planeGeo, defaultMat);
      photoMesh.userData = { photoIndex: idx, isPhoto: true };
      photoGroup.add(photoMesh);
      raycastTargets.push(photoMesh);

      // Load texture asynchronously
      createCircleTexture(photo.src).then((tex) => {
        photoMesh.material = new THREE.MeshBasicMaterial({
          map: tex,
          side: THREE.DoubleSide,
        });
      });

      photoMeshes.push({
        group: photoGroup,
        mesh: photoMesh,
        ring: haloMesh,
        radius: photoOrbitRadius,
        speed: 0.12 / (1 + idx * 0.05),
        angle,
        index: idx,
        tiltX: -0.22,
      });
    });

    // --- 6. 3D Decorative Planets (Saturn, Crystal Orb, Blue Planet) ---
    // Planet A: Crystal Purple Orb
    const planetAGeo = new THREE.SphereGeometry(4.5, 32, 32);
    const planetAMat = new THREE.MeshStandardMaterial({
      color: 0xa78bfa,
      roughness: 0.3,
      metalness: 0.7,
      emissive: 0x4c1d95,
      emissiveIntensity: 0.4,
    });
    const planetA = new THREE.Mesh(planetAGeo, planetAMat);
    scene.add(planetA);

    // Planet B: Saturn with 3D Rings
    const saturnGroup = new THREE.Group();
    const saturnGeo = new THREE.SphereGeometry(6.5, 32, 32);
    const saturnMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      roughness: 0.4,
      metalness: 0.4,
      emissive: 0x78350f,
      emissiveIntensity: 0.3,
    });
    const saturnMesh = new THREE.Mesh(saturnGeo, saturnMat);
    saturnGroup.add(saturnMesh);

    const saturnRingGeo = new THREE.RingGeometry(8, 14, 64);
    const saturnRingMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const saturnRing = new THREE.Mesh(saturnRingGeo, saturnRingMat);
    saturnRing.rotation.x = Math.PI / 2.6;
    saturnGroup.add(saturnRing);
    scene.add(saturnGroup);

    // Planet C: Emerald/Cyan Starlight Planet
    const planetCGeo = new THREE.SphereGeometry(3.5, 32, 32);
    const planetCMat = new THREE.MeshStandardMaterial({
      color: 0x67e8f9,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x0891b2,
      emissiveIntensity: 0.5,
    });
    const planetC = new THREE.Mesh(planetCGeo, planetCMat);
    scene.add(planetC);

    // --- 7. 3D Starfield Galaxy (3,500 particles) ---
    const starCount = 3500;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const colorPalette = [
      new THREE.Color('#ffffff'),
      new THREE.Color('#a78bfa'),
      new THREE.Color('#f472b6'),
      new THREE.Color('#fbbf24'),
      new THREE.Color('#67e8f9'),
      new THREE.Color('#c084fc'),
    ];

    for (let i = 0; i < starCount; i++) {
      // Cylindrical galaxy distribution with spherical halo
      const r = Math.pow(Math.random(), 0.6) * 600 + 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.8;

      starPositions[i * 3] = r * Math.cos(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * 0.6 + (Math.random() - 0.5) * 80;
      starPositions[i * 3 + 2] = r * Math.cos(phi) * Math.sin(theta);

      const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      starColors[i * 3] = col.r;
      starColors[i * 3 + 1] = col.g;
      starColors[i * 3 + 2] = col.b;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // --- 8. 3D Volumetric Nebula Clouds ---
    const nebulaCount = 450;
    const nebulaGeo = new THREE.BufferGeometry();
    const nebulaPos = new Float32Array(nebulaCount * 3);
    const nebulaColors = new Float32Array(nebulaCount * 3);

    const nebulaPals = [
      new THREE.Color('#6d28d9'),
      new THREE.Color('#be185d'),
      new THREE.Color('#4338ca'),
      new THREE.Color('#9333ea'),
      new THREE.Color('#db2777'),
    ];

    for (let i = 0; i < nebulaCount; i++) {
      const radius = Math.random() * 220 + 30;
      const angle = Math.random() * Math.PI * 2;
      const spread = (Math.random() - 0.5) * 60;

      nebulaPos[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 40;
      nebulaPos[i * 3 + 1] = spread;
      nebulaPos[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 40;

      const c = nebulaPals[Math.floor(Math.random() * nebulaPals.length)];
      nebulaColors[i * 3] = c.r;
      nebulaColors[i * 3 + 1] = c.g;
      nebulaColors[i * 3 + 2] = c.b;
    }

    nebulaGeo.setAttribute('position', new THREE.BufferAttribute(nebulaPos, 3));
    nebulaGeo.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3));

    const nebulaMat = new THREE.PointsMaterial({
      size: 16.0,
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const nebulaPoints = new THREE.Points(nebulaGeo, nebulaMat);
    scene.add(nebulaPoints);

    // --- 9. 3D Shooting Star / Meteor ---
    const meteorGeo = new THREE.BufferGeometry();
    const meteorTrailCount = 20;
    const meteorPositions = new Float32Array(meteorTrailCount * 3);
    meteorGeo.setAttribute('position', new THREE.BufferAttribute(meteorPositions, 3));
    const meteorMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
    });
    const meteorLine = new THREE.Line(meteorGeo, meteorMat);
    scene.add(meteorLine);

    let meteorActive = false;
    let meteorProgress = 0;
    let meteorStart = new THREE.Vector3();
    let meteorDir = new THREE.Vector3();

    function triggerMeteor() {
      meteorActive = true;
      meteorProgress = 0;
      meteorStart.set(
        (Math.random() - 0.5) * 200,
        Math.random() * 80 + 30,
        (Math.random() - 0.5) * 100 - 50
      );
      meteorDir.set(
        Math.random() * 60 + 40,
        -Math.random() * 40 - 20,
        Math.random() * 50 - 25
      ).normalize();
    }

    const meteorInterval = setInterval(() => {
      if (!meteorActive && Math.random() > 0.3) {
        triggerMeteor();
      }
    }, 4500);

    // --- 10. Mouse Interaction & Raycasting ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);
    const targetCameraOffset = new THREE.Vector2(0, 0);
    const currentCameraOffset = new THREE.Vector2(0, 0);

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / height) * 2 + 1;
      targetCameraOffset.x = mouse.x * 22;
      targetCameraOffset.y = mouse.y * 14;
    };

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(raycastTargets);
      if (intersects.length > 0) {
        const target = intersects[0].object;
        if (target.userData && typeof target.userData.photoIndex === 'number') {
          onPhotoClick?.(target.userData.photoIndex);
        }
      }
    };

    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('click', onClick);

    // --- 11. Animation Loop ---
    let animationFrameId: number;
    const startTime = performance.now();
    let lastTime = startTime;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const now = performance.now();
      const elapsed = (now - startTime) * 0.001;
      const delta = Math.min((now - lastTime) * 0.001, 0.1);
      lastTime = now;

      // Sun animation
      sunMesh.rotation.y = elapsed * 0.15;
      const sunPulse = 1 + Math.sin(elapsed * 2.5) * 0.05;
      sunMesh.scale.set(sunPulse, sunPulse, sunPulse);
      corona1.rotation.z = elapsed * 0.08;
      corona2.rotation.z = -elapsed * 0.05;
      corona1.scale.set(1.4 * sunPulse, 1.4 * sunPulse, 1);
      corona2.scale.set(1.9 * (2 - sunPulse), 1.9 * (2 - sunPulse), 1);

      // Starfield gentle rotation
      starField.rotation.y = elapsed * 0.008;
      nebulaPoints.rotation.y = elapsed * 0.005;

      // Decorative Planets Orbit
      // Planet A (Inner purple)
      const angleA = elapsed * 0.45;
      planetA.position.set(Math.cos(angleA) * 42, Math.sin(angleA) * 6, Math.sin(angleA) * 42);
      planetA.rotation.y += 0.02;

      // Planet B (Saturn yellow)
      const angleB = elapsed * 0.22 + 2;
      saturnGroup.position.set(Math.cos(angleB) * 98, Math.sin(angleB) * -12, Math.sin(angleB) * 98);
      saturnMesh.rotation.y += 0.015;

      // Planet C (Cyan outer)
      const angleC = elapsed * 0.14 + 4;
      planetC.position.set(Math.cos(angleC) * 130, Math.sin(angleC) * 15, Math.sin(angleC) * 130);
      planetC.rotation.y += 0.03;

      // Photo Planets Orbit
      raycaster.setFromCamera(mouse, camera);
      const hoveredIntersect = raycaster.intersectObjects(raycastTargets);
      const hoveredObj = hoveredIntersect.length > 0 ? hoveredIntersect[0].object : null;

      if (hoveredObj) {
        document.body.style.cursor = 'pointer';
      } else {
        document.body.style.cursor = 'default';
      }

      photoMeshes.forEach((item) => {
        // Orbit speed (slow down slightly on hover)
        const isHovered = hoveredObj === item.mesh;
        const currentSpeed = isHovered ? item.speed * 0.15 : item.speed;
        item.angle += currentSpeed * delta * 2.5;

        // Elliptical coordinates with tilt
        const x = Math.cos(item.angle) * item.radius;
        const z = Math.sin(item.angle) * item.radius;
        const y = Math.sin(item.angle) * 8 + Math.cos(item.angle) * item.tiltX * 20;

        item.group.position.set(x, y, z);

        // Always face camera (billboard)
        item.group.lookAt(camera.position);

        // Hover scale animation
        const targetScale = isHovered ? 1.35 : 1.0;
        item.group.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
        (item.ring.material as THREE.MeshBasicMaterial).opacity = isHovered ? 1.0 : 0.7;
      });

      // Meteor animation
      if (meteorActive) {
        meteorProgress += delta * 1.8;
        if (meteorProgress > 1) {
          meteorActive = false;
          meteorMat.opacity = 0;
        } else {
          meteorMat.opacity = Math.sin(meteorProgress * Math.PI) * 0.9;
          const headPos = meteorStart.clone().add(meteorDir.clone().multiplyScalar(meteorProgress * 280));
          const positions = meteorGeo.attributes.position.array as Float32Array;
          for (let i = 0; i < meteorTrailCount; i++) {
            const trailOffset = meteorDir.clone().multiplyScalar(-i * 1.8);
            const p = headPos.clone().add(trailOffset);
            positions[i * 3] = p.x;
            positions[i * 3 + 1] = p.y;
            positions[i * 3 + 2] = p.z;
          }
          meteorGeo.attributes.position.needsUpdate = true;
        }
      }

      // Smooth camera interpolation based on scroll and mouse
      currentCameraOffset.lerp(targetCameraOffset, 0.05);

      const sp = scrollRef.current; // 0 to 1
      // Cinematic 3D camera travel as user scrolls
      const camRadius = 140 - sp * 45;
      const camAngle = sp * Math.PI * 0.85;
      const camHeight = 45 + Math.sin(sp * Math.PI) * 35 - sp * 20;

      const targetCamX = Math.sin(camAngle) * camRadius + currentCameraOffset.x;
      const targetCamY = camHeight + currentCameraOffset.y;
      const targetCamZ = Math.cos(camAngle) * camRadius;

      camera.position.lerp(new THREE.Vector3(targetCamX, targetCamY, targetCamZ), 0.06);
      camera.lookAt(0, -sp * 10, 0);

      renderer.render(scene, camera);
    };

    animate();

    // --- 12. Resize Handler ---
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(meteorInterval);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('click', onClick);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      document.body.style.cursor = 'default';

      // Dispose Three.js resources
      renderer.dispose();
      sunGeo.dispose();
      sunMat.dispose();
      glowTexture.dispose();
      coronaGeo.dispose();
      coronaMat1.dispose();
      coronaMat2.dispose();
      starGeo.dispose();
      starMat.dispose();
      nebulaGeo.dispose();
      nebulaMat.dispose();
      meteorGeo.dispose();
      meteorMat.dispose();

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [photos, onPhotoClick]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-auto"
      style={{ overflow: 'hidden' }}
    />
  );
}
