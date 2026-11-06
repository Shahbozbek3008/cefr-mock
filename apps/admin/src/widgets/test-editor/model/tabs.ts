export const EDITOR_TABS = ['general', 'listening', 'reading', 'writing', 'speaking', 'json'] as const;

export type EditorTab = (typeof EDITOR_TABS)[number];
