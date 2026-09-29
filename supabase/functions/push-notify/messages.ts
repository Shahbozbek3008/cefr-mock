export type Locale = 'uz' | 'ru' | 'en';

export type NotificationKind = 'result' | 'aiReview' | 'reminder' | 'newTest' | 'exam';

type Template = { title: string; body: string };

const templates: Record<Locale, Record<NotificationKind, Template>> = {
  uz: {
    result: { title: 'Natijangiz tayyor', body: "{{title}}: {{score}} ball ({{level}}). Batafsil tahlilni ko'ring." },
    aiReview: { title: 'AI baho tayyor', body: "{{section}} bo'yicha AI baho va tuzatishlar tayyor." },
    reminder: { title: 'Bugungi mashq kutmoqda', body: '{{minutes}} daqiqalik rejani bajarib, ritmni saqlang.' },
    newTest: { title: "Yangi mock test qo'shildi", body: "{{title}} rasmiy formatda. Birinchilardan bo'lib ishlang." },
    exam: {
      title: 'Imtihonga {{days}} kun qoldi',
      body: "Rejangizni ko'rib chiqing va zaif bo'limga e'tibor qarating.",
    },
  },
  ru: {
    result: {
      title: 'Ваш результат готов',
      body: '{{title}}: {{score}} баллов ({{level}}). Посмотрите подробный разбор.',
    },
    aiReview: { title: 'AI-оценка готова', body: 'AI-оценка и исправления по {{section}} готовы.' },
    reminder: { title: 'Сегодняшняя практика ждёт', body: 'Выполните план на {{minutes}} минут и сохраните ритм.' },
    newTest: { title: 'Добавлен новый mock-тест', body: '{{title}} в официальном формате. Пройдите одним из первых.' },
    exam: { title: 'До экзамена осталось дней: {{days}}', body: 'Проверьте план и уделите внимание слабому разделу.' },
  },
  en: {
    result: {
      title: 'Your result is ready',
      body: '{{title}}: {{score}} points ({{level}}). See the detailed review.',
    },
    aiReview: { title: 'AI review is ready', body: 'AI scores and corrections for {{section}} are ready.' },
    reminder: {
      title: "Today's practice is waiting",
      body: 'Complete your {{minutes}}-minute plan and keep your rhythm.',
    },
    newTest: { title: 'New mock test added', body: '{{title}} in the official format. Be among the first to try it.' },
    exam: { title: '{{days}} days until your exam', body: 'Review your plan and focus on your weakest section.' },
  },
};

const interpolate = (text: string, params: Record<string, unknown>) =>
  text.replace(/\{\{(\w+)\}\}/g, (match, key: string) => (key in params ? String(params[key]) : match));

export const toLocale = (value: unknown): Locale => (value === 'ru' || value === 'en' ? value : 'uz');

export const renderMessage = (kind: NotificationKind, locale: Locale, params: Record<string, unknown>) => {
  const template = templates[locale][kind];
  return { title: interpolate(template.title, params), body: interpolate(template.body, params) };
};
