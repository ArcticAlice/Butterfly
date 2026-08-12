import React from 'react';
import { colors, typography, spacing, borderRadius } from '../utils/theme';

function NotesSection({ value, onChange, saveStatus, minHeight = '140px' }) {
    return (
        <div style={styles.card}>
            <div style={styles.headerRow}>
                <h3 style={styles.header}>DAILY NOTES</h3>
                {saveStatus && (
                    <span style={styles.statusText}>
                        {saveStatus === 'saving' ? 'Saving...' : 'Saved'}
                    </span>
                )}
            </div>
            <div style={{ ...styles.textareaWrapper, minHeight }}>
                <textarea
                    value={value || ''}
                    placeholder="Enter Notes..."
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
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        boxSizing: 'border-box',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.sm,
    },
    headerRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    header: {
        ...typography.labelCaps,
        color: colors.second,
        margin: 0,
    },
    statusText: {
        ...typography.labelCaps,
        fontSize: '11px',
        color: colors.second,
    },
    textareaWrapper: {
        backgroundColor: colors.card,
        borderTop: `1px solid ${colors.border}`,
        paddingTop: spacing.md,
        // paddingLeft: spacing.sm,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
    },
    textarea: {
        width: '100%',
        flex: 1,
        minHeight: '100px',
        border: 'none',
        outline: 'none',
        fontFamily: typography.fontFamily,
        fontSize: '15px',
        lineHeight: '22px',
        color: colors.first,
        resize: 'vertical',
        backgroundColor: colors.card,
        boxSizing: 'border-box',
    },
};

export default NotesSection;