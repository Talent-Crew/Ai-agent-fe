export default function ProgressStepper({ stages, currentStage }) {
    return (
        <div className="flex items-center justify-center space-x-2">
            {stages.map((stage, index) => {
                const isActive = index === currentStage;
                const isCompleted = index < currentStage;

                return (
                    <div key={stage} className="flex items-center">
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-11 h-11 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 shadow-lg ${isActive
                                    ? 'bg-[#6366F1] text-white ring-4 ring-[#6366F1]/30 scale-110'
                                    : isCompleted
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-700 text-gray-400 backdrop-blur-sm'
                                    }`}
                            >
                                {isCompleted ? (
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    index + 1
                                )}
                            </div>
                            <span className={`mt-2 text-xs font-semibold transition-all ${isActive ? 'text-white scale-105' : 'text-gray-400'}`}>
                                {stage}
                            </span>
                        </div>
                        {index < stages.length - 1 && (
                            <div
                                className={`w-16 h-1 mx-2 rounded-full transition-all duration-300 ${isCompleted ? 'bg-green-500 shadow-glow' : 'bg-gray-700'
                                    }`}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
