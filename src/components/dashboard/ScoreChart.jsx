export default function ScoreChart({ scores }) {
    const maxScore = 10;

    return (
        <div className="w-full h-80 relative">
            {/* Placeholder Radar Chart */}
            <div className="absolute inset-0 flex items-center justify-center">
                <svg viewBox="0 0 400 400" className="w-full h-full">
                    {/* Background grid */}
                    {[1, 2, 3, 4, 5].map((level) => {
                        const radius = (level * 60) / 5;
                        const points = scores
                            .map((_, i) => {
                                const angle = (Math.PI * 2 * i) / scores.length - Math.PI / 2;
                                const x = 200 + radius * Math.cos(angle);
                                const y = 200 + radius * Math.sin(angle);
                                return `${x},${y}`;
                            })
                            .join(' ');

                        return (
                            <polygon
                                key={level}
                                points={points}
                                fill="none"
                                stroke="#e2e8f0"
                                strokeWidth="1"
                            />
                        );
                    })}

                    {/* Axes */}
                    {scores.map((score, i) => {
                        const angle = (Math.PI * 2 * i) / scores.length - Math.PI / 2;
                        const x = 200 + 70 * Math.cos(angle);
                        const y = 200 + 70 * Math.sin(angle);
                        return (
                            <line
                                key={`axis-${i}`}
                                x1="200"
                                y1="200"
                                x2={x}
                                y2={y}
                                stroke="#cbd5e1"
                                strokeWidth="1"
                            />
                        );
                    })}

                    {/* Data polygon */}
                    <polygon
                        points={scores
                            .map((score, i) => {
                                const angle = (Math.PI * 2 * i) / scores.length - Math.PI / 2;
                                const radius = (score.value * 60) / maxScore;
                                const x = 200 + radius * Math.cos(angle);
                                const y = 200 + radius * Math.sin(angle);
                                return `${x},${y}`;
                            })
                            .join(' ')}
                        fill="rgba(79, 70, 229, 0.2)"
                        stroke="rgba(79, 70, 229, 1)"
                        strokeWidth="2"
                    />

                    {/* Data points */}
                    {scores.map((score, i) => {
                        const angle = (Math.PI * 2 * i) / scores.length - Math.PI / 2;
                        const radius = (score.value * 60) / maxScore;
                        const x = 200 + radius * Math.cos(angle);
                        const y = 200 + radius * Math.sin(angle);
                        return (
                            <circle
                                key={`point-${i}`}
                                cx={x}
                                cy={y}
                                r="4"
                                fill="#4f46e5"
                            />
                        );
                    })}

                    {/* Labels */}
                    {scores.map((score, i) => {
                        const angle = (Math.PI * 2 * i) / scores.length - Math.PI / 2;
                        const x = 200 + 90 * Math.cos(angle);
                        const y = 200 + 90 * Math.sin(angle);
                        return (
                            <text
                                key={`label-${i}`}
                                x={x}
                                y={y}
                                textAnchor="middle"
                                className="text-xs fill-slate-700 font-medium"
                            >
                                {score.skill}
                            </text>
                        );
                    })}
                </svg>
            </div>

            {/* Legend */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-6 text-xs">
                {scores.map((score) => (
                    <div key={score.skill} className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                        <span className="text-slate-600">
                            {score.skill}: {score.value}/{maxScore}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
