'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';

export default function DonarButton({ proyectoId }: { proyectoId: number }) {
  const [monto, setMonto] = useState<number>(100);
  const [loading, setLoading] = useState(false);

  const presets = [50, 100, 250, 500];

  const handleDonar = async () => {
    if (monto <= 0) {
      toast.error('Por favor ingresa un monto válido mayor a $0');
      return;
    }

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Inicia sesión para poder realizar una donación');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proyecto_id: proyectoId,
          monto: Math.round(monto * 100), // Stripe usa centavos
          email: user.email,
        }),
      });
      const data = await res.json();
      if (data.url) {
        toast.loading('Redirigiendo a Stripe...');
        window.location.href = data.url;
      } else {
        toast.error(data.error || 'Error al iniciar el pago.');
      }
    } catch (error: any) {
      toast.error('Hubo un problema al procesar la solicitud.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Botones de montos rápidos */}
      <div className="grid grid-cols-4 gap-2">
        {presets.map((val) => (
          <button
            key={val}
            type="button"
            onClick={() => setMonto(val)}
            className={`py-2 rounded-xl text-xs font-bold transition-all border ${
              monto === val
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-350'
            }`}
          >
            ${val}
          </button>
        ))}
      </div>

      {/* Input de monto personalizado */}
      <div className="relative flex items-center">
        <span className="absolute left-4 text-sm font-bold text-slate-400">$</span>
        <input
          type="number"
          min="1"
          placeholder="Monto personalizado"
          value={monto || ''}
          onChange={(e) => setMonto(Number(e.target.value))}
          className="form-input-focus w-full pl-8 pr-16 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700"
        />
        <span className="absolute right-4 text-xs font-bold text-slate-400">MXN</span>
      </div>

      {/* Botón de envío */}
      <button
        onClick={handleDonar}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-md shadow-indigo-100 hover:shadow-lg hover:shadow-indigo-200 active:scale-[0.98] disabled:scale-100 disabled:pointer-events-none cursor-pointer"
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Procesando...
          </>
        ) : (
          `Donar $${(monto || 0).toLocaleString('es-MX')} MXN`
        )}
      </button>
    </div>
  );
}