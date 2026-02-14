import { useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';

export default function ChatContainer({ messages, isThinking }) {
    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages, isThinking]);

    return (
        <div
            ref={containerRef}
            className="flex-1 overflow-y-auto p-8 bg-gradient-to-b from-slate-50 to-slate-100"
            style={{ maxHeight: 'calc(100vh - 280px)' }}
        >
            <div className="max-w-4xl mx-auto">
                {messages.map((msg, index) => (
                    <ChatBubble
                        key={index}
                        message={msg.content}
                        isAI={msg.role === 'ai'}
                    />
                ))}
                {isThinking && <ChatBubble isAI={true} isThinking={true} />}
            </div>
        </div>
    );
}
