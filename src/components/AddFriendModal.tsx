import React, { useState, useEffect, useRef } from 'react';
import { X, Search } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { sendFriendRequest, fetchFriends } from '../store/slices/friendsSlice';
import api from '../utils/axios';

interface SearchUser {
  _id: string;
  username: string;
  name: string;
  email: string;
  profileImage?: {
    url: string | null;
    publicId: string | null;
  };
}

interface AddFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddFriendModal: React.FC<AddFriendModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.friends);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [success, setSuccess] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Search users as user types
  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      setSearching(true);
      try {
        const response = await api.get(`/user/search?query=${searchQuery}`);
        setSearchResults(response.data.users || []);
        setShowDropdown(true);
      } catch (err) {
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    };

    const timeoutId = setTimeout(searchUsers, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectUser = async (user: SearchUser) => {
    setSearchQuery('');
    setShowDropdown(false);
    setSuccess(false);

    try {
      await dispatch(sendFriendRequest(user.username)).unwrap();
      setSuccess(true);
      dispatch(fetchFriends());

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      // Error handled by Redux
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // If exact match in results, use that
    const exactMatch = searchResults.find(
      u => u.username.toLowerCase() === searchQuery.toLowerCase()
    );

    if (exactMatch) {
      handleSelectUser(exactMatch);
      return;
    }

    // Otherwise send request with typed username
    setSuccess(false);
    try {
      await dispatch(sendFriendRequest(searchQuery)).unwrap();
      setSuccess(true);
      setSearchQuery('');
      dispatch(fetchFriends());

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (error) {
      // Error handled by Redux
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add Friend</h2>
          <p className="text-gray-600 mt-1">Search and send a friend request</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <p className="text-sm text-emerald-800">Friend request sent successfully!</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative" ref={dropdownRef}>
            <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700 mb-2">
              Search Users *
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="searchQuery"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200 outline-none"
                placeholder="Type username or name..."
                autoComplete="off"
              />
              {searching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-600"></div>
                </div>
              )}
            </div>

            {/* Autocomplete Dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center space-x-3">
                      {user.profileImage?.url ? (
                        <img
                          src={user.profileImage.url}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">{getInitials(user.name)}</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{user.name}</p>
                        <p className="text-sm text-gray-500 truncate">@{user.username}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent dropdown from closing if it's not supposed to
                        handleSelectUser(user);
                      }}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                    >
                      Send Request
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* No results message */}
            {showDropdown && searchResults.length === 0 && searchQuery.length >= 2 && !searching && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500 text-sm">
                No users found matching "{searchQuery}"
              </div>
            )}

            <p className="mt-2 text-xs text-gray-500">
              Type at least 2 characters to search
            </p>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !searchQuery.trim()}
              className="flex-1 px-4 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-emerald-600/30"
            >
              {loading ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFriendModal;
