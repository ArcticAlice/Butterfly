import React, { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { colors, typography, spacing, borderRadius } from "../utils/theme";

function UniqueFoodsPopUp({ show, onClose, foods = [], onDelete, loading = false }) {
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (show) {
            setSearchQuery("");
        }
    }, [show]);

    const filteredFoods = useMemo(() => {
        if (!foods) return [];
        const query = searchQuery.trim().toLowerCase();
        const list = query
            ? foods.filter(item => item.food_name.toLowerCase().includes(query))
            : [...foods];

        return list.sort((a, b) =>
            a.food_name.localeCompare(b.food_name, undefined, { sensitivity: "base" })
        );
    }, [foods, searchQuery]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    style={style.layer}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                >
                    <div style={style.backdrop} onClick={onClose} aria-hidden="true" />
                    <motion.div
                        style={style.box}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Unique foods library"
                        initial={{ scale: 0.96, y: 12 }}
                        animate={{ scale: 1, y: 0, transition: { duration: 0.2, ease: [0.25, 1, 0.5, 1], delay: 0.04 } }}
                        exit={{ scale: 0.96, transition: { duration: 0.12 } }}
                    >
                        <div style={style.header}>
                            <div style={style.headerTitleContainer}>
                                <span style={style.headerLabel}>UNIQUE FOODS</span>
                                <span style={style.itemCount}>
                                    {filteredFoods.length} {filteredFoods.length === 1 ? 'ITEM' : 'ITEMS'}
                                </span>
                            </div>
                            <button style={style.closeBtn} onClick={onClose} aria-label="Close">
                                &times;
                            </button>
                        </div>

                        <div style={style.searchWrapper}>
                            <input
                                style={style.searchInput}
                                type="text"
                                placeholder="Search foods..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                                spellCheck={false}
                                autoCorrect="off"
                                autoCapitalize="off"
                                autoComplete="off"
                            />
                        </div>

                        <div style={style.body} className="no-scrollbar">
                            {loading ? (
                                <p style={style.emptyText}>Loading unique foods...</p>
                            ) : filteredFoods.length === 0 ? (
                                <p style={style.emptyText}>
                                    {searchQuery.trim() ? "No matching foods found." : "No unique foods saved."}
                                </p>
                            ) : (
                                <ul style={style.list}>
                                    {filteredFoods.map((item) => (
                                        <FoodRow
                                            key={item.food_name}
                                            item={item}
                                            onDelete={onDelete}
                                        />
                                    ))}
                                </ul>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function FoodRow({ item, onDelete }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <li style={style.listItem}>
            <span style={style.foodName} title={item.food_name}>
                {item.food_name}
            </span>
            <div style={style.itemRight}>
                <span style={style.calorieText}>
                    {item.food_calories || 0} kcal
                </span>
                <button
                    style={{
                        ...style.deleteBtn,
                        color: isHovered ? colors.first : colors.second,
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={() => onDelete(item.food_name)}
                    aria-label={`Remove ${item.food_name}`}
                    title={`Remove ${item.food_name}`}
                >
                    &times;
                </button>
            </div>
        </li>
    );
}

export default UniqueFoodsPopUp;

const style = {
    layer: {
        position: "fixed",
        inset: 0,
        zIndex: 99,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    backdrop: {
        position: "absolute",
        inset: 0,
        background: "rgba(0, 0, 0, 0.8)",
    },
    box: {
        position: "relative",
        width: "min(560px, 92vw)",
        maxHeight: "min(500px, 80vh)",
        backgroundColor: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        display: "flex",
        flexDirection: "column",
        gap: spacing.md,
        boxSizing: "border-box",
        boxShadow: "0 12px 32px rgba(0, 0, 0, 0.6)",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: `1px solid ${colors.border}`,
        paddingBottom: spacing.sm,
    },
    headerTitleContainer: {
        display: "flex",
        alignItems: "baseline",
        gap: spacing.sm,
    },
    headerLabel: {
        ...typography.labelCaps,
        color: colors.second,
        fontSize: "12px",
    },
    itemCount: {
        ...typography.labelCaps,
        fontSize: "11px",
        color: colors.second,
        opacity: 0.8,
    },
    closeBtn: {
        background: "transparent",
        border: "none",
        color: colors.second,
        fontSize: "22px",
        cursor: "pointer",
        lineHeight: 1,
        padding: 0,
    },
    searchWrapper: {
        width: "100%",
    },
    searchInput: {
        width: "100%",
        boxSizing: "border-box",
        backgroundColor: colors.background,
        color: colors.first,
        border: `1px solid ${colors.border}`,
        borderRadius: borderRadius.sm,
        padding: "8px 12px",
        fontFamily: typography.fontFamily,
        fontSize: "14px",
        outline: "none",
    },
    body: {
        flex: 1,
        overflowY: "auto",
        paddingRight: "4px",
    },
    emptyText: {
        color: colors.second,
        fontFamily: typography.fontFamily,
        fontSize: "14px",
        margin: "16px 0",
        textAlign: "center",
    },
    list: {
        margin: 0,
        padding: 0,
        listStyle: "none",
        display: "flex",
        flexDirection: "column",
        gap: spacing.xs,
    },
    listItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: `${spacing.sm} 0`,
        borderBottom: `1px solid ${colors.border}`,
    },
    foodName: {
        fontFamily: typography.fontFamily,
        color: colors.first,
        fontSize: "14px",
        fontWeight: "500",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        paddingRight: spacing.sm,
    },
    itemRight: {
        display: "flex",
        alignItems: "center",
        gap: spacing.md,
        flexShrink: 0,
    },
    calorieText: {
        fontFamily: typography.monoFontFamily || "monospace",
        color: colors.second,
        fontSize: "13px",
    },
    deleteBtn: {
        background: "transparent",
        border: "none",
        color: colors.second,
        fontSize: "18px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        width: "24px",
        height: "24px",
        borderRadius: borderRadius.sm,
        lineHeight: 1,
        transition: "color 0.15s ease",
    },
};
