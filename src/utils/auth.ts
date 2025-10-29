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
      // Em uma implementação real, buscaria os dados do usuário pelo token
    }
    
    if (adminToken) {
      // Em uma implementação real, buscaria os dados do admin pelo token
    }
  }, []);

  const login = async (email: string, password: string, isAdmin: boolean = false) => {
    try {
      let data;
      if (isAdmin) {
        // Carregar dados dos admins
        const response = await fetch('/data/admins.txt');
        data = await response.json();
      } else {
        // Carregar dados dos usuários
        const response = await fetch('/data/users.txt');
        data = await response.json();
      }
      
      const foundUser = data.find((u: any) => u.email === email && u.password === password);
      
      if (foundUser) {
        if (isAdmin) {
          localStorage.setItem('adminToken', 'admin-token-' + Date.now());
          setAdmin({ id: foundUser.id, email: foundUser.email });
        } else {
          localStorage.setItem('userToken', 'user-token-' + Date.now());
          setUser(foundUser);
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