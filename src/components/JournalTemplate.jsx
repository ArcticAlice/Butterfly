import { useState } from "react";
import { motion } from "framer-motion";
import { colors, typography, spacing, borderRadius } from "../utils/theme";

function Template({ entry, tag, onDelete, onEdit }) {
    const [hovered, setHovered] = useState(false);

    const boxStyle = {
        ...style.box,
        borderColor: hovered ? colors.first : colors.border,
        boxShadow: hovered
            ? `0 0 12px rgba(237, 203, 150, 0.2)`
            : "none",
        zIndex: hovered ? 2 : 1,
    };

    return (
        <motion.div
            style={boxStyle}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setHovered(true)}
            onBlur={() => setHovered(false)}
            onClick={onEdit}
            tabIndex={0}
            aria-label={entry}
            onKeyDown={(e) => { if (e.key === 'Enter') onEdit(); }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.12 } }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
        >
            {/* Delete 'x' button in Top Left Corner */}
            <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                style={style.deleteBtn}
                aria-label="Delete task"
                title="Delete"
            >
                &times;
            </button>

            {/* Center task title */}
            <div style={style.body}>
                <p style={style.text} title={entry}>{entry}</p>
            </div>

            {/* Tag badge in Bottom Right Corner */}
            {tag && (
                <div style={style.tagWrap}>
                    <span style={style.tagBadge}>{tag}</span>
                </div>
            )}
        </motion.div>
    );
}

export default Template;

const style = {
    box: {
        position: "relative",
        width: "100%",
        aspectRatio: "1 / 0.75",
        backgroundColor: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: borderRadius.md,
        padding: spacing.sm,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    },
    deleteBtn: {
        position: "absolute",
        top: "6px",
        left: "8px",
        background: "transparent",
        border: "none",
        color: colors.second,
        fontSize: "20px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        width: "20px",
        height: "20px",
        lineHeight: 1,
        transition: "color 0.15s ease",
        zIndex: 2,
    },
    body: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "16px 8px 12px 8px",
        overflow: "hidden",
    },
    text: {
        margin: 0,
        color: colors.first,
        fontFamily: typography.fontFamily,
        fontSize: "14px",
        fontWeight: "500",
        lineHeight: "1.3",
        display: "-webkit-box",
        WebkitLineClamp: 3,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        textOverflow: "ellipsis",
        wordBreak: "break-word",
    },
    tagWrap: {
        position: "absolute",
        bottom: "6px",
        right: "8px",
        display: "flex",
        alignItems: "center",
    },
    tagBadge: {
        ...typography.labelCaps,
        fontSize: "9px",
        color: colors.first,
        backgroundColor: "#1F1F1F",
        border: `1px solid ${colors.border}`,
        borderRadius: borderRadius.sm,
        padding: "2px 6px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: "100px",
    },
};

