import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';

export default function ProjectCard({ project, index, darkMode }) {
  const [showDetails, setShowDetails] = useState(false);
  const [imageError, setImageError] = useState(false);
  const cardRef = useRef(null);
  const modalRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [modalAnimation, setModalAnimation] = useState('');
  const [modalReady, setModalReady] = useState(false);
  const [glowEffects, setGlowEffects] = useState([]);
  const [cardCenter, setCardCenter] = useState({ x: 0, y: 0 });
  const [modalMousePosition, setModalMousePosition] = useState({ x: 0, y: 0 });
  const [showEntranceEffect, setShowEntranceEffect] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateYMax = Math.min(10, rect.width / 30);
      const rotateXMax = Math.min(10, rect.height / 30);

      const rotateX = ((y - centerY) / centerY) * -rotateXMax;
      const rotateY = ((x - centerX) / centerX) * rotateYMax;

      setRotation({ x: rotateX, y: rotateY });

      const parallaxX = ((x / rect.width) - 0.5) * 35;
      const parallaxY = ((y / rect.height) - 0.5) * 35;
      setMousePosition({ x: parallaxX, y: parallaxY });

      const card = cardRef.current;
      const glowX = (x / rect.width) * 100;
      const glowY = (y / rect.height) * 100;

      if (card) {
        card.style.setProperty('--glow-x', `${glowX}%`);
        card.style.setProperty('--glow-y', `${glowY}%`);
      }
    };

    const handleMouseLeave = () => {
      setTimeout(() => {
        setRotation({ x: 0, y: 0 });
      }, 100);
      setMousePosition({ x: 0, y: 0 });
    };

    const card = cardRef.current;
    if (card && window.innerWidth > 768) {
      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (card && window.innerWidth > 768) {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  useEffect(() => {
    setModalReady(true);

    const generateGlowEffects = () => {
      const effects = [];
      const count = Math.floor(Math.random() * 3) + 4;

      for (let i = 0; i < count; i++) {
        effects.push({
          id: i,
          size: Math.random() * 80 + 40,
          x: Math.random() * 120 - 10,
          y: Math.random() * 120 - 10,
          opacity: Math.random() * 0.4 + 0.2,
          blur: Math.random() * 50 + 30,
          delay: Math.random() * 0.5,
          duration: Math.random() * 1.5 + 1.5
        });
      }

      setGlowEffects(effects);
    };

    generateGlowEffects();
  }, []);

  const handleClick = (e) => {
    e.stopPropagation();

    if (!showDetails) {
      const rect = cardRef.current.getBoundingClientRect();
      setCardCenter({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      });

      setModalAnimation('modal-open');
      setShowDetails(true);
      setShowEntranceEffect(true);
      document.body.style.overflow = 'hidden';

      setTimeout(() => {
        setShowEntranceEffect(false);
      }, 2000);

      document.dispatchEvent(new CustomEvent('closeAllModals', {
        detail: { except: index }
      }));
    } else {
      handleCloseModal();
    }
  };

  const handleModalMouseMove = (e) => {
    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setModalMousePosition({ x, y });
    }
  };

  const handleCloseModal = () => {
    setModalAnimation('modal-close');
    setTimeout(() => {
      setShowDetails(false);
      document.body.style.overflow = '';
    }, 300);
  };

  useEffect(() => {
    const closeModalHandler = (e) => {
      if (e.detail.except !== index && showDetails) {
        handleCloseModal();
      }
    };

    document.addEventListener('closeAllModals', closeModalHandler);

    return () => {
      document.removeEventListener('closeAllModals', closeModalHandler);
    };
  }, [showDetails, index]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showDetails && modalRef.current && !modalRef.current.contains(e.target)) {
        if (e.target.classList.contains('modal-overlay')) {
          handleCloseModal();
        }
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape' && showDetails) {
        handleCloseModal();
      }
    };

    if (showDetails) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [showDetails]);

  const handleImageError = () => {
    setImageError(true);
  };

  const gradients = darkMode ? [
    'from-blue-400 to-cyan-300',
    'from-purple-400 to-pink-300',
    'from-green-400 to-teal-300',
    'from-yellow-400 to-orange-300',
    'from-indigo-400 to-purple-300',
    'from-red-400 to-pink-300'
  ] : [
    'from-blue-600 to-cyan-500',
    'from-purple-600 to-pink-500',
    'from-green-600 to-teal-500',
    'from-yellow-600 to-orange-500',
    'from-indigo-600 to-purple-500',
    'from-red-600 to-pink-500'
  ];

  const getPlaceholderImage = () => {
    const colors = darkMode ? 
      ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500', 'bg-teal-500'] :
      ['bg-blue-600', 'bg-purple-600', 'bg-green-600', 'bg-yellow-600', 'bg-red-600', 'bg-teal-600'];
      
    return (
      <div className={`w-full h-full flex items-center justify-center ${colors[index % colors.length]}`}>
        <div className="text-white text-2xl font-bold">{project.title.split(' ')[0]}</div>
      </div>
    );
  };

  return (
    <div 
      ref={cardRef}
      className="relative w-full h-full cursor-pointer group transition-all duration-300 perspective-1000"
      onClick={handleClick}
    >
      <div 
        className={`w-full h-full backdrop-blur-sm ${
          darkMode ? 'bg-white/5 border-white/10' : 'bg-white/30 border-blue-200/40'
        } rounded-2xl overflow-hidden p-4 sm:p-6 transition-all duration-500 flex flex-col
          hover:shadow-lg ${darkMode ? 'hover:border-cyan-400/30' : 'hover:border-blue-400/40'} border
          transform hover:scale-[1.02] card-3d shine-bg`}
        style={{
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          transition: 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1.0)',
          backgroundPosition: 'var(--glow-x, 50%) var(--glow-y, 50%)'
        }}
      >
        <div className="absolute inset-0 z-0 overflow-hidden rounded-2xl">
          <div 
            className={`absolute inset-0 bg-gradient-radial from-transparent ${
              darkMode ? 'via-white/5 to-transparent' : 'via-blue-100/20 to-transparent'
            } opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
            style={{
              transformOrigin: 'var(--glow-x, 50%) var(--glow-y, 50%)',
              backgroundPosition: 'var(--glow-x, 50%) var(--glow-y, 50%)'
            }}
          ></div>
          
          <div 
            className={`absolute inset-0 bg-gradient-to-br transition-transform duration-200 ease-out ${
              darkMode 
                ? 'from-blue-900/20 via-purple-900/10 to-black/0' 
                : 'from-blue-200/40 via-indigo-100/20 to-white/0'
            }`}
            style={{
              transform: `translateX(${mousePosition.x}px) translateY(${mousePosition.y}px)`
            }}
          ></div>
          
          <div 
            className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 transition-all duration-200 ease-out ${
              darkMode ? 'bg-cyan-400' : 'bg-blue-400'
            } card-layer-2`}
            style={{
              transform: `translateX(${-mousePosition.x * 0.7}px) translateY(${-mousePosition.y * 0.7}px)`,
              filter: `blur(${15 + Math.abs(mousePosition.x) * 0.08}px)`,
              opacity: 0.15 + Math.abs(mousePosition.x) * 0.001
            }}
          ></div>
          
          <div 
            className={`absolute -bottom-20 -left-10 w-40 h-40 rounded-full blur-3xl opacity-10 transition-all duration-200 ease-out ${
              darkMode ? 'bg-purple-500' : 'bg-indigo-400'
            } card-layer-1`}
            style={{
              transform: `translateX(${mousePosition.x * 0.5}px) translateY(${mousePosition.y * 0.5}px)`,
              filter: `blur(${15 + Math.abs(mousePosition.y) * 0.08}px)`,
              opacity: 0.1 + Math.abs(mousePosition.y) * 0.001
            }}
          ></div>
        </div>
        
        <div 
          className={`absolute top-2 right-2 w-3 h-3 rounded-full transition-all duration-300 ${
            darkMode ? 'bg-cyan-400/80' : 'bg-blue-500/80'
          } card-beacon z-10 card-layer-3`}
          style={{
            transform: `translateX(${-mousePosition.x * 0.15}px) translateY(${-mousePosition.y * 0.15}px)`,
            boxShadow: `0 0 ${Math.abs(mousePosition.x * 0.3) + 6}px 2px ${darkMode ? '#22d3ee' : '#3b82f6'}`,
            opacity: 0.7 + Math.abs((mousePosition.x + mousePosition.y) * 0.001)
          }}
        ></div>
        
        <h3 
          className={`text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${gradients[index % gradients.length]} mb-1 sm:mb-2 relative z-10 card-layer-3`}
          style={{
            transform: `translateZ(15px) translateX(${mousePosition.x * 0.03}px) translateY(${mousePosition.y * 0.03}px)`,
            textShadow: darkMode ? '0 2px 8px rgba(0,0,0,0.5)' : '0 2px 8px rgba(0,0,0,0.2)'
          }}
        >
          {project.title}
        </h3>
        
        <p 
          className={`${darkMode ? 'text-white/80' : 'text-blue-900/90'} text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-2 relative z-10 card-layer-2`}
          style={{
            transform: `translateZ(10px) translateX(${mousePosition.x * 0.02}px) translateY(${mousePosition.y * 0.02}px)`
          }}
        >
          {project.description}
        </p>
        
        <div 
          className="flex-grow relative mt-1 sm:mt-2 overflow-hidden rounded-lg min-h-[120px] z-10 card-image-container card-layer-2"
          style={{
            transform: `translateZ(25px) translateX(${mousePosition.x * 0.05}px) translateY(${mousePosition.y * 0.05}px)`,
            boxShadow: darkMode ? 
              `0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 8px -2px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.05)` :
              `0 10px 15px -3px rgba(0, 0, 0, 0.15), 0 4px 8px -2px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(59, 130, 246, 0.1)`,
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
          }}
        >
          <div 
            className={`absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10`}
            style={{
              transform: `translateX(${mousePosition.x * 0.05}px) translateY(${mousePosition.y * 0.05}px)`
            }}
          />
          
          <div 
            className={`absolute inset-0 opacity-40 bg-gradient-to-tr ${
              darkMode ? 'from-purple-600/30' : 'from-blue-500/30'
            } to-transparent z-10`}
            style={{
              transform: `translateX(${mousePosition.x * 0.1}px) translateY(${mousePosition.y * 0.1}px)`
            }}
          ></div>
          
          {imageError ? (
            getPlaceholderImage()
          ) : (
            <div className="w-full h-full relative overflow-hidden">
              <Image 
                src={project.image}
                alt={project.title}
                width={400}
                height={300}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                onError={handleImageError}
                priority={index < 3}
                style={{
                  transform: `translateX(${mousePosition.x * 0.15}px) translateY(${mousePosition.y * 0.15}px) scale(1.05)`,
                  filter: darkMode ? 'brightness(0.95)' : 'brightness(1.05)'
                }}
              />
              
              <div 
                className={`absolute inset-0 opacity-0 bg-gradient-to-tr from-transparent ${
                  darkMode ? 'via-cyan-500/20' : 'via-blue-300/30'
                } to-transparent transition-opacity duration-300 group-hover:opacity-100 z-20 shine-overlay`}
                style={{
                  backgroundPosition: `${50 + mousePosition.x * 0.1}% ${50 + mousePosition.y * 0.1}%`
                }}
              ></div>
            </div>
          )}
        </div>
        
        <div 
          className="mt-3 sm:mt-4 flex flex-wrap gap-1 sm:gap-2 relative z-10 card-layer-3"
          style={{
            transform: `translateZ(20px) translateX(${mousePosition.x * 0.04}px) translateY(${mousePosition.y * 0.04}px)`
          }}
        >
          {project.tech.slice(0, 3).map((tech, i) => (
            <span 
              key={i} 
              className={`px-2 py-0.5 rounded-full text-xs ${
                darkMode ? 'bg-white/10 text-white/90' : 'bg-blue-100/80 text-blue-800'
              } transform transition-all group-hover:scale-105 tech-tag-3d`}
              style={{ 
                transitionDelay: `${i * 50}ms`,
                transform: `translateY(${mousePosition.y * 0.01}px) scale(1)`,
                boxShadow: darkMode ? 
                  '0 2px 4px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05)' : 
                  '0 2px 4px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(37, 99, 235, 0.1)'
              }}
            >
              {tech}
            </span>
          ))}
          
          {project.tech.length > 3 && (
            <span 
              className={`px-2 py-0.5 rounded-full text-xs ${
                darkMode ? 'bg-white/10 text-white/90' : 'bg-blue-100/80 text-blue-800'
              } tech-tag-3d`}
              style={{
                transitionDelay: '150ms',
                transform: `translateY(${mousePosition.y * 0.01}px) scale(1)`,
                boxShadow: darkMode ? 
                  '0 2px 4px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.05)' : 
                  '0 2px 4px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(37, 99, 235, 0.1)'
              }}
            >
              +{project.tech.length - 3}
            </span>
          )}
        </div>
      </div>
      
      {modalReady && showDetails && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 modal-overlay">
          {showEntranceEffect && (
            <div className="fixed inset-0 z-[10001] pointer-events-none">
              <div className="absolute h-[300vh] w-[300vh] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                {glowEffects.map((effect) => (
                  <div
                    key={effect.id}
                    className={`absolute rounded-full ${darkMode ? 'bg-cyan-400' : 'bg-blue-400'} modal-entrance-glow`}
                    style={{
                      width: effect.size + 'px',
                      height: effect.size + 'px',
                      left: `calc(50% - ${effect.size/2}px + ${(modalMousePosition.x - 50) * 0.5}px)`,
                      top: `calc(50% - ${effect.size/2}px + ${(modalMousePosition.y - 50) * 0.5}px)`,
                      opacity: effect.opacity,
                      filter: `blur(${effect.blur}px)`,
                      animation: `modalGlowExpand ${effect.duration}s cubic-bezier(0.17, 0.67, 0.32, 1.25) ${effect.delay}s forwards`,
                      transform: 'scale(0)',
                      zIndex: 10 - effect.id
                    }}
                  ></div>
                ))}
              </div>
              
              <div 
                className={`absolute rounded-full ${darkMode ? 'bg-gradient-radial from-cyan-400/50 via-blue-500/20 to-transparent' : 'bg-gradient-radial from-blue-400/50 via-blue-500/20 to-transparent'}`} 
                style={{
                  width: '20px',
                  height: '20px',
                  left: cardCenter.x + 'px',
                  top: cardCenter.y + 'px',
                  transform: 'translate(-50%, -50%)',
                  animation: 'modalCenterGlow 1s cubic-bezier(0.17, 0.67, 0.32, 1.25) forwards'
                }}
              ></div>
            </div>
          )}

          <div 
            className={`absolute inset-0 transition-colors duration-500 ${
              darkMode ? 'bg-black/80' : 'bg-blue-900/60'
            } backdrop-blur-md modal-overlay`}
            onClick={handleCloseModal}
          />
          <div 
            ref={modalRef}
            className={`relative z-[10000] transition-all duration-500 ${
              darkMode ? 'bg-gray-900/90 border-white/20' : 'bg-white/90 border-blue-200/50'
            } border rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-auto p-4 sm:p-6 shadow-2xl shine-bg project-modal-content ${modalAnimation} transform-gpu modal-content-3d`}
            style={{
              transformOrigin: 'center center',
              scrollbarWidth: 'thin',
              scrollbarColor: darkMode ? 
                'rgba(56, 189, 248, 0.5) rgba(15, 23, 42, 0.3)' : 
                'rgba(37, 99, 235, 0.5) rgba(219, 234, 254, 0.5)'
            }}
            onMouseMove={handleModalMouseMove}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`absolute top-0 left-0 w-full h-full pointer-events-none rounded-2xl transition-opacity duration-500 ${
              darkMode ? 'shine-effect opacity-60' : 'shine-effect opacity-40'
            }`}></div>
            
            <div 
              className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
              style={{
                background: `radial-gradient(circle at ${modalMousePosition.x}% ${modalMousePosition.y}%, ${
                  darkMode ? 'rgba(56, 189, 248, 0.15)' : 'rgba(59, 130, 246, 0.1)'
                }, transparent 70%)`,
                opacity: 0.8,
                zIndex: 1
              }}
            ></div>
            
            <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-transparent via-transparent to-transparent pointer-events-none rounded-t-2xl overflow-hidden">
              <div 
                className={`w-96 h-96 rounded-full blur-3xl opacity-30 absolute -top-20 -right-20 animate-pulse-slow ${
                  darkMode ? 'bg-cyan-500' : 'bg-blue-400'
                }`}
                style={{
                  transform: `translateX(${(modalMousePosition.x - 50) * -0.3}px) translateY(${(modalMousePosition.y - 50) * -0.3}px)`
                }}
              ></div>
              <div 
                className={`w-96 h-96 rounded-full blur-3xl opacity-20 absolute -top-40 -left-20 animate-pulse-slow animation-delay-2000 ${
                  darkMode ? 'bg-purple-500' : 'bg-indigo-400'
                }`}
                style={{
                  transform: `translateX(${(modalMousePosition.x - 50) * 0.2}px) translateY(${(modalMousePosition.y - 50) * 0.2}px)`
                }}
              ></div>
            </div>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleCloseModal();
              }}
              className={`absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full modal-close-btn ${
                darkMode ? 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white' : 
                'bg-blue-100/70 text-blue-700/70 hover:bg-blue-200/80 hover:text-blue-800'
              } transform transition-all hover:rotate-90 hover:scale-110 active:scale-95`}
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            
            <h2 
              className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${gradients[index % gradients.length]} mb-4 animate-fade-in modal-section modal-title relative z-10`}
              style={{
                transform: `translateZ(20px) translateX(${(modalMousePosition.x - 50) * 0.03}px) translateY(${(modalMousePosition.y - 50) * 0.03}px)`,
                textShadow: darkMode ? '0 0 15px rgba(56, 189, 248, 0.5)' : '0 0 15px rgba(37, 99, 235, 0.3)'
              }}
            >
              {project.title}
            </h2>
            
            <div 
              className="aspect-video mb-6 rounded-lg overflow-hidden relative shadow-lg animate-fade-in modal-image-container"
              style={{
                transform: `translateZ(10px) translateX(${(modalMousePosition.x - 50) * 0.02}px) translateY(${(modalMousePosition.y - 50) * 0.02}px)`,
                boxShadow: darkMode ? 
                  '0 20px 30px -10px rgba(0, 0, 0, 0.7), 0 0 15px rgba(56, 189, 248, 0.15)' : 
                  '0 20px 30px -10px rgba(0, 0, 0, 0.2), 0 0 15px rgba(37, 99, 235, 0.15)'
              }}
            >
              <div className={`absolute -inset-0.5 rounded-lg ${darkMode ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30' : 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20'} z-0 blur-sm`}></div>
              
              <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-tr from-blue-500/10 to-purple-500/10' : 'bg-gradient-to-tr from-blue-500/10 to-purple-500/10'} z-10 pointer-events-none`}></div>
              
              {imageError ? (
                getPlaceholderImage()
              ) : (
                <div className="relative w-full h-full transform transition-transform hover:scale-[1.02] duration-700 ease-out">
                  <Image 
                    src={project.image}
                    alt={project.title}
                    width={1200}
                    height={675}
                    className="object-cover w-full h-full"
                    onError={handleImageError}
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20"></div>
                  
                  <div 
                    className={`absolute inset-0 bg-gradient-radial from-transparent via-transparent to-transparent transition-opacity duration-300 opacity-0 group-hover:opacity-100`}
                    style={{
                      background: `radial-gradient(circle at ${modalMousePosition.x}% ${modalMousePosition.y}%, ${
                        darkMode ? 'rgba(56, 189, 248, 0.2)' : 'rgba(59, 130, 246, 0.15)'
                      }, transparent 50%)`
                    }}
                  ></div>
                </div>
              )}
            </div>
            
            <div 
              className={`space-y-5 ${darkMode ? 'text-white/90' : 'text-blue-900'} relative z-20 modal-section`}
              style={{
                transform: `translateZ(15px) translateX(${(modalMousePosition.x - 50) * 0.01}px) translateY(${(modalMousePosition.y - 50) * 0.01}px)`,
              }}
            >
              <div className={`absolute inset-0 ${darkMode ? 'bg-black/10' : 'bg-white/20'} backdrop-blur-[1px] rounded-lg -z-10`}></div>
              
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-white/5 hover:bg-white/8' : 'bg-blue-50/50 hover:bg-blue-50/70'} transition-all duration-300 hover:shadow-lg`}
                style={{
                  transform: 'translateZ(5px)',
                  boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px'
                }}
              >
                <h3 className={`text-lg font-medium mb-3 ${darkMode ? 'text-cyan-300' : 'text-blue-700'}`}>
                  Project Overview
                </h3>
                <p className={`leading-relaxed ${darkMode ? 'text-white/95' : 'text-blue-900/95'} font-medium whitespace-pre-line`}>
                  {project.details || project.description}
                </p>
              </div>
              
              <div 
                className={`p-4 rounded-lg ${
                  darkMode ? 'bg-white/5 hover:bg-white/8' : 'bg-blue-50/50 hover:bg-blue-50/70'
                } border-l-4 ${
                  darkMode ? 'border-cyan-500/50' : 'border-blue-500/50'
                } transition-all duration-300 hover:shadow-lg`}
                style={{
                  transform: 'translateZ(5px)',
                  boxShadow: 'rgba(0, 0, 0, 0.08) 0px 4px 12px'
                }}
              >
                <p className="leading-relaxed italic">
                  This project showcases my skills in creating innovative and effective solutions while maintaining high standards of performance, usability, and code quality.
                </p>
              </div>
            </div>
            
            <div 
              className="mt-8 pt-5 border-t border-dashed border-opacity-40 border-current modal-section"
              style={{
                transform: `translateZ(15px) translateX(${(modalMousePosition.x - 50) * 0.015}px) translateY(${(modalMousePosition.y - 50) * 0.015}px)`,
              }}
            >
              <h3 className={`text-lg font-medium ${darkMode ? 'text-cyan-400' : 'text-blue-700'} mb-3`}>
                Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tech.map((tech, i) => (
                  <span 
                    key={i} 
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      darkMode ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-blue-100 text-blue-800 hover:bg-blue-200/80'
                    } transform transition-all hover:scale-110 hover:-translate-y-1 hover:rotate-1 shadow-sm tech-badge hover-glow`}
                    style={{ 
                      transitionDelay: `${i * 30}ms`,
                      animationDelay: `${i * 100}ms`,
                      transform: `translateZ(${20 + i * 5}px)`,
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            
            <div 
              className="mt-8 sm:mt-10 flex flex-wrap gap-3 sm:gap-4 modal-section"
              style={{
                transform: `translateZ(25px) translateX(${(modalMousePosition.x - 50) * 0.02}px) translateY(${(modalMousePosition.y - 50) * 0.02}px)`
              }}
            >
              <button 
                className={`px-3 sm:px-4 py-2 bg-gradient-to-r rounded-lg text-white font-medium ${
                  darkMode ? 'from-blue-500 to-purple-600' : 'from-blue-600 to-purple-700'
                } transform hover:scale-[1.05] active:scale-95 transition-transform text-sm sm:text-base shadow-md hover:shadow-lg button-3d`}
                style={{
                  boxShadow: darkMode ? 
                    '0 0 15px rgba(56, 189, 248, 0.3), 0 4px 6px rgba(0, 0, 0, 0.2)' : 
                    '0 0 15px rgba(37, 99, 235, 0.2), 0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
              >
                <span className="relative z-10">View Project</span>
              </button>
              
              <button 
                className={`px-3 sm:px-4 py-2 border rounded-lg font-medium ${
                  darkMode ? 'bg-white/10 border-white/20 text-white hover:bg-white/15' : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100/80'
                } transform hover:scale-[1.05] active:scale-95 transition-transform text-sm sm:text-base button-3d`}
                style={{
                  boxShadow: darkMode ? 
                    '0 0 10px rgba(255, 255, 255, 0.1), 0 2px 4px rgba(0, 0, 0, 0.2)' : 
                    '0 0 10px rgba(37, 99, 235, 0.1), 0 2px 4px rgba(0, 0, 0, 0.05)'
                }}
              >
                <span className="relative z-10">View Source Code</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
