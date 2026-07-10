export function formatTime(mins) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m.toString().padStart(2, '0')}m`;
};

/**
 * Convert JavaScript Date object to YYYY-MM-DD format
 * @param {Date} date - JavaScript Date object
 * @returns {string} Date in YYYY-MM-DD format
 */
export function formatDateForDB(date) {
    // Already formatted — return as-is, don't re-parse
    if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
    }
    const newDate = new Date(date);
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, '0');
    const day = String(newDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}