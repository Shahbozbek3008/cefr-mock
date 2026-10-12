import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const LOCALES = ['uz', 'ru', 'en'];
const SECTIONS = ['common', 'units', 'catalog', 'sections', 'testIntro', 'session', 'listening', 'reading', 'writing', 'speaking', 'result', 'review', 'mistakes', 'aiReview', 'notifications'];
const PLURAL_FORMS = ['zero', 'one', 'two', 'few', 'many', 'other'];

const loadMobile = (locale) => {
  const source = readFileSync(join(root, 'apps/mobile/src/shared/i18n/locales', `${locale}.ts`), 'utf8');
  const body = source
    .replace(/^import .*$/gm, '')
    .replace(/^export const \w+(?::\s*\w+)? = /m, 'return ')
    .replace(/;\s*$/, ';');
  return new Function(body)();
};

const toIcu = (template) => template.replace(/\{\{(\w+)\}\}/g, '{$1}');

const isPlural = (value) => Object.keys(value).every((key) => PLURAL_FORMS.includes(key));

const convert = (value) => {
  if (typeof value === 'string') return toIcu(value);
  if (isPlural(value)) {
    const branches = PLURAL_FORMS.filter((form) => value[form] !== undefined).map((form) => `${form} {${toIcu(value[form])}}`);
    return `{count, plural, ${branches.join(' ')}}`;
  }
  return Object.fromEntries(Object.entries(value).map(([key, nested]) => [key, convert(nested)]));
};

for (const locale of LOCALES) {
  const mobile = loadMobile(locale);
  const path = join(root, 'apps/web/src/messages', `${locale}.json`);
  const messages = JSON.parse(readFileSync(path, 'utf8'));
  messages.exam = Object.fromEntries(SECTIONS.map((section) => [section, convert(mobile[section])]));
  writeFileSync(path, `${JSON.stringify(messages, null, 2)}\n`);
  console.log(`${locale}: exam.{${SECTIONS.join(', ')}}`);
}
