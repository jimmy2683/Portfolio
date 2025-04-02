import { useState, useEffect, useRef } from 'react';

export default function CustomCursor({ darkMode }) {
  const cursorRef = useRef(null);
  const cursorRingRef = useRef(null);
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  // Optimization: Use refs for position tracking to avoid unnecessary rerenders
  const positionRef = useRef({ x: 0, y: 0 });
  const targetPositionRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef(null);
  const lastMoveTime = useRef(0);
  const cursorTrailsRef = useRef([]);

  useEffect(() => {
    // Check if device is touch-based - optimized for fewer operations
    const checkTouch = () => {
      const isTouch = 'ontouchstart' in window || 
        navigator.maxTouchPoints > 0 || 
        window.matchMedia('(hover: none), (pointer: coarse)').matches;
      setIsTouchDevice(isTouch);
      return isTouch;
    };
    
    if (checkTouch()) return; // Early return if touch device
    
    window.addEventListener('resize', checkTouch, { passive: true });
    
    const cursor = cursorRef.current;
    const cursorRing = cursorRingRef.current;
    
    if (!cursor || !cursorRing) return;
    
    let timeout;
    
    // Create specialized optimized SVG elements for cursor shape
    const cursorSvg = document.createElement('div');
    cursorSvg.innerHTML = darkMode ? 
      `<svg width="16" height="16" viewBox="0 0 24 24" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)">
        <path d="M12,1.5l2.61,6.727l6.89,0.542l-5.278,4.688l1.675,6.784L12,16.67l-6.896,3.571l1.675-6.784L2.5,8.769l6.89-0.542L12,1.5z" 
        fill="rgba(56, 189, 248, 0.85)" />
      </svg>` :
      `<svg width="16" height="16" viewBox="0 0 24 24" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%)">
        <path d="M22,3c-2.2,0-4,1.8-4,4c0,1,0.4,1.9,1,2.6L9,17.6C8.3,17,7.4,16.6,6.5,16.6c-2.2,0-4,1.8-4,4s1.8,4,4,4s4-1.8,4-4 c0-1-0.4-1.9-1-2.6L19,10.4c0.7,0.6,1.6,1,2.5,1c2.2,0,4-1.8,4-4S24.2,3,22,3z" 
        fill="rgba(37, 99, 235, 0.85)" />
      </svg>`;
    
    cursor.innerHTML = '';
    cursor.appendChild(cursorSvg.firstChild);
    
    // Optimization: Single RAF loop for all animations
    const updateCursorPosition = () => {
      // Smooth interpolation for cursor position
      positionRef.current.x += (targetPositionRef.current.x - positionRef.current.x) * 0.15;
      positionRef.current.y += (targetPositionRef.current.y - positionRef.current.y) * 0.15;
      
      // Apply transformation with hardware acceleration
      if (cursor && cursorRing) {
        cursor.style.transform = `translate3d(${positionRef.current.x}px, ${positionRef.current.y}px, 0) translate(-50%, -50%)`;
        cursorRing.style.transform = `translate3d(${positionRef.current.x}px, ${positionRef.current.y}px, 0) translate(-50%, -50%)`;
      }
      
      animationFrameRef.current = requestAnimationFrame(updateCursorPosition);
    };
    
    // Performance optimized event handlers
    const onMouseMove = (e) => {
      // Clear hide timeout
      if (timeout) clearTimeout(timeout);
      setIsHidden(false);
      
      // Update target position for the animation loop
      targetPositionRef.current.x = e.clientX;
      targetPositionRef.current.y = e.clientY;
      
      // Throttle pointer state checks for better performance
      const now = performance.now();
      if (now - lastMoveTime.current > 100) { // Increased throttle to 100ms for better performance
        lastMoveTime.current = now;
        
        // Get element under cursor
        const element = document.elementFromPoint(e.clientX, e.clientY);
        
        // Check if cursor should show pointer
        if (element) {
          const isPointerElement = 
            element.tagName === 'BUTTON' || 
            element.tagName === 'A' || 
            element.tagName === 'INPUT' || 
            element.tagName === 'TEXTAREA' ||
            (element.closest && (
              element.closest('button') ||
              element.closest('a')
            )) ||
            element.getAttribute('role') === 'button' ||
            window.getComputedStyle(element).cursor === 'pointer';
          
          setIsPointer(isPointerElement);
        }
      }
      
      // Set timeout to hide cursor when not moving
      timeout = setTimeout(() => {
        setIsHidden(true);
      }, 5000);
    };
    
    // Start animation loop
    animationFrameRef.current = requestAnimationFrame(updateCursorPosition);
    
    // Set initial position to center of screen
    targetPositionRef.current = { 
      x: window.innerWidth / 2, 
      y: window.innerHeight / 2 
    };
    positionRef.current = { ...targetPositionRef.current };
    
    // Add event listeners with passive flag for better performance
    document.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mousedown', () => setIsClicking(true), { passive: true });
    document.addEventListener('mouseup', () => setIsClicking(false), { passive: true });
    document.addEventListener('mouseleave', () => setIsHidden(true), { passive: true });
    document.addEventListener('mouseenter', () => setIsHidden(false), { passive: true });
    
    // Cleanup function
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      clearTimeout(timeout);
      
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', () => setIsClicking(true));
      document.removeEventListener('mouseup', () => setIsClicking(false));
      document.removeEventListener('mouseleave', () => setIsHidden(true));
      document.removeEventListener('mouseenter', () => setIsHidden(false));
      window.removeEventListener('resize', checkTouch);
    };
  }, [darkMode]);

  // Don't render on touch devices
  if (isTouchDevice) return null;

  return (
    <>
      <div 
        ref={cursorRef} 
        className={`fixed pointer-events-none z-[99999] ${isPointer ? 'w-6 h-6' : 'w-5 h-5'} 
                   ${isClicking ? 'scale-75' : ''} 
                   ${isHidden ? 'opacity-0' : 'opacity-100'}`}
        style={{
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0) translate(-50%, -50%)'
        }}
      />
      <div 
        ref={cursorRingRef} 
        className={`fixed pointer-events-none z-[99998] rounded-full border
                   ${isPointer ? 'w-12 h-12 border-2' : 'w-10 h-10 border'} 
                   ${isClicking ? 'scale-90' : ''} 
                   ${isHidden ? 'opacity-0' : 'opacity-100'}`}
        style={{
          borderColor: darkMode ? 'rgba(56, 189, 248, 0.5)' : 'rgba(37, 99, 235, 0.5)',
          backgroundColor: 'transparent',
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0) translate(-50%, -50%)',
          transition: 'width 0.2s, height 0.2s, border 0.2s, opacity 0.3s, transform 0.1s'
        }}
      />
    </>
  );
}
