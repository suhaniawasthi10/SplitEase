import toast from 'react-hot-toast';

// Toast configuration
const toastConfig = {
    duration: 4000,
    position: 'top-right' as const,
    style: {
        borderRadius: '12px',
        padding: '12px 16px',
    },
};

// Success toast
export const showSuccess = (message: string) => {
    toast.success(message, {
        ...toastConfig,
        style: {
            ...toastConfig.style,
            background: '#10b981',
            color: '#ffffff',
        },
        iconTheme: {
            primary: '#ffffff',
            secondary: '#10b981',
        },
    });
};

// Error toast
export const showError = (message: string) => {
    toast.error(message, {
        ...toastConfig,
        style: {
            ...toastConfig.style,
            background: '#ef4444',
            color: '#ffffff',
        },
        iconTheme: {
            primary: '#ffffff',
            secondary: '#ef4444',
        },
    });
};

// Loading toast
export const showLoading = (message: string) => {
    return toast.loading(message, {
        ...toastConfig,
        style: {
            ...toastConfig.style,
            background: 'var(--bg-primary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-primary)',
        },
    });
};

// Info toast
export const showInfo = (message: string) => {
    toast(message, {
        ...toastConfig,
        icon: 'ℹ️',
        style: {
            ...toastConfig.style,
            background: '#3b82f6',
            color: '#ffffff',
        },
    });
};

// Dismiss toast
export const dismissToast = (toastId: string) => {
    toast.dismiss(toastId);
};

// Promise toast - for async operations
export const showPromise = <T,>(
    promise: Promise<T>,
    messages: {
        loading: string;
        success: string;
        error: string;
    }
) => {
    return toast.promise(
        promise,
        {
            loading: messages.loading,
            success: messages.success,
            error: messages.error,
        },
        toastConfig
    );
};
