import React from 'react';
import { colors, typography, spacing } from '../utils/theme.js';
import Butterfly from '../assets/Butterfly.jsx';

function PageHeader({ title = false, onBack, showBackButton = true }) {


    const styles = getStyles(title);
    // ========== LOGIC SECTION ==========
    const handleBackClick = () => {
        if (onBack) {
            onBack();
        }
    };

    // ========== RETURN STATEMENT ==========
    return (
        <div style={styles.header}>
            <div onClick={handleBackClick} style={styles.leftSection}>
                <div style={styles.logoContainer} >
                    <Butterfly width="40px" height="40px" color={colors.primary} />
                </div>
                <p style={styles.logoText}>Butterfly</p>
            </div>
        </div>
    );
}

// ========== STYLES SECTION ==========
const getStyles = (title) => ({
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.card,
        position: 'fixed',
        width: '100%',
        height: '7vh',
        zIndex: '100'
    },
    leftSection: {
        paddingLeft: '5px',
        display: 'flex',
        alignItems: 'center',
        height: '100%',
        width: '20%',
        flexDirection: 'row',
        cursor: title ? 'default' : 'pointer',
    },
    logoContainer: {
        height: '100%',
        width: '20%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: title ? 'default' : 'pointer',
    },
    logoText: {
        width: '80%',
        fontSize: spacing.lg,
        cursor: title ? 'default' : 'pointer',
    },
});

export default PageHeader;