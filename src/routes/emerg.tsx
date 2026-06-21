import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ToolFrame } from "@/components/tool-frame";
import { psychdispoEmbedSrc } from "@/lib/psychdispo-embed";

export const Route = createFileRoute("/emerg")({
  head: () => ({
    meta: [
      { title: "Psych Emerg · Review" },
      {
        name: "description",
        content:
          "Evidence-based psychiatric emergency reference — suicide, agitation, psychosis, delirium, and disposition logic.",
      },
    ],
  }),
  component: EmergPage,
});

function EmergPage() {
  const [iframeHash, setIframeHash] = useState("ref");

  useEffect(() => {
    const sync = () => {
      setIframeHash(window.location.hash.toLowerCase() === "#suicide" ? "suicide" : "ref");
    };
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  return (
    <ToolFrame
      src={psychdispoEmbedSrc(iframeHash)}
      title="Psych Emerg · Review"
    />
  );
}
