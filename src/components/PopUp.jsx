import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { capitalizeWords } from "../utils/helperFunctions";
import { colors, typography, spacing, borderRadius } from "../utils/theme";

function PopUp({ show, onClose, onSave }) {
    const [task, setTask] = useState("");
    const [tag, setTag] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (show) {
            setTask("");
            setTag("");
            setError("");
        }
    }, [show]);

    const handleSave = () => {
        if (task.trim() === "") {
            setError("Task title cannot be empty.");
            return;
        }
        setError("");

        onSave({
            title: capitalizeWords(task.trim()),
            tag: tag.trim().toUpperCase(),
            description: ""
        });

        onClose();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
        }
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    style={styles.layer}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                >
                    <div style={styles.backdrop} onClick={onClose} aria-hidden="true" />
                    <motion.div
                        style={styles.popUp}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Add task"
                        initial={{ scale: 0.96, y: 12 }}
                        animate={{ scale: 1, y: 0, transition: { duration: 0.2, ease: [0.25, 1, 0.5, 1], delay: 0.04 } }}
                        exit={{ scale: 0.96, transition: { duration: 0.12 } }}
                    >
                        <div style={styles.header}>
                            <span style={styles.headerLabel}>ADD TASK</span>
                        </div>

                        <div style={styles.body}>
                            <div style={styles.fieldGroup}>
                                <label style={styles.fieldLabel}>TITLE</label>
                                <input
                                    type="text"
                                    style={styles.titleInput}
                                    placeholder="Enter task title..."
                                    value={task}
                                    onChange={(e) => { setTask(e.target.value); if (error) setError(""); }}
                                    onKeyDown={handleKeyDown}
                                    autoFocus
                                />
                                {error && <p style={styles.error}>{error}</p>}
                            </div>

                            <div style={styles.fieldGroup}>
                                <label style={styles.fieldLabel}>TAG (OPTIONAL)</label>
                                <input
                                    type="text"
                                    style={styles.tagInput}
                                    placeholder="e.g. WORK, HEALTH, STUDY"
                                    value={tag}
                                    onChange={(e) => setTag(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>
                        </div>

                        <div style={styles.footer}>
                            <button style={styles.cancelBtn} onClick={onClose}>
                                Cancel
                            </button>
                            <button style={styles.saveBtn} onClick={handleSave}>
                                Save Task
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default PopUp;

const styles = {
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
    popUp: {
        position: "relative",
        width: "min(480px, 90vw)",
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
    body: {
        display: "flex",
        flexDirection: "column",
        gap: spacing.lg,
        padding: spacing.sm,
    },
    fieldGroup: {
        display: "flex",
        flexDirection: "column",
        gap: spacing.xs,
    },
    fieldLabel: {
        ...typography.labelCaps,
        color: colors.second,
        fontSize: "11px",
    },
    titleInput: {
        width: "100%",
        height: "44px",
        backgroundColor: colors.background,
        border: `1px solid ${colors.border}`,
        borderRadius: borderRadius.sm,
        padding: "0 12px",
        color: colors.first,
        fontFamily: typography.fontFamily,
        fontSize: "15px",
        outline: "none",
        boxSizing: "border-box",
    },
    tagInput: {
        width: "100%",
        height: "40px",
        backgroundColor: colors.background,
        border: `1px solid ${colors.border}`,
        borderRadius: borderRadius.sm,
        padding: "0 12px",
        color: colors.first,
        fontFamily: typography.monoFontFamily || "monospace",
        fontSize: "13px",
        outline: "none",
        boxSizing: "border-box",
    },
    error: {
        color: "#E57373",
        fontSize: "12px",
        margin: "4px 0 0 0",
        fontFamily: typography.fontFamily,
    },
    footer: {
        display: "flex",
        justifyContent: "flex-end",
        gap: spacing.sm,
        borderTop: `1px solid ${colors.border}`,
        paddingTop: spacing.md,
    },
    cancelBtn: {
        backgroundColor: "transparent",
        color: colors.second,
        border: `1px solid ${colors.border}`,
        borderRadius: borderRadius.sm,
        padding: "6px 14px",
        fontFamily: typography.fontFamily,
        fontSize: "13px",
        cursor: "pointer",
    },
    saveBtn: {
        backgroundColor: colors.first,
        color: colors.background,
        border: "none",
        borderRadius: borderRadius.sm,
        padding: "6px 16px",
        fontFamily: typography.fontFamily,
        fontSize: "13px",
        fontWeight: "600",
        cursor: "pointer",
    },
};
