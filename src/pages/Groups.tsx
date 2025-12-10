import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Plus, Search } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchGroups } from '../store/slices/groupsSlice';
import Navbar from '../components/Navbar';
import AddGroupModal from '../components/AddGroupModal';

const Groups: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { groups, loading } = useAppSelector((state) => state.groups);
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Groups</h1>
            <p className="text-gray-600 mt-1">Manage your expense groups</p>
          </div>
          <button
            onClick={() => setShowAddGroupModal(true)}
            className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Group
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Groups Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          </div>
        ) : filteredGroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => {
              const balance = group.balance || 0;
              const isOwed = balance > 0;
              return (
                <div
                  key={group._id}
                  onClick={() => navigate(`/groups/${group._id}`)}
                  className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  {/* Group Icon & Name */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold text-2xl">
                      {group.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900">{group.name}</h3>
                      <p className="text-sm text-gray-500">
                        {group.members?.length || 0} {group.members?.length === 1 ? 'member' : 'members'}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  {group.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{group.description}</p>
                  )}

                  {/* Balance */}
                  <div className="pt-4 border-t border-gray-100">
                    {balance !== 0 ? (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Your balance</span>
                        <span
                          className={`text-lg font-bold ${
                            isOwed ? 'text-emerald-600' : 'text-red-600'
                          }`}
                        >
                          {isOwed ? '+' : '-'}${Math.abs(balance).toFixed(2)}
                        </span>
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
              {searchQuery ? 'No groups found' : 'No groups yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? 'Try a different search term'
                : 'Create your first group to start splitting expenses'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowAddGroupModal(true)}
                className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Group
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <AddGroupModal
        isOpen={showAddGroupModal}
        onClose={() => setShowAddGroupModal(false)}
      />
    </div>
  );
};

export default Groups;
