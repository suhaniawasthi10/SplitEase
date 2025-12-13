import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { loginSchema, type LoginFormData } from '../schemas/authSchemas';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { loginUser, clearError } from '../store/authSlice';
import { useTheme } from '../contexts/ThemeContext';

const Login: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user, loading, error } = useAppSelector((state) => state.auth);
    const { theme, toggleTheme } = useTheme();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
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

    const onSubmit = async (data: LoginFormData) => {
        try {
            await dispatch(loginUser(data)).unwrap();
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

                {/* Login Card */}
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
                            Welcome back
                        </h2>
                        <p className="text-gray-600">
                            Sign in to continue managing your expenses
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                                placeholder="Enter your username"
                            />
                            {errors.username && (
                                <p className="mt-2 text-sm text-red-600">{errors.username.message}</p>
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
                                autoComplete="current-password"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200 outline-none"
                                placeholder="Enter your password"
                            />
                            {errors.password && (
                                <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
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
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Sign Up Link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{' '}
                            <Link
                                to="/signup"
                                className="text-emerald-600 font-semibold hover:text-emerald-700"
                            >
                                Create one
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Trust Badge */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        Trusted by 1000+ friend groups worldwide
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
