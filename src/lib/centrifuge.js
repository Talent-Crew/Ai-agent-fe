import { Centrifuge } from 'centrifuge';

const TOKEN_URL = import.meta.env.VITE_INTERVIEW_TOKEN_URL ?? 'http://192.168.1.135:8000/interviews/token';
const SETUP_URL = TOKEN_URL.replace(/\/token\/?$/, '') + '/test/bootstrap/';

/**
 * Create a test interview session via Django. Returns session_id and token for Centrifugo.
 * @returns {Promise<{session_id: string, token: string}>}
 */
export async function createTestSession() {
  const res = await fetch(SETUP_URL, { method: 'POST' });
  if (!res.ok) throw new Error(`Bootstrap failed: ${res.status}`);
  const data = await res.json();
  return { session_id: data.session_id, token: data.token };
}

/**
 * Create Centrifugo connection and subscribe to interview channel.
 * Handles both text_message and tts_audio_complete event types.
 * @param {string} sessionId - InterviewSession.id (UUID) from Django
 * @param {string} token - JWT token for Centrifugo authentication
 * @param {{ onTextMessage?: (message: string) => void, onTtsAudio?: (audioBase64: string) => void }} options - Event handlers
 * @returns {{ centrifuge: Centrifuge, subscription: Subscription }}
 */
export async function createCentrifugeConnection(sessionId, token, { onTextMessage, onTtsAudio } = {}) {
  const wsUrl = import.meta.env.VITE_CENTRIFUGO_WS_URL ?? 'ws://192.168.1.135:8001/connection/websocket';

  const centrifuge = new Centrifuge(wsUrl, { token });
  const sub = centrifuge.newSubscription(`interviews:interview:${sessionId}`);

  centrifuge.on('connecting', (ctx) => {
    console.log('[Centrifugo] connecting', ctx);
  });
  centrifuge.on('connected', (ctx) => {
    console.log('[Centrifugo] connected', ctx);
  });
  centrifuge.on('disconnected', (ctx) => {
    console.log('[Centrifugo] disconnected', ctx);
  });
  centrifuge.on('error', (ctx) => {
    console.log('[Centrifugo] error', ctx);
  });

  sub.on('publication', (ctx) => {
    const data = ctx.data;
    console.log('[Centrifugo] publication received', data.type);

    if (data.type === 'text_message' && onTextMessage) {
      onTextMessage(data.message);
    } else if (data.type === 'tts_audio_complete' && onTtsAudio) {
      onTtsAudio(data.audio);
    }
  });

  sub.subscribe();
  centrifuge.connect();

  return { centrifuge, subscription: sub };
}
