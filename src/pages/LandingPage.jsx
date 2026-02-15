import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

export default function LandingPage() {
    const { user, isAuthenticated, logout } = useAuth();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setShowProfileMenu(false);
        navigate('/recruiter/auth');
    };

    // Close dropdown when clicking outside
    const handleClickOutside = (e) => {
        if (showProfileMenu && !e.target.closest('.profile-dropdown')) {
            setShowProfileMenu(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden" onClick={handleClickOutside}>
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-96 h-96 bg-[#6366F1]/20 rounded-full blur-3xl top-20 -left-20 animate-pulse"></div>
                <div className="absolute w-96 h-96 bg-[#6366F1]/10 rounded-full blur-3xl bottom-20 -right-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute w-64 h-64 bg-[#6366F1]/10 rounded-full blur-3xl top-1/2 left-1/2 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Navigation */}
            <div className="fixed top-4 left-0 right-0 z-50 px-6 pointer-events-none">
                <nav className="max-w-7xl mx-auto bg-gray-900/70 backdrop-blur-xl border border-gray-800/50 rounded-2xl shadow-2xl px-6 py-4 pointer-events-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <span className="text-2xl font-bold text-white">TalentCrew<span className="text-4xl text-[#6366F1]">.</span></span>
                        </div>

                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors font-medium">How It Works</a>

                            {!isAuthenticated && (
                                <Link to="/recruiter/auth" className="text-gray-300 hover:text-white transition-colors font-medium">
                                    Recruiter Login
                                </Link>
                            )}

                            {isAuthenticated && (
                                /* Profile Dropdown */
                                <div className="relative profile-dropdown">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowProfileMenu(!showProfileMenu);
                                        }}
                                        className="flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700 rounded-lg px-3 py-2 transition-colors"
                                    >
                                        <div className="w-8 h-8 bg-[#6366F1] rounded-full flex items-center justify-center">
                                            <span className="text-white font-semibold text-sm">
                                                {user?.name?.charAt(0).toUpperCase() || 'R'}
                                            </span>
                                        </div>
                                        <span className="text-white font-medium text-sm">{user?.name || user?.email?.split('@')[0]}</span>
                                        <svg
                                            className={`w-4 h-4 text-gray-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {showProfileMenu && (
                                        <div
                                            className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl py-2 z-[100]"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <div className="px-4 py-3 border-b border-gray-700">
                                                <p className="text-sm text-gray-400">Signed in as</p>
                                                <p className="text-white font-medium truncate">{user?.email}</p>
                                            </div>

                                            <Link
                                                to="/recruiter"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowProfileMenu(false);
                                                }}
                                                className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-700/50 transition-colors text-gray-300 hover:text-white"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                                </svg>
                                                <span>Dashboard</span>
                                            </Link>

                                            <div className="border-t border-gray-700 mt-2 pt-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleLogout();
                                                    }}
                                                    className="flex items-center space-x-3 px-4 py-3 hover:bg-red-900/20 transition-colors text-red-400 hover:text-red-300 w-full text-left"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                    </svg>
                                                    <span>Logout</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </nav>
            </div>

            {/* Hero Section */}
            <main className="relative z-10 px-6 pt-40 pb-32">
                <div className="max-w-7xl mx-auto">
                    {/* Main Heading */}
                    <div className="text-center max-w-4xl mx-auto mb-12">
                        <h1 className="text-6xl md:text-7xl font-bold text-white mb-16 leading-tight">
                            Hire <span className="text-[#6366F1]">10x Faster.</span>
                            <br />
                            Interview <span className="text-[#6366F1]">Smarter.</span>
                        </h1>
                    </div>

                    {/* CTA Button */}
                    <div className="flex justify-center mb-16">
                        <Link to="/interview">
                            <Button size="lg" className="bg-[#6366F1] hover:bg-[#4F46E5] text-white px-8 py-4 text-lg shadow-2xl">
                                Try Demo
                                <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>

            {/* How It Works Section */}
            <section id="how-it-works" className="relative z-10 px-6 py-20 bg-black/40 backdrop-blur-sm">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-2 bg-gray-800 rounded-full text-sm text-gray-300 font-medium border border-gray-700 mb-4">
                            WORKFLOW
                        </span>
                        <h2 className="text-5xl font-bold text-white mb-4">
                            How TalentCrew <span className="text-[#6366F1]">Enhances Your Workflow</span>
                        </h2>
                        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                            Our AI recruiter adapts to your hiring style - from lightning-fast qualification checks to deep technical assessments - so you spend less time screening and more time hiring.
                        </p>
                    </div>

                    {/* Simple 2x2 Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
                        {/* Phase 1 */}
                        <div className="group">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-[#6366F1] rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">1</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Personalized Interview Setup</h3>
                                    <p className="text-gray-400">Every interview is tailored to match the specific role and skills you're applying for</p>
                                </div>
                            </div>
                        </div>

                        {/* Phase 2 */}
                        <div className="group">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-[#6366F1] rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">2</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Convenient Access</h3>
                                    <p className="text-gray-400">Receive a unique interview link and start at your convenience—no scheduling hassles</p>
                                </div>
                            </div>
                        </div>

                        {/* Phase 3 */}
                        <div className="group">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-[#6366F1] rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">3</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Natural Conversation</h3>
                                    <p className="text-gray-400">Talk naturally with our AI interviewer while we capture your responses in real-time</p>
                                </div>
                            </div>
                        </div>

                        {/* Phase 4 */}
                        <div className="group">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-[#6366F1] rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-xl">4</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Instant Feedback & Results</h3>
                                    <p className="text-gray-400">Get comprehensive feedback on your performance with actionable insights for improvement</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Final CTA */}
                    <div className="text-center">
                        <Link to="/interview">
                            <Button size="lg" className="bg-[#6366F1] hover:bg-[#4F46E5] text-white px-12 py-4 text-lg shadow-2xl">
                                Try Demo
                                <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 px-6 py-12 border-t border-white/10">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-gray-400 text-sm">
                        Built with React, Tailwind CSS, and AI-powered evaluation engine • © 2026 TalentCrew
                    </p>
                </div>
            </footer>
        </div>
    );
}
