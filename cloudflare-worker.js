export default {
  async fetch(request) {
    const url = new URL(request.url);
    const ua = (request.headers.get("user-agent") || "").toLowerCase();
    const accept = (request.headers.get("accept") || "").toLowerCase();

    if (url.pathname === "/raw" || url.pathname === "/client.luau" || url.searchParams.has("raw")) {
      return proxyLua();
    }

    const isBrowser =
      (ua.includes("mozilla") || ua.includes("chrome") || ua.includes("safari") || ua.includes("firefox") || ua.includes("edge") || ua.includes("mobile")) &&
      accept.includes("text/html");

    if (isBrowser) {
      return fetch("https://7yd7.pages.dev/", {
        headers: {
          "user-agent": request.headers.get("user-agent") || "",
        },
      });
    }

    return proxyLua();
  },
};

async function proxyLua() {
  const rawUrl = "https://raw.githubusercontent.com/7yd7/Hub4V/Menu/client.luau";
  const res = await fetch(rawUrl, { cf: { cacheTtl: 120, cacheEverything: true } });

  if (!res.ok) {
    return new Response("-- failed to fetch script source from github", {
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
