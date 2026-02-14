import useSpeechToText from '../../hooks/useSpeechToText';

export default function InputController({ sessionId, token, onTextMessage, disabled }) {
  const { isSupported, error, isListening } = useSpeechToText({ sessionId, token, onTextMessage });

  return (
    <div className="border-t border-slate-200 bg-white shadow-lg px-6 py-5">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-4">
        <div className="flex items-center gap-3 text-slate-600">
          <div className={`flex items-center justify-center w-12 h-12 rounded-full ${isListening ? 'bg-green-100 text-green-600' : 'bg-indigo-100 text-indigo-600'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-slate-800">Voice interview</p>
            <p className="text-sm text-slate-500">
              {isListening
                ? 'Connected • Your mic is streaming to the interviewer'
                : 'The AI interviewer will speak to you. You can respond by speaking — no typing needed.'}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-3 text-sm text-red-600 flex items-center gap-2 bg-red-50 px-4 py-2 rounded-lg">
          <span>{error}</span>
        </div>
      )}

      {!isSupported && !error && (
        <div className="mt-4 max-w-4xl mx-auto text-sm text-slate-500 px-4 py-2">
          Voice interview requires a browser that supports microphone access.
        </div>
      )}

      {disabled && (
        <p className="mt-3 text-center text-sm text-slate-400">Interview has ended</p>
      )}
    </div>
  );
}
