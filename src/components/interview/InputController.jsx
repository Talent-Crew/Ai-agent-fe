import { useState } from 'react';
import Button from '../ui/Button';

export default function InputController({ onSend, disabled }) {
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);

    const handleStartRecording = () => {
        setIsRecording(true);
        setRecordingTime(0);
        // TODO: Start actual voice recording
        const interval = setInterval(() => {
            setRecordingTime(prev => prev + 1);
        }, 1000);

        // Store interval ID
        window.recordingInterval = interval;
    };

    const handleStopRecording = () => {
        setIsRecording(false);
        clearInterval(window.recordingInterval);

        // TODO: Process voice recording and convert to text
        // For now, simulate with a sample response
        const sampleResponse = "This is a simulated voice response. In production, this would be the transcribed audio from the candidate's voice recording.";
        onSend(sampleResponse);
        setRecordingTime(0);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm shadow-lg p-6">
            <div className="max-w-4xl mx-auto">
                {/* Voice Recording Interface */}
                <div className="flex flex-col items-center space-y-4">
                    {isRecording ? (
                        <>
                            {/* Recording Active */}
                            <div className="flex flex-col items-center space-y-3">
                                <div className="relative">
                                    <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center animate-pulse shadow-xl">
                                        <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="absolute inset-0 w-24 h-24 bg-red-500 rounded-full animate-ping opacity-20"></div>
                                </div>

                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white mb-1">{formatTime(recordingTime)}</div>
                                    <div className="text-sm text-gray-400">Recording your response...</div>
                                </div>
                            </div>

                            <Button
                                onClick={handleStopRecording}
                                disabled={disabled}
                                className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 text-lg font-semibold"
                            >
                                <svg className="w-6 h-6 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                                </svg>
                                Stop Recording
                            </Button>
                        </>
                    ) : (
                        <>
                            {/* Ready to Record */}
                            <div className="flex flex-col items-center space-y-3">
                                <div className="w-24 h-24 bg-[#6366F1] rounded-full flex items-center justify-center shadow-xl hover:bg-[#4F46E5] transition-colors cursor-pointer"
                                    onClick={!disabled ? handleStartRecording : undefined}
                                >
                                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                                    </svg>
                                </div>

                                <div className="text-center">
                                    <div className="text-lg font-semibold text-white mb-1">Click to Record</div>
                                    <div className="text-sm text-gray-400">Press and speak your answer</div>
                                </div>
                            </div>

                            <Button
                                onClick={handleStartRecording}
                                disabled={disabled}
                                className="bg-[#6366F1] hover:bg-[#4F46E5] text-white px-8 py-3 text-lg font-semibold"
                            >
                                <svg className="w-6 h-6 mr-2 inline" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                                </svg>
                                Start Recording
                            </Button>
                        </>
                    )}

                    <div className="text-center text-xs text-gray-500 mt-4 bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700">
                        <svg className="w-4 h-4 inline mr-1 text-[#6366F1]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        Voice recording will be transcribed automatically
                    </div>
                </div>
            </div>
        </div>
    );
}
