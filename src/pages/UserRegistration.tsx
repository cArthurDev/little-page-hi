import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const registrationSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  phone: z.string().regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Telefone inválido. Use formato: (XX) XXXXX-XXXX'),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido. Use formato: XXX.XXX.XXX-XX'),
  pixKey: z.string().min(1, 'Chave PIX é obrigatória')
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

const UserRegistration = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema)
  });

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);
    setError('');

    try {
      // Simulação de verificação de unicidade
      // Na implementação real, chamaria a API para verificar
      const response = await fetch('/api/check-duplicates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpf: data.cpf, phone: data.phone, email: data.email })
      });

      const result = await response.json();

      if (result.hasDuplicates) {
        setError('Já existe um cadastro com este CPF, telefone ou e-mail.');
        return;
      }

      // Enviar e-mail de verificação
      await fetch('/api/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email })
      });

      setSuccess(true);
      reset();
    } catch (err) {
      setError('Erro ao processar cadastro. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="text-green-600 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Cadastro enviado!</h2>
            <p className="text-muted-foreground">
              Enviamos um e-mail de verificação para {localStorage.getItem('lastEmail') || 'seu e-mail'}.
              Por favor, verifique sua caixa de entrada.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Cadastro de Membros</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome completo</label>
              <Input {...register('name')} placeholder="Digite seu nome completo" />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">E-mail</label>
              <Input {...register('email')} type="email" placeholder="seu@email.com" />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Telefone (com DDD)</label>
              <Input {...register('phone')} placeholder="(XX) XXXXX-XXXX" />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">CPF</label>
              <Input {...register('cpf')} placeholder="XXX.XXX.XXX-XX" />
              {errors.cpf && <p className="text-red-500 text-sm mt-1">{errors.cpf.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Chave PIX</label>
              <Input {...register('pixKey')} placeholder="Chave PIX (e-mail, telefone, CPF, etc.)" />
              {errors.pixKey && <p className="text-red-500 text-sm mt-1">{errors.pixKey.message}</p>}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Cadastrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserRegistration;