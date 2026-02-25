"use client";

import { normalizeRouteKey, shouldTrackPath } from "@/lib/analyticsPath";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const SESSION_KEY = "alhijrah_analytics_session_id";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  const existing = window.sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;

  const generated = `${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 10)}`;
  window.sessionStorage.setItem(SESSION_KEY, generated);
  return generated;
}

export default function PageAnalyticsTracker() {
  const pathname = usePathname();
  const lastSentRef = useRef<{ path: string; at: number } | null>(null);

  useEffect(() => {
    if (!pathname || !shouldTrackPath(pathname)) return;

    const now = Date.now();
    if (
      lastSentRef.current &&
      lastSentRef.current.path === pathname &&
      now - lastSentRef.current.at < 1500
    ) {
      return;
    }

    lastSentRef.current = { path: pathname, at: now };

    const payload = JSON.stringify({
      path: pathname,
      routeKey: normalizeRouteKey(pathname),
      sessionId: getSessionId(),
      referrer: typeof document !== "undefined" ? document.referrer : null,
    });

    const endpoint = "/api/analytics/track";
    const blob = new Blob([payload], { type: "application/json" });

    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, blob);
      return;
    }

    void fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    });
  }, [pathname]);

  return null;
}
