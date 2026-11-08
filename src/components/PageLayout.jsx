import React from 'react';
import PageHeader from './PageHeader';
import { colors, spacing } from '../utils/theme';

function PageLayout({ children, onBack, showBackButton = true, title = false, maxWidth = '1080px', onCalendarClick, showCalendarIcon = true, onSettingsClick }) {
    return (
        <div style={styles.outerContainer}>
            <PageHeader
                onBack={onBack}
                showBackButton={showBackButton}
                title={title}
                onCalendarClick={onCalendarClick}
                showCalendarIcon={showCalendarIcon}
                onSettingsClick={onSettingsClick}
            />
            <main style={{ ...styles.contentWrapper, maxWidth }}>
                {children}
            </main>
        </div>
    );
}

const styles = {
    outerContainer: {
        backgroundColor: colors.background,
        minHeight: '100vh',
        width: '100%',
        boxSizing: 'border-box',
        color: colors.first,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    contentWrapper: {
        width: '100%',
        padding: '72px 24px 32px 24px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        flex: 1,
    },
};

export default PageLayout;


