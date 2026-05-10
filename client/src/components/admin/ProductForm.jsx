import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { createProduct, updateProduct } from '../../api/productApi';
import Spinner from '../ui/Spinner';

const CATEGORIES = ['Lips', 'Eyes', 'Face', 'Skincare', 'Fragrance', 'Nails', 'Tools'];
const EMPTY = {
  name: '', description: '', price: '', comparePrice: '',
  images: '', category: 'Lips', brand: '', stock: '',
  lowStockThreshold: '10', isFeatured: false,
};
const EMPTY_SHADE = { name: '', hex: '#FF9EAD', stock: '0', image: '', description: '' };

// Field must be defined OUTSIDE ProductForm so React doesn't treat it as a new
// component type on every re-render (which would unmount/remount the input and
// lose focus after each keystroke).
function Field({ label, name, type = 'text', form, onChange, ...rest }) {
  return (
    <div>
      <label className="block text-xs tracking-widest uppercase font-semibold text-gray-600 mb-1.5">{label}</label>
      <input name={name} type={type} value={form[name]} onChange={onChange} className="input-field" {...rest} />
    </div>
  );
}

export default function ProductForm({ product, onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY);
  const [shades, setShades] = useState([]);
  const [loading, setLoading] = useState(false);
  const isEdit = !!product;

  useEffect(() => {
    if (product) {
      setForm({
        ...product,
        images:            (product.images || []).join(', '),
        price:             product.price || '',
        comparePrice:      product.comparePrice || '',
        stock:             product.stock ?? '',
        lowStockThreshold: product.lowStockThreshold ?? 10,
      });
      setShades(
        (product.shades || []).map(s => ({
          name:        s.name        || '',
          hex:         s.hex         || '#FF9EAD',
          stock:       s.stock       ?? 0,
          image:       s.image       || '',
          description: s.description || '',
          _id:         s._id,
        }))
      );
    } else {
      setForm(EMPTY);
      setShades([]);
    }
  }, [product]);

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  // ── Shade helpers ─────────────────────────────────────────────────────────
  const addShade = () => setShades(s => [...s, { ...EMPTY_SHADE }]);

  const removeShade = (idx) => setShades(s => s.filter((_, i) => i !== idx));

  const handleShade = (idx, field, value) =>
    setShades(s => s.map((sh, i) => i === idx ? { ...sh, [field]: value } : sh));

  // ── Submit ────────────────────────────────────────────────────────────────
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const parsedShades = shades.map(s => ({
        ...(s._id ? { _id: s._id } : {}),
        name:        s.name.trim(),
        hex:         s.hex,
        stock:       Number(s.stock),
        image:       s.image.trim(),
        description: s.description.trim(),
      })).filter(s => s.name);

      const payload = {
        ...form,
        price:             Number(form.price),
        comparePrice:      form.comparePrice ? Number(form.comparePrice) : undefined,
        stock:             Number(form.stock),
        lowStockThreshold: Number(form.lowStockThreshold),
        images:            form.images.split(',').map(s => s.trim()).filter(Boolean),
        shades:            parsedShades,
      };
      if (isEdit) await updateProduct(product._id, payload);
      else        await createProduct(payload);
      toast.success(isEdit ? 'Product updated!' : 'Product created!');
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <Field label="Product Name *" name="name" form={form} onChange={handle} required placeholder="e.g. Velvet Matte Lip Color" />

      <div>
        <label className="block text-xs tracking-widest uppercase font-semibold text-gray-600 mb-1.5">Description *</label>
        <textarea name="description" value={form.description} onChange={handle} required rows={3}
          className="input-field resize-none" placeholder="Describe the product..." />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Price (₹) *" name="price" type="number" form={form} onChange={handle} required min="0" step="0.01" />
        <Field label="Compare Price (₹)" name="comparePrice" type="number" form={form} onChange={handle} min="0" step="0.01" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs tracking-widest uppercase font-semibold text-gray-600 mb-1.5">Category *</label>
          <select name="category" value={form.category} onChange={handle} className="input-field" required>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <Field label="Brand" name="brand" form={form} onChange={handle} placeholder="e.g. Kivara" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Stock Qty *" name="stock" type="number" form={form} onChange={handle} required min="0" />
        <Field label="Low Stock Alert At" name="lowStockThreshold" type="number" form={form} onChange={handle} min="0" />
      </div>

      <div>
        <label className="block text-xs tracking-widest uppercase font-semibold text-gray-600 mb-1.5">Image URLs (comma-separated)</label>
        <textarea name="images" value={form.images} onChange={handle} rows={2}
          className="input-field resize-none text-xs" placeholder="https://img1.com, https://img2.com" />
      </div>

      {/* ── Shades Section ──────────────────────────────────────────────── */}
      <div className="border-t border-lb-border pt-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs tracking-widest uppercase font-semibold text-gray-600">Shade Variants</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Optional — for lip, eye, nail colour products</p>
          </div>
          <button
            type="button"
            onClick={addShade}
            className="text-xs tracking-widest uppercase font-semibold text-lb-mauve border border-lb-rose/40 hover:border-lb-mauve hover:bg-lb-blush px-3 py-1.5 transition-colors"
          >
            + Add Shade
          </button>
        </div>

        {shades.length === 0 && (
          <p className="text-xs text-gray-400 italic py-2">No shades added. Click "+ Add Shade" to begin.</p>
        )}

        <div className="space-y-3">
          {shades.map((shade, idx) => (
            <div key={idx} className="flex flex-col gap-2 bg-lb-gray border border-lb-border px-3 py-3">
              {/* Row 1: colour picker + name + stock + image + remove */}
              <div className="grid grid-cols-[auto_1fr_80px_1fr_32px] gap-2 items-center">
                {/* Colour picker */}
                <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-lb-border cursor-pointer flex-shrink-0">
                  <input
                    type="color"
                    value={shade.hex}
                    onChange={e => handleShade(idx, 'hex', e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    title="Pick shade colour"
                  />
                  <div className="w-full h-full rounded-full" style={{ backgroundColor: shade.hex }} />
                </div>

                {/* Shade name */}
                <input
                  type="text"
                  value={shade.name}
                  onChange={e => handleShade(idx, 'name', e.target.value)}
                  placeholder="Shade name (e.g. Nude Look)"
                  className="input-field text-xs py-1.5"
                />

                {/* Stock */}
                <input
                  type="number"
                  value={shade.stock}
                  onChange={e => handleShade(idx, 'stock', e.target.value)}
                  min="0"
                  placeholder="Stock"
                  className="input-field text-xs py-1.5"
                  title="Stock for this shade"
                />

                {/* Image URL */}
                <input
                  type="text"
                  value={shade.image}
                  onChange={e => handleShade(idx, 'image', e.target.value)}
                  placeholder="Shade image URL (optional)"
                  className="input-field text-xs py-1.5"
                />

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => removeShade(idx)}
                  className="text-gray-400 hover:text-red-500 transition-colors text-lg leading-none font-bold"
                  title="Remove shade"
                >
                  ×
                </button>
              </div>

              {/* Row 2: per-shade description */}
              <textarea
                value={shade.description}
                onChange={e => handleShade(idx, 'description', e.target.value)}
                placeholder="Shade description (optional) — shown on product page when this shade is selected"
                rows={2}
                className="input-field text-xs py-1.5 resize-none w-full"
              />
            </div>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handle} className="w-4 h-4 accent-lb-mauve" />
        <span className="text-sm font-medium">Feature on Homepage</span>
      </label>

      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary flex-1">
          {loading ? <Spinner size="sm" light /> : isEdit ? 'Update Product' : 'Create Product'}
        </button>
        <button type="button" onClick={onClose} className="btn-outline flex-1">Cancel</button>
      </div>
    </form>
  );
}
