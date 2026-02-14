import { useState } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import CandidateTable from '../components/dashboard/CandidateTable';
import ScorecardView from '../components/dashboard/ScorecardView';

// Mock data for demonstration
const mockCandidates = [
    {
        id: 1,
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        role: 'Senior Frontend Engineer',
        matchScore: 87,
        status: 'Completed',
        interviewDate: '2026-02-12',
        scores: [
            { skill: 'React', value: 9 },
            { skill: 'TypeScript', value: 8 },
            { skill: 'CSS', value: 9 },
            { skill: 'Problem Solving', value: 8 },
            { skill: 'Communication', value: 9 }
        ],
        evidence: [
            {
                type: 'strength',
                category: 'Technical',
                quote: 'I architected a component library using TypeScript and React that reduced development time by 40%',
                skill: 'React & TypeScript',
                relevance: 9
            },
            {
                type: 'strength',
                category: 'Communication',
                quote: 'When explaining the migration plan to stakeholders, I created visual diagrams and broke down the timeline into clear milestones',
                skill: 'Stakeholder Management',
                relevance: 8
            },
            {
                type: 'risk',
                category: 'Experience',
                quote: 'I haven\'t worked extensively with Next.js, but I\'m a fast learner',
                skill: 'Next.js',
                relevance: 6
            },
            {
                type: 'strength',
                category: 'Problem Solving',
                quote: 'I identified a performance bottleneck using React DevTools and Chrome Performance profiler, then implemented code splitting to reduce bundle size by 35%',
                skill: 'Performance Optimization',
                relevance: 9
            }
        ]
    },
    {
        id: 2,
        name: 'Michael Chen',
        email: 'mchen@email.com',
        role: 'Full Stack Developer',
        matchScore: 72,
        status: 'Review',
        interviewDate: '2026-02-11',
        scores: [
            { skill: 'React', value: 7 },
            { skill: 'TypeScript', value: 7 },
            { skill: 'CSS', value: 6 },
            { skill: 'Problem Solving', value: 8 },
            { skill: 'Communication', value: 7 }
        ],
        evidence: [
            {
                type: 'strength',
                category: 'Technical',
                quote: 'I built a real-time dashboard using React and WebSockets',
                skill: 'React',
                relevance: 8
            },
            {
                type: 'risk',
                category: 'Communication',
                quote: 'Sometimes I get too focused on technical details and forget to explain the business impact',
                skill: 'Business Communication',
                relevance: 7
            }
        ]
    },
    {
        id: 3,
        name: 'Emily Rodriguez',
        email: 'emily.r@email.com',
        role: 'UI/UX Engineer',
        matchScore: 91,
        status: 'Completed',
        interviewDate: '2026-02-10',
        scores: [
            { skill: 'React', value: 9 },
            { skill: 'TypeScript', value: 8 },
            { skill: 'CSS', value: 10 },
            { skill: 'Problem Solving', value: 9 },
            { skill: 'Communication', value: 9 }
        ],
        evidence: [
            {
                type: 'strength',
                category: 'Design',
                quote: 'I created a design system from scratch that improved consistency across 50+ components',
                skill: 'Design Systems',
                relevance: 10
            },
            {
                type: 'strength',
                category: 'Technical',
                quote: 'I implemented accessibility features that brought our WCAG score to AAA compliance',
                skill: 'Accessibility',
                relevance: 9
            }
        ]
    },
    {
        id: 4,
        name: 'David Park',
        email: 'd.park@email.com',
        role: 'Frontend Developer',
        matchScore: 58,
        status: 'Declined',
        interviewDate: '2026-02-09',
        scores: [
            { skill: 'React', value: 6 },
            { skill: 'TypeScript', value: 5 },
            { skill: 'CSS', value: 6 },
            { skill: 'Problem Solving', value: 6 },
            { skill: 'Communication', value: 5 }
        ],
        evidence: [
            {
                type: 'risk',
                category: 'Technical',
                quote: 'I mostly work with class components and haven\'t adopted hooks yet',
                skill: 'Modern React',
                relevance: 8
            },
            {
                type: 'risk',
                category: 'Experience',
                quote: 'I haven\'t worked on large-scale applications before',
                skill: 'Scale',
                relevance: 7
            }
        ]
    }
];

export default function RecruiterDashboard() {
    const [activeView, setActiveView] = useState('candidates');
    const [selectedCandidate, setSelectedCandidate] = useState(null);

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar activeView={activeView} setActiveView={setActiveView} />

            <main className="flex-1 p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-slate-900">Candidate Dashboard</h1>
                        <p className="text-slate-600 mt-2">
                            Review interview results and make hiring decisions
                        </p>
                    </div>

                    {activeView === 'candidates' && (
                        <div className="space-y-6">
                            <CandidateTable
                                candidates={mockCandidates}
                                onSelectCandidate={setSelectedCandidate}
                                selectedCandidate={selectedCandidate}
                            />

                            {selectedCandidate && (
                                <ScorecardView candidate={selectedCandidate} />
                            )}
                        </div>
                    )}

                    {activeView === 'analytics' && (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <h3 className="mt-2 text-xl font-medium text-slate-900">Analytics Dashboard</h3>
                            <p className="mt-1 text-slate-500">Coming soon - View hiring trends and insights</p>
                        </div>
                    )}

                    {activeView === 'settings' && (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <h3 className="mt-2 text-xl font-medium text-slate-900">Settings</h3>
                            <p className="mt-1 text-slate-500">Coming soon - Configure interview parameters</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
