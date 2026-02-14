import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import ScoreChart from './ScoreChart';
import EvidenceCard from './EvidenceCard';

export default function ScorecardView({ candidate }) {
    if (!candidate) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-slate-900">No candidate selected</h3>
                    <p className="mt-1 text-sm text-slate-500">Select a candidate to view their scorecard</p>
                </div>
            </div>
        );
    }

    const getRecommendation = (score) => {
        if (score >= 80) return { text: 'Strong Hire', variant: 'success' };
        if (score >= 60) return { text: 'Consider', variant: 'warning' };
        return { text: 'No Hire', variant: 'danger' };
    };

    const recommendation = getRecommendation(candidate.matchScore);

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card>
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-full bg-slate-300 flex items-center justify-center">
                            <span className="text-2xl font-medium text-slate-700">
                                {candidate.name.split(' ').map(n => n[0]).join('')}
                            </span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">{candidate.name}</h2>
                            <p className="text-slate-600">{candidate.role}</p>
                            <p className="text-sm text-slate-500 mt-1">{candidate.email}</p>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="text-4xl font-bold text-indigo-600">{candidate.matchScore}%</div>
                        <p className="text-sm text-slate-500 mt-1">Match Score</p>
                        <Badge variant={recommendation.variant} size="lg" className="mt-2">
                            {recommendation.text}
                        </Badge>
                    </div>
                </div>
            </Card>

            {/* Skills Radar Chart */}
            <Card>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Skills Assessment</h3>
                <ScoreChart scores={candidate.scores} />
            </Card>

            {/* Evidence Snippets */}
            <Card>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Evidence from Interview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {candidate.evidence.map((evidence, index) => (
                        <EvidenceCard key={index} evidence={evidence} />
                    ))}
                </div>
            </Card>

            {/* Verdict Actions */}
            <Card>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Hiring Decision</h3>

                <div className="bg-slate-50 rounded-lg p-4 mb-6">
                    <div className="flex items-start space-x-3">
                        <svg className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <div>
                            <h4 className="font-semibold text-slate-900">AI Recommendation</h4>
                            <p className="text-sm text-slate-600 mt-1">
                                {candidate.matchScore >= 80
                                    ? 'This candidate demonstrates strong alignment with role requirements across technical skills, communication, and problem-solving abilities. Recommend proceeding to final interview round.'
                                    : candidate.matchScore >= 60
                                        ? 'This candidate shows potential but has some areas requiring development. Consider for roles with mentorship opportunities or request additional screening.'
                                        : 'This candidate does not meet minimum requirements for this position based on current assessment.'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex space-x-4">
                    <Button variant="success" size="lg" className="flex-1">
                        <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Move to Next Round
                    </Button>
                    <Button variant="secondary" size="lg" className="flex-1">
                        <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Request Follow-up
                    </Button>
                    <Button variant="danger" size="lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </Button>
                </div>
            </Card>
        </div>
    );
}
