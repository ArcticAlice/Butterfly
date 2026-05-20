import React, { useEffect, useState } from 'react';
import { colors, typography, spacing } from '../utils/theme';

function SaveIndicator({ status }) {
    // ========== LOGIC SECTION ==========
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (status === 'saving' || status === 'saved') {
            setVisible(true);
        }

        // Auto-hide after 2 seconds when saved
        if (status === 'saved') {
            const timer = setTimeout(() => {
                setVisible(false);
            }, 2000);
            return () => clearTimeout(timer);
        }

        if (status === 'error') {
            setVisible(true);
        }
    }, [status]);

    const getMessage = () => {
        switch (status) {
            case 'saving':
                return 'Saving...';
            case 'saved':
                return 'All changes saved';
            case 'error':
                return 'Save failed';
            default:
                return '';
        }
    };

    const getColor = () => {
        switch (status) {
            case 'saving':
                return colors.first;
            case 'saved':
                return colors.first;
            case 'error':
                return colors.first;
            default:
                return colors.first;
        }
    };

    if (!visible) return null;

    // ========== RETURN STATEMENT ==========
    return (
        <div style={{ ...styles.container, color: getColor() }}>
            {getMessage()}
        </div>
    );
}

// ========== STYLES SECTION ==========
const styles = {
    container: {
        ...typography.bodySmall,
        padding: `${spacing.sm} ${spacing.md}`,
        textAlign: 'right',
        transition: 'opacity 0.3s',
    },
};

export default SaveIndicator;