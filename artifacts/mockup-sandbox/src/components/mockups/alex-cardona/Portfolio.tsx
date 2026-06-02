import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Instagram, Linkedin, Mail } from 'lucide-react';

const CATEGORIES = [
  "Todos", "Paisajes", "Luna", "Mascotas", "Macro",
  "Flores", "Arquitectura", "Retrato", "Productos", "B&N", "Doble Exposición"
];

const IMAGES = [
  { id: 1,  src: '/__mockup/images/paisajes-1.png',     category: 'Paisajes',         title: 'Amanecer en el Valle' },
  { id: 2,  src: '/__mockup/images/paisajes-2.png',     category: 'Paisajes',         title: 'Bosque de Niebla' },
  { id: 3,  src: '/__mockup/images/luna-1.png',         category: 'Luna',             title: 'Mar de la Tranquilidad' },
  { id: 4,  src: '/__mockup/images/mascotas-1.png',     category: 'Mascotas',         title: 'Mirada Leal' },
  { id: 5,  src: '/__mockup/images/macro-1.png',        category: 'Macro',            title: 'Microcosmos' },
  { id: 6,  src: '/__mockup/images/flores-1.png',       category: 'Flores',           title: 'Delicadeza Pastel' },
  { id: 7,  src: '/__mockup/images/arquitectura-1.png', category: 'Arquitectura',     title: 'Líneas Urbanas' },
  { id: 8,  src: '/__mockup/images/arquitectura-2.png', category: 'Arquitectura',     title: 'Ecos del Pasado' },
  { id: 9,  src: '/__mockup/images/retrato-1.png',      category: 'Retrato',          title: 'Claroscuro' },
  { id: 10, src: '/__mockup/images/retrato-2.jpg',      category: 'Retrato',          title: 'Luz Natural' },
  { id: 11, src: '/__mockup/images/productos-1.jpg',    category: 'Productos',        title: 'Precisión Suiza' },
  { id: 12, src: '/__mockup/images/bn-1.jpg',           category: 'B&N',              title: 'Reflejos en la Lluvia' },
  { id: 13, src: '/__mockup/images/bn-2.jpg',           category: 'B&N',              title: 'Alma en Sombras' },
  { id: 14, src: '/__mockup/images/doble-1.jpg',        category: 'Doble Exposición', title: 'Simbiosis' },
];

