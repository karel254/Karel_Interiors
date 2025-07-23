"use client"

import { useState, useEffect, useCallback, useMemo, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Moon, Sun, Menu, X, Phone, Mail, MapPin, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"

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

// Optimized Portfolio Card Component
const PortfolioCard = ({ category, images, index }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return

    const interval = setInterval(
      () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length)
      },
      5000 + index * 800,
    ) // Stagger the intervals

    return () => clearInterval(interval)
  }, [images.length, index])

  const categoryDescriptions = useMemo(
    () => ({
      "Living Room": "Comfortable and stylish living spaces that bring families together",
      Kitchen: "Modern kitchens that blend functionality with beautiful design",
      Bedroom: "Serene and comfortable bedrooms designed for rest and relaxation",
      "Dining Room": "Elegant dining spaces perfect for memorable gatherings",
    }),
    [],
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: -10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
      viewport={{ once: true, margin: "-50px" }}
      className="w-full transform-gpu"
      whileHover={{ 
        y: -5,
        rotateY: 2,
        transition: { duration: 0.3 }
      }}
    >
      <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 glow-card-hover group transform-gpu hover:scale-105 card-3d w-full perspective-1000">
        <div className="relative h-80 overflow-hidden w-full">
          <AnimatePresence mode="wait">
            {images.map((src, imgIndex) => (
              <motion.div
                key={src}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ 
                  opacity: imgIndex === currentImageIndex ? 1 : 0,
                  scale: imgIndex === currentImageIndex ? 1 : 1.1
                }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 1.0, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={src || "/placeholder.svg"}
                  alt={`${category} ${imgIndex + 1}`}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-1000 transform-gpu"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  loading="eager"
                />
              </motion.div>
            ))}
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <CardContent className="p-6 w-full">
          <h3 className="text-xl md:text-2xl font-semibold mb-3 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
            {category}
          </h3>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 mb-4">{categoryDescriptions[category]}</p>
          <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
            <span>{images.length} Projects</span>
            <div className="flex space-x-1">
              {images.map((_, imgIndex) => (
                <div
                  key={imgIndex}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    imgIndex === currentImageIndex
                      ? "bg-blue-600 scale-125 shadow-lg shadow-blue-600/50"
                      : "bg-gray-300 dark:bg-gray-600 hover:scale-110"
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

export default function KarelInteriorDesigns() {
  const [darkMode, setDarkMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Handle initial dark mode
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark')
      setDarkMode(isDark)
    }
    
    // Instant preload all images in background
    const preloadAllImages = () => {
      // Preload hero images
      heroImages.forEach((src) => {
        const img = new window.Image()
        img.src = src
      })
      
      // Preload portfolio images
      Object.values(portfolioCategories).flat().forEach((src) => {
        const img = new window.Image()
        img.src = src
      })
    }
    
    // Start preloading immediately
    preloadAllImages()
    
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  const toggleDarkMode = useCallback(() => {
    setDarkMode(!darkMode)
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle("dark")
    }
  }, [darkMode])

  const scrollToSection = useCallback(
    (sectionId) => {
      setMobileMenuOpen(false)

      setTimeout(
        () => {
          if (typeof document !== 'undefined' && typeof window !== 'undefined') {
            const element = document.getElementById(sectionId)
            if (element) {
              const navbar = document.querySelector("nav")
              const navbarHeight = navbar ? navbar.offsetHeight : 80
              const elementPosition = element.offsetTop
              const offsetPosition = elementPosition - navbarHeight + 4

              window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
              })
            }
          }
        },
        mobileMenuOpen ? 150 : 0,
      )
    },
    [mobileMenuOpen],
  )

  return (
    <div
      className={`min-h-screen w-full overflow-x-hidden transition-all duration-300 transform-gpu ${darkMode ? "dark bg-slate-900" : "bg-white"}`}
    >

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-blue-200/20 dark:border-blue-400/20"
      >
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <motion.div whileHover={{ scale: 1.05 }} className="flex items-center flex-shrink-0">
              <Image
                src="/images/karel-logo.png"
                alt="Karel Interior Designs"
                width={180}
                height={60}
                className="h-10 sm:h-12 md:h-14 w-auto"
                priority
              />
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
              transition={{ duration: 0.2 }}
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
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ 
                  opacity: index === (currentHeroIndex % heroImages.length) ? 1 : 0,
                  scale: index === (currentHeroIndex % heroImages.length) ? 1 : 1.1
                }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={src || "/placeholder.svg"}
                  alt={`Hero Interior Design ${index + 1}`}
                  fill
                  className="object-cover w-full h-full transform-gpu"
                  priority={index === 0}
                  sizes="100vw"
                  loading="eager"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent w-full h-full" />

        <div className="relative z-10 text-center text-white px-4 sm:px-6 w-full max-w-4xl mx-auto">
          <motion.h1
            initial={{ y: 50, opacity: 0, rotateX: -15 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            transition={{ delay: 0.2, duration: 1.2, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight transform-gpu perspective-1000"
            whileHover={{ 
              scale: 1.02,
              rotateY: 2,
              transition: { duration: 0.3 }
            }}
          >
            Karel Interior
            <span className="block bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent glow-text">
              Designs
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0, rotateX: -10 }}
            animate={{ y: 0, opacity: 1, rotateX: 0 }}
            transition={{ delay: 0.4, duration: 1.0, ease: "easeOut" }}
            className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-gray-200 transform-gpu"
          >
            "Where Imagination Becomes a Masterpiece" 🎨
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.9, rotateX: -5 }}
            animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ delay: 0.6, duration: 1.0, ease: "easeOut" }}
            whileHover={{ 
              scale: 1.05,
              rotateY: 3,
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.95 }}
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
              <PortfolioCard key={category} category={category} images={images} index={index} />
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
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="w-full"
              >
                <Card className="p-4 sm:p-6 h-full shadow-lg hover:shadow-2xl transition-all duration-300 glow-card-hover transform-gpu hover:scale-105 card-3d w-full">
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
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="w-full"
            >
              <Card className="p-6 sm:p-8 shadow-lg glow-card hover:scale-102 card-3d transition-all duration-300 w-full">
                <CardContent className="p-0 w-full">
                  <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-900 dark:text-white">
                    Get In Touch
                  </h3>
                  <form className="space-y-4 sm:space-y-6 w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                      <Input placeholder="First Name" className="glow-input w-full" />
                      <Input placeholder="Last Name" className="glow-input w-full" />
                    </div>
                    <Input type="email" placeholder="Email Address" className="glow-input w-full" />
                    <Input placeholder="Phone Number" className="glow-input w-full" />
                    <Textarea placeholder="Tell us about your project..." rows={4} className="glow-input w-full" />
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 text-base sm:text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 glow-button"
                    >
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
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
                      <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center glow-icon flex-shrink-0">
                      <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Email</p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">hello@karelinterior.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center glow-icon flex-shrink-0">
                      <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">Location</p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">New York, NY</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 sm:pt-8">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-base sm:text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2">
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
