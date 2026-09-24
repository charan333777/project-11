import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { ThemeProvider } from "@/lib/theme/ThemeContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
    title: "Banddle - Best Job Application Tracker & Organiser",
    description: "Streamline your career search with the Banddle job application tracker. Organize applications, track your search progress, and land your next role faster.",
    keywords: ["job application tracker", "job tracker", "job search tracker", "job application organiser", "track job applications"],
    authors: [{ name: "Banddle Team" }],
    openGraph: {
        title: "Banddle - Job Application Tracker",
        description: "The modern way to organize your job search.",
        url: "https://banddle.com",
        siteName: "Banddle",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Banddle - Job Application Tracker",
        description: "Track and manage your job applications in one place.",
    },
};

const themeInitializationScript = `
    (function () {
        try {
            var storageKey = 'theme';
            var storedTheme = localStorage.getItem(storageKey);
            var theme = storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system'
                ? storedTheme
                : 'light';
            if (storedTheme !== theme) {
                localStorage.setItem(storageKey, theme);
            }
            var resolvedTheme = theme === 'system'
                ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
                : theme;
            var root = document.documentElement;
            root.classList.toggle('dark', resolvedTheme === 'dark');
            root.dataset.theme = theme;
            root.style.colorScheme = resolvedTheme;
        } catch (error) {
            // Ignore localStorage access issues.
        }
    })();
`;

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeInitializationScript }} />
            </head>
            <body className={inter.className}>
                <a
                    href="#main-content"
                    className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary-600 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                    Skip to content
                </a>
                <ThemeProvider>
                    <AuthProvider>
                        <div className="flex flex-col min-h-screen">
                            <Header />
                            <main id="main-content" className="flex flex-1 flex-col min-h-0">
                                {children}
                            </main>
                            <Footer />
                        </div>
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
