export default {
  async fetch() {
    return proxyLua();
  },
};

async function proxyLua() {
  const rawUrl = "https://raw.githubusercontent.com/7yd7/Hub4V/Menu/client.luau";
  const res = await fetch(rawUrl, { cf: { cacheTtl: 120, cacheEverything: true } });

  if (!res.ok) {
    return new Response("-- failed to fetch script source", {
      status: 502,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  }

  const text = await res.text();
  return new Response(text, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });
}
