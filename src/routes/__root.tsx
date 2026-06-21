import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/router";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type CSSProperties, type ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { useIframeTemplateSync } from "@/components/tool-frame";
import { AuthProvider } from "@/lib/auth";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex flex-1 min-h-0 items-center justify-center px-6 py-10">
      <div className="state-panel">
        <p className="script-kicker script-kicker-compact">Not found</p>
        <h1>Page not found</h1>
        <p>The page you requested does not exist or has been moved.</p>
        <Link to="/" className="btn-blue">
          Return home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex flex-1 min-h-0 items-center justify-center px-6 py-10">
      <div className="state-panel">
        <p className="script-kicker script-kicker-compact">Error</p>
        <h1>This page did not load</h1>
        <p>Something went wrong. You can try again or return to the home page.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn-blue"
          >
            Try again
          </button>
          <Link to="/" className="nav-bar-link">
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: typeof queryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "PsychDispo · Psychiatric Disposition" },
      {
        name: "description",
        content:
          "Evidence-informed psychiatric disposition, discharge planning, verified community resources, and high-yield psychiatry reference.",
      },
      { property: "og:title", content: "PsychDispo · Psychiatric Disposition" },
      {
        property: "og:description",
        content:
          "From safety screen to patient packet — disposition workflow and psychiatry reference for clinicians.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..700;1,400..700&family=Instrument+Sans:wght@400;500;600;700;800&family=Poppins:wght@400;500;600&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>{children}</AuthProvider>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const router = useRouter();
  const path = router.state.location.pathname;
  const hideShellHeader = path === "/";

  useIframeTemplateSync();

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const data = event.data as { type?: string; path?: string } | null;
      if (data?.type !== "psychdispo-nav" || typeof data.path !== "string") return;
      const [pathname, hash] = data.path.split("#");
      if (!pathname.startsWith("/")) return;
      router.navigate({
        to: pathname as "/",
        ...(hash ? { hash: `#${hash}` } : {}),
      });
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [router]);

  const showPhiBanner = path === "/dispo";

  return (
    <div className="frame-outer">
      <div className="frame-inner">
        {!hideShellHeader && <SiteHeader />}
        <main
          className="flex flex-col flex-1 min-h-0 overflow-hidden"
          style={
            showPhiBanner
              ? ({ "--shell-header": "124px" } as CSSProperties)
              : ({ "--shell-header": "112px" } as CSSProperties)
          }
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
