import Badge from '../ui/Badge';

export default function CandidateRow({ candidate, onSelect, isSelected }) {
    const getScoreVariant = (score) => {
        if (score >= 80) return 'success';
        if (score >= 60) return 'warning';
        return 'danger';
    };

    return (
        <tr
            onClick={() => onSelect(candidate)}
            className={`cursor-pointer transition-colors ${isSelected ? 'bg-indigo-50' : 'hover:bg-slate-50'
                }`}
        >
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-slate-300 flex items-center justify-center">
                        <span className="text-sm font-medium text-slate-700">
                            {candidate.name.split(' ').map(n => n[0]).join('')}
                        </span>
                    </div>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-slate-900">{candidate.name}</div>
                        <div className="text-sm text-slate-500">{candidate.email}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-slate-900">{candidate.role}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <div className="text-sm font-semibold text-slate-900 mr-2">
                        {candidate.matchScore}%
                    </div>
                    <div className="w-20 bg-slate-200 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full ${candidate.matchScore >= 80
                                    ? 'bg-green-500'
                                    : candidate.matchScore >= 60
                                        ? 'bg-yellow-500'
                                        : 'bg-red-500'
                                }`}
                            style={{ width: `${candidate.matchScore}%` }}
                        />
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant={getScoreVariant(candidate.matchScore)}>
                    {candidate.status}
                </Badge>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                {candidate.interviewDate}
            </td>
        </tr>
    );
}
