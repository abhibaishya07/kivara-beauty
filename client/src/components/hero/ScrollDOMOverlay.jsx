import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useBeautyStore from '../../store/beautyStore';
import { getProducts } from '../../api/productApi';

gsap.registerPlugin(ScrollTrigger);

// ─── Glassmorphism panel (reusable) ─────────────────────────────────────────
const Glass = ({ children, className = '', style = {} }) => (
  <div
    className={className}
    style={{
      background: 'linear-gradient(135deg, rgba(255,255,255,0.42), rgba(255,240,245,0.22))',
      backdropFilter: 'blur(18px) saturate(180%)',
      WebkitBackdropFilter: 'blur(18px) saturate(180%)',
      border: '1px solid rgba(255,255,255,0.52)',
      boxShadow: '0 8px 32px 0 rgba(248,200,220,0.22)',
      borderRadius: 20,
      ...style,
    }}
  >
    {children}
  </div>
);

// ─── Bow / pearl scroll indicator ────────────────────────────────────────────
function ScrollCue() {
  return (
    <div className="flex flex-col items-center gap-2 animate-bounce-gentle">
      <span style={{ fontSize: 22, lineHeight: 1 }}>🎀</span>
      <div style={{
        width: 1, height: 52, background: 'linear-gradient(to bottom, rgba(183,110,121,0.6), transparent)',
      }} />
      <p style={{
        fontSize: 10, letterSpacing: 5, textTransform: 'uppercase',
        color: '#B76E79', fontFamily: "'Inter', sans-serif", fontWeight: 500,
      }}>
        Scroll
      </p>
    </div>
  );
}

// ─── Rose-gold star ───────────────────────────────────────────────────────────
const Star = ({ filled = true }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? '#C5A059' : 'none'}
    stroke="#C5A059" strokeWidth="1.5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

// ─── Zone 0: Hero Arrival ─────────────────────────────────────────────────────
function Zone0() {
  const headRef  = useRef();
  const sub1Ref  = useRef();
  const sub2Ref  = useRef();
  const cueRef   = useRef();
  const { activeZone } = useBeautyStore();

  const visible = activeZone === 0;

  useEffect(() => {
    const els = [headRef.current, sub1Ref.current, sub2Ref.current];
    if (visible) {
      gsap.fromTo(els, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, stagger: 0.15, duration: 1, ease: 'power3.out', delay: 0.1,
      });
    } else {
      gsap.to(els, { opacity: 0, y: -16, duration: 0.4, ease: 'power2.in' });
    }
  }, [visible]);

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s ease' }}
    >
      {/* Eyebrow */}
      <p ref={sub1Ref} style={{
        fontFamily: "'Inter', sans-serif", fontWeight: 300,
        fontSize: 11, letterSpacing: 7, textTransform: 'uppercase',
        color: '#B76E79', marginBottom: 20,
      }}>
        Kivara Beauty · 2026 Collection
      </p>

      {/* Hero headline */}
      <h1 ref={headRef} style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 'clamp(2.8rem, 7vw, 6.5rem)',
        fontWeight: 700,
        color: '#2C1E22',
        textAlign: 'center',
        lineHeight: 1.1,
        letterSpacing: '-0.02em',
        maxWidth: 780,
        marginBottom: 24,
      }}>
        The Era of{' '}
        <em style={{
          fontStyle: 'italic',
          background: 'linear-gradient(135deg, #B76E79, #E8B4B8, #C5A059)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Ethereal
        </em>
        {' '}Beauty
      </h1>

      {/* Subline */}
      <p ref={sub2Ref} style={{
        fontFamily: "'Inter', sans-serif", fontWeight: 300,
        fontSize: 16, color: 'rgba(44,30,34,0.55)',
        letterSpacing: 0.5, maxWidth: 460, textAlign: 'center', lineHeight: 1.7,
        marginBottom: 60,
      }}>
        Discover a curated world where science meets artistry — premium beauty, 
        crafted for every complexion.
      </p>

      {/* Scroll cue */}
      <div ref={cueRef} style={{ pointerEvents: 'none' }}>
        <ScrollCue />
      </div>
    </div>
  );
}

