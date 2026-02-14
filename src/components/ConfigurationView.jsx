import { useState, useEffect } from 'react';

const DEFAULT_QUESTIONS = {
    'Frontend': [
        "How do you approach performance optimization in web applications? Can you give a specific example?",
        "Describe your experience with state management. What patterns or libraries do you prefer and why?",
        "Tell me about a time when you had to ensure cross-browser compatibility. What challenges did you face?"
    ],
    'Backend': [
        "How do you design APIs for scalability? Walk me through your thought process.",
        "Describe a situation where you had to optimize database queries. What was your approach?",
        "Tell me about your experience with microservices architecture. What are the key considerations?"
    ],
    'DBMS': [
        "How do you approach database schema design for a new application? What factors do you consider?",
        "Describe a time when you had to troubleshoot a performance issue in a database. What was your methodology?",
        "Tell me about your experience with database replication and sharding strategies."
    ],
    'Cloud Services': [
        "How do you design cloud infrastructure for high availability? Can you give an example?",
        "Describe your approach to cloud cost optimization. What strategies have you implemented?",
        "Tell me about your experience with containerization and orchestration. What challenges have you solved?"
    ]
};

export default function ConfigurationView() {
    const [selectedRole, setSelectedRole] = useState('Frontend');
    const [questions, setQuestions] = useState({});
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingText, setEditingText] = useState('');
    const [newQuestion, setNewQuestion] = useState('');
    const [saveStatus, setSaveStatus] = useState('');
    const [companyDetails, setCompanyDetails] = useState('');
    const [productServiceDetails, setProductServiceDetails] = useState('');

    useEffect(() => {
        const stored = localStorage.getItem('customInterviewQuestions');
        if (stored) {
            setQuestions(JSON.parse(stored));
        } else {
            setQuestions(DEFAULT_QUESTIONS);
        }

        const savedCompanyDetails = localStorage.getItem('companyDetails');
        if (savedCompanyDetails) {
            setCompanyDetails(savedCompanyDetails);
        }

        const savedProductServiceDetails = localStorage.getItem('productServiceDetails');
        if (savedProductServiceDetails) {
            setProductServiceDetails(savedProductServiceDetails);
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('customInterviewQuestions', JSON.stringify(questions));
        localStorage.setItem('companyDetails', companyDetails);
        localStorage.setItem('productServiceDetails', productServiceDetails);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(''), 2000);
    };

    const handleReset = () => {
        if (window.confirm('Reset all questions to defaults? This cannot be undone.')) {
            setQuestions(DEFAULT_QUESTIONS);
            setCompanyDetails('');
            setProductServiceDetails('');
            localStorage.removeItem('customInterviewQuestions');
            localStorage.removeItem('companyDetails');
            localStorage.removeItem('productServiceDetails');
            setSaveStatus('reset');
            setTimeout(() => setSaveStatus(''), 2000);
        }
    };

    const handleAddQuestion = () => {
        if (newQuestion.trim()) {
            setQuestions({
                ...questions,
                [selectedRole]: [...(questions[selectedRole] || []), newQuestion.trim()]
            });
            setNewQuestion('');
        }
    };

    const handleEditQuestion = (index) => {
        setEditingIndex(index);
        setEditingText(questions[selectedRole][index]);
    };

    const handleSaveEdit = () => {
        if (editingText.trim()) {
            const updated = [...questions[selectedRole]];
            updated[editingIndex] = editingText.trim();
            setQuestions({
                ...questions,
                [selectedRole]: updated
            });
        }
        setEditingIndex(null);
        setEditingText('');
    };

    const handleCancelEdit = () => {
        setEditingIndex(null);
        setEditingText('');
    };

    const handleDeleteQuestion = (index) => {
        if (window.confirm('Delete this question?')) {
            const updated = questions[selectedRole].filter((_, i) => i !== index);
            setQuestions({
                ...questions,
                [selectedRole]: updated
            });
        }
    };

    const roleQuestions = questions[selectedRole] || [];

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Info Banner */}
            <div className="bg-blue-900/20 border border-blue-700/50 rounded-xl p-4 mb-6 flex items-start">
                <svg className="w-6 h-6 text-blue-400 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                    <h3 className="text-blue-100 font-semibold mb-1">Customize Interview Questions</h3>
                    <p className="text-blue-200 text-sm">Tailor questions to your specific needs. These questions will be used during the technical assessment stage of AI interviews.</p>
                </div>
            </div>

            {/* Company Context Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">Company Context (Optional)</h3>
                    <div className="flex items-center space-x-3">
                        {saveStatus === 'saved' && (
                            <span className="text-green-300 text-sm flex items-center">
                                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Saved
                            </span>
                        )}
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-lg transition-colors font-medium"
                        >
                            Save Changes
                        </button>
                        <button
                            onClick={handleReset}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                        >
                            Reset to defaults
                        </button>
                    </div>
                </div>
                <p className="text-gray-400 text-sm mb-4">Provide context about your company to help the AI conduct more relevant interviews.</p>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Company Details
                    </label>
                    <textarea
                        value={companyDetails}
                        onChange={(e) => setCompanyDetails(e.target.value)}
                        placeholder="e.g., Brief description of your company, its mission, culture, and values..."
                        className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent resize-none"
                        rows={4}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Product & Services
                    </label>
                    <textarea
                        value={productServiceDetails}
                        onChange={(e) => setProductServiceDetails(e.target.value)}
                        placeholder="e.g., Description of your main products, services, technology stack, and target market..."
                        className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent resize-none"
                        rows={4}
                    />
                </div>
            </div>

            {/* Role Tabs */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-6">
                <div className="flex flex-wrap gap-3 mb-6">
                    {Object.keys(DEFAULT_QUESTIONS).map((role) => (
                        <button
                            key={role}
                            onClick={() => setSelectedRole(role)}
                            className={`px-6 py-3 rounded-lg font-medium transition-all ${selectedRole === role
                                ? 'bg-[#6366F1] text-white shadow-lg'
                                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                                }`}
                        >
                            {role}
                            <span className="ml-2 text-xs opacity-75">
                                ({roleQuestions.length})
                            </span>
                        </button>
                    ))}
                </div>

                {/* Questions List */}
                <div className="space-y-3 mb-6">
                    {roleQuestions.map((question, index) => (
                        <div key={index} className="bg-gray-900/50 border border-gray-600 rounded-lg p-4">
                            {editingIndex === index ? (
                                <div className="space-y-3">
                                    <textarea
                                        value={editingText}
                                        onChange={(e) => setEditingText(e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1] resize-none"
                                        rows={3}
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleSaveEdit}
                                            className="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-lg text-sm"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-start justify-between">
                                    <p className="text-gray-200 flex-1">{question}</p>
                                    <div className="flex gap-2 ml-4">
                                        <button
                                            onClick={() => handleEditQuestion(index)}
                                            className="p-2 text-blue-400 hover:bg-blue-900/20 rounded-lg transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteQuestion(index)}
                                            className="p-2 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Add New Question */}
                <div className="bg-gray-900/30 border-2 border-dashed border-gray-600 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Add New Question for {selectedRole}
                    </label>
                    <div className="flex gap-3">
                        <textarea
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            placeholder="Enter your custom interview question..."
                            className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1] resize-none"
                            rows={2}
                        />
                        <button
                            onClick={handleAddQuestion}
                            disabled={!newQuestion.trim()}
                            className="px-6 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
