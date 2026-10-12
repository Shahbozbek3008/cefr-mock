'use client';

import { createContext, use, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { SIDEBAR_COOKIE } from '@/constants/layout';
import { TooltipProvider } from '@cefr/ui/components/tooltip';
import { SIDEBAR_COOKIE_MAX_AGE, SIDEBAR_TOGGLE_KEY, SIDEBAR_TOOLTIP_DELAY } from '@/constants/layout';
import type { SidebarState } from '@/types/layout';

const SidebarContext = createContext<SidebarState | null>(null);

export function SidebarProvider({ defaultCollapsed, children }: { defaultCollapsed: boolean; children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggle = useCallback(() => setCollapsed((value) => !value), []);

  useEffect(() => {
    document.cookie = `${SIDEBAR_COOKIE}=${collapsed ? 1 : 0}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}; samesite=lax`;
  }, [collapsed]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== SIDEBAR_TOGGLE_KEY || !(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      toggle();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [toggle]);

  const value = useMemo(() => ({ collapsed, toggle, mobileOpen, setMobileOpen }), [collapsed, toggle, mobileOpen]);

  return (
    <SidebarContext value={value}>
      <TooltipProvider delayDuration={SIDEBAR_TOOLTIP_DELAY}>{children}</TooltipProvider>
    </SidebarContext>
  );
}

export function useSidebar() {
  const context = use(SidebarContext);
  if (!context) throw new Error('useSidebar must be used within SidebarProvider');
  return context;
}
