import { NextRequest } from 'next/server';

export const revalidate = 60;

type PicsumItem = {
  id: string;
  author: string;
  width: number;
  height: number;
  download_url: string;
  url: string;
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get('page') ?? '1');
  const limit = Math.min(Number(searchParams.get('limit') ?? '24'), 100);
  const q = (searchParams.get('q') ?? '').toLowerCase();

  const resp = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=${limit}`, {
    next: { revalidate: 60 },
  });

  if (!resp.ok) {
    return new Response(JSON.stringify({ error: 'Upstream error' }), { status: resp.status });
  }

  let data = (await resp.json()) as PicsumItem[];
  if (q) {
    data = data.filter((item) => item.author.toLowerCase().includes(q));
  }

  const items = data.map((item) => ({
    id: item.id,
    author: item.author,
    width: item.width,
    height: item.height,
    src: item.download_url,
    thumbnail: `https://picsum.photos/id/${item.id}/600/400`,
  }));

  return Response.json({ items, page, count: items.length });
}
