import React, { useState } from 'react';
import { X, CreditCard, CheckCircle, AlertCircle } from 'lucide-react';

interface UpiPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    recipientName: string;
    recipientUpiId: string;
    amount: number;
    settlementId: string;
    onPaymentConfirmed: (transactionId?: string) => Promise<void>;
    onPaymentCancelled?: () => Promise<void>;  // optional callback
}

const UpiPaymentModal: React.FC<UpiPaymentModalProps> = ({
    isOpen,
    onClose,
    recipientName,
    recipientUpiId,
    amount,
    settlementId: _settlementId,
    onPaymentConfirmed,
    onPaymentCancelled
}) => {
    const [paymentInitiated, setPaymentInitiated] = useState(false);
    const [transactionId, setTransactionId] = useState('');
    const [confirming, setConfirming] = useState(false);

    if (!isOpen) return null;

    const handlePayViaUpi = () => {
        const upiUrl = `upi://pay?pa=${recipientUpiId}&pn=${encodeURIComponent(
            recipientName
        )}&am=${amount}&cu=INR&tn=${encodeURIComponent('SplitEase Settlement')}`;

        window.location.href = upiUrl;
        setPaymentInitiated(true);
    };

    const handleConfirmPayment = async () => {
        setConfirming(true);
        try {
            await onPaymentConfirmed(transactionId.trim() || undefined);
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setConfirming(false);
        }
    };

    const handleCancel = async () => {
        setPaymentInitiated(false);
        setTransactionId('');

        // optional cancel callback to backend
        if (onPaymentCancelled) {
            try {
                await onPaymentCancelled();
            } catch (err) {
                console.error("Failed to cancel UPI payment:", err);
            }
        }

        onClose();
    };

    const handleRetry = () => {
        setTransactionId('');
        setPaymentInitiated(false);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">

                <button
                    onClick={handleCancel}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                    <X className="w-5 h-5" />
                </button>

                {!paymentInitiated ? (
                    <>
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-purple-100 mx-auto rounded-full flex items-center justify-center mb-4">
                                <CreditCard className="w-8 h-8 text-purple-600" />
                            </div>
                            <h2 className="text-2xl font-bold">Pay via UPI</h2>
                            <p className="text-gray-600">Complete payment using your UPI app</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Recipient:</span>
                                <span className="font-semibold">{recipientName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">UPI ID:</span>
                                <span className="font-mono">{recipientUpiId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Amount:</span>
                                <span className="text-2xl font-bold text-emerald-600">₹{amount}</span>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-300 rounded-lg p-3 mb-6">
                            <p className="text-sm text-blue-800 flex items-start">
                                <AlertCircle className="w-4 h-4 mr-2 mt-0.5" />
                                Clicking “Pay Now” will open your UPI app. Complete the payment, then return here to confirm.
                            </p>
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={handleCancel}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handlePayViaUpi}
                                className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 shadow-lg"
                            >
                                Pay Now
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-emerald-100 mx-auto rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h2 className="text-2xl font-bold">Confirm Payment</h2>
                            <p className="text-gray-600">Have you completed the payment?</p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <label className="block text-sm font-medium mb-2">
                                UPI Transaction ID (Optional)
                            </label>
                            <input
                                type="text"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                placeholder="e.g., 123456789012"
                                className="w-full px-3 py-2 border rounded-lg focus:ring-emerald-500"
                            />
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={handleRetry}
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                            >
                                Try Again
                            </button>

                            <button
                                onClick={handleConfirmPayment}
                                disabled={confirming}
                                className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-50"
                            >
                                {confirming ? 'Confirming...' : "Yes, I've Paid"}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default UpiPaymentModal;
