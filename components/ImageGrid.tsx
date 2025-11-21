'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import ImageCard from './ImageCard';

type Item = {
  id: string;
  author: string;
  width: number;
  height: number;
  src: string;
  thumbnail: string;
};

export default function ImageGrid() {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [end, setEnd] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    setItems([]);
    setPage(1);
    setEnd(false);
  }, [debouncedQuery]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, debouncedQuery]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const int = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !loading && !end) {
          setPage((p) => p + 1);
        }
      },
      { rootMargin: '800px' }
    );
    int.observe(el);
    return () => int.disconnect();
  }, [loading, end]);

  async function load() {
    if (loading || end) return;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '30');
      if (debouncedQuery) params.set('q', debouncedQuery);
      const res = await fetch(`/api/images?${params.toString()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      const newItems: Item[] = data.items;
      setItems((prev) => (page === 1 ? newItems : [...prev, ...newItems]));
      if (newItems.length === 0) setEnd(true);
    } catch {
      setEnd(true);
    } finally {
      setLoading(false);
    }
  }

  const gridCols = useMemo(() => 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3', []);

  return (
    <>
      <div className="mb-6 flex items-center gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por autor?"
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-brand-500 focus:ring-2"
          aria-label="Buscar por autor"
        />
      </div>

      <div className={`grid ${gridCols} gap-4`}>
        {items.map((it) => (
          <ImageCard
            key={it.id + it.thumbnail}
            src={it.src}
            thumb={it.thumbnail}
            width={it.width}
            height={it.height}
            author={it.author}
          />
        ))}
      </div>

      <div ref={sentinelRef} className="h-10" />

      <div className="mt-6 text-center text-sm text-slate-500">
        {loading && 'Cargando?'}
        {!loading && end && items.length === 0 && 'No hay resultados.'}
        {!loading && end && items.length > 0 && 'Has llegado al final.'}
      </div>
    </>
  );
}

function useDebounce<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
