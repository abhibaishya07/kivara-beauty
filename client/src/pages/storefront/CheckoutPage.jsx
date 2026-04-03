import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { createOrder } from '../../api/orderApi';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  const [form, setForm] = useState({
    name:    user?.name || '',
    email:   user?.email || '',
    phone:   user?.phone || '',
    line1:   '',
    city:    '',
    state:   '',
    pincode: '',
  });

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) return toast.error('Your cart is empty!');
    setLoading(true);
    try {
      const orderData = {
        customer: { name: form.name, email: form.email, phone: form.phone, address: { line1: form.line1, city: form.city, state: form.state, pincode: form.pincode } },
        items: items.map(i => ({ product: i._id, name: i.name, price: i.price, quantity: i.quantity, image: i.images?.[0] })),
        subtotal, shipping, total,
        payment: { status: 'pending', method: 'cod' },
      };
      const { data } = await createOrder(orderData);
      clearCart();
      toast.success(`Order ${data.order.orderNumber} placed successfully!`);
      navigate('/account');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed. Please try again.');
    } finally { setLoading(false); }
  };

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <p className="font-display text-2xl text-gray-400">Your bag is empty</p>
          <button onClick={() => navigate('/shop')} className="btn-primary">Continue Shopping</button>
        </div>
        <Footer />
      </>
    );
  }

  const Field = ({ label, name, type = 'text', required = true }) => (
    <div>
      <label className="block text-xs tracking-widest uppercase font-semibold text-gray-600 mb-1.5">{label}{required ? ' *' : ''}</label>
      <input name={name} type={type} value={form[name]} onChange={handle} required={required} className="input-field" />
    </div>
  );

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="font-display text-4xl font-medium mb-10">Checkout</h1>

        <form onSubmit={handlePlaceOrder} className="grid lg:grid-cols-2 gap-12">
          {/* Left — Details */}
          <div className="space-y-6">
            <h2 className="font-display text-xl font-medium pb-3 border-b border-lb-border">Contact Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Full Name" name="name" />
              <Field label="Email" name="email" type="email" />
            </div>
            <Field label="Phone" name="phone" type="tel" required={false} />

            <h2 className="font-display text-xl font-medium pb-3 border-b border-lb-border">Shipping Address</h2>
            <Field label="Address Line 1" name="line1" />
            <div className="grid grid-cols-2 gap-4">
              <Field label="City" name="city" />
              <Field label="State" name="state" />
            </div>
            <Field label="PIN Code" name="pincode" />

            {/* Payment */}
            <div className="bg-lb-blush p-5 border border-lb-rose/30">
              <h2 className="font-display text-lg font-medium mb-3">Payment</h2>
              <div className="flex items-center gap-3 bg-white border border-lb-border p-4">
                <input type="radio" id="cod" name="payment" defaultChecked className="accent-lb-mauve" />
                <label htmlFor="cod" className="text-sm font-medium cursor-pointer">Cash on Delivery</label>
              </div>
              <p className="text-xs text-gray-500 mt-3">Razorpay online payment coming soon!</p>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Spinner size="sm" light /> : `Place Order · ₹${total.toLocaleString()}`}
            </button>
          </div>

          {/* Right — Order Summary */}
          <div className="bg-lb-gray border border-lb-border p-6 h-fit space-y-4">
            <h2 className="font-display text-xl font-medium">Order Summary</h2>
            <div className="space-y-4 divide-y divide-lb-border">
              {items.map(item => (
                <div key={item._id} className="flex gap-4 pt-4 first:pt-0">
                  <img src={item.images?.[0]} alt={item.name} className="w-16 h-16 object-cover bg-white flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    <p className="text-sm font-semibold mt-1">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-lb-border pt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `₹${shipping}`}</span></div>
              {shipping === 0 && <p className="text-xs text-green-600 font-medium">✓ Free shipping applied</p>}
              <div className="flex justify-between font-bold text-base pt-2 border-t border-lb-border">
                <span>Total</span><span>₹{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}
