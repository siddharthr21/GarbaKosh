import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_GNANI_KEY =
  process.env.GNANI_API_KEY ||
  process.env.NEXT_PUBLIC_GNANI_API_KEY ||
  'vach_1ytE2CY5X2P8OG75LB2LoKExoXdn3zYsCnjFDaGsK4f83KNfy9P46d54x65TsbmRKLIIkxknsvFJVj8W1VWZfQcKRJnvjGi8_de3ef9b7ebb582a7792bb89f2e87dce2';

function mapLanguageCode(lang: string): string {
  switch (lang) {
    case 'kn-IN':
      return 'kn-IN';
    case 'hi-IN':
      return 'hi-IN';
    case 'ta-IN':
      return 'ta-IN';
    case 'te-IN':
      return 'te-IN';
    case 'ml-IN':
      return 'ml-IN';
    default:
      return 'en-IN';
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData().catch(() => null);
    if (!formData) {
      return NextResponse.json({ error: 'Multipart form data is required.' }, { status: 400 });
    }

    const audioFile = formData.get('audio') || formData.get('audio_file');
    const rawLang = (formData.get('language') as string) || (formData.get('language_code') as string) || 'en-IN';
    const langCode = mapLanguageCode(rawLang);
    const clientKey = req.headers.get('x-gnani-key') || (formData.get('apiKey') as string);
    const apiKey = (clientKey && clientKey.trim()) || DEFAULT_GNANI_KEY;

    if (!audioFile) {
      return NextResponse.json({ error: 'Valid audio file is required in "audio" or "audio_file" field.' }, { status: 400 });
    }

    // Convert audio to clean WAV Blob
    const arrayBuf = typeof (audioFile as any).arrayBuffer === 'function'
      ? await (audioFile as any).arrayBuffer()
      : await (audioFile as any).text();

    const audioBlob = new Blob([arrayBuf], { type: 'audio/wav' });

    // Forward to Gnani Prisma STT
    const upstreamFormData = new FormData();
    upstreamFormData.append('audio_file', audioBlob, 'voice_input.wav');
    upstreamFormData.append('language_code', langCode);
    upstreamFormData.append('model', 'prisma-v2.5');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const res = await fetch('https://api.vachana.ai/stt/v3', {
      method: 'POST',
      headers: {
        'X-API-Key-ID': apiKey
      },
      body: upstreamFormData,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json(
        { error: `Gnani STT error (${res.status}): ${errText.substring(0, 200)}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    const transcript = data.transcript || data.output?.literal || '';

    return NextResponse.json({
      success: true,
      transcript,
      model: data.model || 'prisma-v2.5',
      language: langCode
    });
  } catch (error: any) {
    console.error('Gnani STT API error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error during speech recognition.' },
      { status: 500 }
    );
  }
}
