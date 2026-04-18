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

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          {/* Sidebar */}
          <aside className="lg:w-56 flex-shrink-0">
            {/* Search */}
            <div className="mb-6">
              <p className="text-[10px] tracking-widest uppercase font-bold text-gray-500 mb-3 hidden lg:block">Search</p>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search products..." className="input-field text-xs w-full rounded-full lg:rounded-none px-5 py-3.5 shadow-sm lg:shadow-none" />
            </div>
            {/* Categories */}
            <div>
              <p className="text-[10px] tracking-widest uppercase font-bold text-gray-500 mb-3 hidden lg:block">Category</p>
              
              {/* Desktop Categories */}
              <div className="hidden lg:flex flex-col space-y-1">
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)}
                    className={`w-full text-left text-sm px-3 py-2 transition-colors duration-150 rounded-md lg:rounded-none
                                ${selectedCategory === cat ? 'bg-lb-black text-white font-semibold shadow-md' : 'hover:bg-lb-blush text-gray-400 hover:text-lb-black'}`}>
                    {cat}
                  </button>
                ))}
              </div>

              {/* Mobile Categories (Horizontal Scroll) */}
              <div className="lg:hidden flex overflow-x-auto pb-4 -mx-6 px-6 gap-2 scrollbar-hide snap-x">
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)}
                    className={`flex-shrink-0 snap-start text-xs font-semibold px-5 py-2.5 rounded-full whitespace-nowrap transition-all shadow-sm
                                ${selectedCategory === cat ? 'bg-lb-rose text-white border-2 border-lb-rose' : 'bg-[#1a0a10] text-gray-300 border border-gray-800 hover:bg-[#32111b]'}`}>
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
