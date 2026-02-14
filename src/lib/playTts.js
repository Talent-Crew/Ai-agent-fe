/**
 * Play TTS audio from base64 encoded MP3.
 * @param {string} audioBase64 - Base64 encoded MP3 audio
 * @param {Object} callbacks - Optional callbacks for audio events
 * @param {Function} callbacks.onPlay - Called when audio starts playing
 * @param {Function} callbacks.onEnded - Called when audio finishes
 * @param {Function} callbacks.onPause - Called when audio is paused
 * @returns {HTMLAudioElement} The audio element
 */
export function playTts(audioBase64, callbacks = {}) {
  const audio = new Audio(`data:audio/mp3;base64,${audioBase64}`);

  // Set up event handlers if provided
  if (callbacks.onPlay) {
    audio.onplay = callbacks.onPlay;
  }
  if (callbacks.onEnded) {
    audio.onended = callbacks.onEnded;
  }
  if (callbacks.onPause) {
    audio.onpause = callbacks.onPause;
  }

  audio.play().catch((err) => console.error('[TTS] Audio play failed:', err));

  return audio;
}
