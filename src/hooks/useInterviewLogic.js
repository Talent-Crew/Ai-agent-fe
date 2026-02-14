import { useState, useEffect } from 'react';

const INTERVIEW_STAGES = ['Adaptive Technical Deep-Dive', 'Communication Assessment', 'Wrap-up'];

const STAGE_PROMPTS = {
    0: "Hello {name}! I'm your AI interviewer for TalentCrew. I see you're interested in the {role} position with {experience} of experience. Based on your profile, I'll be asking questions tailored to your expertise. Let's dive into the technical aspects. Tell me about a challenging technical problem you've solved recently. What was your approach, what technologies did you use, and what was the outcome?",
    1: "Great technical insights! Now let's shift focus to communication and collaboration. Can you describe a time when you had to explain a complex technical concept to a non-technical stakeholder or team member? How did you ensure they understood, and what was the result?",
    2: "Thank you for those detailed responses. We're wrapping up now. Based on our conversation, I'll be compiling a comprehensive scorecard. Do you have any questions for me about the role, team, or company? This is also your chance to share any final thoughts or accomplishments you'd like to highlight."
};

const ROLE_SPECIFIC_QUESTIONS = {
    'Frontend': [
        "How do you approach performance optimization in web applications? Can you give a specific example?",
        "Describe your experience with state management. What patterns or libraries do you prefer and why?",
        "Tell me about a time when you had to ensure cross-browser compatibility. What challenges did you face?"
    ],
    'Backend': [
        "How do you design APIs for scalability? Walk me through your thought process.",
        "Describe a situation where you had to optimize database queries. What was your approach?",
        "Tell me about your experience with microservices architecture. What are the key considerations?"
    ],
    'DBMS': [
        "How do you approach database schema design for a new application? What factors do you consider?",
        "Describe a time when you had to troubleshoot a performance issue in a database. What was your methodology?",
        "Tell me about your experience with database replication and sharding strategies."
    ],
    'Cloud': [
        "How do you design cloud infrastructure for high availability? Can you give an example?",
        "Describe your approach to cloud cost optimization. What strategies have you implemented?",
        "Tell me about your experience with containerization and orchestration. What challenges have you solved?"
    ]
};

export default function useInterviewLogic() {
    const [currentStage, setCurrentStage] = useState(0);
    const [messages, setMessages] = useState([]);
    const [isThinking, setIsThinking] = useState(false);
    const [startTime] = useState(Date.now());
    const [selectedRole, setSelectedRole] = useState(null);
    const [candidateInfo, setCandidateInfo] = useState(null);
    const [technicalQuestionCount, setTechnicalQuestionCount] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);

    const startInterviewWithData = (formData) => {
        setSelectedRole(formData.role);
        setCandidateInfo(formData);

        // Start with personalized greeting
        setTimeout(() => {
            const greeting = STAGE_PROMPTS[0]
                .replace('{name}', formData.name)
                .replace('{role}', formData.role)
                .replace('{experience}', formData.experience);

            setMessages([{
                role: 'ai',
                content: greeting
            }]);
        }, 500);
    };

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

    const handleCandidateResponse = async (userInput) => {
        // Add user message
        const newMessages = [...messages, { role: 'user', content: userInput }];
        setMessages(newMessages);

        // Simulate AI thinking
        setIsThinking(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

        // Generate AI response based on stage and input
        const aiResponse = generateAIResponse(currentStage, userInput, newMessages.length, userInput);

        setMessages([...newMessages, { role: 'ai', content: aiResponse }]);
        setIsThinking(false);

        // Check if interview is complete
        if (currentStage === INTERVIEW_STAGES.length - 1 && shouldAdvanceStage(newMessages.length, currentStage)) {
            setTimeout(() => {
                setIsCompleted(true);
                const completionMessage = {
                    role: 'ai',
                    content: "Thank you for completing the interview! Your responses have been recorded and a comprehensive scorecard will be generated. We'll be in touch soon regarding the next steps. Have a great day!"
                };
                const finalMessages = [...newMessages, completionMessage];
                setMessages(finalMessages);

                // Save interview results to localStorage
                saveInterviewResults(finalMessages, candidateInfo);
            }, 1000);
        }
        // Advance stage based on conversation length (but not past the last stage)
        else if (shouldAdvanceStage(newMessages.length, currentStage) && currentStage < INTERVIEW_STAGES.length - 1) {
            setTimeout(() => {
                const nextStage = currentStage + 1;
                setCurrentStage(nextStage);

                // Add stage transition message
                if (nextStage < INTERVIEW_STAGES.length && STAGE_PROMPTS[nextStage]) {
                    setTimeout(() => {
                        setMessages(prev => [...prev, {
                            role: 'ai',
                            content: STAGE_PROMPTS[nextStage]
                        }]);
                    }, 1000);
                }
            }, 500);
        }
    };

    const shouldAdvanceStage = (messageCount, stage) => {
        // DEV MODE: 1 question per stage
        // Stage 0 (Technical): After 1 exchange (2 messages: AI question + user answer)
        if (stage === 0) {
            return messageCount >= 3; // greeting + user response = 3 total
        }
        // Stage 1 (Communication): After 1 exchange
        if (stage === 1) {
            return messageCount >= 5; // previous + question + answer = 5 total
        }
        // Stage 2 (Wrap-up): After 1 exchange, don't advance (end of interview)
        if (stage === 2) {
            return messageCount >= 7; // previous + question + answer = 7 total
        }
        return false;
    };

    const generateAIResponse = (stage, userInput, messageCount, originalInput) => {
        // DEV MODE: Simple acknowledgment, no follow-up questions within stage

        if (stage === 0) {
            // Technical stage - acknowledge response
            return "Thank you for that detailed technical explanation. I can see you have solid experience in this area.";
        }

        if (stage === 1) {
            // Communication Assessment - acknowledge response
            return "That's a great example of effective communication. I appreciate how you handled that situation.";
        }

        if (stage === 2) {
            // Wrap-up - acknowledge final response
            return "Thank you for sharing that. I'm now compiling your comprehensive scorecard based on our conversation.";
        }

        return "Thank you for sharing that.";
    };

    return {
        currentStage,
        stages: INTERVIEW_STAGES,
        messages,
        isThinking,
        startTime,
        selectedRole,
        isCompleted,
        handleCandidateResponse,
        startInterviewWithData
    };
}
