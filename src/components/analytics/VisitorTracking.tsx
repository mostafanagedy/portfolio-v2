"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";

const SESSION_KEY = "nagedy_visitor_session";

function getSessionId() {
  let value = sessionStorage.getItem(SESSION_KEY);
  if (!value) {
    value = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, value);
  }
  return value;
}

async function track(eventName: string, path: string) {
  if (localStorage.getItem("nagedy_analytics_consent") !== "accepted") return;
  try {
    await fetch("/api/visitor-events", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "same-origin",
      keepalive: true,
      body: JSON.stringify({
        eventName,
        path,
        sessionId: getSessionId(),
        referrer: document.referrer || null,
      }),
    });
  } catch {
    // Analytics must never block navigation or user actions.
  }
}

export default function VisitorTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const previousPath = useRef<string | null>(null);

  useEffect(() => {
    if (localStorage.getItem("nagedy_analytics_consent") === "accepted" && pathname && previousPath.current !== pathname) {
      previousPath.current = pathname;
      void track("page_view", pathname);
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      const label = (anchor.getAttribute("aria-label") || anchor.textContent || "").toLowerCase();
      let eventName: string | null = null;
      if (/\.pdf(?:$|\?)/i.test(href) || /\bcv\b|resume|curriculum vitae/i.test(label)) eventName = "cv_click";
      else if (/github\.com/i.test(href)) eventName = "github_click";
      else if (/linkedin\.com/i.test(href)) eventName = "linkedin_click";
      else if (/contact/i.test(href) || /contact/i.test(label)) eventName = "contact_click";
      else if (/project/i.test(href) || /project/i.test(label)) eventName = "project_click";
      if (eventName) void track(eventName, pathname || "/");
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [pathname]);

  const [consent, setConsent] = [null, null] as const;
  void consent; void setConsent;
  return <Analytics />;
}
