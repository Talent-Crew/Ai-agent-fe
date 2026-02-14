import Badge from '../ui/Badge';

export default function EvidenceCard({ evidence }) {
    return (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
                <Badge variant={evidence.type === 'strength' ? 'strength' : 'risk'} size="sm">
                    {evidence.type === 'strength' ? '✓ Strength' : '⚠ Risk'}
                </Badge>
                <span className="text-xs text-slate-500">{evidence.category}</span>
            </div>

            <blockquote className="mt-3 text-sm text-slate-700 italic border-l-4 border-indigo-300 pl-3">
                "{evidence.quote}"
            </blockquote>

            <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-slate-600 font-medium">{evidence.skill}</span>
                <div className="flex items-center space-x-1">
                    <span className="text-xs text-slate-500">Relevance:</span>
                    <span className="text-xs font-semibold text-indigo-600">{evidence.relevance}/10</span>
                </div>
            </div>
        </div>
    );
}
