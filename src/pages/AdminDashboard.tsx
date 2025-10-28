import React, { useState, useEffect } from 'react';
import { Search, Trash2, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  pixKey: string;
  emailVerified: boolean;
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    // Simulação de dados - na implementação real, viria da API
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'Maria Clara',
        email: 'maria@example.com',
        phone: '(11) 99999-9999',
        cpf: '123.456.789-00',
        pixKey: 'maria@pix.com',
        emailVerified: true
      },
      {
        id: '2',
        name: 'João Silva',
        email: 'joao@example.com',
        phone: '(21) 88888-8888',
        cpf: '987.654.321-00',
        pixKey: 'joao@pix.com',
        emailVerified: false
      }
    ];
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const handleDeleteAll = () => {
    if (window.confirm('Tem certeza que deseja excluir todos os cadastros? Esta ação não pode ser desfeita.')) {
      if (window.confirm('Esta é a última confirmação. Deseja realmente excluir todos os cadastros?')) {
        setUsers([]);
        setFilteredUsers([]);
        // Aqui chamaria a API para deletar todos os registros
      }
    }
  };

  const handlePixAction = (userId: string) => {
    // Ação a ser definida - poderia ser abrir modal de PIX, gerar QR code, etc.
    console.log('Ação PIX para usuário:', userId);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Painel Administrativo</h1>
          <p className="text-muted-foreground">Gerencie todos os membros cadastrados</p>
        </div>

        {/* Barra de pesquisa e botão de exclusão */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder="Pesquisar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            onClick={handleDeleteAll}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <Trash2 size={20} />
            Excluir todos
          </Button>
        </div>

        {/* Container principal com efeito blur */}
        <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <Card key={user.id} className="bg-white/90 backdrop-blur-sm border border-white/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold">{user.name}</CardTitle>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${user.emailVerified ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <span className="text-sm text-muted-foreground">
                      {user.emailVerified ? 'E-mail verificado' : 'E-mail pendente'}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">E-mail</p>
                    <p className="text-sm">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <p className="text-sm">{user.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CPF</p>
                    <p className="text-sm">{user.cpf}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Chave PIX</p>
                    <p className="text-sm">{user.pixKey}</p>
                  </div>
                  <Button
                    onClick={() => handlePixAction(user.id)}
                    className="w-full mt-4 bg-green-600 hover:bg-green-700 flex items-center gap-2"
                  >
                    <DollarSign size={16} />
                    Ação PIX
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum usuário encontrado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;