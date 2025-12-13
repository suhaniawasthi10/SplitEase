import React, { useState, useEffect } from 'react';
import { X, Search, UserPlus, Mail, Copy, Check } from 'lucide-react';
import { friendsService } from '../services/friendsService';
import { groupDetailsService } from '../services/groupDetailsService';

interface Friend {
  _id: string;
  name: string;
  username: string;
  email: string;
}

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  existingMemberIds: string[];
  onSuccess: () => void;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  groupId,
  existingMemberIds,
  onSuccess,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [addingUserId, setAddingUserId] = useState<string | null>(null);
  const [mode, setMode] = useState<'friend' | 'email'>('friend');
  const [email, setEmail] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [sendingInvite, setSendingInvite] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isOpen && searchQuery.length >= 2) {
      searchFriends();
    } else if (searchQuery.length < 2) {
      setFriends([]);
    }
  }, [searchQuery, isOpen]);

  const searchFriends = async () => {
    setLoading(true);
    try {
      const data = await friendsService.searchFriends(searchQuery);
      // Filter out members already in the group
      const filtered = data.filter((friend: Friend) => !existingMemberIds.includes(friend._id));
      setFriends(filtered);
    } catch (err) {
      // Silent fail - search errors are not critical
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (friendId: string) => {
    setError('');
    setAddingUserId(friendId);
    try {
      await groupDetailsService.addMemberToGroup(groupId, friendId, 'member');
      onSuccess();
      handleClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add member');
    } finally {
      setAddingUserId(null);
    }
  };

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSendingInvite(true);
    try {
      const result = await groupDetailsService.sendEmailInvite(groupId, email);
      setInviteLink(result.invite.inviteLink);
      setSuccess(result.message);
      setEmail('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send invite');
    } finally {
      setSendingInvite(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleClose = () => {
    setSearchQuery('');
    setFriends([]);
    setEmail('');
    setInviteLink('');
    setError('');
    setSuccess('');
    setMode('friend');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative">
        <button onClick={handleClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Member</h2>

        {/* Mode Selector */}
        <div className="flex space-x-2 mb-4">
          <button
            type="button"
            onClick={() => setMode('friend')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${mode === 'friend'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <UserPlus className="w-4 h-4" />
              <span>From Friends</span>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setMode('email')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${mode === 'email'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>By Email</span>
            </div>
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <p className="text-sm text-emerald-800">{success}</p>
          </div>
        )}

        {/* Friend Search Mode */}
        {mode === 'friend' && (
          <>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search friends by name or username..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {loading ? (
                <p className="text-center text-gray-500 py-8">Searching...</p>
              ) : friends.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  {searchQuery.length < 2
                    ? 'Type at least 2 characters to search'
                    : 'No friends found'}
                </p>
              ) : (
                friends.map((friend) => (
                  <div
                    key={friend._id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{friend.name}</p>
                      <p className="text-sm text-gray-500">@{friend.username}</p>
                    </div>
                    <button
                      onClick={() => handleAddMember(friend._id)}
                      disabled={addingUserId !== null}
                      className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>{addingUserId === friend._id ? 'Adding...' : 'Add'}</span>
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* Email Invite Mode */}
        {mode === 'email' && (
          <form onSubmit={handleSendInvite} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="friend@example.com"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              />
              <p className="mt-2 text-xs text-gray-500">
                An invitation will be sent to this email address. They can join even if they don't have an account yet.
              </p>
            </div>

            <button
              type="submit"
              disabled={sendingInvite || !email}
              className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sendingInvite ? 'Sending Invite...' : 'Send Invite'}
            </button>

            {inviteLink && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invite Link (copy to share)
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={inviteLink}
                    readOnly
                    className="flex-1 px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center space-x-2"
                  >
                    {linkCopied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default AddMemberModal;
