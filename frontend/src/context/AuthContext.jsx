// AuthContext — 인증 상태 관리
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMyInfo } from '../api/userApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // URL에서 토큰 파라미터 확인 (OAuth2 콜백 후)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('accessToken', token);
      // URL에서 토큰 파라미터 제거
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const userData = await getMyInfo();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (err) {
      console.error('인증 확인 실패:', err);
      localStorage.removeItem('accessToken');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = (provider = 'naver') => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    window.location.href = `${baseUrl}/oauth2/authorization/${provider}`;
  };

  const loginWithToken = async (token) => {
    localStorage.setItem('accessToken', token);
    await fetchUser();
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, loginWithToken, logout, refetch: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
