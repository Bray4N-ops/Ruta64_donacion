'use client';
import { useState } from 'react';
import ProyectoCard from './ProyectoCard';
import FiltroEstados from './FiltroEstados';

export default function ListaProyectosConFiltro({ proyectos }: { proyectos: any[] }) {
  const [estado, setEstado] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');

  const filtered = proyectos.filter(p => {
    const matchesEstado = estado === 'Todos' || 
                          p.estado_ubicacion === estado || 
                          p.perfiles?.estado === estado;
    
    const matchesBusqueda = p.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
                            (p.perfiles?.nombre || '').toLowerCase().includes(busqueda.toLowerCase());
                            
    return matchesEstado && matchesBusqueda;
  });

  return (
    <div className="space-y-8">
      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-slate-150/80 shadow-sm backdrop-blur-sm bg-white/70">
        <div className="relative w-full sm:max-w-md flex items-center">
          <div className="absolute left-3 text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
            </svg>
          </div>
          <input 
            type="text" 
            placeholder="Buscar por título o beneficiario..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="form-input-focus w-full pl-10 pr-4 py-2.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200 text-sm rounded-xl text-slate-700 placeholder:text-slate-400"
          />
        </div>
        
        <div className="w-full sm:w-auto flex justify-end">
          <FiltroEstados onChange={setEstado} />
        </div>
      </div>

      {/* Lista de Proyectos */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(proy => (
            <div key={proy.id} className="h-full">
              <ProyectoCard proyecto={proy} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-white rounded-3xl border border-dashed border-slate-200 max-w-md mx-auto">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-800">No se encontraron proyectos</h3>
          <p className="text-slate-500 text-sm mt-1">Intenta ajustando los términos de búsqueda o cambiando el filtro de estado.</p>
        </div>
      )}
    </div>
  );
}