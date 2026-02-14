import { useState } from 'react';
import InterviewHeader from '../components/interview/InterviewHeader';
import ChatContainer from '../components/interview/ChatContainer';
import InputController from '../components/interview/InputController';
import RoleCalibrationForm from '../components/interview/RoleCalibrationForm';
import ThankYouScreen from '../components/interview/ThankYouScreen';
import useInterviewLogic from '../hooks/useInterviewLogic';

export default function InterviewPage() {
    const [showForm, setShowForm] = useState(true);
    const [candidateData, setCandidateData] = useState(null);

    const {
        currentStage,
        stages,
        messages,
        isThinking,
        startTime,
        isCompleted,
        handleCandidateResponse,
        startInterviewWithData
    } = useInterviewLogic();

    const handleFormSubmit = (formData) => {
        setCandidateData(formData);
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
                onSend={handleCandidateResponse}
                disabled={isThinking || isCompleted}
            />
        </div>
    );
}
