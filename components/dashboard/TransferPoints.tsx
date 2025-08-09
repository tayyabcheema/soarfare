import React, { useState } from 'react';

const TransferPoints: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const transferData = [
        { num: '01', user: 'User Name', type: 'Type Here', date: 'November 7, 2017', points: '455 Points' },
        { num: '02', user: 'User Name', type: 'Type Here', date: 'May 12, 2019', points: '434 Points' },
        { num: '03', user: 'User Name', type: 'Type Here', date: 'August 2, 2013', points: '345 Points' },
        { num: '04', user: 'User Name', type: 'Type Here', date: 'July 14, 2015', points: '455 Points' },
        { num: '05', user: 'User Name', type: 'Type Here', date: 'September 9, 2013', points: '434 Points' },
        { num: '06', user: 'User Name', type: 'Type Here', date: 'October 25, 2019', points: '455 Points' },
        { num: '07', user: 'User Name', type: 'Type Here', date: 'April 28, 2016', points: '434 Points' },
        { num: '08', user: 'User Name', type: 'Type Here', date: 'May 6, 2012', points: '455 Points' }
    ];

    return (
        <div className="space-y-4 lg:space-y-6">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                <h1 className="text-xl lg:text-2xl font-bold text-gray-800">Transfer Points</h1>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:gap-4">
                    <div className="bg-orange-100 border border-orange-200 rounded-lg px-3 lg:px-4 py-2 flex items-center gap-2">
                        <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <span className="text-orange-700 text-xs lg:text-sm">You currently do not have any points in your account to refer to friends.</span>
                    </div>
                    <input
                        type="text"
                        placeholder="Search......"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-auto px-3 lg:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm lg:text-base"
                    />
                </div>
            </div>

            {/* Mobile Cards View */}
            <div className="lg:hidden space-y-3">
                {transferData.map((transfer) => (
                    <div key={transfer.num} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-semibold text-gray-900">#{transfer.num}</span>
                                <span className="text-sm font-medium text-gray-700">{transfer.user}</span>
                            </div>
                            <span className="text-sm font-bold text-gray-900">{transfer.points}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                            <span>{transfer.type}</span>
                            <span>{transfer.date}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Number</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">User</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Type</th>
                                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Date</th>
                                <th className="px-6 py-4 text-right text-sm font-medium text-gray-700">Points</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {transferData.map((transfer) => (
                                <tr key={transfer.num} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">{transfer.num}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{transfer.user}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{transfer.type}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{transfer.date}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 text-right font-medium">{transfer.points}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-t border-gray-200 gap-4">
                    <button className="px-4 py-2 text-gray-400 hover:text-gray-600 transition-colors order-2 sm:order-1">
                        Previous
                    </button>
                    <div className="flex gap-2 order-1 sm:order-2">
                        {[1, 2, 3, 4, 5, 6, 7].map((page) => (
                            <button
                                key={page}
                                className={`w-8 h-8 rounded text-sm ${page === 1 ? 'bg-orange text-white' : 'text-gray-600 hover:bg-gray-100'} transition-colors`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors order-3">
                        Next
                    </button>
                </div>
            </div>

            {/* Mobile Pagination */}
            <div className="lg:hidden flex justify-center">
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((page) => (
                        <button
                            key={page}
                            className={`w-8 h-8 rounded text-sm ${page === 1 ? 'bg-orange text-white' : 'text-gray-600 hover:bg-gray-100'} transition-colors`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TransferPoints;
