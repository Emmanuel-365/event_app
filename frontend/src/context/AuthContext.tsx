import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { getMe } from '../services/authService';

interface User {
  id: number;
  email: string;
  role: string;
  // Profile data will be fetched separately when needed
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const res = await getMe();
        // The backend sends profile data, but we only need user data for auth context
        // We need to extract the role from the user object nested in the profile
        const role = res.data.user.role;
        setUser({ id: res.data.user.id, email: res.data.user.email, role });
      } catch {
        console.log('Not logged in');
      } finally {
        setLoading(false);
      }
    };
    checkLoggedIn();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
