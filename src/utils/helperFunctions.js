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
export function capitalizeWords(str) {
    return str.replace(/\b\p{L}/gu, (c) => c.toUpperCase());
}
export function normalizeFoodName(name) {
    if (!name) return '';
    return name.toLowerCase().replace(/\s+/g, '');
}

export function levenshteinDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }
    return matrix[b.length][a.length];
}

export function rankFoodMatches(rawQuery, foodList, limit = 3) {
    if (!rawQuery || !foodList || foodList.length === 0) return [];
    
    const query = rawQuery.trim().toLowerCase();
    const normQuery = normalizeFoodName(query);
    if (!normQuery) return [];

    const scored = foodList.map(item => {
        const name = typeof item === 'string' ? item : item.food_name || '';
        const nameLower = name.toLowerCase();
        const normName = normalizeFoodName(name);

        let score = Infinity;

        // 1. Exact normalized prefix match
        if (normName.startsWith(normQuery)) {
            score = 10 + (normName.length - normQuery.length);
        } else {
            // 2. Word boundary match
            const words = nameLower.split(/\s+/);
            const wordPrefixMatch = words.some(w => w.startsWith(query));
            if (wordPrefixMatch) {
                score = 50 + (nameLower.length - query.length);
            }
            // 3. Substring match
            else if (nameLower.includes(query) || normName.includes(normQuery)) {
                score = 100 + (nameLower.length - query.length);
            }
            // 4. Fuzzy Levenshtein distance match
            else {
                const dist = levenshteinDistance(normQuery, normName);
                if (dist <= Math.max(3, Math.floor(normQuery.length * 0.6))) {
                    score = 200 + dist;
                }
            }
        }

        return { item, score };
    });

    return scored
        .filter(s => s.score < Infinity)
        .sort((a, b) => a.score - b.score)
        .map(s => s.item)
        .slice(0, limit);
}