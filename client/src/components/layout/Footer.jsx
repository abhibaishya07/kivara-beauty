import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-lb-black text-white mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <h2 className="font-display text-2xl font-semibold mb-4">Kivara</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Curated luxury beauty. Science-backed skincare. Delivered to your door.
          </p>
        </div>
        <div>
          <h4 className="text-xs tracking-widest uppercase font-semibold mb-4 text-lb-rose">Shop</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            {['Lips','Eyes','Face','Skincare','Fragrance','Nails'].map(c => (
              <li key={c}><Link to={`/shop?category=${c}`} className="hover:text-white transition-colors">{c}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs tracking-widest uppercase font-semibold mb-4 text-lb-rose">Help</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link to="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
            <li><Link to="/policies#shipping" className="hover:text-white transition-colors">Shipping Policy</Link></li>
            <li><Link to="/policies#returns" className="hover:text-white transition-colors">Return Policy</Link></li>
            <li><a href="#" className="hover:text-white transition-colors">Track Order</a></li>
            <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs tracking-widest uppercase font-semibold mb-4 text-lb-rose">Newsletter</h4>
          <p className="text-gray-400 text-sm mb-4">Get first access to new launches and exclusive offers.</p>
          <form className="flex">
            <input type="email" placeholder="Your email" className="flex-1 px-4 py-2 bg-white/10 border border-white/20 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-lb-rose" />
            <button className="bg-lb-rose px-4 py-2 text-white text-xs tracking-widest hover:bg-lb-mauve transition-colors">→</button>
          </form>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs text-gray-500 tracking-wide">
        © {new Date().getFullYear()} Kivara Beauty. All rights reserved. | Crafted with love in India 🇮🇳
      </div>
    </footer>
  );
}
