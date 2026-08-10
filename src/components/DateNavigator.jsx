import React, { useEffect } from 'react';
import Left from '../assets/Left.jsx'
import Right from '../assets/Right.jsx'
import { colors, typography, spacing } from '../utils/theme.js';

function DateNavigator({ currentDate, onPrevious, onNext, format = 'long' }) {

    const weekday = currentDate.toLocaleDateString('en-US', {
        weekday: 'long'
    });

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

    return (
        <div style={styles.container}>
            <Left onClick={onPrevious} size="18px" color={colors.first} stroke="none" />

            <div style={styles.dateDisplay}>
                {`${weekday}, ${formatDate(currentDate)}`}
            </div>

            <Right onClick={onNext} size="18px" color={colors.first} stroke="none" />
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.lg,
        width: '100%',
        margin: `${spacing.md} 0`
    },
    dateDisplay: {
        fontFamily: typography.fontFamily,
        fontSize: '22px',
        fontWeight: '600',
        color: colors.first,
        minWidth: '240px',
        textAlign: 'center',
        letterSpacing: '-0.01em',
    },
};

export default DateNavigator;