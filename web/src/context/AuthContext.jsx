import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWithCredentials = async (url, options = {}) => {
    return fetch(`/api${url}`, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
  };

  const checkAuth = async () => {
    try {
      const res = await fetchWithCredentials('/auth/me');
      if (!res.ok) throw new Error('Not authenticated');
      const data = await res.json();
      if (data.authenticated) {
        setUser({ username: data.username });
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (username, password) => {
    const res = await fetchWithCredentials('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Login failed');
    }

    await checkAuth();
  };

  const logout = async () => {
    const res = await fetchWithCredentials('/auth/logout', {
      method: 'POST',
    });

    if (!res.ok) {
      console.warn('Logout request failed');
    }

    setUser(null);
  };

  const changePassword = async (oldPassword, newPassword, confirmNewPassword) => {
    const res = await fetchWithCredentials('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({
        oldPassword,
        newPassword,
        confirmNewPassword,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Password change failed');
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, changePassword, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
