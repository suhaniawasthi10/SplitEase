import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchActivities } from '../store/slices/activitySlice';
import { formatCurrency } from '../utils/currency';
import Navbar from '../components/Navbar';
import { Card, SkeletonLoader } from '../components/ui';

const Activity: React.FC = () => {
  const dispatch = useAppDispatch();
  const { activities, loading } = useAppSelector((state) => state.activity);
  const { user } = useAppSelector((state) => state.auth); // Added for preferredCurrency
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

  // Removed getActivityIcon as it's no longer used in the new UI

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Activity</h1>
          <p className="text-gray-600 mt-1">Track all your expense activities</p>
        </div>

        {/* Activity Feed */}
        <div className="space-y-4">
          {loading ? (
            <>
              <SkeletonLoader variant="list" />
              <SkeletonLoader variant="list" />
              <SkeletonLoader variant="list" />
              <SkeletonLoader variant="list" />
              <SkeletonLoader variant="list" />
            </>
          ) : activities.length > 0 ? (
            <>
              {activities.map((activity) => (
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
                        <p className={`text-sm font-semibold ${activity.activityType === 'settlement'
                          ? 'text-emerald-600'
                          : 'text-gray-900'
                          }`}>
                          {formatCurrency(activity.amount, user?.preferredCurrency)}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
              {/* Load More Button */}
              {hasMore && activities.length >= 20 && (
                <div className="p-6 text-center">
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
      </motion.div>
    </div >
  );
};

export default Activity;
