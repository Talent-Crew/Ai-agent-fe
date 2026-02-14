import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-96 h-96 bg-[#6366F1]/20 rounded-full blur-3xl top-20 -left-20 animate-pulse"></div>
                <div className="absolute w-96 h-96 bg-[#6366F1]/10 rounded-full blur-3xl bottom-20 -right-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
                <div className="absolute w-64 h-64 bg-[#6366F1]/10 rounded-full blur-3xl top-1/2 left-1/2 animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Navigation */}
            <nav className="relative z-10 px-6 py-6 border-b border-gray-800/50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-[#6366F1] rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-xl">TC</span>
                        </div>
                        <span className="text-2xl font-bold text-white">TalentCrew</span>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors font-medium">How It Works</a>
                        <Link to="/interview">
                            <Button variant="primary" size="md" className="bg-[#6366F1] hover:bg-[#4F46E5] shadow-lg text-white">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 px-6 pt-20 pb-32">
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
                                Start Interview Now
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
                                    <h3 className="text-xl font-bold text-white mb-2">Initiation & Role Calibration</h3>
                                    <p className="text-gray-400">Candidate selects path, AI sets expectations and calibrates difficulty</p>
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
                                    <h3 className="text-xl font-bold text-white mb-2">Adaptive Technical Deep-Dive</h3>
                                    <p className="text-gray-400">Dynamic questions adjust in real-time based on responses</p>
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
                                    <h3 className="text-xl font-bold text-white mb-2">Communication Assessment</h3>
                                    <p className="text-gray-400">AI evaluates soft skills and communication abilities</p>
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
                                    <h3 className="text-xl font-bold text-white mb-2">Evaluation & Scoring</h3>
                                    <p className="text-gray-400">Automated scorecard with hire recommendation instantly</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Final CTA */}
                    <div className="text-center">
                        <Link to="/interview">
                            <Button size="lg" className="bg-[#6366F1] hover:bg-[#4F46E5] text-white px-12 py-4 text-lg shadow-2xl">
                                Experience the AI Interview
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
