import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient, DashboardData } from '../../lib/api';


const TransferPoints: React.FC = () => {
    const { getToken } = useAuth();
    const [dashboard, setDashboard] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [transferEmail, setTransferEmail] = useState('');
    const [transferPoints, setTransferPoints] = useState('');
    const [transferLoading, setTransferLoading] = useState(false);
    const [transferMessage, setTransferMessage] = useState<string | null>(null);
    const [history, setHistory] = useState<any[]>([]);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [historyError, setHistoryError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = getToken();
                if (!token) {
                    setError('No authentication token found');
                    setLoading(false);
                    return;
                }
                const res = await apiClient.getDashboard(token);
                if (res.success && res.data) {
                    setDashboard(res.data);
                    // Debug log
                    console.log('Dashboard data:', res.data);
                } else {
                    setError(res.message || 'Failed to fetch dashboard data');
                }
            } catch (err) {
                setError('Failed to fetch dashboard data');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, [getToken]);

    useEffect(() => {
        const fetchHistory = async () => {
            setHistoryLoading(true);
            setHistoryError(null);
            try {
                const token = getToken();
                if (!token) {
                    setHistoryError('No authentication token found');
                    setHistoryLoading(false);
                    return;
                }
                const params = {
                    draw: 1,
                    start: 0,
                    length: 10,
                    order: [{ column: 0, dir: 'asc' }],
                    search: { value: '', regex: false }
                };
                const res = await apiClient.getTransferPointsHistory(token, params);
                // Accept any truthy value for success (boolean, number, string)
                const isSuccess = !!res.success;
                const historyArr = res.data?.data || res.data?.records || res.data || [];
                if (isSuccess && Array.isArray(historyArr)) {
                    setHistory(historyArr);
                } else {
                    setHistoryError(res.message || 'Failed to fetch transfer history');
                }
            } catch (err) {
                setHistoryError('Failed to fetch transfer history');
            } finally {
                setHistoryLoading(false);
            }
        };
        fetchHistory();
    }, [getToken, transferMessage]);

    const handleTransfer = async (e: React.FormEvent) => {
        e.preventDefault();
        setTransferLoading(true);
        setTransferMessage(null);
        try {
            const token = getToken();
            if (!token) {
                setTransferMessage('No authentication token found');
                setTimeout(() => {
                    setShowModal(false);
                    setTransferMessage(null);
                }, 1200);
                setTransferLoading(false);
                return;
            }
            const res = await apiClient.confirmTransferPoints(token, {
                email: transferEmail,
                points: Number(transferPoints)
            });
            if (res.success) {
                setTransferMessage(res.message || 'Points transferred successfully!');
                setTransferEmail('');
                setTransferPoints('');
                // Optionally refresh dashboard data
                const dashRes = await apiClient.getDashboard(token);
                if (dashRes.success && dashRes.data) setDashboard(dashRes.data);
            } else {
                setTransferMessage(res.message || 'Failed to transfer points');
            }
            setTimeout(() => {
                setShowModal(false);
                setTransferMessage(null);
            }, 1500);
        } catch (err) {
            setTransferMessage('Failed to transfer points');
            setTimeout(() => {
                setShowModal(false);
                setTransferMessage(null);
            }, 1500);
        } finally {
            setTransferLoading(false);
        }
    };

    if (loading) return (
        <div className="space-y-4 lg:space-y-6 animate-pulse">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                <div className="h-8 w-40 bg-gray-200 rounded mb-2"></div>
                <div className="h-10 w-32 bg-gray-200 rounded"></div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-40"></div>
        </div>
    );
    if (error) return <div className="text-red-500">{error}</div>;

    const userPoints = dashboard?.user_points || 0;
    // Debug log
    console.log('userPoints:', userPoints);

    return (
        <div className="space-y-4 lg:space-y-6">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-800">Transfer Points</h1>
                {userPoints > 0 && (
                    <button
                        className="bg-orange text-white px-4 py-2 rounded-lg font-semibold mt-4 lg:mt-0"
                        onClick={() => setShowModal(true)}
                    >
                        Transfer Points
                    </button>
                )}
            </div>
            {userPoints === 0 && (
                <div className="bg-orange-100 border border-orange-200 rounded-lg px-3 lg:px-4 py-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                    <span className="text-orange-700 text-xs lg:text-sm">You currently do not have any points in your account to refer to friends.</span>
                </div>
            )}

            {/* Modal for transfer points */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-lg font-bold mb-4">Transfer Points</h2>
                        {transferLoading ? (
                            <div className="flex flex-col items-center justify-center py-8">
                                <svg className="animate-spin h-8 w-8 text-orange-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                </svg>
                                <div className="text-orange-600 font-semibold text-lg animate-pulse">Transferring points...</div>
                            </div>
                        ) : transferMessage ? (
                            <div className="flex flex-col items-center justify-center py-8">
                                <div className="text-orange-600 font-semibold text-lg animate-pulse">{transferMessage}</div>
                            </div>
                        ) : (
                            <form onSubmit={handleTransfer} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Recipient Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={transferEmail}
                                        onChange={e => setTransferEmail(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Points to Transfer</label>
                                    <input
                                        type="number"
                                        min={1}
                                        max={userPoints}
                                        required
                                        value={transferPoints}
                                        onChange={e => setTransferPoints(e.target.value)}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    />
                                    <div className="text-xs text-gray-500 mt-1">You have {userPoints} points available.</div>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-gray-200 rounded-lg"
                                        onClick={() => { setShowModal(false); setTransferMessage(null); }}
                                        disabled={transferLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-orange text-white rounded-lg font-semibold hover:bg-orange-600"
                                        disabled={transferLoading}
                                    >
                                        Transfer
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* Transfer Points History Table */}
            <div className="mt-8">
                <h2 className="text-lg font-bold mb-4">Transfer Points History</h2>
                {historyLoading ? (
                    <div className="animate-pulse h-20 bg-gray-100 rounded"></div>
                ) : historyError ? (
                    <div className="text-red-500">{historyError}</div>
                ) : history.length === 0 ? (
                    <div className="text-gray-500">No transfer history found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Date</th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Type</th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Points</th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">From</th>
                                    <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">To</th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((item) => (
                                    <tr key={item.id} className="border-t">
                                        <td className="px-4 py-2 text-sm">{item.formatted_date}</td>
                                        <td className="px-4 py-2 text-sm capitalize">{item.type}</td>
                                        <td className="px-4 py-2 text-sm font-semibold">{item.points}</td>
                                        <td className="px-4 py-2 text-sm">{item.from_user?.name} <br /><span className="text-xs text-gray-400">{item.from_user?.email}</span></td>
                                        <td className="px-4 py-2 text-sm">{item.to_user?.name} <br /><span className="text-xs text-gray-400">{item.to_user?.email}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransferPoints;
