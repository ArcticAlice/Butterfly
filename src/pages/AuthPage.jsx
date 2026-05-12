import React, { useState } from 'react';
import { colors, typography, spacing } from '../styles/theme';

function AuthPage({ onAuthenticate }) {
    // ========== LOGIC SECTION ==========
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isFirstTime, setIsFirstTime] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setError('');
        setLoading(true);

        try {
            // TODO: Replace with actual Tauri invoke call
            // const result = await invoke('authenticate', { username, password });

            // Simulate authentication for now
            if (username && password) {
                setTimeout(() => {
                    onAuthenticate();
                }, 500);
            } else {
                setError('Please enter username and password');
                setLoading(false);
            }
        } catch (err) {
            setError('Authentication failed. Please try again.');
            setLoading(false);
        }
    };

    const handleCreateAccount = async () => {
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        setLoading(true);

        try {
            // TODO: Replace with actual Tauri invoke call
            // const result = await invoke('create_account', { username, password });

            // Simulate account creation for now
            setTimeout(() => {
                onAuthenticate();
            }, 500);
        } catch (err) {
            setError('Account creation failed. Please try again.');
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isFirstTime) {
            handleCreateAccount();
        } else {
            handleLogin();
        }
    };

    // ========== RETURN STATEMENT ==========
    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.logoSection}>
                    <span style={styles.logo}>🦋</span>
                    <h1 style={styles.title}>Butterfly Health</h1>
                    <p style={styles.subtitle}>Your Private Health Dashboard</p>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={styles.input}
                            placeholder="Enter username"
                            disabled={loading}
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={styles.input}
                            placeholder="Enter password"
                            disabled={loading}
                        />
                    </div>

                    {isFirstTime && (
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Confirm Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                style={styles.input}
                                placeholder="Confirm password"
                                disabled={loading}
                            />
                        </div>
                    )}

                    {error && <div style={styles.error}>{error}</div>}

                    <button
                        type="submit"
                        style={{
                            ...styles.button,
                            ...(loading ? styles.buttonDisabled : {})
                        }}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : (isFirstTime ? 'Create Account' : 'Login')}
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            setIsFirstTime(!isFirstTime);
                            setError('');
                        }}
                        style={styles.toggleButton}
                        disabled={loading}
                    >
                        {isFirstTime ? 'Already have an account? Login' : 'First time? Create Account'}
                    </button>
                </form>

                <div style={styles.securityNote}>
                    <span style={styles.lockIcon}>🔒</span>
                    <p style={styles.securityText}>
                        Your data is encrypted with military-grade security.
                        Your password is never stored and cannot be recovered.
                    </p>
                </div>
            </div>
        </div>
    );
}

// ========== STYLES SECTION ==========
const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: colors.background,
        padding: spacing.lg,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: '16px',
        padding: spacing.xxl,
        maxWidth: '450px',
        width: '100%',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    logoSection: {
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    logo: {
        fontSize: '64px',
        display: 'block',
        marginBottom: spacing.md,
    },
    title: {
        ...typography.h1,
        color: colors.textPrimary,
        margin: 0,
        marginBottom: spacing.sm,
    },
    subtitle: {
        ...typography.body,
        color: colors.textSecondary,
        margin: 0,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.md,
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.sm,
    },
    label: {
        ...typography.bodySmall,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    input: {
        ...typography.body,
        padding: `${spacing.md} ${spacing.md}`,
        border: `1px solid ${colors.border}`,
        borderRadius: '8px',
        backgroundColor: colors.surface,
        color: colors.textPrimary,
        outline: 'none',
        transition: 'border-color 0.2s',
    },
    button: {
        ...typography.body,
        padding: `${spacing.md} ${spacing.lg}`,
        backgroundColor: colors.primary,
        color: colors.surface,
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        marginTop: spacing.md,
        transition: 'background-color 0.2s',
    },
    buttonDisabled: {
        opacity: 0.6,
        cursor: 'not-allowed',
    },
    toggleButton: {
        ...typography.bodySmall,
        padding: spacing.md,
        backgroundColor: 'transparent',
        color: colors.primary,
        border: 'none',
        cursor: 'pointer',
        textDecoration: 'underline',
    },
    error: {
        ...typography.bodySmall,
        color: colors.error,
        padding: spacing.sm,
        backgroundColor: `${colors.error}20`,
        borderRadius: '4px',
        textAlign: 'center',
    },
    securityNote: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: spacing.sm,
        marginTop: spacing.xl,
        padding: spacing.md,
        backgroundColor: colors.background,
        borderRadius: '8px',
    },
    lockIcon: {
        fontSize: '20px',
    },
    securityText: {
        ...typography.caption,
        color: colors.textSecondary,
        margin: 0,
        lineHeight: '1.5',
    },
};

export default AuthPage;