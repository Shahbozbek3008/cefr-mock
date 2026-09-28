const ENDPOINT = 'https://api.deepgram.com/v1/listen?model=nova-3&language=en&smart_format=true&filler_words=true';

type DeepgramWord = { word: string; confidence: number };

type DeepgramResponse = {
  metadata?: { duration?: number };
  results?: {
    channels?: { alternatives?: { transcript?: string; words?: DeepgramWord[] }[] }[];
  };
};

export type Transcript = {
  text: string;
  durationSec: number;
  words: number;
  confidence: number;
};

export const transcribe = async (audio: ArrayBuffer): Promise<Transcript> => {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Token ${Deno.env.get('DEEPGRAM_API_KEY') ?? ''}`,
      'Content-Type': 'audio/mp4',
    },
    body: audio,
  });
  if (!response.ok) throw new Error(`deepgram_${response.status}`);

  const payload = (await response.json()) as DeepgramResponse;
  const alternative = payload.results?.channels?.[0]?.alternatives?.[0];
  const words = alternative?.words ?? [];

  return {
    text: alternative?.transcript?.trim() ?? '',
    durationSec: Math.round(payload.metadata?.duration ?? 0),
    words: words.length,
    confidence: words.length ? words.reduce((sum, word) => sum + word.confidence, 0) / words.length : 0,
  };
};
