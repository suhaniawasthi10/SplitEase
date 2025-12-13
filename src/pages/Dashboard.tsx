import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingDown, TrendingUp, Wallet, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchBalanceSummary } from '../store/dashboardSlice';
import { fetchActivities } from '../store/slices/activitySlice';
import { dashboardService, type DetailedBalance } from '../services/dashboardService';
import { formatCurrency } from '../utils/currency';
import Navbar from '../components/Navbar';
import AddGroupModal from '../components/AddGroupModal';
import AddFriendModal from '../components/AddFriendModal';
import SettleUpModal from '../components/SettleUpModal';
import { Card, SkeletonLoader } from '../components/ui';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { summary, loading } = useAppSelector((state) => state.dashboard);
  const { activities, loading: activityLoading } = useAppSelector((state) => state.activity);
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [showSettleUpModal, setShowSettleUpModal] = useState(false);
  const [showDetailedBalances, setShowDetailedBalances] = useState(false);
  const [detailedBalances, setDetailedBalances] = useState<{ owedToYou: DetailedBalance[]; youOwe: DetailedBalance[] } | null>(null);
  const [loadingDetailed, setLoadingDetailed] = useState(false);

  useEffect(() => {
    dispatch(fetchBalanceSummary());
    dispatch(fetchActivities(5)); // Fetch last 5 activities for dashboard
  }, [dispatch]);

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const formatActivityTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const toggleDetailedBalances = async () => {
    if (!showDetailedBalances && !detailedBalances) {
      setLoadingDetailed(true);
      try {
        const data = await dashboardService.getDetailedBalances();
        setDetailedBalances(data);
      } catch (error) {
        // Silent fail - balance details are not critical
      } finally {
        setLoadingDetailed(false);
      }
    }
    setShowDetailedBalances(!showDetailedBalances);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSettleUpClick={() => setShowSettleUpModal(true)} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Hi, <span className="text-emerald-600">{user.name.split(' ')[0]}</span>
          </h1>
          <p className="text-gray-600 mt-1">Welcome back to SplitEase</p>
        </div>

        {/* Balance Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {loading ? (
            <>
              <SkeletonLoader variant="card" />
              <SkeletonLoader variant="card" />
              <SkeletonLoader variant="card" />
            </>
          ) : (
            <>
              {/* You Owe Card */}
              <Card variant="elevated">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-600">You Owe</h3>
                  <TrendingDown className="w-5 h-5 text-red-500" />
                </div>
                <p className="text-3xl font-bold text-red-600">
                  {formatCurrency(summary?.youOwe || 0, user?.preferredCurrency)}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Across {summary?.owedCount || 0} {summary?.owedCount === 1 ? 'group' : 'groups'}
                </p>
              </Card>

              {/* You're Owed Card */}
              <Card variant="elevated">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-600">You're Owed</h3>
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="text-3xl font-bold text-emerald-600">
                  {formatCurrency(summary?.youreOwed || 0, user?.preferredCurrency)}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  From {summary?.owedByCount || 0} {summary?.owedByCount === 1 ? 'friend' : 'friends'}
                </p>
              </Card>

              {/* Net Balance Card */}
              <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-emerald-50">Net Balance</h3>
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <p className="text-3xl font-bold">
                  {formatCurrency(Math.abs(summary?.netBalance || 0), user?.preferredCurrency)}
                </p>
                <p className="text-xs text-emerald-50 mt-2">
                  {!summary || summary.netBalance === 0
                    ? "You're all settled up!"
                    : summary.netBalance > 0
                      ? "You're ahead overall"
                      : 'You owe overall'}
                </p>
              </Card>
            </>
          )}
        </div>

        {/* Detailed Balances Section */}
        <div className="mb-8">
          <button
            onClick={toggleDetailedBalances}
            className="w-full bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all flex items-center justify-between"
          >
            <h3 className="text-lg font-bold text-gray-900">Detailed Balances</h3>
            <span className="text-emerald-600 font-medium">
              {showDetailedBalances ? 'Hide ▲' : 'Show ▼'}
            </span>
          </button>

          {showDetailedBalances && (
            <div className="mt-4 space-y-6">
              {loadingDetailed ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
                </div>
              ) : (
                <>
                  {/* You Owe Section */}
                  {detailedBalances?.youOwe && detailedBalances.youOwe.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h4 className="text-md font-bold text-gray-900 mb-4 flex items-center">
                        <TrendingDown className="w-5 h-5 text-red-500 mr-2" />
                        You Owe
                      </h4>
                      <div className="space-y-3">
                        {detailedBalances.youOwe.map((balance) => (
                          <div key={balance._id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                            <div>
                              <p className="font-semibold text-gray-900">{balance.toUserId?.name}</p>
                              {balance.groupId && (
                                <p className="text-sm text-gray-600">in {balance.groupId.name}</p>
                              )}
                            </div>
                            <span className="text-lg font-bold text-red-600">
                              {formatCurrency(balance.amount, user?.preferredCurrency)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* You're Owed Section */}
                  {detailedBalances?.owedToYou && detailedBalances.owedToYou.length > 0 && (
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                      <h4 className="text-md font-bold text-gray-900 mb-4 flex items-center">
                        <TrendingUp className="w-5 h-5 text-emerald-500 mr-2" />
                        You're Owed
                      </h4>
                      <div className="space-y-3">
                        {detailedBalances.owedToYou.map((balance) => (
                          <div key={balance._id} className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                            <div>
                              <p className="font-semibold text-gray-900">{balance.fromUserId?.name}</p>
                              {balance.groupId && (
                                <p className="text-sm text-gray-600">in {balance.groupId.name}</p>
                              )}
                            </div>
                            <span className="text-lg font-bold text-emerald-600">
                              {formatCurrency(balance.amount, user?.preferredCurrency)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* All Settled Up */}
                  {(!detailedBalances?.youOwe || detailedBalances.youOwe.length === 0) &&
                    (!detailedBalances?.owedToYou || detailedBalances.owedToYou.length === 0) && (
                      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                        <Wallet className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">All Settled Up!</h3>
                        <p className="text-gray-600">You don't owe anyone and nobody owes you.</p>
                      </div>
                    )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            </div>
            {activities.length > 0 && (
              <button
                onClick={() => navigate('/activity')}
                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
              >
                View All →
              </button>
            )}
          </div>

          {/* Activity Feed */}
          <div className="space-y-4">
            {activityLoading ? (
              <>
                <SkeletonLoader variant="list" />
                <SkeletonLoader variant="list" />
                <SkeletonLoader variant="list" />
              </>
            ) : activities.length > 0 ? (
              activities.map((activity) => (
                <Card
                  key={activity._id}
                  className="hover:border-emerald-100"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatActivityTime(activity.createdAt)}
                      </p>
                    </div>
                    {activity.amount && (
                      <div className="text-right">
                        <p className={`text-sm font-semibold ${activity.activityType === 'settlement' ? 'text-emerald-600' : 'text-gray-900'
                          }`}>
                          {formatCurrency(activity.amount, user?.preferredCurrency)}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No recent activity</h3>
                <p className="text-gray-600">Your activity will appear here</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Modals */}
      <AddGroupModal
        isOpen={showAddGroupModal}
        onClose={() => setShowAddGroupModal(false)}
      />
      <AddFriendModal
        isOpen={showAddFriendModal}
        onClose={() => setShowAddFriendModal(false)}
      />
      <SettleUpModal
        isOpen={showSettleUpModal}
        onClose={() => setShowSettleUpModal(false)}
        balances={[]}
        onSuccess={() => {
          dispatch(fetchBalanceSummary());
          dispatch(fetchActivities(5));
        }}
      />
    </div>
  );
};

export default Dashboard;
