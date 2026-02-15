import { useEffect, useRef, useMemo } from 'react';
import useSpeechToText from '../../hooks/useSpeechToText';

export default function InputController({ 
  sessionId, 
  token, 
  onTextMessage, 
  onWebSocketReady, 
  onAudioPlay, 
  onAudioEnded, 
  onAudioPause, 
  disabled 
}) {
  const latestCallbacks = useRef({
    onTextMessage,
    onAudioPlay,
    onAudioEnded,
    onAudioPause,
    onWebSocketReady
  });

  useEffect(() => {
    latestCallbacks.current = {
      onTextMessage,
      onAudioPlay,
      onAudioEnded,
      onAudioPause,
      onWebSocketReady
    };
  }, [onTextMessage, onAudioPlay, onAudioEnded, onAudioPause, onWebSocketReady]);

  const stableCallbacks = useMemo(() => ({
    onTextMessage: (data) => latestCallbacks.current.onTextMessage?.(data),
    onAudioPlay: () => latestCallbacks.current.onAudioPlay?.(),
    onAudioEnded: () => latestCallbacks.current.onAudioEnded?.(),
    onAudioPause: () => latestCallbacks.current.onAudioPause?.(),
    onWebSocketReady: (ws) => latestCallbacks.current.onWebSocketReady?.(ws)
  }), []);

  const { isSupported, error, isListening } = useSpeechToText({
    sessionId,
    token,
    onTextMessage: stableCallbacks.onTextMessage,
    onAudioPlay: stableCallbacks.onAudioPlay,
    onAudioEnded: stableCallbacks.onAudioEnded,
    onAudioPause: stableCallbacks.onAudioPause,
    onWebSocketReady: stableCallbacks.onWebSocketReady // Passed straight to the hook
  });

  return null;
}