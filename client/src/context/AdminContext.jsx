import { createContext, useContext, useState } from 'react';
import * as authApi from '../api/authApi';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(() => {
    try { return JSON.parse(localStorage.getItem('lb_admin')); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  const adminLogin = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await authApi.adminLogin({ email, password });
      localStorage.setItem('lb_token', data.token);
      localStorage.setItem('lb_admin', JSON.stringify(data.user));
      setAdmin(data.user);
      return data;
    } finally { setLoading(false); }
  };

  const adminLogout = () => {
    localStorage.removeItem('lb_token');
    localStorage.removeItem('lb_admin');
    setAdmin(null);
  };

  return (
    <AdminContext.Provider value={{ admin, loading, adminLogin, adminLogout, isAdmin: !!admin }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
