import { useEffect, useState } from 'react';

export default function Home() {
  const [count, setCount] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    fetch('/api/list')
      .then((r) => r.json())
      .then((j) => setCount(Array.isArray(j) ? j.length : 0))
      .catch((e) => setErr(String(e)));
  }, []);

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif', padding: 24 }}>
      <h1>Noyan's Demons — Local API</h1>
      <p>
        This development site exposes an AREDL-like JSON at <a href="/api/list">/api/list</a>.
      </p>
      <p>
        {err ? (
          <span style={{ color: 'crimson' }}>Failed to load list: {err}</span>
        ) : count == null ? (
          'Loading...'
        ) : (
          <span>Loaded {count} items from <code>/api/list</code>.</span>
        )}
      </p>
      <p>
        If you want the C++ client to use this API, run the Next dev server and build the C++ project with the default or overridden AREDL URL.
      </p>
    </div>
  );
}
