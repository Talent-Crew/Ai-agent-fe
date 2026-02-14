import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../components/ui/Button';

// Dummy data (same as in RecruiterDashboard)
const dummyInterviews = [
    {
        id: 'demo-1',
        name: 'Sarah Mitchell',
        email: 'sarah.mitchell@email.com',
        role: 'Frontend',
        experience: '5 years',
        keySkills: 'React, TypeScript, Tailwind CSS',
        completedAt: '2026-02-13T14:30:00.000Z',
        verdict: 'Hire',
        scores: { technical: 9, communication: 8, overall: 9 },
        strengths: [
            {
                title: 'Strong Technical Foundation',
                description: 'Demonstrated excellent understanding of React patterns and modern frontend architecture.',
                evidence: 'I implemented a micro-frontend architecture using Module Federation, which improved our deployment...'
            },
            {
                title: 'Problem-Solving Skills',
                description: 'Showed analytical thinking and systematic approach to debugging.',
                evidence: 'When we had performance issues, I used React DevTools profiler to identify unnecessary re-renders...'
            }
        ],
        risks: [],
        followUpQuestions: [
            'Can you walk us through a complex state management challenge you\'ve solved?',
            'How do you approach accessibility in your frontend projects?'
        ],
        messages: [
            { role: 'ai', content: 'Hello Sarah! Tell me about a challenging technical problem you\'ve solved recently.' },
            { role: 'user', content: 'I implemented a micro-frontend architecture using Module Federation, which improved our deployment flexibility and allowed teams to work independently on different parts of the application.' }
        ]
    },
    {
        id: 'demo-2',
        name: 'Michael Chen',
        email: 'michael.chen@email.com',
        role: 'Backend',
        experience: '3 years',
        keySkills: 'Node.js, PostgreSQL, AWS',
        completedAt: '2026-02-12T10:15:00.000Z',
        verdict: 'Requires Human Interview',
        scores: { technical: 7, communication: 6, overall: 7 },
        strengths: [
            {
                title: 'Database Optimization',
                description: 'Shows good understanding of database performance tuning.',
                evidence: 'I optimized several slow queries by adding proper indexes and restructuring the joins...'
            }
        ],
        risks: [
            {
                title: 'Limited Detail in Responses',
                description: 'Some answers lacked specific examples and metrics.',
                evidence: 'I worked on improving API performance.'
            },
            {
                title: 'Communication Clarity',
                description: 'Could benefit from more structured explanations of technical concepts.',
                evidence: null
            }
        ],
        followUpQuestions: [
            'Can you provide specific metrics on the performance improvements you achieved?',
            'How do you handle API versioning and breaking changes?',
            'Tell us about your experience with microservices architecture.'
        ],
        messages: [
            { role: 'ai', content: 'Hello Michael! Tell me about your experience with API design.' },
            { role: 'user', content: 'I worked on improving API performance.' }
        ]
    },
    {
        id: 'demo-3',
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@email.com',
        role: 'Cloud Services',
        experience: '7 years',
        keySkills: 'AWS, Kubernetes, Terraform',
        completedAt: '2026-02-11T16:45:00.000Z',
        verdict: 'Hire',
        scores: { technical: 10, communication: 9, overall: 10 },
        strengths: [
            {
                title: 'Cloud Architecture Expertise',
                description: 'Exceptional knowledge of cloud infrastructure and best practices.',
                evidence: 'I designed a multi-region AWS architecture with automatic failover that achieved 99.99% uptime...'
            },
            {
                title: 'Cost Optimization',
                description: 'Proven track record of reducing cloud costs while improving performance.',
                evidence: 'By implementing spot instances and right-sizing our EC2 fleet, I reduced our monthly AWS bill by 40%...'
            },
            {
                title: 'Excellent Communication',
                description: 'Clearly explains complex technical concepts and trade-offs.',
                evidence: null
            }
        ],
        risks: [],
        followUpQuestions: [
            'Can you describe your experience with disaster recovery planning?',
            'How do you approach cloud security and compliance?'
        ],
        messages: [
            { role: 'ai', content: 'Hello Emily! Tell me about your cloud infrastructure experience.' },
            { role: 'user', content: 'I designed a multi-region AWS architecture with automatic failover that achieved 99.99% uptime. The system uses Route53 for DNS failover, RDS with cross-region replication, and S3 for static assets with CloudFront distribution.' }
        ]
    },
    {
        id: 'demo-4',
        name: 'David Kim',
        email: 'david.kim@email.com',
        role: 'DBMS',
        experience: '2 years',
        keySkills: 'MySQL, MongoDB, Redis',
        completedAt: '2026-02-10T09:20:00.000Z',
        verdict: 'No Hire',
        scores: { technical: 4, communication: 5, overall: 5 },
        strengths: [],
        risks: [
            {
                title: 'Limited Technical Depth',
                description: 'Responses showed basic understanding but lacked advanced knowledge.',
                evidence: 'I use indexes to make queries faster.'
            },
            {
                title: 'Insufficient Detail',
                description: 'Most answers were brief without specific examples or metrics.',
                evidence: null
            },
            {
                title: 'Lack of Best Practices',
                description: 'Did not mention industry standard approaches or methodologies.',
                evidence: null
            }
        ],
        followUpQuestions: [
            'The candidate may need additional training in database design principles.',
            'Consider junior-level positions or mentorship programs.'
        ],
        messages: [
            { role: 'ai', content: 'Hello David! Tell me about your experience with database optimization.' },
            { role: 'user', content: 'I use indexes to make queries faster.' }
        ]
    },
    {
        id: 'demo-5',
        name: 'Jessica Parker',
        email: 'jessica.parker@email.com',
        role: 'Frontend',
        experience: '4 years',
        keySkills: 'Vue.js, JavaScript, CSS',
        completedAt: '2026-02-09T13:00:00.000Z',
        verdict: 'Requires Human Interview',
        scores: { technical: 7, communication: 7, overall: 7 },
        strengths: [
            {
                title: 'UI/UX Focus',
                description: 'Strong attention to user experience and design implementation.',
                evidence: 'I collaborated closely with designers to ensure pixel-perfect implementation and smooth animations...'
            }
        ],
        risks: [
            {
                title: 'Framework-Specific Experience',
                description: 'Primary experience with Vue.js, team uses React primarily.',
                evidence: 'I\'ve mostly worked with Vue.js but I\'m open to learning React.'
            }
        ],
        followUpQuestions: [
            'How quickly can you transition from Vue.js to React?',
            'Do you have any React projects in your portfolio?',
            'What\'s your experience with TypeScript?'
        ],
        messages: [
            { role: 'ai', content: 'Hello Jessica! Tell me about your frontend development experience.' },
            { role: 'user', content: 'I\'ve worked extensively with Vue.js, building responsive SPAs with Vuex for state management.' }
        ]
    }
];

