import React, { useEffect } from 'react';
import Left from '../assets/Left.jsx'
import Right from '../assets/Right.jsx'
import { colors, typography, spacing } from '../styles/theme';

function DateNavigator({ currentDate, onPrevious, onNext, format = 'long' }) {
    // ========== LOGIC SECTION ==========
    useEffect(() => {
        const handleKeyPress = (e) => {

            // Ignore arrow keys when user is typing in input/textarea
            const activeElement = document.activeElement;
            if (activeElement && (
                activeElement.tagName === 'INPUT' ||
                activeElement.tagName === 'TEXTAREA'
            )) {
                return;
            }

            if (e.key === 'ArrowLeft' && onPrevious) {
                onPrevious();
            } else if (e.key === 'ArrowRight' && onNext) {
                onNext();
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [onPrevious, onNext]);

    const formatDate = (date) => {
        const dateObj = typeof date === 'string' ? new Date(date) : date;

        if (format === 'long') {
            return dateObj.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        return dateObj.toLocaleDateString('en-US');
    };

    // ========== RETURN STATEMENT ==========
    return (
        <div style={styles.container}>
            <button
                onClick={onPrevious}
                style={styles.arrowButton}
                aria-label="Previous day"
            >
                <Left />
            </button>

            <div style={styles.dateDisplay}>
                {formatDate(currentDate)}
            </div>

            <button
                onClick={onNext}
                style={styles.arrowButton}
                aria-label="Next day"
            >
                <Right />
            </button>
        </div>
    );
}

// ========== STYLES SECTION ==========
const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.lg,
        width: '100%'
    },
    arrowButton: {
        backgroundColor: 'transparent',
        border: 'none',
        fontSize: '20px',
        color: colors.textSecondary,
        cursor: 'pointer',
        padding: spacing.sm,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'color 0.2s',
        width: '40px',
        height: '40px',
        borderRadius: '8px',
    },
    dateDisplay: {
        ...typography.h3,
        color: colors.textPrimary,
        minWidth: '200px',
        textAlign: 'center',
    },
};

export default DateNavigator;