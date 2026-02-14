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
                setMessages(prev => [...prev, {
                    role: 'ai',
                    content: "Thank you for completing the interview! Your responses have been recorded and a comprehensive scorecard will be generated. We'll be in touch soon regarding the next steps. Have a great day!"
                }]);
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
        // Stage 0 (Technical): After 2 exchanges
        if (stage === 0) {
            return messageCount >= 5;
        }
        // Stage 1 (Communication): After 2 exchanges
        if (stage === 1) {
            return messageCount >= 9;
        }
        // Stage 2 (Wrap-up): After 2 exchanges, don't advance (end of interview)
        if (stage === 2) {
            return messageCount >= 13;
        }
        return false;
    };

    const generateAIResponse = (stage, userInput, messageCount, originalInput) => {
        const inputLower = userInput.toLowerCase();
        const isDetailedResponse = userInput.length > 100;
        const isSophisticated = userInput.split(' ').length > 50;

        if (stage === 0) {
            const roleQuestions = selectedRole ? ROLE_SPECIFIC_QUESTIONS[selectedRole] : [];

            if (isSophisticated) {
                // Shift to more complex topics
                return "That's a very sophisticated answer showing deep technical understanding. Let me probe further with an architectural question: How would you scale this solution to handle 10x the traffic? What would be your key considerations and trade-offs?";
            } else if (!isDetailedResponse) {
                // Probe for more depth
                return "I'd like to understand more depth here. Can you walk me through the specific technical decisions you made? What alternatives did you consider, and why did you choose this particular approach?";
            } else {
                // Continue with role-specific questions
                const questionIndex = technicalQuestionCount % (roleQuestions.length || 1);
                setTechnicalQuestionCount(prev => prev + 1);
                return roleQuestions[questionIndex] || "Excellent explanation. Tell me about another technical challenge you've faced. How did you approach debugging or troubleshooting the issue?";
            }
        }

        if (stage === 1) {
            // Communication Assessment
            const responses = [
                "That's a great example of effective communication. How do you typically handle situations where there's miscommunication or conflicting priorities between technical and business teams?",
                "Good approach to explaining technical concepts. Tell me about a time when you had to work with a difficult team member or stakeholder. How did you handle the situation?",
                "I appreciate that example. In your experience, what strategies work best for ensuring everyone on the team is aligned, especially in remote or distributed settings?"
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }

        if (stage === 2) {
            // Wrap-up
            return "Thank you for that insight. I'm now compiling a comprehensive scorecard based on our conversation, including your technical depth, problem-solving approach, and communication skills. Is there anything else you'd like to add before we conclude?";
        }

        return "Thank you for sharing that. Can you tell me more?";
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
