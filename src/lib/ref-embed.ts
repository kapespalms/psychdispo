/** Bump when public/psychref.html changes so iframe embeds bypass stale browser cache. */
export const PSYCHREF_HTML_BUILD = "nori-drawer-v1";

/** Bump when public/socialref.html changes so iframe embeds bypass stale browser cache. */
export const SOCIALREF_HTML_BUILD = "nori-tokens-v1";

export function psychrefEmbedSrc() {
  const params = new URLSearchParams({ embed: "1", v: PSYCHREF_HTML_BUILD });
  return `/psychref.html?${params}`;
}

export function socialrefEmbedSrc() {
  const params = new URLSearchParams({ embed: "1", v: SOCIALREF_HTML_BUILD });
  return `/socialref.html?${params}`;
}