export function Portfolio() {
  const [scrolled, setScrolled]             = useState(false);
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [lightbox, setLightbox]             = useState<number | null>(null);
  const [menuOpen, setMenuOpen]             = useState(false);
  const [form, setForm]                     = useState({ name: '', email: '', service: '', message: '' });
  const [formState, setFormState]           = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const visible = activeCategory === 'Todos'
    ? IMAGES
    : IMAGES.filter(img => img.category === activeCategory);

  const openLightbox = (img: typeof IMAGES[0]) =>
    setLightbox(visible.findIndex(i => i.id === img.id));

  const prev = useCallback(() =>
    setLightbox(l => l === null ? null : (l - 1 + visible.length) % visible.length),
    [visible.length]);

  const next = useCallback(() =>
    setLightbox(l => l === null ? null : (l + 1) % visible.length),
    [visible.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightbox === null) return;
      if (e.key === 'Escape')     setLightbox(null);
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft')  prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, next, prev]);

  useEffect(() => {
    document.body.style.overflow = lightbox !== null || menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightbox, menuOpen]);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ fontFamily: "'Montserrat', sans-serif", background: '#fff', color: '#0a0a0a', minHeight: '100vh' }}>

      {/* ── NAV ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '1.25rem 2.5rem',
        background: scrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(8px)' : 'none',
        borderBottom: scrolled ? '1px solid #eee' : '1px solid transparent',
        transition: 'all 0.4s ease',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span
          onClick={() => scrollTo('hero')}
          style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.25em', cursor: 'pointer' }}
        >
          ALEX CARDONA
        </span>

        {/* desktop links */}
        <div style={{ display: 'flex', gap: '2.5rem', fontSize: '0.75rem', letterSpacing: '0.12em' }}
             className="hidden-mobile">
          {['Portafolio', 'Sobre mí', 'Contacto'].map(l => (
            <button
              key={l}
              onClick={() => scrollTo(l.toLowerCase().replace(' ', '-').replace('í', 'i'))}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0a0a0a',
                       fontSize: '0.75rem', letterSpacing: '0.12em', padding: 0 }}
            >
              {l}
            </button>
          ))}
        </div>

        {/* hamburger */}
        <button
          onClick={() => setMenuOpen(v => !v)}
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          className="show-mobile"
        >
          <span style={{ fontSize: '1.25rem' }}>{menuOpen ? '✕' : '☰'}</span>
        </button>
      </nav>

      {/* mobile drawer */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, background: '#fff', zIndex: 200,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3rem',
        }}>
          <button onClick={() => setMenuOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '2rem', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem' }}>
            <X size={24} />
          </button>
          {['Portafolio', 'Sobre mí', 'Contacto'].map(l => (
            <button key={l} onClick={() => scrollTo(l.toLowerCase().replace(' ', '-').replace('í', 'i'))}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', letterSpacing: '0.2em', color: '#0a0a0a' }}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {/* ── HERO ── */}
      <section id="hero" style={{
        height: '100vh', position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <img
          src="/__mockup/images/hero.png"
          alt="Hero"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.32)' }} />

        <div style={{ position: 'relative', textAlign: 'center', color: '#fff', padding: '0 1.5rem' }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)', fontWeight: 300, letterSpacing: '0.18em', margin: 0 }}>
            ALEX CARDONA
          </h1>
          <p style={{ marginTop: '1rem', fontSize: '0.8rem', letterSpacing: '0.3em', opacity: 0.75, fontWeight: 400 }}>
            FOTOGRAFÍA PROFESIONAL &amp; DIRECCIÓN VISUAL
          </p>
          <button
            onClick={() => scrollTo('portafolio')}
            style={{
              marginTop: '2.5rem', padding: '0.85rem 2.5rem',
              border: '1px solid rgba(255,255,255,0.6)', background: 'transparent', color: '#fff',
              fontSize: '0.7rem', letterSpacing: '0.2em', cursor: 'pointer',
              transition: 'background 0.3s, color 0.3s',
            }}
            onMouseEnter={e => { (e.target as HTMLButtonElement).style.background = '#fff'; (e.target as HTMLButtonElement).style.color = '#0a0a0a'; }}
            onMouseLeave={e => { (e.target as HTMLButtonElement).style.background = 'transparent'; (e.target as HTMLButtonElement).style.color = '#fff'; }}
          >
            EXPLORAR
          </button>
        </div>

        {/* scroll indicator */}
        <div style={{ position: 'absolute', bottom: '2.5rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 1, height: '3rem', background: 'rgba(255,255,255,0.4)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '50%', background: '#fff', animation: 'drop 2s ease-in-out infinite' }} />
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO ── */}
      <section id="portafolio" style={{ padding: '7rem 2.5rem 5rem', maxWidth: '1400px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '0.7rem', letterSpacing: '0.3em', fontWeight: 500, marginBottom: '3rem', opacity: 0.4 }}>
          PORTAFOLIO
        </h2>

        {/* filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem 1.5rem', marginBottom: '3.5rem' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem 0',
                fontSize: '0.7rem', letterSpacing: '0.12em',
                color: activeCategory === cat ? '#0a0a0a' : '#aaa',
                borderBottom: activeCategory === cat ? '1px solid #0a0a0a' : '1px solid transparent',
                transition: 'color 0.2s, border-color 0.2s',
              }}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* masonry */}
        <div style={{ columns: 'auto 280px', gap: '1rem' }}>
          {visible.map(img => (
            <div
              key={img.id}
              onClick={() => openLightbox(img)}
              style={{
                breakInside: 'avoid', marginBottom: '1rem',
                overflow: 'hidden', cursor: 'pointer', position: 'relative',
                background: '#f0f0f0',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget.querySelector('img') as HTMLImageElement;
                if (el) el.style.transform = 'scale(1.03)';
                const ov = e.currentTarget.querySelector('.overlay') as HTMLElement;
                if (ov) ov.style.opacity = '1';
              }}
              onMouseLeave={e => {
                const el = e.currentTarget.querySelector('img') as HTMLImageElement;
                if (el) el.style.transform = 'scale(1)';
                const ov = e.currentTarget.querySelector('.overlay') as HTMLElement;
                if (ov) ov.style.opacity = '0';
              }}
            >
              <img
                src={img.src}
                alt={img.title}
                loading="lazy"
                style={{ width: '100%', height: 'auto', display: 'block', transition: 'transform 0.6s ease' }}
              />
              <div
                className="overlay"
                style={{
                  position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)',
                  opacity: 0, transition: 'opacity 0.4s ease',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
                  padding: '1.25rem',
                }}
              >
                <p style={{ color: '#fff', fontSize: '0.75rem', letterSpacing: '0.12em', margin: 0 }}>
                  {img.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── LIGHTBOX ── */}
      {lightbox !== null && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)',
            zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <button onClick={() => setLightbox(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.6 }}>
            <X size={24} />
          </button>
          {visible.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); prev(); }} style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.6 }}>
                <ChevronLeft size={36} />
              </button>
              <button onClick={e => { e.stopPropagation(); next(); }} style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', opacity: 0.6 }}>
                <ChevronRight size={36} />
              </button>
            </>
          )}
          <img
            src={visible[lightbox].src}
            alt={visible[lightbox].title}
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '90vw', maxHeight: '88vh', objectFit: 'contain', display: 'block' }}
          />
          <p style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', letterSpacing: '0.15em', whiteSpace: 'nowrap' }}>
            {visible[lightbox].title} — {lightbox + 1} / {visible.length}
          </p>
        </div>
      )}

      {/* ── ABOUT ── */}
      <section id="sobre-mi" style={{ padding: '7rem 2.5rem', background: '#f9f9f9' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '5rem', alignItems: 'start' }}>
          <div>
            <img
              src="/__mockup/images/alex-portrait.jpg"
              alt="Alex Cardona"
              loading="lazy"
              style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block', filter: 'grayscale(20%)' }}
            />
          </div>
          <div>
            <h2 style={{ fontSize: '0.7rem', letterSpacing: '0.3em', fontWeight: 500, marginBottom: '2.5rem', opacity: 0.4 }}>
              SOBRE MÍ
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontSize: '1rem', lineHeight: 1.85, color: '#444', fontFamily: 'Georgia, serif' }}>
              <p style={{ margin: 0 }}>
                Con más de 25 años detrás de la lente, mi visión se ha destilado hacia lo esencial.
                A los 47 años entiendo que la mejor fotografía no grita para llamar la atención,
                sino que susurra verdades profundas a quienes están dispuestos a observar.
              </p>
              <p style={{ margin: 0 }}>
                Mi trabajo explora la tensión entre la precisión técnica y la vulnerabilidad emocional.
                Desde la inmensidad de un paisaje natural hasta la intimidad de un retrato en estudio,
                busco la quietud. Cada imagen es una invitación a pausar y habitar el momento.
              </p>
            </div>
            <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1.25rem' }}>
              <a href="#" style={{ color: '#0a0a0a', opacity: 0.5, transition: 'opacity 0.2s' }} onMouseEnter={e => (e.currentTarget.style.opacity = '1')} onMouseLeave={e => (e.currentTarget.style.opacity = '0.5')}>
                <Instagram size={18} />
              </a>
              <a href="#" style={{ color: '#0a0a0a', opacity: 0.5, transition: 'opacity 0.2s' }} onMouseEnter={e => (e.currentTarget.style.opacity = '1')} onMouseLeave={e => (e.currentTarget.style.opacity = '0.5')}>
                <Linkedin size={18} />
              </a>
              <a href="mailto:hola@alexcardona.com" style={{ color: '#0a0a0a', opacity: 0.5, transition: 'opacity 0.2s' }} onMouseEnter={e => (e.currentTarget.style.opacity = '1')} onMouseLeave={e => (e.currentTarget.style.opacity = '0.5')}>
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contacto" style={{ padding: '7rem 2.5rem', background: '#0a0a0a', color: '#f9f9f9' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '0.7rem', letterSpacing: '0.3em', fontWeight: 500, marginBottom: '3rem', opacity: 0.35, color: '#f9f9f9' }}>
            CONTACTO
          </h2>
          <p style={{ fontSize: '1.6rem', fontWeight: 300, lineHeight: 1.4, marginBottom: '3rem' }}>
            ¿Tienes un proyecto en mente? Hablemos.
          </p>
          <form
            onSubmit={async e => {
              e.preventDefault();
              setFormState('sending');
              try {
                const res = await fetch('/api/contact', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(form),
                });
                if (!res.ok) throw new Error('server error');
                setFormState('sent');
                setForm({ name: '', email: '', service: '', message: '' });
              } catch {
                setFormState('error');
              }
            }}
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
          >
            <div>
              <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.2em', opacity: 0.4, marginBottom: '0.75rem' }}>NOMBRE</label>
              <input
                type="text" required value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.15)', color: '#f9f9f9', fontSize: '1rem', padding: '0.5rem 0', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.2em', opacity: 0.4, marginBottom: '0.75rem' }}>CORREO</label>
              <input
                type="email" required value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.15)', color: '#f9f9f9', fontSize: '1rem', padding: '0.5rem 0', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.2em', opacity: 0.4, marginBottom: '0.75rem' }}>TIPO DE PROYECTO</label>
              <select
                required value={form.service}
                onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
                style={{ width: '100%', background: '#0a0a0a', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.15)', color: form.service ? '#f9f9f9' : 'rgba(255,255,255,0.35)', fontSize: '1rem', padding: '0.5rem 0', outline: 'none', appearance: 'none' }}
              >
                <option value="" disabled>—</option>
                {CATEGORIES.filter(c => c !== 'Todos').map(c => <option key={c} value={c} style={{ color: '#0a0a0a', background: '#1a1a1a' }}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.2em', opacity: 0.4, marginBottom: '0.75rem' }}>MENSAJE</label>
              <textarea
                rows={4} required value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.15)', color: '#f9f9f9', fontSize: '1rem', padding: '0.5rem 0', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {formState === 'sent' && (
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.5)', margin: 0 }}>
                MENSAJE ENVIADO — EN BREVE ME PONGO EN CONTACTO.
              </p>
            )}
            {formState === 'error' && (
              <p style={{ fontSize: '0.75rem', letterSpacing: '0.15em', color: 'rgba(255,100,100,0.7)', margin: 0 }}>
                ALGO SALIÓ MAL. INTENTA DE NUEVO O ESCRIBE A hola@alexcardona.com
              </p>
            )}

            <button
              type="submit"
              disabled={formState === 'sending' || formState === 'sent'}
              style={{
                alignSelf: 'flex-start', marginTop: '0.5rem', padding: '0.85rem 2.5rem',
                background: formState === 'sent' ? 'rgba(255,255,255,0.3)' : '#fff',
                color: '#0a0a0a', border: 'none', fontSize: '0.7rem', letterSpacing: '0.2em',
                cursor: formState === 'sending' || formState === 'sent' ? 'default' : 'pointer',
                fontFamily: 'inherit', fontWeight: 600, transition: 'background 0.3s',
              }}
            >
              {formState === 'sending' ? 'ENVIANDO...' : formState === 'sent' ? 'ENVIADO' : 'ENVIAR'}
            </button>
          </form>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: '2rem 2.5rem', background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.25)' }}>ALEX CARDONA</span>
        <span style={{ fontSize: '0.65rem', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.2)' }}>&copy; {new Date().getFullYear()}</span>
      </footer>

      <style>{`
        @keyframes drop {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: block !important; }
          #sobre-mi > div { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
        }
      `}</style>
    </div>
  );
}
