import React, { useEffect, useState } from 'react';
import { UserPlus, Search, Users, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchFriends, fetchPendingRequests, acceptFriendRequest, rejectFriendRequest } from '../store/slices/friendsSlice';
import { friendsService } from '../services/friendsService';
import Navbar from '../components/Navbar';
import AddFriendModal from '../components/AddFriendModal';
import { Card, SkeletonLoader, EmptyState } from '../components/ui';

const Friends: React.FC = () => {
  const dispatch = useAppDispatch();
  const { friends, pendingRequests, loading } = useAppSelector((state) => state.friends);
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [friendToRemove, setFriendToRemove] = useState<{ id: string; name: string } | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    dispatch(fetchFriends());
    dispatch(fetchPendingRequests());
  }, [dispatch]);

  const filteredFriends = friends?.filter((friend) => {
    // Backend returns flat object with name property
    const friendName = (friend as any).name || friend.friendId?.name || '';
    return friendName.toLowerCase().includes(searchQuery.toLowerCase());
  }) || [];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const bgColors = [
    'bg-emerald-100 text-emerald-700',
    'bg-purple-100 text-purple-700',
    'bg-blue-100 text-blue-700',
    'bg-pink-100 text-pink-700',
    'bg-orange-100 text-orange-700',
    'bg-cyan-100 text-cyan-700',
  ];

  const getColorClass = (index: number) => bgColors[index % bgColors.length];

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await dispatch(acceptFriendRequest(requestId)).unwrap();
      // Refresh both lists after accepting
      dispatch(fetchFriends());
      dispatch(fetchPendingRequests());
    } catch (error) {
      // Errors handled by Redux
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await dispatch(rejectFriendRequest(requestId)).unwrap();
      dispatch(fetchPendingRequests());
    } catch (error) {
      // Errors handled by Redux
    }
  };

  const handleRemoveFriend = async () => {
    if (!friendToRemove) return;
    try {
      await friendsService.removeFriend(friendToRemove.id);
      dispatch(fetchFriends());
      setFriendToRemove(null);
    } catch (error) {
      // Silent fail - remove errors shown in UI
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setSearching(true);
    try {
      const results = await friendsService.searchFriends(query);
      setSearchResults(results);
    } catch (error) {
      // Silent fail - search errors are not critical
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Friends</h1>
            <p className="text-gray-600 mt-1">Manage your friends and balances</p>
          </div>
          <button
            onClick={() => setShowAddFriendModal(true)}
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Friend
          </button>
        </div>

        {/* Pending Requests Section */}
        {pendingRequests && pendingRequests.length > 0 && (
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Pending Requests ({pendingRequests.length})
            </h2>
            <div className="space-y-3">
              {pendingRequests.map((request) => {
                const fromUser = request.from!;
                return (
                  <div
                    key={request._id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center">
                        <span className="font-semibold">{getInitials(fromUser.name)}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{fromUser.name}</p>
                        <p className="text-sm text-gray-500">@{fromUser.username}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAcceptRequest(request._id)}
                        disabled={loading}
                        className="px-3 py-1.5 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request._id)}
                        disabled={loading}
                        className="px-3 py-1.5 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search friends by username..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            />
            {searching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
              </div>
            )}
          </div>
          {searchResults.length > 0 && searchQuery.trim().length >= 2 && (
            <div className="mt-2 bg-white rounded-lg border border-gray-200 shadow-lg max-h-48 overflow-y-auto">
              {searchResults.map((result) => (
                <div key={result._id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0">
                  <p className="font-semibold text-gray-900">{result.name}</p>
                  <p className="text-sm text-gray-500">@{result.username}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Friends List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonLoader variant="card" />
            <SkeletonLoader variant="card" />
            <SkeletonLoader variant="card" />
            <SkeletonLoader variant="card" />
            <SkeletonLoader variant="card" />
            <SkeletonLoader variant="card" />
          </div>
        ) : filteredFriends.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFriends.map((friend, index) => {
              // Backend returns flat object for friends list
              const friendData = friend as any;
              const balance = friendData.balance || 0;
              const isOwed = balance > 0;
              return (
                <Card
                  key={friendData._id}
                  variant="elevated"
                >
                  {/* Friend Info */}
                  <div className="flex items-center space-x-4 mb-4">
                    {friendData.profileImage?.url ? (
                      <img
                        src={friendData.profileImage.url}
                        alt={friendData.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-100"
                      />
                    ) : (
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center ${getColorClass(index)}`}>
                        <span className="font-semibold text-lg">{getInitials(friendData.name)}</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900">{friendData.name}</h3>
                      <p className="text-sm text-gray-500">@{friendData.username}</p>
                    </div>
                  </div>

                  {/* Balance */}
                  <div className="pt-4 border-t border-gray-100">
                    {balance !== 0 ? (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Balance</span>
                        <div className="text-right">
                          <span
                            className={`text-lg font-bold ${isOwed ? 'text-emerald-600' : 'text-red-600'}`}
                          >
                            {isOwed ? '+' : '-'}${Math.abs(balance).toFixed(2)}
                          </span>
                          <p className="text-xs text-gray-500">
                            {isOwed ? 'they owe you' : 'you owe them'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Settled up</span>
                        <button
                          onClick={() => setFriendToRemove({ id: friendData._id, name: friendData.name })}
                          className="text-sm text-red-600 hover:text-red-700 flex items-center space-x-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Remove</span>
                        </button>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={<Users className="w-10 h-10 text-emerald-600" />}
            title={searchQuery ? 'No friends found' : 'No friends yet'}
            description={
              searchQuery
                ? 'Try a different search term'
                : 'Add friends to start sharing expenses'
            }
            action={!searchQuery ? {
              label: 'Add Friend',
              onClick: () => setShowAddFriendModal(true)
            } : undefined}
          />
        )}
      </motion.div>

      {/* Modals */}
      <AddFriendModal
        isOpen={showAddFriendModal}
        onClose={() => setShowAddFriendModal(false)}
      />

      {/* Remove Friend Confirmation Dialog */}
      {
        friendToRemove && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Remove Friend?</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to remove <strong>{friendToRemove.name}</strong> from your friends? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setFriendToRemove(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRemoveFriend}
                  className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700"
                >
                  Remove Friend
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default Friends;
