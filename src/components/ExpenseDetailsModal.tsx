import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { expenseService } from '../services/expenseService';
import { showSuccess, showError } from '../utils/toast';
import ConfirmDialog from './ConfirmDialog';
import type { Expense } from '../types/models';

interface ExpenseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  expense: Expense;
  currentUserId: string;
  onSuccess: () => void;
}

const ExpenseDetailsModal: React.FC<ExpenseDetailsModalProps> = ({
  isOpen,
  onClose,
  expense,
  currentUserId,
  onSuccess,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const isPayer = expense.paidBy._id === currentUserId;

  const handleDelete = async () => {
    setError('');
    setIsDeleting(true);
    try {
      await expenseService.deleteExpense(expense._id);
      showSuccess('Expense deleted successfully');
      onSuccess();
      onClose();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || 'Failed to delete expense';
      setError(errorMsg);
      showError(errorMsg);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Expense Details</h2>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Expense Info */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
            <p className="text-lg font-semibold text-gray-900">{expense.description}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Amount</label>
            <p className="text-2xl font-bold text-emerald-600">${expense.amount.toFixed(2)}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Paid By</label>
            <p className="text-base font-medium text-gray-900">{expense.paidBy.name}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Split Type</label>
            <p className="text-base text-gray-900 capitalize">{expense.splitType}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Date</label>
            <p className="text-base text-gray-900">{new Date(expense.createdAt).toLocaleString()}</p>
          </div>

          {/* Participants */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">Split Details</label>
            <div className="space-y-2">
              {expense.participants.map((participant) => (
                <div key={participant.userId._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">{participant.userId.name}</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {expense.splitType === 'percentage'
                      ? `${participant.share.toFixed(1)}%`
                      : `$${participant.share.toFixed(2)}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {isPayer && (
          <div className="flex space-x-3 pt-4 border-t">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        )}

        {!isPayer && (
          <p className="text-sm text-gray-500 italic pt-4 border-t">
            Only the payer can delete this expense.
          </p>
        )}
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Expense?"
        message="Are you sure you want to delete this expense? This action cannot be undone and will affect all participants."
        confirmText="Delete Expense"
        isDestructive={true}
        loading={isDeleting}
      />
    </div>
  );
};

export default ExpenseDetailsModal;
