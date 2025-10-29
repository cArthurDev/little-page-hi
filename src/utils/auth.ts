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

// Dados fixos de administrador
const ADMIN_DATA: Admin = {
  id: '1',
  email: 'arthur@gmail.com'
};

// Dados fixos de usuário
const USER_DATA: User = {
  id: '1',
  name: 'Usuário Teste',
  email: 'user@teste.com',
  phone: '(11) 99999-9999',
  cpf: '123.456.789-00',
  pixKey: 'user@teste.com',
  emailVerified: true
};

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const adminToken = localStorage.getItem('adminToken');
    
    if (token) {
      setIsAuthenticated(true);
      setUser(USER_DATA);
    }
    
    if (adminToken) {
      setIsAuthenticated(true);
      setAdmin(ADMIN_DATA);
    }
  }, []);

  const login = async (email: string, password: string, isAdmin: boolean = false) => {
    try {
      if (isAdmin) {
        // Verificar credenciais de admin
        if (email === ADMIN_DATA.email && password === 'arthur123@') {
          localStorage.setItem('adminToken', 'admin-token-' + Date.now());
          setAdmin(ADMIN_DATA);
          setIsAuthenticated(true);
          return true;
        }
      } else {
        // Verificar credenciais de usuário
        if (email === USER_DATA.email && password === 'user123@') {
          localStorage.setItem('userToken', 'user-token-' + Date.now());
          setUser(USER_DATA);
          setIsAuthenticated(true);
          return true;
        }
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