export const VOICES = ['narrator', 'woman', 'man', 'woman2', 'man2', 'woman3', 'man3'] as const;

export const QUESTION_KINDS = ['mcq', 'gap', 'tfng', 'match'] as const;

export const TFNG_ANSWERS = ['True', 'False', 'No Information'] as const;

export const EXPECTED_QUESTIONS = 35;

export const SECTION_MINUTES = { listening: 35, reading: 60, writing: 60, speaking: 15 } as const;

export const DEFAULT_LISTENING_PARTS = 6;

export const DEFAULT_READING_PARTS = 5;

export const DEFAULT_MCQ_OPTIONS = 3;

export const DEFAULT_DURATION_LABEL = '2:45';

export const TEST_ID_PATTERN = /^[a-z0-9-]{1,40}$/;

export const SECTION_PREFIX = { listening: 'l', reading: 'r' } as const;
