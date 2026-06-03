import { supabase } from '@/lib/supabaseClient';
import ListaProyectosConFiltro from '@/components/ListaProyectosConFiltro';

export default async function Home() {
  // Obtenemos los proyectos incluyendo el estado de ubicación del perfil
  const { data: proyectos } = await supabase
    .from('proyectos')
    .select('*, perfiles(nombre, estado)')
    .eq('estado', 'activo');

  return (
    <div className="space-y-16">
      {/* Sección Hero */}
      <section className="text-center max-w-4xl mx-auto space-y-6 pt-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100/50 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Plataforma de Microdonaciones en Vivo
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Impulsando el futuro del <br />
          <span className="gradient-text">talento mexicano</span>
        </h1>
        
        <p className="text-lg sm:text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
          Ruta 64 conecta directamente a donantes con estudiantes, investigadores y creadores en todo México a través de microdonaciones transparentes y seguras.
        </p>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 max-w-3xl mx-auto">
          <div className="bg-white/60 backdrop-blur-sm p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600">$185,400+</div>
            <div className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Pesos Recaudados</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="text-2xl sm:text-3xl font-extrabold text-teal-600">42</div>
            <div className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Proyectos Exitosos</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-800">100%</div>
            <div className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Transparencia Directa</div>
          </div>
        </div>
      </section>

      {/* Lista de Proyectos con Filtro */}
      <section className="space-y-6">
        <div className="border-t border-slate-100 pt-12">
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            🚀 Proyectos Activos
            <span className="text-sm font-medium text-slate-400">({proyectos?.length || 0})</span>
          </h2>
          <p className="text-slate-500 text-sm mt-1 mb-8">Apoya causas locales aportando desde $10 MXN.</p>
        </div>
        
        <ListaProyectosConFiltro proyectos={proyectos || []} />
      </section>
    </div>
  );
}