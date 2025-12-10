import React, { useState } from 'react';
import { X } from 'lucide-react';
import { expenseService } from '../services/expenseService';
import type { GroupMember } from '../types/models';
import type { CreateExpenseData } from '../services/expenseService';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: string;
  members: GroupMember[];
  currentUserId: string;
  onSuccess: () => void;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  groupId,
  members,
  currentUserId,
  onSuccess,
}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [splitType, setSplitType] = useState<'equal' | 'exact' | 'percentage'>('equal');
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set([currentUserId]));
  const [customShares, setCustomShares] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleMemberToggle = (userId: string) => {
    const newSelected = new Set(selectedMembers);
    if (userId === currentUserId) return; // Payer always included
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedMembers(newSelected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const participants = Array.from(selectedMembers).map(userId => {
        const share = customShares[userId];
        return {
          userId,
          ...(share && splitType !== 'equal' ? { share: parseFloat(share) } : {})
        };
      });

      const expenseData: CreateExpenseData = {
        description,
        amount: parseFloat(amount),
        splitType,
        participants,
        groupId,
      };

      await expenseService.createExpense(expenseData);
      onSuccess();
      handleClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create expense');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setDescription('');
    setAmount('');
    setSplitType('equal');
    setSelectedMembers(new Set([currentUserId]));
    setCustomShares({});
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button onClick={handleClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Add Expense</h2>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              placeholder="e.g., Dinner, Groceries, Rent"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount ($) *</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              placeholder="0.00"
            />
          </div>

          {/* Split Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Split Type</label>
            <div className="grid grid-cols-3 gap-3">
              {(['equal', 'exact', 'percentage'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSplitType(type)}
                  className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                    splitType === type
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Participants */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Split with</label>
            <div className="space-y-2">
              {members.map((member) => {
                const userId = member.userId._id;
                const isSelected = selectedMembers.has(userId);
                const isPayer = userId === currentUserId;

                return (
                  <div key={userId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleMemberToggle(userId)}
                        disabled={isPayer}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <span className="text-sm font-medium">
                        {member.userId.name} {isPayer && '(You - Payer)'}
                      </span>
                    </div>

                    {/* Custom Share Input */}
                    {isSelected && splitType !== 'equal' && (
                      <input
                        type="number"
                        step="0.01"
                        value={customShares[userId] || ''}
                        onChange={(e) => setCustomShares({ ...customShares, [userId]: e.target.value })}
                        placeholder={splitType === 'percentage' ? '%' : '$'}
                        className="w-24 px-3 py-1 text-sm rounded border border-gray-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                      />
                    )}
                  </div>
                );
              })}
            </div>
            {splitType !== 'equal' && (
              <p className="mt-2 text-xs text-gray-500">
                💡 Leave blank to auto-calculate remaining amount equally among unmarked participants
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !description || !amount || selectedMembers.size === 0}
              className="flex-1 px-4 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;
