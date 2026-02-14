import { Link } from 'react-router-dom';
import ProgressStepper from './ProgressStepper';
import Timer from './Timer';

export default function InterviewHeader({ stages, currentStage, startTime, hideProgress = false }) {
    return (
        <header className="bg-gradient-to-r from-[#6366F1] to-[#4F46E5] border-b border-[#4338CA] shadow-lg">
            <div className="max-w-7xl mx-auto px-6 py-5">
                <div className="flex items-center justify-between mb-6">
                    <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
                            <span className="text-[#6366F1] font-bold text-xl">TC</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-white">TalentCrew</h1>
                            <p className="text-xs text-blue-100">AI-Powered Interview</p>
                        </div>
                    </Link>

                    <div className="flex items-center space-x-4">
                        {!hideProgress && <Timer startTime={startTime} />}
                    </div>
                </div>

                {!hideProgress && <ProgressStepper stages={stages} currentStage={currentStage} />}
            </div>
        </header>
    );
}
