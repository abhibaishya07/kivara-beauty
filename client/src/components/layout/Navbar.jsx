import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import CartDrawer from '../storefront/CartDrawer';

const CATEGORIES = ['Lips', 'Eyes', 'Face', 'Skincare', 'Fragrance', 'Nails', 'Tools'];

export default function Navbar() {
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-lb-black text-white text-center py-2 text-[11px] tracking-widest uppercase font-medium">
        Free Shipping on Orders Above ₹999 &nbsp;|&nbsp; Use Code: LUMIBEAUTY10 for 10% Off
      </div>

      <header className="bg-white border-b border-lb-border sticky top-0 z-40">
        {/* Main nav */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="font-display text-2xl font-semibold tracking-wide text-lb-black">
            Kivara
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/shop" className="text-xs tracking-widest uppercase font-medium hover:text-lb-mauve transition-colors">Shop All</Link>
            {CATEGORIES.map(c => (
              <Link key={c} to={`/shop?category=${c}`} className="text-xs tracking-widest uppercase font-medium hover:text-lb-mauve transition-colors">{c}</Link>
            ))}
            <Link to="/glowbot"
              className="flex items-center gap-1.5 text-xs tracking-widest uppercase font-bold text-lb-rose hover:text-lb-mauve transition-colors"
            >
              <span className="animate-pulse">✨</span> Krystal
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-5">
            {user ? (
              <div className="hidden md:flex items-center gap-4">
                <Link to="/account" className="text-xs tracking-widest uppercase font-medium hover:text-lb-mauve transition-colors">
                  {user.name.split(' ')[0]}
                </Link>
                <button onClick={handleLogout} className="text-xs tracking-widest uppercase font-medium hover:text-lb-mauve transition-colors">
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Link to="/login" className="text-xs tracking-widest uppercase font-medium hover:text-lb-mauve transition-colors">Login</Link>
                <Link to="/register" className="text-xs tracking-widest uppercase font-medium hover:text-lb-mauve transition-colors">Register</Link>
              </div>
            )}

            {/* Cart */}
            <button onClick={() => setCartOpen(true)} className="relative p-1 hover:text-lb-mauve transition-colors" aria-label="Open cart">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-lb-mauve text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu */}
            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5'} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-lb-border bg-white px-4 py-4 flex flex-col gap-4 animate-fadeIn">
            <Link to="/shop" className="text-xs tracking-widest uppercase font-medium" onClick={() => setMenuOpen(false)}>Shop All</Link>
            {CATEGORIES.map(c => (
              <Link key={c} to={`/shop?category=${c}`} className="text-xs tracking-widest uppercase font-medium" onClick={() => setMenuOpen(false)}>{c}</Link>
            ))}
            <Link to="/glowbot" onClick={() => setMenuOpen(false)}
              className="text-xs tracking-widest uppercase font-bold text-lb-rose flex items-center gap-1">
              ✨ Krystal AI Consultant
            </Link>
            <hr className="border-lb-border" />
            {user ? (
              <>
                <Link to="/account" className="text-xs tracking-widest uppercase font-medium" onClick={() => setMenuOpen(false)}>My Account</Link>
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="text-xs tracking-widest uppercase font-medium text-left">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-xs tracking-widest uppercase font-medium" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="text-xs tracking-widest uppercase font-medium" onClick={() => setMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        )}
      </header>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
