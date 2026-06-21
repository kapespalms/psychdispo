# Google Search Console — PsychDispo indexing

PsychDispo is deployed on **Vercel** with **TanStack Start SSR**, so public pages ship real HTML (titles, descriptions, and body copy) without waiting for JavaScript. Static `robots.txt` and `sitemap.xml` live in `public/`.

## 1. Verify domain ownership

1. Open [Google Search Console](https://search.google.com/search-console).
2. Add property → **Domain** → enter `psychdispo.com`.
3. Copy the TXT record Google provides (e.g. `google-site-verification=…`).
4. In your DNS host (where `psychdispo.com` is managed), add a **TXT** record:
   - **Host / name:** `@` (or the root domain)
   - **Value:** the full verification string from GSC
5. Wait a few minutes, then click **Verify** in Search Console.

> Tip: Domain property covers `www` and apex. If you only verify a URL-prefix property, verify both `https://psychdispo.com/` and `https://www.psychdispo.com/` or set a single canonical host in Vercel.

## 2. Submit the sitemap

1. In GSC, open **Sitemaps** (left nav).
2. Enter: `sitemap.xml`
3. Click **Submit**.

Live URL: https://psychdispo.com/sitemap.xml

Included public routes: `/`, `/directory`, `/social-care`, `/emerg`, `/about`, `/reference`, `/workflow`, `/social-ref`.

**Excluded** (noindex / PHI): `/dispo`, `/plans`, `/sign-in`, `/sign-up`, `/settings`, `/auth/*`.

## 3. Confirm crawlability

Check these after deploy:

| URL | Expected |
|-----|----------|
| https://psychdispo.com/robots.txt | `Allow: /` and sitemap line |
| https://psychdispo.com/sitemap.xml | XML urlset |
| https://psychdispo.com/ | View Source shows H1 + description text |
| https://psychdispo.com/directory | View Source shows page title + meta description |

Quick terminal check:

```bash
curl -s https://psychdispo.com/robots.txt
curl -s https://psychdispo.com/sitemap.xml
curl -s https://psychdispo.com/ | grep -o '<title>[^<]*'
```

## 4. URL inspection (spot-check)

For each priority URL (`/`, `/directory`, `/social-care`, `/emerg`):

1. GSC → **URL inspection**
2. Paste the full URL → **Test live URL**
3. Confirm **Page fetch** succeeds and **Indexing allowed** is yes
4. If status is “URL is not on Google”, click **Request indexing** (optional; Google still crawls via sitemap)

## 5. Ongoing

- After adding new **public** marketing pages, add the path to `public/sitemap.xml` and redeploy.
- Keep `/dispo` and `/plans` out of the sitemap; they carry `noindex` meta for PHI-sensitive workflows.
- Monitor **Pages** → **Indexed** in GSC after the first crawl (often 3–14 days for new sites).
