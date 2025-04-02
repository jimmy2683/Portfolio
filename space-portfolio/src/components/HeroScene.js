import { useRef, useEffect, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function HeroScene({ darkMode, activeSection, onNavigate, isHome = false }) {
  const containerRef = useRef();
  const [message, setMessage] = useState('');
  const prevActiveSection = useRef(activeSection);
  
  // Add refs to store objects we need to interact with outside the hook
  const speechBubbleRef = useRef(null);
  const sceneRef = useRef(null);
  const hoveredMarkerRef = useRef(null);

  // Define message update function outside of useEffect
  const updateMessage = useCallback((newMessage) => {
    setMessage(newMessage);
  }, []);

  // Handle section change and message display
  const handleSectionChange = useCallback(() => {
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
      if (speechBubbleRef.current) {
        speechBubbleRef.current.visible = true;
      }
      updateMessage(getSectionMessage(activeSection));

      setTimeout(() => {
        if (speechBubbleRef.current) {
          speechBubbleRef.current.visible = false;
        }
        updateMessage('');
      }, 5000);

      prevActiveSection.current = activeSection;
    }
  }, [activeSection, isHome, updateMessage]);

  useEffect(() => {
    // Store the current value of the ref in a variable that can be safely used in cleanup
    const currentContainer = containerRef.current;

    // Check if we're on a mobile device
    const isMobile = window.innerWidth < 768;
    const isSmallScreen = window.innerWidth < 1024;

    // Create scene with optimized settings
    const scene = new THREE.Scene();
    sceneRef.current = scene;

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

    // Adjust astronaut scale based on home/non-home
    const baseScale = isHome ? 1 : 0.8;
    const astronautScale = isSmallScreen ? (isMobile ? baseScale * 0.7 : baseScale * 0.85) : baseScale;

    // Create astronaut with appropriate detail levels
    const astronaut = new THREE.Group();
    astronaut.scale.set(astronautScale, astronautScale, astronautScale);
    scene.add(astronaut);

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
    
    // Store reference to speech bubble for use outside the effect
    speechBubbleRef.current = speechBubble;

    // Mouse move handler that doesn't involve React state updates
    const onMouseMove = (event) => {
      const rect = containerRef.current.getBoundingClientRect();
      const mouse = new THREE.Vector2();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      // Check for intersections with navigation markers
      const navMarkers = [];
      const intersects = raycaster.intersectObjects(navMarkers);

      if (intersects.length > 0) {
        const intersected = intersects[0].object;
        if (intersected.userData && intersected.userData.isNavPoint) {
          if (hoveredMarkerRef.current !== intersected) {
            // Unhover previous marker if exists
            if (hoveredMarkerRef.current) {
              hoveredMarkerRef.current.scale.set(1, 1, 1);

              const navLabels = {};
              if (navLabels[hoveredMarkerRef.current.userData.id]) {
                navLabels[hoveredMarkerRef.current.userData.id].element.style.opacity = '0';
                setTimeout(() => {
                  if (navLabels[hoveredMarkerRef.current.userData.id]) {
                    navLabels[hoveredMarkerRef.current.userData.id].element.style.display = 'none';
                  }
                }, 300);
                navLabels[hoveredMarkerRef.current.userData.id].visible = false;
              }

              // Hide speech bubble without using React state inside useEffect
              if (speechBubbleRef.current) {
                speechBubbleRef.current.visible = false;
              }

              // Update React state safely outside of useEffect
              requestAnimationFrame(() => {
                updateMessage('');
              });
            }

            // Hover new marker
            hoveredMarkerRef.current = intersected;
            intersected.scale.set(1.3, 1.3, 1.3);

            if (navLabels[hoveredMarkerRef.current.userData.id]) {
              navLabels[hoveredMarkerRef.current.userData.id].element.style.display = 'block';
              setTimeout(() => {
                if (navLabels[hoveredMarkerRef.current.userData.id]) {
                  navLabels[hoveredMarkerRef.current.userData.id].element.style.opacity = '1';
                }
              }, 10);
              navLabels[hoveredMarkerRef.current.userData.id].visible = true;
            }

            // Show speech bubble without using React state inside useEffect
            if (speechBubbleRef.current) {
              speechBubbleRef.current.visible = true;
            }

            // Update React state safely outside of useEffect
            requestAnimationFrame(() => {
              updateMessage(intersected.userData.message || '');
            });

            // Change cursor
            containerRef.current.style.cursor = 'pointer';
          }
        }
      } else if (hoveredMarkerRef.current) {
        // Unhover if mouse not over any marker
        hoveredMarkerRef.current.scale.set(1, 1, 1);

        const navLabels = {};
        if (navLabels[hoveredMarkerRef.current.userData.id]) {
          navLabels[hoveredMarkerRef.current.userData.id].element.style.opacity = '0';
          setTimeout(() => {
            if (navLabels[hoveredMarkerRef.current.userData.id]) {
              navLabels[hoveredMarkerRef.current.userData.id].element.style.display = 'none';
            }
          }, 300);
          navLabels[hoveredMarkerRef.current.userData.id].visible = false;
        }

        // Hide speech bubble without using React state inside useEffect
        if (speechBubbleRef.current) {
          speechBubbleRef.current.visible = false;
        }

        // Update React state safely outside of useEffect
        requestAnimationFrame(() => {
          updateMessage('');
        });

        hoveredMarkerRef.current = null;
        containerRef.current.style.cursor = 'auto';
      }
    };

    // Attach event listener
    currentContainer.addEventListener('mousemove', onMouseMove);

    // Call section change handler after scene setup
    handleSectionChange();

    // Cleanup function
    return () => {
      currentContainer.removeEventListener('mousemove', onMouseMove);

      // Reset refs
      speechBubbleRef.current = null;
      hoveredMarkerRef.current = null;

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
  }, [darkMode, handleSectionChange, updateMessage, isHome, onNavigate]);

  // Update handling for active section changes outside useEffect
  useEffect(() => {
    handleSectionChange();
  }, [activeSection, handleSectionChange]);

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
