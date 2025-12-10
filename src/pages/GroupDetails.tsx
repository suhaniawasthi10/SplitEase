import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Plus, Settings as SettingsIcon } from 'lucide-react';
import Navbar from '../components/Navbar';
import AddExpenseModal from '../components/AddExpenseModal';
import AddMemberModal from '../components/AddMemberModal';
import ExpenseDetailsModal from '../components/ExpenseDetailsModal';
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
      console.error('Failed to load group:', error);
    } finally {
      setLoading(false);
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
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <SettingsIcon className="w-5 h-5 text-gray-600" />
            </button>
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
                {group.members?.map((member) => (
                  <div key={member.userId._id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="text-emerald-700 font-semibold text-xs">
                          {member.userId.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm font-medium">{member.userId.name}</span>
                    </div>
                    {member.role !== 'member' && (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">{member.role}</span>
                    )}
                  </div>
                ))}
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
                    <span className="text-sm font-semibold text-red-600">${userBalance.youOwe.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">You're owed</span>
                    <span className="text-sm font-semibold text-emerald-600">${userBalance.youreOwed.toFixed(2)}</span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold">Net Balance</span>
                      <span className={`text-sm font-bold ${userBalance.netBalance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        ${Math.abs(userBalance.netBalance).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                  Settle Up
                </button>
              </div>
            )}
          </div>

          {/* Main Content - Expenses */}
          <div className="lg:col-span-3">
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
                          <p className="font-bold text-lg">${expense.amount.toFixed(2)}</p>
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
    </div>
  );
};

export default GroupDetails;
