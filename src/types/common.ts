// API Error type
export interface ApiError {
    response?: {
        data?: {
            message?: string;
            errors?: Array<{
                field: string;
                message: string;
            }>;
        };
        status?: number;
    };
    message: string;
}

// Invite type for group invites
export interface GroupInvite {
    _id: string;
    token: string;
    inviteLink: string;
    expiresAt: string;
}

// Balance type for settlements
export interface Balance {
    user: {
        _id: string;
        name: string;
        username: string;
        profileImage?: {
            url: string;
            publicId: string;
        };
    };
    amount: number;
    type: 'owes' | 'owed';
}

// User response type
export interface UserResponse {
    message: string;
    user: {
        id: string;
        username: string;
        name: string;
        email: string;
        profileImage?: {
            url: string;
            publicId: string;
        };
        preferredCurrency?: string;
    };
}
