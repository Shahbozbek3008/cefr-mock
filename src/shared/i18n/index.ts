import { useCallback, useMemo } from 'react';
import { useLocaleStore } from './store';
import { dictionaries, translate } from './translate';
import type { Locale, TKey, TParams } from './types';

export { locales, useLocaleStore } from './store';
export { translate } from './translate';
export type { Dictionary, Locale, TKey, TParams } from './types';

const parseDate = (value: Date | string) => (typeof value === 'string' ? new Date(`${value}T00:00:00`) : value);

export const formatDayMonth = (locale: Locale, value: Date | string) => {
  const date = parseDate(value);
  return translate(locale, 'date.dayMonth', {
    day: date.getDate(),
    month: dictionaries[locale].date.months[date.getMonth()],
  });
};

export const formatLongDate = (locale: Locale, value: Date | string) => {
  const date = parseDate(value);
  return translate(locale, 'date.longDate', {
    weekday: dictionaries[locale].date.weekdays[date.getDay()],
    date: formatDayMonth(locale, date),
  });
};

export const formatMonthYear = (locale: Locale, month: number, year: number) =>
  translate(locale, 'date.monthYear', { month: dictionaries[locale].date.monthsStandalone[month], year });

export const useI18n = () => {
  const locale = useLocaleStore((s) => s.locale);
  const t = useCallback((key: TKey, params?: TParams) => translate(locale, key, params), [locale]);

  return useMemo(
    () => ({
      locale,
      t,
      dict: dictionaries[locale],
      dayMonth: (value: Date | string) => formatDayMonth(locale, value),
      longDate: (value: Date | string) => formatLongDate(locale, value),
      monthYear: (month: number, year: number) => formatMonthYear(locale, month, year),
    }),
    [locale, t],
  );
};
