import { useState } from 'react';
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
    const [showForm, setShowForm] = useState(true);
    const [candidateData, setCandidateData] = useState(null);
    const [sessionId, setSessionId] = useState(null);

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
