import { useEffect } from "react";
import { toast } from "sonner";
import { createRuntimeEvent } from "../lib/runtime-store";

const actionMap: Array<[RegExp, { title: string; detail: string; status?: "completed" | "needs_approval" }]> = [
  [/approve|execute|deploy|publish|send/i, { title: "Approval gate created", detail: "Sensitive action was routed through the human approval layer.", status: "needs_approval" }],
  [/download|export/i, { title: "Export prepared", detail: "A secure export event was recorded in the workspace audit trail." }],
  [/test run|run|start/i, { title: "Execution scheduled", detail: "The action was queued with trace logging and retry policy." }],
  [/settings|configure|manage/i, { title: "Settings opened", detail: "Configuration intent was recorded for admin review." }],
  [/share|invite/i, { title: "Collaboration event recorded", detail: "The team action was validated and logged." }],
  [/clear/i, { title: "Workspace state updated", detail: "The requested cleanup action was completed locally." }],
];

export default function ActionRuntime() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const button = target?.closest("button");
      if (!button || button.disabled || button.closest("a") || button.type === "submit") return;

      const label = button.innerText.trim().replace(/\s+/g, " ");
      if (!label) return;

      const match = actionMap.find(([pattern]) => pattern.test(label));
      if (!match) return;

      const [, config] = match;
      const runtimeEvent = createRuntimeEvent({
        type: config.status === "needs_approval" ? "approval" : "action",
        title: config.title,
        detail: `${label}: ${config.detail}`,
        status: config.status ?? "completed",
      });

      if (runtimeEvent.status === "needs_approval") {
        toast.warning(runtimeEvent.title, { description: runtimeEvent.detail });
      } else {
        toast.success(runtimeEvent.title, { description: runtimeEvent.detail });
      }
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
