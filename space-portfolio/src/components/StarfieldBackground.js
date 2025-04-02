import { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function StarfieldBackground({ darkMode, reducedMotion = false }) {
  const containerRef = useRef();
  const prevMode = useRef(darkMode);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      precision: 'lowp',
      powerPreference: 'high-performance',
    });

    const pixelRatio = Math.min(window.devicePixelRatio, 1);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    const isMobile = window.innerWidth < 768;

    let brightStars, dimStars, coloredStars = [];
    let clouds = [];
    let nebulas = [];
    let sun, moon;

    const createCelestialObjects = () => {
      const sunGeometry = new THREE.SphereGeometry(35, 32, 32);
      const sunMaterial = new THREE.MeshBasicMaterial({
        color: 0xffcc66,
        transparent: true,
        opacity: darkMode ? 0 : 0.9,
      });
      sun = new THREE.Mesh(sunGeometry, sunMaterial);
      sun.position.set(-230, 190, -300);
      scene.add(sun);

      const sunGlowGeometry = new THREE.SphereGeometry(52, 32, 32);
      const sunGlowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffdd44,
        transparent: true,
        opacity: darkMode ? 0 : 0.5,
        side: THREE.BackSide,
      });
      const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
      sun.add(sunGlow);

      // Moon with bright white color
      const moonGeometry = new THREE.SphereGeometry(28, 24, 24);
      const moonMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff, // Pure white color for the moon
        transparent: true,
        opacity: darkMode ? 0.95 : 0, // Increased opacity for better visibility
      });
      moon = new THREE.Mesh(moonGeometry, moonMaterial);
      moon.position.set(-230, 190, -300);
      scene.add(moon);

      const moonGlowGeometry = new THREE.SphereGeometry(38, 24, 24);
      const moonGlowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff, // White glow for the moon
        transparent: true,
        opacity: darkMode ? 0.4 : 0,
        side: THREE.BackSide,
      });
      const moonGlow = new THREE.Mesh(moonGlowGeometry, moonGlowMaterial);
      moon.add(moonGlow);

      if (!isMobile) {
        const craterCount = 10;
        for (let i = 0; i < craterCount; i++) {
          const size = Math.random() * 5 + 3;
          const craterGeometry = new THREE.CircleGeometry(size, 12);
          const craterMaterial = new THREE.MeshBasicMaterial({
            color: 0xdddddd, // Light gray craters for contrast on white moon
            transparent: true,
            opacity: darkMode ? 0.7 : 0,
          });
          const crater = new THREE.Mesh(craterGeometry, craterMaterial);

          const theta = Math.random() * Math.PI * 0.5 - Math.PI * 0.25;
          const phi = Math.random() * Math.PI - Math.PI * 0.5;
          const radius = 27.5;

          crater.position.x = radius * Math.sin(phi) * Math.cos(theta);
          crater.position.y = radius * Math.sin(phi) * Math.sin(theta);
          crater.position.z = radius * Math.cos(phi);

          crater.lookAt(0, 0, 0);

          moon.add(crater);
        }
      }
    };

    createCelestialObjects();

    if (!isMobile && !darkMode) {
      const outerSunGlowGeometry = new THREE.SphereGeometry(70, 32, 32);
      const outerSunGlowMaterial = new THREE.MeshBasicMaterial({
        color: 0xffee88,
        transparent: true,
        opacity: 0.2,
        side: THREE.BackSide,
      });
      const outerSunGlow = new THREE.Mesh(outerSunGlowGeometry, outerSunGlowMaterial);
      sun.add(outerSunGlow);
    }

    if (!isMobile && !darkMode) {
      const createSunRays = () => {
        const rayCount = 16;
        const rayLength = 60;

        for (let i = 0; i < rayCount; i++) {
          const angle = (i / rayCount) * Math.PI * 2;
          const rayGeometry = new THREE.PlaneGeometry(rayLength, i % 2 === 0 ? 3 : 2);
          const rayMaterial = new THREE.MeshBasicMaterial({
            color: 0xffdd88,
            transparent: true,
            opacity: 0.6,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
          });

          const ray = new THREE.Mesh(rayGeometry, rayMaterial);
          ray.rotation.z = angle;

          ray.position.x = Math.cos(angle) * (rayLength / 4);
          ray.position.y = Math.sin(angle) * (rayLength / 4);

          sun.add(ray);
        }
      };

      createSunRays();
    }

    if (darkMode) {
      const brightPositions = new Float32Array(Math.floor(1500 * 0.3) * 3);
      const brightSizes = new Float32Array(Math.floor(1500 * 0.3));

      for (let i = 0; i < brightPositions.length / 3; i++) {
        const i3 = i * 3;
        brightPositions[i3] = (Math.random() - 0.5) * 2000;
        brightPositions[i3 + 1] = (Math.random() - 0.5) * 2000;
        brightPositions[i3 + 2] = (Math.random() - 0.5) * 2000;
        brightSizes[i] = Math.random() * 1.5 + 1.0;
      }

      const brightGeometry = new THREE.BufferGeometry();
      brightGeometry.setAttribute('position', new THREE.BufferAttribute(brightPositions, 3));
      brightGeometry.setAttribute('size', new THREE.BufferAttribute(brightSizes, 1));

      const brightMaterial = new THREE.PointsMaterial({
        size: isMobile ? 2.5 : 2,
        transparent: true,
        opacity: 0.9,
        color: 0xffffff,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
      });

      brightStars = new THREE.Points(brightGeometry, brightMaterial);
      scene.add(brightStars);

      const dimPositions = new Float32Array(Math.floor(1500 * 0.7) * 3);
      const dimSizes = new Float32Array(Math.floor(1500 * 0.7));

      for (let i = 0; i < dimPositions.length / 3; i++) {
        const i3 = i * 3;
        dimPositions[i3] = (Math.random() - 0.5) * 2000;
        dimPositions[i3 + 1] = (Math.random() - 0.5) * 2000;
        dimPositions[i3 + 2] = (Math.random() - 0.5) * 2000;
        dimSizes[i] = Math.random() * 0.8 + 0.5;
      }

      const dimGeometry = new THREE.BufferGeometry();
      dimGeometry.setAttribute('position', new THREE.BufferAttribute(dimPositions, 3));
      dimGeometry.setAttribute('size', new THREE.BufferAttribute(dimSizes, 1));

      const dimMaterial = new THREE.PointsMaterial({
        size: isMobile ? 1.5 : 1,
        transparent: true,
        opacity: 0.7,
        color: 0xccddff,
        sizeAttenuation: true,
      });

      dimStars = new THREE.Points(dimGeometry, dimMaterial);
      scene.add(dimStars);

      const createGlowingStars = () => {
        const glowCount = isMobile ? 15 : 30;
        const starColors = [0x88ccff, 0xffaa88, 0xaaddff, 0xffcc88, 0xaaaaff];

        starColors.forEach((color) => {
          const positions = new Float32Array(glowCount * 3);
          const sizes = new Float32Array(glowCount);

          for (let i = 0; i < glowCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 1500;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 1500;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 1500;
            sizes[i] = Math.random() * 3 + 2;
          }

          const geometry = new THREE.BufferGeometry();
          geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
          geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

          const material = new THREE.PointsMaterial({
            size: isMobile ? 3 : 2.5,
            transparent: true,
            opacity: 0.8,
            color: color,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending,
          });

          const coloredStar = new THREE.Points(geometry, material);
          coloredStars.push(coloredStar);
          scene.add(coloredStar);
        });
      };

      createGlowingStars();

      const createNebula = () => {
        const geometry = new THREE.SphereGeometry(100, 8, 8);
        const material = new THREE.MeshBasicMaterial({
          color: 0x3366ff,
          transparent: true,
          opacity: 0.03,
        });

        const nebula = new THREE.Mesh(geometry, material);
        nebula.position.set(
          (Math.random() - 0.5) * 1000,
          (Math.random() - 0.5) * 1000,
          (Math.random() - 0.5) * 1000
        );
        nebulas.push(nebula);
        scene.add(nebula);
        return nebula;
      };

      const nebulaCount = isMobile ? 1 : 2;
      for (let i = 0; i < nebulaCount; i++) {
        createNebula();
      }
    } else {
      const createCloud = () => {
        const group = new THREE.Group();

        const cloudGeometries = [];
        const cloudCount = Math.floor(Math.random() * 4) + 3;

        for (let i = 0; i < cloudCount; i++) {
          const radius = Math.random() * 30 + 20;
          const segments = isMobile ? 8 : 12;
          const cloudPuff = new THREE.SphereGeometry(radius, segments, segments);

          cloudPuff.translate(
            (Math.random() - 0.5) * 60,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 30
          );

          cloudGeometries.push(cloudPuff);
        }

        const mergedGeometry = mergeGeometries(cloudGeometries);

        const hue = Math.random() * 10;
        const saturation = Math.random() * 10;
        const lightness = Math.random() * 15 + 80;

        const cloudMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color(`hsl(${210 + hue}, ${saturation}%, ${lightness}%)`),
          transparent: true,
          opacity: Math.random() * 0.3 + 0.6,
        });

        const cloud = new THREE.Mesh(mergedGeometry, cloudMaterial);

        const distance = Math.random() * 500 + 300;
        const angle = Math.random() * Math.PI * 2;
        const height = Math.random() * 200 - 50;

        cloud.position.set(
          Math.cos(angle) * distance,
          height,
          Math.sin(angle) * distance
        );

        cloud.scale.set(
          Math.random() * 0.8 + 0.7,
          Math.random() * 0.4 + 0.3,
          Math.random() * 0.8 + 0.7
        );

        cloud.rotation.set(0, Math.random() * Math.PI * 2, 0);
        cloud.speed = Math.random() * 0.05 + 0.01;

        clouds.push(cloud);
        scene.add(cloud);
        return cloud;
      };

      function mergeGeometries(geometries) {
        const merged = new THREE.BufferGeometry();

        let vertexCount = 0;
        for (const geo of geometries) {
          vertexCount += geo.attributes.position.count;
        }

        const positions = new Float32Array(vertexCount * 3);
        const normals = new Float32Array(vertexCount * 3);

        let offset = 0;
        for (const geo of geometries) {
          const geoPositions = geo.attributes.position.array;
          const geoNormals = geo.attributes.normal?.array;

          positions.set(geoPositions, offset * 3);

          if (geoNormals) {
            normals.set(geoNormals, offset * 3);
          }

          offset += geo.attributes.position.count;
        }

        merged.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        merged.setAttribute('normal', new THREE.BufferAttribute(normals, 3));

        return merged;
      }

      const createMountains = () => {
        const mountainGeometry = new THREE.BufferGeometry();
        const vertices = [];
        const mountainCount = isMobile ? 80 : 150;

        for (let i = 0; i < mountainCount; i++) {
          const angle = (i / mountainCount) * Math.PI * 2;
          const radius = 800 + Math.random() * 100;
          const height = Math.random() * 100 + 50;

          vertices.push(
            Math.cos(angle) * radius,
            height,
            Math.sin(angle) * radius
          );

          vertices.push(
            Math.cos(angle - 0.03) * (radius + 20),
            -50,
            Math.sin(angle - 0.03) * (radius + 20)
          );

          vertices.push(
            Math.cos(angle + 0.03) * (radius + 20),
            -50,
            Math.sin(angle + 0.03) * (radius + 20)
          );
        }

        mountainGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

        const mountainMaterial = new THREE.MeshBasicMaterial({
          color: 0x9fb6cc,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.7,
        });

        const mountains = new THREE.Mesh(mountainGeometry, mountainMaterial);
        scene.add(mountains);
      };

      const cloudCount = isMobile ? 8 : 15;
      for (let i = 0; i < cloudCount; i++) {
        createCloud();
      }

      createMountains();
    }

    camera.position.z = 500;

    let targetX = 0;
    let targetY = 0;

    let mouseMoveTimeout;
    let onMouseMove;

    if (!isMobile && !reducedMotion) {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;

      onMouseMove = (event) => {
        if (mouseMoveTimeout) return;

        mouseMoveTimeout = setTimeout(() => {
          targetX = (event.clientX - windowHalfX) * 0.0005;
          targetY = (event.clientY - windowHalfY) * 0.0005;
          mouseMoveTimeout = null;
        }, 150);
      };

      document.addEventListener('mousemove', onMouseMove);
    }

    let resizeTimeout;
    const handleResize = () => {
      if (!resizeTimeout) {
        resizeTimeout = setTimeout(() => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
          resizeTimeout = null;
        }, 300);
      }
    };

    window.addEventListener('resize', handleResize);

    const updateForThemeChange = () => {
      if (darkMode !== prevMode.current) {
        const duration = 1.8;
        const steps = 70;
        const interval = (duration * 1000) / steps;
        let step = 0;

        const transitionInterval = setInterval(() => {
          step++;
          const progress = step / steps;
          const easedProgress = easeInOutCubic(progress);

          if (sun) {
            sun.material.opacity = darkMode
              ? Math.max(0, 0.9 * (1 - easedProgress))
              : Math.min(0.9, 0.9 * easedProgress);

            if (sun.children[0]) {
              sun.children[0].material.opacity = darkMode
                ? Math.max(0, 0.5 * (1 - easedProgress))
                : Math.min(0.5, 0.5 * easedProgress);
            }

            for (let i = 1; i < sun.children.length; i++) {
              if (sun.children[i].material) {
                sun.children[i].material.opacity = darkMode
                  ? Math.max(0, 0.6 * (1 - easedProgress))
                  : Math.min(0.6, 0.6 * easedProgress);
              }
            }
          }

          if (moon) {
            moon.material.opacity = darkMode
              ? Math.min(0.95, 0.95 * easedProgress)
              : Math.max(0, 0.95 * (1 - easedProgress));

            if (moon.children[0]) {
              moon.children[0].material.opacity = darkMode
                ? Math.min(0.4, 0.4 * easedProgress)
                : Math.max(0, 0.4 * (1 - easedProgress));
            }

            for (let i = 1; i < moon.children.length; i++) {
              if (moon.children[i].material) {
                moon.children[i].material.opacity = darkMode
                  ? Math.min(0.7, 0.7 * easedProgress)
                  : Math.max(0, 0.7 * (1 - easedProgress));
              }
            }
          }

          if (step >= steps) {
            clearInterval(transitionInterval);
          }
        }, interval);

        prevMode.current = darkMode;
      }
    };

    function easeInOutCubic(x) {
      return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    }

    updateForThemeChange();

    let lastFrame = 0;
    const targetFrameRate = isMobile ? 20 : 25;
    const frameInterval = 1000 / targetFrameRate;

    const animate = (currentTime) => {
      requestAnimationFrame(animate);

      if (currentTime - lastFrame < frameInterval) return;
      lastFrame = currentTime;

      if (darkMode) {
        const rotationSpeed = reducedMotion ? 0.0001 : 0.0002;
        brightStars.rotation.y += rotationSpeed * 1.2;
        dimStars.rotation.y += rotationSpeed * 0.8;

        coloredStars.forEach((star) => {
          star.rotation.y += rotationSpeed * 0.9;
        });

        if (!reducedMotion) {
          brightStars.rotation.x += (targetY - brightStars.rotation.x) * 0.005;
          brightStars.rotation.y += (targetX - brightStars.rotation.y) * 0.005;

          dimStars.rotation.x += (targetY - dimStars.rotation.x) * 0.003;
          dimStars.rotation.y += (targetX - dimStars.rotation.y) * 0.003;

          nebulas.forEach((nebula) => {
            nebula.rotation.x += 0.00005;
            nebula.rotation.y += 0.0001;
          });
        }

        if (moon) {
          moon.rotation.y += 0.0005;

          if (moon.children[0]) {
            const pulseScale = 1 + Math.sin(Date.now() * 0.0008) * 0.1; // Increased pulse magnitude
            moon.children[0].scale.set(pulseScale, pulseScale, pulseScale);
          }

          moon.rotation.x = Math.sin(Date.now() * 0.0003) * 0.02;
        }
      } else {
        clouds.forEach((cloud) => {
          const x = cloud.position.x;
          const z = cloud.position.z;
          const angle = Math.atan2(z, x);
          const radius = Math.sqrt(x * x + z * z);

          const newAngle = angle + cloud.speed * 0.01;

          cloud.position.x = Math.cos(newAngle) * radius;
          cloud.position.z = Math.sin(newAngle) * radius;

          cloud.position.y += Math.sin(currentTime * 0.0005 + cloud.position.x) * 0.05;

          cloud.rotation.y += 0.0005;
        });

        if (!reducedMotion) {
          camera.position.x += (targetX * 150 - camera.position.x) * 0.02;
          camera.position.y += (targetY * 100 - camera.position.y) * 0.02;
          camera.lookAt(scene.position);
        }

        if (sun) {
          sun.rotation.y += 0.0005;

          if (sun.children[0]) {
            const pulseScale = 1 + Math.sin(Date.now() * 0.001) * 0.1;
            sun.children[0].scale.set(pulseScale, pulseScale, pulseScale);

            if (sun.children.length > 1 && sun.children[sun.children.length - 1].isMesh) {
              const outerPulseScale = 1 + Math.cos(Date.now() * 0.0008) * 0.15;
              sun.children[sun.children.length - 1].scale.set(outerPulseScale, outerPulseScale, outerPulseScale);
            }
          }

          for (let i = 1; i < sun.children.length - 1; i++) {
            if (i % 2 === 0) {
              sun.children[i].rotation.z += 0.0025;
            } else {
              sun.children[i].rotation.z -= 0.0015;
            }

            const rayScale = 1 + Math.sin(Date.now() * 0.001 + i * 0.2) * 0.1;
            sun.children[i].scale.y = rayScale;
          }
        }
      }

      renderer.render(scene, camera);
    };

    animate(0);

    return () => {
      window.removeEventListener('resize', handleResize);

      if (onMouseMove) {
        document.removeEventListener('mousemove', onMouseMove);
      }

      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });

      renderer.dispose();
    };
  }, [darkMode, reducedMotion]);

  return <div ref={containerRef} className="w-full h-full starfield-container transition-all duration-1000" />;
}
