'use client';
import Image from 'next/image';
import { useState } from 'react';
import clsx from 'clsx';

type Props = {
  src: string;
  author: string;
  width: number;
  height: number;
  thumb: string;
};

export default function ImageCard({ src, author, width, height, thumb }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="group relative block w-full overflow-hidden rounded-lg bg-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
        onClick={() => setOpen(true)}
        aria-label={`Ver imagen de ${author}`}
      >
        <Image
          src={thumb}
          alt={`Foto de ${author}`}
          width={600}
          height={400}
          className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-2 text-left text-xs text-white">
          {author}
        </div>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute right-2 top-2 z-10 rounded bg-black/60 px-2 py-1 text-xs text-white hover:bg-black/80"
              onClick={() => setOpen(false)}
            >
              Cerrar
            </button>
            <Image
              src={src}
              alt={`Foto de ${author}`}
              width={width}
              height={height}
              className={clsx('h-full w-full rounded-lg object-contain')}
              sizes="100vw"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
