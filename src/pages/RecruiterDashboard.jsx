import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import InterviewConfiguration from './InterviewConfiguration';
import ScorecardView from '../components/ScorecardView';
import { api } from '../lib/api';

export default function RecruiterDashboard() {
    const { logout, user } = useAuth();
    const [candidates, setCandidates] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'scorecard', 'configure'
    const [selectedCandidate, setSelectedCandidate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadInterviewResults = async () => {
            if (!user?.email) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const response = await api.getInterviewResults(user.email);

                // Map API response to dashboard format
                const mappedResults = response.results.map(result => ({
                    id: result.session_id,
                    session_id: result.session_id,
                    name: result.candidate,
                    email: result.candidate_email || '',
                    role: result.job_title,
                    experience: 'Not specified',
                    keySkills: '',
                    completedAt: result.started_at,
                    verdict: result.result_summary === 'HIRE' ? 'Hire' : result.result_summary === 'REJECT' ? 'No Hire' : 'Requires Human Interview',
                    scores: {
                        technical: result.overall_score,
                        communication: result.overall_score,
                        overall: result.overall_score
                    },
                    strengths: [],
                    risks: result.top_weaknesses.map(weakness => ({
                        title: weakness,
                        description: '',
                        evidence: null
                    })),
                    followUpQuestions: [],
                    messages: [],
                    timeline: result.timeline,
                    overall_score: result.overall_score,
                    top_weaknesses: result.top_weaknesses,
                    pdf_url: result.pdf_url
                }));

                setCandidates(mappedResults);
            } catch (err) {
                console.error('Failed to load interview results:', err);
                setError(err.message || 'Failed to load interview results');
                setCandidates([]);
            } finally {
                setLoading(false);
            }
        };

        loadInterviewResults();
    }, [user]);

    const filteredCandidates = candidates.filter(candidate => {
        const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            candidate.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'all' || candidate.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const getVerdictColor = (verdict) => {
        if (verdict === 'Hire') return 'text-green-400 bg-green-900/20 border-green-700';
        if (verdict === 'No Hire') return 'text-red-400 bg-red-900/20 border-red-700';
        return 'text-yellow-400 bg-yellow-900/20 border-yellow-700';
    };

    const handleDownloadPDF = async (candidate) => {
        if (!candidate.session_id) {
            alert('Session ID not found');
            return;
        }

        try {
            const pdfBlob = await api.downloadPDF(candidate.session_id);

            // Create a blob URL and trigger download
            const blobUrl = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `Interview_Scorecard_${candidate.name.replace(/\s+/g, '_')}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('PDF download failed:', error);
            alert('Failed to download PDF: ' + error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800/50 backdrop-blur-sm border-r border-gray-700 flex flex-col">
                {/* Logo */}
                <div className="p-6 border-b border-gray-700">
                    <div>
                        <h2 className="text-white font-bold text-2xl leading-none">TalentCrew<span className="text-3xl text-[#6366F1]">.</span></h2>
                        <p className="text-xs text-gray-400 mt-2">Recruiter Panel</p>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4">
                    <div className="space-y-1">
                        <button
                            onClick={() => setCurrentView('dashboard')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${currentView === 'dashboard'
                                ? 'bg-[#6366F1] text-white shadow-lg shadow-[#6366F1]/20'
                                : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                                }`}
                        >
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span className="font-medium text-sm">Dashboard</span>
                        </button>

                        <button
                            onClick={() => setCurrentView('configure')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${currentView === 'configure'
                                ? 'bg-[#6366F1] text-white shadow-lg shadow-[#6366F1]/20'
                                : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                                }`}
                        >
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="font-medium text-sm">Configure</span>
                        </button>
                    </div>
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-gray-700 space-y-1">
                    <Link to="/">
                        <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-200">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span className="font-medium text-sm">Home</span>
                        </button>
                    </Link>

                    <button
                        onClick={() => {
                            if (window.confirm('Are you sure you want to logout?')) {
                                logout();
                                window.location.href = '/recruiter/auth';
                            }
                        }}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors border border-red-800/30"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Header */}
                <header className="bg-gray-800/30 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
                    <div className="px-6 py-5">
                        <div>
                            <h1 className="text-2xl font-bold text-white">
                                {currentView === 'dashboard' && 'Dashboard'}
                                {currentView === 'configure' && 'Interview Configuration'}
                                {currentView === 'scorecard' && 'Interview Scorecard'}
                            </h1>
                            <p className="text-sm text-gray-400 mt-1">
                                {currentView === 'dashboard' && 'Manage interviews and review candidates'}
                                {currentView === 'configure' && 'Customize questions for each role'}
                                {currentView === 'scorecard' && selectedCandidate && `${selectedCandidate.name} - ${selectedCandidate.role}`}
                            </p>
                        </div>
                    </div>
                </header>

                {/* Conditional Content Rendering */}
                {currentView === 'configure' && <InterviewConfiguration />}

                {currentView === 'scorecard' && (
                    <ScorecardView
                        candidate={selectedCandidate}
                        onBack={() => setCurrentView('dashboard')}
                    />
                )}

                {currentView === 'dashboard' && (
                    <div className="p-8">
                        {loading ? (
                            <div className="flex items-center justify-center h-96">
                                <div className="text-center">
                                    <svg className="w-12 h-12 text-[#6366F1] animate-spin mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    <p className="text-gray-400 text-lg">Loading interview results...</p>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="bg-red-900/20 border border-red-700 rounded-xl p-6 mb-6">
                                <div className="flex items-center space-x-4">
                                    <svg className="w-8 h-8 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <h3 className="text-red-400 font-semibold">Error Loading Results</h3>
                                        <p className="text-red-300 text-sm">{error}</p>
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        {/* Stats Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Total Interviews</div>
                                        <div className="text-3xl font-bold text-white">{candidates.length}</div>
                                    </div>
                                    <div className="w-12 h-12 bg-gray-700/50 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Recommended</div>
                                        <div className="text-3xl font-bold text-green-400">
                                            {candidates.filter(c => c.verdict === 'Hire').length}
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Not Recommended</div>
                                        <div className="text-3xl font-bold text-red-400">
                                            {candidates.filter(c => c.verdict === 'No Hire').length}
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 bg-red-900/30 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Requires Human Interview</div>
                                        <div className="text-3xl font-bold text-yellow-400">
                                            {candidates.filter(c => c.verdict === 'Requires Human Interview').length}
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 bg-yellow-900/30 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-5 mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Search</label>
                                    <input
                                        type="text"
                                        placeholder="Search by name or email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Filter by Role</label>
                                    <select
                                        value={filterRole}
                                        onChange={(e) => setFilterRole(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] transition-colors"
                                    >
                                        <option value="all">All Roles</option>
                                        <option value="Frontend">Frontend</option>
                                        <option value="Backend">Backend</option>
                                        <option value="DBMS">DBMS</option>
                                        <option value="Cloud Services">Cloud Services</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Candidates Table */}
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-900/50 border-b border-gray-700">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Candidate</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Experience</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Verdict</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {filteredCandidates.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                                    <div className="flex flex-col items-center">
                                                        <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                        </svg>
                                                        <p className="text-lg font-medium">No interviews yet</p>
                                                        <p className="text-sm mt-1">Candidates will appear here after completing interviews</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredCandidates.map((candidate) => (
                                                <tr key={candidate.id} className="hover:bg-gray-700/30 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <div className="font-medium text-white">{candidate.name}</div>
                                                            <div className="text-sm text-gray-400">{candidate.email}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-300">{candidate.role}</td>
                                                    <td className="px-6 py-4 text-gray-300">{candidate.experience}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${getVerdictColor(candidate.verdict)}`}>
                                                            {candidate.verdict}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-300 text-sm">
                                                        {new Date(candidate.completedAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button
                                                            onClick={() => {
                                                                setSelectedCandidate(candidate);
                                                                setCurrentView('scorecard');
                                                            }}
                                                            className="px-4 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-lg text-sm font-medium transition-colors"
                                                        >
                                                            View Details
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
