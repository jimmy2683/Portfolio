"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import CustomCursor from "../components/CustomCursor";

// Dynamically import only the necessary Three.js components
const StarfieldBackground = dynamic(() => import("../components/StarfieldBackground"), { 
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-[#050815]"></div>
});
const ProjectCard = dynamic(() => import("../components/ProjectCard"), { ssr: false });

// Helper for image loading error handling
function ImageWithFallback({ src, alt, ...props }) {
  const [imgError, setImgError] = useState(false);
  
  const getPlaceholderGradient = () => {
    // Create consistent color based on alt text
    const hash = alt.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    const gradients = [
      'bg-gradient-to-r from-blue-500 to-cyan-500',
      'bg-gradient-to-r from-purple-500 to-pink-500',
      'bg-gradient-to-r from-green-500 to-teal-500',
      'bg-gradient-to-r from-yellow-500 to-orange-500',
      'bg-gradient-to-r from-indigo-500 to-purple-500',
      'bg-gradient-to-r from-red-500 to-pink-500',
    ];
    return gradients[hash % gradients.length];
  };

  return imgError ? (
    <div className={`flex items-center justify-center w-full h-full ${getPlaceholderGradient()}`}>
      <span className="text-white font-bold text-lg">{alt.charAt(0).toUpperCase()}</span>
    </div>
  ) : (
    <Image {...props} src={src} alt={alt} onError={() => setImgError(true)} />
  );
}

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState("home");
  const [isMounted, setIsMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [floatingElements, setFloatingElements] = useState([]);
  const [cursorTrails, setCursorTrails] = useState([]);

  const sectionRefs = {
    home: useRef(null),
    projects: useRef(null),
    about: useRef(null),
    contact: useRef(null),
  };

  useEffect(() => {
    setIsMounted(true);
    
    // Set up intersection observers to detect active section
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -80% 0px',
      threshold: 0
    };
    
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    Object.keys(sectionRefs).forEach(key => {
      if (sectionRefs[key].current) {
        observer.observe(sectionRefs[key].current);
      }
    });
    
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    // Generate random floating elements for visual effect
    if (isMounted) {
      const elements = [];
      const shapes = ['circle', 'square', 'triangle', 'ring'];
      const count = window.innerWidth < 768 ? 6 : 12;
      
      for (let i = 0; i < count; i++) {
        elements.push({
          id: i,
          shape: shapes[Math.floor(Math.random() * shapes.length)],
          size: Math.random() * 60 + 20,
          x: Math.random() * 100,
          y: Math.random() * 100,
          duration: Math.random() * 20 + 30,
          delay: Math.random() * 5
        });
      }
      
      setFloatingElements(elements);
    }
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted || window.innerWidth < 768) return;
    
    // Add custom-cursor-active class to html
    document.documentElement.classList.add('custom-cursor-active');
    
    let trailTimeout;
    let lastMousePos = { x: 0, y: 0 };
    let trails = [];
    
    const createCursorTrail = (clientX, clientY) => {
      // Check if moved enough to create a new trail
      const dist = Math.sqrt(
        Math.pow(clientX - lastMousePos.x, 2) + 
        Math.pow(clientY - lastMousePos.y, 2)
      );
      
      if (dist < 20) return;
      
      lastMousePos = { x: clientX, y: clientY };
      
      // Create new trail
      const trail = {
        id: Date.now(),
        x: clientX,
        y: clientY,
        opacity: 0.5
      };
      
      trails = [...trails, trail];
      
      // Keep only last 10 trails
      if (trails.length > 10) {
        trails = trails.slice(trails.length - 10);
      }
      
      setCursorTrails([...trails]);
      
      // Fade out trail
      setTimeout(() => {
        trails = trails.filter(t => t.id !== trail.id);
        setCursorTrails([...trails]);
      }, 500);
    };
    
    const handleMouseMove = (e) => {
      clearTimeout(trailTimeout);
      
      createCursorTrail(e.clientX, e.clientY);
      
      trailTimeout = setTimeout(() => {
        setCursorTrails([]);
      }, 800);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.classList.remove('custom-cursor-active');
      clearTimeout(trailTimeout);
    };
  }, [isMounted]);

  useEffect(() => {
    // Add custom cursor activation class to HTML element
    if (isMounted && !window.matchMedia('(hover: none)').matches && !window.matchMedia('(pointer: coarse)').matches) {
      document.documentElement.classList.add('custom-cursor-active');
      
      return () => {
        document.documentElement.classList.remove('custom-cursor-active');
      };
    }
  }, [isMounted]);

  // Toggle dark/light theme
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Handle navigation
  const handleNavigate = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      // Scroll to section
      section.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  // Projects data
  const projects = [
    {
      title: "VR-VISIT 🚀",
      description: "Blueprint-to-VR converter for architectural visualization",
      image: "/vr-visit.jpg",
      tech: ["Unity", "VR", "3D Modeling", "Architecture"],
      details: "VR-VISIT transforms architectural blueprints into immersive virtual reality experiences, allowing clients to explore buildings before they're constructed. Currently overcoming budget constraints and hardware limitations to deliver impressive visualization capabilities.\n\nThis solution bridges the gap between technical blueprints and client understanding by providing a fully immersive environment where clients can walk through their future spaces, making informed decisions about layout, design, and functionality before construction begins."
    },
    {
      title: "Skibbrizz 🎥",
      description: "Social media app with innovative 'rizz points' reward system",
      image: "/skibbrizz.jpg",
      tech: ["Next.js", "Express.js", "Go", "PostgreSQL", "ShadCN", "Tailwind CSS"],
      details: "Skibbrizz is a feature-rich social platform where users can post content, watch videos, and write blogs. The unique 'rizz points' system rewards engagement and quality content. Built with scalability in mind, using a hybrid backend approach with Express.js and Go.\n\nThe platform uses a modern tech stack with Next.js for the frontend, Express.js for rapid API development, and Go microservices for high-performance operations like content recommendation and user analytics."
    },
    {
      title: "AINexus 🤖",
      description: "AI recommendation engine for finding the perfect AI tools",
      image: "/ainexus.jpg",
      tech: ["AI/ML", "Next.js", "API Integration", "UI/UX"],
      details: "AINexus aims to become a unicorn startup by helping users navigate the overwhelming world of AI tools. The recommendation system matches specific needs with the most appropriate AI solutions, featuring a modern ChatGPT-like interface."
    },
    {
      title: "Smart Traffic App 🚦",
      description: "Hacko Fiesta project integrating smart parking & traffic management",
      image: "/smart-traffic.jpg",
      tech: ["Web Tech", "AI/ML", "Python", "Geospatial Mapping"],
      details: "Developed during Hacko Fiesta, this comprehensive solution combines smart parking, geospatial mapping, adaptive traffic lights, and AI-based traffic management to create more efficient urban mobility."
    },
    {
      title: "Job Portal System 💼",
      description: "Structured job listings platform with advanced database features",
      image: "/job-portal.jpg",
      tech: ["Go", "PostgreSQL", "RESTful API"],
      details: "A high-performance job portal backend built with Go and PostgreSQL, featuring pagination, database triggers, stored procedures, and transactions for efficient job listings management and search."
    },
    {
      title: "DDR Simulator UI 🎮",
      description: "Flutter-based UI for a Dance Dance Revolution simulator",
      image: "/ddr-simulator.jpg",
      tech: ["Flutter", "ESP32", "UI/UX", "Hardware Integration"],
      details: "A structured Flutter application providing the user interface for a Dance Dance Revolution simulator. Currently focused on UI development while awaiting ESP32 hardware for full integration."
    }
  ];

  // Add class for light/dark mode to apply CSS variables
  const themeClass = darkMode ? 'dark-mode' : 'light-mode';

  return (
    <div className={`${darkMode ? 'dark bg-[#050815]' : 'bg-[#e6f0ff]'} min-h-screen overflow-x-hidden transition-colors duration-500 ${themeClass}`}>
      {/* Custom cursor - ensure it's rendered for non-mobile devices */}
      {isMounted && !window.matchMedia('(hover: none)').matches && (
        <CustomCursor darkMode={darkMode} />
      )}
      
      {/* Cursor trails */}
      {cursorTrails.map(trail => (
        <div
          key={trail.id}
          className="cursor-trail"
          style={{
            left: `${trail.x}px`,
            top: `${trail.y}px`,
            opacity: trail.opacity
          }}
        ></div>
      ))}

      {/* Starfield Background with class for theme-specific styles */}
      <div className="fixed inset-0 z-0 starfield-container">
        {isMounted && <StarfieldBackground darkMode={darkMode} reducedMotion={false} />}
      </div>
      
      {/* Floating 3D Elements - Updated for fixed animations */}
      <div className="fixed inset-0 z-[1] pointer-events-none">
        {floatingElements.map((el) => (
          <div 
            key={el.id} 
            className={`absolute transform floating-element ${
              el.shape === 'circle' ? 'rounded-full' : 
              el.shape === 'square' ? 'rounded-md' :
              el.shape === 'triangle' ? 'triangle' : 'ring'
            }`}
            style={{
              width: el.size,
              height: el.size,
              left: `${el.x}%`,
              top: `${el.y}%`,
              animationDuration: `${el.duration}s`,
              animationDelay: `${el.delay}s`,
              animationIterationCount: 'infinite',
              animationTimingFunction: 'ease-in-out',
              border: el.shape === 'ring' 
                ? `2px solid ${darkMode ? 'rgba(56, 189, 248, 0.3)' : 'rgba(49, 130, 206, 0.3)'}` 
                : 'none',
              background: el.shape === 'ring' 
                ? 'transparent' 
                : darkMode 
                  ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.1), rgba(168, 85, 247, 0.1))'
                  : 'linear-gradient(135deg, rgba(49, 130, 206, 0.1), rgba(139, 92, 246, 0.1))',
              boxShadow: darkMode 
                ? '0 4px 12px rgba(56, 189, 248, 0.07)'
                : '0 4px 12px rgba(49, 130, 206, 0.07)',
            }}
          />
        ))}
      </div>
      
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 py-4 flex justify-between items-center backdrop-blur-md ${darkMode ? 'bg-black/20 border-white/10' : 'bg-white/30 border-blue-200/30'} border-b`}>
        <div className="flex items-center gap-2">
          <span className={`text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${darkMode ? 'from-blue-400 to-purple-600' : 'from-blue-600 to-purple-800'}`}>
            Karan Gupta
          </span>
        </div>
        
        <div className="hidden md:flex gap-6 lg:gap-8">
          {["home", "projects", "about", "contact"].map((item) => (
            <button 
              key={item}
              onClick={() => handleNavigate(item)}
              className={`nav-item relative px-2 py-1 uppercase tracking-wider text-sm font-medium transition-colors ${
                activeSection === item 
                  ? (darkMode ? 'text-cyan-400' : 'text-blue-700') 
                  : (darkMode ? 'text-white/80 hover:text-white' : 'text-blue-900/80 hover:text-blue-900')
              }`}
            >
              {activeSection === item && (
                <span className={`absolute inset-x-0 bottom-0 h-0.5 ${darkMode ? 'bg-cyan-400' : 'bg-blue-600'} rounded-full`} />
              )}
              {item}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Theme toggle with improved animation */}
          <button 
            onClick={toggleTheme}
            className={`w-12 h-12 rounded-full flex items-center justify-center theme-toggle ${
              darkMode 
                ? 'bg-white/10 border-white/20 hover:bg-white/15' 
                : 'bg-white/40 border-blue-200/50 hover:bg-blue-100/60'
            } backdrop-blur-lg border transition-all duration-500`}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <div className="relative w-7 h-7">
              {/* Sun icon */}
              <div className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
                darkMode ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-7 w-7 ${darkMode ? 'text-yellow-200' : 'text-yellow-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={darkMode ? 1 : 2} 
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
                  />
                </svg>
              </div>
              {/* Moon icon */}
              <div className={`absolute inset-0 transition-all duration-700 ease-in-out transform ${
                darkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-7 w-7 ${darkMode ? 'text-blue-300' : 'text-blue-800'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={darkMode ? 2 : 1} 
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
                  />
                </svg>
              </div>
            </div>
          </button>
          
          <button 
            className={`md:hidden w-10 h-10 rounded-full flex flex-col items-center justify-center gap-1 ${darkMode ? 'bg-white/10 border-white/20' : 'bg-white/40 border-blue-200/50'} backdrop-blur-lg border`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className={`w-5 h-0.5 ${darkMode ? 'bg-white' : 'bg-blue-900'} transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
            <span className={`w-5 h-0.5 ${darkMode ? 'bg-white' : 'bg-blue-900'} transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-5 h-0.5 ${darkMode ? 'bg-white' : 'bg-blue-900'} transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
          </button>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`fixed inset-0 z-50 ${darkMode ? 'bg-black/90' : 'bg-blue-900/80'} backdrop-blur-md pt-20 pb-8 px-6`}>
          <div className="flex flex-col h-full">
            <div className="flex flex-col gap-6">
              {["home", "projects", "about", "contact"].map((item) => (
                <button 
                  key={item}
                  onClick={() => {
                    handleNavigate(item);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-3 rounded-lg text-left text-lg font-medium ${
                    activeSection === item 
                      ? (darkMode ? 'bg-white/10 text-cyan-400' : 'bg-white/20 text-blue-300')
                      : 'text-white/80'
                  }`}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </button>
              ))}
            </div>
            
            <div className="mt-auto flex justify-center gap-4">
              {[
                { name: "GitHub", icon: "/github.svg", url: "#" },
                { name: "LinkedIn", icon: "/linkedin.svg", url: "#" },
                { name: "Twitter", icon: "/twitter.svg", url: "#" },
                { name: "Instagram", icon: "/instagram.svg", url: "#" }
              ].map((social) => (
                <a 
                  key={social.name}
                  href={social.url}
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20"
                  aria-label={`Visit my ${social.name}`}
                >
                  <Image
                    src={social.icon}
                    alt={social.name}
                    width={24}
                    height={24}
                    className="text-white"
                  />
                </a>
              ))}
            </div>
            
            {/* Close button */}
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center bg-white/10"
              aria-label="Close menu"
            >
              <span className="text-xl text-white">✕</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 pt-20 sm:pt-28 pb-20">
        {/* Hero Section with 3D tilt effect */}
        <section 
          id="home" 
          ref={sectionRefs.home} 
          className="min-h-[90vh] flex flex-col items-center justify-center relative py-10 perspective-1000"
        >
          <div className="transform transition-all duration-1000 hover:rotate-x-1 hover:rotate-y-1 w-full max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-center mb-6 relative z-10">
              <span className={`inline-block animate-pulse-slow bg-clip-text text-transparent bg-gradient-to-r ${darkMode ? 'from-cyan-400 via-blue-500 to-purple-600' : 'from-blue-600 via-blue-500 to-purple-800'}`}>
                Karan Gupta
              </span>
            </h1>
            
            <div className="h-6 overflow-hidden mb-10 z-10 w-full sm:w-auto">
              <p className={`typewriter text-lg sm:text-xl text-center ${darkMode ? 'text-white/90' : 'text-blue-900'} max-w-xs sm:max-w-none`}>
                Exploring the universe of code 🚀
              </p>
            </div>
          </div>
          
          {/* Hero buttons with 3D press effect */}
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            {["projects", "about", "contact"].map((section) => (
              <button
                key={section}
                onClick={() => handleNavigate(section)}
                className={`px-6 py-2.5 rounded-lg ${
                  darkMode 
                    ? 'bg-white/10 text-white hover:bg-white/20 border-white/20' 
                    : 'bg-blue-100/70 text-blue-900 hover:bg-blue-200/70 border-blue-200'
                } border transition-all hover:shadow-lg transform hover:-translate-y-1 active:translate-y-0 active:shadow-inner`}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Social icons with proper styling and 3D hover */}
          <div className="w-full max-w-md mx-auto mt-16 flex justify-center space-x-6">
            {[
              { name: "GitHub", icon: "/github.svg", url: "#", color: darkMode ? "#ffffff" : "#333333" },
              { name: "LinkedIn", icon: "/linkedin.svg", url: "#", color: darkMode ? "#ffffff" : "#0077b5" },
              { name: "Twitter", icon: "/twitter.svg", url: "#", color: darkMode ? "#ffffff" : "#1DA1F2" },
              { name: "Instagram", icon: "/instagram.svg", url: "#", color: darkMode ? "#ffffff" : "#E4405F" }
            ].map((social) => (
              <a 
                key={social.name}
                href={social.url}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 transform perspective-500 ${
                  darkMode 
                    ? 'bg-white/10 hover:bg-white/20 hover:rotate-y-12 hover:shadow-[0_0_15px_rgba(56,182,255,0.6)]' 
                    : 'bg-blue-100/70 hover:bg-blue-200/70 hover:rotate-y-12 hover:shadow-[0_0_15px_rgba(49,130,206,0.6)]'
                }`}
                aria-label={social.name}
              >
                <div className="transform transition-transform hover:scale-110">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill={social.color}
                    stroke={social.color}
                    strokeWidth="0.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-all"
                  >
                    {social.name === "GitHub" && (
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    )}
                    {social.name === "LinkedIn" && (
                      <>
                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                        <rect x="2" y="9" width="4" height="12"></rect>
                        <circle cx="4" cy="4" r="2"></circle>
                      </>
                    )}
                    {social.name === "Twitter" && (
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                    )}
                    {social.name === "Instagram" && (
                      <>
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                      </>
                    )}
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Projects Section - Fixed card overflow and improved responsiveness */}
        <section id="projects" ref={sectionRefs.projects} className="py-16 sm:py-20">
          <h2 className={`text-3xl md:text-4xl font-bold mb-8 sm:mb-12 bg-clip-text text-transparent bg-gradient-to-r ${darkMode ? 'from-blue-400 to-purple-500' : 'from-blue-600 to-purple-700'} text-center`}>
            Ongoing Projects
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {projects.map((project, i) => (
              <div key={i} className="h-auto min-h-[20rem] sm:h-80 project-card-hover">
                <ProjectCard project={project} index={i} darkMode={darkMode} />
              </div>
            ))}
          </div>
        </section>
        
        {/* About Section with theme-aware 3D effect */}
        <section id="about" ref={sectionRefs.about} className="py-16 sm:py-20 relative">
          <div className="absolute inset-0 -z-10">
            <div className={`absolute top-1/3 -left-24 w-64 h-64 rounded-full ${
              darkMode ? 'bg-blue-500/5' : 'bg-blue-600/10'
            } blur-3xl transition-colors duration-500`}></div>
            <div className={`absolute bottom-1/4 -right-24 w-80 h-80 rounded-full ${
              darkMode ? 'bg-purple-500/5' : 'bg-purple-600/10'
            } blur-3xl transition-colors duration-500`}></div>
          </div>
          
          <h2 className={`text-3xl md:text-4xl font-bold mb-8 sm:mb-12 bg-clip-text text-transparent bg-gradient-to-r ${darkMode ? 'from-blue-400 to-purple-500' : 'from-blue-600 to-purple-700'} text-center`}>
            About Me
          </h2>
          
          {/* Add 3D tilt effect on hover to the about card */}
          <div 
            className={`relative z-10 flex flex-col md:flex-row gap-8 md:gap-10 items-center backdrop-blur-sm ${
              darkMode ? 'bg-white/5 border-white/10' : 'bg-white/50 border-blue-200/50'
            } p-5 sm:p-8 rounded-2xl border transform transition-all duration-500 hover:shadow-xl tilt-card`}
          >
            <div className="w-full md:w-2/5 lg:w-1/3">
              <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 relative mx-auto">
                <div className={`absolute inset-0 rounded-full ${darkMode ? 'bg-gradient-to-br from-blue-500 to-purple-600' : 'bg-gradient-to-br from-blue-600 to-purple-700'} animate-pulse-slow opacity-50 blur-md`}></div>
                <div className={`relative w-full h-full rounded-full overflow-hidden border-2 ${darkMode ? 'border-white/20' : 'border-blue-300/50'}`}>
                  <ImageWithFallback
                    src="/profile.jpg"
                    alt="Karan Gupta"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
            
            <div className="w-full md:w-3/5 lg:w-2/3">
              <div className={`space-y-4 ${darkMode ? 'text-white/80' : 'text-blue-900/90'}`}>
                <p>
                  I'm a Computer Science undergraduate at IIT Hyderabad (Batch 2027) with a passion for creating immersive digital experiences that blend cutting-edge technology with creative design.
                </p>
                <p>
                  With expertise in web development using Next.js, Go, and PostgreSQL, I build solutions that are not only functional but visually captivating. I'm also exploring AI/ML, VR, and participate in CTF competitions.
                </p>
                <p>
                  As the founder of AINexus, I'm constantly exploring innovative approaches and pushing the boundaries of what's possible in tech. When I'm not coding, you can find me participating in hackathons or contributing to open source projects.
                </p>
              </div>
              
              <div className="mt-6 sm:mt-8">
                <h3 className={`text-xl font-semibold ${darkMode ? 'text-cyan-400' : 'text-blue-700'} mb-3`}>
                  Skills & Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["Next.js", "Go", "PostgreSQL", "Tailwind CSS", "Express.js", "AI/ML", "VR", "Flutter", "CTF", "Unity"].map((skill) => (
                    <span 
                      key={skill} 
                      className={`px-3 py-1 ${darkMode ? 'bg-white/10 text-white/90 border-white/20' : 'bg-blue-100/70 text-blue-800 border-blue-200'} rounded-full text-sm border`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Contact Section with enhanced 3D effects */}
        <section id="contact" ref={sectionRefs.contact} className="py-16 sm:py-20 relative overflow-hidden">
          {/* Contact section animated background elements */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            {/* Floating orbs with glow effects */}
            <div 
              className={`contact-floating-element w-64 h-64 top-10 left-10 ${
                darkMode ? 'bg-blue-500/10' : 'bg-blue-600/5'
              }`}
              style={{ animationDelay: '0s' }}
            ></div>
            <div 
              className={`contact-floating-element w-80 h-80 bottom-20 right-20 ${
                darkMode ? 'bg-purple-500/10' : 'bg-purple-600/5'
              }`}
              style={{ animationDelay: '2s' }}
            ></div>
            <div 
              className={`contact-floating-element w-40 h-40 top-40 right-1/4 ${
                darkMode ? 'bg-cyan-500/10' : 'bg-cyan-600/5'
              }`}
              style={{ animationDelay: '4s' }}
            ></div>
            
            {/* Accent lines with glow */}
            <div className="absolute h-px w-1/3 left-0 top-1/3 overflow-hidden">
              <div className={`h-full ${darkMode ? 'bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent' : 'bg-gradient-to-r from-transparent via-blue-400/20 to-transparent'}`}></div>
            </div>
            <div className="absolute h-px w-1/3 right-0 bottom-1/3 overflow-hidden">
              <div className={`h-full ${darkMode ? 'bg-gradient-to-r from-transparent via-purple-400/30 to-transparent' : 'bg-gradient-to-r from-transparent via-indigo-400/20 to-transparent'}`}></div>
            </div>
          </div>
        
          <h2 className={`text-3xl md:text-4xl font-bold mb-8 sm:mb-12 bg-clip-text text-transparent bg-gradient-to-r ${darkMode ? 'from-blue-400 to-purple-500' : 'from-blue-600 to-purple-700'} text-center relative z-10`}>
            Let's Connect
          </h2>
          
          <div className="max-w-2xl mx-auto">
            {/* Simple Email Form with 3D effects */}
            <div className="contact-form-card perspective-1000">
              <div 
                className={`h-full relative contact-form-card backdrop-blur-sm ${
                  darkMode ? 'bg-white/5 border-white/10' : 'bg-white/60 border-blue-200/50'
                } p-5 sm:p-8 rounded-2xl border transition-all hover:shadow-lg`}
              >
                <div className={`absolute top-0 left-0 w-full h-full pointer-events-none rounded-2xl opacity-40 ${
                  darkMode ? 'contact-shine-dark' : 'contact-shine-light'
                }`}></div>
                
                <form className="space-y-5 sm:space-y-6 relative z-10">
                  <div className="form-field-3d">
                    <label 
                      className={`block text-sm font-medium ${darkMode ? 'text-white/70' : 'text-blue-800'} mb-1`}
                    >
                      Your Name
                    </label>
                    <div className="relative">
                      <div className={`absolute inset-0 rounded-lg input-glow ${
                        darkMode ? 'bg-white/5 border-white/10' : 'bg-white/70 border-blue-200/50'
                      } border`}></div>
                      <input 
                        type="text" 
                        className={`form-field-input relative w-full px-4 py-3 bg-transparent ${
                          darkMode ? 'text-white/90 focus:text-white' : 'text-blue-900 focus:text-blue-800'
                        } rounded-lg border-none outline-none`}
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  
                  <div className="form-field-3d">
                    <label 
                      className={`block text-sm font-medium ${darkMode ? 'text-white/70' : 'text-blue-800'} mb-1`}
                    >
                      Your Email
                    </label>
                    <div className="relative">
                      <div className={`absolute inset-0 rounded-lg input-glow ${
                        darkMode ? 'bg-white/5 border-white/10' : 'bg-white/70 border-blue-200/50'
                      } border`}></div>
                      <input 
                        type="email" 
                        className={`form-field-input relative w-full px-4 py-3 bg-transparent ${
                          darkMode ? 'text-white/90 focus:text-white' : 'text-blue-900 focus:text-blue-800'
                        } rounded-lg border-none outline-none`}
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                  
                  <div className="form-field-3d">
                    <label 
                      className={`block text-sm font-medium ${darkMode ? 'text-white/70' : 'text-blue-800'} mb-1`}
                    >
                      Message
                    </label>
                    <div className="relative">
                      <div className={`absolute inset-0 rounded-lg input-glow ${
                        darkMode ? 'bg-white/5 border-white/10' : 'bg-white/70 border-blue-200/50'
                      } border`}></div>
                      <textarea 
                        className={`form-field-input relative w-full px-4 py-3 bg-transparent ${
                          darkMode ? 'text-white/90 focus:text-white' : 'text-blue-900 focus:text-blue-800'
                        } rounded-lg border-none outline-none min-h-[120px]`}
                        placeholder="Hello! I'd like to connect about..."
                      ></textarea>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <button 
                      type="submit"
                      className={`w-full relative px-6 py-3 rounded-lg font-medium text-base sm:text-lg submit-button-3d transform transition-all active:scale-[0.98] ${
                        darkMode ? 
                          'bg-gradient-to-r from-blue-500/90 to-purple-600/90 text-white hover:from-blue-400 hover:to-purple-500' : 
                          'bg-gradient-to-r from-blue-600/90 to-purple-700/90 text-white hover:from-blue-500 hover:to-purple-600'
                      }`}
                    >
                      <span className="relative z-10">Send Message</span>
                      <div className={`submit-ring-pulse absolute inset-0 rounded-lg ${
                        darkMode ? 'bg-blue-500/40' : 'bg-blue-600/30'
                      }`}></div>
                    </button>
                  </div>
                </form>
                
                <div className="mt-8 pt-5 border-t border-dashed border-opacity-30 border-current">
                  <p className={`text-center text-sm ${darkMode ? 'text-white/70' : 'text-blue-900/80'}`}>
                    Or reach me directly at <a href="mailto:karan.gupta@example.com" className={`font-medium ${darkMode ? 'text-cyan-400 hover:text-cyan-300' : 'text-blue-700 hover:text-blue-600'} underline`}>karan.gupta@example.com</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={`relative z-10 border-t backdrop-blur-sm py-6 ${darkMode ? 'border-white/10 bg-black/20' : 'border-blue-200/50 bg-white/20'}`}>
        <div className="container mx-auto px-4">
          <p className={`text-center ${darkMode ? 'text-white/60' : 'text-blue-700/80'} text-sm`}>
            © {new Date().getFullYear()} Karan Gupta | IIT Hyderabad | Crafted with ❤️ in the digital cosmos
          </p>
        </div>
      </footer>
      
      {/* Enhanced 3D back to top button */}
      <button
        onClick={() => handleNavigate('home')}
        className={`fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full flex items-center justify-center transition-all transform perspective-500 hover:rotate-y-12 hover:scale-110 cursor-hover-grow ${
          darkMode 
            ? 'bg-white/10 hover:bg-white/20 border-white/20 hover:shadow-[0_0_15px_rgba(56,182,255,0.6)]' 
            : 'bg-blue-100/70 hover:bg-blue-200/70 border-blue-200 hover:shadow-[0_0_15px_rgba(49,130,206,0.6)]'
        } border`}
        aria-label="Back to top"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-blue-700'}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
}