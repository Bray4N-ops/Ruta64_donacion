'use client';
import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Registro() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const router = useRouter();

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    // 1. Crear usuario en auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email, password,
    });
    if (authError) return alert(authError.message);

    // 2. Insertar perfil
    if (authData.user) {
      await supabase.from('perfiles').insert({
        id: authData.user.id,
        nombre,
        rol: 'donante',
      });
    }
    router.push('/login');
  };

  return (
    <form onSubmit={handleRegistro} className="p-4 max-w-md mx-auto">
      <input type="text" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} className="border p-2 w-full my-2" />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="border p-2 w-full my-2" />
      <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} className="border p-2 w-full my-2" />
      <button type="submit" className="bg-blue-500 text-white p-2 w-full">Registrarme</button>
    </form>
  );
}