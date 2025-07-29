"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Moon, Sun, Menu, X, Phone, Mail, MapPin, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { OptimizedImage } from "@/components/optimized-image"
import { PerformanceMonitor } from "@/components/performance-monitor"

// Simplified portfolio data
const portfolioCategories = {
  "Living Room": [
    "/images/living-room-1.jpg",
    "/images/living-room-2.jpg",
    "/images/living-room-3.jpg",
  ],
  Kitchen: [
    "/images/kitchen-1.jpg",
    "/images/kitchen-2.jpg",
    "/images/kitchen-3.jpg",
  ],
  Bedroom: ["/images/bedroom-1.jpg", "/images/bedroom-2.jpg"],
  "Dining Room": ["/images/dining-room-1.jpg", "/images/dining-room-2.jpg"],
}

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Homeowner",
    content: "Karel transformed our living space into something beyond our wildest dreams. The attention to detail and creative vision is unmatched.",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    name: "Michael Chen",
    role: "Business Owner",
    content: "Working with Karel Interior Designs was the best decision we made for our office renovation. Truly where imagination becomes a masterpiece.",
    image: "/placeholder.svg?height=60&width=60",
  },
  {
    name: "Emma Rodriguez",
    role: "Interior Enthusiast",
    content: "The team brought our vision to life with such elegance and sophistication. Every corner tells a story of thoughtful design.",
    image: "/placeholder.svg?height=60&width=60",
  },
]

