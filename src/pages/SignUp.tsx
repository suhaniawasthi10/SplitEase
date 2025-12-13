import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { signUpSchema, type SignUpFormData } from '../schemas/authSchemas';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { signUpUser, clearError } from '../store/authSlice';
import { useTheme } from '../contexts/ThemeContext';

const SignUp: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user, loading, error } = useAppSelector((state) => state.auth);
    const { theme, toggleTheme } = useTheme();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
    });

    // Redirect if user is already logged in
    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    // Clear error when component unmounts
    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const onSubmit = async (data: SignUpFormData) => {
        try {
            await dispatch(signUpUser(data)).unwrap();
            navigate('/dashboard');
        } catch (error) {
            // Error is handled by Redux
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                {/* Header with back link and theme toggle */}
                <div className="flex items-center justify-between mb-8">
                    <Link
                        to="/"
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to home
                    </Link>
                    <button
                        onClick={toggleTheme}
                        className="p-2 text-gray-600 hover:bg-white/50 rounded-lg transition-colors"
                        aria-label="Toggle theme"
                    >
                        {theme === 'light' ? (
                            <Moon className="w-5 h-5" />
                        ) : (
                            <Sun className="w-5 h-5" />
                        )}
                    </button>
                </div>

                {/* Sign Up Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <div className="w-14 h-14 bg-emerald-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">SE</span>
                        </div>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Create your account
                        </h2>
                        <p className="text-gray-600">
                            Start managing expenses with your friends
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Name Input */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Full Name
                            </label>
                            <input
                                {...register('name')}
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200 outline-none"
                                placeholder="Enter your full name"
                            />
                            {errors.name && (
                                <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Username Input */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <input
                                {...register('username')}
                                type="text"
                                autoComplete="username"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200 outline-none"
                                placeholder="Choose a username"
                            />
                            {errors.username && (
                                <p className="mt-2 text-sm text-red-600">{errors.username.message}</p>
                            )}
                        </div>

                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                {...register('email')}
                                type="email"
                                autoComplete="email"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200 outline-none"
                                placeholder="Enter your email"
                            />
                            {errors.email && (
                                <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                {...register('password')}
                                type="password"
                                autoComplete="new-password"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200 outline-none"
                                placeholder="Create a password"
                            />
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
                            )}
                        </div>

                        {/* Confirm Password Input */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <input
                                {...register('confirmPassword')}
                                type="password"
                                autoComplete="new-password"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200 outline-none"
                                placeholder="Confirm your password"
                            />
                            {errors.confirmPassword && (
                                <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 shadow-lg shadow-emerald-600/30"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating account...
                                </span>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    {/* Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="text-emerald-600 font-semibold hover:text-emerald-700"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Trust Badge */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        Join 1000+ friend groups already using SplitEase
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
