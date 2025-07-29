"use client"

import { useState, useEffect, useCallback, useMemo, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Moon, Sun, Menu, X, Phone, Mail, MapPin, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"

// Browser compatibility polyfills
const isBrowser = typeof window !== 'undefined'

// Polyfill for older browsers
if (isBrowser) {
  // Object.assign polyfill for IE
  if (typeof Object.assign !== 'function') {
    Object.assign = function(target: any, ...sources: any[]): any {
      if (target == null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }
      const to = Object(target);
      for (let index = 0; index < sources.length; index++) {
        const nextSource = sources[index];
        if (nextSource != null) {
          for (const nextKey in nextSource) {
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    };
  }

  // Array.from polyfill for IE
  if (!Array.from) {
    Array.from = function (object: any): any[] {
      return [].slice.call(object);
    };
  }

  // Promise polyfill check
  if (typeof Promise === 'undefined') {
    console.warn('Promise not supported, some features may not work in older browsers');
  }

  // IntersectionObserver polyfill check
  if (!('IntersectionObserver' in window)) {
    console.warn('IntersectionObserver not supported, using fallback');
  }

  // CSS.supports polyfill
  if (!window.CSS || !window.CSS.supports) {
    window.CSS = window.CSS || {};
    window.CSS.supports = function() { return false; };
  }
}

// Cross-browser event handling
const addEventListenerCompat = (element: any, event: string, handler: any, options?: any) => {
  if (element.addEventListener) {
    element.addEventListener(event, handler, options || false);
  } else if (element.attachEvent) {
    element.attachEvent('on' + event, handler);
  } else {
    element['on' + event] = handler;
  }
};

const removeEventListenerCompat = (element: any, event: string, handler: any, options?: any) => {
  if (element.removeEventListener) {
    element.removeEventListener(event, handler, options || false);
  } else if (element.detachEvent) {
    element.detachEvent('on' + event, handler);
  } else {
    element['on' + event] = null;
  }
};

// Cross-browser window.open with fallbacks
const openWindowCompat = (url: string, target: string = '_blank') => {
  try {
    // Modern browsers
    if (window.open) {
      const newWindow = window.open(url, target, 'noopener,noreferrer');
      if (!newWindow) {
        // Popup blocked, try alternative
        window.location.href = url;
      }
      return newWindow;
    } else {
      // Fallback for very old browsers
      window.location.href = url;
    }
  } catch (error) {
    // Final fallback
    window.location.href = url;
  }
};

// Cross-browser smooth scroll polyfill
const smoothScrollTo = (element: any, options: any = {}) => {
  if (!element) return;
  
  // Modern browsers with smooth scroll support
  if ('scrollBehavior' in document.documentElement.style) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
      ...options
    });
  } else {
    // Polyfill for older browsers
    const start = window.pageYOffset;
    const target = element.offsetTop - (options.offset || 80);
    const distance = target - start;
    const duration = options.duration || 1000;
    let startTime: number | null = null;

    const animateScroll = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      
      // Easing function
      const ease = progress * (2 - progress);
      
      window.scrollTo(0, start + distance * ease);
      
      if (timeElapsed < duration) {
        if (window.requestAnimationFrame && typeof window.requestAnimationFrame === 'function') {
          requestAnimationFrame(animateScroll);
        } else {
          // Fallback for very old browsers
          setTimeout(() => {
            window.scrollTo(0, target);
          }, 100);
        }
      }
    };

    if (window.requestAnimationFrame && typeof window.requestAnimationFrame === 'function') {
      requestAnimationFrame(animateScroll);
    } else {
      // Fallback for very old browsers
      setTimeout(() => {
        window.scrollTo(0, target);
      }, 100);
    }
  }
};

// Enhanced WhatsApp URL generation with encoding fallbacks
const generateWhatsAppURL = (phone: string, message: string): string => {
  try {
    // Modern browsers
    if (encodeURIComponent) {
      return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    } else {
      // Fallback encoding for older browsers
      return `https://wa.me/${phone}?text=${escape(message)}`;
    }
  } catch (error) {
    // Final fallback - basic URL without encoding
    return `https://wa.me/${phone}`;
  }
};

