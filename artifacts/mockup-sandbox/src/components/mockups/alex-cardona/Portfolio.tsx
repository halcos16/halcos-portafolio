import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Menu, X, Moon, Sun, ChevronLeft, ChevronRight, Maximize2, Instagram, Linkedin, Mail, Calendar, Camera } from 'lucide-react';
import { cn } from "@/lib/utils";

// ----------------------------------------------------------------------
// DATA
// ----------------------------------------------------------------------

const CATEGORIES = [
  "TODOS", "PAISAJES", "LUNA", "MASCOTAS", "MACRO", "FLORES", 
  "ARQUITECTURA", "RETRATO", "PRODUCTOS", "B&N", "DOBLE EXPOSICIÓN"
];

const IMAGES = [
  { id: 1, src: '/__mockup/images/paisajes-1.png', category: 'PAISAJES', title: 'Amanecer en el Valle', format: 'landscape' },
  { id: 2, src: '/__mockup/images/paisajes-2.png', category: 'PAISAJES', title: 'Bosque de Niebla', format: 'portrait' },
  { id: 3, src: '/__mockup/images/luna-1.png', category: 'LUNA', title: 'Mar de la Tranquilidad', format: 'square' },
  { id: 4, src: '/__mockup/images/mascotas-1.png', category: 'MASCOTAS', title: 'Mirada Leal', format: 'portrait' },
  { id: 5, src: '/__mockup/images/macro-1.png', category: 'MACRO', title: 'Microcosmos', format: 'square' },
  { id: 6, src: '/__mockup/images/flores-1.png', category: 'FLORES', title: 'Delicadeza Pastel', format: 'square' },
  { id: 7, src: '/__mockup/images/arquitectura-1.png', category: 'ARQUITECTURA', title: 'Líneas Urbanas', format: 'landscape' },
  { id: 8, src: '/__mockup/images/arquitectura-2.png', category: 'ARQUITECTURA', title: 'Ecos del Pasado', format: 'landscape' },
  { id: 9, src: '/__mockup/images/retrato-1.png', category: 'RETRATO', title: 'Claroscuro', format: 'portrait' },
  { id: 10, src: '/__mockup/images/retrato-2.jpg', category: 'RETRATO', title: 'Luz Natural', format: 'portrait' },
  { id: 11, src: '/__mockup/images/productos-1.jpg', category: 'PRODUCTOS', title: 'Precisión Suiza', format: 'square' },
  { id: 12, src: '/__mockup/images/bn-1.jpg', category: 'B&N', title: 'Reflejos en la Lluvia', format: 'landscape' },
  { id: 13, src: '/__mockup/images/bn-2.jpg', category: 'B&N', title: 'Alma en Sombras', format: 'portrait' },
  { id: 14, src: '/__mockup/images/doble-1.jpg', category: 'DOBLE EXPOSICIÓN', title: 'Simbiosis', format: 'portrait' },
];

const CLIENTS = [
  "VOGUE", "NATIONAL GEOGRAPHIC", "SONY", "LEICA", "ARCHDIGEST", "KINFORK"
];

// ----------------------------------------------------------------------
// COMPONENTS
// ----------------------------------------------------------------------

