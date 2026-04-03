import { useEffect, useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import HeroBanner from '../../components/storefront/HeroBanner';
import CategoryGrid from '../../components/storefront/CategoryGrid';
import ProductCard from '../../components/storefront/ProductCard';
import { getFeaturedProducts } from '../../api/productApi';
import Spinner from '../../components/ui/Spinner';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedProducts().then(({ data }) => setFeatured(data.products)).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <HeroBanner />
        <CategoryGrid />

        {/* Featured Products */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[11px] tracking-widest uppercase text-lb-mauve font-semibold mb-3">Handpicked</p>
              <h2 className="section-title">Featured Picks</h2>
            </div>
            <Link to="/shop" className="btn-ghost hidden sm:block">View All →</Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Spinner size="lg" /></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
          <div className="text-center mt-10">
            <Link to="/shop" className="btn-outline">Explore Full Collection</Link>
          </div>
        </section>

        {/* GlowBot Promo Banner */}
        <section className="relative overflow-hidden bg-lb-black py-16 px-6">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-96 h-96 bg-lb-rose/10 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-lb-rose/20 border border-lb-rose/30 text-lb-gold px-4 py-1.5 rounded-full text-xs tracking-widest uppercase font-semibold mb-5">
              ✨ New Feature
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-medium text-white mb-4">
              Meet <span className="text-lb-rose italic">Krystal</span>
            </h2>
            <p className="text-white/60 text-base leading-relaxed max-w-lg mx-auto mb-8">
              Upload a selfie, tell us about your skin, and our AI consultant will build you a personalized routine — exclusively from our curated inventory.
            </p>
            <Link to="/glowbot" className="inline-flex items-center gap-2 bg-lb-rose text-white font-bold text-xs tracking-widest uppercase px-8 py-4 hover:bg-lb-mauve transition-colors duration-300 shadow-lg shadow-pink-500/30">
              ✨ Try Krystal Free →
            </Link>
          </div>
        </section>

        {/* Brand Promise Strip */}
        <section className="bg-lb-blush py-14">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: '✦', title: 'Cruelty-Free',     sub: '100% vegan & ethical' },
              { icon: '✦', title: 'Dermatologist Tested', sub: 'Safe for all skin types' },
              { icon: '✦', title: 'Free Shipping',    sub: 'On orders above ₹999' },
              { icon: '✦', title: 'Easy Returns',     sub: '15-day hassle-free returns' },
            ].map(({ icon, title, sub }) => (
              <div key={title} className="flex flex-col items-center gap-2">
                <span className="text-lb-mauve text-xl">{icon}</span>
                <p className="font-display text-base font-semibold">{title}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <p className="text-[11px] tracking-widest uppercase text-lb-mauve font-semibold mb-3">Reviews</p>
            <h2 className="section-title">Loved by Thousands</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Priya M.', review: 'The Silk Foundation is absolutely stunning — buildable coverage and it lasts all day. My new holy grail!', rating: 5 },
              { name: 'Anika S.', review: 'The Smoky Eye Palette blends like a dream. I get compliments every single day. Worth every rupee.', rating: 5 },
              { name: 'Roshni K.', review: "Hyaluronic Glow Serum transformed my skin in 2 weeks. Can't imagine my routine without it now.", rating: 5 },
            ].map(({ name, review, rating }) => (
              <div key={name} className="bg-lb-gray border border-lb-border p-6">
                <div className="flex gap-1 mb-4">
                  {Array(rating).fill('★').map((s, i) => <span key={i} className="text-lb-gold text-sm">{s}</span>)}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed italic mb-4">"{review}"</p>
                <p className="text-xs tracking-widest uppercase font-semibold text-lb-mauve">{name}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
