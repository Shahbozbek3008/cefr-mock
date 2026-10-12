import { en } from './locales/en';
import { ru } from './locales/ru';
import { uz } from './locales/uz';
import type { Dictionary, Locale, Plural, TKey, TParams } from './types';

export const dictionaries: Record<Locale, Dictionary> = { uz, ru, en };

const pluralCategory = (locale: Locale, count: number): keyof Plural => {
  if (locale !== 'ru') return count === 1 ? 'one' : 'other';
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (!Number.isInteger(count)) return 'other';
  if (mod10 === 1 && mod100 !== 11) return 'one';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'few';
  return 'many';
};

const interpolate = (template: string, params?: TParams) =>
  params ? template.replace(/\{\{(\w+)\}\}/g, (match, name: string) => String(params[name] ?? match)) : template;

const lookup = (dictionary: Dictionary, key: TKey): string | Plural | undefined =>
  key.split('.').reduce<unknown>((node, part) => (node as Record<string, unknown> | undefined)?.[part], dictionary) as
    string | Plural | undefined;

export const translate = (locale: Locale, key: TKey, params?: TParams) => {
  const value = lookup(dictionaries[locale], key) ?? lookup(dictionaries.uz, key);
  if (value === undefined) return key;
  if (typeof value === 'string') return interpolate(value, params);
  const count = Number(params?.count ?? 0);
  const form = value[pluralCategory(locale, count)] ?? value.other;
  return interpolate(form, params);
};
