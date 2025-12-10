import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchActivities } from '../store/slices/activitySlice';
import Navbar from '../components/Navbar';

const Activity: React.FC = () => {
  const dispatch = useAppDispatch();
  const { activities, loading } = useAppSelector((state) => state.activity);
  const [limit, setLimit] = useState(20);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    dispatch(fetchActivities(limit)).then((result: any) => {
      // If we get fewer activities than requested, no more to load
      if (result.payload && result.payload.length < limit) {
        setHasMore(false);
      }
    });
  }, [dispatch, limit]);

  const handleLoadMore = () => {
    setLimit((prev) => prev + 20);
  };

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
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'expense_added':
        return '💸';
      case 'expense_updated':
        return '✏️';
      case 'expense_deleted':
        return '🗑️';
      case 'settlement':
        return '✅';
      case 'group_created':
        return '🎉';
      default:
        return '📌';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Activity</h1>
          <p className="text-gray-600 mt-1">Track all your expense activities</p>
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-xl border border-gray-200">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            </div>
          ) : activities.length > 0 ? (
            <>
              <div className="divide-y divide-gray-100">
                {activities.map((activity) => (
                  <div
                    key={activity._id}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start space-x-4">
                      {/* Activity Icon */}
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">
                        {getActivityIcon(activity.activityType)}
                      </div>

                      {/* Activity Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatActivityTime(activity.createdAt)}
                        </p>
                      </div>

                      {/* Amount */}
                      {activity.amount && (
                        <div className="flex-shrink-0">
                          <p
                            className={`text-sm font-semibold ${
                              activity.activityType === 'settlement'
                                ? 'text-emerald-600'
                                : 'text-gray-900'
                            }`}
                          >
                            ${activity.amount.toFixed(2)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {/* Load More Button */}
              {hasMore && activities.length >= 20 && (
                <div className="p-6 border-t border-gray-100 text-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Loading...' : 'Load More'}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No activity yet</h3>
              <p className="text-gray-600">Your activity will appear here as you use SplitEase</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Activity;
