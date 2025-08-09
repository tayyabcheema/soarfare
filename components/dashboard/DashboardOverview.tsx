import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient, DashboardData } from '../../lib/api';
import FlightSearch from '../FlightSearch';

const DashboardOverview: React.FC = () => {
    const { user: authUser, getToken } = useAuth();
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const token = getToken();
                
                if (!token) {
                    setError('No authentication token found');
                    return;
                }

                const response = await apiClient.getDashboard(token);
                
                if (response.success && response.data) {
                    setDashboardData(response.data);
                } else {
                    setError(response.message || 'Failed to fetch dashboard data');
                }
            } catch (err) {
                setError('An error occurred while fetching dashboard data');
                console.error('Dashboard fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [getToken]);

    if (loading) {
        return (
            <div className="space-y-4 lg:space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    <div className="animate-pulse bg-gray-200 rounded-xl h-24"></div>
                    <div className="animate-pulse bg-gray-200 rounded-xl h-24"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <div className="text-red-600 mb-4">{error}</div>
                <button 
                    onClick={() => window.location.reload()} 
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    // Use dashboard data if available, fallback to auth user
    const displayUser = dashboardData?.user || authUser;
    const userPoints = dashboardData?.user_points || 0;
    const altitudePoints = dashboardData?.altitude_points || 0;
    const hasSubscription = dashboardData?.package !== null;

    return (
        <div className="space-y-4 lg:space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                <div>
                    <h1 className="text-xl lg:text-2xl font-bold text-gray-800 mb-1">
                        Hello {displayUser?.first_name || 'User'}!
                    </h1>
                    <p className="text-sm lg:text-base text-gray-600">
                        {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:gap-4">
                    <div className="bg-orange-100 border border-orange-200 rounded-lg px-3 lg:px-4 py-2 flex items-center gap-2">
                        <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <span className="text-orange-700 text-xs lg:text-sm font-medium">
                            {hasSubscription ? 'You have an active subscription' : 'You are not subscribed to a subscription yet.'}
                        </span>
                    </div>
                    {hasSubscription ? (
                        <Link 
                            href="/subscription-plans"
                            className="bg-orange text-white px-4 lg:px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors text-sm lg:text-base w-full sm:w-auto text-center"
                        >
                            Manage Subscription
                        </Link>
                    ) : (
                        <Link 
                            href="/subscription-plans"
                            className="bg-orange text-white px-4 lg:px-6 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors text-sm lg:text-base w-full sm:w-auto text-center"
                        >
                            Subscribe
                        </Link>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6">
                    <div className="flex items-center gap-3 lg:gap-4">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                        </div>
                        <div>
                            <p className="text-gray-600 text-xs lg:text-sm font-medium">Current Points</p>
                            <p className="text-2xl lg:text-3xl font-bold text-orange-600">{userPoints.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 p-4 lg:p-6">
                    <div className="flex items-center gap-3 lg:gap-4">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-orange-100 rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 lg:w-6 lg:h-6 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                            </svg>
                        </div>
                        <div>
                            <p className="text-gray-600 text-xs lg:text-sm font-medium">Total Altitude Reward Points Earned</p>
                            <p className="text-2xl lg:text-3xl font-bold text-orange-600">{altitudePoints.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Flight Search Form */}
            {/* <div className="relative pt-8 lg:pt-20">
                <FlightSearch />
            </div> */}
        </div>
    );
};

export default DashboardOverview;
