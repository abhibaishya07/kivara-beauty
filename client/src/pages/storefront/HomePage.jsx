import { useRef, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../../components/layout/Footer';
import ScrollDOMOverlay from '../../components/hero/ScrollDOMOverlay';

// Lazy-load the heavy 3D canvas
const HeroCanvas = lazy(() => import('../../components/hero/HeroCanvas'));

// ─── Beautiful CSS-only loading fallback ─────────────────────────────────────
function EtherealLoadingFallback() {
  return (
    <div style={{
      position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(160deg, #FFF0F5 0%, #FAFAFA 50%, #FFF0F5 100%)',
      zIndex: 100,
    }}>
      {/* Pulsing ring */}
      <div style={{
        width: 90, height: 90, borderRadius: '50%',
        border: '2px solid rgba(183,110,121,0.15)',
        borderTop: '2px solid #B76E79',
        animation: 'spin 1.2s linear infinite',
        marginBottom: 28,
      }} />
      {/* Inner ring */}
      <div style={{
        position: 'absolute',
        width: 60, height: 60, borderRadius: '50%',
        border: '1px solid rgba(197,160,89,0.2)',
        borderBottom: '1px solid #C5A059',
        animation: 'spinReverse 1.8s linear infinite',
      }} />
      <p style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: 13, letterSpacing: 6, color: '#B76E79',
        textTransform: 'uppercase', fontWeight: 400,
      }}>
        Creating Magic…
      </p>
    </div>
  );
}

// ─── Newsletter section ───────────────────────────────────────────────────────
function Newsletter() {
  return (
    <section style={{
      background: 'linear-gradient(160deg, #1C0F12 0%, #3D1520 50%, #1C0F12 100%)',
      padding: '100px 24px', textAlign: 'center', position: 'relative', overflow: 'hidden',
    }}>
      {/* Glitter dots */}
      {[...Array(20)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: Math.random() > 0.5 ? 3 : 2, height: Math.random() > 0.5 ? 3 : 2,
          borderRadius: '50%', background: '#F8C8DC', opacity: 0.35,
          top: `${5 + i * 4.5}%`, left: `${3 + (i * 37) % 94}%`,
          animation: `pulse ${1.5 + (i % 3) * 0.8}s ease-in-out infinite`,
          animationDelay: `${(i * 0.2) % 2}s`,
        }} />
      ))}

      {/* Glow blob */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500, height: 300,
        background: 'radial-gradient(ellipse, rgba(183,110,121,0.18) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', maxWidth: 560, margin: '0 auto' }}>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 10, letterSpacing: 6,
          textTransform: 'uppercase', color: '#B76E79', marginBottom: 20,
          fontWeight: 400,
        }}>
          ✦ The Inner Circle
        </p>
        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(2rem, 5vw, 3.8rem)',
          fontWeight: 700, color: '#FAFAFA', lineHeight: 1.1,
          letterSpacing: '-0.02em', marginBottom: 18,
        }}>
          Join the{' '}
          <em style={{
            fontStyle: 'italic',
            background: 'linear-gradient(135deg, #F8C8DC, #C5A059)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Ethereal Court
          </em>
        </h2>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontWeight: 300,
          fontSize: 14, color: 'rgba(250,250,250,0.5)', lineHeight: 1.7,
          marginBottom: 36,
        }}>
          Receive early access to new collections, exclusive rituals,
          and curated beauty intelligence — directly in your inbox.
        </p>

        <form style={{ display: 'flex', gap: 12, maxWidth: 420, margin: '0 auto' }}
          onSubmit={e => e.preventDefault()}>
          <input
            placeholder="your@email.com"
            type="email"
            style={{
              flex: 1, padding: '13px 20px',
              fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 300,
              color: '#2C1E22', letterSpacing: 0.3,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 50, outline: 'none', color: '#fff',
            }}
          />
          <button style={{
            padding: '13px 28px', borderRadius: 50, border: 'none',
            background: 'linear-gradient(135deg, #B76E79, #E8B4B8)',
            color: '#fff', fontFamily: "'Inter', sans-serif",
            fontWeight: 600, fontSize: 12, letterSpacing: 2,
            textTransform: 'uppercase', cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(183,110,121,0.4)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            whiteSpace: 'nowrap',
          }}
            onMouseEnter={e => { e.target.style.transform = 'scale(1.04)'; }}
            onMouseLeave={e => { e.target.style.transform = 'scale(1)'; }}
          >
            Join ✦
          </button>
        </form>

        {/* Divider */}
        <div style={{
          height: 1, marginTop: 60,
          background: 'linear-gradient(to right, transparent, rgba(183,110,121,0.3), transparent)',
        }} />

        {/* Footer links */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 32, flexWrap: 'wrap' }}>
          {[
            ['Shop', '/shop'],
            ['Skincare', '/shop?category=Skincare'],
            ['Makeup', '/shop?category=Lips'],
            ['Hair', '/shop?category=Hair+Care'],
            ['My Account', '/account'],
            ['Contact', '/contact'],
          ].map(([label, href]) => (
            <Link key={href} to={href} style={{
              fontFamily: "'Inter', sans-serif", fontSize: 11,
              color: 'rgba(250,250,250,0.35)', textDecoration: 'none',
              letterSpacing: 2, textTransform: 'uppercase', fontWeight: 400,
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.target.style.color = '#F8C8DC'}
              onMouseLeave={e => e.target.style.color = 'rgba(250,250,250,0.35)'}
            >
              {label}
            </Link>
          ))}
        </div>

        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 11,
          color: 'rgba(250,250,250,0.2)', marginTop: 32, letterSpacing: 1,
        }}>
          © 2026 Kivara Beauty · All rights reserved · Made with 🌸
        </p>
      </div>
    </section>
  );
}

// ─── Main HomePage ────────────────────────────────────────────────────────────
export default function HomePage() {
  const scrollContainerRef = useRef();

  return (
    <div style={{ background: '#FAFAFA', fontFamily: "'Inter', sans-serif" }}>

      {/* Scrollytelling container — 500vh tall */}
      <div
        ref={scrollContainerRef}
        style={{ height: '500vh', position: 'relative' }}
      >
        {/* Sticky shell: contains the fixed canvas + DOM overlay */}
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

          {/* Background gradient that shifts with scroll */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 0,
            background: 'linear-gradient(160deg, #FFF0F5 0%, #FAFAFA 40%, #FFF8F0 100%)',
          }} />

          {/* 3D WebGL Canvas */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
            <Suspense fallback={<EtherealLoadingFallback />}>
              <HeroCanvas />
            </Suspense>
          </div>

          {/* DOM overlays + GSAP scroll driver */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
            <ScrollDOMOverlay scrollContainerRef={scrollContainerRef} />
          </div>
        </div>
      </div>

      {/* Content below the scrollytelling experience */}
      <Newsletter />
      <Footer />
    </div>
  );
}
