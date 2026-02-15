import { useState, useCallback } from 'react';

const INTERVIEW_STAGES = ['Adaptive Technical Deep-Dive', 'Communication Assessment', 'Wrap-up'];

export default function useInterviewLogic() {
    const [currentStage, setCurrentStage] = useState(0);
    const [messages, setMessages] = useState([]);
    const [isThinking, setIsThinking] = useState(false);
    const [startTime] = useState(Date.now());
    const [selectedRole, setSelectedRole] = useState(null);
    const [candidateInfo, setCandidateInfo] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);

    const startInterviewWithData = useCallback((formData) => {
        setSelectedRole(formData.role);
        setCandidateInfo(formData);
    }, []);

    const handleAIMessage = useCallback((message) => {
        console.log('[Interview Logic] AI message received:', message);
        setMessages(prev => [...prev, { role: 'ai', content: message }]);
        setIsThinking(false);
    }, []);

    const saveInterviewResults = (finalMessages, candidateData) => {
        // Generate scorecard data
        const scorecard = generateScorecard(finalMessages, candidateData);

        // Get existing results
        const existing = localStorage.getItem('interviewResults');
        const results = existing ? JSON.parse(existing) : [];

        // Add new result
        results.push(scorecard);

        // Save to localStorage
        localStorage.setItem('interviewResults', JSON.stringify(results));
    };

    const generateScorecard = (messageList, candidateData) => {
        // Analyze messages to generate scores
        const userMessages = messageList.filter(m => m.role === 'user');
        const avgLength = userMessages.reduce((sum, m) => sum + m.content.length, 0) / userMessages.length;

        // Simple scoring logic (could be enhanced with AI)
        const technicalScore = Math.min(10, Math.floor(avgLength / 50) + 5);
        const communicationScore = Math.min(10, Math.floor(avgLength / 60) + 5);
        const overallScore = Math.floor((technicalScore + communicationScore) / 2);

        // Determine verdict
        let verdict = 'Requires Human Interview';
        if (overallScore >= 8) verdict = 'Hire';
        else if (overallScore < 6) verdict = 'No Hire';

        // Extract strengths and risks from responses
        const strengths = [];
        const risks = [];

        userMessages.forEach((msg, idx) => {
            if (msg.content.length > 150) {
                strengths.push({
                    title: `Strong Response ${idx + 1}`,
                    description: `Provided detailed and comprehensive answer demonstrating ${idx < 2 ? 'technical depth' : 'communication skills'}.`,
                    evidence: msg.content.substring(0, 100) + '...'
                });
            } else if (msg.content.length < 50) {
                risks.push({
                    title: `Brief Response ${idx + 1}`,
                    description: 'Response could have included more detail and specific examples.',
                    evidence: msg.content
                });
            }
        });

        // Generate follow-up questions
        const followUpQuestions = [
            `Can you provide more specific examples of ${candidateData.role.toLowerCase()} work you've done?`,
            `How do you stay updated with the latest ${candidateData.role.toLowerCase()} technologies and best practices?`,
            `What are your long-term career goals in ${candidateData.role.toLowerCase()} development?`
        ];

        return {
            id: Date.now().toString(),
            name: candidateData.name,
            email: candidateData.email,
            role: candidateData.role,
            experience: candidateData.experience,
            keySkills: candidateData.keySkills,
            completedAt: new Date().toISOString(),
            verdict,
            scores: {
                technical: technicalScore,
                communication: communicationScore,
                overall: overallScore
            },
            strengths,
            risks,
            followUpQuestions,
            messages: messageList
        };
    };

    return {
        currentStage,
        stages: INTERVIEW_STAGES,
        messages,
        isThinking,
        startTime,
        selectedRole,
        isCompleted,
        candidateInfo,
        startInterviewWithData,
        handleAIMessage,
        saveInterviewResults,
        setIsCompleted
    };
}
