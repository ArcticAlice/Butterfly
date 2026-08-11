import React, { useState } from 'react';
import { colors, typography, spacing } from '../utils/theme';

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
        width: '100%',
        boxSizing: 'border-box',
    },
    card: {
        backgroundColor: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: borderRadius.md,
        padding: spacing.xl,
        maxWidth: '420px',
        width: '100%',
        boxSizing: 'border-box',
    },
    logoSection: {
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    logo: {
        fontSize: '56px',
        display: 'block',
        marginBottom: spacing.sm,
    },
    title: {
        ...typography.h1,
        color: colors.first,
        margin: 0,
        marginBottom: spacing.xs,
    },
    subtitle: {
        ...typography.body,
        fontSize: '14px',
        color: colors.second,
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
        gap: spacing.xs,
    },
    label: {
        ...typography.caption,
        fontSize: '13px',
        color: colors.second,
        fontWeight: '500',
    },
    input: {
        fontFamily: typography.fontFamily,
        fontSize: '14px',
        padding: '10px 12px',
        border: `1px solid ${colors.border}`,
        borderRadius: borderRadius.sm,
        backgroundColor: colors.background,
        color: colors.first,
        outline: 'none',
        transition: 'border-color 0.2s',
        width: '100%',
        boxSizing: 'border-box',
    },
    button: {
        fontFamily: typography.fontFamily,
        fontSize: '14px',
        padding: '12px 16px',
        backgroundColor: colors.first,
        color: colors.background,
        border: 'none',
        borderRadius: borderRadius.sm,
        cursor: 'pointer',
        fontWeight: '600',
        marginTop: spacing.sm,
        transition: 'opacity 0.2s',
    },
    buttonDisabled: {
        opacity: 0.6,
        cursor: 'not-allowed',
    },
    toggleButton: {
        ...typography.caption,
        padding: spacing.sm,
        backgroundColor: 'transparent',
        color: colors.first,
        border: 'none',
        cursor: 'pointer',
        textDecoration: 'underline',
    },
    error: {
        ...typography.caption,
        color: colors.first,
        padding: spacing.sm,
        backgroundColor: colors.background,
        border: `1px solid ${colors.third}`,
        borderRadius: borderRadius.sm,
        textAlign: 'center',
    },
    securityNote: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: spacing.sm,
        marginTop: spacing.xl,
        padding: spacing.md,
        backgroundColor: colors.background,
        border: `1px solid ${colors.border}`,
        borderRadius: borderRadius.sm,
    },
    lockIcon: {
        fontSize: '18px',
    },
    securityText: {
        ...typography.caption,
        fontSize: '12px',
        color: colors.second,
        margin: 0,
        lineHeight: '1.5',
    },
};


export default AuthPage;