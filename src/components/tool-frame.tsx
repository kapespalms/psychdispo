import { useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { saveCloudTemplate } from "@/lib/cloud-library";
import { isSupabaseConfigured } from "@/lib/supabase";
import { saveLocalTemplate, type PlanTemplate } from "@/lib/templates";

export type ToolFrameProps = {
  src: string;
  title: string;
  showPhiBanner?: boolean;
};

function PhiBanner() {
  return (
    <div
      className="shrink-0 flex items-center gap-2 text-xs text-[#22202A] bg-[#eef1fb] border-b border-[#cdd5f5] px-4 py-2.5"
      role="status"
    >
      <svg
        className="w-4 h-4 text-[#2A43C0] shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        aria-hidden
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
      <span>
        Patient details never leave this device — print and export stay local; your library saves
        templates only.
      </span>
    </div>
  );
}

export function ToolFrame({ src, title, showPhiBanner }: ToolFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { user, supabaseEnabled } = useAuth();

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const postAuth = () => {
      iframe.contentWindow?.postMessage(
        {
          type: "psychdispo-auth",
          user: user
            ? { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt }
            : null,
          supabaseConfigured: isSupabaseConfigured(),
          supabaseEnabled,
        },
        "*",
      );
    };

    const onLoad = () => postAuth();
    iframe.addEventListener("load", onLoad);
    postAuth();

    return () => iframe.removeEventListener("load", onLoad);
  }, [user, src, supabaseEnabled]);

  return (
    <div className="flex flex-col h-screen min-h-0 bg-[#f6f6f3]">
      {showPhiBanner && <PhiBanner />}
      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        className="flex-1 w-full h-full border-0 min-h-0"
      />
    </div>
  );
}

/** Handle template saves posted from embedded psychdispo.html */
export function useIframeTemplateSync() {
  const { user } = useAuth();

  useEffect(() => {
    const onMessage = async (event: MessageEvent) => {
      const data = event.data as {
        type?: string;
        template?: PlanTemplate;
      } | null;
      if (data?.type !== "psychdispo-save-template" || !data.template) return;

      const { template } = data;
      const scaffold = template.scaffold;
      const name = template.name;
      const type = template.type ?? "clinical";

      if (user && isSupabaseConfigured()) {
        try {
          await saveCloudTemplate(name, scaffold);
        } catch {
          saveLocalTemplate(user.email, name, scaffold, type);
        }
      } else if (user) {
        saveLocalTemplate(user.email, name, scaffold, type);
      } else {
        saveLocalTemplate(undefined, name, scaffold, type);
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [user]);
}
