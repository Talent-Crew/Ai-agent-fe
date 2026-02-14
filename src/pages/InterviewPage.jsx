import { useState } from 'react';
import InterviewHeader from '../components/interview/InterviewHeader';
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
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <InterviewHeader
                    stages={stages}
                    currentStage={0}
                    startTime={startTime}
                />
                <RoleCalibrationForm onSubmit={handleFormSubmit} />
            </div>
        );
    }

    if (isCompleted) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <InterviewHeader
                    stages={stages}
                    currentStage={currentStage}
                    startTime={startTime}
                />
                <ThankYouScreen candidateName={candidateData?.name} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <InterviewHeader
                stages={stages}
                currentStage={currentStage}
                startTime={startTime}
            />

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
