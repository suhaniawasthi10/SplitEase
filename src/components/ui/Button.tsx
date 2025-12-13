import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    icon,
    onClick,
    type = 'button',
    className = '',
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

    const variantStyles = {
        primary: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow-md',
        secondary: 'bg-gray-600 text-white hover:bg-gray-700 shadow-sm hover:shadow-md',
        outline: 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50',
        ghost: 'text-gray-700 hover:bg-gray-100',
        danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md',
    };

    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={combinedClassName}
        >
            {loading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                </>
            ) : (
                <>
                    {icon && <span className="mr-2">{icon}</span>}
                    {children}
                </>
            )}
        </button>
    );
};

export default Button;
