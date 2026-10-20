import type { LucideIcon } from 'lucide-react';

export type NavKey = 'home' | 'tests' | 'progress' | 'profile' | 'billing';

export type NavItem = { key: NavKey; href: string; icon: LucideIcon; match: (path: string) => boolean };

export type NavGroup = { key: 'workspace' | 'account'; items: readonly NavItem[] };

export type SidebarState = {
  collapsed: boolean;
  toggle: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
};

export type SidebarContentProps = { collapsed: boolean; onClose?: () => void };

export type NavLinkProps = SidebarContentProps & { item: NavItem; active: boolean; badge?: number; layoutId: string };
