"use client";

import { useLayoutEffect } from "react";
import { applyStoredTheme } from "./use-theme";

export function ThemeSync() {
  useLayoutEffect(applyStoredTheme, []);
  return null;
}
