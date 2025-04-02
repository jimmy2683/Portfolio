import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function HeroScene({ darkMode, activeSection, onNavigate, isHome = false }) {
  const containerRef = useRef();
  const [message, setMessage] = useState('');
  const prevActiveSection = useRef(activeSection);

  useEffect(() => {
    // Store the current value of the ref in a variable that can be safely used in cleanup
    const currentContainer = containerRef.current;

    // Check if we're on a mobile device
    const isMobile = window.innerWidth < 768;
    const isSmallScreen = window.innerWidth < 1024;

    // Create scene with optimized settings
    const scene = new THREE.Scene();

    // Adjust camera FOV based on section and screen size
    const fov = isHome ? (isMobile ? 70 : 65) : (isMobile ? 60 : 55);
    const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Optimize renderer settings
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      precision: isMobile ? 'lowp' : 'mediump',
      powerPreference: 'high-performance'
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5));
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // Add lights - adjust for better light mode visibility
    const ambientLight = new THREE.AmbientLight(darkMode ? 0xffffff : 0xeeeeee, isMobile ? 0.7 : 0.5);
    scene.add(ambientLight);

    if (!isMobile) {
      const directionalLight = new THREE.DirectionalLight(darkMode ? 0x00aaff : 0x4477ff, darkMode ? 1 : 1.2);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      const pointLight = new THREE.PointLight(darkMode ? 0x3366ff : 0x4488ff, darkMode ? 2 : 1.5, 100);
      pointLight.position.set(0, 10, 10);
      scene.add(pointLight);
    }

    // Position camera - adjustments for home vs non-home
    camera.position.z = isHome ? (isSmallScreen ? 5.5 : 5) : (isSmallScreen ? 4.5 : 4);

    // Adjust astronaut scale based on home/non-home
    const baseScale = isHome ? 1 : 0.8;
    const astronautScale = isSmallScreen ? (isMobile ? baseScale * 0.7 : baseScale * 0.85) : baseScale;

    // Create astronaut with appropriate detail levels
    const astronaut = new THREE.Group();
    astronaut.scale.set(astronautScale, astronautScale, astronautScale);
    scene.add(astronaut);

    // Adjust navigation points positioning based on home/non-home
    const navScale = isHome ? 1 : 0.9;
    const navigationPoints = [
      {
        id: 'home',
        position: new THREE.Vector3(0, 1.8 * astronautScale * navScale, 0),
        name: 'Home',
        message: isHome ? 'Welcome to my cosmic portfolio!' : 'Return to main view'
      },
      {
        id: 'projects',
        position: new THREE.Vector3(2.2 * astronautScale * navScale, 0, 0),
        name: 'Projects',
        message: 'Check out my ongoing projects!'
      },
      {
        id: 'about',
        position: new THREE.Vector3(-2.2 * astronautScale * navScale, 0, 0),
        name: 'About',
        message: 'Learn more about me!'
      },
      {
        id: 'contact',
        position: new THREE.Vector3(0, -1.8 * astronautScale * navScale, 0),
        name: 'Contact',
        message: 'Let\'s connect!'
      }
    ];

    const navMarkers = [];
    const navLabels = {};
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredMarker = null;

    // Main astronaut body components
    if (isMobile) {
      // Simple body for mobile
      const bodyGeometry = new THREE.CapsuleGeometry(0.5, 0.8, 4, 6);
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: darkMode ? 0xffffff : 0xdddddd,
        metalness: darkMode ? 0.2 : 0.4,
        roughness: darkMode ? 0.8 : 0.6
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      astronaut.add(body);

      // Simple helmet
      const helmetGeometry = new THREE.SphereGeometry(0.4, 16, 16);
      const helmetMaterial = new THREE.MeshBasicMaterial({
        color: darkMode ? 0x222222 : 0x333333,
        opacity: darkMode ? 1 : 0.8,
        transparent: !darkMode
      });
      const helmet = new THREE.Mesh(helmetGeometry, helmetMaterial);
      helmet.position.y = 0.7;
      astronaut.add(helmet);

      // Simple backpack
      const backpackGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.3);
      const backpackMaterial = new THREE.MeshBasicMaterial({
        color: darkMode ? 0x333333 : 0x444444,
      });
      const backpack = new THREE.Mesh(backpackGeometry, backpackMaterial);
      backpack.position.z = -0.4;
      astronaut.add(backpack);
    } else {
      // Create detailed astronaut for desktop
      // Body
      const bodyGeometry = new THREE.CapsuleGeometry(0.5, 0.8, 4, 8);
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: darkMode ? 0xffffff : 0xdddddd,
        metalness: darkMode ? 0.3 : 0.45,
        roughness: darkMode ? 0.6 : 0.5
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      astronaut.add(body);

      // Helmet
      const helmetGeometry = new THREE.SphereGeometry(0.4, 24, 24);
      const helmetMaterial = new THREE.MeshPhysicalMaterial({
        color: darkMode ? 0x222222 : 0x333333,
        metalness: 0.1,
        roughness: 0.2,
        transmission: 0.9,
        thickness: 0.2,
        envMapIntensity: 1,
        clearcoat: 1,
        clearcoatRoughness: 0.1
      });
      const helmet = new THREE.Mesh(helmetGeometry, helmetMaterial);
      helmet.position.y = 0.7;
      astronaut.add(helmet);

      // Face
      const faceGeometry = new THREE.SphereGeometry(0.3, 16, 16);
      const faceMaterial = new THREE.MeshStandardMaterial({
        color: 0x222222,
        emissive: darkMode ? 0x3366ff : 0x2255cc,
        emissiveIntensity: darkMode ? 0.5 : 0.7
      });
      const face = new THREE.Mesh(faceGeometry, faceMaterial);
      face.position.y = 0.7;
      astronaut.add(face);

      // Create arms
      const createArm = (isLeft) => {
        const armGroup = new THREE.Group();

        // Upper arm
        const upperArmGeometry = new THREE.CapsuleGeometry(0.15, 0.4, 4, 8);
        const upperArm = new THREE.Mesh(upperArmGeometry, bodyMaterial);
        upperArm.position.y = -0.2;
        armGroup.add(upperArm);

        // Lower arm
        const lowerArmGeometry = new THREE.CapsuleGeometry(0.13, 0.35, 4, 8);
        const lowerArm = new THREE.Mesh(lowerArmGeometry, bodyMaterial);
        lowerArm.position.y = -0.6;
        armGroup.add(lowerArm);

        // Glove
        const gloveGeometry = new THREE.SphereGeometry(0.15, 16, 16);
        const gloveMaterial = new THREE.MeshStandardMaterial({
          color: darkMode ? 0xffffff : 0xeeeeee,
          metalness: 0.2,
          roughness: 0.3
        });
        const glove = new THREE.Mesh(gloveGeometry, gloveMaterial);
        glove.position.y = -0.9;
        armGroup.add(glove);

        // Position the arm
        armGroup.position.x = isLeft ? -0.6 : 0.6;
        armGroup.position.y = 0.2;

        // Rotate arm
        armGroup.rotation.z = isLeft ? Math.PI / 8 : -Math.PI / 8;

        return armGroup;
      };

      const leftArm = createArm(true);
      const rightArm = createArm(false);

      astronaut.add(leftArm);
      astronaut.add(rightArm);

      // Create legs
      const createLeg = (isLeft) => {
        const legGroup = new THREE.Group();

        // Upper leg
        const upperLegGeometry = new THREE.CapsuleGeometry(0.18, 0.5, 4, 8);
        const upperLeg = new THREE.Mesh(upperLegGeometry, bodyMaterial);
        upperLeg.position.y = -0.25;
        legGroup.add(upperLeg);

        // Lower leg
        const lowerLegGeometry = new THREE.CapsuleGeometry(0.16, 0.4, 4, 8);
        const lowerLeg = new THREE.Mesh(lowerLegGeometry, bodyMaterial);
        lowerLeg.position.y = -0.7;
        legGroup.add(lowerLeg);

        // Boot
        const bootGeometry = new THREE.BoxGeometry(0.25, 0.15, 0.25);
        const bootMaterial = new THREE.MeshStandardMaterial({
          color: darkMode ? 0x333333 : 0x222222,
          metalness: 0.5,
          roughness: 0.7
        });
        const boot = new THREE.Mesh(bootGeometry, bootMaterial);
        boot.position.y = -1;
        boot.position.z = 0.05;
        legGroup.add(boot);

        // Position the leg
        legGroup.position.x = isLeft ? -0.22 : 0.22;
        legGroup.position.y = -0.5;

        return legGroup;
      };

      const leftLeg = createLeg(true);
      const rightLeg = createLeg(false);

      astronaut.add(leftLeg);
      astronaut.add(rightLeg);

      // Create backpack (oxygen tank)
      const backpackGeometry = new THREE.CapsuleGeometry(0.3, 0.8, 4, 8);
      const backpackMaterial = new THREE.MeshStandardMaterial({
        color: darkMode ? 0x333333 : 0x444444,
        metalness: 0.7,
        roughness: 0.3
      });
      const backpack = new THREE.Mesh(backpackGeometry, backpackMaterial);
      backpack.position.z = -0.5;
      backpack.rotation.x = Math.PI / 2;
      astronaut.add(backpack);

      // Add badge
      const badgeGeometry = new THREE.CircleGeometry(0.1, 16);
      const badgeMaterial = new THREE.MeshBasicMaterial({
        color: darkMode ? 0xff3333 : 0xdd3333,
        side: THREE.DoubleSide,
        opacity: darkMode ? 1 : 0.9,
        transparent: !darkMode
      });
      const badge = new THREE.Mesh(badgeGeometry, badgeMaterial);
      badge.position.set(0, 0.3, 0.51);
      astronaut.add(badge);
    }

    // Create speech bubble for astronaut
    const createSpeechBubble = () => {
      const group = new THREE.Group();

      // Create the base bubble
      const bubbleGeometry = new THREE.SphereGeometry(0.4, 16, 16);
      bubbleGeometry.scale(1.5, 1, 0.8);
      const bubbleMaterial = new THREE.MeshBasicMaterial({
        color: darkMode ? 0x00aaff : 0x3388ff,
        transparent: true,
        opacity: darkMode ? 0.6 : 0.7,
        side: THREE.DoubleSide
      });
      const bubble = new THREE.Mesh(bubbleGeometry, bubbleMaterial);
      bubble.position.set(0.8, 1.1, 0.5);

      // Create the little tail for the bubble
      const tailGeometry = new THREE.ConeGeometry(0.15, 0.3, 8);
      const tail = new THREE.Mesh(tailGeometry, bubbleMaterial);
      tail.position.set(0.5, 0.9, 0.5);
      tail.rotation.z = Math.PI / 4;

      group.add(bubble);
      group.add(tail);
      group.visible = false; // Hidden initially

      return group;
    };

    const speechBubble = createSpeechBubble();
    astronaut.add(speechBubble);

    // Create navigation hologram markers
    navigationPoints.forEach(point => {
      // Create marker
      const markerGeometry = new THREE.SphereGeometry(0.15, 16, 16);
      const markerMaterial = new THREE.MeshBasicMaterial({
        color: point.id === activeSection ? (darkMode ? 0x00ffff : 0x0066cc) : (darkMode ? 0x3366ff : 0x2288dd),
        transparent: true,
        opacity: darkMode ? 0.7 : 0.8,
        blending: THREE.AdditiveBlending
      });

      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.copy(point.position);
      marker.userData = {
        id: point.id,
        isNavPoint: true,
        message: point.message
      };
      scene.add(marker);
      navMarkers.push(marker);

      // Create holographic ring for marker
      const ringGeometry = new THREE.RingGeometry(0.2, 0.25, 32);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: point.id === activeSection ? (darkMode ? 0x00ffff : 0x0066cc) : (darkMode ? 0x3366ff : 0x2288dd),
        transparent: true,
        opacity: darkMode ? 0.5 : 0.6,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
      });

      const navRing = new THREE.Mesh(ringGeometry, ringMaterial);
      navRing.position.copy(point.position);
      navRing.lookAt(camera.position);
      navRing.userData = { id: point.id };
      scene.add(navRing);

      // Create glowing outer ring for active marker
      if (point.id === activeSection) {
        const outerRingGeometry = new THREE.RingGeometry(0.3, 0.32, 32);
        const outerRingMaterial = new THREE.MeshBasicMaterial({
          color: darkMode ? 0x00ffff : 0x0066cc,
          transparent: true,
          opacity: darkMode ? 0.4 : 0.5,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending
        });

        const outerRing = new THREE.Mesh(outerRingGeometry, outerRingMaterial);
        outerRing.position.copy(point.position);
        outerRing.lookAt(camera.position);
        outerRing.userData = { id: point.id, isOuterRing: true };
        scene.add(outerRing);
      }

      // Text label using HTML
      if (!isMobile) {
        const labelDiv = document.createElement('div');
        labelDiv.className = `absolute pointer-events-none text-sm font-semibold opacity-0 transition-opacity duration-300 px-2 py-1 rounded-md backdrop-blur-sm ${darkMode ? 'text-cyan-400 bg-black/40' : 'text-blue-700 bg-white/60 border border-blue-200'}`;
        labelDiv.textContent = point.name;
        labelDiv.style.display = 'none';

        containerRef.current.appendChild(labelDiv);
        navLabels[point.id] = {
          element: labelDiv,
          position: point.position.clone(),
          visible: false
        };
      }
    });

    // Add holo ring around astronaut
    const ringGeometry = new THREE.RingGeometry(1.5 * astronautScale, 1.7 * astronautScale, isMobile ? 32 : 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: darkMode ? 0x00ffff : 0x0088dd,
      transparent: true,
      opacity: darkMode ? 0.5 : 0.6,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -1 * astronautScale;
    scene.add(ring);

    // Add particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = isMobile ? 80 : 160; // Reduced particle count for performance
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = (1.5 + Math.random() * 2) * astronautScale;

      particlePositions[i * 3] = Math.cos(angle) * radius;
      particlePositions[i * 3 + 1] = (Math.random() * 4 - 2) * astronautScale;
      particlePositions[i * 3 + 2] = Math.sin(angle) * radius;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      color: darkMode ? 0x00ffff : 0x4488ee,
      size: isMobile ? 0.08 : 0.05,
      transparent: true,
      opacity: darkMode ? 0.7 : 0.8,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Optimize controls based on section
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isMobile && isHome; // Only enable damping on desktop home view
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.autoRotate = isHome; // Only auto-rotate on home section
    controls.autoRotateSpeed = isMobile ? 0.3 : 0.5;

    // Event handling for interactive markers
    const onMouseMove = (event) => {
      // Calculate mouse position in normalized device coordinates (-1 to +1)
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Update raycaster
      raycaster.setFromCamera(mouse, camera);

      // Check for intersections with navigation points
      const intersects = raycaster.intersectObjects(navMarkers);

      if (intersects.length > 0) {
        const intersected = intersects[0].object;
        if (intersected.userData.isNavPoint) {
          if (hoveredMarker !== intersected) {
            // Unhover previous marker if exists
            if (hoveredMarker) {
              hoveredMarker.scale.set(1, 1, 1);

              if (navLabels[hoveredMarker.userData.id]) {
                navLabels[hoveredMarker.userData.id].element.style.opacity = '0';
                setTimeout(() => {
                  if (navLabels[hoveredMarker.userData.id]) {
                    navLabels[hoveredMarker.userData.id].element.style.display = 'none';
                  }
                }, 300);
                navLabels[hoveredMarker.userData.id].visible = false;
              }

              // Hide speech bubble when leaving a marker
              speechBubble.visible = false;
              setMessage('');
            }

            // Hover new marker
            hoveredMarker = intersected;
            hoveredMarker.scale.set(1.3, 1.3, 1.3);

            if (navLabels[hoveredMarker.userData.id]) {
              navLabels[hoveredMarker.userData.id].element.style.display = 'block';
              setTimeout(() => {
                if (navLabels[hoveredMarker.userData.id]) {
                  navLabels[hoveredMarker.userData.id].element.style.opacity = '1';
                }
              }, 10);
              navLabels[hoveredMarker.userData.id].visible = true;
            }

            // Show speech bubble with message
            speechBubble.visible = true;
            setMessage(hoveredMarker.userData.message || '');

            // Change cursor
            containerRef.current.style.cursor = 'pointer';
          }
        }
      } else if (hoveredMarker) {
        // Unhover if mouse not over any marker
        hoveredMarker.scale.set(1, 1, 1);

        if (navLabels[hoveredMarker.userData.id]) {
          navLabels[hoveredMarker.userData.id].element.style.opacity = '0';
          setTimeout(() => {
            if (navLabels[hoveredMarker.userData.id]) {
              navLabels[hoveredMarker.userData.id].element.style.display = 'none';
            }
          }, 300);
          navLabels[hoveredMarker.userData.id].visible = false;
        }

        // Hide speech bubble
        speechBubble.visible = false;
        setMessage('');

        hoveredMarker = null;
        containerRef.current.style.cursor = 'auto';
      }
    };

    const onClick = (event) => {
      // Only process clicks if we've detected a hovered marker
      if (hoveredMarker && hoveredMarker.userData.isNavPoint) {
        onNavigate(hoveredMarker.userData.id);
      }
    };

    // Touch event for mobile
    const onTouchStart = (event) => {
      // Convert touch to mouse position
      const touch = event.touches[0];
      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((touch.clientY - rect.top) / rect.height) * 2 + 1;

      // Update raycaster
      raycaster.setFromCamera(mouse, camera);

      // Check for intersections
      const intersects = raycaster.intersectObjects(navMarkers);

      if (intersects.length > 0) {
        const intersected = intersects[0].object;
        if (intersected.userData.isNavPoint) {
          // Show speech bubble with message briefly
          speechBubble.visible = true;
          setMessage(intersected.userData.message || '');

          // Navigate after a short delay
          setTimeout(() => {
            onNavigate(intersected.userData.id);
          }, 300);

          // Hide speech bubble after navigation
          setTimeout(() => {
            speechBubble.visible = false;
            setMessage('');
          }, 1500);
        }
      }
    };

    // Add event listeners
    containerRef.current.addEventListener('mousemove', onMouseMove);
    containerRef.current.addEventListener('click', onClick);
    containerRef.current.addEventListener('touchstart', onTouchStart);

    // Custom handler to update marker state based on active section
    const updateActiveSection = () => {
      scene.traverse(object => {
        if (object.userData && object.userData.id) {
          const isActive = object.userData.id === activeSection;

          if (object.userData.isNavPoint) {
            object.material.color.set(isActive ? (darkMode ? 0x00ffff : 0x0066cc) : (darkMode ? 0x3366ff : 0x2288dd));
            object.material.opacity = isActive ? (darkMode ? 0.9 : 0.95) : (darkMode ? 0.7 : 0.8);
            if (!hoveredMarker || hoveredMarker !== object) {
              object.scale.set(isActive ? 1.2 : 1, isActive ? 1.2 : 1, isActive ? 1.2 : 1);
            }
          } else if (!object.userData.isOuterRing) {
            object.material.color.set(isActive ? (darkMode ? 0x00ffff : 0x0066cc) : (darkMode ? 0x3366ff : 0x2288dd));
            object.material.opacity = isActive ? (darkMode ? 0.7 : 0.8) : (darkMode ? 0.5 : 0.6);
          }

          // Remove any existing outer ring
          if (object.userData.isOuterRing && !isActive) {
            scene.remove(object);
          }

          // Add outer ring for active marker if it doesn't exist
          if (isActive && object.userData.isNavPoint && !scene.children.some(c => c.userData && c.userData.id === object.userData.id && c.userData.isOuterRing)) {
            const outerRingGeometry = new THREE.RingGeometry(0.3, 0.32, 32);
            const outerRingMaterial = new THREE.MeshBasicMaterial({
              color: darkMode ? 0x00ffff : 0x0066cc,
              transparent: true,
              opacity: darkMode ? 0.4 : 0.5,
              side: THREE.DoubleSide,
              blending: THREE.AdditiveBlending
            });

            const outerRing = new THREE.Mesh(outerRingGeometry, outerRingMaterial);
            outerRing.position.copy(object.position);
            outerRing.lookAt(camera.position);
            outerRing.userData = { id: object.userData.id, isOuterRing: true };
            scene.add(outerRing);
          }
        }
      });

      // Show welcome message when returning to home section
      const getSectionMessage = (section) => {
        switch (section) {
          case 'home': return "Welcome to my cosmic portfolio! Explore using the markers around me.";
          case 'projects': return "These are my latest projects. Each card has interactive elements!";
          case 'about': return "Want to know more about me? You're in the right place!";
          case 'contact': return "Let's connect! I'd love to hear from you.";
          default: return "";
        }
      };

      if (isHome || activeSection !== prevActiveSection.current) {
        speechBubble.visible = true;
        setMessage(getSectionMessage(activeSection));

        setTimeout(() => {
          speechBubble.visible = false;
          setMessage('');
        }, 5000);

        prevActiveSection.current = activeSection;
      }
    };

    // Initial update
    updateActiveSection();

    // Debounce resize events
    let resizeTimeout;
    const handleResize = () => {
      if (!resizeTimeout) {
        resizeTimeout = setTimeout(() => {
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);

          // Update HTML labels positions
          updateLabelsPosition();

          // Update astronaut scale based on new screen size
          const newIsMobile = window.innerWidth < 768;
          const newIsSmallScreen = window.innerWidth < 1024;
          const newScale = newIsSmallScreen ? (newIsMobile ? baseScale * 0.7 : baseScale * 0.85) : baseScale;

          astronaut.scale.set(newScale, newScale, newScale);
          camera.position.z = newIsSmallScreen ? (isHome ? 5.5 : 4.5) : (isHome ? 5 : 4);

          resizeTimeout = null;
        }, 100);
      }
    };

    window.addEventListener('resize', handleResize);

    // Update HTML label positions on each frame
    const updateLabelsPosition = () => {
      for (const id in navLabels) {
        if (navLabels[id].visible) {
          const position = navLabels[id].position.clone();
          position.project(camera);

          const widthHalf = window.innerWidth / 2;
          const heightHalf = window.innerHeight / 2;

          const x = (position.x * widthHalf) + widthHalf;
          const y = -(position.y * heightHalf) + heightHalf;

          navLabels[id].element.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
        }
      }
    };

    // Animation loop with frame limiting
    let lastFrame = 0;
    const targetFramerate = isMobile ? 20 : (isHome ? 30 : 25); // Adjusted framerate for home/non-home
    const frameInterval = 1000 / targetFramerate;
    const clock = new THREE.Clock();

    const animate = (currentTime) => {
      requestAnimationFrame(animate);

      // Throttle animation updates
      if (currentTime - lastFrame < frameInterval) return;
      lastFrame = currentTime;

      const delta = clock.getDelta();

      // Update astronaut animations - REDUCED movement for better performance
      astronaut.position.y = Math.sin(Date.now() * 0.0008) * 0.08; // Slower, reduced movement
      astronaut.rotation.y += 0.002; // Reduced rotation speed

      // Animate arms only if not mobile - reduced frequency
      if (!isMobile && astronaut.children.length > 3) {
        const leftArm = astronaut.children[2];
        const rightArm = astronaut.children[3];
        if (leftArm && rightArm) {
          leftArm.rotation.x = Math.sin(Date.now() * 0.001) * 0.08; // Slower, reduced movement
          rightArm.rotation.x = Math.sin(Date.now() * 0.001 + 1) * 0.08;
        }
      }

      // Animate speech bubble when visible - reduced movement
      if (speechBubble.visible) {
        speechBubble.rotation.y = Math.sin(Date.now() * 0.0015) * 0.08;
        speechBubble.position.y = astronaut.position.y + Math.sin(Date.now() * 0.0015 + 1) * 0.03;
      }

      // Animate navigation markers - reduced movement
      scene.traverse(object => {
        if (object.userData && object.userData.isNavPoint) {
          const index = navMarkers.indexOf(object);
          if (index >= 0) {
            // Add floating animation to markers - reduced movement
            const floatOffset = index * (Math.PI / 2);
            object.position.y = navigationPoints[index].position.y + Math.sin(Date.now() * 0.0008 + floatOffset) * 0.03;

            // Pulse active marker - reduced intensity
            if (object.userData.id === activeSection) {
              object.material.opacity = (darkMode ? 0.7 : 0.8) + Math.sin(Date.now() * 0.002) * 0.2;
            }
          }
        } else if (object.userData && object.userData.isOuterRing) {
          // Rotate outer rings - reduced speed
          object.rotation.z += 0.006;
          object.scale.x = 1 + Math.sin(Date.now() * 0.0015) * 0.08;
          object.scale.y = 1 + Math.sin(Date.now() * 0.0015) * 0.08;
        }
      });

      // Animate ring - reduced movement
      ring.rotation.z += 0.003;
      ring.scale.x = 1 + Math.sin(Date.now() * 0.0008) * 0.08;
      ring.scale.y = 1 + Math.sin(Date.now() * 0.0008) * 0.08;

      // Animate particles - reduced speed
      particles.rotation.y += isMobile ? 0.0003 : 0.0006;

      // Update label positions
      updateLabelsPosition();

      controls.update();
      renderer.render(scene, camera);
    };

    animate(0);

    // Effect for active section changes
    const updateForActiveSection = () => {
      updateActiveSection();
    };

    updateForActiveSection();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      currentContainer?.removeEventListener('mousemove', onMouseMove);
      currentContainer?.removeEventListener('click', onClick);
      currentContainer?.removeEventListener('touchstart', onTouchStart);

      // Remove all HTML labels
      for (const id in navLabels) {
        navLabels[id].element.remove();
      }

      // Dispose resources
      scene.traverse(object => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });

      renderer.dispose();
    };
  }, [darkMode, activeSection, onNavigate, isHome]);

  // Enhanced speech bubble UI
  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />

      {/* Enhanced Speech Bubble with improved visibility in both themes */}
      {message && (
        <div className={`absolute right-12 top-1/4 transform -translate-y-1/2 px-4 py-3 rounded-xl backdrop-blur-md border max-w-xs animate-fade-in z-10 hidden sm:block
          ${darkMode ? 'bg-blue-500/30 border-blue-400/50 text-white' : 'bg-blue-400/50 border-blue-300/70 text-blue-900'}
        `}>
          <span className="text-sm font-medium">{message}</span>
          <div className={`absolute -bottom-2 left-8 w-4 h-4 transform rotate-45
            ${darkMode ? 'bg-blue-500/30 border-blue-400/50' : 'bg-blue-400/50 border-blue-300/70'}
            border-b border-r
          `}></div>
        </div>
      )}
    </div>
  );
}