const heroImages = [
  "/images/living-room-1.jpg",
  "/images/living-room-2.jpg",
  "/images/living-room-3.jpg",
  "/images/living-room-4.jpg",
  "/images/living-room-5.jpg",
]

const portfolioCategories = {
  "Living Room": [
    "/images/living-room-1.jpg",
    "/images/living-room-2.jpg",
    "/images/living-room-3.jpg",
    "/images/living-room-4.jpg",
    "/images/living-room-5.jpg",
  ],
  Kitchen: [
    "/images/kitchen-1.jpg",
    "/images/kitchen-2.jpg",
    "/images/kitchen-3.jpg",
    "/images/kitchen-4.jpg",
    "/images/kitchen-5.jpg",
    "/images/kitchen-6.jpg",
  ],
  Bedroom: ["/images/bedroom-1.jpg", "/images/bedroom-2.jpg", "/images/bedroom-3.jpg"],
  "Dining Room": ["/images/dining-room-1.jpg", "/images/dining-room-2.jpg", "/images/dining-room-3.jpg"],
  "Accent Walls": ["/images/accent-wall.jpg"],
}

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Homeowner",
    content:
      "Karel transformed our living space into something beyond our wildest dreams. The attention to detail and creative vision is unmatched.",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    name: "Michael Chen",
    role: "Business Owner",
    content:
      "Working with Karel Interior Designs was the best decision we made for our office renovation. Truly where imagination becomes a masterpiece.",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    name: "Emma Rodriguez",
    role: "Interior Enthusiast",
    content:
      "The team brought our vision to life with such elegance and sophistication. Every corner tells a story of thoughtful design.",
    image: "/placeholder.svg?height=60&width=60",
  },
]

// Device detection with comprehensive checks
const getDeviceInfo = () => {
  if (!isBrowser) return { isBrowser: true, isMobile: false, isTablet: false, isDesktop: true };
  
  const userAgent = navigator.userAgent.toLowerCase();
  const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  
  // Type assertion for msMaxTouchPoints which exists on IE/Edge
  interface NavigatorWithMSTouch extends Navigator {
    msMaxTouchPoints?: number;
  }
  
  const navWithTouch = navigator as NavigatorWithMSTouch;
  
  const isMobile = width < 768 || 
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent) ||
    ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0) ||
    (navWithTouch.msMaxTouchPoints && navWithTouch.msMaxTouchPoints > 0);
  
  const isTablet = width >= 768 && width < 1024 && isMobile;
  const isDesktop = !isMobile && !isTablet;
  
  return { isBrowser: true, isMobile, isTablet, isDesktop };
};

