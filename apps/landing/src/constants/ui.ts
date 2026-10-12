export const HEADER_SCROLL_THRESHOLD = 16;

export const STICKY_CTA_SHOW_AFTER = 560;

export const STEP_DELAY = 0.35;

export const PHONE_VARIANTS = {
  full: {
    frame: 'h-[620px] w-[300px] rounded-[44px] px-4 pt-[50px] gap-3 shadow-[0_0_0_1px_var(--border-strong),0_0_0_8px_var(--surface),0_0_0_9px_var(--border-strong),0_60px_100px_-40px_rgba(20,22,30,.35),0_30px_60px_-30px_rgba(20,22,30,.2)]',
    notch: 'top-2.5 h-7 w-24 rounded-2xl',
    gauge: { size: 180, stroke: 10, r: 76, height: 150, labelOffset: 18, value: 52 },
    rows: 4,
    row: 'h-10 text-xs grid-cols-[1fr_70px_26px] gap-2.5',
  },
  compact: {
    frame: 'h-[340px] w-[250px] rounded-t-[38px] px-[14px] pt-10 gap-2.5 shadow-[0_0_0_1px_var(--border-strong),0_0_0_7px_var(--surface),0_0_0_8px_var(--border-strong),0_30px_60px_-20px_rgba(20,22,30,.3)]',
    notch: 'top-[9px] h-6 w-20 rounded-[14px]',
    gauge: { size: 130, stroke: 8, r: 54, height: 110, labelOffset: 12, value: 38 },
    rows: 2,
    row: 'h-[34px] text-[11px] grid-cols-[1fr_60px_22px] gap-2',
  },
} as const;
