import Anthropic from 'npm:@anthropic-ai/sdk@0.128.0';

const MODEL = Deno.env.get('AI_REVIEW_MODEL') ?? 'claude-sonnet-5';
const MAX_TOKENS = 32000;

const client = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') });

export type Locale = 'uz' | 'ru' | 'en';

export const feedbackLanguage: Record<Locale, string> = {
  uz: 'Uzbek (Latin script)',
  ru: 'Russian',
  en: 'English',
};

export const toLocale = (value: unknown): Locale => (value === 'ru' || value === 'en' ? value : 'uz');

export const askStructured = async <T>(system: string, prompt: string, schema: Record<string, unknown>): Promise<T> => {
  const message = await client.messages
    .stream({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      thinking: { type: 'adaptive' },
      output_config: { effort: 'medium', format: { type: 'json_schema', schema } },
      system,
      messages: [{ role: 'user', content: prompt }],
    })
    .finalMessage();

  if (message.stop_reason === 'refusal') throw new Error('model_refused');
  if (message.stop_reason === 'max_tokens') throw new Error('model_truncated');

  const text = message.content.find((block) => block.type === 'text');
  if (!text || text.type !== 'text') throw new Error('model_empty');
  return JSON.parse(text.text) as T;
};
