import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, DollarSign, Moon, Sun } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { logoutUser } from '../store/authSlice';
import { fetchPendingRequests } from '../store/slices/friendsSlice';
import { fetchBalanceSummary } from '../store/dashboardSlice';
import { fetchActivities } from '../store/slices/activitySlice';
import { useTheme } from '../contexts/ThemeContext';
import { showSuccess, showError } from '../utils/toast';
import ProfileEditModal from './ProfileEditModal';
import DeleteAccountModal from './DeleteAccountModal';
import SettleUpModal from './SettleUpModal';

interface NavbarProps {
  onSettleUpClick?: () => void; // Keep for backward compatibility but make it optional
}

const Navbar: React.FC<NavbarProps> = ({ onSettleUpClick }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAppSelector((state) => state.auth);
  const { pendingRequests } = useAppSelector((state) => state.friends);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showSettleUpModal, setShowSettleUpModal] = useState(false);

  const pendingCount = pendingRequests?.length || 0;

  useEffect(() => {
    // Fetch pending requests when navbar mounts
    dispatch(fetchPendingRequests());
  }, [dispatch]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      showSuccess('Logged out successfully');
      navigate('/login');
    } catch (error) {
      showError('Logout failed. Redirecting...');
      navigate('/login');
    }
  };

  const handleSettleUpClick = () => {
    // If parent component provided a handler, use it (for backward compatibility)
    if (onSettleUpClick) {
      onSettleUpClick();
    } else {
      // Otherwise, manage the modal internally
      setShowSettleUpModal(true);
    }
  };

  const handleSettleUpSuccess = () => {
    // Refresh data after successful settlement
    dispatch(fetchBalanceSummary());
    dispatch(fetchActivities(5));
  };

  const tabs = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Groups', path: '/groups' },
    { name: 'Friends', path: '/friends' },
    { name: 'Activity', path: '/activity' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const getInitials = () => {
    if (!user) return '';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!user) return null;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">💰</span>
            </div>
            <span className="text-xl font-bold text-gray-900">SplitEase</span>
          </div>

          {/* Navigation Tabs */}
          <div className="hidden md:flex items-center space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => navigate(tab.path)}
                className={`relative px-4 py-2 rounded-lg font-medium transition-colors ${isActive(tab.path)
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                {tab.name}
                {tab.name === 'Friends' && pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
            <button
              onClick={handleSettleUpClick}
              className="ml-2 inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <DollarSign className="w-4 h-4 mr-1" />
              Settle Up
            </button>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors"
              >
                {user.profileImage?.url ? (
                  <img
                    src={user.profileImage.url}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{getInitials()}</span>
                  </div>
                )}
                <span className="hidden sm:block text-gray-900 font-medium">{user.name.split(' ')[0]}</span>
                <ChevronDown className="w-4 h-4 text-gray-600" />
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">@{user.username}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowProfileModal(true);
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    View Profile
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={() => {
                      setShowDeleteAccountModal(true);
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Delete Account
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Edit Modal */}
      {user && (
        <ProfileEditModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          currentUser={user}
        />
      )}

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={showDeleteAccountModal}
        onClose={() => setShowDeleteAccountModal(false)}
        onSuccess={handleLogout}
      />

      {/* Settle Up Modal - Global */}
      <SettleUpModal
        isOpen={showSettleUpModal}
        onClose={() => setShowSettleUpModal(false)}
        balances={[]}
        onSuccess={handleSettleUpSuccess}
      />
    </nav>
  );
};

export default Navbar;
