import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import InterviewConfiguration from './InterviewConfiguration';
import ScorecardView from '../components/ScorecardView';

// Dummy data for demonstration
const dummyInterviews = [
    {
        id: 'demo-1',
        name: 'Sarah Mitchell',
        email: 'sarah.mitchell@email.com',
        role: 'Frontend',
        experience: '5 years',
        keySkills: 'React, TypeScript, Tailwind CSS',
        completedAt: '2026-02-13T14:30:00.000Z',
        verdict: 'Hire',
        scores: { technical: 9, communication: 8, overall: 9 },
        strengths: [
            {
                title: 'Strong Technical Foundation',
                description: 'Demonstrated excellent understanding of React patterns and modern frontend architecture.',
                evidence: 'I implemented a micro-frontend architecture using Module Federation, which improved our deployment...'
            },
            {
                title: 'Problem-Solving Skills',
                description: 'Showed analytical thinking and systematic approach to debugging.',
                evidence: 'When we had performance issues, I used React DevTools profiler to identify unnecessary re-renders...'
            }
        ],
        risks: [],
        followUpQuestions: [
            'Can you walk us through a complex state management challenge you\'ve solved?',
            'How do you approach accessibility in your frontend projects?'
        ],
        messages: [
            { role: 'ai', content: 'Hello Sarah! Tell me about a challenging technical problem you\'ve solved recently.' },
            { role: 'user', content: 'I implemented a micro-frontend architecture using Module Federation, which improved our deployment flexibility and allowed teams to work independently on different parts of the application.' }
        ]
    },
    {
        id: 'demo-2',
        name: 'Michael Chen',
        email: 'michael.chen@email.com',
        role: 'Backend',
        experience: '3 years',
        keySkills: 'Node.js, PostgreSQL, AWS',
        completedAt: '2026-02-12T10:15:00.000Z',
        verdict: 'Requires Human Interview',
        scores: { technical: 7, communication: 6, overall: 7 },
        strengths: [
            {
                title: 'Database Optimization',
                description: 'Shows good understanding of database performance tuning.',
                evidence: 'I optimized several slow queries by adding proper indexes and restructuring the joins...'
            }
        ],
        risks: [
            {
                title: 'Limited Detail in Responses',
                description: 'Some answers lacked specific examples and metrics.',
                evidence: 'I worked on improving API performance.'
            },
            {
                title: 'Communication Clarity',
                description: 'Could benefit from more structured explanations of technical concepts.',
                evidence: null
            }
        ],
        followUpQuestions: [
            'Can you provide specific metrics on the performance improvements you achieved?',
            'How do you handle API versioning and breaking changes?',
            'Tell us about your experience with microservices architecture.'
        ],
        messages: [
            { role: 'ai', content: 'Hello Michael! Tell me about your experience with API design.' },
            { role: 'user', content: 'I worked on improving API performance.' }
        ]
    },
    {
        id: 'demo-3',
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@email.com',
        role: 'Cloud Services',
        experience: '7 years',
        keySkills: 'AWS, Kubernetes, Terraform',
        completedAt: '2026-02-11T16:45:00.000Z',
        verdict: 'Hire',
        scores: { technical: 10, communication: 9, overall: 10 },
        strengths: [
            {
                title: 'Cloud Architecture Expertise',
                description: 'Exceptional knowledge of cloud infrastructure and best practices.',
                evidence: 'I designed a multi-region AWS architecture with automatic failover that achieved 99.99% uptime...'
            },
            {
                title: 'Cost Optimization',
                description: 'Proven track record of reducing cloud costs while improving performance.',
                evidence: 'By implementing spot instances and right-sizing our EC2 fleet, I reduced our monthly AWS bill by 40%...'
            },
            {
                title: 'Excellent Communication',
                description: 'Clearly explains complex technical concepts and trade-offs.',
                evidence: null
            }
        ],
        risks: [],
        followUpQuestions: [
            'Can you describe your experience with disaster recovery planning?',
            'How do you approach cloud security and compliance?'
        ],
        messages: [
            { role: 'ai', content: 'Hello Emily! Tell me about your cloud infrastructure experience.' },
            { role: 'user', content: 'I designed a multi-region AWS architecture with automatic failover that achieved 99.99% uptime. The system uses Route53 for DNS failover, RDS with cross-region replication, and S3 for static assets with CloudFront distribution.' }
        ]
    },
    {
        id: 'demo-4',
        name: 'David Kim',
        email: 'david.kim@email.com',
        role: 'DBMS',
        experience: '2 years',
        keySkills: 'MySQL, MongoDB, Redis',
        completedAt: '2026-02-10T09:20:00.000Z',
        verdict: 'No Hire',
        scores: { technical: 4, communication: 5, overall: 5 },
        strengths: [],
        risks: [
            {
                title: 'Limited Technical Depth',
                description: 'Responses showed basic understanding but lacked advanced knowledge.',
                evidence: 'I use indexes to make queries faster.'
            },
            {
                title: 'Insufficient Detail',
                description: 'Most answers were brief without specific examples or metrics.',
                evidence: null
            },
            {
                title: 'Lack of Best Practices',
                description: 'Did not mention industry standard approaches or methodologies.',
                evidence: null
            }
        ],
        followUpQuestions: [
            'The candidate may need additional training in database design principles.',
            'Consider junior-level positions or mentorship programs.'
        ],
        messages: [
            { role: 'ai', content: 'Hello David! Tell me about your experience with database optimization.' },
            { role: 'user', content: 'I use indexes to make queries faster.' }
        ]
    },
    {
        id: 'demo-5',
        name: 'Jessica Parker',
        email: 'jessica.parker@email.com',
        role: 'Frontend',
        experience: '4 years',
        keySkills: 'Vue.js, JavaScript, CSS',
        completedAt: '2026-02-09T13:00:00.000Z',
        verdict: 'Requires Human Interview',
        scores: { technical: 7, communication: 7, overall: 7 },
        strengths: [
            {
                title: 'UI/UX Focus',
                description: 'Strong attention to user experience and design implementation.',
                evidence: 'I collaborated closely with designers to ensure pixel-perfect implementation and smooth animations...'
            }
        ],
        risks: [
            {
                title: 'Framework-Specific Experience',
                description: 'Primary experience with Vue.js, team uses React primarily.',
                evidence: 'I\'ve mostly worked with Vue.js but I\'m open to learning React.'
            }
        ],
        followUpQuestions: [
            'How quickly can you transition from Vue.js to React?',
            'Do you have any React projects in your portfolio?',
            'What\'s your experience with TypeScript?'
        ],
        messages: [
            { role: 'ai', content: 'Hello Jessica! Tell me about your frontend development experience.' },
            { role: 'user', content: 'I\'ve worked extensively with Vue.js, building responsive SPAs with Vuex for state management.' }
        ]
    }
];

