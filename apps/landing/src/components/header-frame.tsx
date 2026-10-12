'use client';

import { useEffect, useState, type ReactNode } from 'react';

const THRESHOLD = 16;

export function HeaderFrame({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > THRESHOLD);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      className="group/header sticky top-0 z-40 px-0 transition-[padding] duration-(--t-slow) ease-out-expo md:data-[scrolled=true]:px-4 md:data-[scrolled=true]:pt-3"
    >
      {children}
    </header>
  );
}
