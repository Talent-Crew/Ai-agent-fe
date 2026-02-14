import { Centrifuge } from 'centrifuge';

const TOKEN_URL = import.meta.env.VITE_INTERVIEW_TOKEN_URL ?? 'http://192.168.1.37:8000/interviews/token';
const SETUP_URL = TOKEN_URL.replace(/\/token\/?$/, '') + '/test/setup/';

/**
 * Create a test interview session via Django. Returns session_id for token/ Centrifugo.
 * @returns {Promise<string>} session_id (UUID)
 */
export async function createTestSession() {
  const res = await fetch(SETUP_URL, { method: 'POST' });
  if (!res.ok) throw new Error(`Setup failed: ${res.status}`);
  const data = await res.json();
  return data.session_id;
}

/**
 * Fetch Centrifugo token from Django (get_interview_token), connect and subscribe.
 * Django route: token/<uuid:session_id>/ → returns JWT (sub=session_id, exp=ttl) + ws_url + channel.
 * Response: { token, ws_url, channel } with channel e.g. "interview:{session.id}"
 * @param {string} sessionId - InterviewSession.id (UUID) from Django
 * @param {{ onTtsAudio?: (decodedAudio: string) => void }} options - Optional TTS publication handler
 * @returns {{ centrifuge: Centrifuge, subscription: Subscription, tokenData: { token, ws_url, channel } }}
 */
export async function createCentrifugeConnection(sessionId, { onTtsAudio } = {}) {
  let tokenData;
  try {
    const res = await fetch(`${TOKEN_URL}/${sessionId}/`);
    if (!res.ok) throw new Error(`Token failed: ${res.status}`);
    tokenData = await res.json();
  } catch (err) {
    if (err.message.startsWith('Token failed:')) throw err;
    throw new Error(`Cannot reach interview server at ${TOKEN_URL}. Set VITE_INTERVIEW_TOKEN_URL in .env if needed.`);
  }

  const centrifuge = new Centrifuge(tokenData.ws_url, { token: tokenData.token });
  const sub = centrifuge.newSubscription(tokenData.channel);

  if (onTtsAudio) {
    sub.on('publication', (ctx) => {
      if (ctx.data?.type === 'tts_audio') onTtsAudio(atob(ctx.data.audio));
    });
  }

  sub.subscribe();
  centrifuge.connect();

  return { centrifuge, subscription: sub, tokenData };
}
