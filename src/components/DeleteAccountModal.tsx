import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { showSuccess, showError } from '../utils/toast';
import { userService } from '../services/userService';

interface DeleteAccountModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
}) => {
    const [password, setPassword] = useState('');
    const [confirmText, setConfirmText] = useState('');
    const [understood, setUnderstood] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleDelete = async () => {
        setError('');

        // Validation
        if (!password) {
            setError('Please enter your password');
            return;
        }

        if (confirmText !== 'DELETE') {
            setError('Please type DELETE to confirm');
            return;
        }

        if (!understood) {
            setError('Please confirm you understand this action cannot be undone');
            return;
        }

        setLoading(true);
        try {
            await userService.deleteAccount(password);
            showSuccess('Account deleted successfully');
            onSuccess();
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Failed to delete account';
            setError(errorMsg);
            showError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setPassword('');
        setConfirmText('');
        setUnderstood(false);
        setError('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                    disabled={loading}
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Delete Account</h2>
                </div>

                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                <div className="mb-6 space-y-3">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-sm text-red-800 font-semibold mb-2">⚠️ Warning: This action is permanent!</p>
                        <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                            <li>Your account will be permanently deleted</li>
                            <li>All your data will be removed</li>
                            <li>You will be removed from all groups</li>
                            <li>All friendships will be deleted</li>
                            <li>This action cannot be undone</li>
                        </ul>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-800 font-semibold mb-1">📋 Before you proceed:</p>
                        <p className="text-sm text-yellow-700">
                            Make sure you have settled all outstanding balances. Accounts with pending debts cannot be deleted.
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Password Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Enter your password to confirm *
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none disabled:opacity-50"
                            placeholder="Your password"
                        />
                    </div>

                    {/* Confirmation Text */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type <span className="font-bold text-red-600">DELETE</span> to confirm *
                        </label>
                        <input
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            disabled={loading}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none disabled:opacity-50"
                            placeholder="Type DELETE"
                        />
                    </div>

                    {/* Checkbox Confirmation */}
                    <div className="flex items-start space-x-3">
                        <input
                            type="checkbox"
                            id="understood"
                            checked={understood}
                            onChange={(e) => setUnderstood(e.target.checked)}
                            disabled={loading}
                            className="mt-1 w-4 h-4 text-red-600 rounded focus:ring-red-500"
                        />
                        <label htmlFor="understood" className="text-sm text-gray-700">
                            I understand this action is permanent and cannot be undone
                        </label>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex space-x-3 mt-6">
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={loading || !password || confirmText !== 'DELETE' || !understood}
                        className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? 'Deleting...' : 'Delete Account'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteAccountModal;
