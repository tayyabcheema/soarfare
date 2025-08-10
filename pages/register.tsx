import React, { useState } from 'react';
import SEO from '../components/SEO';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { registerUser } from '../utils/registerApi';
import ProtectedRoute from '../components/ProtectedRoute';
import { ButtonLoader } from '../components/ui/LoadingSpinner';

const Register: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        password: '',
        confirmPassword: '',
        general: ''
    });

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Reset errors
        setErrors({
            email: '',
            firstName: '',
            lastName: '',
            phone: '',
            password: '',
            confirmPassword: '',
            general: ''
        });

        let hasErrors = false;
        const newErrors = {
            email: '',
            firstName: '',
            lastName: '',
            phone: '',
            password: '',
            confirmPassword: '',
            general: ''
        };

        // Validation
        if (!formData.email) {
            newErrors.email = 'Email is required';
            hasErrors = true;
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email';
            hasErrors = true;
        }

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
            hasErrors = true;
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
            hasErrors = true;
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
            hasErrors = true;
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
            hasErrors = true;
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
            hasErrors = true;
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            hasErrors = true;
        }

        if (hasErrors) {
            setErrors(newErrors);
            return;
        }

        // Form submission
        setIsLoading(true);
        try {
            const res = await registerUser({
                first_name: formData.firstName,
                last_name: formData.lastName,
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.confirmPassword
            });
            if (res.success) {
                // Optionally store token, redirect, or show success
                // localStorage.setItem('token', res.data.token);
                window.location.href = '/login';
            } else {
                setErrors(prev => ({
                    ...prev,
                    general: res.message || 'Registration failed. Please try again.'
                }));
            }
        } catch (err: any) {
            setErrors(prev => ({
                ...prev,
                general: err?.response?.data?.message || 'Registration failed. Please try again.'
            }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ProtectedRoute requireAuth={false} redirectIfAuthenticated={true}>
            <SEO
                title="Register"
                description="Create your SoarFare account to access exclusive flight deals, manage bookings, and unlock premium travel benefits. Join thousands of travelers today."
                keywords="SoarFare register, create travel account, flight booking signup, travel membership, join SoarFare"
                noindex={true}
            />
            <Header />
            
            {/* Registration Page - Background Image with White Overlay */}
            <div className="min-h-screen relative flex items-center justify-center p-4 lg:pt-40 lg:pb-20">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="/login_bg.jpg" 
                        alt="Register Background" 
                        className="w-full h-full object-cover"
                    />
                    {/* White Linear Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-white/70 to-white/80"></div>
                </div>
                
                {/* Centered Registration Card */}
                <div className="relative z-10 bg-white rounded-3xl shadow-1xl overflow-hidden w-[90%] lg:w-[80%] max-w-8xl flex animate-scale-in ">
                    {/* Left Side - Form Container with Gradient */}
                    <div className="w-full lg:w-1/2 relative overflow-hidden rounded-l-3xl">
                        {/* Gradient Background - Light blue to white */}
                        <div className="absolute inset-0 bg-gradient-to-b from-sky-200 via-white/40 to-white/60"></div>
                        
                        {/* Form Content */}
                        <div className="relative z-10 p-8 lg:p-16 flex flex-col justify-center min-h-[700px] animate-fade-in-left">
                            {/* Registration Icon - Orange Person Icon */}
                            <div className="mb-8 flex justify-center">
                                <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-200">
                                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                    </svg>
                                </div>
                            </div>

                            {/* Heading */}
                            <div className="text-center mb-10">
                                <h1 className="text-3xl font-bold text-dark-blue mb-3">Register</h1>
                                <p className="text-gray-600 text-base leading-relaxed px-4">
                                    Join us today and enjoy a seamless<br />experience with your new account.
                                </p>
                            </div>
                            
                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-5 max-w-sm mx-auto w-full">
                                {/* Email Field */}
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                                        <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                                        </svg>
                                    </div>
                                    <input 
                                        type="email" 
                                        id="email" 
                                        name="email" 
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required 
                                        className={`w-full pl-12 pr-4 py-4 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all duration-300 text-gray-800 placeholder-gray-500 text-base hover:bg-gray-200/90 ${errors.email ? 'ring-2 ring-red-400' : ''}`}
                                        placeholder="Email"
                                        aria-label="Email address"
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-sm mt-1 ml-2">{errors.email}</p>
                                    )}
                                </div>

                                {/* First Name Field */}
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                                        <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                        </svg>
                                    </div>
                                    <input 
                                        type="text" 
                                        id="firstName" 
                                        name="firstName" 
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        required 
                                        className={`w-full pl-12 pr-4 py-4 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all duration-300 text-gray-800 placeholder-gray-500 text-base hover:bg-gray-200/90 ${errors.firstName ? 'ring-2 ring-red-400' : ''}`}
                                        placeholder="First Name"
                                        aria-label="First name"
                                    />
                                    {errors.firstName && (
                                        <p className="text-red-500 text-sm mt-1 ml-2">{errors.firstName}</p>
                                    )}
                                </div>

                                {/* Last Name Field */}
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                                        <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                        </svg>
                                    </div>
                                    <input 
                                        type="text" 
                                        id="lastName" 
                                        name="lastName" 
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        required 
                                        className={`w-full pl-12 pr-4 py-4 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all duration-300 text-gray-800 placeholder-gray-500 text-base hover:bg-gray-200/90 ${errors.lastName ? 'ring-2 ring-red-400' : ''}`}
                                        placeholder="Last Name"
                                        aria-label="Last name"
                                    />
                                    {errors.lastName && (
                                        <p className="text-red-500 text-sm mt-1 ml-2">{errors.lastName}</p>
                                    )}
                                </div>

                                {/* Phone Field (Optional) */}
                                {/* <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                                        <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                                        </svg>
                                    </div>
                                    <input 
                                        type="tel" 
                                        id="phone" 
                                        name="phone" 
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className={`w-full pl-12 pr-4 py-4 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all duration-300 text-gray-800 placeholder-gray-500 text-base hover:bg-gray-200/90 ${errors.phone ? 'ring-2 ring-red-400' : ''}`}
                                        placeholder="Phone Number (Optional)"
                                        aria-label="Phone number"
                                    />
                                    {errors.phone && (
                                        <p className="text-red-500 text-sm mt-1 ml-2">{errors.phone}</p>
                                    )}
                                </div> */}
                                
                                {/* Password Field */}
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                                        <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                                        </svg>
                                    </div>
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        id="password" 
                                        name="password" 
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        required 
                                        className={`w-full pl-12 pr-12 py-4 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all duration-300 text-gray-800 placeholder-gray-500 text-base hover:bg-gray-200/90 ${errors.password ? 'ring-2 ring-red-400' : ''}`}
                                        placeholder="Password"
                                        aria-label="Password"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-orange-500 hover:text-orange-600 transition-colors"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            {showPassword ? (
                                                <path d="M12 6.5c2.76 0 5 2.24 5 5 0 .51-.1 1-.24 1.46l3.06 3.06c1.39-1.23 2.49-2.77 3.18-4.53C21.27 7.11 17 4 12 4c-1.27 0-2.49.2-3.64.57l2.17 2.17c.47-.14.96-.24 1.47-.24zM2.71 3.16c-.39.39-.39 1.02 0 1.41l1.97 1.97C3.06 7.83 1.77 9.53 1 11.5 2.73 15.89 7 19 12 19c1.52 0 2.97-.3 4.31-.82l2.72 2.72c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L4.13 3.16c-.39-.39-1.03-.39-1.42 0zM12 16.5c-2.76 0-5-2.24-5-5 0-.77.18-1.5.49-2.14l1.57 1.57c-.03.18-.06.37-.06.57 0 1.66 1.34 3 3 3 .2 0 .38-.03.57-.07L14.14 16.5c-.64.31-1.37.49-2.14.49z"/>
                                            ) : (
                                                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                                            )}
                                        </svg>
                                    </button>
                                    {errors.password && (
                                        <p className="text-red-500 text-sm mt-1 ml-2">{errors.password}</p>
                                    )}
                                </div>

                                {/* Confirm Password Field */}
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                                        <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                                        </svg>
                                    </div>
                                    <input 
                                        type={showConfirmPassword ? "text" : "password"} 
                                        id="confirmPassword" 
                                        name="confirmPassword" 
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        required 
                                        className={`w-full pl-12 pr-12 py-4 bg-gray-100 border-0 rounded-xl focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all duration-300 text-gray-800 placeholder-gray-500 text-base hover:bg-gray-200/90 ${errors.confirmPassword ? 'ring-2 ring-red-400' : ''}`}
                                        placeholder="Confirm Password"
                                        aria-label="Confirm password"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-orange-500 hover:text-orange-600 transition-colors"
                                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            {showConfirmPassword ? (
                                                <path d="M12 6.5c2.76 0 5 2.24 5 5 0 .51-.1 1-.24 1.46l3.06 3.06c1.39-1.23 2.49-2.77 3.18-4.53C21.27 7.11 17 4 12 4c-1.27 0-2.49.2-3.64.57l2.17 2.17c.47-.14.96-.24 1.47-.24zM2.71 3.16c-.39.39-.39 1.02 0 1.41l1.97 1.97C3.06 7.83 1.77 9.53 1 11.5 2.73 15.89 7 19 12 19c1.52 0 2.97-.3 4.31-.82l2.72 2.72c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L4.13 3.16c-.39-.39-1.03-.39-1.42 0zM12 16.5c-2.76 0-5-2.24-5-5 0-.77.18-1.5.49-2.14l1.57 1.57c-.03.18-.06.37-.06.57 0 1.66 1.34 3 3 3 .2 0 .38-.03.57-.07L14.14 16.5c-.64.31-1.37.49-2.14.49z"/>
                                            ) : (
                                                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                                            )}
                                        </svg>
                                    </button>
                                    {errors.confirmPassword && (
                                        <p className="text-red-500 text-sm mt-1 ml-2">{errors.confirmPassword}</p>
                                    )}
                                </div>

                                {/* General Error Message */}
                                {errors.general && (
                                    <div className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg">
                                        {errors.general}
                                    </div>
                                )}
                                
                                {/* Submit Button */}
                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="w-full bg-orange text-white py-4 rounded-xl font-semibold text-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] mt-8 disabled:opacity-60 flex items-center justify-center"
                                >
                                    {isLoading ? (
                                        <>
                                            <ButtonLoader />
                                            Creating Account...
                                        </>
                                    ) : (
                                        'Get Started'
                                    )}
                                </button>
                            </form>
                            
                            {/* Login Link */}
                            <div className="text-center mt-8">
                                <p className="text-gray-700 text-base">
                                    Already have an account? 
                                    <a href="/login" className="text-orange-500 hover:text-orange-600 font-semibold ml-1 transition-colors duration-200">
                                        Sign in
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Background Image */}
                    <div className="hidden lg:flex w-1/2 relative overflow-hidden rounded-r-3xl">
                        <img 
                            src="/register.jpg" 
                            alt="Adventure Awaits" 
                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/40"></div>
                        <div className="absolute bottom-12 left-8 text-left text-white animate-fade-in-right">
                            <h2 className="text-4xl font-light leading-tight">
                                Adventure Awaits<br />
                                <span className="font-light">Let's Get You<br />Started</span>
                            </h2>
                        </div>
                    </div>
                </div>

                {/* Mobile Background Image */}
                <div className="lg:hidden fixed inset-0 z-0">
                    <img 
                        src="/login_bg.jpg" 
                        alt="Register Background" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-white/70"></div>
                </div>
            </div>

            <Footer />

            <style jsx>{`
                @keyframes fade-in-left {
                    from {
                        opacity: 0;
                        transform: translateX(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes fade-in-right {
                    from {
                        opacity: 0;
                        transform: translateX(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                @keyframes scale-in {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .animate-fade-in-left {
                    animation: fade-in-left 0.6s ease-out;
                }

                .animate-fade-in-right {
                    animation: fade-in-right 0.8s ease-out 0.3s both;
                }

                .animate-scale-in {
                    animation: scale-in 0.5s ease-out 0.2s both;
                }
            `}</style>
        </ProtectedRoute>
    );
};

export default Register;