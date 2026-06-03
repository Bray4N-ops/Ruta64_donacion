'use client';
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [nombreUser, setNombreUser] = useState('');
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [meta, setMeta] = useState('');
  const [creando, setCreando] = useState(false);
  const [cargando, setCargando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initDashboard = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Inicia sesión para acceder al panel');
        router.push('/login');
        return;
      }
      
      const currentUser = session.user;
      setUser(currentUser);

      // Cargar perfil
      const { data: perfil } = await supabase
        .from('perfiles')
        .select('nombre')
        .eq('id', currentUser.id)
        .single();
      setNombreUser(perfil?.nombre || currentUser.email || 'Usuario');

      // Cargar proyectos
      const { data: proys, error } = await supabase
        .from('proyectos')
        .select('*')
        .eq('beneficiario_id', currentUser.id);
      
      if (error) {
        console.error(error);
      } else {
        setProyectos(proys || []);
      }
      setCargando(false);
    };

    initDashboard();
  }, []);

  const crearProyecto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (parseFloat(meta) <= 0) {
      toast.error('La meta debe ser mayor a $0 MXN');
      return;
    }
    
    setCreando(true);
    const { error } = await supabase.from('proyectos').insert({
      beneficiario_id: user.id,
      titulo,
      descripcion,
      meta_pesos: parseFloat(meta),
      estado: 'pendiente',
    });

    if (error) {
      toast.error('Error al solicitar proyecto: ' + error.message);
    } else {
      toast.success('¡Solicitud enviada! Espera validación del administrador.');
      setTitulo('');
      setDescripcion('');
      setMeta('');
      // Recargar lista
      const { data: proys } = await supabase
        .from('proyectos')
        .select('*')
        .eq('beneficiario_id', user.id);
      setProyectos(proys || []);
    }
    setCreando(false);
  };

  // KPIs
  const totalRecaudado = proyectos.reduce((acc, curr) => acc + (curr.recaudado || 0), 0);
  const proyectosActivosCount = proyectos.filter(p => p.estado === 'activo').length;

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <svg className="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-sm font-semibold text-slate-500">Cargando tu panel...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Panel */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Mi panel</h1>
          <p className="text-sm text-slate-500 mt-1">
            Bienvenido de nuevo, <span className="font-semibold text-indigo-650">{nombreUser}</span>.
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-400 bg-slate-50 px-3.5 py-1.5 rounded-lg border border-slate-100">
          ID: {user?.id?.slice(0, 8)}...
        </div>
      </div>

      {/* Grid KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">{proyectos.length}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Proyectos Solicitados</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
              <path d="M10.75 2.75a.75.75 0 00-1.5 0v1.618c-.314.015-.624.044-.927.087A3.25 3.25 0 005.5 7.5v.55a.75.75 0 001.5 0V7.5a1.75 1.75 0 011.75-1.75h2.5A1.75 1.75 0 0113 7.5v1a1.75 1.75 0 01-1.75 1.75H9.014a3.25 3.25 0 00-2.222.858 2.25 2.25 0 00-.792 1.706V13.5a.75.75 0 001.5 0v-.686a.75.75 0 01.264-.568 1.75 1.75 0 011.196-.462h2.236A3.25 3.25 0 0014.5 8.536V7.5a3.25 3.25 0 00-3.227-3.25l-.523.003V2.75z" />
            </svg>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">${totalRecaudado.toLocaleString('es-MX')}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pesos Recaudados</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.333-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">{proyectosActivosCount}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Proyectos Activos</div>
          </div>
        </div>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Formulario Crear Proyecto */}
        <div className="lg:col-span-1">
          <form onSubmit={crearProyecto} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">Solicitar proyecto</h2>
              <p className="text-xs text-slate-400 mt-1">Registra tu iniciativa para pasar por validación.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Título del Proyecto</label>
                <input 
                  type="text" 
                  placeholder="Ej. Beca para Competencia de Robótica" 
                  className="form-input-focus w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400" 
                  value={titulo} 
                  onChange={e => setTitulo(e.target.value)} 
                  required 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Descripción detallada</label>
                <textarea 
                  placeholder="Explica detalladamente para qué se usará la donación..." 
                  rows={4}
                  className="form-input-focus w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400" 
                  value={descripcion} 
                  onChange={e => setDescripcion(e.target.value)} 
                  required 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Meta en pesos (MXN)</label>
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-sm font-bold text-slate-400">$</span>
                  <input 
                    type="number" 
                    placeholder="5000" 
                    className="form-input-focus w-full pl-8 pr-12 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400" 
                    value={meta} 
                    onChange={e => setMeta(e.target.value)} 
                    required 
                  />
                  <span className="absolute right-4 text-xs font-bold text-slate-450">MXN</span>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={creando}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-350 text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-md shadow-indigo-100 hover:shadow-lg hover:shadow-indigo-200 active:scale-[0.98] cursor-pointer"
            >
              {creando ? 'Enviando...' : 'Enviar a validación'}
            </button>
          </form>
        </div>

        {/* Lista de mis Proyectos */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Mis proyectos creados</h2>

            {proyectos.length > 0 ? (
              <div className="space-y-4">
                {proyectos.map((proy) => {
                  const porcentaje = proy.meta_pesos > 0 ? (proy.recaudado / proy.meta_pesos) * 100 : 0;
                  
                  // Detalle del estado visual
                  let badgeClass = 'bg-amber-50 text-amber-700 border-amber-100';
                  let estadoTexto = 'Pendiente';
                  if (proy.estado === 'activo') {
                    badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-100';
                    estadoTexto = 'Activo';
                  } else if (proy.estado === 'rechazado') {
                    badgeClass = 'bg-rose-50 text-rose-700 border-rose-100';
                    estadoTexto = 'Rechazado';
                  }

                  return (
                    <div 
                      key={proy.id} 
                      className="border border-slate-100 rounded-2xl p-5 hover:shadow-md hover:shadow-slate-50 transition-all space-y-4"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="font-bold text-slate-800 leading-snug">{proy.titulo}</h3>
                        <span className={`px-2.5 py-0.5 border text-xs font-semibold rounded-full ${badgeClass}`}>
                          {estadoTexto}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-indigo-500 to-teal-500 h-2 rounded-full" 
                            style={{ width: `${Math.min(porcentaje, 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500 font-semibold">
                          <span>${proy.recaudado.toLocaleString('es-MX')} recaudados</span>
                          <span>Meta: ${proy.meta_pesos.toLocaleString('es-MX')}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed border-slate-200 rounded-2xl max-w-sm mx-auto">
                <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18V6c0-1.1.9-2 2-2h9.75m-9.75 3.5h7.5" />
                  </svg>
                </div>
                <h3 className="font-bold text-slate-700 text-sm">No has solicitado proyectos</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-[200px] mx-auto">Usa el formulario lateral para registrar tu primer iniciativa.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}