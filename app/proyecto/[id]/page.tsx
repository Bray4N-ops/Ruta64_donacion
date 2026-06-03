import { supabase } from '@/lib/supabaseClient';
import DonarButton from '@/components/DonarButton';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function ProyectoPage({ params }: { params: { id: string } }) {
  const { data: proyecto, error } = await supabase
    .from('proyectos')
    .select('*, perfiles(nombre, estado)')
    .eq('id', parseInt(params.id))
    .single();

  if (error || !proyecto) return notFound();

  const porcentaje = proyecto.meta_pesos > 0 ? (proyecto.recaudado / proyecto.meta_pesos) * 100 : 0;
  const porcentajeDisplay = Math.min(porcentaje, 100).toFixed(0);
  const ubicacion = proyecto.estado_ubicacion || proyecto.perfiles?.estado || 'México';

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Botón Volver */}
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 text-sm font-semibold transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
        </svg>
        Volver a Proyectos
      </Link>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Columna Izquierda: Información del Proyecto */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                  <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.361 7.587a16.294 16.294 0 002.579 2.067l.012.007.006.003.002.001v-.002zM10 12a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
                {ubicacion}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                Verificado
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {proyecto.titulo}
            </h1>

            <div className="flex items-center gap-3 border-y border-slate-50 py-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                {(proyecto.perfiles?.nombre || 'B').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Creador del Proyecto</p>
                <p className="text-sm font-bold text-slate-700">{proyecto.perfiles?.nombre || 'Beneficiario'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-800">Sobre esta iniciativa</h2>
              <p className="text-slate-600 text-base leading-relaxed whitespace-pre-wrap">
                {proyecto.descripcion}
              </p>
            </div>
          </div>

          {/* Garantías de Transparencia */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex gap-4 items-start">
            <div className="text-indigo-600 pt-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                <path fillRule="evenodd" d="M10.338 1.41a1 1 0 01.324.791v14.598a1 1 0 01-1.324.947L4.3 16.03a1 1 0 01-.632-.947V2.917a1 1 0 01.632-.947L9.338 1.07a1 1 0 011 .34zM12 4.25a.75.75 0 01.75-.75h2a.75.75 0 01.75.75v11.5a.75.75 0 01-.75.75h-2a.75.75 0 01-.75-.75V4.25z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-700">Donaciones Directas y Transparentes</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Ruta 64 no retiene comisiones adicionales sobre tu apoyo. Las donaciones se procesan instantáneamente a través de Stripe y se reflejan directamente en el fondo del beneficiario. Puedes seguir el avance del proyecto en tiempo real.
              </p>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Tarjeta de Donación */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm sticky top-24 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">Apoya esta meta</h2>
              <p className="text-xs text-slate-400 mt-1">Ingresa el monto que deseas aportar al proyecto.</p>
            </div>

            {/* Progreso */}
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-3xl font-extrabold text-slate-800">
                  ${proyecto.recaudado.toLocaleString('es-MX')}
                  <span className="text-xs font-semibold text-slate-400 ml-1">MXN</span>
                </span>
                <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  {porcentajeDisplay}%
                </span>
              </div>
              
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-teal-500 h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(porcentaje, 100)}%` }}
                ></div>
              </div>

              <div className="text-xs text-slate-500">
                Meta de financiamiento: <strong className="text-slate-700">${proyecto.meta_pesos.toLocaleString('es-MX')} MXN</strong>
              </div>
            </div>

            {/* Módulo de Pago */}
            <div className="border-t border-slate-100 pt-5">
              <DonarButton proyectoId={proyecto.id} />
            </div>

            <div className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5 pt-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-slate-400">
                <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
              </svg>
              Pago seguro encriptado vía Stripe
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}