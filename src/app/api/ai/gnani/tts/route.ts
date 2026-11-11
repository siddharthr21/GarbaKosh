import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_GNANI_KEY =
  process.env.GNANI_API_KEY ||
  process.env.NEXT_PUBLIC_GNANI_API_KEY ||
  'vach_1ytE2CY5X2P8OG75LB2LoKExoXdn3zYsCnjFDaGsK4f83KNfy9P46d54x65TsbmRKLIIkxknsvFJVj8W1VWZfQcKRJnvjGi8_de3ef9b7ebb582a7792bb89f2e87dce2';

// Clean text for speech synthesis
function cleanTextForSpeech(text: string): string {
  if (!text) return '';
  let cleaned = text
    .split('---FOLLOW_UPS---')[0] // Exclude follow up questions from voice
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // [link](url) -> link
    .replace(/[#*`~_>\-\[\]\(\)]/g, ' ') // Strip markdown characters
    .replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '') // Strip surrogate pairs
    .replace(/\s+/g, ' ')
    .trim();

  // If text is within reasonable speech length (<= 600 chars), return it as is
  if (cleaned.length <= 600) {
    return cleaned;
  }

  // If longer than 600 characters, truncate cleanly at a sentence boundary
  const sentenceMatch = cleaned.slice(0, 600).match(/(.*[.?!।\n])\s+/);
  if (sentenceMatch && sentenceMatch[1] && sentenceMatch[1].length > 150) {
    return sentenceMatch[1].trim();
  }

  // Fallback: truncate at last word boundary before 550 chars
  const wordBoundary = cleaned.slice(0, 550).lastIndexOf(' ');
  if (wordBoundary > 200) {
    return cleaned.slice(0, wordBoundary).trim() + '.';
  }

  return cleaned.slice(0, 500).trim();
}

// Map language to default high-fidelity maternal voice in Gnani Timbre
function getVoiceForLanguage(lang: string): { voice: string; langCode: string } {
  switch (lang) {
    case 'kn-IN':
      return { voice: 'Nayana', langCode: 'kn-IN' };
    case 'hi-IN':
      return { voice: 'Nalini', langCode: 'hi-IN' };
    case 'ta-IN':
      return { voice: 'Oviya', langCode: 'ta-IN' };
    case 'te-IN':
      return { voice: 'Kamakshi', langCode: 'te-IN' };
    case 'ml-IN':
      return { voice: 'Parvati', langCode: 'ml-IN' };
    default:
      return { voice: 'Nalini', langCode: 'en-IN' };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawText = body.text || '';
    const language = body.language || 'en-US';
    const clientKey = req.headers.get('x-gnani-key') || body.apiKey;
    const apiKey = (clientKey && clientKey.trim()) || DEFAULT_GNANI_KEY;

    if (!rawText.trim()) {
      return NextResponse.json({ error: 'Text is required for TTS synthesis.' }, { status: 400 });
    }

    const cleanedText = cleanTextForSpeech(rawText);
    if (!cleanedText) {
      return NextResponse.json({ error: 'Text was empty after sanitization.' }, { status: 400 });
    }

    const { voice: defaultVoice, langCode } = getVoiceForLanguage(language);
    const voice = body.voice || defaultVoice;

    const payload = {
      text: cleanedText,
      model: 'timbre-v2.5',
      language: langCode,
      voice,
      audio_config: {
        container: 'wav',
        sample_rate: 48000
      }
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const res = await fetch('https://api.vachana.ai/api/v1/tts/inference', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key-ID': apiKey
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { error: `Gnani TTS failed: ${errText.substring(0, 200)}` },
        { status: res.status }
      );
    }

    const audioArrayBuffer = await res.arrayBuffer();

    return new NextResponse(audioArrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/wav',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200'
      }
    });
  } catch (error: any) {
    console.error('Gnani TTS error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error in Gnani TTS synthesis.' },
      { status: 500 }
    );
  }
}
