import robotsTxt from "../../public/robots.txt?raw";
import sitemapXml from "../../public/sitemap.xml?raw";

const SEO_STATIC_ROUTES: Record<string, { body: string; contentType: string }> = {
  "/robots.txt": {
    body: robotsTxt,
    contentType: "text/plain; charset=utf-8",
  },
  "/sitemap.xml": {
    body: sitemapXml,
    contentType: "application/xml; charset=utf-8",
  },
};

/** Serve bundled public/ SEO files when Nitro static output misses them on Vercel. */
export function seoStaticResponse(pathname: string): Response | undefined {
  const route = SEO_STATIC_ROUTES[pathname];
  if (!route) return undefined;

  return new Response(route.body, {
    status: 200,
    headers: {
      "content-type": route.contentType,
      "cache-control": "public, max-age=3600",
    },
  });
}
