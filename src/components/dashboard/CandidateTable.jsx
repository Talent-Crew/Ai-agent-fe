import CandidateRow from './CandidateRow';
import Card from '../ui/Card';

export default function CandidateTable({ candidates, onSelectCandidate, selectedCandidate }) {
    return (
        <Card padding="none" className="overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">Recent Interviews</h2>
                <p className="text-sm text-slate-500 mt-1">
                    {candidates.length} candidates evaluated
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                Candidate
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                Match Score
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                                Interview Date
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {candidates.map((candidate) => (
                            <CandidateRow
                                key={candidate.id}
                                candidate={candidate}
                                onSelect={onSelectCandidate}
                                isSelected={selectedCandidate?.id === candidate.id}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
}
