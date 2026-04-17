import { Link } from 'react-router-dom';

const CATEGORIES = [
  { name: 'Lips',       image: 'https://images.unsplash.com/photo-1586495777744-977b0dc3fd2a?auto=format&fit=crop&w=600&q=80', color: 'from-lb-blush' },
  { name: 'Eyes',       image: 'https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?auto=format&fit=crop&w=600&q=80', color: 'from-gray-900' },
  { name: 'Face',       image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80', color: 'from-lb-rose' },
  { name: 'Skincare',   image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=600&q=80', color: 'from-emerald-900' },
  { name: 'Hair Care',  image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80', color: 'from-amber-900' },
  { name: 'Fragrance',  image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=600&q=80', color: 'from-lb-mauve' },
  { name: 'Nails',      image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=600&q=80', color: 'from-lb-black' },
];

export default function CategoryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <p className="text-[11px] tracking-widest uppercase text-lb-mauve font-semibold mb-3">Browse By</p>
        <h2 className="section-title">Shop By Category</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {CATEGORIES.map(({ name, image }) => (
          <Link key={name} to={`/shop?category=${name}`}
            className="group relative overflow-hidden aspect-[3/4] bg-lb-blush cursor-pointer">
            <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-lb-mauve/80 transition-all duration-500" />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <p className="text-xs tracking-widest uppercase font-semibold">{name}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
