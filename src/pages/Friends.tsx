import React, { useEffect, useState } from 'react';
import { UserPlus, Search, Users } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchFriends, fetchPendingRequests, acceptFriendRequest, rejectFriendRequest } from '../store/slices/friendsSlice';
import Navbar from '../components/Navbar';
import AddFriendModal from '../components/AddFriendModal';

const Friends: React.FC = () => {
  const dispatch = useAppDispatch();
  const { friends, pendingRequests, loading } = useAppSelector((state) => state.friends);
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
      console.error('Failed to accept request:', error);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await dispatch(rejectFriendRequest(requestId)).unwrap();
      dispatch(fetchPendingRequests());
    } catch (error) {
      console.error('Failed to reject request:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
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
              placeholder="Search friends..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Friends List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          </div>
        ) : filteredFriends.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFriends.map((friend, index) => {
              // Backend returns flat object for friends list
              const friendData = friend as any;
              const balance = friendData.balance || 0;
              const isOwed = balance > 0;
              return (
                <div
                  key={friendData._id}
                  className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  {/* Friend Info */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${getColorClass(index)}`}>
                      <span className="font-semibold text-lg">{getInitials(friendData.name)}</span>
                    </div>
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
                            className={`text-lg font-bold ${
                              isOwed ? 'text-emerald-600' : 'text-red-600'
                            }`}
                          >
                            {isOwed ? '+' : '-'}${Math.abs(balance).toFixed(2)}
                          </span>
                          <p className="text-xs text-gray-500">
                            {isOwed ? 'they owe you' : 'you owe them'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <span className="text-sm text-gray-500">Settled up</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery ? 'No friends found' : 'No friends yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? 'Try a different search term'
                : 'Add friends to start sharing expenses'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowAddFriendModal(true)}
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Friend
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddFriendModal
        isOpen={showAddFriendModal}
        onClose={() => setShowAddFriendModal(false)}
      />
    </div>
  );
};

export default Friends;