// ─── Zone 1: Product Expansion + category portals ────────────────────────────
function Zone1() {
  const cardsRef  = useRef([]);
  const labelRef  = useRef();
  const { activeZone, setHoveredCard } = useBeautyStore();
  const visible = activeZone === 1;

  useEffect(() => {
    if (visible) {
      gsap.fromTo(labelRef.current, { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.1,
      });
      gsap.fromTo(cardsRef.current, { opacity: 0, x: -40 }, {
        opacity: 1, x: 0, stagger: 0.18, duration: 0.9, ease: 'power3.out', delay: 0.25,
      });
    } else {
      gsap.to([labelRef.current, ...cardsRef.current], {
        opacity: 0, duration: 0.3, ease: 'power1.in',
      });
    }
  }, [visible]);

  const portals = [
    {
      id: 'skincare',
      label: 'Curated Skincare',
      sub: 'Science-backed rituals for radiant skin',
      emoji: '🌿',
      link: '/shop?category=Skincare',
      grad: 'linear-gradient(135deg, rgba(232,180,184,0.6), rgba(248,200,220,0.4))',
    },
    {
      id: 'makeup',
      label: 'Ethereal Makeup',
      sub: 'Pigment-rich artistry for every mood',
      emoji: '💄',
      link: '/shop?category=Lips',
      grad: 'linear-gradient(135deg, rgba(197,160,89,0.3), rgba(183,110,121,0.5))',
    },
    {
      id: 'haircare',
      label: 'Luxe Hair Care',
      sub: 'Indulgent formulas for luminous locks',
      emoji: '✨',
      link: '/shop?category=Hair+Care',
      grad: 'linear-gradient(135deg, rgba(248,200,220,0.5), rgba(232,180,184,0.35))',
    },
  ];

  return (
    <div
      className="absolute inset-0 flex items-center pointer-events-none"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease', paddingLeft: 48 }}
    >
      <div style={{ maxWidth: 340, pointerEvents: visible ? 'auto' : 'none' }}>
        <p ref={labelRef} style={{
          fontFamily: "'Inter', sans-serif", fontWeight: 300,
          fontSize: 11, letterSpacing: 6, textTransform: 'uppercase',
          color: '#B76E79', marginBottom: 28,
        }}>
          Browse the Collection
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {portals.map((p, i) => (
            <Link
              key={p.id}
              to={p.link}
              ref={el => cardsRef.current[i] = el}
              onMouseEnter={() => setHoveredCard(p.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                display: 'block', textDecoration: 'none', padding: '18px 22px',
                borderRadius: 18, cursor: 'pointer',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                background: p.grad,
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.5)',
                boxShadow: '0 6px 24px rgba(248,200,220,0.15)',
              }}
              onMouseEnter={(e) => {
                setHoveredCard(p.id);
                e.currentTarget.style.transform = 'translateX(6px) scale(1.01)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(183,110,121,0.3)';
              }}
              onMouseLeave={(e) => {
                setHoveredCard(null);
                e.currentTarget.style.transform = 'translateX(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(248,200,220,0.15)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 26 }}>{p.emoji}</span>
                <div>
                  <p style={{
                    fontFamily: "'Playfair Display', serif",
                    color: '#2C1E22', fontSize: 17, fontWeight: 600, marginBottom: 3,
                    letterSpacing: '-0.01em',
                  }}>
                    {p.label}
                  </p>
                  <p style={{
                    fontFamily: "'Inter', sans-serif",
                    color: 'rgba(44,30,34,0.55)', fontSize: 12, fontWeight: 300,
                    letterSpacing: 0.3, lineHeight: 1.5,
                  }}>
                    {p.sub}
                  </p>
                </div>
                <span style={{ marginLeft: 'auto', color: '#B76E79', fontSize: 18, opacity: 0.7 }}>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Zone 2: Exploded view + Skincare AI interface ──────────────────────────
function Zone2() {
  const panelRef = useRef();
  const inputRef = useRef();
  const { activeZone, chatMessages, chatLoading, addMessage, setChatLoading } = useBeautyStore();
  const visible = activeZone === 2;

  useEffect(() => {
    if (visible && panelRef.current) {
      gsap.fromTo(panelRef.current,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.3 }
      );
    } else if (panelRef.current) {
      gsap.to(panelRef.current, { opacity: 0, y: 30, duration: 0.35, ease: 'power2.in' });
    }
  }, [visible]);

  const handleSend = async () => {
    const text = inputRef.current?.value?.trim();
    if (!text) return;
    inputRef.current.value = '';
    addMessage({ role: 'user', content: text });
    setChatLoading(true);
    try {
      const res = await fetch('/api/glowbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      addMessage({ role: 'assistant', content: data.reply || data.message || 'Let me help you find the perfect routine ✨' });
    } catch {
      addMessage({ role: 'assistant', content: 'I\'m here to guide you to your perfect beauty ritual. 🌸' });
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div
      className="absolute inset-0 flex items-end justify-center pointer-events-none"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease', paddingBottom: 40 }}
    >
      <Glass
        ref={panelRef}
        style={{
          width: '100%', maxWidth: 560, padding: '28px 32px',
          pointerEvents: visible ? 'auto' : 'none',
          borderRadius: 24,
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'linear-gradient(135deg, #B76E79, #E8B4B8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 0 3px rgba(183,110,121,0.15)',
          }}>
            <span style={{ fontSize: 20 }}>✨</span>
          </div>
          <div>
            <p style={{
              fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700,
              color: '#2C1E22', letterSpacing: '-0.01em', marginBottom: 2,
            }}>
              Beauty Intelligence
            </p>
            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: 11, color: '#B76E79',
              fontWeight: 400, letterSpacing: 2, textTransform: 'uppercase',
            }}>
              · Active · Personalizing
            </p>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <div style={{ /* pulsing dot */
              width: 8, height: 8, borderRadius: '50%',
              background: '#B76E79', animation: 'pulseGlow 1.8s ease-in-out infinite',
            }} />
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(183,110,121,0.3), transparent)', marginBottom: 18 }} />

        {/* Suggested prompts */}
        {chatMessages.length === 0 && (
          <div style={{ marginBottom: 16 }}>
            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: 11, color: 'rgba(44,30,34,0.45)',
              letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12,
            }}>
              Suggested
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['Dry, sensitive skin', 'Anti-aging routine', 'Oily skin + acne', 'Bright & dewy glow'].map(s => (
                <button key={s}
                  onClick={() => { if (inputRef.current) inputRef.current.value = s; }}
                  style={{
                    fontFamily: "'Inter', sans-serif", fontSize: 11, fontWeight: 400,
                    color: '#B76E79', padding: '5px 12px', borderRadius: 50,
                    border: '1px solid rgba(183,110,121,0.3)',
                    background: 'rgba(248,200,220,0.12)', cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => e.target.style.background = 'rgba(183,110,121,0.15)'}
                  onMouseLeave={e => e.target.style.background = 'rgba(248,200,220,0.12)'}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat log */}
        {chatMessages.length > 0 && (
          <div style={{
            maxHeight: 180, overflowY: 'auto', marginBottom: 14,
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            {chatMessages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '82%',
                background: m.role === 'user'
                  ? 'linear-gradient(135deg, #B76E79, #c2185b)'
                  : 'rgba(255,255,255,0.5)',
                color: m.role === 'user' ? '#fff' : '#2C1E22',
                padding: '9px 14px', borderRadius: 14,
                fontFamily: "'Inter', sans-serif", fontSize: 13, lineHeight: 1.6,
              }}>
                {m.content}
              </div>
            ))}
            {chatLoading && (
              <div style={{ alignSelf: 'flex-start', color: '#B76E79', fontSize: 20 }}>
                <span style={{ animation: 'ellipsis 1.4s infinite' }}>···</span>
              </div>
            )}
          </div>
        )}

        {/* Input */}
        <div style={{ position: 'relative', display: 'flex', gap: 10 }}>
          <input
            ref={inputRef}
            placeholder="Detail your skin concerns…"
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            style={{
              flex: 1, padding: '12px 18px',
              fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 300,
              color: '#2C1E22', background: 'rgba(255,255,255,0.55)',
              border: '1px solid rgba(183,110,121,0.28)',
              borderRadius: 50, outline: 'none',
              boxShadow: 'inset 0 1px 4px rgba(183,110,121,0.08)',
              letterSpacing: 0.3,
            }}
          />
          <button
            onClick={handleSend}
            style={{
              width: 44, height: 44, borderRadius: '50%', border: 'none',
              background: 'linear-gradient(135deg, #B76E79, #E8B4B8)',
              color: '#fff', cursor: 'pointer', fontSize: 18,
              boxShadow: '0 4px 16px rgba(183,110,121,0.4)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            onMouseEnter={e => { e.target.style.transform = 'scale(1.08)'; }}
            onMouseLeave={e => { e.target.style.transform = 'scale(1)'; }}
          >
            ✦
          </button>
        </div>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 10, color: 'rgba(183,110,121,0.5)',
          textAlign: 'center', marginTop: 10, letterSpacing: 1,
        }}>
          Powered by Kivara Intelligence · Personalized Beauty Rituals
        </p>
      </Glass>
    </div>
  );
}

// ─── Zone 3: Reviews + CTA ───────────────────────────────────────────────────
const REVIEWS = [
  { name: 'Priya M.', product: 'Charlotte Tilbury Foundation', text: 'My skin has never looked more luminous. The coverage is divine, like a second skin.', rating: 5 },
  { name: 'Anika S.', product: 'Rhode Peptide Lip Tint', text: 'Silky, hydrating, and the colour is just *chef\'s kiss*. I own four shades already.', rating: 5 },
  { name: 'Roshni K.', product: 'Flower Knows Blush', text: 'The most beautiful compact I\'ve ever owned. That embossed design is museum-worthy.', rating: 5 },
  { name: 'Meera D.', product: 'Gisou Honey Hair Oil', text: 'My hair is shinier than ever. The honey scent is absolutely intoxicating.', rating: 5 },
  { name: 'Sana T.', product: 'Anua Niacinamide Serum', text: 'Glass skin in a bottle. Korean skincare at its absolute finest.', rating: 5 },
];

function Zone3() {
  const sectionRef = useRef();
  const { activeZone } = useBeautyStore();
  const visible = activeZone === 3;

  useEffect(() => {
    if (!sectionRef.current) return;
    const cards = sectionRef.current.querySelectorAll('.review-card');
    if (visible) {
      gsap.fromTo(cards,
        { opacity: 0, x: -40 },
        { opacity: 1, x: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out', delay: 0.2 }
      );
    } else {
      gsap.to(cards, { opacity: 0, duration: 0.3 });
    }
  }, [visible]);

  return (
    <div
      ref={sectionRef}
      className="absolute inset-0 flex flex-col justify-center pointer-events-none"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.5s ease', paddingLeft: 48, paddingRight: 48 }}
    >
      <p style={{
        fontFamily: "'Inter', sans-serif", fontWeight: 300, fontSize: 10,
        letterSpacing: 6, textTransform: 'uppercase', color: '#B76E79', marginBottom: 12,
        pointerEvents: 'none',
      }}>
        Beloved by Thousands
      </p>
      <h2 style={{
        fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 4vw, 3.2rem)',
        fontWeight: 700, color: '#2C1E22', letterSpacing: '-0.02em',
        marginBottom: 30, pointerEvents: 'none',
      }}>
        Voices of the{' '}
        <em style={{
          background: 'linear-gradient(135deg, #B76E79, #C5A059)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', fontStyle: 'italic',
        }}>
          Ethereal Court
        </em>
      </h2>

      {/* Horizontal scroll carousel */}
      <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
        {REVIEWS.map((r) => (
          <div
            key={r.name}
            className="review-card"
            style={{
              minWidth: 260, maxWidth: 280, padding: '20px 22px',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.48), rgba(255,240,245,0.28))',
              backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.52)',
              boxShadow: '0 8px 32px rgba(248,200,220,0.18)',
              borderRadius: 20, pointerEvents: visible ? 'auto' : 'none',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', gap: 3, marginBottom: 12 }}>
              {[...Array(r.rating)].map((_, i) => <Star key={i} filled />)}
            </div>
            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 300,
              color: '#2C1E22', lineHeight: 1.7, marginBottom: 14, fontStyle: 'italic',
            }}>
              "{r.text}"
            </p>
            <div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 13, color: '#B76E79' }}>
                {r.name}
              </p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 10, color: 'rgba(44,30,34,0.45)', marginTop: 2, letterSpacing: 0.5 }}>
                {r.product}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ marginTop: 32, display: 'flex', gap: 14, pointerEvents: visible ? 'auto' : 'none' }}>
        <Link to="/shop" style={{
          fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600,
          letterSpacing: 3, textTransform: 'uppercase', textDecoration: 'none',
          color: '#fff', padding: '13px 32px', borderRadius: 50,
          background: 'linear-gradient(135deg, #B76E79, #E8B4B8)',
          boxShadow: '0 8px 28px rgba(183,110,121,0.35)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
          onMouseEnter={e => { e.target.style.transform = 'scale(1.04)'; e.target.style.boxShadow = '0 12px 36px rgba(183,110,121,0.5)'; }}
          onMouseLeave={e => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 8px 28px rgba(183,110,121,0.35)'; }}
        >
          Enter the Collection
        </Link>
      </div>
    </div>
  );
}

// ─── Sticky nav bar ───────────────────────────────────────────────────────────
function EtherealNav() {
  return (
    <nav style={{
      position: 'absolute', top: 24, left: '50%', transform: 'translateX(-50%)',
      zIndex: 50, pointerEvents: 'auto',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.45), rgba(255,240,245,0.25))',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.55)',
      boxShadow: '0 8px 32px rgba(248,200,220,0.18)',
      borderRadius: 50, padding: '10px 28px',
      display: 'flex', alignItems: 'center', gap: 32, whiteSpace: 'nowrap',
    }}>
      <Link to="/" style={{
        fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 17,
        color: '#2C1E22', textDecoration: 'none', letterSpacing: '-0.01em',
      }}>
        Kivara
      </Link>
      {[
        ['Shop All', '/shop'],
        ['Lips', '/shop?category=Lips'],
        ['Skincare', '/shop?category=Skincare'],
        ['Hair Care', '/shop?category=Hair+Care'],
      ].map(([label, href]) => (
        <Link key={href} to={href} style={{
          fontFamily: "'Inter', sans-serif", fontWeight: 400, fontSize: 12,
          color: '#B76E79', textDecoration: 'none', letterSpacing: 2,
          textTransform: 'uppercase', transition: 'color 0.2s',
        }}
          onMouseEnter={e => e.target.style.color = '#2C1E22'}
          onMouseLeave={e => e.target.style.color = '#B76E79'}
        >
          {label}
        </Link>
      ))}
      <Link to="/login" style={{
        fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 11,
        color: '#fff', padding: '7px 20px', borderRadius: 50, textDecoration: 'none',
        background: 'linear-gradient(135deg, #B76E79, #E8B4B8)',
        letterSpacing: 1.5, textTransform: 'uppercase',
      }}>
        Account
      </Link>
    </nav>
  );
}

// ─── Root scroll experience ───────────────────────────────────────────────────
export default function ScrollDOMOverlay({ scrollContainerRef }) {
  const setScrollProgress = useBeautyStore(s => s.setScrollProgress);
  const setMouseNorm      = useBeautyStore(s => s.setMouseNorm);

  // GSAP ScrollTrigger
  useEffect(() => {
    if (!scrollContainerRef?.current) return;

    const trigger = ScrollTrigger.create({
      trigger: scrollContainerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.5,
      onUpdate: (self) => setScrollProgress(self.progress),
    });

    return () => trigger.kill();
  }, []);

  // Mouse normalisation
  useEffect(() => {
    const handler = (e) => {
      setMouseNorm(
        (e.clientX / window.innerWidth)  * 2 - 1,
        (e.clientY / window.innerHeight) * 2 - 1,
      );
    };
    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return (
    /* This div is sticky — lives inside the tall scroll container */
    <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100%', overflow: 'hidden' }}>
      {/* Navbar always visible */}
      <EtherealNav />

      {/* Zone overlays */}
      <Zone0 />
      <Zone1 />
      <Zone2 />
      <Zone3 />
    </div>
  );
}
