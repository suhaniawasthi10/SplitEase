import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import { groupDetailsService } from '../services/groupDetailsService';
import { useSelector } from 'react-redux';
import type { RootState } from '../store/store';

const AcceptInvite: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'pending' | 'accepted' | 'rejected' | 'error'>('pending');
  const [message, setMessage] = useState('');
  const [groupId, setGroupId] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { from: `/invite/${token}` } });
    }
  }, [currentUser, navigate, token]);

  const handleAccept = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const result = await groupDetailsService.acceptInvite(token);
      setStatus('accepted');
      setMessage(result.message);
      setGroupId(result.group._id);
    } catch (err: any) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Failed to accept invite');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const result = await groupDetailsService.rejectInvite(token);
      setStatus('rejected');
      setMessage(result.message);
    } catch (err: any) {
      setStatus('error');
      setMessage(err.response?.data?.message || 'Failed to reject invite');
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {status === 'pending' && (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Group Invitation</h1>
              <p className="text-gray-600 mb-8">
                You've been invited to join a group. Would you like to accept this invitation?
              </p>
              
              <div className="flex space-x-4">
                <button
                  onClick={handleAccept}
                  disabled={loading}
                  className="flex-1 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Accepting...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Accept Invitation</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleReject}
                  disabled={loading}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Rejecting...</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5" />
                      <span>Decline</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}

          {status === 'accepted' && (
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to the Group!</h1>
              <p className="text-gray-600 mb-8">{message}</p>
              
              <button
                onClick={() => navigate(`/groups/${groupId}`)}
                className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700"
              >
                Go to Group
              </button>
            </div>
          )}

          {status === 'rejected' && (
            <div className="text-center">
              <XCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Invitation Declined</h1>
              <p className="text-gray-600 mb-8">{message}</p>
              
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700"
              >
                Back to Dashboard
              </button>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Error</h1>
              <p className="text-gray-600 mb-8">{message}</p>
              
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcceptInvite;
