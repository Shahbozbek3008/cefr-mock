'use client';

import { useTests, type TestSummary } from '@cefr/core';
import { ROUTES } from '@/lib/constants';
import { ButtonLink, type ButtonLinkProps } from '@/components/ui/button';

const hrefOf = (tests: readonly TestSummary[] | undefined) => {
  const resume = tests?.find((test) => test.status === 'in_progress');
  if (resume) return ROUTES.testSection(resume.id, resume.resumeSection ?? 'listening');
  const next = tests?.find((test) => test.status === 'new');
  return next ? ROUTES.test(next.id) : ROUTES.catalog;
};

export const useNextTestHref = () => hrefOf(useTests().data);

export function NextTestLink(props: Omit<ButtonLinkProps, 'href'>) {
  return <ButtonLink href={useNextTestHref()} {...props} />;
}
