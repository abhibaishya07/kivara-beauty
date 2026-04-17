import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ProductCard from '../../components/storefront/ProductCard';
import CategoryGrid from '../../components/storefront/CategoryGrid';
import MakeupScene3D from '../../components/storefront/MakeupScene3D';
import { getFeaturedProducts } from '../../api/productApi';
import Spinner from '../../components/ui/Spinner';

// ── Animated counter ─────────────────────────────────────────────────────────
function AnimatedNumber({ end, suffix = '', duration = 1800 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = Math.ceil(end / (duration / 16));
        const timer = setInterval(() => {
          start = Math.min(start + step, end);
          setCount(start);
          if (start >= end) clearInterval(timer);
        }, 16);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// ── Floating label pill ──────────────────────────────────────────────────────
function FloatingPill({ children, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest uppercase ${className}`}>
      {children}
    </span>
  );
}

// ── Marquee strip ────────────────────────────────────────────────────────────
function MarqueeStrip() {
  const items = ['✦ Charlotte Tilbury', '✦ Maybelline', '✦ Fenty Beauty', '✦ YSL', '✦ Rhode', '✦ Flower Knows', '✦ Anastasia Beverly Hills', '✦ Kiko Milano'];
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden py-4 bg-gradient-to-r from-rose-50 via-pink-50 to-rose-50 border-y border-pink-100">
      <div className="flex gap-8 animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="text-[13px] font-semibold tracking-widest text-pink-500 uppercase shrink-0">{item}</span>
        ))}
      </div>
    </div>
  );
}

// ── Glitter blob background ──────────────────────────────────────────────────
function GlitterBlob({ className }) {
  return (
    <div className={`absolute rounded-full blur-3xl opacity-30 pointer-events-none ${className}`} />
  );
}

// ── Category spotlight card ──────────────────────────────────────────────────
const MAKEUP_CATS = [
  { name: 'Lips', emoji: '💋', desc: 'Glosses, tints & liquid lipsticks', color: 'from-rose-400 to-pink-600', link: '/shop?category=Lips' },
  { name: 'Eyes', emoji: '✨', desc: 'Palettes, mascaras & liners', color: 'from-purple-400 to-pink-500', link: '/shop?category=Eyes' },
  { name: 'Face', emoji: '🌸', desc: 'Foundations, blushes & primers', color: 'from-pink-300 to-rose-500', link: '/shop?category=Face' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedProducts()
      .then(({ data }) => setFeatured(data.products))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden">

        {/* ═══ HERO ═══════════════════════════════════════════════════════════ */}
        <section className="relative min-h-screen flex flex-col justify-center overflow-hidden" style={{background: 'linear-gradient(135deg, #fff0f6 0%, #fce4ec 30%, #fdf2f8 60%, #fff0f6 100%)'}}>

          {/* Background blobs */}
          <GlitterBlob className="w-96 h-96 bg-pink-300 top-0 -right-20 top-10" />
          <GlitterBlob className="w-80 h-80 bg-rose-200 bottom-20 -left-20" />
          <GlitterBlob className="w-64 h-64 bg-fuchsia-200 top-1/3 left-1/3" />

          {/* Floating pills — decorative labels */}
          <div className="absolute top-28 left-8 hidden lg:block animate-float-slow z-10">
            <FloatingPill className="bg-white/80 backdrop-blur-sm text-pink-600 shadow-lg shadow-pink-100/50 border border-pink-100">
              ✨ New Arrivals
            </FloatingPill>
          </div>
          <div className="absolute top-40 right-12 hidden lg:block animate-float-med z-10">
            <FloatingPill className="bg-pink-500 text-white shadow-xl shadow-pink-300/40">
              💄 Trending Now
            </FloatingPill>
          </div>
          <div className="absolute bottom-32 right-20 hidden lg:block animate-float-slow z-10">
            <FloatingPill className="bg-white/80 backdrop-blur-sm text-rose-600 shadow-lg border border-rose-100">
              🌸 Free Shipping ₹999+
            </FloatingPill>
          </div>

          <div className="relative max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-0 items-center py-20 min-h-[92vh]">

            {/* Left — text */}
            <div className="z-10 space-y-7">
              <div>
                <FloatingPill className="bg-pink-100 text-pink-600 mb-5">
                  ✦ Kivara Beauty · 2026 Collection
                </FloatingPill>
                <h1 className="font-display leading-[1.05]" style={{fontSize: 'clamp(3rem, 7vw, 6rem)', fontWeight: 700}}>
                  <span style={{background: 'linear-gradient(135deg, #c2185b, #e91e8c, #f48fb1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>
                    Beauty
                  </span>
                  <br />
                  <span className="text-gray-900">That Moves</span>
                  <br />
                  <em className="italic" style={{background: 'linear-gradient(135deg, #e91e8c, #f48fb1, #c2185b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>
                    You.
                  </em>
                </h1>
              </div>

              <p className="text-gray-500 text-lg leading-relaxed max-w-md">
                Discover premium makeup curated for every mood — from bold to barely-there.
                Express yourself with shades that speak louder than words.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link to="/shop?category=Lips" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm text-white shadow-xl shadow-pink-300/50 transition-all duration-300 hover:scale-105 hover:shadow-pink-400/60"
                  style={{background: 'linear-gradient(135deg, #e91e8c, #c2185b)'}}>
                  💋 Shop Lips
                </Link>
                <Link to="/shop" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-sm border-2 border-pink-300 text-pink-600 hover:bg-pink-50 transition-all duration-300 hover:scale-105">
                  Explore All →
                </Link>
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-5 border-t border-pink-100">
                {[
                  { end: 56, suffix: '+', label: 'Products' },
                  { end: 15, suffix: '+', label: 'Brands' },
                  { end: 99, suffix: '%', label: 'Happy Customers' },
                ].map(({ end, suffix, label }) => (
                  <div key={label}>
                    <p className="font-display text-3xl font-bold text-pink-600">
                      <AnimatedNumber end={end} suffix={suffix} />
                    </p>
                    <p className="text-xs text-gray-400 tracking-widest uppercase mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — 3D Canvas */}
            <div className="relative h-[520px] lg:h-[700px]">
              <MakeupScene3D />
              {/* Soft radial glow behind canvas */}
              <div className="absolute inset-0 rounded-full pointer-events-none" style={{background: 'radial-gradient(ellipse at center, rgba(233,30,140,0.08) 0%, transparent 70%)'}} />
            </div>
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-pink-400">
            <span className="text-[9px] tracking-widest uppercase font-semibold">Scroll</span>
            <div className="flex flex-col items-center gap-0.5 animate-bounce">
              <span className="block w-0.5 h-4 rounded-full bg-pink-300" />
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
        </section>

        {/* ═══ MARQUEE ════════════════════════════════════════════════════════ */}
        <MarqueeStrip />

        {/* ═══ MAKEUP SPOTLIGHT ═══════════════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-14">
            <FloatingPill className="bg-pink-50 text-pink-500 mb-4">Make Up Your World</FloatingPill>
            <h2 className="font-display text-5xl font-bold text-gray-900 mb-3">
              Shop by{' '}
              <span style={{background: 'linear-gradient(135deg, #e91e8c, #f48fb1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>
                Look
              </span>
            </h2>
            <p className="text-gray-400 text-base max-w-md mx-auto">Find your perfect shade across our complete makeup range</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {MAKEUP_CATS.map(({ name, emoji, desc, color, link }) => (
              <Link key={name} to={link}
                className="group relative rounded-3xl overflow-hidden h-72 flex items-end p-7 transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl cursor-pointer"
                style={{background: `linear-gradient(135deg, ${name === 'Lips' ? '#fce4ec, #f48fb1' : name === 'Eyes' ? '#f3e5f5, #ce93d8' : '#fce4ec, #f06292'})`}}>
                {/* Big emoji */}
                <div className="absolute top-6 right-6 text-8xl opacity-30 group-hover:opacity-50 transition-opacity duration-300 group-hover:scale-110 transform duration-300">
                  {emoji}
                </div>
                {/* Glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-400`} />
                <div className="relative z-10">
                  <p className="text-xs tracking-widest uppercase font-bold text-white/70 mb-1">{desc}</p>
                  <h3 className="font-display text-4xl font-bold text-white drop-shadow-lg">{name}</h3>
                  <span className="inline-block mt-3 text-xs tracking-widest uppercase font-bold text-white/80 group-hover:gap-2 transition-all">
                    Shop Now →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ═══ FEATURED PRODUCTS ══════════════════════════════════════════════ */}
        <section className="relative py-24 overflow-hidden" style={{background: 'linear-gradient(180deg, #fff 0%, #fdf2f8 50%, #fff 100%)'}}>
          <GlitterBlob className="w-72 h-72 bg-pink-200 -top-20 -right-10" />
          <GlitterBlob className="w-64 h-64 bg-rose-100 bottom-0 -left-10" />

          <div className="relative max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-14">
              <div>
                <FloatingPill className="bg-pink-50 text-pink-500 mb-4">Handpicked for You</FloatingPill>
                <h2 className="font-display text-5xl font-bold text-gray-900">
                  Featured{' '}
                  <span style={{background: 'linear-gradient(135deg, #e91e8c, #c2185b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>
                    Picks
                  </span>
                </h2>
              </div>
              <Link to="/shop" className="hidden sm:inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-pink-200 text-pink-600 font-semibold text-sm hover:bg-pink-50 transition-all hover:scale-105">
                View All →
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-16"><Spinner size="lg" /></div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {featured.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
            )}

            <div className="text-center mt-12">
              <Link to="/shop"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-bold text-sm text-white shadow-xl shadow-pink-200/60 hover:scale-105 transition-all duration-300"
                style={{background: 'linear-gradient(135deg, #e91e8c, #c2185b)'}}>
                Explore Full Collection ✦
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ CATEGORY GRID ══════════════════════════════════════════════════ */}
        <CategoryGrid />

        {/* ═══ KRYSTAL AI BANNER ══════════════════════════════════════════════ */}
        <section className="relative overflow-hidden py-24 px-6" style={{background: 'linear-gradient(135deg, #1a0010 0%, #3d0030 50%, #1a0010 100%)'}}>
          {/* background glitter dots */}
          <div className="absolute inset-0">
            {[...Array(30)].map((_, i) => (
              <div key={i} className="absolute w-1 h-1 rounded-full bg-pink-400 opacity-40"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animation: `pulse ${1.5 + Math.random() * 2}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                }} />
            ))}
          </div>
          <GlitterBlob className="w-96 h-96 bg-pink-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

          <div className="relative max-w-3xl mx-auto text-center">
            <FloatingPill className="bg-pink-500/20 border border-pink-500/30 text-pink-300 mb-6">
              ✨ AI-Powered Beauty
            </FloatingPill>
            <h2 className="font-display text-5xl md:text-6xl font-bold text-white mb-5 leading-tight">
              Meet{' '}
              <span style={{background: 'linear-gradient(135deg, #f48fb1, #e91e8c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>
                Krystal
              </span>
            </h2>
            <p className="text-white/50 text-base leading-relaxed max-w-lg mx-auto mb-10">
              Your personal AI beauty consultant. Upload a selfie, share your skin type, and get
              a personalized routine — tailored exclusively from our curated collection.
            </p>
            <Link to="/glowbot"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-full font-bold text-sm text-white shadow-2xl shadow-pink-500/30 hover:scale-105 hover:shadow-pink-500/50 transition-all duration-300"
              style={{background: 'linear-gradient(135deg, #e91e8c, #c2185b)'}}>
              ✨ Try Krystal Free →
            </Link>
          </div>
        </section>

        {/* ═══ BRAND PROMISES ═════════════════════════════════════════════════ */}
        <section className="py-16 border-y border-pink-50" style={{background: '#fdf2f8'}}>
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: '🌿', title: 'Cruelty-Free', sub: '100% vegan & ethical' },
              { icon: '🧪', title: 'Dermatologist Tested', sub: 'Safe for all skin types' },
              { icon: '🚚', title: 'Free Shipping', sub: 'On orders above ₹999' },
              { icon: '💝', title: 'Easy Returns', sub: '15-day hassle-free returns' },
            ].map(({ icon, title, sub }) => (
              <div key={title} className="flex flex-col items-center gap-3 group">
                <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{icon}</span>
                <p className="font-bold text-gray-900 text-sm">{title}</p>
                <p className="text-xs text-gray-400 leading-relaxed">{sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ TESTIMONIALS ═══════════════════════════════════════════════════ */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-14">
            <FloatingPill className="bg-pink-50 text-pink-500 mb-4">Real Reviews</FloatingPill>
            <h2 className="font-display text-5xl font-bold text-gray-900">
              Loved by{' '}
              <span style={{background: 'linear-gradient(135deg, #e91e8c, #f48fb1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>
                Thousands
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Priya M.', review: 'The Charlotte Tilbury Foundation is absolutely stunning — glowy coverage that lasts all day. My holy grail!', rating: 5, product: 'Beautiful Skin Foundation' },
              { name: 'Anika S.', review: 'Rhode Peptide Lip Tint is SO good — my lips feel plump and hydrated all day. I bought 3 shades!', rating: 5, product: 'Rhode Lip Tint' },
              { name: 'Roshni K.', review: 'Flower Knows blush is literally the prettiest compact I own. The embossed design is *chef\'s kiss*.', rating: 5, product: 'Strawberry Rococo Blush' },
            ].map(({ name, review, rating, product }) => (
              <div key={name}
                className="relative rounded-2xl p-7 border border-pink-100 hover:border-pink-200 hover:shadow-xl hover:shadow-pink-100/50 transition-all duration-300 hover:-translate-y-1"
                style={{background: 'linear-gradient(135deg, #fff 0%, #fdf2f8 100%)'}}>
                {/* Quote mark */}
                <span className="absolute top-4 right-6 text-5xl text-pink-100 font-serif leading-none">"</span>
                <div className="flex gap-0.5 mb-4">
                  {Array(rating).fill('★').map((s, i) => (
                    <span key={i} className="text-pink-400 text-sm">{s}</span>
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-5 italic">"{review}"</p>
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase text-pink-500">{name}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">{product}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
