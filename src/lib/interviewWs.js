/**
 * Django WebSocket: stream audio from browser to Django for Deepgram STT.
 * Flow: Mic → MediaRecorder → this WS → Django → Deepgram STT → Gemini → Deepgram TTS → Centrifugo → React.
 */
const TOKEN_URL = import.meta.env.VITE_INTERVIEW_TOKEN_URL ?? 'http://192.168.1.135:8000/interviews/token';

function getWsBase() {
  const fromEnv = import.meta.env.VITE_INTERVIEW_WS_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  const base = TOKEN_URL.replace(/\/interviews\/token\/?$/, '').replace(/^http/, 'ws');
  return `${base}/ws/interview`;
}

/**
 * Connect to Django interview WebSocket. Returns a WebSocket instance.
 * @param {string} sessionId - Interview session UUID
 * @returns {Promise<WebSocket>}
 */
export function connectInterviewWs(sessionId) {
  const url = `${getWsBase()}/${sessionId}/`;
  console.log('[Interview WS] Connecting to:', url);
  const ws = new WebSocket(url);

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      console.warn('[Interview WS] Connection timeout');
      ws.close();
      reject(new Error('WebSocket connection timeout'));
    }, 10000); // 10 second timeout

    ws.onopen = () => {
      clearTimeout(timeout);
      console.log('[Interview WS] connected', url);
      resolve(ws);
    };

    ws.onerror = (e) => {
      clearTimeout(timeout);
      console.warn('[Interview WS] error', e);
      reject(new Error('WebSocket connection failed'));
    };

    ws.onclose = () => {
      clearTimeout(timeout);
      console.log('[Interview WS] closed');
    };
  });
}
