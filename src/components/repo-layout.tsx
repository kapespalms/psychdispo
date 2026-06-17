import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import type { Block, Entry, Repository } from "@/data/repositories";
import { repositories } from "@/data/repositories";

function CommandBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-3 border border-border bg-card px-3 h-10 rounded-sm">
      <span className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground">
        Search
      </span>
      <span className="w-px h-4 bg-border" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Filter entries, dosing, criteria…"
        className="flex-1 bg-transparent outline-none font-mono text-xs placeholder:text-muted-foreground/60"
      />
      <kbd className="hidden sm:inline-block font-mono text-[10px] text-muted-foreground px-1.5 py-0.5 border border-border rounded-sm">
        ⌘K
      </kbd>
    </div>
  );
}

function RenderBlock({ block }: { block: Block }) {
  switch (block.kind) {
    case "prose":
      return (
        <section className="space-y-2">
          {block.heading && (
            <h4 className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground border-l-2 border-accent pl-2">
              {block.heading}
            </h4>
          )}
          <p className="text-[15px] leading-relaxed text-foreground/85">{block.body}</p>
        </section>
      );
    case "steps":
      return (
        <section className="space-y-3">
          <h4 className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground border-l-2 border-accent pl-2">
            {block.heading}
          </h4>
          <ol className="space-y-0">
            {block.items.map((it) => (
              <li
                key={it.ref}
                className="grid grid-cols-[3rem_1fr] gap-4 py-3 border-b border-border last:border-0"
              >
                <span className="font-mono text-[11px] text-muted-foreground pt-0.5">{" "}</span>
                <div>
                  <div className="text-[14px] text-foreground">{it.title}</div>
                  {it.detail && (
                    <div className="text-[13px] text-muted-foreground mt-0.5 leading-relaxed">
                      {it.detail}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>
      );
    case "kv":
      return (
        <section className="space-y-3">
          <h4 className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground border-l-2 border-accent pl-2">
            {block.heading}
          </h4>
          <dl className="divide-y divide-border border-y border-border">
            {block.rows.map((r) => (
              <div key={r.label} className="grid grid-cols-[12rem_1fr] gap-6 py-2.5">
                <dt className="font-mono text-[11px] tracking-wider text-muted-foreground">
                  {r.label}
                </dt>
                <dd className="text-[14px]">{r.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      );
    case "table":
      return (
        <section className="space-y-3">
          <h4 className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground border-l-2 border-accent pl-2">
            {block.heading}
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-foreground/80">
                  {block.columns.map((c) => (
                    <th
                      key={c}
                      className="text-left py-2 pr-6 font-mono text-[10px] tracking-wider text-muted-foreground"
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    {row.map((cell, j) => (
                      <td key={j} className="py-2.5 pr-6 align-top">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      );
    case "alert": {
      const isWarn = block.variant === "warning";
      return (
        <aside
          className={`border-l-2 ${isWarn ? "border-warning" : "border-accent"} bg-surface-2 px-4 py-3`}
        >
          <div
            className={`font-mono text-[10px] tracking-[0.18em] ${isWarn ? "text-warning-foreground" : "text-accent"}`}
          >
            {block.label}
          </div>
          <p className="mt-1 text-[13px] leading-relaxed text-foreground/85">{block.body}</p>
        </aside>
      );
    }
  }
}

function EntryView({ entry, repoNumber }: { entry: Entry; repoNumber: string }) {
  return (
    <article className="space-y-10">
      <header className="space-y-3 pb-6 border-b-2 border-foreground">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground">
            Ref · {" "}.{entry.ref}
          </span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl tracking-tight text-balance leading-[1.05]">
          {entry.title}
        </h1>
        {entry.summary && (
          <p className="text-[15px] text-muted-foreground max-w-2xl text-pretty leading-relaxed">
            {entry.summary}
          </p>
        )}
      </header>

      <div className="space-y-10">
        {entry.blocks.map((b, i) => (
          <RenderBlock key={i} block={b} />
        ))}
      </div>
    </article>
  );
}

export function RepoLayout({ repo }: { repo: Repository }) {
  const [query, setQuery] = useState("");
  const flatEntries = useMemo(
    () => repo.categories.flatMap((c) => c.entries.map((e) => ({ category: c, entry: e }))),
    [repo],
  );
  const [activeId, setActiveId] = useState(flatEntries[0]?.entry.id);

  const filtered = useMemo(() => {
    if (!query.trim()) return repo.categories;
    const q = query.toLowerCase();
    return repo.categories
      .map((c) => ({
        ...c,
        entries: c.entries.filter(
          (e) =>
            e.title.toLowerCase().includes(q) ||
            e.summary?.toLowerCase().includes(q) ||
            c.title.toLowerCase().includes(q),
        ),
      }))
      .filter((c) => c.entries.length > 0);
  }, [query, repo]);

  const active =
    flatEntries.find((x) => x.entry.id === activeId)?.entry ?? flatEntries[0]?.entry;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur border-b border-border">
        <div className="max-w-[1320px] mx-auto px-6 h-14 flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3 group">
            <span className="font-mono text-[10px] tracking-[0.22em] border border-foreground px-1.5 py-0.5">
              PsychDispo
            </span>
            <span className="font-serif italic text-base text-muted-foreground group-hover:text-foreground transition-colors">
              Clinical Index
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            {repositories.map((r) => {
              const active = r.slug === repo.slug;
              return (
                <Link
                  key={r.slug}
                  to={r.slug === "workflow" ? "/workflow" : "/reference"}
                  className={`group flex items-baseline gap-2 px-3 h-14 border-b-2 transition-colors ${
                    active
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="font-mono text-[10px] tracking-[0.18em]">
                    {" "}
                  </span>
                  <span className="text-[13px]">{r.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Repository identity strip */}
      <div className="border-b border-border bg-surface-2/40">
        <div className="max-w-[1320px] mx-auto px-6 py-8 grid grid-cols-12 gap-6 items-end">
          <div className="col-span-12 md:col-span-8">
            <div className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground mb-2">
              Repository {" "} · {repo.tagline}
            </div>
            <h2 className="font-serif text-3xl md:text-4xl tracking-tight">
              <span className="italic text-muted-foreground/70">{" "}/</span> {repo.title}
            </h2>
          </div>
          <div className="col-span-12 md:col-span-4">
            <p className="text-[13px] text-muted-foreground leading-relaxed">{repo.description}</p>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="flex-1 max-w-[1320px] mx-auto w-full px-6 py-10 grid grid-cols-12 gap-10">
        {/* Left rail */}
        <aside className="col-span-12 md:col-span-3 space-y-6">
          <CommandBar value={query} onChange={setQuery} />

          <nav className="space-y-6">
            {filtered.map((cat) => (
              <div key={cat.id} className="space-y-2">
                <div className="flex items-baseline justify-between border-b border-border pb-1">
                  <h3 className="font-mono text-[10px] tracking-[0.18em] text-muted-foreground">
                    {" "} {cat.title}
                  </h3>
                  <span className="font-mono text-[10px] text-muted-foreground/60">
                    {cat.entries.length}
                  </span>
                </div>
                <ul>
                  {cat.entries.map((e) => {
                    const isActive = e.id === active?.id;
                    return (
                      <li key={e.id}>
                        <button
                          onClick={() => setActiveId(e.id)}
                          className={`w-full text-left flex items-baseline gap-3 py-1.5 px-1 border-l-2 transition-colors ${
                            isActive
                              ? "border-accent bg-accent/5 text-foreground"
                              : "border-transparent text-muted-foreground hover:text-foreground hover:border-border-strong"
                          }`}
                        >
                          <span className="font-mono text-[10px]">{" "}</span>
                          <span className="text-[13px] leading-snug">{e.title}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="font-mono text-[11px] text-muted-foreground">No entries match.</p>
            )}
          </nav>
        </aside>

        {/* Content */}
        <main className="col-span-12 md:col-span-9 md:pl-6 md:border-l border-border">
          {active && <EntryView entry={active} repoNumber={repo.number} />}
        </main>
      </div>

      <footer className="border-t border-border mt-12">
        <div className="max-w-[1320px] mx-auto px-6 py-6 flex items-center justify-between">
          <span className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground">
            Clinician-only · Reference, not a substitute for clinical judgment
          </span>
          <span className="font-mono text-[10px] tracking-[0.22em] text-muted-foreground">
            v0.1 · Internal
          </span>
        </div>
      </footer>
    </div>
  );
}
