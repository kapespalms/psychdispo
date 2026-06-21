export const SITE_URL = "https://psychdispo.com";

export function canonicalUrl(path: string): string {
  if (path === "/" || path === "") return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

type PageHeadOptions = {
  path: string;
  title: string;
  description: string;
  noindex?: boolean;
};

/** Shared head meta for public pages (title, description, OG, canonical). */
export function pageHead({ path, title, description, noindex }: PageHeadOptions) {
  const url = canonicalUrl(path);
  const meta: Array<Record<string, string>> = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { name: "twitter:card", content: "summary" },
  ];
  if (noindex) {
    meta.push({ name: "robots", content: "noindex, nofollow" });
  }
  return {
    meta,
    links: [{ rel: "canonical", href: url }],
  };
}
