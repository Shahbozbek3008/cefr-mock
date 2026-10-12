import { DARK_QUERY, THEME_STORAGE_KEY } from './constants';

const SCRIPT = `(function(){try{var p=localStorage.getItem('${THEME_STORAGE_KEY}');var d=p==='dark'||(p!=='light'&&matchMedia('${DARK_QUERY}').matches);document.documentElement.dataset.theme=d?'dark':'light'}catch(e){}})()`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: SCRIPT }} />;
}
