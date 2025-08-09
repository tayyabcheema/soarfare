import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient, User } from '../../lib/api';
import toast from 'react-hot-toast';

interface ProfileData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const AccountInfo: React.FC = () => {
    const { getToken } = useAuth();
    const [profileData, setProfileData] = useState<ProfileData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const token = getToken();
                
                console.log('Token:', token ? 'Found' : 'Not found');
                
                if (!token) {
                    toast.error('No authentication token found');
                    setLoading(false);
                    return;
                }

                console.log('Calling getUserProfile API...');
                const response = await apiClient.getUserProfile(token);
                console.log('API Response:', response);
                
                if (response.success && response.data) {
                    // Handle nested user structure from the API
                    const responseData = response.data as any;
                    const user = responseData.user || responseData;
                    console.log('User data:', user);
                    setProfileData({
                        firstName: user.first_name || '',
                        lastName: user.last_name || '',
                        email: user.email || '',
                        password: '',
                        confirmPassword: ''
                    });
                } else {
                    console.error('API failed:', response);
                    toast.error(response.message || 'Failed to fetch profile data');
                    // Fallback: set some default data for testing
                    setProfileData({
                        firstName: 'Test',
                        lastName: 'User', 
                        email: 'test@example.com',
                        password: '',
                        confirmPassword: ''
                    });
                }
            } catch (err) {
                console.error('Profile fetch error:', err);
                toast.error('An error occurred while fetching profile data');
                // Fallback: set some default data for testing
                setProfileData({
                    firstName: 'Test',
                    lastName: 'User', 
                    email: 'test@example.com',
                    password: '',
                    confirmPassword: ''
                });
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [getToken]);

    const handleInputChange = (field: string, value: string) => {
        setProfileData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSaveProfile = async () => {
        try {
            console.log('Save button clicked, current data:', profileData);
            
            // Validation
            if (!profileData.firstName.trim()) {
                toast.error('First name is required');
                return;
            }
            
            if (!profileData.lastName.trim()) {
                toast.error('Last name is required');
                return;
            }

            if (!profileData.email.trim()) {
                toast.error('Email is required');
                return;
            }

            // Password validation if provided
            if (profileData.password && profileData.password !== profileData.confirmPassword) {
                toast.error('Passwords do not match');
                return;
            }

            if (profileData.password && profileData.password.length < 6) {
                toast.error('Password must be at least 6 characters long');
                return;
            }

            setSaving(true);
            const token = getToken();
            
            if (!token) {
                toast.error('No authentication token found');
                setSaving(false);
                return;
            }

            const profileUpdateData = {
                first_name: profileData.firstName.trim(),
                last_name: profileData.lastName.trim(),
                email: profileData.email.trim(),
                ...(profileData.password ? { password: profileData.password } : {})
            };

            console.log('Sending profile update:', profileUpdateData);
            const response = await apiClient.saveUserProfile(token, profileUpdateData);
            console.log('Save response:', response);
            
            if (response.success) {
                toast.success('Profile updated successfully!');
                // Clear password fields after successful save
                setProfileData(prev => ({
                    ...prev,
                    password: '',
                    confirmPassword: ''
                }));
            } else {
                toast.error(response.message || 'Failed to update profile');
            }
        } catch (err) {
            console.error('Profile save error:', err);
            toast.error('An error occurred while saving profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        console.log('Component is in loading state');
        return (
            <div className="space-y-4 lg:space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                            <div className="flex flex-col items-center space-y-4 lg:col-span-1">
                                <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gray-200 rounded-xl lg:rounded-2xl"></div>
                                <div className="h-4 bg-gray-200 rounded w-32"></div>
                            </div>
                            <div className="lg:col-span-2 space-y-4 lg:space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="h-12 bg-gray-200 rounded-lg"></div>
                                    <div className="h-12 bg-gray-200 rounded-lg"></div>
                                </div>
                                <div className="h-12 bg-gray-200 rounded-lg"></div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="h-12 bg-gray-200 rounded-lg"></div>
                                    <div className="h-12 bg-gray-200 rounded-lg"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    console.log('Component rendered with data:', profileData);
    console.log('Loading state:', loading, 'Saving state:', saving);
    
    return (
        <div className="space-y-4 lg:space-y-6">
            <h1 className="text-xl lg:text-2xl font-bold text-gray-800">Account Info</h1>
            
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                    {/* Profile Picture */}
                    <div className="flex flex-col items-center space-y-4 lg:col-span-1">
                        <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-xl lg:rounded-2xl overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <button className="text-orange-500 hover:text-orange-600 font-medium flex items-center gap-2 transition-colors text-sm lg:text-base">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                            </svg>
                            Change profile picture
                        </button>
                    </div>

                    {/* Form */}
                    <div className="lg:col-span-2 space-y-4 lg:space-y-6">
                        {/* Name Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="relative">
                                    <div className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2">
                                        <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="First Name"
                                        value={profileData.firstName}
                                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                                        className="w-full pl-10 lg:pl-12 pr-3 lg:pr-4 py-3 lg:py-4 bg-gray-100 border-0 rounded-lg lg:rounded-xl focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all duration-300 text-gray-800 placeholder-gray-500 text-sm lg:text-base"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="relative">
                                    <div className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2">
                                        <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Last Name"
                                        value={profileData.lastName}
                                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                                        className="w-full pl-10 lg:pl-12 pr-3 lg:pr-4 py-3 lg:py-4 bg-gray-100 border-0 rounded-lg lg:rounded-xl focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all duration-300 text-gray-800 placeholder-gray-500 text-sm lg:text-base"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="relative">
                            <div className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2">
                                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                </svg>
                            </div>
                            <input
                                type="email"
                                placeholder="Email"
                                value={profileData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                disabled={true}
                                className="w-full pl-10 lg:pl-12 pr-3 lg:pr-4 py-3 lg:py-4 bg-gray-100 border-0 rounded-lg lg:rounded-xl focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all duration-300 text-gray-800 placeholder-gray-500 text-sm lg:text-base disabled:bg-gray-200 disabled:cursor-not-allowed"
                            />
                        </div>

                        {/* Password Fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="relative">
                                <div className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2">
                                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                                    </svg>
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password (leave blank to keep current)"
                                    value={profileData.password}
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    className="w-full pl-10 lg:pl-12 pr-10 lg:pr-12 py-3 lg:py-4 bg-gray-100 border-0 rounded-lg lg:rounded-xl focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all duration-300 text-gray-800 placeholder-gray-500 text-sm lg:text-base"
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                                    </svg>
                                </button>
                            </div>
                            <div className="relative">
                                <div className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2">
                                    <svg className="w-4 h-4 lg:w-5 lg:h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                                    </svg>
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm Password"
                                    value={profileData.confirmPassword}
                                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                    className="w-full pl-10 lg:pl-12 pr-10 lg:pr-12 py-3 lg:py-4 bg-gray-100 border-0 rounded-lg lg:rounded-xl focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all duration-300 text-gray-800 placeholder-gray-500 text-sm lg:text-base"
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 lg:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="flex justify-end pt-2">
                            <button 
                                onClick={handleSaveProfile}
                                disabled={saving}
                                className="bg-orange-500 text-white px-6 lg:px-8 py-3 rounded-lg lg:rounded-xl font-medium hover:bg-orange-600 transition-colors text-sm lg:text-base w-full sm:w-auto disabled:bg-orange-300 disabled:cursor-not-allowed"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountInfo;
