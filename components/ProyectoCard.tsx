import Link from 'next/link';

interface Proyecto {
  id: number;
  titulo: string;
  descripcion: string;
  meta_pesos: number;
  recaudado: number;
  perfiles: { nombre: string; estado?: string };
  estado_ubicacion?: string;
}

export default function ProyectoCard({ proyecto }: { proyecto: Proyecto }) {
  const porcentaje = proyecto.meta_pesos > 0 ? (proyecto.recaudado / proyecto.meta_pesos) * 100 : 0;
  const porcentajeDisplay = Math.min(porcentaje, 100).toFixed(0);
  const ubicacion = proyecto.estado_ubicacion || proyecto.perfiles?.estado || 'México';

  return (
    <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-50/50 hover:-translate-y-1 flex flex-col justify-between h-full group bg-white border border-slate-100">
      <div>
        <div className="flex justify-between items-start gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
              <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.361 7.587a16.294 16.294 0 002.579 2.067l.012.007.006.003.002.001v-.002zM10 12a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            {ubicacion}
          </span>
          <span className="text-sm font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-lg">
            {porcentajeDisplay}%
          </span>
        </div>

        <h3 className="text-xl font-bold text-slate-800 tracking-tight leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
          {proyecto.titulo}
        </h3>
        
        <p className="text-slate-500 text-sm mt-1 mb-4">
          Por <span className="font-medium text-slate-700">{proyecto.perfiles?.nombre || 'Beneficiario'}</span>
        </p>

        <p className="text-slate-600 text-sm line-clamp-3 mb-6 leading-relaxed">
          {proyecto.descripcion}
        </p>
      </div>

      <div className="mt-auto">
        <div className="space-y-2 mb-5">
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-teal-500 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(porcentaje, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs font-semibold text-slate-500">
            <span>Recaudado: <strong className="text-slate-800">${proyecto.recaudado.toLocaleString('es-MX')}</strong></span>
            <span>Meta: <strong className="text-slate-800">${proyecto.meta_pesos.toLocaleString('es-MX')}</strong></span>
          </div>
        </div>

        <Link 
          href={`/proyecto/${proyecto.id}`} 
          className="w-full inline-flex items-center justify-center bg-slate-900 hover:bg-indigo-600 active:bg-indigo-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-[0.98] group/btn"
        >
          Apoyar Proyecto
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1.5 transition-transform group-hover/btn:translate-x-0.5">
            <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.97H3.75A.75.75 0 013 10z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </div>
  );
}