export function Portfolio() {
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("TODOS");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 1000], [0, 300]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  // Handle scroll for navbar
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle initial loading sequence
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Handle Lightbox Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, activeCategory]);

  // Prevent scroll when lightbox is open
  useEffect(() => {
    if (lightboxIndex !== null || mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [lightboxIndex, mobileMenuOpen]);

  const filteredImages = activeCategory === "TODOS" 
    ? IMAGES 
    : IMAGES.filter(img => img.category === activeCategory);

  const openLightbox = (image: typeof IMAGES[0]) => {
    const index = filteredImages.findIndex(i => i.id === image.id);
    setLightboxIndex(index);
  };

  const nextLightbox = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredImages.length);
  }, [lightboxIndex, filteredImages.length]);

  const prevLightbox = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredImages.length) % filteredImages.length);
  }, [lightboxIndex, filteredImages.length]);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({ top: el.offsetTop, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white text-[#0A0A0A] dark:bg-[#0A0A0A] dark:text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="text-center"
        >
          <h1 className="font-['Montserrat'] text-5xl font-light tracking-[0.3em] mb-2">AC</h1>
          <div className="h-[1px] w-0 bg-current mx-auto animate-[expand_1s_ease-in-out_forwards]"></div>
        </motion.div>
        <style>{`@keyframes expand { to { width: 100%; } }`}</style>
      </div>
    );
  }

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-700 font-sans selection:bg-neutral-800 selection:text-white dark:selection:bg-neutral-200 dark:selection:text-black",
      darkMode ? "bg-[#0A0A0A] text-[#F9F9F9] dark" : "bg-[#F9F9F9] text-[#0A0A0A]"
    )}>
      
      {/* ----------------------------------------------------------------------
          NAVBAR 
          ---------------------------------------------------------------------- */}
      <nav className={cn(
        "fixed top-0 left-0 w-full z-40 transition-all duration-500 border-b border-transparent",
        isScrolled 
          ? "bg-white/90 dark:bg-[#0A0A0A]/90 backdrop-blur-md py-4 border-black/5 dark:border-white/5 shadow-sm" 
          : "bg-transparent py-6"
      )}>
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          <div 
            className="font-['Montserrat'] text-xl font-bold tracking-widest cursor-pointer"
            onClick={() => scrollToSection('inicio')}
          >
            ALEX CARDONA
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-10 text-sm font-medium tracking-wide">
            {['Inicio', 'Portafolio', 'Sobre Mí', 'Contacto'].map((item) => (
              <button 
                key={item} 
                onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}
                className="relative group overflow-hidden"
              >
                <span>{item}</span>
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-current transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
              </button>
            ))}
            <button 
              onClick={() => setDarkMode(!darkMode)} 
              className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>

          {/* Mobile Nav Toggle */}
          <div className="flex items-center space-x-4 md:hidden">
            <button onClick={() => setDarkMode(!darkMode)} className="p-2">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setMobileMenuOpen(true)} className="p-2">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 20 }}
            className="fixed inset-0 z-50 bg-white dark:bg-[#0A0A0A] flex flex-col justify-center items-center"
          >
            <button 
              onClick={() => setMobileMenuOpen(false)} 
              className="absolute top-6 right-6 p-4"
            >
              <X size={32} />
            </button>
            <div className="flex flex-col space-y-8 text-center text-2xl font-['Montserrat'] font-light tracking-widest">
              {['Inicio', 'Portafolio', 'Sobre Mí', 'Contacto'].map((item) => (
                <button 
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}
                  className="hover:text-neutral-500 transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ----------------------------------------------------------------------
          HERO SECTION 
          ---------------------------------------------------------------------- */}
      <section id="inicio" className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="/__mockup/images/hero.png" 
            alt="Dramatic Landscape" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
        </motion.div>

        <div className="relative z-10 text-center px-6 text-white max-w-4xl mx-auto mt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="font-['Montserrat'] text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-4 drop-shadow-xl"
          >
            ALEX CARDONA
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-lg md:text-2xl font-light tracking-[0.2em] mb-8 uppercase"
          >
            Fotografía Profesional & Dirección Visual
          </motion.p>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-sm md:text-base font-serif italic text-white/80 max-w-2xl mx-auto mb-12"
          >
            "Capturando la esencia del entorno, el detalle y la luz."
          </motion.p>
          <motion.button 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            onClick={() => scrollToSection('portafolio')}
            className="group relative inline-flex items-center justify-center px-8 py-4 text-sm font-semibold tracking-widest uppercase text-white overflow-hidden border border-white/30 hover:border-white transition-colors duration-500"
          >
            <span className="relative z-10">Explorar Galerías</span>
            <span className="absolute inset-0 bg-white transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out-expo" />
            <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 text-black font-semibold tracking-widest uppercase">Explorar Galerías</span>
          </motion.button>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white"
        >
          <span className="text-xs uppercase tracking-widest font-medium opacity-70">Scroll</span>
          <div className="w-[1px] h-12 bg-white/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-white animate-[scroll-down_2s_infinite]" />
          </div>
        </motion.div>
        <style>{`
          @keyframes scroll-down { 0% { transform: translateY(-100%); } 100% { transform: translateY(200%); } }
          .ease-out-expo { transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1); }
        `}</style>
      </section>

      {/* ----------------------------------------------------------------------
          PORTFOLIO SECTION 
          ---------------------------------------------------------------------- */}
      <section id="portafolio" className="py-24 md:py-32 px-6 md:px-12 max-w-[1600px] mx-auto min-h-screen">
        <div className="text-center mb-16 md:mb-24">
          <h2 className="font-['Montserrat'] text-3xl md:text-4xl font-light tracking-widest mb-12">PORTAFOLIO</h2>
          
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-4 max-w-5xl mx-auto text-xs md:text-sm font-medium tracking-wider">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "pb-1 transition-all duration-300 relative",
                  activeCategory === category 
                    ? "text-neutral-900 dark:text-white" 
                    : "text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
                )}
              >
                {category}
                {activeCategory === category && (
                  <motion.div 
                    layoutId="activeFilter"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-neutral-900 dark:bg-white"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry Grid */}
        <motion.div 
          layout
          className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6"
        >
          <AnimatePresence>
            {filteredImages.map((image, i) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                key={image.id}
                className="break-inside-avoid relative group cursor-pointer overflow-hidden bg-neutral-100 dark:bg-neutral-900"
                onClick={() => openLightbox(image)}
              >
                <div className="aspect-w-auto aspect-h-auto">
                  <img 
                    src={image.src} 
                    alt={image.title}
                    loading="lazy"
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out-expo"
                  />
                </div>
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center text-white p-6 text-center">
                  <Maximize2 size={24} className="mb-4 transform scale-50 group-hover:scale-100 transition-transform duration-500 delay-100" />
                  <h3 className="font-['Montserrat'] text-lg font-medium tracking-wide transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">{image.title}</h3>
                  <p className="text-xs uppercase tracking-widest mt-2 opacity-80 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-150">{image.category}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ----------------------------------------------------------------------
          LIGHTBOX 
          ---------------------------------------------------------------------- */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          >
            <button 
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 p-2 text-white/70 hover:text-white transition-colors z-50"
            >
              <X size={32} />
            </button>

            {filteredImages.length > 1 && (
              <>
                <button 
                  onClick={(e) => { e.stopPropagation(); prevLightbox(); }}
                  className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white transition-colors z-50 group"
                >
                  <ChevronLeft size={48} className="transform group-hover:-translate-x-2 transition-transform" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); nextLightbox(); }}
                  className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 p-4 text-white/50 hover:text-white transition-colors z-50 group"
                >
                  <ChevronRight size={48} className="transform group-hover:translate-x-2 transition-transform" />
                </button>
              </>
            )}

            <div className="relative max-w-[90vw] max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
              <motion.img 
                key={filteredImages[lightboxIndex].id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                src={filteredImages[lightboxIndex].src} 
                alt={filteredImages[lightboxIndex].title}
                className="max-w-full max-h-[85vh] object-contain shadow-2xl"
              />
              <div className="absolute -bottom-12 text-center text-white/80">
                <p className="font-['Montserrat'] font-medium tracking-widest">{filteredImages[lightboxIndex].title}</p>
                <p className="text-xs font-mono mt-1 opacity-50">AC // {filteredImages[lightboxIndex].category} // {lightboxIndex + 1} OF {filteredImages.length}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ----------------------------------------------------------------------
          ABOUT SECTION 
          ---------------------------------------------------------------------- */}
      <section id="sobre-mi" className="py-24 md:py-32 bg-white dark:bg-[#111] transition-colors duration-700">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            
            <div className="w-full lg:w-2/5">
              <div className="relative group">
                <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 transform translate-x-4 translate-y-4 -z-10 transition-transform group-hover:translate-x-6 group-hover:translate-y-6" />
                <img 
                  src="/__mockup/images/alex-portrait.jpg" 
                  alt="Alex Cardona Portrait" 
                  className="w-full aspect-[3/4] object-cover grayscale group-hover:grayscale-0 transition-all duration-700 shadow-xl"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="w-full lg:w-3/5 space-y-8">
              <div>
                <h2 className="font-['Montserrat'] text-3xl md:text-4xl font-light tracking-widest mb-4">SOBRE MÍ</h2>
                <div className="w-12 h-1 bg-neutral-900 dark:bg-neutral-100" />
              </div>
              
              <div className="space-y-6 text-neutral-600 dark:text-neutral-400 leading-relaxed font-serif text-lg md:text-xl">
                <p>
                  "La fotografía no es simplemente el acto de capturar la luz; es el arte de interpretar el silencio que existe entre los espacios."
                </p>
                <p>
                  Con más de 25 años detrás de la lente, mi visión se ha destilado hacia lo esencial. A mis 47 años, entiendo que la mejor fotografía no grita para llamar la atención, sino que susurra verdades profundas a quienes están dispuestos a observar.
                </p>
                <p>
                  Mi trabajo explora la tensión entre la precisión técnica y la vulnerabilidad emocional. Desde la majestuosidad de un paisaje natural hasta la intimidad de un retrato en estudio, busco la quietud. Cada imagen en este portafolio es una invitación a pausar, a respirar y a habitar el momento.
                </p>
              </div>

              <div className="pt-8 flex flex-col sm:flex-row items-center gap-6">
                <button className="w-full sm:w-auto px-8 py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold tracking-widest text-sm uppercase hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors flex items-center justify-center gap-3">
                  Descargar Dossier
                </button>
                <div className="flex gap-4">
                  <a href="#" className="p-3 border border-neutral-200 dark:border-neutral-800 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"><Instagram size={20} /></a>
                  <a href="#" className="p-3 border border-neutral-200 dark:border-neutral-800 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"><Linkedin size={20} /></a>
                  <a href="#" className="p-3 border border-neutral-200 dark:border-neutral-800 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"><Camera size={20} /></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          CLIENTS SECTION 
          ---------------------------------------------------------------------- */}
      <section className="py-20 border-y border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="container mx-auto px-6">
          <p className="text-center text-xs tracking-[0.3em] font-medium uppercase mb-12 opacity-50">Publicaciones & Clientes Seleccionados</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-60">
            {CLIENTS.map((client, i) => (
              <span key={i} className="font-['Montserrat'] text-xl md:text-2xl font-bold tracking-tighter hover:opacity-100 transition-opacity cursor-default">
                {client}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          CONTACT SECTION 
          ---------------------------------------------------------------------- */}
      <section id="contacto" className="py-24 md:py-32 bg-neutral-950 text-white relative overflow-hidden">
        {/* Subtle background texture/pattern */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-16">
            
            <div className="w-full md:w-1/2">
              <h2 className="font-['Montserrat'] text-3xl md:text-5xl font-light tracking-tight mb-6 leading-tight">
                ¿Tienes un proyecto en mente? <br/><span className="font-bold text-neutral-400">Hablemos.</span>
              </h2>
              <p className="text-neutral-400 font-serif mb-12">
                Disponible para comisiones comerciales, editoriales y proyectos artísticos selectos a nivel mundial.
              </p>
              
              <div className="space-y-6">
                <a href="mailto:hola@alexcardona.com" className="flex items-center gap-4 text-neutral-300 hover:text-white transition-colors group">
                  <div className="w-12 h-12 border border-neutral-700 rounded-full flex items-center justify-center group-hover:border-white transition-colors">
                    <Mail size={18} />
                  </div>
                  <span className="tracking-wide">hola@alexcardona.com</span>
                </a>
                <a href="#" className="flex items-center gap-4 text-neutral-300 hover:text-white transition-colors group">
                  <div className="w-12 h-12 border border-neutral-700 rounded-full flex items-center justify-center group-hover:border-white transition-colors">
                    <Calendar size={18} />
                  </div>
                  <span className="tracking-wide">Agendar llamada (Calendly)</span>
                </a>
              </div>
            </div>

            <div className="w-full md:w-1/2">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Nombre Completo</label>
                  <input type="text" className="w-full bg-transparent border-b border-neutral-800 py-3 text-white focus:outline-none focus:border-white transition-colors rounded-none" required />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Correo Electrónico</label>
                  <input type="email" className="w-full bg-transparent border-b border-neutral-800 py-3 text-white focus:outline-none focus:border-white transition-colors rounded-none" required />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Tipo de Servicio</label>
                  <select className="w-full bg-transparent border-b border-neutral-800 py-3 text-white focus:outline-none focus:border-white transition-colors appearance-none rounded-none">
                    <option value="" className="bg-neutral-900">Seleccionar...</option>
                    {CATEGORIES.filter(c => c !== "TODOS").map(c => (
                      <option key={c} value={c} className="bg-neutral-900">{c}</option>
                    ))}
                    <option value="OTRO" className="bg-neutral-900">OTRO</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-neutral-500 mb-2">Detalles del Proyecto</label>
                  <textarea rows={4} className="w-full bg-transparent border-b border-neutral-800 py-3 text-white focus:outline-none focus:border-white transition-colors resize-none rounded-none" required></textarea>
                </div>
                <button type="submit" className="w-full py-4 bg-white text-black font-bold tracking-widest text-sm uppercase hover:bg-neutral-200 transition-colors mt-4">
                  Enviar Mensaje
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------------
          FOOTER 
          ---------------------------------------------------------------------- */}
      <footer className="py-12 bg-neutral-950 border-t border-neutral-900 text-center text-neutral-600 text-xs tracking-widest uppercase">
        <p>&copy; {new Date().getFullYear()} Alex Cardona. Todos los derechos reservados.</p>
        <p className="mt-2 opacity-50">Diseñado con intención y luz.</p>
      </footer>

    </div>
  );
}
