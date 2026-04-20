import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/account');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex items-center justify-center min-h-[70vh] px-4 py-16 bg-lb-gray">
        <div className="w-full max-w-md bg-white p-10 border border-lb-border animate-scaleIn">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-semibold mb-2">Welcome Back</h1>
            <p className="text-sm text-gray-500">Sign in to your Kivara account</p>
          </div>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-xs tracking-widest uppercase font-semibold text-gray-600 mb-1.5">Email</label>
              <input name="email" type="email" required value={form.email} onChange={handle} className="input-field" placeholder="you@example.com" autoFocus />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs tracking-widest uppercase font-semibold text-gray-600">Password</label>
                <Link to="/forgot-password" className="text-[10px] uppercase tracking-wider font-semibold text-lb-mauve hover:text-lb-black transition-colors">Forgot?</Link>
              </div>
              <input name="password" type="password" required value={form.password} onChange={handle} className="input-field" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? <Spinner size="sm" light /> : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-lb-mauve hover:text-lb-black transition-colors">Create one</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
