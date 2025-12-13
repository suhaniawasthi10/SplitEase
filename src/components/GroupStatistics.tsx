import React, { useEffect, useState, lazy, Suspense } from 'react';
import { TrendingUp, Users, DollarSign, PieChart as PieChartIcon } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import axios from '../utils/axios';

// Lazy load chart components (Recharts is heavy ~50KB)
const CategoryPieChart = lazy(() => import('./charts/CategoryPieChart'));
const MemberBarChart = lazy(() => import('./charts/MemberBarChart'));
const SpendingLineChart = lazy(() => import('./charts/SpendingLineChart'));

// Chart loading fallback
const ChartLoader: React.FC = () => (
    <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-b-2 border-emerald-600 rounded-full"></div>
    </div>
);

interface GroupStatisticsProps {
    groupId: string;
    userCurrency?: string;
}

interface Statistics {
    totalSpent: number;
    expenseCount: number;
    averagePerPerson: number;
    topSpender: { name: string; amount: number } | null;
    categoryBreakdown: { category: string; amount: number }[];
    last30Days: { date: string; amount: number }[];
    memberSpending: { userId: string; name: string; amount: number; percentage: number }[];
}

const GroupStatistics: React.FC<GroupStatisticsProps> = ({ groupId, userCurrency = 'USD' }) => {
    const [statistics, setStatistics] = useState<Statistics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'charts'>('overview');

    useEffect(() => {
        loadStatistics();
    }, [groupId]);

    const loadStatistics = async () => {
        try {
            const response = await axios.get(`/groups/${groupId}/statistics`);
            setStatistics(response.data.statistics);
            setError(null);
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to load statistics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-24 bg-gray-200 rounded"></div>
                        <div className="h-24 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Group Insights</h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800">{error}</p>
                    <button
                        onClick={loadStatistics}
                        className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!statistics) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Group Insights</h3>
                <p className="text-gray-500">No statistics available</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            {/* Header with Tabs */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Group Insights</h3>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'overview'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('charts')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'charts'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        Charts
                    </button>
                </div>
            </div>

            {activeTab === 'overview' ? (
                <div className="space-y-6">
                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Total Spent */}
                        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4 border border-emerald-200">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-emerald-700">Total Spent</span>
                                <DollarSign className="w-5 h-5 text-emerald-600" />
                            </div>
                            <p className="text-2xl font-bold text-emerald-900">
                                {formatCurrency(statistics.totalSpent, userCurrency)}
                            </p>
                            <p className="text-xs text-emerald-600 mt-1">{statistics.expenseCount} expenses</p>
                        </div>

                        {/* Average Per Person */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-blue-700">Avg Per Person</span>
                                <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <p className="text-2xl font-bold text-blue-900">
                                {formatCurrency(statistics.averagePerPerson, userCurrency)}
                            </p>
                            <p className="text-xs text-blue-600 mt-1">Fair share</p>
                        </div>

                        {/* Top Spender */}
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-purple-700">Top Spender</span>
                                <TrendingUp className="w-5 h-5 text-purple-600" />
                            </div>
                            <p className="text-lg font-bold text-purple-900 truncate">
                                {statistics.topSpender?.name || 'N/A'}
                            </p>
                            <p className="text-xs text-purple-600 mt-1">
                                {statistics.topSpender ? formatCurrency(statistics.topSpender.amount, userCurrency) : '-'}
                            </p>
                        </div>

                        {/* Categories */}
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-orange-700">Categories</span>
                                <PieChartIcon className="w-5 h-5 text-orange-600" />
                            </div>
                            <p className="text-2xl font-bold text-orange-900">
                                {statistics.categoryBreakdown.length}
                            </p>
                            <p className="text-xs text-orange-600 mt-1">Different types</p>
                        </div>
                    </div>

                    {/* Member Spending Breakdown */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Member Contributions</h4>
                        <div className="space-y-2">
                            {statistics.memberSpending.map((member) => (
                                <div key={member.userId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                            <span className="text-emerald-700 font-semibold text-sm">
                                                {member.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <span className="font-medium text-gray-900">{member.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-900">
                                            {formatCurrency(member.amount, userCurrency)}
                                        </p>
                                        <p className="text-xs text-gray-500">{member.percentage}% of total</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Category Breakdown Chart */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Spending by Category</h4>
                        <Suspense fallback={<ChartLoader />}>
                            <CategoryPieChart data={statistics.categoryBreakdown} currency={userCurrency} />
                        </Suspense>
                    </div>

                    {/* Member Spending Chart */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Member Contributions</h4>
                        <Suspense fallback={<ChartLoader />}>
                            <MemberBarChart data={statistics.memberSpending} currency={userCurrency} />
                        </Suspense>
                    </div>

                    {/* Spending Trend Chart */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Spending Trend (Last 30 Days)</h4>
                        <Suspense fallback={<ChartLoader />}>
                            <SpendingLineChart data={statistics.last30Days} currency={userCurrency} />
                        </Suspense>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupStatistics;
