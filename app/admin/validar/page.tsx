'use client';

import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface Proyecto {
  id: number;
  titulo: string;
  descripcion: string;
  meta_pesos: number;
  estado: string;
  perfiles: {
    nombre: string;
  };
}

export default function ValidarProyectos() {
  const [pendientes, setPendientes] = useState<Proyecto[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarPendientes();
  }, []);

  const cargarPendientes = async () => {
    setCargando(true);
    const { data, error } = await supabase
      .from('proyectos')
      .select('*, perfiles(nombre)')
      .eq('estado', 'pendiente');

    if (error) {
      toast.error('Error al cargar proyectos pendientes');
      console.error('Error al cargar proyectos:', error);
    } else {
      setPendientes(data || []);
    }
    setCargando(false);
  };

  const validar = async (id: number, aceptar: boolean) => {
    const nuevoEstado = aceptar ? 'activo' : 'rechazado';
    
    const action = async () => {
      const { error } = await supabase
        .from('proyectos')
        .update({ estado: nuevoEstado })
        .eq('id', id);
      if (error) throw error;
    };

    toast.promise(action(), {
      loading: 'Actualizando estado del proyecto...',
      success: () => {
        cargarPendientes();
        return `Proyecto ${aceptar ? 'aprobado' : 'rechazado'} correctamente.`;
      },
      error: 'Error al actualizar el proyecto.',
    });
  };

  if (cargando) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <svg className="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="text-sm font-semibold text-slate-500">Cargando solicitudes...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          📋 Panel de Validación
        </h1>
        <p className="text-slate-500 text-sm max-w-2xl leading-relaxed">
          Revisa las solicitudes de financiamiento enviadas por los creadores. 
          Asegúrate de validar la veracidad de la información y la coherencia de la meta antes de aprobar.
        </p>
      </div>

      {pendientes.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">¡Todo al día!</h3>
            <p className="text-slate-500 text-xs mt-1">No hay proyectos pendientes de validación en este momento.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {pendientes.map((proy) => (
            <div 
              key={proy.id} 
              className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-md transition-all space-y-6"
            >
              <div>
                <h2 className="text-xl font-bold text-slate-800 tracking-tight leading-snug">{proy.titulo}</h2>
                <p className="text-slate-600 text-sm mt-3 leading-relaxed bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                  {proy.descripcion}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-50 pt-5 text-sm">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Beneficiario</span>
                  <span className="font-bold text-slate-700">{proy.perfiles?.nombre || 'Sin nombre'}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Meta Solicitada</span>
                  <span className="font-bold text-indigo-600">${proy.meta_pesos.toLocaleString('es-MX')} MXN</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => validar(proy.id, true)}
                  className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-3 rounded-xl transition-all shadow-md shadow-emerald-100 hover:shadow-lg hover:shadow-emerald-200 active:scale-[0.98] cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                  Aprobar
                </button>
                <button
                  onClick={() => validar(proy.id, false)}
                  className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 font-bold text-sm px-5 py-3 rounded-xl transition-all border border-rose-100 hover:border-rose-200 active:scale-[0.98] cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                  Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}