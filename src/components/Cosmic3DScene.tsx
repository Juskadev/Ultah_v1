import { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface Photo {
  src: string;
  caption: string;
}

interface Cosmic3DSceneProps {
  photos: Photo[];
  onPhotoClick?: (index: number) => void;
  scrollProgress?: number;
  primaryColor?: string;
  secondaryColor?: string;
}

// Generate circular canvas texture for photo
function createCircleTexture(imageSrc: string): Promise<THREE.CanvasTexture> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const size = 256; // 256 is sharp & saves GPU memory on mobile
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - 6, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, 0, 0, size, size);
        ctx.restore();

        // Glowing border
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - 6, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(244, 114, 182, 0.9)';
        ctx.lineWidth = 10;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - 3, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(167, 139, 250, 0.6)';
        ctx.lineWidth = 6;
        ctx.stroke();
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      resolve(texture);
    };
    img.onerror = () => {
      const size = 128;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(size / 2, size / 2, 5, size / 2, size / 2, size / 2);
        grad.addColorStop(0, '#f472b6');
        grad.addColorStop(0.5, '#a78bfa');
        grad.addColorStop(1, '#3b0764');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '36px sans-serif';
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
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(64, 64, 6, 64, 64, 64);
  grad.addColorStop(0, 'rgba(255, 230, 150, 1)');
  grad.addColorStop(0.25, 'rgba(251, 191, 36, 0.8)');
  grad.addColorStop(0.55, 'rgba(244, 114, 182, 0.35)');
  grad.addColorStop(0.85, 'rgba(167, 139, 250, 0.1)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

export default function Cosmic3DScene({
  photos,
  onPhotoClick,
  scrollProgress = 0,
  primaryColor = '#f472b6',
  secondaryColor = '#a78bfa',
}: Cosmic3DSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(scrollProgress);
  scrollRef.current = scrollProgress;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;
    const isMobile = width < 768 || 'ontouchstart' in window;

    // --- 1. Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0e1a, isMobile ? 0.002 : 0.0018);

    const camera = new THREE.PerspectiveCamera(isMobile ? 65 : 55, width / height, 0.1, 1500);
    camera.position.set(0, isMobile ? 35 : 45, isMobile ? 125 : 140);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile, // Disable on mobile for buttery smooth 60fps
      alpha: true,
      powerPreference: 'high-performance',
      precision: isMobile ? 'mediump' : 'highp',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.2 : 1.5));
    container.appendChild(renderer.domElement);

    // --- 2. Lighting ---
    const ambientLight = new THREE.AmbientLight(0x2d1b4e, 2.0);
    scene.add(ambientLight);

    const sunLight = new THREE.PointLight(0xffdf88, 3.2, 500, 1.2);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    // --- 3. Central Glowing 3D Sun ---
    const sunGroup = new THREE.Group();
    scene.add(sunGroup);

    const sunGeo = new THREE.SphereGeometry(isMobile ? 11 : 14, isMobile ? 20 : 32, isMobile ? 20 : 32);
    const sunMat = new THREE.MeshBasicMaterial({ color: 0xfffae0 });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    sunGroup.add(sunMesh);

    const glowTexture = createSunGlowTexture();
    const coronaGeo = new THREE.PlaneGeometry(isMobile ? 42 : 55, isMobile ? 42 : 55);
    const coronaMat1 = new THREE.MeshBasicMaterial({
      map: glowTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const corona1 = new THREE.Mesh(coronaGeo, coronaMat1);
    sunGroup.add(corona1);

    // --- 4. 3D Planetary Orbits (Rings) ---
    const orbitRadii = [40, 65, 92, 120];
    const orbitTiltedAngles = [0.15, -0.22, 0.1, -0.18];

    orbitRadii.forEach((radius, i) => {
      const ringGeo = new THREE.RingGeometry(radius - 0.25, radius + 0.25, isMobile ? 48 : 96);
      const ringMat = new THREE.MeshBasicMaterial({
        color: i === 1 ? new THREE.Color(primaryColor) : new THREE.Color(secondaryColor),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: i === 1 ? 0.45 : 0.2,
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
    const effectivePhotos = photos.slice(0, 8);
    const photoOrbitRadius = 65;

    effectivePhotos.forEach((photo, idx) => {
      const photoGroup = new THREE.Group();
      scene.add(photoGroup);

      const angle = (idx / effectivePhotos.length) * Math.PI * 2;
      const planetSize = isMobile ? 8.0 : 9.5;

      // Halo ring
      const haloGeo = new THREE.RingGeometry(planetSize * 0.52, planetSize * 0.62, isMobile ? 24 : 36);
      const haloMat = new THREE.MeshBasicMaterial({
        color: idx % 2 === 0 ? new THREE.Color(primaryColor) : new THREE.Color(secondaryColor),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      photoGroup.add(haloMesh);

      // Photo disc
      const planeGeo = new THREE.CircleGeometry(planetSize * 0.5, isMobile ? 24 : 36);
      const defaultMat = new THREE.MeshBasicMaterial({ color: 0x33104d, side: THREE.DoubleSide });
      const photoMesh = new THREE.Mesh(planeGeo, defaultMat);
      photoMesh.userData = { photoIndex: idx, isPhoto: true };
      photoGroup.add(photoMesh);
      raycastTargets.push(photoMesh);

      createCircleTexture(photo.src).then((tex) => {
        photoMesh.material = new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide });
      });

      photoMeshes.push({
        group: photoGroup,
        mesh: photoMesh,
        ring: haloMesh,
        radius: photoOrbitRadius,
        speed: 0.14 / (1 + idx * 0.05),
        angle,
        index: idx,
        tiltX: -0.22,
      });
    });

    // --- 6. 3D Starfield Galaxy (Optimized count for 60 FPS) ---
    const starCount = isMobile ? 500 : 1100;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const colorPalette = [
      new THREE.Color('#ffffff'),
      new THREE.Color(secondaryColor),
      new THREE.Color(primaryColor),
      new THREE.Color('#fbbf24'),
      new THREE.Color('#67e8f9'),
    ];

    for (let i = 0; i < starCount; i++) {
      const r = Math.pow(Math.random(), 0.6) * 500 + 35;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.8;

      starPositions[i * 3] = r * Math.cos(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * 0.6 + (Math.random() - 0.5) * 60;
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
      size: isMobile ? 1.8 : 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // --- 7. 3D Nebula Dust ---
    const nebulaCount = isMobile ? 35 : 75;
    const nebulaGeo = new THREE.BufferGeometry();
    const nebulaPos = new Float32Array(nebulaCount * 3);
    const nebulaColors = new Float32Array(nebulaCount * 3);

    const nebulaPals = [
      new THREE.Color(secondaryColor),
      new THREE.Color(primaryColor),
      new THREE.Color('#4338ca'),
    ];

    for (let i = 0; i < nebulaCount; i++) {
      const radius = Math.random() * 180 + 30;
      const angle = Math.random() * Math.PI * 2;

      nebulaPos[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 30;
      nebulaPos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      nebulaPos[i * 3 + 2] = Math.sin(angle) * radius + (Math.random() - 0.5) * 30;

      const c = nebulaPals[Math.floor(Math.random() * nebulaPals.length)];
      nebulaColors[i * 3] = c.r;
      nebulaColors[i * 3 + 1] = c.g;
      nebulaColors[i * 3 + 2] = c.b;
    }

    nebulaGeo.setAttribute('position', new THREE.BufferAttribute(nebulaPos, 3));
    nebulaGeo.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3));

    const nebulaMat = new THREE.PointsMaterial({
      size: isMobile ? 12.0 : 16.0,
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const nebulaPoints = new THREE.Points(nebulaGeo, nebulaMat);
    scene.add(nebulaPoints);

    // --- 8. Smooth Mouse & Touch Parallax ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);
    const targetCameraOffset = new THREE.Vector2(0, 0);
    const currentCameraOffset = new THREE.Vector2(0, 0);

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / height) * 2 + 1;
      targetCameraOffset.x = mouse.x * 16;
      targetCameraOffset.y = mouse.y * 10;
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

    if (!isMobile) {
      window.addEventListener('mousemove', onPointerMove, { passive: true });
      window.addEventListener('click', onClick);
    }

    // --- 9. Visibility / Offscreen Pause Optimization ---
    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // --- 10. Animation Loop ---
    let animationFrameId: number;
    const startTime = performance.now();
    let lastTime = startTime;

    const animate = (now: number) => {
      animationFrameId = requestAnimationFrame(animate);

      // If hero is offscreen on mobile, skip rendering to save 100% CPU/GPU!
      if (!isVisible) return;

      const elapsed = (now - startTime) * 0.001;
      const delta = Math.min((now - lastTime) * 0.001, 0.05);
      lastTime = now;

      // Sun pulse
      const sunPulse = 1 + Math.sin(elapsed * 2.5) * 0.04;
      sunMesh.scale.set(sunPulse, sunPulse, sunPulse);
      corona1.rotation.z = elapsed * 0.08;
      corona1.scale.set(1.3 * sunPulse, 1.3 * sunPulse, 1);

      // Starfield gentle drift
      starField.rotation.y = elapsed * 0.006;
      nebulaPoints.rotation.y = elapsed * 0.004;

      // Photo Planets Orbit
      let hoveredObj: THREE.Object3D | null = null;
      if (!isMobile) {
        raycaster.setFromCamera(mouse, camera);
        const hoveredIntersect = raycaster.intersectObjects(raycastTargets);
        hoveredObj = hoveredIntersect.length > 0 ? hoveredIntersect[0].object : null;
      }

      photoMeshes.forEach((item) => {
        const isHovered = hoveredObj === item.mesh;
        const currentSpeed = isHovered ? item.speed * 0.2 : item.speed;
        item.angle += currentSpeed * delta * 2.2;

        const x = Math.cos(item.angle) * item.radius;
        const z = Math.sin(item.angle) * item.radius;
        const y = Math.sin(item.angle) * 6 + Math.cos(item.angle) * item.tiltX * 16;

        item.group.position.set(x, y, z);
        item.group.lookAt(camera.position);

        if (isHovered) {
          item.group.scale.lerp(new THREE.Vector3(1.3, 1.3, 1.3), 0.1);
        } else {
          item.group.scale.lerp(new THREE.Vector3(1.0, 1.0, 1.0), 0.1);
        }
      });

      // Smooth camera interpolation
      currentCameraOffset.lerp(targetCameraOffset, 0.05);

      const sp = scrollRef.current;
      const baseCamRadius = isMobile ? 125 : 140;
      const camRadius = baseCamRadius - sp * 35;
      const camAngle = sp * Math.PI * 0.75;
      const camHeight = (isMobile ? 35 : 45) + Math.sin(sp * Math.PI) * 25;

      const targetCamX = Math.sin(camAngle) * camRadius + currentCameraOffset.x;
      const targetCamY = camHeight + currentCameraOffset.y;
      const targetCamZ = Math.cos(camAngle) * camRadius;

      camera.position.lerp(new THREE.Vector3(targetCamX, targetCamY, targetCamZ), 0.08);
      camera.lookAt(0, -sp * 8, 0);

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // --- 11. Resize Handler ---
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 2));
    };

    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      if (!isMobile) {
        window.removeEventListener('mousemove', onPointerMove);
        window.removeEventListener('click', onClick);
      }
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      renderer.dispose();
      sunGeo.dispose();
      sunMat.dispose();
      glowTexture.dispose();
      coronaGeo.dispose();
      coronaMat1.dispose();
      starGeo.dispose();
      starMat.dispose();
      nebulaGeo.dispose();
      nebulaMat.dispose();

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [photos, onPhotoClick, primaryColor, secondaryColor]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-auto"
      style={{ overflow: 'hidden', willChange: 'transform' }}
    />
  );
}
