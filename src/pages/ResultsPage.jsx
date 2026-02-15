import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function ResultsPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [scorecard, setScorecard] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState(null);

    useEffect(() => {
        if (location.state?.scorecard) {
            setScorecard(location.state.scorecard);
        } else {
            // If no scorecard data, redirect to home
            navigate('/');
        }
    }, [location, navigate]);

    const handleDownloadPDF = async () => {
        if (!scorecard?.id) {
            setDownloadError('Session ID not found');
            return;
        }

        setIsDownloading(true);
        setDownloadError(null);

        try {
            const pdfBlob = await api.downloadPDF(scorecard.id);

            // Create a blob URL and trigger download
            const blobUrl = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `Interview_Scorecard_${scorecard.candidate?.replace(/\s+/g, '_') || 'Candidate'}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('PDF download failed:', error);
            setDownloadError(error.message || 'Failed to download PDF');
        } finally {
            setIsDownloading(false);
        }
    };

    if (!scorecard) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
                <div className="text-white text-xl">Loading results...</div>
            </div>
        );
    }

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getScoreGradient = (score) => {
        if (score >= 80) return 'from-green-500 to-emerald-600';
        if (score >= 60) return 'from-yellow-500 to-orange-600';
        return 'from-red-500 to-rose-600';
    };

    const getResultBadge = (result) => {
        const badges = {
            'HIRE': { text: 'HIRE', color: 'bg-green-500', icon: '✓' },
            'MAYBE': { text: 'MAYBE', color: 'bg-yellow-500', icon: '?' },
            'NO_HIRE': { text: 'NO HIRE', color: 'bg-red-500', icon: '✗' },
            'REJECT': { text: 'REJECT', color: 'bg-red-600', icon: '✗' }
        };
        return badges[result] || badges['MAYBE'];
    };

    const badge = getResultBadge(scorecard.result_summary);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-white mb-4">Interview Results</h1>
                    <p className="text-gray-400 text-lg">Candidate: <span className="text-white font-semibold">{scorecard.candidate}</span></p>
                </div>

                {/* Score Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* Overall Score */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-2xl">
                        <h2 className="text-gray-400 text-sm uppercase tracking-wider mb-4">Overall Score</h2>
                        <div className={`text-7xl font-bold bg-gradient-to-r ${getScoreGradient(scorecard.overall_score)} bg-clip-text text-transparent mb-2`}>
                            {scorecard.overall_score}
                        </div>
                        <div className="text-gray-500 text-lg">out of 100</div>

                        {/* Progress Bar */}
                        <div className="mt-6 h-3 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className={`h-full bg-gradient-to-r ${getScoreGradient(scorecard.overall_score)} transition-all duration-1000`}
                                style={{ width: `${scorecard.overall_score}%` }}
                            />
                        </div>
                    </div>

                    {/* Result Summary */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-2xl flex flex-col items-center justify-center">
                        <h2 className="text-gray-400 text-sm uppercase tracking-wider mb-6">Recommendation</h2>
                        <div className={`${badge.color} text-white px-8 py-4 rounded-full text-3xl font-bold shadow-lg flex items-center space-x-3`}>
                            <span className="text-4xl">{badge.icon}</span>
                            <span>{badge.text}</span>
                        </div>
                    </div>
                </div>

                {/* Top Weaknesses */}
                {scorecard.top_weaknesses && scorecard.top_weaknesses.length > 0 && (
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-2xl mb-8">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <span className="text-red-400 mr-3">⚠️</span>
                            Areas for Improvement
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {scorecard.top_weaknesses.map((weakness, idx) => (
                                <span
                                    key={idx}
                                    className="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm"
                                >
                                    {weakness}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Timeline - Q&A Details */}
                {scorecard.timeline && scorecard.timeline.length > 0 && (
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 shadow-2xl">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                            <span className="text-blue-400 mr-3">📋</span>
                            Detailed Analysis
                        </h2>

                        <div className="space-y-6">
                            {scorecard.timeline.map((item, idx) => (
                                <div key={item.id || idx} className="bg-gray-900/50 rounded-xl p-6 border border-gray-700">
                                    {/* Question Header */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <span className="text-blue-400 font-bold text-lg">Q{idx + 1}</span>
                                                <h3 className="text-white font-semibold text-lg">{item.question}</h3>
                                            </div>
                                        </div>
                                        <div className={`ml-4 px-4 py-2 rounded-lg font-bold text-2xl ${getScoreColor(item.score * 10)}`}>
                                            {item.score}/10
                                        </div>
                                    </div>

                                    {/* Answer */}
                                    <div className="mb-4">
                                        <h4 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Candidate's Answer</h4>
                                        <p className="text-gray-300 leading-relaxed bg-gray-800/50 p-4 rounded-lg">
                                            {item.answer}
                                        </p>
                                    </div>

                                    {/* Critique */}
                                    <div className="mb-4">
                                        <h4 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Feedback</h4>
                                        <p className="text-yellow-300 leading-relaxed bg-yellow-900/20 p-4 rounded-lg border border-yellow-700/30">
                                            {item.critique}
                                        </p>
                                    </div>

                                    {/* Ideal Answer */}
                                    {item.ideal_answer && (
                                        <div className="mb-4">
                                            <h4 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Ideal Answer</h4>
                                            <p className="text-green-300 leading-relaxed bg-green-900/20 p-4 rounded-lg border border-green-700/30">
                                                {item.ideal_answer}
                                            </p>
                                        </div>
                                    )}

                                    {/* Concepts Missed */}
                                    {item.concepts_missed && item.concepts_missed.length > 0 && (
                                        <div>
                                            <h4 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Concepts Missed</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {item.concepts_missed.map((concept, cIdx) => (
                                                    <span
                                                        key={cIdx}
                                                        className="px-3 py-1 bg-orange-500/20 border border-orange-500/50 rounded-md text-orange-300 text-xs"
                                                    >
                                                        {concept}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="mt-12 flex flex-col items-center">
                    {downloadError && (
                        <div className="mb-4 px-6 py-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                            {downloadError}
                        </div>
                    )}
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={() => navigate('/')}
                            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold text-lg shadow-lg transition-all transform hover:scale-105"
                        >
                            Back to Home
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl font-semibold text-lg shadow-lg transition-all transform hover:scale-105"
                        >
                            Print Results
                        </button>
                        <button
                            onClick={handleDownloadPDF}
                            disabled={isDownloading}
                            className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-xl font-semibold text-lg shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                            {isDownloading ? (
                                <>
                                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <span>Downloading...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 16v-4m0 0V8m0 4H8m0 0h4m4 0h-4m4 0v4m0 0v-4m0 4h4" />
                                    </svg>
                                    <span>Download PDF</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
