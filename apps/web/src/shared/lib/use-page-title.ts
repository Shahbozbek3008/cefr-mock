import { useEffect } from 'react';
import { BRAND_NAME } from '@cefr/ui/components/logo';

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `${title} · ${BRAND_NAME}`;
  }, [title]);
}
