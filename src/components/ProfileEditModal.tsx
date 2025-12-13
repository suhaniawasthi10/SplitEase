import React, { useState, useEffect, useRef } from 'react';
import { X, User, Camera, Trash2 } from 'lucide-react';
import { userService, type UpdateUserData } from '../services/userService';
import { useAppDispatch } from '../store/hooks';
import { updateUserProfile } from '../store/authSlice';
import { CURRENCIES } from '../utils/currency';

interface ProfileEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: {
        id: string;
        name: string;
        username: string;
        email: string;
        preferredCurrency?: string;
        upiId?: string;
        profileImage?: {
            url: string | null;
            publicId: string | null;
        };
    };
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
    isOpen,
    onClose,
    currentUser,
}) => {
    const dispatch = useAppDispatch();
    const [name, setName] = useState(currentUser.name);
    const [username, setUsername] = useState(currentUser.username);
    const [email, setEmail] = useState(currentUser.email);
    const [preferredCurrency, setPreferredCurrency] = useState(currentUser.preferredCurrency || 'USD');
    const [upiId, setUpiId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(currentUser.profileImage?.url || null);
    const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
    const [pendingImageDelete, setPendingImageDelete] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setName(currentUser.name);
            setUsername(currentUser.username);
            setEmail(currentUser.email);
            setPreferredCurrency(currentUser.preferredCurrency || 'USD');
            setUpiId(currentUser.upiId || '');
            setImagePreview(currentUser.profileImage?.url || null);
            setPendingImageFile(null);
            setPendingImageDelete(false);
            setError('');
            setSuccess(false);
        }
    }, [isOpen, currentUser]);

    if (!isOpen) return null;

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Please select an image file');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Image size must be less than 5MB');
            return;
        }

        setError('');
        setPendingImageFile(file);
        setPendingImageDelete(false);

        // Show preview immediately
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleDeleteImage = () => {
        setImagePreview(null);
        setPendingImageFile(null);
        setPendingImageDelete(true);
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);

        try {
            // Check if there are any changes
            const hasProfileChanges = name !== currentUser.name ||
                username !== currentUser.username ||
                email !== currentUser.email ||
                preferredCurrency !== (currentUser.preferredCurrency || 'USD') ||
                upiId !== (currentUser.upiId || '');
            const hasImageChanges = pendingImageFile !== null || pendingImageDelete;

            if (!hasProfileChanges && !hasImageChanges) {
                setError('No changes to save');
                setLoading(false);
                return;
            }

            let updatedProfileImage = currentUser.profileImage;

            // Handle image upload
            if (pendingImageFile) {
                const imageResponse = await userService.uploadProfileImage(pendingImageFile);
                updatedProfileImage = imageResponse.user.profileImage;
            }

            // Handle image deletion
            if (pendingImageDelete && currentUser.profileImage?.url) {
                await userService.deleteProfileImage();
                updatedProfileImage = { url: null, publicId: null };
            }

            // Handle profile updates
            if (hasProfileChanges) {
                const updates: UpdateUserData = {};
                if (name !== currentUser.name) updates.name = name;
                if (username !== currentUser.username) updates.username = username;
                if (preferredCurrency !== (currentUser.preferredCurrency || 'USD')) updates.preferredCurrency = preferredCurrency;

                // Handle UPI ID separately
                if (upiId !== (currentUser.upiId || '')) {
                    await userService.updateUpiId(upiId);
                }

                const response = await userService.updateProfile(updates);

                // Update Redux state with ALL user data explicitly
                dispatch(updateUserProfile({
                    ...response.user,
                    upiId: upiId, // Explicitly include UPI ID since it's updated separately
                    preferredCurrency: preferredCurrency, // Explicitly include currency
                    profileImage: updatedProfileImage // Explicitly include image
                }));
            } else {
                // Only image changed, update Redux state with complete user data
                dispatch(updateUserProfile({
                    ...currentUser,
                    upiId: upiId,
                    profileImage: updatedProfileImage
                }));
            }

            setSuccess(true);
            setPendingImageFile(null);
            setPendingImageDelete(false);
            setTimeout(() => {
                handleClose();
            }, 1500);
        } catch (err: any) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setName(currentUser.name);
        setUsername(currentUser.username);
        setEmail(currentUser.email);
        setPreferredCurrency(currentUser.preferredCurrency || 'USD');
        setImagePreview(currentUser.profileImage?.url || null);
        setPendingImageFile(null);
        setPendingImageDelete(false);
        setError('');
        setSuccess(false);
        onClose();
    };

    const getInitials = () => {
        return currentUser.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative max-h-[90vh] overflow-y-auto">
                <button onClick={handleClose} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center space-x-3 mb-6">
                    <User className="w-6 h-6 text-emerald-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
                </div>

                {error && (
                    <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-800">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                        <p className="text-sm text-emerald-800">Profile updated successfully!</p>
                    </div>
                )}

                {/* Profile Image Section */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Profile Picture
                    </label>
                    <div className="flex items-center space-x-4">
                        {/* Image Preview */}
                        <div className="relative">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full object-cover border-2 border-emerald-200"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center border-2 border-emerald-200">
                                    <span className="text-2xl font-bold text-emerald-700">{getInitials()}</span>
                                </div>
                            )}
                            {loading && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                </div>
                            )}
                        </div>

                        {/* Upload/Delete Buttons */}
                        <div className="flex flex-col space-y-2">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageSelect}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={loading}
                                className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center space-x-2"
                            >
                                <Camera className="w-4 h-4" />
                                <span>Upload Photo</span>
                            </button>
                            {imagePreview && (
                                <button
                                    type="button"
                                    onClick={handleDeleteImage}
                                    disabled={loading}
                                    className="px-4 py-2 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50 disabled:opacity-50 flex items-center space-x-2"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span>Remove</span>
                                </button>
                            )}
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Max size: 5MB. Format: JPG, PNG, WEBP</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                            placeholder="Your full name"
                        />
                    </div>

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Username *
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">@</span>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                                required
                                className="w-full pl-8 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                                placeholder="username"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Lowercase letters, numbers, and underscores only</p>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email *
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                            placeholder="your@email.com"
                        />
                    </div>

                    {/* Preferred Currency */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Preferred Currency
                        </label>
                        <select
                            value={preferredCurrency}
                            onChange={(e) => setPreferredCurrency(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                        >
                            {CURRENCIES.map((currency) => (
                                <option key={currency.code} value={currency.code}>
                                    {currency.symbol} {currency.code} - {currency.name}
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">This will be used as the default currency for your expenses</p>
                    </div>

                    {/* Buttons */}
                    <div className="flex space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || success}
                            className="flex-1 px-4 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Saving...' : success ? 'Saved!' : 'Save Changes'}
                        </button>
                    </div>

                    {/* UPI ID */}
                    <div>
                        <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-2">
                            UPI ID (Optional)
                        </label>
                        <input
                            id="upiId"
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            pattern="[a-zA-Z0-9._\-]+@[a-zA-Z0-9]+"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                            placeholder="yourname@paytm"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            💳 Enter your UPI ID to receive payments (e.g., john@paytm, alice@hdfcbank, user@ybl)
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileEditModal;
