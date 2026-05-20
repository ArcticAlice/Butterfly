import React, { useEffect } from 'react';
import Left from '../assets/Left.jsx'
import Right from '../assets/Right.jsx'
import { colors, typography, spacing } from '../utils/theme.js';

function DateNavigator({ currentDate, onPrevious, onNext, format = 'long' }) {

    const weekday = currentDate.toLocaleDateString('en-US', {
        weekday: 'long'
    });
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
            <Left onClick={onPrevious}/>

            <div style={styles.dateDisplay}>
                {`${weekday}, ${formatDate(currentDate)}`}
            </div>

            <Right onClick={onNext}/>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.lg,
        width: '100%'
    },
    dateDisplay: {
        ...typography.h3,
        color: colors.first,
        minWidth: '200px',
        textAlign: 'center',
    },
};

export default DateNavigator;