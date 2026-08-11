import React, { useEffect } from 'react';
import Left from '../assets/Left.jsx';
import Right from '../assets/Right.jsx';
import { colors, typography, spacing } from '../utils/theme.js';

function DateNavigator({ currentDate, onPrevious, onNext, format = 'long' }) {

    const weekday = currentDate.toLocaleDateString('en-US', {
        weekday: 'long'
    });

    useEffect(() => {
        const handleKeyPress = (e) => {
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

    return (
        <div style={styles.container}>
            <button
                type="button"
                onClick={onPrevious}
                style={styles.arrowButton}
                title="Previous Day"
            >
                <Left size="18px" color={colors.first} stroke="none" />
            </button>

            <div style={styles.dateDisplay}>
                {`${weekday}, ${formatDate(currentDate)}`}
            </div>

            <button
                type="button"
                onClick={onNext}
                style={styles.arrowButton}
                title="Next Day"
            >
                <Right size="18px" color={colors.first} stroke="none" />
            </button>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.md,
        width: '100%',
        margin: `0 0 ${spacing.sm} 0`,
        userSelect: 'none',
    },
    arrowButton: {
        background: 'transparent',
        border: 'none',
        padding: '6px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px',
        color: colors.first,
        transition: 'opacity 0.15s ease',
    },
    dateDisplay: {
        fontFamily: typography.fontFamily,
        fontSize: '20px',
        fontWeight: '600',
        color: colors.first,
        minWidth: '260px',
        textAlign: 'center',
        letterSpacing: '-0.01em',
    },
};

export default DateNavigator;