import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      shadow: [{ shadow: ['e0', 'e1', 'e2', 'e3', 'action', 'action-sm', 'selected', 'inset', 'focus'] }],
      rounded: [{ rounded: ['chip', 'sm', 'input', 'btn', 'card-sm', 'card', 'card-lg', 'hero', 'banner', 'pill'] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
