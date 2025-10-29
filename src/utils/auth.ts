import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  pixKey: string;
  emailVerified: boolean;
}

interface Admin {
  id: string;
  email: string;
}

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const adminToken = localStorage.getItem('adminToken');
    
    if (token) {
      setIsAuthenticated(true);
      // Carregar dados do usuário
      const storedUser = localStorage.getItem('userData');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    
    if (adminToken) {
      setIsAuthenticated(true);
      // Carregar dados do admin
      const storedAdmin = localStorage.getItem('adminData');
      if (storedAdmin) {
        setAdmin(JSON.parse(storedAdmin));
      } else {
        // Tentar carregar do arquivo de dados
        fetch('/data/admins.txt')
          .then(res => res.json())
          .then(data => {
            if (data.length > 0) {
              setAdmin(data[0]);
              localStorage.setItem('adminData', JSON.stringify(data[0]));
            }
          })
          .catch(console.error);
      }
    }
  }, []);

  const login = async (email: string, password: string, isAdmin: boolean = false) => {
    try {
      let data;
      if (isAdmin) {
        data = await fetch('/data/admins.txt').then(res => res.json());
      } else {
        data = await fetch('/data/users.txt').then(res => res.json());
      }
      
      const foundUser = data.find((u: any) => u.email === email && u.password === password);
      
      if (foundUser) {
        if (isAdmin) {
          localStorage.setItem('adminToken', 'admin-token-' + Date.now());
          setAdmin(foundUser);
          localStorage.setItem('adminData', JSON.stringify(foundUser));
        } else {
          localStorage.setItem('userToken', 'user-token-' + Date.now());
          setUser(foundUser);
          localStorage.setItem('userData', JSON.stringify(foundUser));
        }
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('adminData');
    setIsAuthenticated(false);
    setUser(null);
    setAdmin(null);
  };

  return {
    isAuthenticated,
    user,
    admin,
    login,
    logout
  };
};