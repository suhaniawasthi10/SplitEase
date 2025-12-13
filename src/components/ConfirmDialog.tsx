import React from 'react';
import { X } from 'lucide-react';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmButtonClass?: string;
    isDestructive?: boolean;
    loading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    confirmButtonClass,
    isDestructive = false,
    loading = false,
}) => {
    if (!isOpen) return null;

    const defaultConfirmClass = isDestructive
        ? 'bg-red-600 hover:bg-red-700'
        : 'bg-emerald-600 hover:bg-emerald-700';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                    disabled={loading}
                >
                    <X className="w-5 h-5" />
                </button>

                <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
                <p className="text-gray-600 mb-6">{message}</p>

                <div className="flex space-x-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`flex-1 px-4 py-3 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${confirmButtonClass || defaultConfirmClass
                            }`}
                    >
                        {loading ? 'Processing...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