// TypeScript interfaces
interface PortfolioCardProps {
  category: string;
  images: string[];
  index: number;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

// Optimized Portfolio Card Component
const PortfolioCard: React.FC<PortfolioCardProps> = ({ category, images, index }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [isVisible, setIsVisible] = useState<boolean>(false)

  useEffect(() => {
    const checkMobile = () => {
      const deviceInfo = getDeviceInfo();
      setIsMobile(!!deviceInfo.isMobile);
    }

    checkMobile();
    // Use cross-browser event listener
    if (isBrowser) {
      addEventListenerCompat(window, 'resize', checkMobile);
      return () => removeEventListenerCompat(window, 'resize', checkMobile);
    }
  }, [])

  // Optimized slideshow with reduced complexity
  useEffect(() => {
    // Only run slideshow if mobile OR (desktop AND hovered)
    const shouldRunSlideshow = isMobile || (!isMobile && isHovered)
    
    if (!shouldRunSlideshow || !isVisible) return

    // Simplified timing - no complex network detection
    const interval = setInterval(
      () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length)
      },
      isMobile ? 4000 : 3000 // Reduced timing for smoother performance
    )

    return () => clearInterval(interval)
  }, [images.length, isHovered, isMobile, isVisible])

  // Optimized intersection observer for visibility
  useEffect(() => {
    if (!isBrowser || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    const element = document.getElementById(`portfolio-card-${index}`);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [index]);

  const categoryDescriptions = useMemo(
    () => ({
      "Living Room": "Comfortable and stylish living spaces that bring families together",
      Kitchen: "Modern kitchens that blend functionality with beautiful design",
      Bedroom: "Serene and comfortable bedrooms designed for rest and relaxation",
      "Dining Room": "Elegant dining spaces perfect for memorable gatherings",
      "Accent Walls": "Stunning accent walls that add character and visual interest to any space",
    }),
    [],
  )

  return (
    <motion.div
      id={`portfolio-card-${index}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.3, 
        delay: index * 0.1, 
        ease: "easeOut"
      }}
      viewport={{ once: true, margin: "-50px" }}
      className="w-full transform-gpu"
      whileHover={{ 
        y: -3,
        transition: { 
          duration: 0.2, 
          ease: "easeOut"
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        // Reset to first image when leaving hover on desktop
        if (!isMobile) {
          setCurrentImageIndex(0)
        }
      }}
    >
      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-200 group transform-gpu hover:scale-[1.02] w-full">
        <div className="relative h-80 overflow-hidden w-full">
          {/* Optimized image display - only show current image */}
          <Image
            src={images[currentImageIndex] || "/placeholder.svg"}
            alt={`${category} ${currentImageIndex + 1}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500 transform-gpu"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            onLoad={() => {
              console.log(`Successfully loaded portfolio image: ${images[currentImageIndex]}`);
            }}
            onError={(e) => {
              console.warn(`Failed to load portfolio image: ${images[currentImageIndex]}`);
              // Fallback to placeholder
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        </div>
        <CardContent className="p-6 w-full">
          <h3 className="text-xl md:text-2xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
            {category}
          </h3>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-4">{categoryDescriptions[category as keyof typeof categoryDescriptions]}</p>
          <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
            <span>{images.length} Projects</span>
            <div className="flex space-x-1">
              {images.map((_, imgIndex) => (
                <div
                  key={imgIndex}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    imgIndex === currentImageIndex
                      ? "bg-blue-600 scale-110"
                      : "bg-gray-300 dark:bg-gray-600"
                  }`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Browser detection and feature support
const getBrowserInfo = () => {
  if (!isBrowser) return { name: 'server', version: 0, isSupported: true };
  
  const userAgent = navigator.userAgent;
  let browserName = 'unknown';
  let browserVersion = 0;
  let isSupported = true;
  
  // Detect browser
  if (userAgent.indexOf('Chrome') > -1) {
    browserName = 'Chrome';
    browserVersion = parseInt(userAgent.match(/Chrome\/(\d+)/)?.[1] || '0');
  } else if (userAgent.indexOf('Firefox') > -1) {
    browserName = 'Firefox';
    browserVersion = parseInt(userAgent.match(/Firefox\/(\d+)/)?.[1] || '0');
  } else if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
    browserName = 'Safari';
    browserVersion = parseInt(userAgent.match(/Version\/(\d+)/)?.[1] || '0');
  } else if (userAgent.indexOf('Edge') > -1) {
    browserName = 'Edge';
    browserVersion = parseInt(userAgent.match(/Edge\/(\d+)/)?.[1] || '0');
  } else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident') > -1) {
    browserName = 'IE';
    browserVersion = parseInt(userAgent.match(/(?:MSIE |rv:)(\d+)/)?.[1] || '0');
    isSupported = browserVersion >= 11; // IE 11+ support
  }
  
  return { name: browserName, version: browserVersion, isSupported };
};

// Feature detection
interface FeatureSupport {
  flexbox: boolean;
  grid: boolean;
  transforms: boolean;
  animations: boolean;
  backdropFilter: boolean;
  webp: boolean;
  avif: boolean;
  intersectionObserver: boolean;
  requestAnimationFrame: boolean;
  localStorage: boolean;
}

const checkFeatureSupport = (): FeatureSupport | { all: boolean } => {
  if (!isBrowser) return { all: true };
  
  return {
    flexbox: (window.CSS && window.CSS.supports && window.CSS.supports('display', 'flex')) || 
             (window.CSS && window.CSS.supports && window.CSS.supports('display', '-webkit-flex')),
    grid: window.CSS && window.CSS.supports && window.CSS.supports('display', 'grid'),
    transforms: (window.CSS && window.CSS.supports && window.CSS.supports('transform', 'translateZ(0)')) || 
                (window.CSS && window.CSS.supports && window.CSS.supports('-webkit-transform', 'translateZ(0)')),
    animations: (window.CSS && window.CSS.supports && window.CSS.supports('animation', 'none')) || 
                (window.CSS && window.CSS.supports && window.CSS.supports('-webkit-animation', 'none')),
    backdropFilter: (window.CSS && window.CSS.supports && window.CSS.supports('backdrop-filter', 'blur(10px)')) || 
                    (window.CSS && window.CSS.supports && window.CSS.supports('-webkit-backdrop-filter', 'blur(10px)')),
    webp: false, // Will be detected dynamically
    avif: false, // Will be detected dynamically
    intersectionObserver: 'IntersectionObserver' in window,
    requestAnimationFrame: 'requestAnimationFrame' in window,
    localStorage: (() => {
      try {
        const test = 'test';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
      } catch (e) {
        return false;
      }
    })()
  };
};

// Error boundary for graceful degradation
const handleError = (error: any, errorInfo: any) => {
  console.warn('Karel Interior Designs: Non-critical error handled gracefully:', error);
  // Could send to error reporting service
};

// Initialize browser compatibility on load
if (isBrowser) {
  const browserInfo = getBrowserInfo();
  const features = checkFeatureSupport();
  
  // Add browser class to body for CSS targeting
  if (document.body) {
    document.body.className += ` browser-${browserInfo.name.toLowerCase()} version-${browserInfo.version}`;
    
    // Add feature classes
    if ('all' in features) {
      // Server-side rendering case
      document.body.className += ' supports-all';
    } else {
      Object.keys(features).forEach((feature: string) => {
        const featureSupported = (features as FeatureSupport)[feature as keyof FeatureSupport];
        if (featureSupported) {
          document.body.className += ` supports-${feature}`;
        } else {
          document.body.className += ` no-${feature}`;
        }
      });
    }
  }
  
  // Warn about unsupported browsers
  if (!browserInfo.isSupported) {
    console.warn('Karel Interior Designs: Your browser may not support all features. Please consider updating to a modern browser.');
  }
  
  // Detect WebP support
  const webpTest = document.createElement('img');
  webpTest.onload = webpTest.onerror = function() {
    if (webpTest.height === 2) {
      if (document.body) {
        document.body.className += ' supports-webp';
      }
    } else {
      if (document.body) {
        document.body.className += ' no-webp';
      }
    }
  };
  webpTest.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
  
  // Preload critical images for better performance
  const preloadCriticalImages = () => {
    const criticalImages = [
      ...heroImages,
      ...Object.values(portfolioCategories).flat().slice(0, 3) // Preload first 3 images from each category
    ];
    
    // Network-aware preloading
    const shouldPreload = () => {
      if (isBrowser && 'connection' in navigator) {
        const connection = (navigator as any).connection;
        if (connection) {
          // Don't preload on very slow connections to save bandwidth
          return connection.effectiveType !== 'slow-2g' && connection.effectiveType !== '2g';
        }
      }
      return true; // Default to preloading
    };
    
    if (!shouldPreload()) return;
    
    criticalImages.forEach((src) => {
      if (src && src !== "/placeholder.svg") {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        link.fetchPriority = 'high';
        document.head.appendChild(link);
      }
    });
  };
  
  // Preload images after a short delay to not block initial render
  setTimeout(preloadCriticalImages, 100);
}

// Performance optimization hook
const usePerformanceOptimization = () => {
  useEffect(() => {
    // Reduce motion for users who prefer it
    if (isBrowser && window.matchMedia) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (prefersReducedMotion.matches) {
        document.documentElement.style.setProperty('--animation-duration', '0.1s');
      }
    }

    // Optimize scroll performance
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Handle scroll optimizations here
          ticking = false;
        });
        ticking = true;
      }
    };

    if (isBrowser) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);
};

export default function KarelInteriorDesigns() {
  const [darkMode, setDarkMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  })

  // Apply performance optimizations
  usePerformanceOptimization();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  useEffect(() => {
    // Handle initial dark mode with cross-browser support
    if (isBrowser) {
      // Check for saved theme preference or system preference
      const savedTheme = localStorage.getItem('theme');
      const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      let shouldBeDark = false;
      
      if (savedTheme) {
        shouldBeDark = savedTheme === 'dark';
      } else {
        shouldBeDark = systemPrefersDark;
      }
      
      setDarkMode(shouldBeDark);
      
      // Apply theme to document
      if (shouldBeDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    
    // Simplified hero slideshow timing for better performance
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length)
    }, 5000) // Fixed timing for smoother performance
    return () => clearInterval(interval)
  }, [])

  const toggleDarkMode = useCallback(() => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (isBrowser) {
      // Save preference
      localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
      
      // Apply to document
      if (document.documentElement.classList) {
        if (newDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } else {
        // Fallback for older browsers
        const html = document.documentElement;
        if (newDarkMode) {
          if (html.className.indexOf('dark') === -1) {
            html.className += ' dark';
          }
        } else {
          html.className = html.className.replace(/\bdark\b/g, '').trim();
        }
      }
    }
  }, [darkMode])

  const scrollToSection = useCallback(
    (sectionId: string) => {
      setMobileMenuOpen(false)

      setTimeout(
        () => {
          if (isBrowser) {
          const element = document.getElementById(sectionId)
          if (element) {
              // Use our cross-browser smooth scroll
              smoothScrollTo(element, { offset: 80 });
            }
          }
        },
        mobileMenuOpen ? 150 : 0,
      )
    },
    [mobileMenuOpen],
  )

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const { firstName, lastName, email, phone, message } = formData
    
    const whatsappMessage = `Hello! I'm interested in Karel Interior Designs services.

*Contact Details:*
Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}

*Project Details:*
${message}

I would love to discuss this project further with you.`

    // Use cross-browser WhatsApp URL generation
    const whatsappUrl = generateWhatsAppURL('254796813721', whatsappMessage);
    
    // Use cross-browser window opening with 0 delay for immediate execution
    setTimeout(() => {
      openWindowCompat(whatsappUrl);
    }, 0)
    
    // Reset form immediately after opening WhatsApp
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: ''
    })
  }

  const handleWhatsAppButton = () => {
    const message = "Hello, I would love to know more about Karel Interior Designs, what services do you offer?"
    const whatsappUrl = generateWhatsAppURL('254796813721', message);
    
    // Use cross-browser window opening with 0 delay for immediate execution
    setTimeout(() => {
      openWindowCompat(whatsappUrl);
    }, 0)
  }

  return (
    <div
      className={`min-h-screen w-full overflow-x-hidden transition-all duration-300 ${darkMode ? "dark bg-slate-900" : "bg-white"}`}
    >

      {/* Navigation */}
      <motion.nav
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ 
          duration: 0.2, 
          ease: "easeOut"
        }}
        className="fixed top-0 left-0 right-0 w-full z-[9999] backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-blue-200/20 dark:border-blue-400/20 shadow-lg transform-gpu"
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <motion.div 
              whileHover={{ scale: 1.02 }} 
              transition={{ 
                duration: 0.2, 
                ease: "easeOut"
              }}
              className="flex items-center flex-shrink-0 space-x-3"
            >
              <Image
                src="/images/karel-logo.png"
                alt="Karel Interior Designs"
                width={180}
                height={60}
                className="h-10 sm:h-12 md:h-14 w-auto"
                priority
              />
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: 0.1, 
                  duration: 0.3, 
                  ease: "easeOut"
                }}
                className="hidden sm:block"
              >
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold navbar-brand-text glow-pulse transform-gpu cursor-pointer">
                  Karel Interior Designs
                </h1>
              </motion.div>
              {/* Mobile version - shorter text */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  delay: 0.1, 
                  duration: 0.3, 
                  ease: "easeOut"
                }}
                className="block sm:hidden"
              >
                <h1 className="text-sm font-bold navbar-brand-text glow-pulse transform-gpu cursor-pointer">
                  Karel Interior Designs
                </h1>
              </motion.div>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              {["Home", "About", "Work", "Testimonials", "Contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium whitespace-nowrap"
                >
                  {item}
                </button>
              ))}
              <Button
                onClick={toggleDarkMode}
                variant="ghost"
                size="icon"
                className="ml-4 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-200 flex-shrink-0"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2 sm:space-x-4">
              <Button
                onClick={toggleDarkMode}
                variant="ghost"
                size="icon"
                className="hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors duration-200 flex-shrink-0"
              >
                {darkMode ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
              </Button>
              <Button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                variant="ghost"
                size="icon"
                className="flex-shrink-0"
              >
                {mobileMenuOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ 
                duration: 0.15, 
                ease: [0.4, 0.0, 0.2, 1],
                type: "spring",
                stiffness: 500,
                damping: 30
              }}
              className="md:hidden mt-4 pb-4 w-full"
            >
              {["Home", "About", "Work", "Testimonials", "Contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="block w-full text-left py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  {item}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative h-screen w-full flex items-center justify-center overflow-hidden scroll-mt-16"
      >
        {/* Background Slideshow */}
        <div className="absolute inset-0 w-full h-full">
          <AnimatePresence mode="wait">
          {heroImages.map((src, index) => (
              <motion.div
              key={src}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: index === (currentHeroIndex % heroImages.length) ? 1 : 0
                }}
                exit={{ opacity: 0 }}
                transition={{ 
                  duration: 0.4, 
                  ease: "easeInOut"
                }}
                className="absolute inset-0 w-full h-full"
            >
              <Image
                src={src || "/placeholder.svg"}
                alt={`Hero Interior Design ${index + 1}`}
                fill
                className="object-cover w-full h-full transform-gpu"
                priority={index === 0}
                sizes="100vw"
                loading={index === 0 ? "eager" : "lazy"}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                onLoad={() => {
                  console.log(`Successfully loaded hero image: ${src}`);
                }}
                onError={(e) => {
                  console.warn(`Failed to load hero image: ${src}`);
                  // Fallback to placeholder
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder.svg";
                }}
              />
              </motion.div>
          ))}
          </AnimatePresence>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent w-full h-full" />

        <div className="relative z-10 text-center text-white px-4 sm:px-6 w-full max-w-4xl mx-auto">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              delay: 0.1, 
              duration: 0.4, 
              ease: "easeOut"
            }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight transform-gpu"
            whileHover={{ 
              scale: 1.01,
              transition: { 
                duration: 0.2, 
                ease: "easeOut"
              }
            }}
          >
            Karel Interior
            <span className="block bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent glow-text">
              Designs
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              delay: 0.2, 
              duration: 0.4, 
              ease: "easeOut"
            }}
            className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-gray-200 transform-gpu"
          >
            "Where Imagination Becomes a Masterpiece" 🎨
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ 
              delay: 0.3, 
              duration: 0.4, 
              ease: "easeOut"
            }}
            whileHover={{ 
              scale: 1.02,
              transition: { 
                duration: 0.2, 
                ease: "easeOut"
              }
            }}
            whileTap={{ 
              scale: 0.98,
              transition: { 
                duration: 0.1, 
                ease: "easeOut"
              }
            }}
            className="transform-gpu"
          >
            <Button
              onClick={() => scrollToSection("contact")}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 glow-button transform-gpu"
            >
              Book a Consultation
            </Button>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-16 sm:py-20 bg-gradient-to-b from-white to-blue-50/30 dark:from-slate-900 dark:to-slate-800 scroll-mt-16 w-full overflow-hidden"
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
              About Karel Interior Designs
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto mb-6 sm:mb-8 rounded-full glow-line"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center w-full">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="w-full"
            >
              <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-900 dark:text-white">
                Our Design Philosophy
              </h3>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 leading-relaxed">
                At Karel Interior Designs, we believe that every space tells a story. Our mission is to transform your
                vision into a living masterpiece that reflects your personality, lifestyle, and dreams.
              </p>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 leading-relaxed">
                With years of experience in creating stunning residential and commercial spaces, we combine innovative
                design concepts with timeless elegance to deliver results that exceed expectations.
              </p>
              <div className="space-y-3 sm:space-y-4">
                {[
                  "Premium Quality Materials",
                  "Personalized Design Solutions",
                  "Sustainable Design Practices",
                  "Expert Project Management",
                ].map((value, index) => (
                  <motion.div
                    key={value}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-2 h-2 bg-blue-600 rounded-full glow-dot flex-shrink-0"></div>
                    <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{value}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative w-full"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl glow-card w-full">
                <Image
                  src="/images/living-room-1.jpg"
                  alt="About Karel Interior Designs"
                  width={600}
                  height={400}
                  className="object-cover w-full h-80 sm:h-96"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 to-transparent"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="work" className="py-16 sm:py-20 bg-white dark:bg-slate-900 scroll-mt-16 w-full overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
              Our Work
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto mb-6 sm:mb-8 rounded-full glow-line"></div>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
              Explore our portfolio of stunning interior transformations across different spaces
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 w-full">
            {Object.entries(portfolioCategories).map(([category, images], index) => (
              <Suspense key={category} fallback={<div className="h-80 bg-gray-200 animate-pulse rounded-lg" />}>
                <PortfolioCard category={category} images={images} index={index} />
              </Suspense>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-16 sm:py-20 bg-gradient-to-b from-blue-50/30 to-white dark:from-slate-800 dark:to-slate-900 scroll-mt-16 w-full overflow-hidden"
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
              What Our Clients Say
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto mb-6 sm:mb-8 rounded-full glow-line"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="w-full"
              >
                <Card className="p-4 sm:p-6 h-full shadow-lg hover:shadow-xl transition-all duration-200 glow-card-hover transform-gpu hover:scale-[1.02] w-full">
                  <CardContent className="p-0 w-full">
                    <div className="flex items-center mb-4">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        width={60}
                        height={60}
                        className="rounded-full mr-4 flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                          {testimonial.name}
                        </h4>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed text-sm sm:text-base">
                      "{testimonial.content}"
                    </p>
                    <div className="flex text-yellow-400 mt-4">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-base sm:text-lg">
                          ★
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 sm:py-20 bg-white dark:bg-slate-900 scroll-mt-16 w-full overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-white">
              Let's Create Your Masterpiece
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto mb-6 sm:mb-8 rounded-full glow-line"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 w-full">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="w-full"
            >
              <Card className="p-6 sm:p-8 shadow-lg glow-card hover:scale-[1.01] transition-all duration-200 w-full">
                <CardContent className="p-0 w-full">
                  <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-900 dark:text-white">
                    Get In Touch
                  </h3>
                  <form onSubmit={handleWhatsAppSubmit} className="space-y-4 sm:space-y-6 w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                      <Input placeholder="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} className="glow-input w-full" />
                      <Input placeholder="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} className="glow-input w-full" />
                    </div>
                    <Input type="email" placeholder="Email Address" name="email" value={formData.email} onChange={handleInputChange} className="glow-input w-full" />
                    <Input placeholder="Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} className="glow-input w-full" />
                    <Textarea placeholder="Tell us about your project..." name="message" value={formData.message} onChange={handleInputChange} rows={4} className="glow-input w-full" />
                    <Button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleWhatsAppSubmit(e)
                      }}
                      type="button"
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 text-base sm:text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 glow-button transform-gpu"
                    >
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="space-y-6 sm:space-y-8 w-full"
            >
              <div>
                <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-900 dark:text-white">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center glow-icon flex-shrink-0">
                      <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Phone</p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">+254796813721</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center glow-icon flex-shrink-0">
                      <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Email</p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">karelinteriors@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center glow-icon flex-shrink-0">
                      <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Location</p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">Juja, Kenya</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 sm:pt-8">
                <Button 
                  onClick={(e) => {
                    e.preventDefault()
                    handleWhatsAppButton()
                  }}
                  type="button"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-base sm:text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>WhatsApp Us</span>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-8 sm:py-12 w-full overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div>
              <div className="mb-3 sm:mb-4">
                <Image
                  src="/images/karel-logo.png"
                  alt="Karel Interior Designs"
                  width={200}
                  height={67}
                  className="h-12 sm:h-14 w-auto"
                />
              </div>
              <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">
                "Where Imagination Becomes a Masterpiece"
              </p>
              <p className="text-gray-400 text-sm sm:text-base">
                Transforming spaces with creativity, elegance, and unmatched attention to detail.
              </p>
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h4>
              <div className="space-y-2">
                {["Home", "About", "Work", "Testimonials", "Contact"].map((link) => (
                  <button
                    key={link}
                    onClick={() => scrollToSection(link.toLowerCase())}
                    className="block text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm sm:text-base"
                  >
                    {link}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Follow Us</h4>
              <div className="flex flex-wrap gap-4">
                {["Instagram", "Facebook", "Pinterest", "LinkedIn"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm sm:text-base"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
            <p className="text-gray-400 text-sm sm:text-base">
              © {new Date().getFullYear()} Karel Interior Designs. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
