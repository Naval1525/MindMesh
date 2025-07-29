export const GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''; // TODO: secure

interface GeminiResponse {
  candidates: { content: { parts: { text: string }[] } }[];
}

export async function geminiGenerate(prompt: string): Promise<string | null> {
  try {
    const res = await fetch(`${GEMINI_ENDPOINT}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!res.ok) {
      console.error('Gemini API error', await res.text());
      return null;
    }

    const data: GeminiResponse = await res.json();
    return data.candidates?.[0]?.content.parts?.[0]?.text || null;
  } catch (err) {
    console.error('Gemini request failed', err);
    return null;
  }
} 