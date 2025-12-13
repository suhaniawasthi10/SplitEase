import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Plus, LogOut, MoreVertical, UserMinus } from 'lucide-react';
import { formatCurrency } from '../utils/currency';
import Navbar from '../components/Navbar';
import AddExpenseModal from '../components/AddExpenseModal';
import AddMemberModal from '../components/AddMemberModal';
import ExpenseDetailsModal from '../components/ExpenseDetailsModal';
import GroupSettingsModal from '../components/GroupSettingsModal';
import GroupStatistics from '../components/GroupStatistics';
import { groupDetailsService } from '../services/groupDetailsService';
import type { GroupDetails as GroupDetailsType, UserBalance, Expense } from '../types/models';
import type { RootState } from '../store/store';
import { useSelector } from 'react-redux';

const GroupDetails: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [group, setGroup] = useState<GroupDetailsType | null>(null);
  const [userBalance, setUserBalance] = useState<UserBalance | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<{ id: string; name: string } | null>(null);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    loadGroupData();
  }, [groupId]);

  const loadGroupData = async () => {
    if (!groupId) return;
    setLoading(true);
    try {
      const [detailsData, expensesData] = await Promise.all([
        groupDetailsService.getGroupDetails(groupId),
        groupDetailsService.getGroupExpenses(groupId, 20, 0)
      ]);
      setGroup(detailsData.group);
      setUserBalance(detailsData.userBalance);
      setExpenses(expensesData.expenses);
    } catch (error) {
      // Silent fail - group loading errors are shown in UI
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveGroup = async () => {
    if (!groupId) return;
    try {
      await groupDetailsService.leaveGroup(groupId);
      navigate('/groups');
    } catch (error) {
      alert('Failed to leave group. Please try again.');
    }
  };

  const handleRemoveMember = async () => {
    if (!groupId || !memberToRemove) return;
    try {
      await groupDetailsService.removeMemberFromGroup(groupId, memberToRemove.id);
      await loadGroupData();
      setMemberToRemove(null);
    } catch (error) {
      alert('Failed to remove member. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </div>
    );
  }

  if (!group) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button onClick={() => navigate('/groups')} className="flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Groups
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
              {group.description && <p className="text-gray-600 mt-1">{group.description}</p>}
            </div>
            <div className="relative">
              <button
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>

              {showSettingsMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <button
                    onClick={() => {
                      setShowSettingsModal(true);
                      setShowSettingsMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Group Settings
                  </button>
                  <button
                    onClick={() => {
                      setShowLeaveDialog(true);
                      setShowSettingsMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Leave Group
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Members */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Members ({group.members?.length || 0})
                </h3>
              </div>
              <div className="space-y-3">
                {group.members?.map((member) => {
                  const isCurrentUser = member.userId._id === currentUser?.id;
                  const isOwner = group.createdBy === currentUser?.id;
                  const canRemove = isOwner && !isCurrentUser;

                  return (
                    <div key={member.userId._id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {member.userId.profileImage?.url ? (
                          <img
                            src={member.userId.profileImage.url}
                            alt={member.userId.name}
                            className="w-8 h-8 rounded-full object-cover border border-emerald-200"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                            <span className="text-emerald-700 font-semibold text-xs">
                              {member.userId.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <span className="text-sm font-medium">{member.userId.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {member.role !== 'member' && (
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded">{member.role}</span>
                        )}
                        {canRemove && (
                          <button
                            onClick={() => setMemberToRemove({ id: member.userId._id, name: member.userId.name })}
                            className="text-red-600 hover:text-red-700 p-1"
                            title="Remove member"
                          >
                            <UserMinus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <button onClick={() => setIsAddMemberOpen(true)} className="w-full mt-4 px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg hover:border-emerald-500 hover:text-emerald-600">
                + Add Member
              </button>
            </div>

            {/* Balance */}
            {userBalance && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-bold text-gray-900 mb-4">Your Balance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">You owe</span>
                    <span className="text-sm font-semibold text-red-600">{formatCurrency(userBalance.youOwe, currentUser?.preferredCurrency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">You're owed</span>
                    <span className="text-sm font-semibold text-emerald-600">{formatCurrency(userBalance.youreOwed, currentUser?.preferredCurrency)}</span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold">Net Balance</span>
                      <span className={`text-sm font-bold ${userBalance.netBalance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {formatCurrency(Math.abs(userBalance.netBalance), currentUser?.preferredCurrency)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Balance Details Breakdown */}
                {userBalance.balanceDetails && userBalance.balanceDetails.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wide">Details</h4>
                    <div className="space-y-2">
                      {userBalance.balanceDetails.map((detail: any, index: number) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${detail.type === 'owes' ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
                            <span className="text-gray-700">
                              {detail.type === 'owes' ? 'You owe:' : 'Owes you:'}
                            </span>
                            <span className="font-medium text-gray-900">{detail.user.name}</span>
                          </div>
                          <span className={`font-semibold ${detail.type === 'owes' ? 'text-red-600' : 'text-emerald-600'}`}>
                            {formatCurrency(detail.amount, currentUser?.preferredCurrency)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Main Content - Expenses */}
          <div className="lg:col-span-3 space-y-6">
            {/* Expenses Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Expenses</h2>
                <button onClick={() => setIsAddExpenseOpen(true)} className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Expense
                </button>
              </div>

              {expenses.length > 0 ? (
                <div className="space-y-3">
                  {expenses.map((expense) => (
                    <div
                      key={expense._id}
                      onClick={() => setSelectedExpense(expense)}
                      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">{expense.description}</h4>
                          <p className="text-sm text-gray-600">
                            Paid by {expense.paidBy.name} • {new Date(expense.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">{formatCurrency(expense.amount, currentUser?.preferredCurrency)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No expenses yet</p>
                  <button onClick={() => setIsAddExpenseOpen(true)} className="mt-4 inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Expense
                  </button>
                </div>
              )}
            </div>

            {/* Group Statistics */}
            {groupId && (
              <GroupStatistics groupId={groupId} userCurrency={currentUser?.preferredCurrency} />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {currentUser && group.members && (
        <>
          <AddExpenseModal
            isOpen={isAddExpenseOpen}
            onClose={() => setIsAddExpenseOpen(false)}
            groupId={groupId!}
            members={group.members}
            currentUserId={currentUser.id}
            onSuccess={loadGroupData}
          />
          <AddMemberModal
            isOpen={isAddMemberOpen}
            onClose={() => setIsAddMemberOpen(false)}
            groupId={groupId!}
            existingMemberIds={group.members.map(m => m.userId._id)}
            onSuccess={loadGroupData}
          />
          {selectedExpense && (
            <ExpenseDetailsModal
              isOpen={true}
              onClose={() => setSelectedExpense(null)}
              expense={selectedExpense}
              currentUserId={currentUser.id}
              onSuccess={loadGroupData}
            />
          )}
        </>
      )}

      {/* Leave Group Confirmation Dialog */}
      {showLeaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Leave Group?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to leave "{group?.name}"? You'll lose access to all group expenses and balances.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLeaveDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleLeaveGroup}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700"
              >
                Leave Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Group Settings Modal */}
      {group && (
        <GroupSettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          group={group}
          onSuccess={() => {
            loadGroupData();
            navigate('/groups');
          }}
          isOwner={group.createdBy === currentUser?.id}
        />
      )}

      {/* Remove Member Confirmation Dialog */}
      {memberToRemove && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Remove Member?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove <strong>{memberToRemove.name}</strong> from this group? They will lose access to all group expenses.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setMemberToRemove(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveMember}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700"
              >
                Remove Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupDetails;
