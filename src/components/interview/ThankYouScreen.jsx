import { Link } from 'react-router-dom';
import Button from '../ui/Button';

export default function ThankYouScreen({ candidateName }) {
    return (
        <div className="flex-1 flex items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-black to-gray-900">
            <div className="w-full max-w-2xl text-center">
                {/* Success Icon */}
                <div className="mb-8 flex justify-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-[#6366F1] to-[#4F46E5] rounded-full flex items-center justify-center shadow-2xl">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>

                {/* Main Message */}
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Thank You for Interviewing!
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                    {candidateName && `${candidateName}, we`} appreciate you taking the time to complete this AI-powered interview with TalentCrew.
                </p>

                {/* Info Box */}
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4">What Happens Next?</h2>
                    <div className="space-y-4 text-left">
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-[#6366F1] rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold">1</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-white mb-1">Scorecard Generation</h3>
                                <p className="text-gray-400 text-sm">Our AI is compiling a comprehensive evaluation of your responses, including strengths, areas for improvement, and a hire recommendation.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-[#6366F1] rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold">2</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-white mb-1">Recruiter Review</h3>
                                <p className="text-gray-400 text-sm">The hiring team will review your scorecard along with follow-up questions for the next round.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-[#6366F1] rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold">3</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-white mb-1">We'll Be in Touch</h3>
                                <p className="text-gray-400 text-sm">Expect to hear from us soon regarding the next steps in your interview process.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Button */}
                <Link to="/">
                    <Button size="lg" className="bg-[#6366F1] hover:bg-[#4F46E5] text-white px-12 py-4">
                        Back to Home
                        <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </Button>
                </Link>
            </div>
        </div>
    );
}
