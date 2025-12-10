import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingDown, TrendingUp, Wallet, Clock } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchBalanceSummary } from '../store/dashboardSlice';
import { fetchActivities } from '../store/slices/activitySlice';
import Navbar from '../components/Navbar';
import AddGroupModal from '../components/AddGroupModal';
import AddFriendModal from '../components/AddFriendModal';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { summary, loading } = useAppSelector((state) => state.dashboard);
  const { activities, loading: activityLoading } = useAppSelector((state) => state.activity);
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [showSettleUpModal, setShowSettleUpModal] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSettleUpClick={() => setShowSettleUpModal(true)} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Hi, <span className="text-emerald-600">{user.name.split(' ')[0]}</span>
          </h1>
          <p className="text-gray-600 mt-1">Welcome back to SplitEase</p>
        </div>

        {/* Balance Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* You Owe Card */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-600">You Owe</h3>
              <TrendingDown className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-3xl font-bold text-red-600">
              ${loading ? '...' : (summary?.youOwe || 0).toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Across {summary?.owedCount || 0} {summary?.owedCount === 1 ? 'group' : 'groups'}
            </p>
          </div>

          {/* You're Owed Card */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-600">You're Owed</h3>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-3xl font-bold text-emerald-600">
              ${loading ? '...' : (summary?.youreOwed || 0).toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              From {summary?.owedByCount || 0} {summary?.owedByCount === 1 ? 'friend' : 'friends'}
            </p>
          </div>

          {/* Net Balance Card */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-6 text-white hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-emerald-50">Net Balance</h3>
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <p className="text-3xl font-bold">
              ${loading ? '...' : Math.abs(summary?.netBalance || 0).toFixed(2)}
            </p>
            <p className="text-xs text-emerald-50 mt-2">
              {!summary || summary.netBalance === 0
                ? "You're all settled up!"
                : summary.netBalance > 0
                ? "You're ahead overall"
                : 'You owe overall'}
            </p>
          </div>
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
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
              </div>
            ) : activities.length > 0 ? (
              activities.map((activity) => (
                <div
                  key={activity._id}
                  className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatActivityTime(activity.createdAt)}
                    </p>
                  </div>
                  {activity.amount && (
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${
                        activity.activityType === 'settlement' ? 'text-emerald-600' : 'text-gray-900'
                      }`}>
                        ${activity.amount.toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
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
      </div>

      {/* Modals */}
      <AddGroupModal
        isOpen={showAddGroupModal}
        onClose={() => setShowAddGroupModal(false)}
      />
      <AddFriendModal
        isOpen={showAddFriendModal}
        onClose={() => setShowAddFriendModal(false)}
      />
    </div>
  );
};

export default Dashboard;
