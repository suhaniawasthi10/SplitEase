import React, { useState, useEffect } from 'react';
import { X, Settings, Trash2 } from 'lucide-react';
import { groupDetailsService } from '../services/groupDetailsService';
import type { GroupDetails } from '../types/models';

interface GroupSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    group: GroupDetails;
    onSuccess: () => void;
    isOwner: boolean;
}

const GroupSettingsModal: React.FC<GroupSettingsModalProps> = ({
    isOpen,
    onClose,
    group,
    onSuccess,
    isOwner,
}) => {
    const [name, setName] = useState(group.name);
    const [description, setDescription] = useState(group.description || '');
    const [memberInvitesAllowed, setMemberInvitesAllowed] = useState(group.memberInvitesAllowed ?? true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setName(group.name);
            setDescription(group.description || '');
            setMemberInvitesAllowed(group.memberInvitesAllowed ?? true);
        }
    }, [isOpen, group]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await groupDetailsService.updateGroupSettings(group._id, {
                name,
                description,
                memberInvitesAllowed,
            });
            onSuccess();
            handleClose();
        } catch (err: any) {
            setError(err.message || 'Failed to update group settings');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!isOwner) return;
        setLoading(true);
        try {
            await groupDetailsService.deleteGroup(group._id);
            onSuccess();
            handleClose();
        } catch (err: any) {
            setError(err.message || 'Failed to delete group');
            setLoading(false);
        }
    };

    const handleClose = () => {
        setName(group.name);
        setDescription(group.description || '');
        setMemberInvitesAllowed(group.memberInvitesAllowed ?? true);
        setError('');
        setShowDeleteConfirm(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative">
                <button onClick={handleClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center space-x-3 mb-6">
                    <Settings className="w-6 h-6 text-emerald-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Group Settings</h2>
                </div>

                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                {!showDeleteConfirm ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Group Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Group Name *
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                                placeholder="e.g., Roommates, Weekend Trip"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description (Optional)
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none"
                                placeholder="Add a description for this group..."
                            />
                        </div>

                        {/* Member Invites Setting */}
                        <div className="flex items-start space-x-3">
                            <input
                                type="checkbox"
                                id="memberInvites"
                                checked={memberInvitesAllowed}
                                onChange={(e) => setMemberInvitesAllowed(e.target.checked)}
                                className="mt-1 w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                            />
                            <div className="flex-1">
                                <label htmlFor="memberInvites" className="text-sm font-medium text-gray-900 cursor-pointer">
                                    Allow members to invite others
                                </label>
                                <p className="text-xs text-gray-500 mt-1">
                                    When enabled, any member can add new people to the group
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col space-y-3 pt-4">
                            <div className="flex space-x-3">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !name.trim()}
                                    className="flex-1 px-4 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>

                            {/* Delete Group Button (Owner only) */}
                            {isOwner && (
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="w-full px-4 py-3 border-2 border-red-200 text-red-600 font-semibold rounded-lg hover:bg-red-50 flex items-center justify-center space-x-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Delete Group</span>
                                </button>
                            )}
                        </div>
                    </form>
                ) : (
                    /* Delete Confirmation */
                    <div className="py-4">
                        <div className="mb-6">
                            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                <Trash2 className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 text-center mb-2">Delete Group?</h3>
                            <p className="text-gray-600 text-center">
                                This action cannot be undone. All expenses and balances in "{group.name}" will be permanently deleted.
                            </p>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={loading}
                                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={loading}
                                className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50"
                            >
                                {loading ? 'Deleting...' : 'Delete Group'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GroupSettingsModal;
