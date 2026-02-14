import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InterviewHeader from '../components/interview/InterviewHeader';
import ProgressStepper from '../components/interview/ProgressStepper';
import Timer from '../components/interview/Timer';
import ChatContainer from '../components/interview/ChatContainer';
import InputController from '../components/interview/InputController';
import RoleCalibrationForm from '../components/interview/RoleCalibrationForm';
import ThankYouScreen from '../components/interview/ThankYouScreen';
import useInterviewLogic from '../hooks/useInterviewLogic';
import { createTestSession } from '../lib/centrifuge';

export default function InterviewPage() {
    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(true);
    const [candidateData, setCandidateData] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const [tabSwitchCount, setTabSwitchCount] = useState(0);
    const [showTerminationWarning, setShowTerminationWarning] = useState(false);
    const [isTerminated, setIsTerminated] = useState(false);

    const {
        currentStage,
        stages,
        messages,
        isThinking,
        startTime,
        isCompleted,
        startInterviewWithData
    } = useInterviewLogic();

    const handleFormSubmit = async (formData) => {
        setCandidateData(formData);
        try {
            const session_id = await createTestSession();
            setSessionId(session_id);
        } catch {
            setSessionId(crypto.randomUUID?.() ?? `session-${Date.now()}`);
        }
        setShowForm(false);
        startInterviewWithData(formData);
    };

    // Tab switch detection and prevention
    useEffect(() => {
        if (!showForm && !isCompleted) {
            const handleVisibilityChange = () => {
                if (document.hidden) {
                    // User switched tab or minimized window
                    setTabSwitchCount(prev => prev + 1);
                    setShowTerminationWarning(true);

                    // Terminate interview immediately
                    setTimeout(() => {
                        setIsTerminated(true);
                    }, 100);
                }
            };

            const handleBlur = () => {
                // Window lost focus
                if (!document.hidden) {
                    setTabSwitchCount(prev => prev + 1);
                    setShowTerminationWarning(true);

                    setTimeout(() => {
                        setIsTerminated(true);
                    }, 100);
                }
            };

            // Prevent right click
            const handleContextMenu = (e) => {
                e.preventDefault();
            };

            // Detect common shortcuts for switching tabs
            const handleKeyDown = (e) => {
                // Prevent Cmd/Ctrl + Tab, Cmd/Ctrl + W, Cmd/Ctrl + T, etc.
                if ((e.metaKey || e.ctrlKey) && (e.key === 'Tab' || e.key === 'w' || e.key === 't' || e.key === 'n')) {
                    e.preventDefault();
                    setShowTerminationWarning(true);
                    setTimeout(() => {
                        setIsTerminated(true);
                    }, 100);
                }
            };

            document.addEventListener('visibilitychange', handleVisibilityChange);
            window.addEventListener('blur', handleBlur);
            document.addEventListener('contextmenu', handleContextMenu);
            document.addEventListener('keydown', handleKeyDown);

            return () => {
                document.removeEventListener('visibilitychange', handleVisibilityChange);
                window.removeEventListener('blur', handleBlur);
                document.removeEventListener('contextmenu', handleContextMenu);
                document.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [showForm, isCompleted]);

    // Show termination screen
    if (isTerminated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-6">
                <div className="max-w-2xl w-full bg-gray-800/50 backdrop-blur-sm border border-red-500/50 rounded-2xl p-8 text-center">
                    <div className="flex items-center justify-center w-24 h-24 bg-red-500/20 rounded-full mx-auto mb-6">
                        <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-red-500 mb-4">Interview Terminated</h2>
                    <p className="text-gray-300 text-lg mb-6">
                        Your interview has been terminated due to switching tabs or losing window focus.
                    </p>
                    <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-400">
                            <strong className="text-white">Tab Switches Detected:</strong> {tabSwitchCount}
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                            You were warned that any interruption would result in immediate termination.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-[#6366F1] hover:bg-[#4F46E5] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                    >
                        Return to Home
                    </button>
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex flex-col">
            {/* Header with Progress and Timer */}
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

            <ChatContainer
                messages={messages}
                isThinking={isThinking}
            />

            <InputController
                sessionId={sessionId}
                disabled={isCompleted}
            />
        </div>
    );
}
