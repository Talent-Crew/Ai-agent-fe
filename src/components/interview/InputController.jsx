import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function InputController({ onSend, disabled }) {
    const [input, setInput] = useState('');
    const [isVoiceMode, setIsVoiceMode] = useState(false);

    const handleSend = () => {
        if (input.trim()) {
            onSend(input);
            setInput('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="border-t border-slate-200 bg-white shadow-lg p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-end space-x-3">
                    <div className="flex-1">
                        <Input
                            placeholder="Type your response here..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={disabled}
                            multiline={true}
                            rows={2}
                            className="border-2 focus:ring-4 focus:ring-[#6366F1]/20"
                        />
                    </div>

                    {/* Voice Toggle Button */}
                    <Button
                        variant={isVoiceMode ? 'primary' : 'secondary'}
                        size="md"
                        onClick={() => setIsVoiceMode(!isVoiceMode)}
                        disabled={disabled}
                        className="px-4 h-[52px]"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                    </Button>

                    {/* Send Button */}
                    <Button
                        variant="primary"
                        size="md"
                        onClick={handleSend}
                        disabled={disabled || !input.trim()}
                        className="px-6 h-[52px] shadow-lg"
                    >
                        <div className="flex items-center space-x-2">
                            <span>Send</span>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </div>
                    </Button>
                </div>

                {isVoiceMode && (
                    <div className="mt-3 text-sm text-[#6366F1] flex items-center space-x-2 bg-indigo-50 px-4 py-2 rounded-lg">
                        <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">Voice-to-Text mode enabled (Feature coming soon)</span>
                    </div>
                )}
            </div>
        </div>
    );
}
