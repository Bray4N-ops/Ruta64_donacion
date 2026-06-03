'use client';
import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function Registro() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [estado, setEstado] = useState('CDMX');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const estadosMexico = ['CDMX', 'Jalisco', 'Nuevo León', 'Veracruz', 'Yucatán'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !nombre) {
      toast.error('Por favor completa todos los campos.');
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    if (data.user) {
      const { error: profileError } = await supabase.from('perfiles').insert({
        id: data.user.id,
        nombre,
        rol: 'donante',
        estado,
      });
      if (profileError) {
        toast.error('Error al guardar el perfil: ' + profileError.message);
      } else {
        toast.success('¡Registro exitoso! Por favor inicia sesión.');
        router.push('/login');
      }
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-6 sm:mt-12">
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Registro</h1>
          <p className="text-sm text-slate-500">Únete a la comunidad de Ruta 64 y apoya o crea causas.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre Completo</label>
            <input 
              type="text" 
              placeholder="Juan Pérez" 
              className="form-input-focus w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400" 
              value={nombre} 
              onChange={e => setNombre(e.target.value)} 
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ubicación (Estado)</label>
            <div className="relative">
              <select
                value={estado}
                onChange={e => setEstado(e.target.value)}
                className="form-input-focus w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 appearance-none cursor-pointer"
              >
                {estadosMexico.map(est => (
                  <option key={est} value={est}>{est}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Correo electrónico</label>
            <input 
              type="email" 
              placeholder="correo@ejemplo.com" 
              className="form-input-focus w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contraseña</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="form-input-focus w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-350 text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-md shadow-indigo-100 hover:shadow-lg hover:shadow-indigo-200 active:scale-[0.98] cursor-pointer"
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="text-center border-t border-slate-50 pt-5">
          <p className="text-sm text-slate-500">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}