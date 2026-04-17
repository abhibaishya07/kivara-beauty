import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import toast from 'react-hot-toast';
import Spinner from '../../components/ui/Spinner';

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { adminLogin, loading } = useAdmin();
  const navigate = useNavigate();

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      await adminLogin(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-lb-black flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-10 animate-scaleIn">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl font-semibold mb-2">Kivara</h1>
          <p className="text-xs tracking-widest uppercase text-lb-mauve font-semibold">Admin Portal</p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-xs tracking-widest uppercase font-semibold text-gray-600 mb-1.5">Email</label>
            <input name="email" type="email" required value={form.email} onChange={handle}
              className="input-field" placeholder="admin@kivara.com" autoFocus />
          </div>
          <div>
            <label className="block text-xs tracking-widest uppercase font-semibold text-gray-600 mb-1.5">Password</label>
            <input name="password" type="password" required value={form.password} onChange={handle}
              className="input-field" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? <Spinner size="sm" light /> : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-8">
          Default: admin@kivara.com / Admin@1234
        </p>
      </div>
    </div>
  );
}
