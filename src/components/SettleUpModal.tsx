import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { settlementService } from '../services/settlementService';
import { upiSettlementService } from '../services/upiSettlementService';
import { dashboardService, type DetailedBalance } from '../services/dashboardService';
import UpiPaymentModal from './UpiPaymentModal';
import { toast } from 'react-hot-toast';
import type { Balance } from '../types/common';

interface SettleUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  balances: Balance[];
  onSuccess: () => void;
  groupId?: string;
}

const SettleUpModal: React.FC<SettleUpModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  groupId,
}) => {
  const [balances, setBalances] = useState<DetailedBalance[]>([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi'>('cash');
  const [loading, setLoading] = useState(false);
  const [loadingBalances, setLoadingBalances] = useState(true);
  const [error, setError] = useState('');


  // UPI modal data
  const [isUpiModalOpen, setIsUpiModalOpen] = useState(false);
  const [upiPaymentData, setUpiPaymentData] = useState<{
    recipientName: string;
    recipientUpiId: string;
    amount: number;
    settlementId: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) loadBalances();
  }, [isOpen, groupId]);

  const loadBalances = async () => {
    setLoadingBalances(true);
    try {
      const data = await dashboardService.getDetailedBalances();
      setBalances(data.youOwe || []);
    } catch {
      setError('Failed to load balances');
    } finally {
      setLoadingBalances(false);
    }
  };

  if (!isOpen) return null;

  const selectedBalance = balances.find((b) => b.user._id === selectedUser);
  const maxAmount = selectedBalance?.amount || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const parsedAmount = parseFloat(amount);
      if (!parsedAmount || parsedAmount <= 0) {
        setError('Enter a valid amount.');
        return;
      }

      // ---- UPI flow ----
      if (paymentMethod === 'upi') {
        const response = await upiSettlementService.createUpiSettlement({
          paidTo: selectedUser,
          amount: parsedAmount,
          groupId,
        });

        setUpiPaymentData({
          recipientName: response.recipientName,
          recipientUpiId: response.recipientUpiId,
          amount: parsedAmount,
          settlementId: response.settlement._id,
        });

        setIsUpiModalOpen(true);
        return;
      }

      // ---- Cash flow ----
      await settlementService.createSettlement({
        paidTo: selectedUser,
        amount: parsedAmount,
        groupId,
        note,
      });

      toast.success('Settlement recorded!');

      // Reload balances to show updated data
      await loadBalances();

      onSuccess();
      handleClose();

    } catch (err: any) {
      const message = err?.response?.data?.message || err.message || 'Failed to create settlement';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedUser('');
    setAmount('');
    setNote('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-6">Settle Up</h2>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 p-3 rounded-lg text-red-800 text-sm">
            {error}
          </div>
        )}

        {loadingBalances ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-b-2 border-emerald-600 rounded-full"></div>
          </div>
        ) : balances.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl text-emerald-600">₹</span>
            </div>
            <h3 className="text-lg font-semibold">All settled up!</h3>
            <p className="text-gray-600">You don't owe anyone money.</p>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>

            {/* Select User */}
            <div>
              <label className="text-sm font-medium">Pay back *</label>
              <select
                className="w-full px-4 py-3 mt-2 rounded-lg border border-gray-300"
                value={selectedUser}
                onChange={(e) => {
                  setSelectedUser(e.target.value);
                  setAmount('');
                }}
                required
              >
                <option value="">Select a person...</option>
                {balances.map((b) => (
                  <option key={b.user._id} value={b.user._id}>
                    {b.user.name} — You owe ₹{b.amount.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            {selectedUser && (
              <div>
                <label className="text-sm font-medium">Amount (₹) *</label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">₹</span>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max={maxAmount}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300"
                    placeholder="0.00"
                  />
                </div>

                <div className="flex justify-between mt-1 text-sm">
                  <p className="text-gray-500">Max: ₹{maxAmount.toFixed(2)}</p>
                  <button
                    type="button"
                    onClick={() => setAmount(maxAmount.toString())}
                    className="text-emerald-600 hover:text-emerald-700"
                  >
                    Full amount
                  </button>
                </div>
              </div>
            )}

            {/* Payment Method */}
            {selectedUser && (
              <div>
                <label className="block text-sm font-medium mb-2">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as 'cash' | 'upi')}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300"
                >
                  <option value="cash">Cash</option>

                  {selectedBalance?.user?.upiId && (
                    <option value="upi">UPI Payment</option>
                  )}
                </select>

                {paymentMethod === 'upi' && selectedBalance?.user?.upiId && (
                  <p className="text-xs text-emerald-600 mt-1">
                    Pay via UPI → <strong>{selectedBalance.user.upiId}</strong>
                  </p>
                )}
              </div>
            )}

            {/* Note (cash only) */}
            {paymentMethod === 'cash' && selectedUser && (
              <div>
                <label className="block text-sm font-medium mb-2">Note (Optional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 resize-none"
                  placeholder="Add a note..."
                />
              </div>
            )}

            {/* Buttons */}
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!selectedUser || !amount || loading}
                className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
              >
                {loading ? 'Processing...' : paymentMethod === 'upi' ? 'Pay via UPI' : 'Record Settlement'}
              </button>
            </div>
          </form>
        )}

        {/* UPI Modal */}
        {upiPaymentData && (
          <UpiPaymentModal
            isOpen={isUpiModalOpen}
            onClose={() => {
              setIsUpiModalOpen(false);
              setUpiPaymentData(null);
            }}
            recipientName={upiPaymentData.recipientName}
            recipientUpiId={upiPaymentData.recipientUpiId}
            amount={upiPaymentData.amount}
            settlementId={upiPaymentData.settlementId}
            onPaymentConfirmed={async () => {
              try {
                await upiSettlementService.confirmUpiPayment(upiPaymentData.settlementId);
                toast.success('Payment confirmed!');
                setIsUpiModalOpen(false);
                setUpiPaymentData(null);
                onSuccess();
                handleClose();
              } catch (error: any) {
                toast.error(error.message || 'Failed to confirm payment');
              }
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SettleUpModal;
