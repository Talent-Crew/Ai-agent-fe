import { useState, useRef, useEffect } from 'react';
import { createCentrifugeConnection } from '../lib/centrifuge';
import { connectInterviewWs } from '../lib/interviewWs';
import { playTts } from '../lib/playTts';

export default function useSpeechToText(options = {}) {
  const { sessionId, token, onTextMessage, onAudioPlay, onAudioEnded, onAudioPause } = options;

  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState(null);

  const connectionRef = useRef(null);
  const interviewWsRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  
  // Store callbacks in refs to avoid recreating Centrifuge connection
  const callbacksRef = useRef({
    onTextMessage,
    onAudioPlay,
    onAudioEnded,
    onAudioPause
  });

  // Update callbacks ref when they change
  useEffect(() => {
    callbacksRef.current = {
      onTextMessage,
      onAudioPlay,
      onAudioEnded,
      onAudioPause
    };
  }, [onTextMessage, onAudioPlay, onAudioEnded, onAudioPause]);

  useEffect(() => {
    const hasGetUserMedia = typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia != null;
    const hasMediaRecorder = typeof MediaRecorder !== 'undefined';
    setIsSupported(!!(hasGetUserMedia && hasMediaRecorder));
  }, []);

  // Connect to Centrifuge immediately to receive messages
  useEffect(() => {
    if (!sessionId || !token) return;

    console.log('[Interview] Connecting to Centrifuge for message receive...');

    createCentrifugeConnection(sessionId, token, {
      onTextMessage: (message) => {
        console.log('[Centrifugo] Text message received:', message);
        if (callbacksRef.current.onTextMessage) callbacksRef.current.onTextMessage(message);
      },
      onTtsAudio: (audioBase64) => {
        console.log('[Centrifugo] TTS audio received');
        playTts(audioBase64, {
          onPlay: () => {
            console.log('[TTS] Audio started playing');
            if (callbacksRef.current.onAudioPlay) callbacksRef.current.onAudioPlay();
          },
          onEnded: () => {
            console.log('[TTS] Audio ended');
            if (callbacksRef.current.onAudioEnded) callbacksRef.current.onAudioEnded();
          },
          onPause: () => {
            console.log('[TTS] Audio paused');
            if (callbacksRef.current.onAudioPause) callbacksRef.current.onAudioPause();
          }
        });
      },
    }).then((connection) => {
      connectionRef.current = connection;
      console.log('[Interview] Centrifuge connected for messages');
    }).catch((err) => {
      console.error('[Interview] Centrifuge connection failed:', err);
    });

    return () => {
      if (connectionRef.current?.centrifuge) {
        setTimeout(() => {
          if (connectionRef.current?.centrifuge) {
            connectionRef.current.centrifuge.disconnect();
            connectionRef.current = null;
          }
        }, 100);
      }
    };
  }, [sessionId, token]); // Only reconnect when sessionId or token changes

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (interviewWsRef.current) {
        if (interviewWsRef.current.readyState === WebSocket.OPEN) {
          interviewWsRef.current.close();
        }
        interviewWsRef.current = null;
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  // Auto-start recording when ready
  useEffect(() => {
    if (!sessionId || !token || !isSupported || isListening) return;
    console.log('[Interview] Auto-starting recording...');
    startListening();
  }, [sessionId, token, isSupported]);

  const startListening = async () => {
    if (!isSupported) {
      setError('MediaRecorder or microphone not supported');
      return;
    }
    if (!sessionId) {
      setError('Session ID required');
      return;
    }
    if (isListening) {
      console.log('[Interview] Already listening, skipping start');
      return;
    }
    setError(null);

    console.log('[Interview] Starting audio recording: sessionId', sessionId);

    try {
      console.log('[Interview] Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      console.log('[Interview] Connecting to Django WebSocket...');
      const interviewWs = await connectInterviewWs(sessionId);
      interviewWsRef.current = interviewWs;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && interviewWsRef.current?.readyState === WebSocket.OPEN) {
          interviewWsRef.current.send(event.data);
        }
      };

      mediaRecorder.start(250); // Send audio chunks every 250ms
      setIsListening(true);
      console.log('[Interview] 🟢 Recording Live - streaming audio to backend');
    } catch (err) {
      console.error('[Interview] Failed to start:', err);
      setError(err.message || 'Failed to start recording');
      setIsListening(false);
    }
  };

  const stopListening = () => {
    console.log('[Interview] Stopping recording...');
    if (interviewWsRef.current) {
      if (interviewWsRef.current.readyState === WebSocket.OPEN) {
        interviewWsRef.current.close();
      }
      interviewWsRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
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
    interviewWsRef, // Expose WebSocket ref for parent components
  };
}
