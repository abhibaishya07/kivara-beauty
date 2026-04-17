import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useBeautyStore from '../../store/beautyStore';
import KrystalZone2 from './KrystalZone2';

gsap.registerPlugin(ScrollTrigger);

// ─── Pinterest image ──────────────────────────────────────────────────────────
const FLOWER_KNOWS_IMG = 'https://i.pinimg.com/736x/3d/f6/d3/3df6d3136158907d900be51d2f5e3b9d.jpg';

// ─── Pinterest/Instagram reel video (Flower Knows unboxing) ──────────────────
// Source: https://pin.it/45fm5hIBU → Instagram reel by @lisasdiary12_
// CDN expires: ~January 2027 (oe=69E4B717 hex)
const FLOWER_KNOWS_VIDEO = 'https://scontent-dfw6-1.cdninstagram.com/o1/v/t2/f2/m86/AQMA2roCY8ar2VKg9hB0goKi1gc3HFKFoa-s5_fBL7vesVLQXTbxuZS2mZfz0Q3_v5iuY3_JpF4yTNnEnpQJfSQDgabo496Z7wX6x80.mp4?_nc_cat=106&_nc_sid=5e9851&_nc_ht=scontent-dfw6-1.cdninstagram.com&_nc_ohc=nxOZ3KsMdnYQ7kNvwH_3cbW&ccb=17-1&vs=3b8a4d796b818d9e&_nc_gid=KNSpwrBiGw1G1foY6NhOZQ&_nc_ss=7a289&_nc_zt=28&oh=00_Af1fg17I5BH1hynqXFWZ3q0brkuU82ZxDjGg9QmlyqLvBg&oe=69E4B717';

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  roseGold:  '#B76E79',
  brass:     '#C5A059',
  deepRose:  '#8B2252',
  richPink:  '#C2185B',
  blush:     '#F8C8DC',
  espresso:  '#2C1E22',
  mutedRose: '#E8B4B8',
  white:     '#FFFFFF',
};

// ─── Glassmorphism panel ──────────────────────────────────────────────────────
const Glass = ({ children, style = {} }) => (
  <div style={{
    background: 'linear-gradient(135deg, rgba(255,255,255,0.55), rgba(255,240,245,0.30))',
    backdropFilter: 'blur(20px) saturate(200%)',
    WebkitBackdropFilter: 'blur(20px) saturate(200%)',
    border: '1px solid rgba(255,255,255,0.65)',
    boxShadow: '0 8px 40px rgba(183,110,121,0.18)',
    borderRadius: 20,
    ...style,
  }}>
    {children}
  </div>
);

