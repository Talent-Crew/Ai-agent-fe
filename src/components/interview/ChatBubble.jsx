export default function ChatBubble({ message, isAI, isThinking = false }) {
    return (
        <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-6 animate-fade-in`}>
            <div className={`flex items-start space-x-3 max-w-3xl ${isAI ? '' : 'flex-row-reverse space-x-reverse'}`}>
                {/* Avatar */}
                <div
                    className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center shadow-md ${isAI ? 'bg-gradient-to-br from-[#6366F1] to-[#4F46E5]' : 'bg-gradient-to-br from-gray-700 to-gray-900'
                        }`}
                >
                    {isAI ? (
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    ) : (
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    )}
                </div>

                {/* Message Bubble */}
                <div
                    className={`px-5 py-3.5 rounded-2xl shadow-md ${isAI
                        ? 'bg-gray-800 border border-gray-700 text-gray-100'
                        : 'bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white'
                        }`}
                >
                    {isThinking ? (
                        <div className="flex items-center space-x-3 py-1">
                            <div className="flex space-x-1.5">
                                <div className="w-2 h-2 bg-[#6366F1] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-[#6366F1] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                <div className="w-2 h-2 bg-[#6366F1] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                            <span className="text-sm text-gray-400 font-medium">AI is analyzing...</span>
                        </div>
                    ) : (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
