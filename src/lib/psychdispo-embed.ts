/** Bump when public/psychdispo.html changes so iframe embeds bypass stale browser cache. */
export const PSYCHDISPO_HTML_BUILD = "case-card-nav-polish";

export function psychdispoEmbedSrc(
  hash: string,
  extra?: Record<string, string | undefined>,
): string {
  const params = new URLSearchParams({ embed: "1", v: PSYCHDISPO_HTML_BUILD });
  if (extra) {
    for (const [key, value] of Object.entries(extra)) {
      if (value) params.set(key, value);
    }
  }
  return `/psychdispo.html?${params.toString()}#${hash}`;
}
