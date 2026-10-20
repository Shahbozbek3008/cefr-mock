import type { Plugin } from 'vite';
import { THEME_SCRIPT } from '../../../packages/ui/theme/theme-script-source';

export function themeScript(): Plugin {
  return {
    name: 'cefr:theme-script',
    transformIndexHtml: () => [{ tag: 'script', children: THEME_SCRIPT, injectTo: 'head-prepend' }],
  };
}
