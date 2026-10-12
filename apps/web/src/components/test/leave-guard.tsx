"use client";

import { useEffect } from "react";

export function LeaveGuard() {
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);
  return null;
}
