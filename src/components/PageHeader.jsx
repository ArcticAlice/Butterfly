import React from 'react';
import { colors, typography, spacing } from '../utils/theme.js';
import Butterfly from '../assets/Butterfly.jsx';
import Calendar from '../assets/Calendar.jsx';
import Settings from '../assets/Settings.jsx';

function PageHeader({ title = false, onBack, showBackButton = true }) {
    const isInteractive = Boolean(onBack) && !title;

    const handleBackClick = () => {
        if (onBack) {
            onBack();
        }
    };

    return (
        <header style={styles.header}>
            <div
                onClick={handleBackClick}
                style={{
                    ...styles.leftSection,
                    cursor: isInteractive ? 'pointer' : 'default',
                }}
                title={isInteractive ? "Click to return to Dashboard" : undefined}
            >
                <div style={styles.logoContainer}>
                    <Butterfly size="26px" color={colors.first} />
                </div>
                <span style={styles.logoText}>Butterfly</span>
            </div>
            <div style={styles.rightSection}>
                <div style={styles.iconButton} title="Calendar">
                    <Calendar size="20px" color={colors.first} stroke="none" />
                </div>
                <div style={styles.iconButton} title="Settings">
                    <Settings size="20px" color={colors.first} stroke="none" />
                </div>
            </div>
        </header>
    );
}

const styles = {
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.background,
        borderBottom: `1px solid ${colors.border}`,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '56px',
        padding: `0 ${spacing.lg}`,
        boxSizing: 'border-box',
        zIndex: 100,
    },
    leftSection: {
        display: 'flex',
        alignItems: 'center',
        gap: spacing.sm,
        userSelect: 'none',
    },
    logoContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        fontFamily: typography.fontFamily,
        fontSize: '20px',
        fontWeight: '600',
        color: colors.first,
        letterSpacing: '-0.01em',
    },
    rightSection: {
        display: 'flex',
        alignItems: 'center',
        gap: spacing.sm,
    },
    iconButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6px',
        borderRadius: '4px',
        cursor: 'pointer',
        transition: 'opacity 0.15s ease',
    }
};

export default PageHeader;