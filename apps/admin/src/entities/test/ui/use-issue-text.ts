import { useTranslations } from 'use-intl';
import type { Issue } from '../model/validate';

export const useIssueText = () => {
  const tWhere = useTranslations('issues.where');
  const tCode = useTranslations('issues.codes');

  const where = ({ at }: Issue) => {
    const parts = [tWhere(at.section)];
    if (at.part !== undefined) parts.push(tWhere('part', { index: at.part }));
    if (at.question !== undefined) parts.push(tWhere('question', { number: at.question }));
    if (at.item !== undefined) parts.push(tWhere('item', { index: at.item }));
    return parts.join(' · ');
  };

  const message = (issue: Issue) => tCode(issue.code, issue.values ?? {});

  return { where, message };
};
