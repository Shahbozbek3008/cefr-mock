'use client';

import type { ReactNode } from 'react';
import { Dialog as RDialog } from 'radix-ui';
import { X } from 'lucide-react';
import { IconButton } from './icon-button';

export const Dialog = RDialog.Root;
export const DialogTrigger = RDialog.Trigger;
export const DialogClose = RDialog.Close;

type DialogContentProps = { title: string; description: string; icon?: ReactNode; closeLabel: string; children: ReactNode };

export function DialogContent({ title, description, icon, closeLabel, children }: DialogContentProps) {
  return (
    <RDialog.Portal>
      <RDialog.Overlay className="fixed inset-0 z-50 bg-(--backdrop) backdrop-blur-[3px] data-[state=closed]:animate-overlay-out data-[state=open]:animate-overlay-in" />
      <RDialog.Content className="stagger fixed inset-0 z-50 m-auto flex h-fit max-h-[calc(100dvh-32px)] w-[min(560px,calc(100vw-32px))] flex-col gap-6 overflow-y-auto rounded-hero bg-surface p-9 shadow-e3 data-[state=closed]:animate-dialog-out data-[state=open]:animate-dialog-in max-sm:p-6">
        <div className="flex items-start justify-between">
          {icon}
          <RDialog.Close asChild>
            <IconButton icon={X} label={closeLabel} size="sm" className="transition-transform duration-(--t-base) hover:rotate-90" />
          </RDialog.Close>
        </div>
        <div className="flex flex-col gap-2">
          <RDialog.Title className="text-[28px] font-medium tracking-[-0.04em]">{title}</RDialog.Title>
          <RDialog.Description className="text-[15px] leading-[1.55] text-ink-2">{description}</RDialog.Description>
        </div>
        {children}
      </RDialog.Content>
    </RDialog.Portal>
  );
}
