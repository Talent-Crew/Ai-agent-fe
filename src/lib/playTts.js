/**
 * Play TTS audio from base64 encoded MP3.
 * @param {string} audioBase64 - Base64 encoded MP3 audio
 */
export function playTts(audioBase64) {
  const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`);
  audio.play().catch((err) => console.error('[TTS] Audio play failed:', err));
}