// ─── Rose-gold star ───────────────────────────────────────────────────────────
const Star = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="#C5A059">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// ─── Hero right panel: 2-column collage (image + video) ─────────────────────
function FlowerKnowsPaletteDisplay({ visible }) {
  const wrapRef = useRef();
  const videoRef = useRef();

  useEffect(() => {
    if (!wrapRef.current) return;
    if (visible) {
      gsap.to(wrapRef.current, { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'power3.out', delay: 0.35 });
      // Autoplay video when zone appears
      if (videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    } else {
      gsap.to(wrapRef.current, { opacity: 0, y: 20, scale: 0.96, duration: 0.45, ease: 'power2.in' });
    }
  }, [visible]);

  return (
    <div
      ref={wrapRef}
      style={{
        width: '100%',
        maxWidth: 500,
        opacity: 0,
        transform: 'translateY(20px) scale(0.96)',
      }}
    >
      {/* Outer glow blob */}
      <div style={{
        position: 'absolute',
        inset: -60,
        background: 'radial-gradient(ellipse at 60% 50%, rgba(194,24,91,0.14) 0%, transparent 70%)',
        filter: 'blur(30px)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* ── 2-column collage grid ── */}
      <div style={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 14,
        alignItems: 'start',
        zIndex: 1,
      }}>

        {/* ── LEFT: Flower Knows Palette Image ── */}
        <div style={{ position: 'relative', animation: 'float-gentle 5s ease-in-out infinite' }}>
          {/* Brand pill */}
          <div style={{
            position: 'absolute', top: -14, left: 10, zIndex: 4,
          }}>
            <Glass style={{ padding: '5px 12px', borderRadius: 50 }}>
              <span style={{
                fontFamily: "'Inter', sans-serif", fontSize: 9, fontWeight: 700,
                color: C.deepRose, letterSpacing: 2.5, textTransform: 'uppercase',
              }}>✦ Flower Knows</span>
            </Glass>
          </div>

          {/* Image */}
          <div style={{
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(194,24,91,0.18), 0 6px 20px rgba(0,0,0,0.06)',
          }}>
            <img
              src={FLOWER_KNOWS_IMG}
              alt="Flower Knows Dreamy Makeup Flat Lay"
              onError={e => { e.target.src = 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=600'; }}
              style={{
                width: '100%', height: 380, objectFit: 'cover', display: 'block',
              }}
            />
            {/* Shimmer */}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 20,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.07), transparent 60%, rgba(183,110,121,0.04))',
              pointerEvents: 'none',
            }} />
          </div>

          {/* Stars badge */}
          <div style={{ position: 'absolute', bottom: -14, right: 10, zIndex: 4 }}>
            <Glass style={{ padding: '6px 12px', borderRadius: 50 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {[1,2,3,4,5].map(i => <Star key={i} />)}
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 700, color: C.espresso, marginLeft: 3 }}>4.9</span>
              </div>
            </Glass>
          </div>
        </div>

        {/* ── RIGHT: Flower Knows Reel Video ── */}
        <div style={{
          position: 'relative',
          marginTop: 28,   /* offset for stagger effect */
          animation: 'float-gentle 5.5s ease-in-out infinite',
          animationDelay: '0.8s',
        }}>
          {/* Reel badge */}
          <div style={{ position: 'absolute', top: -14, left: 10, zIndex: 4 }}>
            <Glass style={{ padding: '5px 12px', borderRadius: 50 }}>
              <span style={{
                fontFamily: "'Inter', sans-serif", fontSize: 9, fontWeight: 700,
                color: C.richPink, letterSpacing: 2, textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                <span style={{
                  width: 7, height: 7, borderRadius: '50%', background: C.richPink,
                  animation: 'pulseGlow 1.5s ease-in-out infinite',
                  flexShrink: 0, display: 'inline-block',
                }} />
                Live Reel
              </span>
            </Glass>
          </div>

          {/* Video */}
          <div style={{
            borderRadius: 20, overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(194,24,91,0.15), 0 6px 20px rgba(0,0,0,0.08)',
            background: 'rgba(248,200,220,0.2)',
          }}>
            <video
              ref={videoRef}
              src={FLOWER_KNOWS_VIDEO}
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: '100%', height: 330, objectFit: 'cover', display: 'block',
                borderRadius: 20,
              }}
            />
            {/* Shimmer overlay */}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 20,
              background: 'linear-gradient(to bottom, transparent 60%, rgba(194,24,91,0.06))',
              pointerEvents: 'none',
            }} />
          </div>

          {/* View label */}
          <div style={{ position: 'absolute', bottom: -14, right: 10, zIndex: 4 }}>
            <Glass style={{ padding: '5px 12px', borderRadius: 50 }}>
              <span style={{
                fontFamily: "'Inter', sans-serif", fontSize: 9, fontWeight: 700,
                color: C.espresso, letterSpacing: 2, textTransform: 'uppercase',
              }}>✦ Unboxing</span>
            </Glass>
          </div>
        </div>
      </div>

      {/* Bottom decorative sparkles row */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 18, marginTop: 28,
      }}>
        {['✦', '🌸', '✦', '💫', '✦'].map((s, i) => (
          <span key={i} style={{
            color: i % 2 === 0 ? C.brass : C.richPink,
            fontSize: i === 1 || i === 3 ? 14 : 10, opacity: 0.65,
            animation: `float-slow ${2 + i * 0.3}s ease-in-out infinite`,
            animationDelay: `${i * 0.25}s`,
          }}>{s}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Zone 0: Hero ─────────────────────────────────────────────────────────────
function Zone0({ visible }) {
  const textRef   = useRef();
  const rightRef  = useRef();

  useEffect(() => {
    if (!textRef.current || !rightRef.current) return;
    if (visible) {
      gsap.fromTo([textRef.current], { opacity: 0, x: -30 },
        { opacity: 1, x: 0, duration: 1, ease: 'power3.out', delay: 0.1 });
      gsap.fromTo([rightRef.current], { opacity: 0, x: 30 },
        { opacity: 1, x: 0, duration: 1, ease: 'power3.out', delay: 0.2 });
    } else {
      gsap.to([textRef.current, rightRef.current], { opacity: 0, duration: 0.35 });
    }
  }, [visible]);

  return (
    <div
      className="absolute inset-0 flex items-center"
      style={{
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.4s ease',
        pointerEvents: visible ? 'auto' : 'none',
        padding: '0 48px',
      }}
    >
      {/* Left — text */}
      <div ref={textRef} style={{ flex: 1, paddingRight: 24, maxWidth: 520 }}>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: 11,
          letterSpacing: 6, textTransform: 'uppercase', color: C.roseGold, marginBottom: 20,
        }}>
          Kivara Beauty · 2026 Collection
        </p>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(2.6rem, 5.5vw, 5.4rem)',
          fontWeight: 700, color: C.espresso,
          lineHeight: 1.08, letterSpacing: '-0.025em', marginBottom: 22,
        }}>
          The Era of<br />
          <em style={{
            fontStyle: 'italic',
            background: `linear-gradient(135deg, ${C.richPink}, ${C.roseGold}, ${C.brass})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Ethereal
          </em>{' '}Beauty
        </h1>

        <p style={{
          fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: 15,
          color: 'rgba(44,30,34,0.60)', lineHeight: 1.75, maxWidth: 400, marginBottom: 32,
        }}>
          Discover a world where science meets artistry — premium makeup and skincare,
          curated for every complexion, crafted for every occasion.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
          <Link to="/shop?category=Lips" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '13px 30px', borderRadius: 50, textDecoration: 'none',
            fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 12,
            letterSpacing: 2, textTransform: 'uppercase', color: '#fff',
            background: `linear-gradient(135deg, ${C.richPink}, ${C.deepRose})`,
            boxShadow: '0 8px 32px rgba(194,24,91,0.35)',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(194,24,91,0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(194,24,91,0.35)'; }}
          >
            💋 Shop Collection
          </Link>
          <Link to="/shop" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '13px 28px', borderRadius: 50, textDecoration: 'none',
            fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 12,
            letterSpacing: 2, textTransform: 'uppercase', color: C.roseGold,
            border: `2px solid ${C.roseGold}`, transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(183,110,121,0.08)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            Explore All →
          </Link>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 28 }}>
          {[
            ['56+', 'Products'],
            ['15+', 'Brands'],
            ['4.9★', 'Rating'],
          ].map(([val, label]) => (
            <div key={label}>
              <p style={{
                fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700,
                color: C.richPink, letterSpacing: '-0.01em',
              }}>{val}</p>
              <p style={{
                fontFamily: "'Inter', sans-serif", fontSize: 10, fontWeight: 400,
                color: 'rgba(44,30,34,0.45)', letterSpacing: 3, textTransform: 'uppercase', marginTop: 2,
              }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Scroll cue */}
        <div style={{ marginTop: 48, display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 1, height: 40, background: `linear-gradient(to bottom, ${C.roseGold}, transparent)`,
            animation: 'pulseGlow 2s ease-in-out infinite',
          }} />
          <span style={{
            fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: 5,
            textTransform: 'uppercase', color: C.roseGold, fontWeight: 500,
          }}>
            🎀 Scroll to discover
          </span>
        </div>
      </div>

      {/* Right — Flower Knows 2-column collage */}
      <div ref={rightRef} style={{
        flex: '0 0 auto', width: 'min(560px, 48vw)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <FlowerKnowsPaletteDisplay visible={visible} />
      </div>
    </div>
  );
}

// ─── Zone 1: Category portals ─────────────────────────────────────────────────
function Zone1({ visible }) {
  const containerRef = useRef();

  useEffect(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll('.portal-card');
    if (visible) {
      gsap.fromTo(containerRef.current.querySelector('.zone1-label'),
        { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' });
      gsap.fromTo(cards,
        { opacity: 0, x: -36 },
        { opacity: 1, x: 0, stagger: 0.15, duration: 0.8, ease: 'power3.out', delay: 0.15 });
    } else {
      gsap.to([containerRef.current.querySelector('.zone1-label'), ...cards],
        { opacity: 0, duration: 0.3 });
    }
  }, [visible]);

  const portals = [
    { id: 'skincare',  label: 'Curated Skincare',  sub: 'Science-backed rituals for radiant skin', emoji: '🌿', link: '/shop?category=Skincare',   grad: 'linear-gradient(135deg, rgba(232,180,184,0.7), rgba(248,200,220,0.5))' },
    { id: 'makeup',    label: 'Ethereal Makeup',    sub: 'Pigment-rich artistry for every mood',    emoji: '💄', link: '/shop?category=Lips',         grad: 'linear-gradient(135deg, rgba(194,24,91,0.18), rgba(183,110,121,0.45))' },
    { id: 'haircare',  label: 'Luxe Hair Care',     sub: 'Indulgent formulas for luminous locks',   emoji: '✨', link: '/shop?category=Hair+Care',    grad: 'linear-gradient(135deg, rgba(197,160,89,0.25), rgba(248,200,220,0.4))' },
    { id: 'eyes',      label: 'Statement Eyes',     sub: 'Palettes, liners & mascaras',             emoji: '👁️', link: '/shop?category=Eyes',         grad: 'linear-gradient(135deg, rgba(139,34,82,0.18), rgba(194,24,91,0.35))' },
  ];

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 flex items-center"
      style={{
        opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease',
        pointerEvents: visible ? 'auto' : 'none',
        padding: '0 48px',
      }}
    >
      <div style={{ maxWidth: 400, width: '100%' }}>
        <p className="zone1-label" style={{
          fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: 11,
          letterSpacing: 6, textTransform: 'uppercase', color: C.roseGold, marginBottom: 28,
        }}>
          Browse the Collection
        </p>

        {portals.map((p) => (
          <Link
            key={p.id}
            to={p.link}
            className="portal-card"
            style={{
              display: 'flex', alignItems: 'center', gap: 16, textDecoration: 'none',
              padding: '16px 20px', borderRadius: 18, marginBottom: 12,
              background: p.grad,
              backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
              border: '1px solid rgba(255,255,255,0.55)',
              boxShadow: '0 4px 20px rgba(183,110,121,0.12)',
              transition: 'transform 0.25s, box-shadow 0.25s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateX(8px) scale(1.01)';
              e.currentTarget.style.boxShadow = '0 10px 36px rgba(194,24,91,0.22)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(183,110,121,0.12)';
            }}
          >
            <span style={{ fontSize: 28 }}>{p.emoji}</span>
            <div style={{ flex: 1 }}>
              <p style={{
                fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700,
                color: C.espresso, marginBottom: 2, letterSpacing: '-0.01em',
              }}>{p.label}</p>
              <p style={{
                fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 300,
                color: 'rgba(44,30,34,0.55)', lineHeight: 1.5,
              }}>{p.sub}</p>
            </div>
            <span style={{ color: C.roseGold, fontSize: 16, opacity: 0.8 }}>→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Zone 2 is now the full real Krystal AI agent — imported from KrystalZone2.jsx

// ─── Zone 3: Reviews ──────────────────────────────────────────────────────────
const REVIEWS = [
  { name: 'Priya M.',  product: 'Charlotte Tilbury Foundation',   text: 'My skin has never looked more luminous — like wearing pure light.' },
  { name: 'Anika S.',  product: 'Rhode Peptide Lip Tint',          text: 'Silky, hydrating perfection. I own four shades and counting.' },
  { name: 'Roshni K.', product: 'Flower Knows Strawberry Rococo', text: 'The most beautiful compact I\'ve ever owned. Museum-worthy design.' },
  { name: 'Sana T.',   product: 'Anua Niacinamide Serum',          text: 'Glass skin in a bottle. Korean skincare at its absolute finest.' },
  { name: 'Meera D.',  product: 'Gisou Honey Hair Oil',            text: 'My hair is shinier than ever. The honey scent is intoxicating.' },
];

function Zone3({ visible }) {
  const containerRef = useRef();

  useEffect(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll('.rev-card');
    if (visible) {
      gsap.fromTo(containerRef.current.querySelector('.zone3-head'),
        { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
      gsap.fromTo(cards,
        { opacity: 0, x: -32 },
        { opacity: 1, x: 0, stagger: 0.1, duration: 0.8, ease: 'power3.out', delay: 0.2 });
    } else {
      gsap.to([containerRef.current.querySelector('.zone3-head'), ...cards], { opacity: 0, duration: 0.3 });
    }
  }, [visible]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 flex flex-col justify-center"
      style={{
        opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease',
        pointerEvents: visible ? 'auto' : 'none',
        padding: '0 48px',
      }}
    >
      <div className="zone3-head" style={{ marginBottom: 28 }}>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: 10,
          letterSpacing: 6, textTransform: 'uppercase', color: C.roseGold, marginBottom: 10,
        }}>Beloved by Thousands</p>
        <h2 style={{
          fontFamily: "'Playfair Display', serif", fontWeight: 700,
          fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: C.espresso,
          letterSpacing: '-0.02em', lineHeight: 1.1,
        }}>
          Voices of the{' '}
          <em style={{
            fontStyle: 'italic',
            background: `linear-gradient(135deg, ${C.richPink}, ${C.brass})`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>Ethereal Court</em>
        </h2>
      </div>

      <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 6 }}>
        {REVIEWS.map(r => (
          <div key={r.name} className="rev-card" style={{
            minWidth: 250, maxWidth: 270, flexShrink: 0,
            padding: '18px 20px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.55), rgba(255,240,245,0.32))',
            backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
            border: '1px solid rgba(255,255,255,0.62)',
            boxShadow: '0 6px 28px rgba(183,110,121,0.14)',
            borderRadius: 18,
          }}>
            <div style={{ display: 'flex', gap: 2, marginBottom: 10 }}>
              {[...Array(5)].map((_, i) => <Star key={i} />)}
            </div>
            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 300,
              color: C.espresso, lineHeight: 1.7, marginBottom: 12, fontStyle: 'italic',
            }}>"{r.text}"</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 13, fontWeight: 700, color: C.roseGold }}>{r.name}</p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: 'rgba(44,30,34,0.4)', marginTop: 2, letterSpacing: 0.4 }}>{r.product}</p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 28, display: 'flex', gap: 14 }}>
        <Link to="/shop" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none',
          padding: '13px 32px', borderRadius: 50,
          fontFamily: "'Inter', sans-serif", fontWeight: 700, fontSize: 11,
          letterSpacing: 2.5, textTransform: 'uppercase', color: '#fff',
          background: `linear-gradient(135deg, ${C.richPink}, ${C.deepRose})`,
          boxShadow: '0 8px 28px rgba(194,24,91,0.35)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 14px 40px rgba(194,24,91,0.5)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(194,24,91,0.35)'; }}
        >
          Enter the Collection ✦
        </Link>
      </div>
    </div>
  );
}

// ─── Glassmorphic navbar ──────────────────────────────────────────────────────
function EtherealNav() {
  return (
    <nav style={{
      position: 'absolute', top: 22, left: '50%', transform: 'translateX(-50%)',
      zIndex: 50, pointerEvents: 'auto', whiteSpace: 'nowrap',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.55), rgba(255,240,245,0.32))',
      backdropFilter: 'blur(22px) saturate(200%)', WebkitBackdropFilter: 'blur(22px) saturate(200%)',
      border: '1px solid rgba(255,255,255,0.65)',
      boxShadow: '0 8px 36px rgba(183,110,121,0.14)',
      borderRadius: 50, padding: '10px 26px',
      display: 'flex', alignItems: 'center', gap: 28,
    }}>
      <Link to="/" style={{
        fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 18,
        color: C.espresso, textDecoration: 'none', letterSpacing: '-0.01em',
      }}>Kivara</Link>

      {[['Shop All', '/shop'], ['Lips', '/shop?category=Lips'], ['Skincare', '/shop?category=Skincare'], ['Hair Care', '/shop?category=Hair+Care']].map(([label, href]) => (
        <Link key={href} to={href} style={{
          fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: 12,
          color: C.roseGold, textDecoration: 'none',
          letterSpacing: 2, textTransform: 'uppercase', transition: 'color 0.2s',
        }}
          onMouseEnter={e => e.target.style.color = C.espresso}
          onMouseLeave={e => e.target.style.color = C.roseGold}
        >{label}</Link>
      ))}

      <Link to="/login" style={{
        fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 11,
        color: '#fff', padding: '8px 20px', borderRadius: 50, textDecoration: 'none',
        background: `linear-gradient(135deg, ${C.richPink}, ${C.deepRose})`,
        letterSpacing: 1.5, textTransform: 'uppercase',
        boxShadow: '0 4px 16px rgba(194,24,91,0.3)',
      }}>Account</Link>
    </nav>
  );
}

// ─── Root export ──────────────────────────────────────────────────────────────
export default function ScrollDOMOverlay({ scrollContainerRef }) {
  const setScrollProgress = useBeautyStore(s => s.setScrollProgress);
  const setMouseNorm      = useBeautyStore(s => s.setMouseNorm);
  const activeZone        = useBeautyStore(s => s.activeZone);

  useEffect(() => {
    if (!scrollContainerRef?.current) return;
    const trigger = ScrollTrigger.create({
      trigger: scrollContainerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.5,
      onUpdate: self => setScrollProgress(self.progress),
    });
    return () => trigger.kill();
  }, []);

  useEffect(() => {
    const handler = e => setMouseNorm(
      (e.clientX / window.innerWidth)  * 2 - 1,
      (e.clientY / window.innerHeight) * 2 - 1,
    );
    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return (
    <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', overflow: 'hidden' }}>
      <EtherealNav />
      <Zone0 visible={activeZone === 0} />
      <Zone1 visible={activeZone === 1} />
      <KrystalZone2 visible={activeZone === 2} />
      <Zone3 visible={activeZone === 3} />
    </div>
  );
}
