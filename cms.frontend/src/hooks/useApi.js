import { useState, useEffect } from 'react';

const BASE = process.env.REACT_APP_API_URL || 'https://localhost:7094/api';

export function useApi(path) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!path) { setLoading(false); return; }
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetch(`${BASE}${path}`)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(d => { if (!cancelled) { setData(d); setLoading(false); } })
      .catch(e => { if (!cancelled) { setError(e.message); setLoading(false); } });

    return () => { cancelled = true; };
  }, [path]);

  return { data, loading, error };
}

export const IMG_BASE = process.env.REACT_APP_IMAGE_BASE_URL || 'https://localhost:7094';

export function imgUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${IMG_BASE}${path}`;
}

export function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
}
