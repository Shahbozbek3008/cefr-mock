"use client";

import type { NavItem } from "@/types/navigation";
import { cn } from "@cefr/ui/lib/cn";
import { ActivePill } from "@cefr/ui/motion/active-pill";
import { useEffect, useId, useState } from "react";

function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

interface NavMenuProps {
  items: readonly NavItem[];
  label: string;
  className?: string;
}

export function NavMenu({ items, label, className }: NavMenuProps) {
  const layoutId = useId();
  const [hovered, setHovered] = useState<string | null>(null);
  const [ids] = useState(() => items.map((i) => i.href.slice(1)));
  const active = useActiveSection(ids);
  const current = hovered ?? (active ? `#${active}` : null);

  return (
    <nav
      className={cn("flex flex-wrap gap-0.5 text-sm", className)}
      aria-label={label}
      onMouseLeave={() => setHovered(null)}
    >
      {items.map((item) => {
        const on = current === item.href;
        return (
          <a
            key={item.href}
            href={item.href}
            onMouseEnter={() => setHovered(item.href)}
            onFocus={() => setHovered(item.href)}
            className={cn(
              "relative isolate flex h-[34px] items-center rounded-[10px] px-3 transition-colors duration-(--t-base)",
              on ? "text-ink hover:text-ink" : "text-ink-2 hover:text-ink",
            )}
          >
            {on && (
              <ActivePill
                layoutId={layoutId}
                className="rounded-[10px] bg-[rgb(var(--line-rgb)/.055)]"
              />
            )}
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
