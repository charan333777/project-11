import type { JobApplication } from '@/features/jobs/types';
import type { User } from '@/lib/auth/authTypes';

export const DEMO_OTP = '12345678';
export const DEMO_EMAIL = 'demo@banddle.local';
export const DEMO_PASSWORD = 'Demo123!';

interface DemoAccount {
    user: User;
    password: string;
}

interface PendingSignup {
    name: string;
    email: string;
    password: string;
}

interface ContactMessage {
    id: string;
    name: string;
    email: string;
    message: string;
    createdAt: string;
}

const STORAGE_KEYS = {
    accounts: 'banddle-demo-accounts',
    sessionUserId: 'banddle-demo-session-user-id',
    pendingSignup: 'banddle-demo-pending-signup',
    pendingEmail: 'banddle-demo-pending-email',
    jobs: 'banddle-demo-jobs',
    contacts: 'banddle-demo-contact-messages',
} as const;

const defaultUser: User = {
    id: 'demo-user-001',
    email: DEMO_EMAIL,
    name: 'Demo Job Seeker',
    role: 'Job Seeker',
    createdAt: '2026-01-15T09:00:00.000Z',
};

const defaultJobs: JobApplication[] = [
    {
        id: 'demo-job-001',
        company: 'Northstar Labs',
        role: 'Junior DevOps Engineer',
        status: 'interview',
        applied_at: '2026-09-18',
        starred: true,
        salary: 42000,
        stage: 'Technical interview',
        notes: 'Review Azure networking and Terraform modules.',
        job_description: 'Support cloud infrastructure, CI/CD pipelines, and platform reliability.',
    },
    {
        id: 'demo-job-002',
        company: 'Cloud Harbor',
        role: 'Cloud Support Associate',
        status: 'applied',
        applied_at: '2026-09-21',
        starred: false,
        salary: 38000,
        notes: 'Application submitted through the company careers page.',
    },
    {
        id: 'demo-job-003',
        company: 'Orbit Systems',
        role: 'Platform Engineering Intern',
        status: 'offer',
        applied_at: '2026-09-10',
        starred: true,
        salary: 32000,
        notes: 'Offer received; review start date and training plan.',
    },
];

const requireBrowser = () => {
    if (typeof window === 'undefined') {
        throw new Error('Demo storage is only available in the browser.');
    }
};

const readJson = <T,>(key: string, fallback: T): T => {
    requireBrowser();
    const value = window.localStorage.getItem(key);
    if (!value) return fallback;

    try {
        return JSON.parse(value) as T;
    } catch {
        return fallback;
    }
};

const writeJson = (key: string, value: unknown) => {
    requireBrowser();
    window.localStorage.setItem(key, JSON.stringify(value));
};

const makeId = (prefix: string) => {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return `${prefix}-${crypto.randomUUID()}`;
    }

    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const getAccounts = (): DemoAccount[] => {
    const accounts = readJson<DemoAccount[]>(STORAGE_KEYS.accounts, []);
    if (accounts.length > 0) return accounts;

    const seededAccounts = [{ user: defaultUser, password: DEMO_PASSWORD }];
    writeJson(STORAGE_KEYS.accounts, seededAccounts);
    return seededAccounts;
};

const saveAccounts = (accounts: DemoAccount[]) => writeJson(STORAGE_KEYS.accounts, accounts);

export const getDemoSessionUser = (): User | null => {
    requireBrowser();
    const userId = window.localStorage.getItem(STORAGE_KEYS.sessionUserId);
    if (!userId) return null;
    return getAccounts().find((account) => account.user.id === userId)?.user ?? null;
};

export const loginDemoAccount = (email: string, password: string): User => {
    const account = getAccounts().find(
        (candidate) => candidate.user.email.toLowerCase() === email.trim().toLowerCase()
            && candidate.password === password
    );

    if (!account) throw new Error('Incorrect email or password.');
    window.localStorage.setItem(STORAGE_KEYS.sessionUserId, account.user.id);
    return account.user;
};

export const stageDemoSignup = (pending: PendingSignup) => {
    const emailTaken = getAccounts().some(
        (account) => account.user.email.toLowerCase() === pending.email.trim().toLowerCase()
    );
    if (emailTaken) throw new Error('An account with this email already exists. Try logging in.');
    writeJson(STORAGE_KEYS.pendingSignup, { ...pending, email: pending.email.trim() });
};

