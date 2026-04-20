import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      await register(form.name, form.email, form.password, form.phone);
      navigate('/verify-email', { state: { email: form.email } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex items-center justify-center min-h-[70vh] px-4 py-16 bg-lb-gray">
        <div className="w-full max-w-md bg-white p-10 border border-lb-border animate-scaleIn">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-semibold mb-2">Create Account</h1>
            <p className="text-sm text-gray-500">Join Kivara for exclusive perks</p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            {[
              { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Your full name' },
              { label: 'Email', name: 'email', type: 'email', placeholder: 'you@example.com' },
              { label: 'Phone', name: 'phone', type: 'tel', placeholder: '+91 9876543210', required: false },
              { label: 'Password', name: 'password', type: 'password', placeholder: 'Min. 6 characters' },
            ].map(({ label, name, type, placeholder, required = true }) => (
              <div key={name}>
                <label className="block text-xs tracking-widest uppercase font-semibold text-gray-600 mb-1.5">{label}</label>
                <input name={name} type={type} value={form[name]} onChange={handle}
                  required={required} className="input-field" placeholder={placeholder} />
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Spinner size="sm" light /> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-lb-mauve hover:text-lb-black transition-colors">Sign in</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
