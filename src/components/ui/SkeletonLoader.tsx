import React from 'react';

interface SkeletonLoaderProps {
    variant?: 'card' | 'list' | 'text' | 'avatar' | 'chart';
    count?: number;
    className?: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
    variant = 'card',
    count = 1,
    className = '',
}) => {
    const renderSkeleton = () => {
        switch (variant) {
            case 'card':
                return (
                    <div className={`bg-white rounded-xl p-6 border border-gray-200 ${className}`}>
                        <div className="animate-pulse space-y-4">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-3 bg-gray-200 rounded"></div>
                                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                            </div>
                        </div>
                    </div>
                );

            case 'list':
                return (
                    <div className={`bg-white rounded-lg p-4 border border-gray-200 ${className}`}>
                        <div className="animate-pulse flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                            <div className="h-6 w-16 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                );

            case 'text':
                return (
                    <div className={`animate-pulse space-y-2 ${className}`}>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                    </div>
                );

            case 'avatar':
                return (
                    <div className={`animate-pulse ${className}`}>
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    </div>
                );

            case 'chart':
                return (
                    <div className={`bg-white rounded-xl p-6 border border-gray-200 ${className}`}>
                        <div className="animate-pulse space-y-4">
                            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-64 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <React.Fragment key={index}>
                    {renderSkeleton()}
                </React.Fragment>
            ))}
        </>
    );
};

export default SkeletonLoader;
