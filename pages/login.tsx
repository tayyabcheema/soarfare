import React, { useState } from 'react';
import SEO from '../components/SEO';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import { ButtonLoader } from '../components/ui/LoadingSpinner';

const Login = () => {
    const { login, isLoading } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(null); // Clear error when user types
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        const success = await login(formData.email, formData.password);
        
        if (!success) {
            setError('Invalid email or password');
        }
        // Success handling is done in the AuthContext (redirect to dashboard)
    };

    return (
        <ProtectedRoute requireAuth={false} redirectIfAuthenticated={true}>
            <SEO
                title="Login"
                description="Login to your SoarFare account to access exclusive flight deals, manage bookings, and unlock premium travel benefits. Secure and easy access to your travel dashboard."
                keywords="SoarFare login, travel account access, flight booking login, travel dashboard, secure login"
                noindex={true}
            />
            <Header />
            
            {/* Login Page - Background Image with White Overlay */}
            <div className="min-h-screen relative flex items-center justify-center p-4">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="/login_bg.jpg" 
                        alt="Login Background" 
                        className="w-full h-full object-cover"
                    />
                    {/* White Linear Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-white/70 to-white/80"></div>
                </div>
                
                {/* Centered Login Card */}
                <div className="relative z-10 bg-white rounded-3xl shadow-1xl overflow-hidden w-[100%] lg:w-[80%] max-w-8xl flex animate-scale-in">
                    {/* Left Side - Form Container with Gradient */}
                    <div className="w-full lg:w-1/2 relative overflow-hidden rounded-l-3xl">
                        {/* Gradient Background */}
                        <div className="absolute inset-0 bg-gradient-to-b from-sky-200 via-white/40 to-white/60"></div>
                        
                        {/* Form Content */}
                        <div className="relative z-10 p-4 lg:p-16 flex flex-col justify-center min-h-[600px] animate-fade-in-left">
                            {/* Login Icon */}
                            <div className="mb-8 flex justify-center">
                                <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center shadow-sm border border-grey-200 transform hover:scale-105 transition-transform duration-200">
                                    <svg className="w-7 h-7 text-white" fill="orange" viewBox="0 0 24 24">
                                        <path d="M9 17l6-6-6-6v4H3v4h6v4zm9-13h-2v12h2V4z"/>
                                    </svg>
                                </div>
                            </div>

                            {/* Heading */}
                            <div className="text-center mb-10">
                                <h1 className="text-3xl font-semibold text-gray-600 mb-3">Sign in with email</h1>
                                <p className="text-gray-600 text-base leading-relaxed px-4">
                                    Sign in to stay connected and get the<br />most out of our services.
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
                                        className="w-full pl-12 pr-4 py-4 bg-gray-200/70 border-0 rounded-xl focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all duration-300 text-gray-800 placeholder-gray-500 text-base hover:bg-gray-200/90"
                                        placeholder="Email"
                                    />
                                </div>
                                
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
                                        className="w-full pl-12 pr-12 py-4 bg-gray-200/70 border-0 rounded-xl focus:ring-2 focus:ring-orange-400 focus:bg-white transition-all duration-300 text-gray-800 placeholder-gray-500 text-base hover:bg-gray-200/90"
                                        placeholder="Password"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 text-orange-500 hover:text-orange-600 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                                        </svg>
                                    </button>
                                </div>

                                {/* Forgot Password */}
                                <div className="text-right pt-2">
                                    <a href="#" className="text-sm text-gray-600 hover:text-orange-500 transition-colors duration-200 font-medium">
                                        Forgot Password?
                                    </a>
                                </div>
                                
                                {/* Submit Button */}
                                <button 
                                    type="submit" 
                                    className="w-full bg-orange text-white py-4 rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl active:scale-[0.98] mt-8 disabled:opacity-60 flex items-center justify-center"
                                    disabled={isLoading}
                                >
                                   {isLoading ? (
                                       <>
                                           <ButtonLoader />
                                           Logging in...
                                       </>
                                   ) : (
                                       'Login'
                                   )}
                                </button>
                                {error && (
                                    <div className="mt-4 text-center text-red-500 text-sm font-medium">{error}</div>
                                )}
                            </form>
                            
                            {/* Register Link */}
                            <div className="text-center mt-8">
                                <p className="text-gray-700 text-base">
                                    Don't have any account? 
                                    <a href="/register" className="text-orange-500 hover:text-orange-600 font-semibold ml-1 transition-colors duration-200">
                                        Register
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Background Image */}
                    <div className="hidden lg:flex w-1/2 relative overflow-hidden rounded-r-3xl">
                        <img 
                            src="/login.jpg" 
                            alt="Welcome Back, Traveller!" 
                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20"></div>
                        <div className="absolute top-12 left-8 text-left text-gray-800 animate-fade-in-right">
                            <h2 className="text-4xl font-light leading-tight">
                                Welcome Back,<br />Traveller!
                            </h2>
                        </div>
                    </div>
                </div>

                {/* Mobile Background Image */}
                <div className="lg:hidden fixed inset-0 z-0">
                    <img 
                        src="/login_bg.jpg" 
                        alt="Login Background" 
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

export default Login;