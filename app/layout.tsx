import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Im?genes ? Gallery',
  description: 'Explora una galer?a de im?genes de Picsum',
  metadataBase: new URL('https://agentic-d78e591b.vercel.app'),
  openGraph: {
    title: 'Im?genes ? Gallery',
    description: 'Explora una galer?a de im?genes de Picsum',
    url: 'https://agentic-d78e591b.vercel.app',
    siteName: 'Im?genes',
    images: [{ url: 'https://picsum.photos/1200/630', width: 1200, height: 630 }],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Im?genes ? Gallery',
    description: 'Explora una galer?a de im?genes de Picsum',
    images: ['https://picsum.photos/1200/630'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-white text-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <header className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">Im?genes</h1>
            <a href="https://picsum.photos" className="text-sm text-slate-500 hover:text-slate-700">Fuente: Picsum</a>
          </header>
          {children}
          <footer className="mt-12 text-center text-xs text-slate-500">
            Hecho con Next.js y Tailwind CSS
          </footer>
        </div>
      </body>
    </html>
  );
}
