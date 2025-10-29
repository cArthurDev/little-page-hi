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
    }
    
    if (adminToken) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string, isAdmin: boolean = false) => {
    try {
      // Simulação de autenticação - em um app real, isso seria uma chamada API
      if (isAdmin) {
        // Verificar credenciais de admin
        if (email === 'arthur@gmail.com' && password === 'arthur123@') {
          localStorage.setItem('adminToken', 'admin-token-' + Date.now());
          setAdmin({ id: '1', email: email });
          setIsAuthenticated(true);
          return true;
        }
      } else {
        // Verificar credenciais de usuário normal
        if (email === 'user@teste.com' && password === 'user123@') {
          localStorage.setItem('userToken', 'user-token-' + Date.now());
          setUser({ id: '1', name: 'Usuário Teste', email, phone: '(11) 99999-9999', cpf: '123.456.789-00', pixKey: 'user@teste.com', emailVerified: true });
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