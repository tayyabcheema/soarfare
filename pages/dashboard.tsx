import React, { useState } from 'react';
import SEO from '../components/SEO';
import DashboardOverview from '../components/dashboard/DashboardOverview';
import MyBookings from '../components/dashboard/MyBookings';
import MyInvoices from '../components/dashboard/MyInvoices';
import AccountInfo from '../components/dashboard/AccountInfo';
import TransferPoints from '../components/dashboard/TransferPoints';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
    const { user, logout, isLoading } = useAuth();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    const sidebarItems = [
        { id: 'dashboard', label: 'My Dashboard', icon: 'dashboard' },
        { id: 'bookings', label: 'My Bookings', icon: 'bookings' },
        { id: 'invoices', label: 'My Invoices', icon: 'invoices' },
        { id: 'account', label: 'Account Info', icon: 'account' },
        { id: 'transfer', label: 'Transfer Points', icon: 'transfer' }
    ];

    const renderIcon = (iconType: string, isActive = false) => {
        const className = `w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600'}`;
        
        switch (iconType) {
            case 'dashboard':
                return (
                    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M13 9V3h8v6h-8zM3 13V3h8v10H3zm18 8V11h-8v10h8zM3 21v-6h8v6H3z"/>
                    </svg>
                );
            case 'bookings':
                return (
                    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                    </svg>
                );
            case 'invoices':
                return (
                    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h10c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                    </svg>
                );
            case 'account':
                return (
                    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                );
            case 'transfer':
                return (
                    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                );
            default:
                return null;
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <DashboardOverview />;
            case 'bookings':
                return <MyBookings />;
            case 'invoices':
                return <MyInvoices />;
            case 'account':
                return <AccountInfo />;
            case 'transfer':
                return <TransferPoints />;
            default:
                return null;
        }
    };

    return (
        <ProtectedRoute requireAuth={true}>
            <SEO
                title="Dashboard"
                description="Manage your SoarFare account, bookings, invoices, and rewards points from your personal dashboard."
                keywords="SoarFare dashboard, flight bookings, travel rewards, account management"
                noindex={true}
            />
            
            <div className="min-h-screen bg-gray-50 flex">
                {/* Sidebar */}
                <div className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transition-transform duration-300 ease-in-out`}>
                    {/* Logo */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center">
                            <img
                                src="/logo.png"
                                alt="SoarFare Logo"
                                className="h-14 w-auto"
                            />
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="p-4 space-y-2">
                        {sidebarItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setIsSidebarOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-left transition-all duration-200 ${
                                    activeTab === item.id
                                        ? 'bg-orange text-white shadow-lg transform scale-[1.02]'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                                }`}
                            >
                                {renderIcon(item.icon, activeTab === item.id)}
                                <span className="font-medium">{item.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main Content */}
                <div className="flex-1 lg:ml-0">
                    {/* Header */}
                    <header className="bg-white shadow-md border-b border-gray-200 px-4 lg:px-6 py-6">
                        <div className="flex items-center justify-between">
                            {/* Left side - Mobile Menu Button and Title */}
                            <div className="flex items-center gap-4">
                                {/* Mobile Menu Button */}
                                <button
                                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                    className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                                    </svg>
                                </button>
                                
                                {/* Dashboard title for larger screens */}
                                <h1 className="hidden lg:block text-xl font-semibold text-gray-800">Dashboard</h1>
                                
                                {/* Go to Website Button */}
                                <a
                                    href="/search"
                                    className="flex items-center gap-2 px-4 py-2 bg-[#F27709] hover:bg-[#E66900] text-white rounded-lg font-medium transition-colors duration-200 shadow-md"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                                    </svg>
                                    <span className="hidden sm:inline">Go to Website</span>
                                    <span className="sm:hidden">Website</span>
                                </a>
                            </div>

                            {/* Right side - User Profile */}
                            <div className="relative ml-auto">
                                <button
                                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full overflow-hidden bg-orange-500 flex items-center justify-center">
                                        {user?.first_name ? (
                                            <span className="text-white font-semibold text-sm lg:text-base">
                                                {user.first_name.charAt(0)}{user.last_name?.charAt(0) || ''}
                                            </span>
                                        ) : (
                                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                            </svg>
                                        )}
                                    </div>
                                    <div className="text-left hidden sm:block">
                                        <p className="text-sm font-medium text-gray-800">
                                            {user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.email || 'User'}
                                        </p>
                                        <p className="text-xs text-gray-600">
                                            {user?.email || 'user@example.com'}
                                        </p>
                                    </div>
                                    <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M7 10l5 5 5-5z"/>
                                    </svg>
                                </button>

                                {/* Dropdown Menu */}
                                {isProfileDropdownOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                        <button
                                            onClick={() => {
                                                setActiveTab('account');
                                                setIsProfileDropdownOpen(false);
                                            }}
                                            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors"
                                        >
                                            Profile Settings
                                        </button>
                                        <button 
                                            onClick={() => {
                                                logout();
                                                setIsProfileDropdownOpen(false);
                                            }}
                                            disabled={isLoading}
                                            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
                                        >
                                            {isLoading ? 'Logging out...' : 'Logout'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <main className="p-4 lg:p-6">
                        <div className="animate-fadeIn">
                            {renderTabContent()}
                        </div>
                    </main>
                </div>

                {/* Mobile Sidebar Overlay */}
                {isSidebarOpen && (
                    <div 
                        className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                )}
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </ProtectedRoute>
    );
};

export default Dashboard;