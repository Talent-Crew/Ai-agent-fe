import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Centrifuge } from 'centrifuge';
import InterviewHeader from '../components/interview/InterviewHeader';
import ProgressStepper from '../components/interview/ProgressStepper';
import Timer from '../components/interview/Timer';
import ChatContainer from '../components/interview/ChatContainer';
import InputController from '../components/interview/InputController';
import RoleCalibrationForm from '../components/interview/RoleCalibrationForm';
import ThankYouScreen from '../components/interview/ThankYouScreen';
import useInterviewLogic from '../hooks/useInterviewLogic';
import { createTestSession } from '../lib/centrifuge';
import { api, API_BASE_URL } from '../lib/api';

export default function InterviewPage() {
    const navigate = useNavigate();
    const { sessionId: urlSessionId } = useParams();
    const [showForm, setShowForm] = useState(true);
    const [candidateData, setCandidateData] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const [token, setToken] = useState(null);
    const [sessionData, setSessionData] = useState(null);
    const [loading, setLoading] = useState(!!urlSessionId);
    const [error, setError] = useState(null);

    // WebSocket and interview control states
    const socketRef = useRef(null);
    const centrifugeRef = useRef(null);
    const centrifugeConnectingRef = useRef(false); // Prevent double connection
    const [interviewState, setInterviewState] = useState('idle'); // 'idle', 'user-speaking', 'ai-thinking'
    const [isDoneSpeakingDisabled, setIsDoneSpeakingDisabled] = useState(false);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [scorecard, setScorecard] = useState(null);
    const [interviewEnded, setInterviewEnded] = useState(false);

    // Log component render for debugging
    console.log('[InterviewPage] 🔄 Component rendered, sessionId:', sessionId, 'token:', !!token);

    const {
        currentStage,
        stages,
        messages,
        isThinking,
        startTime,
        isCompleted,
        startInterviewWithData,
        handleAIMessage
    } = useInterviewLogic();

    // 5-minute auto-end timer
    useEffect(() => {
        if (!sessionId || showForm) return;

        console.log('[Interview] Starting 5-minute timer');
        const timer = setTimeout(() => {
            console.log('[Interview] ⏰ Time expired - auto-ending interview');
            endInterview();
        }, 5 * 60 * 1000); // 5 minutes

        return () => {
            console.log('[Interview] Clearing timer');
            clearTimeout(timer);
        };
    }, [sessionId, showForm]);

    // Load session if sessionId is in URL
    useEffect(() => {
        const loadSession = async () => {
            if (!urlSessionId) {
                setLoading(false);
                return;
            }

            try {
                const data = await api.getSessionConnection(urlSessionId);
                setSessionData(data);
                setSessionId(urlSessionId);
                setToken(data.token);

                // Set candidate data from session
                setCandidateData({
                    name: data.candidate_name,
                    role: data.job_title
                });

                console.log('Session loaded:', data);
                // Now you have:
                // - data.token (Centrifugo token)
                // - data.channel (WebSocket channel)
                // - data.ws_url (WebSocket URL)
                // - data.candidate_name
                // - data.job_title

                // Skip the form and start interview directly
                setShowForm(false);
                startInterviewWithData({
                    name: data.candidate_name,
                    role: data.job_title
                });

            } catch (err) {
                console.error('Error loading session:', err);
                setError('Invalid or expired interview link');
            } finally {
                setLoading(false);
            }
        };

        loadSession();
    }, [urlSessionId]);

    const handleFormSubmit = async (formData) => {
        setCandidateData(formData);
        try {
            const { session_id, token: sessionToken } = await createTestSession();
            console.log('[Interview] Session created (backend)', session_id);
            setSessionId(session_id);
            setToken(sessionToken);
        } catch (err) {
            const fallback = crypto.randomUUID?.() ?? `session-${Date.now()}`;
            console.warn('[Interview] Session create failed, using fallback id', fallback, err);
            setSessionId(fallback);
            setToken(null);
        }
        setShowForm(false);
        startInterviewWithData(formData);
    };

    // Find this function inside InterviewPage.jsx and replace it
const handleWebSocketReady = useCallback((ws) => {
    console.log('[Interview] WebSocket instance received:', ws);
    if (ws) {
        socketRef.current = ws;
        console.log('[Interview] ✅ Socket connected (direct):', socketRef.current.readyState);
    }
}, []);

    const handleDoneSpeaking = () => {
        // Check if we are actually in a state where the user should be speaking
        if (interviewState !== 'user-speaking') {
            console.warn('[Interview] ⚠️ Not in user-speaking state, current state:', interviewState);
            return;
        }

        if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
            console.error('[Interview] ❌ WS Disconnected. Attempting to reconnect or alert.');
            alert('Connection lost. Please refresh.');
            return;
        }

        // Update UI immediately to prevent double clicks
        setInterviewState('ai-thinking');
        setIsDoneSpeakingDisabled(true);

        // Send the signal to Django after 1 second delay
        setTimeout(() => {
            socketRef.current.send(JSON.stringify({ type: "user_finished_speaking" }));
            console.log('[Interview] ✅ Sent: user_finished_speaking');
        }, 1000);

        // Re-enable after delay
        setTimeout(() => setIsDoneSpeakingDisabled(false), 2000);
    };

    const endInterview = async () => {
        if (socketRef.current) socketRef.current.close();

        setInterviewState('idle');
        setIsEvaluating(true);

        try {
            console.log('[Interview] Ending interview, session ID:', sessionId);
            const response = await fetch(`${API_BASE_URL}/interviews/api/sessions/${sessionId}/end/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('[Interview] ✅ Interview ended successfully');
            console.log('[Interview] Session completed:', data.is_completed);
            console.log('[Interview] Overall score:', data.overall_score);
            console.log('[Interview] Current stage:', data.current_stage);
            console.log('[Interview] Full response:', data);

            // Store scorecard data
            setScorecard(data);

            // Wait a moment to ensure backend processing is complete
            await new Promise(resolve => setTimeout(resolve, 500));

            // Show thank you screen
            setInterviewEnded(true);
        } catch (err) {
            console.error("[Interview] ❌ Failed to end interview:", err);
            console.error("[Interview] Error details:", err.message);
            // Still show thank you screen even if there's an error
            setInterviewEnded(true);
        } finally {
            setIsEvaluating(false);
        }
    };

    // Audio event handlers for state machine (memoized to prevent re-renders)
    const handleAudioPlay = useCallback(() => {
        console.log('[Interview] 🚀 AI STARTS SPEAKING');
        setInterviewState('ai-speaking');
    }, []);

    const handleAudioEnded = useCallback(() => {
        console.log('[Interview] 🚀 AI FINISHED, USER\'S TURN');
        setInterviewState('user-speaking');
    }, []);

    const handleAudioPause = useCallback(() => {
        console.log('[Interview] 🚀 AI PAUSED, USER\'S TURN');
        setInterviewState('user-speaking');
    }, []);

    const handleRespeak = useCallback(() => {
        console.log('[Interview] 🔄 User clicked Respeak');
        
        // Go back to user-speaking state
        setInterviewState('user-speaking');
        
        console.log('[Interview] ✅ Ready for user to respeak');
    }, []);

    // Centrifugo Subscription for AI messages & audio
    useEffect(() => {
        if (!token || !sessionId) return;

        // Prevent multiple connections
        if (centrifugeRef.current || centrifugeConnectingRef.current) {
            console.log('[Centrifugo] ⚠️ Connection already exists or connecting, skipping reconnection');
            return;
        }

        centrifugeConnectingRef.current = true;

        try {
            const wsUrl = import.meta.env.VITE_CENTRIFUGO_WS_URL ?? 'ws://192.168.1.135:8001/connection/websocket';
            const centrifuge = new Centrifuge(wsUrl, { token });
            centrifugeRef.current = centrifuge;

            const channelName = `interviews:interview:${sessionId}`;
            
            // Modern Centrifugo syntax: use newSubscription()
            const sub = centrifuge.newSubscription(channelName);

            sub.on('publication', (ctx) => {
                const data = ctx.data;
                console.log('[Centrifugo] 📨 Received:', data);

                // Matches Python: {"type": "text_message", "message": message...}
                if (data.type === 'text_message') {
                    console.log('[Centrifugo] 💬 Message:', data.message);
                    handleAIMessage(data.message);
                }

                // Matches Python: {"type": "tts_audio_complete", "audio": b64...}
                if (data.type === 'tts_audio_complete' || data.type === 'tts_audio') {
                    console.log('[Centrifugo] 🔊 Playing audio');
                    const audio = new Audio(`data:audio/mp3;base64,${data.audio}`);
                    audio.onplay = handleAudioPlay;
                    audio.onended = handleAudioEnded;
                    audio.play().catch(e => console.error("[Centrifugo] Audio playback failed", e));
                }

                if (data.type === 'interview_complete') {
                    console.log('[Centrifugo] 🏁 Interview finished by AI');
                    endInterview();
                }
            });

            sub.subscribe(); // Actually triggers the subscription
            centrifuge.connect();

            return () => {
                console.log('[Centrifugo] Cleaning up subscription...');
                sub.removeAllListeners();
                sub.unsubscribe();
                centrifugeConnectingRef.current = false;
            };
        } catch (err) {
            console.error('[Centrifugo] Connection failed:', err);
            centrifugeRef.current = null;
            centrifugeConnectingRef.current = false
            console.error('[Centrifugo] Connection failed:', err);
            centrifugeRef.current = null;
        }
    }, [token, sessionId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <svg className="w-12 h-12 text-[#6366F1] animate-spin mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <p className="text-white text-lg">Loading interview...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-6">
                    <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-white mb-2">Interview Link Error</h2>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <p className="text-gray-500 text-sm">Please contact the recruiter for a new interview link.</p>
                </div>
            </div>
        );
    }

    if (showForm) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
                <RoleCalibrationForm onSubmit={handleFormSubmit} />
            </div>
        );
    }

    if (isCompleted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col">
                <ThankYouScreen candidateName={candidateData?.name} />
            </div>
        );
    }

    if (interviewEnded) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col">
                <ThankYouScreen candidateName={candidateData?.name} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col">
            <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#6366F1] to-[#4F46E5] rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-lg">TC</span>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-white">TalentCrew</h1>
                                <p className="text-xs text-gray-400">AI Interview</p>
                            </div>
                        </div>
                        <Timer startTime={startTime} />
                    </div>
                    <ProgressStepper stages={stages} currentStage={currentStage} />
                </div>
            </div>

            {/* AI Animation Orb */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="relative">
                    {/* Status Text */}
                    <h3 className="text-center text-2xl font-semibold text-white mb-8">
                        {interviewState === 'idle' && "Starting interview..."}
                        {interviewState === 'ai-thinking' && "🧠 AI is processing..."}
                        {interviewState === 'ai-speaking' && "🤖 AI is speaking..."}
                        {interviewState === 'user-speaking' && "🎤 Your turn to speak"}
                    </h3>

                    {/* Animated Orb */}
                    <div className="relative w-48 h-48 mx-auto">
                        {/* Outer glow */}
                        <div
                            className="absolute inset-0 rounded-full transition-all duration-500"
                            style={{
                                background: interviewState === 'ai-thinking' ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' :
                                    interviewState === 'ai-speaking' ? 'linear-gradient(135deg, #a855f7, #ec4899)' :
                                        interviewState === 'user-speaking' ? 'linear-gradient(135deg, #10b981, #3b82f6)' :
                                            'linear-gradient(135deg, #475569, #334155)',
                                filter: 'blur(40px)',
                                opacity: interviewState === 'idle' ? 0.2 : 0.6,
                                transform: interviewState === 'ai-speaking' ? 'scale(1.2)' : 'scale(0.8)'
                            }}
                        />

                        {/* Inner orb */}
                        <div
                            className="absolute inset-0 m-auto w-32 h-32 rounded-full animate-pulse transition-all duration-500"
                            style={{
                                background: interviewState === 'ai-thinking' ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' :
                                    interviewState === 'ai-speaking' ? 'linear-gradient(135deg, #a855f7, #ec4899)' :
                                        interviewState === 'user-speaking' ? 'linear-gradient(135deg, #10b981, #3b82f6)' :
                                            'linear-gradient(135deg, #475569, #334155)',
                                boxShadow: 'inset 0 0 20px rgba(255,255,255,0.4), 0 0 20px rgba(255,255,255,0.2)',
                                transform: interviewState === 'ai-speaking' ? 'scale(1.2)' : 'scale(1)'
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Interview Control Buttons */}
            <div className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-center space-x-4">
                        {/* Respeak Button - Only show when AI is thinking */}
                        {interviewState === 'ai-thinking' && (
                            <button
                                onClick={handleRespeak}
                                className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span>Respeak</span>
                            </button>
                        )}

                        {/* Finished Speaking Button */}
                        <button
                            onClick={handleDoneSpeaking}
                            disabled={isDoneSpeakingDisabled || isCompleted || isEvaluating}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Finished Speaking</span>
                        </button>

                        {/* End Interview Button */}
                        <button
                            onClick={endInterview}
                            disabled={isCompleted || isEvaluating}
                            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                            {isEvaluating ? (
                                <>
                                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <span>Generating Scorecard...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span>End Interview</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <InputController
                sessionId={sessionId}
                token={token}
                onTextMessage={handleAIMessage}
                onWebSocketReady={handleWebSocketReady}
                onAudioPlay={handleAudioPlay}
                onAudioEnded={handleAudioEnded}
                onAudioPause={handleAudioPause}
                disabled={isCompleted}
            />
        </div>
    );
}