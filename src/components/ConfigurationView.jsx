import { useState, useEffect } from 'react';
import Button from './ui/Button';
import { api } from '../lib/api';

export default function ConfigurationView() {
    const [saveStatus, setSaveStatus] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        stack: '',
        primary_language: '',
        experience_level: '',
        core_skills: '',
        evaluation_focus: '',
    });

    // Interview link generation states
    const [jobs, setJobs] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState('');
    const [candidateName, setCandidateName] = useState('');
    const [loading, setLoading] = useState(false);
    const [generatedLink, setGeneratedLink] = useState('');

    useEffect(() => {
        // Load available jobs
        const loadJobs = async () => {
            try {
                const jobsList = await api.getJobs();
                setJobs(jobsList);
            } catch (error) {
                console.error('Error loading jobs:', error);
            }
        };

        loadJobs();
    }, []);

    const handleGenerateLink = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Create the interview session
            const session = await api.createSession({
                job_id: selectedJobId,
                candidate_name: candidateName,
            });

            // Generate the shareable link
            const baseURL = window.location.origin;
            const interviewLink = `${baseURL}/interview/${session.id}`;

            setGeneratedLink(interviewLink);

            // Copy to clipboard
            navigator.clipboard.writeText(interviewLink);
            alert('Interview link copied to clipboard!');
        } catch (error) {
            console.error('Error generating link:', error);
            alert('Failed to generate interview link');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaveStatus('saving');

            // Create job via API
            const jobData = {
                title: formData.title,
                stack: formData.stack.split(',').map(s => s.trim()),
                rubric_template: {
                    primary_language: formData.primary_language,
                    experience_level: formData.experience_level,
                    core_skills: formData.core_skills.split(',').map(s => s.trim()),
                    evaluation_focus: formData.evaluation_focus.split(',').map(s => s.trim()),
                },
            };

            const createdJob = await api.createJob(jobData);
            console.log('Job created:', createdJob);

            // Reset form
            setFormData({
                title: '',
                stack: '',
                primary_language: '',
                experience_level: '',
                core_skills: '',
                evaluation_focus: '',
            });

            // Reload jobs list
            const jobsList = await api.getJobs();
            setJobs(jobsList);

            setSaveStatus('saved');
            setTimeout(() => setSaveStatus(''), 2000);
        } catch (error) {
            console.error('Failed to create job:', error);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus(''), 3000);
        }
    };

    const handleReset = () => {
        setFormData({
            title: '',
            stack: '',
            primary_language: '',
            experience_level: '',
            core_skills: '',
            evaluation_focus: '',
        });
    };

    return (
        <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
            {/* Status Messages */}
            {saveStatus === 'saving' && (
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex items-center">
                    <svg className="w-5 h-5 mr-3 text-blue-400 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span className="text-blue-300 font-medium">Creating job...</span>
                </div>
            )}
            {saveStatus === 'saved' && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-center">
                    <svg className="w-5 h-5 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-green-300 font-medium">Job created successfully!</span>
                </div>
            )}
            {saveStatus === 'error' && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center">
                    <svg className="w-5 h-5 mr-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-red-300 font-medium">Failed to create job</span>
                </div>
            )}

            {/* Create Job Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 shadow-xl">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white">Create New Job</h2>
                    <p className="text-gray-400 mt-2">Define the role requirements and evaluation criteria</p>
                </div>

                <div className="space-y-6">
                    {/* Job Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-200 mb-2">
                            Job Title <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g., Senior Frontend Developer"
                            className="w-full bg-gray-900/60 border border-gray-600 rounded-lg px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1] transition-all"
                        />
                    </div>

                    {/* Tech Stack and Language - Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Stack */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-200 mb-2">
                                Tech Stack <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.stack}
                                onChange={(e) => setFormData({ ...formData, stack: e.target.value })}
                                placeholder="React, TypeScript, Node.js"
                                className="w-full bg-gray-900/60 border border-gray-600 rounded-lg px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1] transition-all"
                            />
                            <p className="text-xs text-gray-500 mt-1.5">Comma-separated</p>
                        </div>

                        {/* Primary Language */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-200 mb-2">
                                Primary Language <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.primary_language}
                                onChange={(e) => setFormData({ ...formData, primary_language: e.target.value })}
                                placeholder="e.g., JavaScript"
                                className="w-full bg-gray-900/60 border border-gray-600 rounded-lg px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1] transition-all"
                            />
                        </div>
                    </div>

                    {/* Experience Level */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-200 mb-2">
                            Experience Level <span className="text-red-400">*</span>
                        </label>
                        <select
                            value={formData.experience_level}
                            onChange={(e) => setFormData({ ...formData, experience_level: e.target.value })}
                            className="w-full bg-gray-900/60 border border-gray-600 rounded-lg px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1] transition-all cursor-pointer"
                        >
                            <option value="">Select experience level</option>
                            <option value="Junior">Junior (0-2 years)</option>
                            <option value="Mid">Mid-Level (2-5 years)</option>
                            <option value="Senior">Senior (5+ years)</option>
                        </select>
                    </div>

                    {/* Core Skills */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-200 mb-2">
                            Core Skills <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.core_skills}
                            onChange={(e) => setFormData({ ...formData, core_skills: e.target.value })}
                            placeholder="Problem Solving, System Design, API Development"
                            className="w-full bg-gray-900/60 border border-gray-600 rounded-lg px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1] transition-all"
                        />
                        <p className="text-xs text-gray-500 mt-1.5">Comma-separated</p>
                    </div>

                    {/* Evaluation Focus */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-200 mb-2">
                            Evaluation Focus <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.evaluation_focus}
                            onChange={(e) => setFormData({ ...formData, evaluation_focus: e.target.value })}
                            placeholder="Technical Skills, Communication, Problem Solving"
                            className="w-full bg-gray-900/60 border border-gray-600 rounded-lg px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1] transition-all"
                        />
                        <p className="text-xs text-gray-500 mt-1.5">Comma-separated</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end space-x-4 pt-8 border-t border-gray-700 mt-8">
                        <Button
                            onClick={handleReset}
                            variant="secondary"
                            className="bg-gray-700 hover:bg-gray-600 text-white font-medium px-6 py-3 min-w-[130px] rounded-lg transition-colors"
                        >
                            Reset Form
                        </Button>
                        <Button
                            onClick={handleSave}
                            disabled={!formData.title || !formData.stack || !formData.primary_language || !formData.experience_level || !formData.core_skills || !formData.evaluation_focus}
                            className="bg-[#6366F1] hover:bg-[#4F46E5] text-white font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 min-w-[130px] rounded-lg transition-all"
                        >
                            <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Create Job
                        </Button>
                    </div>
                </div>
            </div>

            {/* Generate Interview Link Section */}
            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-8 shadow-xl">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white">Generate Interview Link</h2>
                    <p className="text-gray-400 mt-2">Create a personalized interview link for candidates</p>
                </div>

                <form onSubmit={handleGenerateLink} className="space-y-6">
                    {/* Select Job */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-200 mb-2">
                            Select Job <span className="text-red-400">*</span>
                        </label>
                        <select
                            value={selectedJobId}
                            onChange={(e) => setSelectedJobId(e.target.value)}
                            required
                            className="w-full bg-gray-900/60 border border-gray-600 rounded-lg px-4 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1] transition-all cursor-pointer"
                        >
                            <option value="">Select a job</option>
                            {jobs.map((job) => (
                                <option key={job.id} value={job.id}>
                                    {job.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Candidate Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-200 mb-2">
                            Candidate Name <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={candidateName}
                            onChange={(e) => setCandidateName(e.target.value)}
                            placeholder="e.g., John Doe"
                            required
                            className="w-full bg-gray-900/60 border border-gray-600 rounded-lg px-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-[#6366F1] transition-all"
                        />
                    </div>

                    {/* Generate Button */}
                    <div className="pt-8 border-t border-gray-700">
                        <Button
                            type="submit"
                            disabled={loading || !selectedJobId || !candidateName}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed py-3.5 rounded-lg transition-all"
                        >
                            {loading ? (
                                <>
                                    <svg className="w-5 h-5 mr-2 animate-spin inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Generating Link...
                                </>
                            ) : (
                                <>
                                    <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                    </svg>
                                    Generate Interview Link
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Generated Link Display */}
                    {generatedLink && (
                        <div className="p-5 bg-green-500/10 border border-green-500/30 rounded-lg">
                            <div className="flex items-center mb-3">
                                <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-green-300 font-semibold">Interview Link Generated!</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <input
                                    type="text"
                                    value={generatedLink}
                                    readOnly
                                    className="flex-1 bg-gray-900/60 border border-gray-600 rounded-lg px-4 py-3 text-white text-sm font-mono"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        navigator.clipboard.writeText(generatedLink);
                                        alert('Link copied to clipboard!');
                                    }}
                                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors min-w-[100px] whitespace-nowrap shadow-lg"
                                >
                                    Copy Link
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
