import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function RoleCalibrationForm({ onSubmit }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        experience: '',
        keySkills: '',
        resume: null
    });

    const [errors, setErrors] = useState({});
    const [resumeFileName, setResumeFileName] = useState('');
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const roles = ['Frontend', 'Backend', 'DBMS', 'Cloud Services'];

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleResumeUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file type
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type)) {
                setErrors(prev => ({ ...prev, resume: 'Please upload a PDF or Word document' }));
                return;
            }
            // Check file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, resume: 'File size must be less than 5MB' }));
                return;
            }
            setFormData(prev => ({ ...prev, resume: file }));
            setResumeFileName(file.name);
            setErrors(prev => ({ ...prev, resume: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.role) newErrors.role = 'Please select a role';
        if (!formData.experience.trim()) newErrors.experience = 'Experience is required';
        if (!formData.keySkills.trim()) newErrors.keySkills = 'Key skills are required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            setShowConfirmModal(true);
        }
    };

    const handleConfirmStart = () => {
        setShowConfirmModal(false);
        onSubmit(formData);
    };

    return (
        <div className="flex-1 p-6">
            <div className="max-w-5xl mx-auto">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                </button>
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl p-8">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">Let's Get Started</h2>
                        <p className="text-gray-400">Fill in your details to begin the AI interview. This helps us calibrate the questions for you.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name and Email Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Full Name <span className="text-red-400">*</span>
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    className={errors.name ? 'border-red-500' : ''}
                                />
                                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Email Address <span className="text-red-400">*</span>
                                </label>
                                <Input
                                    type="email"
                                    placeholder="your.email@example.com"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    className={errors.email ? 'border-red-500' : ''}
                                />
                                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                            </div>
                        </div>

                        {/* Role Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3">
                                Technical Path <span className="text-red-400">*</span>
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {roles.map((role) => (
                                    <button
                                        key={role}
                                        type="button"
                                        onClick={() => handleChange('role', role)}
                                        className={`p-4 rounded-xl border-2 transition-all ${formData.role === role
                                            ? 'border-[#6366F1] bg-[#6366F1]/10 text-white'
                                            : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500'
                                            }`}
                                    >
                                        <div className="font-semibold">{role}</div>
                                    </button>
                                ))}
                            </div>
                            {errors.role && <p className="text-red-400 text-sm mt-2">{errors.role}</p>}
                        </div>

                        {/* Experience and Skills Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Years of Experience <span className="text-red-400">*</span>
                                </label>
                                <Input
                                    type="text"
                                    placeholder="e.g., 3 years, 5+ years, Fresh Graduate"
                                    value={formData.experience}
                                    onChange={(e) => handleChange('experience', e.target.value)}
                                    className={errors.experience ? 'border-red-500' : ''}
                                />
                                {errors.experience && <p className="text-red-400 text-sm mt-1">{errors.experience}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Key Skills <span className="text-red-400">*</span>
                                </label>
                                <Input
                                    type="text"
                                    placeholder="e.g., React, Node.js, PostgreSQL"
                                    value={formData.keySkills}
                                    onChange={(e) => handleChange('keySkills', e.target.value)}
                                    className={errors.keySkills ? 'border-red-500' : ''}
                                />
                                {errors.keySkills && <p className="text-red-400 text-sm mt-1">{errors.keySkills}</p>}
                            </div>
                        </div>

                        {/* Resume Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3">
                                Upload Resume (Optional)
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    id="resume-upload"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleResumeUpload}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="resume-upload"
                                    className="flex items-center justify-center w-full p-6 border-2 border-dashed border-gray-600 rounded-xl hover:border-[#6366F1] bg-gray-700/30 hover:bg-gray-700/50 transition-all cursor-pointer"
                                >
                                    <div className="text-center">
                                        {resumeFileName ? (
                                            <div className="flex items-center justify-center space-x-2">
                                                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <div>
                                                    <p className="text-white font-medium">{resumeFileName}</p>
                                                    <p className="text-sm text-gray-400">Click to change</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                </svg>
                                                <p className="text-gray-300 font-medium mb-1">Click to upload or drag and drop</p>
                                                <p className="text-sm text-gray-400">PDF, DOC, DOCX (Max 5MB)</p>
                                                <p className="text-xs text-gray-500 mt-2">Help AI understand your background better</p>
                                            </>
                                        )}
                                    </div>
                                </label>
                            </div>
                            {errors.resume && <p className="text-red-400 text-sm mt-2">{errors.resume}</p>}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <Button
                                type="submit"
                                size="lg"
                                className="w-full md:w-auto px-12 bg-[#6366F1] hover:bg-[#4F46E5] text-white"
                            >
                                Start AI Interview
                                <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 max-w-md w-full shadow-2xl">
                        <div className="flex items-center justify-center w-16 h-16 bg-yellow-500/20 rounded-full mx-auto mb-4">
                            <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3 text-center">Important Notice</h3>
                        <div className="space-y-3 mb-6">
                            <p className="text-gray-300 text-center">
                                Once you start the interview:
                            </p>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li className="flex items-start">
                                    <span className="text-red-400 mr-2">•</span>
                                    <span>You <strong className="text-white">cannot go back</strong> to edit your details</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-red-400 mr-2">•</span>
                                    <span><strong className="text-white">Closing the tab</strong> will terminate the interview</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-red-400 mr-2">•</span>
                                    <span><strong className="text-white">Any interruption</strong> will result in instant termination</span>
                                </li>
                            </ul>
                        </div>
                        <div className="flex space-x-3">
                            <Button
                                onClick={() => setShowConfirmModal(false)}
                                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleConfirmStart}
                                className="flex-1 bg-[#6366F1] hover:bg-[#4F46E5] text-white"
                            >
                                I Understand, Start
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
