import React from 'react';
import { colors, typography, spacing } from '../utils/theme.js';
import Butterfly from '../assets/Butterfly.jsx';
import Calendar from '../assets/Calendar.jsx';
import Settings from '../assets/Settings.jsx';

function PageHeader({ title = false, onBack, showBackButton = true }) {

    const styles = getStyles(title);

    const handleBackClick = () => {
        if (onBack) {
            onBack();
        }
    };

    return (
        <header style={styles.header}>
            <div onClick={handleBackClick} style={styles.leftSection}>
                <div style={styles.logoContainer}>
                    <Butterfly size="26px" color={colors.first} />
                </div>
                <span style={styles.logoText}>Butterfly</span>
            </div>
            <div style={styles.rightSection}>
                <Calendar size="20px" color={colors.first} stroke="none" />
                <Settings size="20px" color={colors.first} stroke="none" />
            </div>
        </header>
    );
}

const getStyles = (title) => ({
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
        zIndex: 100
    },
    leftSection: {
        display: 'flex',
        alignItems: 'center',
        gap: spacing.sm,
        cursor: title ? 'default' : 'pointer',
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
        gap: spacing.md,
    }
});

export default PageHeader;