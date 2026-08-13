import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { capitalizeWords } from "../utils/helperFunctions";
import { colors, typography, spacing, borderRadius } from "../utils/theme";

function Detail({ show, info, onClose, onSave }) {
    const [task, setTask] = useState("");
    const [tag, setTag] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!show) return;

        setTask(info?.title || info?.taskName || "");
        setTag(info?.tag || info?.taskTag || "");
        setDescription(info?.description || "");
        setError("");
    }, [show, info]);

    const handleSave = () => {
        if (task.trim() === "") {
            setError("Task title cannot be empty.");
            return;
        }
        setError("");

        onSave({
            title: capitalizeWords(task.trim()),
            tag: tag.trim().toUpperCase(),
            description: description,
        });

        onClose();
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
                        aria-label="Task details"
                        initial={{ scale: 0.96, y: 12 }}
                        animate={{ scale: 1, y: 0, transition: { duration: 0.2, ease: [0.25, 1, 0.5, 1], delay: 0.04 } }}
                        exit={{ scale: 0.96, transition: { duration: 0.12 } }}
                    >
                        {/* Header with colors.first background */}
                        <div style={styles.top}>
                            <h2 style={styles.headerTitle}>Details</h2>
                        </div>

                        {/* Middle Content */}
                        <div style={styles.middle}>
                            <input
                                type="text"
                                style={styles.taskName}
                                placeholder="Task title"
                                value={task}
                                onChange={(e) => { setTask(e.target.value); if (error) setError(""); }}
                                autoFocus
                            />

                            <textarea
                                style={styles.descriptionInput}
                                placeholder="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        {/* Footer */}
                        <div style={styles.bottom}>
                            <input
                                type="text"
                                style={styles.tag}
                                placeholder="Tag"
                                value={tag}
                                onChange={(e) => setTag(e.target.value)}
                            />
                            {error && <p style={styles.error}>{error}</p>}
                            <div style={styles.buttonGroup}>
                                <button style={styles.cancelBtn} onClick={onClose}>
                                    Cancel
                                </button>
                                <button style={styles.saveButton} onClick={handleSave}>
                                    Save
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default Detail;

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
        width: "min(700px, 90vw)",
        height: "min(560px, 90vh)",
        backgroundColor: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: borderRadius.md,
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        overflow: "hidden",
        boxShadow: "0 12px 32px rgba(0, 0, 0, 0.6)",
    },
    top: {
        height: "48px",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        boxSizing: "border-box",
        backgroundColor: colors.first,
        borderTopLeftRadius: borderRadius.md,
        borderTopRightRadius: borderRadius.md,
    },
    headerTitle: {
        color: colors.background,
        fontSize: "16px",
        fontWeight: "600",
        margin: 0,
        fontFamily: typography.fontFamily,
    },
    middle: {
        flex: 1,
        position: "relative",
        boxSizing: "border-box",
        padding: spacing.lg,
        display: "flex",
        flexDirection: "column",
        gap: spacing.md,
    },
    taskName: {
        color: colors.first,
        fontSize: "24px",
        fontWeight: "500",
        fontFamily: typography.fontFamily,
        background: "transparent",
        border: "none",
        borderBottom: `1px solid ${colors.border}`,
        outline: "none",
        paddingBottom: "8px",
        width: "100%",
        boxSizing: "border-box",
    },
    descriptionInput: {
        flex: 1,
        background: colors.background,
        border: `1px solid ${colors.border}`,
        borderRadius: borderRadius.sm,
        color: colors.first,
        fontFamily: typography.fontFamily,
        fontSize: "14px",
        padding: "12px",
        outline: "none",
        resize: "none",
        boxSizing: "border-box",
        lineHeight: "1.5",
    },
    bottom: {
        height: "56px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: `0 ${spacing.lg}`,
        boxSizing: "border-box",
        borderTop: `1px solid ${colors.border}`,
    },
    tag: {
        background: colors.background,
        border: `1px solid ${colors.border}`,
        borderRadius: borderRadius.sm,
        outline: "none",
        fontSize: "13px",
        color: colors.second,
        fontFamily: typography.monoFontFamily || "monospace",
        padding: "6px 10px",
        width: "140px",
    },
    buttonGroup: {
        display: "flex",
        alignItems: "center",
        gap: spacing.sm,
    },
    cancelBtn: {
        backgroundColor: "transparent",
        color: colors.second,
        border: `1px solid ${colors.border}`,
        borderRadius: borderRadius.sm,
        padding: "8px 16px",
        fontFamily: typography.fontFamily,
        fontSize: "14px",
        cursor: "pointer",
    },
    saveButton: {
        backgroundColor: colors.first,
        color: colors.background,
        border: "none",
        padding: "8px 18px",
        borderRadius: borderRadius.sm,
        fontWeight: "600",
        fontFamily: typography.fontFamily,
        fontSize: "14px",
        cursor: "pointer",
    },
    error: {
        color: "#E57373",
        fontSize: "12px",
        margin: 0,
        fontFamily: typography.fontFamily,
    },
};
