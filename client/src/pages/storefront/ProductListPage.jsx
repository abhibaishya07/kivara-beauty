import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ProductCard from '../../components/storefront/ProductCard';
import { getProducts } from '../../api/productApi';
import Spinner from '../../components/ui/Spinner';

const CATEGORIES = ['All', 'Lips', 'Eyes', 'Face', 'Skincare', 'Hair Care', 'Fragrance', 'Nails', 'Tools'];

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const selectedCategory = searchParams.get('category') || 'All';

  const setCategory = (cat) => {
    if (cat === 'All') setSearchParams({});
    else setSearchParams({ category: cat });
  };

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const params = {};
    if (selectedCategory !== 'All') params.category = selectedCategory;
    if (debouncedSearch) params.search = debouncedSearch;
    
    getProducts(params).then(({ data }) => {
      if (active) setProducts(data.products);
    }).finally(() => {
      if (active) setLoading(false);
    });
    
    return () => { active = false; };
  }, [selectedCategory, debouncedSearch]);

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="text-[11px] tracking-widest uppercase text-lb-mauve font-semibold mb-2">
            {selectedCategory === 'All' ? 'Full Collection' : selectedCategory}
          </p>
          <h1 className="font-display text-4xl font-medium">Shop {selectedCategory === 'All' ? 'All Products' : selectedCategory}</h1>
          <p className="text-gray-500 text-sm mt-2">{products.length} products</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <aside className="lg:w-56 flex-shrink-0">
            <div className="mb-6">
              <p className="text-[10px] tracking-widest uppercase font-bold text-gray-500 mb-3">Search</p>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search products..." className="input-field text-xs" />
            </div>
            <div>
              <p className="text-[10px] tracking-widest uppercase font-bold text-gray-500 mb-3">Category</p>
              <div className="space-y-1">
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)}
                    className={`w-full text-left text-sm px-3 py-2 transition-colors duration-150
                                ${selectedCategory === cat ? 'bg-lb-black text-white font-semibold' : 'hover:bg-lb-blush text-gray-700'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center py-20"><Spinner size="lg" /></div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-display text-2xl text-gray-400 mb-2">No products found</p>
                <p className="text-gray-500 text-sm">Try a different category or search term</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