export const completeDemoSignup = (email: string, token: string): User => {
    if (token !== DEMO_OTP) throw new Error(`Use the demo verification code ${DEMO_OTP}.`);
    const pending = readJson<PendingSignup | null>(STORAGE_KEYS.pendingSignup, null);
    if (!pending || pending.email.toLowerCase() !== email.trim().toLowerCase()) {
        throw new Error('No pending demo signup was found for this email.');
    }

    const user: User = {
        id: makeId('demo-user'),
        email: pending.email,
        name: pending.name,
        role: 'Job Seeker',
        createdAt: new Date().toISOString(),
    };
    saveAccounts([...getAccounts(), { user, password: pending.password }]);
    window.localStorage.setItem(STORAGE_KEYS.sessionUserId, user.id);
    window.localStorage.removeItem(STORAGE_KEYS.pendingSignup);
    return user;
};

export const verifyDemoRecovery = (email: string, token: string): User => {
    if (token !== DEMO_OTP) throw new Error(`Use the demo verification code ${DEMO_OTP}.`);
    const account = getAccounts().find(
        (candidate) => candidate.user.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (!account) throw new Error('No demo account exists for this email.');
    window.localStorage.setItem(STORAGE_KEYS.sessionUserId, account.user.id);
    return account.user;
};

export const ensureDemoAccountExists = (email: string) => {
    const exists = getAccounts().some(
        (account) => account.user.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (!exists) throw new Error('No demo account exists for this email.');
};

export const logoutDemoAccount = () => {
    requireBrowser();
    window.localStorage.removeItem(STORAGE_KEYS.sessionUserId);
};

export const updateDemoUser = (updates: Partial<Pick<User, 'name' | 'email'>>): User => {
    const current = getDemoSessionUser();
    if (!current) throw new Error('User not authenticated.');

    const updated = { ...current, ...updates };
    saveAccounts(getAccounts().map((account) => (
        account.user.id === current.id ? { ...account, user: updated } : account
    )));
    return updated;
};

export const updateDemoPassword = (password: string) => {
    const current = getDemoSessionUser();
    if (!current) throw new Error('User not authenticated.');
    saveAccounts(getAccounts().map((account) => (
        account.user.id === current.id ? { ...account, password } : account
    )));
};

export const stageDemoEmailChange = (email: string) => {
    writeJson(STORAGE_KEYS.pendingEmail, email.trim());
};

export const completeDemoEmailChange = (email: string, token: string): User => {
    if (token !== DEMO_OTP) throw new Error(`Use the demo verification code ${DEMO_OTP}.`);
    const pendingEmail = readJson<string | null>(STORAGE_KEYS.pendingEmail, null);
    if (!pendingEmail || pendingEmail.toLowerCase() !== email.trim().toLowerCase()) {
        throw new Error('No pending email change was found.');
    }
    const user = updateDemoUser({ email: pendingEmail });
    window.localStorage.removeItem(STORAGE_KEYS.pendingEmail);
    return user;
};

export const deleteDemoAccount = () => {
    const current = getDemoSessionUser();
    if (!current) throw new Error('User not authenticated.');
    saveAccounts(getAccounts().filter((account) => account.user.id !== current.id));
    window.localStorage.removeItem(STORAGE_KEYS.sessionUserId);
    window.localStorage.removeItem(STORAGE_KEYS.jobs);
};

export const getDemoJobs = (): JobApplication[] => {
    const jobs = readJson<JobApplication[]>(STORAGE_KEYS.jobs, []);
    if (jobs.length > 0 || window.localStorage.getItem(STORAGE_KEYS.jobs)) return jobs;
    writeJson(STORAGE_KEYS.jobs, defaultJobs);
    return defaultJobs;
};

export const saveDemoJobs = (jobs: JobApplication[]) => writeJson(STORAGE_KEYS.jobs, jobs);
export const createDemoJobId = () => makeId('demo-job');

export const saveDemoContactMessage = (message: Omit<ContactMessage, 'id' | 'createdAt'>) => {
    const messages = readJson<ContactMessage[]>(STORAGE_KEYS.contacts, []);
    writeJson(STORAGE_KEYS.contacts, [
        ...messages,
        { ...message, id: makeId('demo-message'), createdAt: new Date().toISOString() },
    ]);
};
