import './globals.css';
import Navbar from '@/components/Navbar';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Ruta 64 - Donación transparente',
  description: 'Plataforma de microdonaciones para talento mexicano',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <body className="flex flex-col min-h-screen bg-slate-50/50 hero-pattern antialiased">
        <Toaster position="top-right" toastOptions={{
          style: {
            background: '#ffffff',
            color: '#0f172a',
            borderRadius: '12px',
            border: '1px solid rgba(226, 232, 240, 0.8)',
            fontSize: '14px',
            fontWeight: 500,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          }
        }} />
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-8 md:py-12 max-w-7xl">
          {children}
        </main>
        <footer className="border-t border-slate-100 bg-white/50 backdrop-blur-sm py-8 text-center text-sm text-slate-500">
          <div className="container mx-auto px-4">
            <p className="font-semibold text-slate-700">Ruta 64 &copy; {new Date().getFullYear()}</p>
            <p className="mt-1 text-xs">Apoyando e impulsando el talento mexicano mediante microdonaciones 100% transparentes.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}