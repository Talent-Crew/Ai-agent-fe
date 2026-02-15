import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Code, Clock, FileText } from 'lucide-react';
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
        if (!formData.keySkills.trim()) newErrors.keySkills = 'Programming languages are required';

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
        <div className="flex-1 p-6 bg-[#0A0A0F]">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center space-x-2 text-gray-500 hover:text-gray-300 transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm">Back</span>
                </button>

                <div className="bg-[#13131A] border border-[#1F1F28] rounded-lg p-8">
                    {/* Header */}
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold text-white mb-3">Interview Setup</h2>
                        <p className="text-gray-400 text-sm">Provide your details to begin the assessment</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Personal Information Section */}
                        <div className="space-y-6">
                            <div>
                                <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-3">
                                    <User className="w-4 h-4" />
                                    <span>Full Name</span>
                                    <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    className={`w-full bg-[#1A1A24] border ${errors.name ? 'border-red-500' : 'border-[#2A2A38]'} rounded-md px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#4F46E5] transition-colors`}
                                />
                                {errors.name && <p className="text-red-400 text-xs mt-2">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-3">
                                    <Mail className="w-4 h-4" />
                                    <span>Email Address</span>
                                    <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="your.email@example.com"
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    className={`w-full bg-[#1A1A24] border ${errors.email ? 'border-red-500' : 'border-[#2A2A38]'} rounded-md px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#4F46E5] transition-colors`}
                                />
                                {errors.email && <p className="text-red-400 text-xs mt-2">{errors.email}</p>}
                            </div>
                        </div>

                        {/* Technical Information Section */}
                        <div className="pt-6 border-t border-[#1F1F28] space-y-6">
                            {/* Role Selection */}
                            <div>
                                <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-4">
                                    <Code className="w-4 h-4" />
                                    <span>Technical Path</span>
                                    <span className="text-red-400">*</span>
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {roles.map((role) => (
                                        <button
                                            key={role}
                                            type="button"
                                            onClick={() => handleChange('role', role)}
                                            className={`p-3 rounded-md border transition-all ${
                                                formData.role === role
                                                    ? 'border-[#4F46E5] bg-[#4F46E5]/10 text-white'
                                                    : 'border-[#2A2A38] bg-[#1A1A24] text-gray-400 hover:border-[#3A3A48] hover:text-gray-300'
                                            }`}
                                        >
                                            <div className="text-sm font-medium">{role}</div>
                                        </button>
                                    ))}
                                </div>
                                {errors.role && <p className="text-red-400 text-xs mt-2">{errors.role}</p>}
                            </div>

                            {/* Experience */}
                            <div>
                                <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-3">
                                    <Clock className="w-4 h-4" />
                                    <span>Experience</span>
                                    <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., 3 years, Fresh Graduate"
                                    value={formData.experience}
                                    onChange={(e) => handleChange('experience', e.target.value)}
                                    className={`w-full bg-[#1A1A24] border ${errors.experience ? 'border-red-500' : 'border-[#2A2A38]'} rounded-md px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#4F46E5] transition-colors`}
                                />
                                {errors.experience && <p className="text-red-400 text-xs mt-2">{errors.experience}</p>}
                            </div>

                            {/* Languages */}
                            <div>
                                <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-3">
                                    <Code className="w-4 h-4" />
                                    <span>Programming Languages</span>
                                    <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="JavaScript, Python, Java"
                                    value={formData.keySkills}
                                    onChange={(e) => handleChange('keySkills', e.target.value)}
                                    className={`w-full bg-[#1A1A24] border ${errors.keySkills ? 'border-red-500' : 'border-[#2A2A38]'} rounded-md px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#4F46E5] transition-colors`}
                                />
                                <p className="text-gray-500 text-xs mt-2">Separate multiple languages with commas</p>
                                {errors.keySkills && <p className="text-red-400 text-xs mt-2">{errors.keySkills}</p>}
                            </div>
                        </div>

                        {/* Resume Upload */}
                        <div className="pt-6 border-t border-[#1F1F28]">
                            <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-4">
                                <FileText className="w-4 h-4" />
                                <span>Resume (Optional)</span>
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
                                    className="flex items-center justify-center w-full p-6 border-2 border-dashed border-[#2A2A38] rounded-md hover:border-[#3A3A48] bg-[#1A1A24] transition-colors cursor-pointer"
                                >
                                    <div className="text-center">
                                        {resumeFileName ? (
                                            <div className="flex items-center justify-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-white font-medium text-sm">{resumeFileName}</p>
                                                    <p className="text-xs text-gray-500">Click to change</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="w-12 h-12 rounded-full bg-[#2A2A38] flex items-center justify-center mx-auto mb-3">
                                                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                    </svg>
                                                </div>
                                                <p className="text-gray-300 text-sm mb-1">Upload Resume</p>
                                                <p className="text-xs text-gray-500">PDF, DOC, DOCX • Max 5MB</p>
                                            </>
                                        )}
                                    </div>
                                </label>
                            </div>
                            {errors.resume && <p className="text-red-400 text-xs mt-2">{errors.resume}</p>}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                className="w-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium py-3.5 px-6 rounded-md transition-colors flex items-center justify-center space-x-2"
                            >
                                <span>Start Interview</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#13131A] border border-[#1F1F28] rounded-lg p-8 max-w-md w-full">
                        <div className="flex items-center justify-center w-14 h-14 bg-yellow-500/10 rounded-full mx-auto mb-6">
                            <svg className="w-7 h-7 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4 text-center">Important Notice</h3>
                        <div className="space-y-3 mb-8">
                            <p className="text-gray-400 text-sm text-center mb-4">
                                Once you proceed, please note:
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-start space-x-3 p-3 bg-[#1A1A24] rounded-md">
                                    <span className="text-red-400 text-xs mt-0.5">●</span>
                                    <span className="text-gray-300 text-sm">Cannot edit details after starting</span>
                                </div>
                                <div className="flex items-start space-x-3 p-3 bg-[#1A1A24] rounded-md">
                                    <span className="text-red-400 text-xs mt-0.5">●</span>
                                    <span className="text-gray-300 text-sm">Closing tab will terminate interview</span>
                                </div>
                                <div className="flex items-start space-x-3 p-3 bg-[#1A1A24] rounded-md">
                                    <span className="text-red-400 text-xs mt-0.5">●</span>
                                    <span className="text-gray-300 text-sm">Any interruption ends the session</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="flex-1 bg-[#1A1A24] hover:bg-[#2A2A38] text-gray-300 font-medium py-2.5 px-4 rounded-md transition-colors text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmStart}
                                className="flex-1 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-medium py-2.5 px-4 rounded-md transition-colors text-sm"
                            >
                                I Understand
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