export default function CandidateScorecard() {
    const { id } = useParams();
    const [candidate, setCandidate] = useState(null);

    useEffect(() => {
        // Combine dummy data with real interviews from localStorage
        const stored = localStorage.getItem('interviewResults');
        const realInterviews = stored ? JSON.parse(stored) : [];
        const allCandidates = [...dummyInterviews, ...realInterviews];

        const found = allCandidates.find(c => c.id === id);
        setCandidate(found);
    }, [id]);

    if (!candidate) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6366F1] mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading candidate data...</p>
                </div>
            </div>
        );
    }

    const getVerdictColor = (verdict) => {
        if (verdict === 'Hire') return 'text-green-400 bg-green-900/20 border-green-700';
        if (verdict === 'No Hire') return 'text-red-400 bg-red-900/20 border-red-700';
        return 'text-yellow-400 bg-yellow-900/20 border-yellow-700';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
            {/* Header */}
            <header className="bg-gradient-to-r from-[#6366F1] to-[#4F46E5] border-b border-[#4338CA] shadow-lg">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link to="/recruiter" className="p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </Link>
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                                <span className="text-[#6366F1] font-bold text-xl">TC</span>
                            </div>
                            <div className="flex flex-col justify-center">
                                <h1 className="text-2xl font-bold text-white leading-tight">Interview Scorecard</h1>
                                <p className="text-sm text-blue-100 mt-0.5">{candidate.name} - {candidate.role}</p>
                            </div>
                        </div>
                        <div></div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Candidate Info */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                            <div className="text-gray-400 text-sm mb-1">Name</div>
                            <div className="text-white font-medium">{candidate.name}</div>
                        </div>
                        <div>
                            <div className="text-gray-400 text-sm mb-1">Email</div>
                            <div className="text-white font-medium">{candidate.email}</div>
                        </div>
                        <div>
                            <div className="text-gray-400 text-sm mb-1">Role</div>
                            <div className="text-white font-medium">{candidate.role}</div>
                        </div>
                        <div>
                            <div className="text-gray-400 text-sm mb-1">Experience</div>
                            <div className="text-white font-medium">{candidate.experience}</div>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-700">
                        <div className="text-gray-400 text-sm mb-1">Key Skills</div>
                        <div className="text-white">{candidate.keySkills}</div>
                    </div>
                </div>

                {/* Verdict */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-6">
                    <h2 className="text-xl font-bold text-white mb-4">Hiring Recommendation</h2>
                    <div className="flex items-center space-x-4">
                        <span className={`inline-flex px-6 py-3 rounded-lg text-lg font-bold border ${getVerdictColor(candidate.verdict)}`}>
                            {candidate.verdict}
                        </span>
                        <div className="text-gray-400 text-sm">
                            Interview completed on {new Date(candidate.completedAt).toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* Scores */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                        <div className="text-gray-400 text-sm mb-2">Technical Skills</div>
                        <div className="flex items-end space-x-2">
                            <div className="text-4xl font-bold text-[#6366F1]">{candidate.scores.technical}</div>
                            <div className="text-gray-500 mb-1">/10</div>
                        </div>
                        <div className="mt-3 bg-gray-900 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-[#6366F1] to-[#4F46E5] h-full transition-all duration-500"
                                style={{ width: `${candidate.scores.technical * 10}%` }}
                            ></div>
                        </div>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                        <div className="text-gray-400 text-sm mb-2">Communication</div>
                        <div className="flex items-end space-x-2">
                            <div className="text-4xl font-bold text-[#6366F1]">{candidate.scores.communication}</div>
                            <div className="text-gray-500 mb-1">/10</div>
                        </div>
                        <div className="mt-3 bg-gray-900 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-[#6366F1] to-[#4F46E5] h-full transition-all duration-500"
                                style={{ width: `${candidate.scores.communication * 10}%` }}
                            ></div>
                        </div>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                        <div className="text-gray-400 text-sm mb-2">Overall Score</div>
                        <div className="flex items-end space-x-2">
                            <div className="text-4xl font-bold text-[#6366F1]">{candidate.scores.overall}</div>
                            <div className="text-gray-500 mb-1">/10</div>
                        </div>
                        <div className="mt-3 bg-gray-900 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-gradient-to-r from-[#6366F1] to-[#4F46E5] h-full transition-all duration-500"
                                style={{ width: `${candidate.scores.overall * 10}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Strengths */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                        <svg className="w-6 h-6 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Key Strengths
                    </h2>
                    <div className="space-y-4">
                        {candidate.strengths.map((strength, index) => (
                            <div key={index} className="border-l-4 border-green-500 pl-4 py-2 bg-green-900/10">
                                <div className="font-semibold text-white mb-1">{strength.title}</div>
                                <div className="text-gray-400 text-sm mb-2">{strength.description}</div>
                                {strength.evidence && (
                                    <div className="bg-gray-900/50 border border-gray-700 rounded p-3 text-sm">
                                        <div className="text-gray-500 text-xs mb-1">Evidence:</div>
                                        <div className="text-gray-300 italic">"{strength.evidence}"</div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Risks/Concerns */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                        <svg className="w-6 h-6 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        Risks & Concerns
                    </h2>
                    {candidate.risks.length > 0 ? (
                        <div className="space-y-4">
                            {candidate.risks.map((risk, index) => (
                                <div key={index} className="border-l-4 border-yellow-500 pl-4 py-2 bg-yellow-900/10">
                                    <div className="font-semibold text-white mb-1">{risk.title}</div>
                                    <div className="text-gray-400 text-sm mb-2">{risk.description}</div>
                                    {risk.evidence && (
                                        <div className="bg-gray-900/50 border border-gray-700 rounded p-3 text-sm">
                                            <div className="text-gray-500 text-xs mb-1">Evidence:</div>
                                            <div className="text-gray-300 italic">"{risk.evidence}"</div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-gray-400 text-sm">No significant risks or concerns identified.</div>
                    )}
                </div>

                {/* Follow-up Questions */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                        <svg className="w-6 h-6 text-[#6366F1] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Suggested Follow-up Questions
                    </h2>
                    <ul className="space-y-3">
                        {candidate.followUpQuestions.map((question, index) => (
                            <li key={index} className="flex items-start space-x-3">
                                <span className="flex-shrink-0 w-6 h-6 bg-[#6366F1] rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    {index + 1}
                                </span>
                                <span className="text-gray-300">{question}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Interview Transcript */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                        <svg className="w-6 h-6 text-[#6366F1] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Interview Transcript
                    </h2>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                        {candidate.messages.map((message, index) => (
                            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-lg px-4 py-3 ${message.role === 'user'
                                    ? 'bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white'
                                    : 'bg-gray-900 text-gray-300 border border-gray-700'
                                    }`}>
                                    <div className="text-xs opacity-70 mb-1">
                                        {message.role === 'user' ? 'Candidate' : 'AI Interviewer'}
                                    </div>
                                    <div className="whitespace-pre-wrap">{message.content}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
