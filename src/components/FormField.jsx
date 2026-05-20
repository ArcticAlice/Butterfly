import React from 'react';
import { colors, typography, spacing } from '../utils/theme';

function FormField({
    label,
    value,
    onChange,
    type = 'text',
    placeholder = '',
    unit = '',
    error = '',
    min,
    max,
    disabled = false
}) {
    // ========== LOGIC SECTION ==========
    const handleChange = (e) => {
        if (onChange) {
            onChange(e.target.value);
        }
    };

    const handleBlur = (e) => {
        // Validate on blur if min/max constraints exist
        if (type === 'number') {
            let val = parseFloat(e.target.value);
            if (!isNaN(val)) {
                if (min !== undefined && val < min) {
                    onChange(min.toString());
                } else if (max !== undefined && val > max) {
                    onChange(max.toString());
                }
            }
        }
    };

    // ========== RETURN STATEMENT ==========
    return (
        <div style={styles.container}>
            {label && <label style={styles.label}>{label}</label>}

            <div style={styles.inputWrapper}>
                <input
                    type={type}
                    value={value || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    min={min}
                    max={max}
                    disabled={disabled}
                    style={{
                        ...styles.input,
                        ...(error ? styles.inputError : {}),
                        ...(disabled ? styles.inputDisabled : {})
                    }}
                />
                {unit && <span style={styles.unit}>{unit}</span>}
            </div>

            {error && <div style={styles.errorMessage}>{error}</div>}
        </div>
    );
}

// ========== STYLES SECTION ==========
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    label: {
        ...typography.bodySmall,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    inputWrapper: {
        display: 'flex',
        alignItems: 'center',
        gap: spacing.sm,
    },
    input: {
        ...typography.body,
        padding: `${spacing.sm} ${spacing.md}`,
        border: `1px solid ${colors.border}`,
        borderRadius: '8px',
        backgroundColor: colors.surface,
        color: colors.textPrimary,
        outline: 'none',
        transition: 'border-color 0.2s',
        flex: 1,
    },
    inputError: {
        borderColor: colors.error,
    },
    inputDisabled: {
        backgroundColor: colors.background,
        color: colors.textTertiary,
        cursor: 'not-allowed',
    },
    unit: {
        ...typography.bodySmall,
        color: colors.textSecondary,
        minWidth: '40px',
    },
    errorMessage: {
        ...typography.caption,
        color: colors.error,
        marginTop: spacing.xs,
    },
};

export default FormField;