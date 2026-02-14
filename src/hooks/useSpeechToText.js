import { useState, useRef, useEffect } from 'react';
import { createCentrifugeConnection } from '../lib/centrifuge';

export default function useSpeechToText(options = {}) {
  const { sessionId } = options;

  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState(null);

  const connectionRef = useRef(null);
  const audioContextRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const AudioContextCtor = typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext);
    const hasAudioWorklet = AudioContextCtor && 'audioWorklet' in AudioContextCtor.prototype;
    const hasGetUserMedia = typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia != null;
    setIsSupported(!!(AudioContextCtor && hasAudioWorklet && hasGetUserMedia));
  }, []);

  useEffect(() => {
    return () => {
      if (connectionRef.current?.centrifuge) {
        connectionRef.current.centrifuge.disconnect();
        connectionRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!sessionId || !isSupported) return;
    startListening();
    return () => stopListening();
  }, [sessionId, isSupported]);

  const startListening = async () => {
    if (!isSupported) {
      setError('AudioWorklet or microphone not supported');
      return;
    }
    if (!sessionId) {
      setError('Session ID required');
      return;
    }
    setError(null);

    try {
      const connection = await createCentrifugeConnection(sessionId);
      connectionRef.current = connection;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new AudioContext({ sampleRate: 16000 });
      await audioContext.audioWorklet.addModule('/audio-processor.js');
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const workletNode = new AudioWorkletNode(audioContext, 'pcm-processor', {
        processorOptions: { sampleRate: audioContext.sampleRate },
      });

      workletNode.port.onmessage = (event) => {
        const pcmChunk = new Uint8Array(event.data);
        const conn = connectionRef.current;
        if (conn?.centrifuge?.state === 'connected') {
          conn.centrifuge.publish(conn.tokenData.channel, { audio: Array.from(pcmChunk) });
        }
      };

      source.connect(workletNode);
      workletNode.connect(audioContext.destination);

      setIsListening(true);
    } catch (err) {
      setError(err.message || 'Failed to start');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (connectionRef.current?.centrifuge) {
      connectionRef.current.centrifuge.disconnect();
      connectionRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsListening(false);
  };

  return {
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
  };
}
