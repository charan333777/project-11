import {
    completeDemoEmailChange,
    deleteDemoAccount,
    DEMO_OTP,
    ensureDemoAccountExists,
    getDemoSessionUser,
    stageDemoEmailChange,
    updateDemoPassword,
    updateDemoUser,
} from '@/lib/demoStore';

interface UpdateProfileInput { name: string; }
interface RequestEmailChangeInput { currentEmail: string; oldEmail: string; newEmail: string; }
interface VerifyEmailChangeInput { email: string; token: string; }
interface ResendEmailChangeOtpInput { email: string; }

export const profileApi = {
    updateProfile: async ({ name }: UpdateProfileInput) => updateDemoUser({ name }),

    requestEmailChange: async ({ currentEmail, oldEmail, newEmail }: RequestEmailChangeInput) => {
        if (oldEmail.trim().toLowerCase() !== currentEmail.trim().toLowerCase()) {
            throw new Error('Current email does not match your account');
        }
        stageDemoEmailChange(newEmail);
        return getDemoSessionUser();
    },

    verifyEmailChange: async ({ email, token }: VerifyEmailChangeInput) => (
        completeDemoEmailChange(email, token)
    ),

    resendEmailChangeOtp: async ({ email }: ResendEmailChangeOtpInput) => {
        if (!email.trim()) throw new Error('Email is required.');
    },

    requestPasswordChangeOtp: async ({ email }: { email: string }) => {
        ensureDemoAccountExists(email);
    },

    verifyPasswordChangeOtp: async ({ token }: { email: string; token: string }) => {
        if (token !== DEMO_OTP) throw new Error(`Use the demo verification code ${DEMO_OTP}.`);
        return getDemoSessionUser();
    },

    updatePassword: async ({ password }: { password: string }) => {
        updateDemoPassword(password);
        return getDemoSessionUser();
    },

    deleteAccount: async () => {
        deleteDemoAccount();
    },
};
