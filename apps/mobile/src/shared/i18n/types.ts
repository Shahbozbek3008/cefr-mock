import type { uz } from './locales/uz';

export type Locale = 'uz' | 'ru' | 'en';

export type Plural = { one: string; few?: string; many?: string; other: string };

type Shape<T> = T extends string
  ? string
  : T extends readonly string[]
    ? readonly string[]
    : T extends { one: string; other: string }
      ? Plural
      : { [K in keyof T]: Shape<T[K]> };

export type Dictionary = Shape<typeof uz>;

type Paths<T> = {
  [K in keyof T & string]: T[K] extends string | Plural
    ? K
    : T[K] extends readonly unknown[]
      ? never
      : `${K}.${Paths<T[K]>}`;
}[keyof T & string];

export type TKey = Paths<Dictionary>;

export type TParams = Record<string, string | number>;
