import React from 'react';
import { colors, typography, spacing } from '../utils/theme';

function NotesSection({ value, onChange }) {
    return (
        <div style={styles.card}>
            <h3 style={styles.header}>DAILY NOTES</h3>
            <div style={styles.textareaWrapper}>
                <textarea
                    value={value || ''}
                    placeholder="Enter Notes"
                    style={styles.textarea}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
        </div>
    );
}

const styles = {
    card: {
        backgroundColor: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: '4px',
        padding: spacing.lg,
        boxSizing: 'border-box',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.md,
    },
    header: {
        ...typography.labelCaps,
        color: colors.second,
        margin: 0,
    },
    textareaWrapper: {
        backgroundColor: colors.background,
        border: `1px solid ${colors.border}`,
        borderRadius: '4px',
        padding: spacing.md,
        boxSizing: 'border-box',
        minHeight: '160px',
    },
    textarea: {
        width: '100%',
        height: '140px',
        border: 'none',
        outline: 'none',
        fontFamily: typography.fontFamily,
        fontSize: '15px',
        lineHeight: '22px',
        color: colors.first,
        resize: 'none',
        backgroundColor: 'transparent',
        boxSizing: 'border-box',
    },
};

export default NotesSection;