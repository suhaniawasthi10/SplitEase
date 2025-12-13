import React from 'react';

interface EmptyStateProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
    icon,
    title,
    description,
    action,
    className = '',
}) => {
    return (
        <div className={`text-center py-12 ${className}`}>
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
            {action && (
                <button
                    onClick={action.onClick}
                    className="inline-flex items-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                >
                    {action.label}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
