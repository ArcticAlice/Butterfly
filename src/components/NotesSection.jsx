import React from 'react';
import { colors, typography, spacing } from '../utils/theme';

function NotesSection({ value, onChange, saveStatus }) {
    return (
        <div style={styles.container}>
            <div style={styles.textareaWrapper}>
                <textarea
                    value={value}
                    placeholder="Enter Notes"
                    style={styles.textarea}
                    onChange={(e) => onChange(e.target.value)}
                />
                <div style={styles.saveStatus}>
                    {saveStatus === 'saving' ? 'AUTO-SAVING...' : ''}
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        boxSizing: 'border-box', display: 'grid',
        gap: '2%', width: '100%', borderRadius: '24px',
    },
    textareaWrapper: { position: 'relative', backgroundColor: colors.card, borderRadius: '24px', },
    textarea: {
        width: '100%', border: 'none', outline: 'none',
        fontSize: '16px', color: colors.first, resize: 'none',
        padding: '15px', boxSizing: 'border-box', borderRadius: '24px',
        height: '100%'
    },
    saveStatus: {
        position: 'absolute', bottom: '20px', right: '30px',
        fontSize: '12px', color: colors.first, zIndex: '5',
    }
};

export default NotesSection;