import { useState, useRef, useEffect } from 'react';
import { connectInterviewWs } from '../lib/interviewWs';

export default function useSpeechToText(options = {}) {
  // 1. Destructure onWebSocketReady
  const { sessionId, token, onTextMessage, onAudioPlay, onAudioEnded, onAudioPause, onWebSocketReady } = options;

  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState(null);

  const interviewWsRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  
  const callbacksRef = useRef({
    onTextMessage,
    onAudioPlay,
    onAudioEnded,
    onAudioPause,
    onWebSocketReady
  });

  useEffect(() => {
    callbacksRef.current = {
      onTextMessage,
      onAudioPlay,
      onAudioEnded,
      onAudioPause,
      onWebSocketReady // 3. Keep updated
    };
  }, [onTextMessage, onAudioPlay, onAudioEnded, onAudioPause, onWebSocketReady]);

  useEffect(() => {
    const hasGetUserMedia = typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia != null;
    const hasMediaRecorder = typeof MediaRecorder !== 'undefined';
    setIsSupported(!!(hasGetUserMedia && hasMediaRecorder));
  }, []);

  // Removed duplicate WebSocket connection effect - connection now only happens in startListening() 

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
    if (isListening) return;
    setError(null);

    console.log('[Interview] Starting audio recording: sessionId', sessionId);

    try {
      console.log('[Interview] Requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      console.log('[Interview] Connecting to Django WebSocket...');
      const interviewWs = await connectInterviewWs(sessionId);
      interviewWsRef.current = interviewWs;

      // 4. 🔥 Pass the socket instance up EXACTLY when it connects
      if (callbacksRef.current.onWebSocketReady) {
        callbacksRef.current.onWebSocketReady(interviewWs);
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0 && interviewWsRef.current?.readyState === WebSocket.OPEN) {
          interviewWsRef.current.send(event.data);
        }
      };

      mediaRecorder.start(250);
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
    stopListening
  };
}