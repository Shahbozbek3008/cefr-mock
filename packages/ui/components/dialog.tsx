'use client';

import { useRef, type PointerEvent, type ReactNode } from 'react';
import { Dialog as RDialog } from 'radix-ui';
import { X } from 'lucide-react';
import { IconButton } from './icon-button';

export const Dialog = RDialog.Root;
export const DialogTrigger = RDialog.Trigger;
export const DialogClose = RDialog.Close;

// Mobile bottom sheet: dragging past this distance (or flicking faster than the velocity) dismisses it.
const DISMISS_DISTANCE = 120;
const DISMISS_VELOCITY = 0.6;
// Matches Tailwind's `max-sm` — the breakpoint below which the dialog renders as a bottom sheet.
const SHEET_QUERY = '(max-width: 639.98px)';

type DialogContentProps = { title: string; description: string; icon?: ReactNode; closeLabel: string; children: ReactNode };

function useSheetDrag(sheet: React.RefObject<HTMLDivElement | null>, close: () => void) {
  const drag = useRef<{ y: number; t: number; id: number } | null>(null);

  const setOffset = (px: number, animate: boolean) => {
    const el = sheet.current;
    if (!el) return;
    el.style.transition = animate ? 'translate var(--t-sheet) var(--ease-out)' : 'none';
    el.style.translate = px ? `0 ${px}px` : '';
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' || !matchMedia(SHEET_QUERY).matches || (event.target as HTMLElement).closest('button')) return;
    drag.current = { y: event.clientY, t: event.timeStamp, id: event.pointerId };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.id !== event.pointerId) return;
    setOffset(Math.max(0, event.clientY - drag.current.y), false);
  };

  const onPointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    const start = drag.current;
    if (start?.id !== event.pointerId) return;
    drag.current = null;
    const distance = Math.max(0, event.clientY - start.y);
    const velocity = distance / Math.max(1, event.timeStamp - start.t);
    if (distance > DISMISS_DISTANCE || (distance > 24 && velocity > DISMISS_VELOCITY)) close();
    else setOffset(0, true);
  };

  return { onPointerDown, onPointerMove, onPointerUp: onPointerEnd, onPointerCancel: onPointerEnd };
}

export function DialogContent({ title, description, icon, closeLabel, children }: DialogContentProps) {
  const sheet = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const dragHandlers = useSheetDrag(sheet, () => closeButton.current?.click());

  return (
    <RDialog.Portal>
      <RDialog.Overlay className="fixed inset-0 z-50 bg-(--backdrop) backdrop-blur-[3px] data-[state=closed]:animate-overlay-out data-[state=open]:animate-overlay-in" />
      <RDialog.Content
        ref={sheet}
        className="stagger fixed inset-0 z-50 m-auto flex h-fit max-h-[calc(100dvh-32px)] w-[min(560px,calc(100vw-32px))] flex-col gap-6 overflow-y-auto overscroll-contain rounded-hero bg-surface p-9 shadow-e3 data-[state=closed]:animate-dialog-out data-[state=open]:animate-dialog-in max-sm:top-auto max-sm:bottom-0 max-sm:mb-0 max-sm:max-h-[92dvh] max-sm:w-full max-sm:gap-5 max-sm:rounded-b-none max-sm:rounded-t-[28px] max-sm:px-5 max-sm:pt-2 max-sm:pb-[max(24px,env(safe-area-inset-bottom))] max-sm:data-[state=closed]:animate-bottom-sheet-out max-sm:data-[state=open]:animate-bottom-sheet-in"
      >
        <div {...dragHandlers} className="flex flex-col gap-3 max-sm:-mx-5 max-sm:touch-none max-sm:px-5">
          <span aria-hidden className="mx-auto h-1.5 w-10 shrink-0 rounded-full bg-line-strong sm:hidden" />
          <div className="flex items-start justify-between">
            {icon}
            <RDialog.Close asChild>
              <IconButton ref={closeButton} icon={X} label={closeLabel} size="sm" className="ml-auto transition-transform duration-(--t-base) hover:rotate-90" />
            </RDialog.Close>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <RDialog.Title className="text-[28px] font-medium tracking-[-0.04em] max-sm:text-[24px]">{title}</RDialog.Title>
          <RDialog.Description className="text-[15px] leading-[1.55] text-ink-2">{description}</RDialog.Description>
        </div>
        {children}
      </RDialog.Content>
    </RDialog.Portal>
  );
}
