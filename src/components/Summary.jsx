import { AnimatePresence, motion } from "framer-motion";
import { colors, typography, spacing, borderRadius } from "../utils/theme";

function Summary({ show, onClose, summary }) {
    
    const summaryData =
        !summary || summary.length === 0 ? (
            <p style={style.emptyText}>Nothing logged this month.</p>
        ) : (
            <ul style={style.list}>
                {summary.map((s, index) => (
                    <li key={index} style={style.listItem}>
                        <span style={style.tagText}>{s.tag.toLowerCase()}</span>
                        <span style={style.statText}>{s.count} days ({s.percent}%)</span>
                    </li>
                ))}
            </ul>
        );

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
                        aria-label="Monthly summary"
                        initial={{ scale: 0.96, y: 12 }}
                        animate={{ scale: 1, y: 0, transition: { duration: 0.2, ease: [0.25, 1, 0.5, 1], delay: 0.04 } }}
                        exit={{ scale: 0.96, transition: { duration: 0.12 } }}
                    >
                        <div style={style.header}>
                            <span style={style.headerLabel}>MONTHLY SUMMARY</span>
                            <button style={style.closeBtn} onClick={onClose} aria-label="Close">
                                &times;
                            </button>
                        </div>
                        <div style={style.body} className="no-scrollbar">
                            {summaryData}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default Summary;

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
        width: "min(600px, 90vw)",
        maxHeight: "min(400px, 80vh)",
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
    headerLabel: {
        ...typography.labelCaps,
        color: colors.second,
        fontSize: "12px",
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
    body: {
        flex: 1,
        overflowY: "auto",
        paddingRight: "4px",
    },
    emptyText: {
        color: colors.second,
        fontFamily: typography.fontFamily,
        fontSize: "14px",
        margin: 0,
    },
    list: {
        margin: 0,
        padding: 0,
        listStyle: "none",
        display: "flex",
        flexDirection: "column",
        gap: spacing.sm,
    },
    listItem: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: `${spacing.xs} 0`,
        borderBottom: `1px solid ${colors.border}`,
    },
    tagText: {
        fontFamily: typography.fontFamily,
        color: colors.first,
        fontSize: "15px",
        fontWeight: "500",
        textTransform: "lowercase",
    },
    statText: {
        fontFamily: typography.monoFontFamily || "monospace",
        color: colors.second,
        fontSize: "13px",
    },
};