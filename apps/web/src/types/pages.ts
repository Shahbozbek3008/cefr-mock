import type { ReactNode } from 'react';
import type { LocaleParams, PageProps } from '@cefr/ui/i18n/locale';
import type { TestSectionParams } from '@/types/exam';

export interface AuthLayoutProps {
  children: ReactNode;
  params: LocaleParams;
}

export type VerifyPageProps = { params: LocaleParams; searchParams: Promise<{ phone?: string }> };

export type TestSectionPageProps = { params: TestSectionParams; searchParams: Promise<{ scope?: string }> };

export type ReviewPageProps = PageProps<{ attemptId: string }> & { searchParams: Promise<{ tab?: string }> };

export interface LocaleLayoutProps {
  children: ReactNode;
  params: LocaleParams;
}
