export default function ScorecardView({ candidate, onBack }) {
    if (!candidate) return null;

    const getVerdictColor = (verdict) => {
        if (verdict === 'Hire') return 'text-green-400 bg-green-900/20 border-green-700';
        if (verdict === 'No Hire') return 'text-red-400 bg-red-900/20 border-red-700';
        return 'text-yellow-400 bg-yellow-900/20 border-yellow-700';
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Candidate Info Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div>
                        <p className="text-gray-400 text-sm mb-1">Full Name</p>
                        <p className="text-white font-medium">{candidate.name}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm mb-1">Email</p>
                        <p className="text-white font-medium">{candidate.email}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm mb-1">Role</p>
                        <p className="text-white font-medium">{candidate.role}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm mb-1">Experience</p>
                        <p className="text-white font-medium">{candidate.experience}</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-gray-400 text-sm mb-1">Key Skills</p>
                        <p className="text-white font-medium">{candidate.keySkills}</p>
                    </div>
                </div>
            </div>

            {/* Verdict Card */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-white mb-2">AI Verdict</h2>
                        <p className="text-gray-400">Recommendation based on interview analysis</p>
                    </div>
                    <div className={`px-6 py-3 rounded-xl border-2 font-bold text-lg ${getVerdictColor(candidate.verdict)}`}>
                        {candidate.verdict}
                    </div>
                </div>
            </div>

            {/* Scores */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                    <h3 className="text-gray-400 text-sm mb-2">Technical Score</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-blue-400">{candidate.scores.technical}</span>
                        <span className="text-gray-500 text-xl mb-1">/10</span>
                    </div>
                    <div className="mt-3 bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${(candidate.scores.technical / 10) * 100}%` }}
                        ></div>
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                    <h3 className="text-gray-400 text-sm mb-2">Communication Score</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-purple-400">{candidate.scores.communication}</span>
                        <span className="text-gray-500 text-xl mb-1">/10</span>
                    </div>
                    <div className="mt-3 bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-purple-500 h-2 rounded-full transition-all"
                            style={{ width: `${(candidate.scores.communication / 10) * 100}%` }}
                        ></div>
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                    <h3 className="text-gray-400 text-sm mb-2">Overall Score</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-4xl font-bold text-[#6366F1]">{candidate.scores.overall}</span>
                        <span className="text-gray-500 text-xl mb-1">/10</span>
                    </div>
                    <div className="mt-3 bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-[#6366F1] h-2 rounded-full transition-all"
                            style={{ width: `${(candidate.scores.overall / 10) * 100}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Strengths */}
            {candidate.strengths && candidate.strengths.length > 0 && (
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-6">
                    <div className="flex items-center mb-4">
                        <svg className="w-6 h-6 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="text-xl font-semibold text-white">Strengths</h2>
                    </div>
                    <div className="space-y-4">
                        {candidate.strengths.map((strength, index) => (
                            <div key={index} className="bg-gray-900/30 rounded-lg p-4">
                                <h3 className="text-green-400 font-semibold mb-2">{strength.title}</h3>
                                <p className="text-gray-300 mb-2">{strength.description}</p>
                                {strength.evidence && (
                                    <div className="bg-gray-900/50 border-l-4 border-green-500/50 pl-4 py-2 mt-3">
                                        <p className="text-gray-400 text-sm italic">"{strength.evidence}"</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Risks */}
            {candidate.risks && candidate.risks.length > 0 && (
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-6">
                    <div className="flex items-center mb-4">
                        <svg className="w-6 h-6 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <h2 className="text-xl font-semibold text-white">Areas of Concern</h2>
                    </div>
                    <div className="space-y-4">
                        {candidate.risks.map((risk, index) => (
                            <div key={index} className="bg-gray-900/30 rounded-lg p-4">
                                <h3 className="text-yellow-400 font-semibold mb-2">{risk.title}</h3>
                                <p className="text-gray-300 mb-2">{risk.description}</p>
                                {risk.evidence && (
                                    <div className="bg-gray-900/50 border-l-4 border-yellow-500/50 pl-4 py-2 mt-3">
                                        <p className="text-gray-400 text-sm italic">"{risk.evidence}"</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Follow-up Questions */}
            {candidate.followUpQuestions && candidate.followUpQuestions.length > 0 && (
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-6">
                    <div className="flex items-center mb-4">
                        <svg className="w-6 h-6 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h2 className="text-xl font-semibold text-white">Recommended Follow-up Questions</h2>
                    </div>
                    <ul className="space-y-2">
                        {candidate.followUpQuestions.map((question, index) => (
                            <li key={index} className="flex items-start">
                                <span className="text-blue-400 mr-3 mt-1">•</span>
                                <span className="text-gray-300">{question}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Interview Transcript */}
            {candidate.messages && candidate.messages.length > 0 && (
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Interview Transcript</h2>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {candidate.messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg p-4 ${message.role === 'user'
                                        ? 'bg-[#6366F1] text-white'
                                        : 'bg-gray-700 text-gray-100'
                                        }`}
                                >
                                    <p className="text-sm mb-1 opacity-75">
                                        {message.role === 'user' ? 'Candidate' : 'AI Interviewer'}
                                    </p>
                                    <p>{message.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