// Optimized Portfolio Card Component
const PortfolioCard = ({ category, images, index }: { category: string; images: string[]; index: number }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (!isHovered) return

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [images.length, isHovered])

  const categoryDescriptions = {
    "Living Room": "Comfortable and stylish living spaces that bring families together",
    Kitchen: "Modern kitchens that blend functionality with beautiful design",
    Bedroom: "Serene and comfortable bedrooms designed for rest and relaxation",
    "Dining Room": "Elegant dining spaces perfect for memorable gatherings",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setCurrentImageIndex(0)
      }}
    >
      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
        <div className="relative h-64 overflow-hidden">
          <AnimatePresence mode="wait">
            {images.map((src, imgIndex) => (
              <motion.div
                key={src}
                initial={{ opacity: 0 }}
                animate={{ opacity: imgIndex === currentImageIndex ? 1 : 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <OptimizedImage
                  src={src}
                  alt={`${category} ${imgIndex + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <CardContent className="p-4">
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            {category}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            {categoryDescriptions[category as keyof typeof categoryDescriptions]}
          </p>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>{images.length} Projects</span>
            <div className="flex space-x-1">
              {images.map((_, imgIndex) => (
                <div
                  key={imgIndex}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    imgIndex === currentImageIndex
                      ? "bg-blue-600"
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

export default function KarelInteriorDesigns() {
  const [darkMode, setDarkMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const shouldBeDark = savedTheme ? savedTheme === 'dark' : systemPrefersDark
    
    setDarkMode(shouldBeDark)
    if (shouldBeDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleDarkMode = useCallback(() => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light')
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const scrollToSection = useCallback((sectionId: string) => {
    setMobileMenuOpen(false)
    setTimeout(() => {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, mobileMenuOpen ? 150 : 0)
  }, [mobileMenuOpen])

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { firstName, lastName, email, phone, message } = formData
    
    const whatsappMessage = `Hello! I'm interested in Karel Interior Designs services.

*Contact Details:*
Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone}

*Project Details:*
${message}

I would love to discuss this project further with you.`

    const whatsappUrl = `https://wa.me/254796813721?text=${encodeURIComponent(whatsappMessage)}`
    window.open(whatsappUrl, '_blank')
    
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
    const whatsappUrl = `https://wa.me/254796813721?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div className={`min-h-screen w-full ${darkMode ? "dark bg-slate-900" : "bg-white"}`}>
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 w-full z-50 backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-gray-200 dark:border-gray-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <OptimizedImage
                src="/images/karel-logo.png"
                alt="Karel Interior Designs"
                width={180}
                height={60}
                className="h-10 sm:h-12 w-auto"
                priority
              />
              <h1 className="hidden sm:block text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                Karel Interior Designs
              </h1>
              <h1 className="block sm:hidden text-sm font-bold text-gray-900 dark:text-white">
                Karel Interior Designs
              </h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {["Home", "About", "Work", "Testimonials", "Contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  {item}
                </button>
              ))}
              <Button
                onClick={toggleDarkMode}
                variant="ghost"
                size="icon"
                className="ml-4"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <Button
                onClick={toggleDarkMode}
                variant="ghost"
                size="icon"
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                variant="ghost"
                size="icon"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
              className="md:hidden mt-4 pb-4"
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
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <OptimizedImage
            src="/images/living-room-1.jpg"
            alt="Hero Interior Design"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight"
          >
            Karel Interior
            <span className="block bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
              Designs
            </span>
          </motion.h1>

          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 text-gray-200"
          >
            "Where Imagination Becomes a Masterpiece" 🎨
          </motion.p>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button
              onClick={() => scrollToSection("contact")}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-full"
            >
              Book a Consultation
            </Button>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 sm:py-20 bg-gradient-to-b from-white to-blue-50/30 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              About Karel Interior Designs
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto mb-6 rounded-full"></div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
                Our Design Philosophy
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                At Karel Interior Designs, we believe that every space tells a story. Our mission is to transform your
                vision into a living masterpiece that reflects your personality, lifestyle, and dreams.
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                With years of experience in creating stunning residential and commercial spaces, we combine innovative
                design concepts with timeless elegance to deliver results that exceed expectations.
              </p>
              <div className="space-y-3">
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
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700 dark:text-gray-300">{value}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <OptimizedImage
                  src="/images/living-room-2.jpg"
                  alt="About Karel Interior Designs"
                  width={600}
                  height={400}
                  className="object-cover w-full h-80 sm:h-96"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="work" className="py-16 sm:py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Our Work
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto mb-6 rounded-full"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Explore our portfolio of stunning interior transformations across different spaces
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(portfolioCategories).map(([category, images], index) => (
              <PortfolioCard key={category} category={category} images={images} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 sm:py-20 bg-gradient-to-b from-blue-50/30 to-white dark:from-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              What Our Clients Say
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto mb-6 rounded-full"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="flex items-center mb-4">
                      <OptimizedImage
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={60}
                        height={60}
                        className="rounded-full mr-4"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed">
                      "{testimonial.content}"
                    </p>
                    <div className="flex text-yellow-400 mt-4">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-lg">★</span>
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
      <section id="contact" className="py-16 sm:py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
              Let's Create Your Masterpiece
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-400 mx-auto mb-6 rounded-full"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 shadow-lg">
                <CardContent className="p-0">
                  <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
                    Get In Touch
                  </h3>
                  <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input placeholder="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                      <Input placeholder="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                    </div>
                    <Input type="email" placeholder="Email Address" name="email" value={formData.email} onChange={handleInputChange} />
                    <Input placeholder="Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} />
                    <Textarea placeholder="Tell us about your project..." name="message" value={formData.message} onChange={handleInputChange} rows={4} />
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold rounded-lg">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Phone</p>
                      <p className="text-gray-600 dark:text-gray-300">+254796813721</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Email</p>
                      <p className="text-gray-600 dark:text-gray-300">karelinteriors@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Location</p>
                      <p className="text-gray-600 dark:text-gray-300">Juja, Kenya</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Button 
                  onClick={handleWhatsAppButton}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-semibold rounded-lg flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>WhatsApp Us</span>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="mb-4">
                <OptimizedImage
                  src="/images/karel-logo.png"
                  alt="Karel Interior Designs"
                  width={200}
                  height={67}
                  className="h-14 w-auto"
                />
              </div>
              <p className="text-gray-400 mb-4">
                "Where Imagination Becomes a Masterpiece"
              </p>
              <p className="text-gray-400">
                Transforming spaces with creativity, elegance, and unmatched attention to detail.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                {["Home", "About", "Work", "Testimonials", "Contact"].map((link) => (
                  <button
                    key={link}
                    onClick={() => scrollToSection(link.toLowerCase())}
                    className="block text-gray-400 hover:text-blue-400 transition-colors duration-200"
                  >
                    {link}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex flex-wrap gap-4">
                {["Instagram", "Facebook", "Pinterest", "LinkedIn"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                  >
                    {social}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © {new Date().getFullYear()} Karel Interior Designs. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      
      <PerformanceMonitor />
    </div>
  )
}
