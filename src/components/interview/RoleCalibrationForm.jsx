import { useState } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function RoleCalibrationForm({ onSubmit }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: '',
        experience: '',
        keySkills: ''
    });

    const [errors, setErrors] = useState({});

    const roles = ['Frontend', 'Backend', 'DBMS', 'Cloud Services'];

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
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
            onSubmit(formData);
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center p-6 bg-gray-900">
            <div className="w-full max-w-2xl bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Let's Get Started</h2>
                    <p className="text-gray-400">Fill in your details to begin the AI interview. This helps us calibrate the questions for you.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
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

                    {/* Email */}
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

                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Technical Path <span className="text-red-400">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
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
                        {errors.role && <p className="text-red-400 text-sm mt-1">{errors.role}</p>}
                    </div>

                    {/* Years of Experience */}
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

                    {/* Key Skills */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Key Skills <span className="text-red-400">*</span>
                        </label>
                        <Input
                            type="text"
                            placeholder="e.g., React, Node.js, PostgreSQL"
                            value={formData.keySkills}
                            onChange={(e) => handleChange('keySkills', e.target.value)}
                            multiline={true}
                            rows={3}
                            className={errors.keySkills ? 'border-red-500' : ''}
                        />
                        {errors.keySkills && <p className="text-red-400 text-sm mt-1">{errors.keySkills}</p>}
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        size="lg"
                        className="w-full bg-[#6366F1] hover:bg-[#4F46E5] text-white"
                    >
                        Start AI Interview
                        <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Button>
                </form>
            </div>
        </div>
    );
}