export default function RecruiterDashboard() {
    const { logout } = useAuth();
    const [candidates, setCandidates] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'scorecard', 'configure'
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    useEffect(() => {
        // Load candidates from localStorage
        const stored = localStorage.getItem('interviewResults');
        if (stored) {
            const realInterviews = JSON.parse(stored);
            // Combine real interviews with dummy data
            setCandidates([...dummyInterviews, ...realInterviews]);
        } else {
            // Use only dummy data if no real interviews
            setCandidates(dummyInterviews);
        }
    }, []);

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800/50 backdrop-blur-sm border-r border-gray-700 flex flex-col">
                {/* Logo */}
                <div className="p-6 border-b border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-[#6366F1] rounded-lg flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-lg">TC</span>
                        </div>
                        <div>
                            <h2 className="text-white font-bold text-lg">TalentCrew</h2>
                            <p className="text-xs text-gray-400">Recruiter Panel</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4">
                    <div className="space-y-2">
                        <button
                            onClick={() => setCurrentView('dashboard')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'dashboard'
                                    ? 'bg-[#6366F1] text-white'
                                    : 'text-gray-300 hover:bg-gray-700/50'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span className="font-medium">Dashboard</span>
                        </button>

                        <button
                            onClick={() => setCurrentView('configure')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${currentView === 'configure'
                                    ? 'bg-[#6366F1] text-white'
                                    : 'text-gray-300 hover:bg-gray-700/50'
                                }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="font-medium">Configure</span>
                        </button>
                    </div>
                </nav>

                {/* Bottom Actions */}
                <div className="p-4 border-t border-gray-700 space-y-2">
                    <Link to="/">
                        <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-700/50 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span className="font-medium">Home</span>
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
                    <div className="px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                {currentView !== 'dashboard' && (
                                    <button
                                        onClick={() => setCurrentView('dashboard')}
                                        className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
                                    >
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                )}
                                <div>
                                    <h1 className="text-3xl font-bold text-white">
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
                        {/* Stats Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 text-sm">Total Interviews</div>
                                        <div className="text-3xl font-bold text-white">{candidates.length}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 text-sm">Recommended</div>
                                        <div className="text-3xl font-bold text-green-400">
                                            {candidates.filter(c => c.verdict === 'Hire').length}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-red-900/30 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 text-sm">Not Recommended</div>
                                        <div className="text-3xl font-bold text-red-400">
                                            {candidates.filter(c => c.verdict === 'No Hire').length}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-yellow-900/30 rounded-lg flex items-center justify-center">
                                        <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 text-sm">Requires Human Interview</div>
                                        <div className="text-3xl font-bold text-yellow-400">
                                            {candidates.filter(c => c.verdict === 'Requires Human Interview').length}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Search</label>
                                    <input
                                        type="text"
                                        placeholder="Search by name or email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#6366F1]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Filter by Role</label>
                                    <select
                                        value={filterRole}
                                        onChange={(e) => setFilterRole(e.target.value)}
                                        className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-[#6366F1]"
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
