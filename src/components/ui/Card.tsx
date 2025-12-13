import React from 'react';

interface CardProps {
    children: React.ReactNode;
    variant?: 'default' | 'elevated' | 'outlined';
    interactive?: boolean;
    onClick?: () => void;
    className?: string;
}

const Card: React.FC<CardProps> = ({
    children,
    variant = 'default',
    interactive = false,
    onClick,
    className = '',
}) => {
    const baseStyles = 'rounded-xl p-6 transition-all duration-200';

    const variantStyles = {
        default: 'bg-white border border-gray-200',
        elevated: 'bg-white shadow-lg hover:shadow-xl border border-gray-100',
        outlined: 'bg-transparent border-2 border-gray-200',
    };

    const interactiveStyles = interactive
        ? 'cursor-pointer hover:-translate-y-1 active:scale-[0.98]'
        : '';

    return (
        <div
            className={`${baseStyles} ${variantStyles[variant]} ${interactiveStyles} ${className}`}
            onClick={onClick}
            role={interactive ? 'button' : undefined}
            tabIndex={interactive ? 0 : undefined}
            onKeyDown={interactive ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick?.();
                }
            } : undefined}
        >
            {children}
        </div>
    );
};

export default Card;
