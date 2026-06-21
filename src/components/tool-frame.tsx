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
      className="shrink-0 px-6 sm:px-10 py-2.5 text-[0.8125rem] leading-snug text-[var(--mut)] border-b border-[var(--line)] bg-[var(--paper)]"
      role="status"
    >
      Consult psychiatry when available. Clinical decisions remain with the treating team.
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
    <div className="flex flex-col flex-1 min-h-0 bg-[var(--paper)]">
      {showPhiBanner && <PhiBanner />}
      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        className="w-full flex-1 min-h-[80vh] border-0 bg-[var(--paper)]"
        style={{ height: "calc(100dvh - var(--shell-header, 88px))" }}
      />
    </div>
  );
}

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
