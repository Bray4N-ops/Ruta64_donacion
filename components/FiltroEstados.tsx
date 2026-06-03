'use client';
export default function FiltroEstados({ onChange }: { onChange: (estado: string) => void }) {
  const estados = ['Todos', 'CDMX', 'Jalisco', 'Nuevo León', 'Veracruz', 'Yucatán'];
  return (
    <div className="relative flex items-center">
      <div className="absolute left-3 text-slate-400 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
          <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.361 7.587a16.294 16.294 0 002.579 2.067l.012.007.006.003.002.001v-.002zM10 12a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      </div>
      <select 
        onChange={(e) => onChange(e.target.value)} 
        className="form-input-focus pl-10 pr-8 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-xl cursor-pointer hover:border-slate-300 transition-colors appearance-none"
      >
        {estados.map(est => (
          <option key={est} value={est} className="font-sans font-medium text-slate-700">{est}</option>
        ))}
      </select>
      <div className="absolute right-3 text-slate-400 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
}