import { APP_NAV } from './constants';

export const findActiveNav = (path: string) => APP_NAV.flatMap((g) => g.items).find((i) => i.match(path));
