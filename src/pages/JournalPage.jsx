import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import PageLayout from "../components/PageLayout";
import DateNavigator from "../components/DateNavigator";
import JournalTemplate from "../components/JournalTemplate";
import PopUp from "../components/PopUp";
import Detail from "../components/Detail";
import Summary from "../components/Summary";
import Plus from "../assets/Plus";
import Swirl from "../assets/Swirl";
import { colors, spacing, borderRadius, typography } from "../utils/theme";

function JournalPage({ onBack, currentDate, setCurrentDate, service, onCalendarClick }) {
    const [pop, changePop] = useState(false);
    const [detailPop, changeDetailPop] = useState(false);
    const [summaryPop, changeSummaryPop] = useState(false);
    const [entryList, setEntryList] = useState([]);
    const [editingIndex, setEditingIndex] = useState(null);
    const [editingInfo, setEditingInfo] = useState({ title: "", tag: "", description: "" });
    const [summaryList, setSummaryList] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load entries for currentDate from database
    useEffect(() => {
        let mounted = true;
        async function loadJournal() {
            if (!service) return;
            try {
                setLoading(true);
                const record = await service.getRecord(currentDate, "journal_records");
                if (!mounted) return;
                if (record && Array.isArray(record.entries)) {
                    setEntryList(record.entries);
                } else {
                    setEntryList([]);
                }
            } catch (e) {
                console.error("Failed to load journal record:", e);
                if (mounted) setEntryList([]);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        loadJournal();
        return () => { mounted = false; };
    }, [currentDate, service]);

    // Save entries array immediately to database
    const saveEntries = async (updatedEntries) => {
        setEntryList(updatedEntries);
        if (service) {
            try {
                await service.saveRecord(currentDate, { entries: updatedEntries }, "journal_records");
            } catch (e) {
                console.error("Failed to save journal records:", e);
            }
        }
    };

    const closePopUp = () => {
        changePop(false);
    };

    const closeDetailPopUp = () => {
        changeDetailPop(false);
        setEditingIndex(null);
        setEditingInfo({ title: "", tag: "", description: "" });
    };

    // Handles "add new" from small popup
    const handleCreate = async (newEntry) => {
        const updated = [...entryList, newEntry];
        await saveEntries(updated);
        closePopUp();
    };

    // Handles "save edit" from Detail popup
    const handleUpdate = async (updatedEntry) => {
        if (editingIndex === null || editingIndex < 0 || editingIndex >= entryList.length) return;
        const updated = [...entryList];
        updated[editingIndex] = updatedEntry;
        await saveEntries(updated);
        closeDetailPopUp();
    };

    // Handles delete from block
    const handleDelete = async (indexToDelete) => {
        const updated = entryList.filter((_, idx) => idx !== indexToDelete);
        await saveEntries(updated);
    };

    // Opens Detail popup for editing
    const handleEdit = (index) => {
        const selected = entryList[index];
        if (!selected) return;
        setEditingIndex(index);
        setEditingInfo(selected);
        changeDetailPop(true);
    };

    // Opens Swirl monthly summary
    const handleOpenSummary = async () => {
        if (!service) {
            setSummaryList([]);
            changeSummaryPop(true);
            return;
        }
        try {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth(); // 0-indexed
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const monthlyRecords = await service.getRecordsForMonth(year, month, "journal_records");

            const tagDayCounts = {};
            monthlyRecords.forEach(rec => {
                if (rec.info && Array.isArray(rec.info.entries)) {
                    // Find all unique non-empty tags for this date
                    const uniqueTagsOnDate = new Set();
                    rec.info.entries.forEach(entry => {
                        if (entry.tag && entry.tag.trim() !== '') {
                            uniqueTagsOnDate.add(entry.tag.trim().toUpperCase());
                        }
                    });
                    uniqueTagsOnDate.forEach(tag => {
                        tagDayCounts[tag] = (tagDayCounts[tag] || 0) + 1;
                    });
                }
            });

            const summaryData = Object.entries(tagDayCounts).map(([tag, count]) => ({
                tag: tag,
                count: count,
                percent: Math.round((count / daysInMonth) * 100)
            }));

            setSummaryList(summaryData);
        } catch (e) {
            console.error("Failed to generate monthly summary:", e);
            setSummaryList([]);
        }
        changeSummaryPop(true);
    };

    return (
        <PageLayout onBack={onBack} onCalendarClick={onCalendarClick}>
            <DateNavigator
                currentDate={currentDate}
                onPrevious={() =>
                    setCurrentDate(prev => {
                        const newDate = new Date(prev);
                        newDate.setDate(newDate.getDate() - 1);
                        return newDate;
                    })
                }
                onNext={() =>
                    setCurrentDate(prev => {
                        const newDate = new Date(prev);
                        newDate.setDate(newDate.getDate() + 1);
                        return newDate;
                    })
                }
            />

            {/* Main Section Header */}
            <div style={styles.sectionHeader}>
                <h3 style={styles.cardHeader}>DAILY TASKS</h3>
                <span style={styles.itemCount}>
                    {entryList.length} LOGGED
                </span>
            </div>

            {/* 4-column, max 3 rows scrollable grid */}
            <div style={styles.gridWrapper} className="no-scrollbar">
                {entryList.length === 0 ? (
                    <div style={styles.emptyContainer}>
                        <p style={styles.emptyText}>No tasks logged for this date. Click + to add one.</p>
                    </div>
                ) : (
                    <div style={styles.gridContainer}>
                        <AnimatePresence>
                            {entryList.map((entry, index) => (
                                <JournalTemplate
                                    key={index}
                                    entry={entry.title}
                                    tag={entry.tag}
                                    onDelete={() => handleDelete(index)}
                                    onEdit={() => handleEdit(index)}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Swirl Button - Bottom Left Corner */}
            <div style={styles.swirlWrap}>
                <Swirl size="58px" onClick={handleOpenSummary} aria-label="Monthly summary" />
            </div>

            {/* Plus Button - Bottom Right Corner */}
            <div style={styles.addWrap}>
                <Plus size="58px" onClick={() => changePop(true)} aria-label="Add task" />
            </div>

            {/* Popups */}
            <PopUp show={pop} onClose={closePopUp} onSave={handleCreate} />

            <Detail
                show={detailPop}
                info={editingInfo}
                onClose={closeDetailPopUp}
                onSave={handleUpdate}
            />

            <Summary
                show={summaryPop}
                onClose={() => changeSummaryPop(false)}
                summary={summaryList}
            />
        </PageLayout>
    );
}

export default JournalPage;

const styles = {
    sectionHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: spacing.xs,
    },
    cardHeader: {
        ...typography.labelCaps,
        color: colors.second,
        margin: 0,
    },
    itemCount: {
        ...typography.labelCaps,
        fontSize: "11px",
        color: colors.second,
    },
    gridWrapper: {
        width: "100%",
        padding: spacing.lg,
        boxSizing: "border-box",
        maxHeight: "600px",
        overflowY: "auto",
    },
    gridContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: spacing.md,
        width: "100%",
        boxSizing: "border-box",
    },
    emptyContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "200px",
        width: "100%",
    },
    emptyText: {
        color: colors.second,
        fontFamily: typography.fontFamily,
        fontSize: "14px",
        margin: 0,
    },
    swirlWrap: {
        position: "fixed",
        bottom: "1.5rem",
        left: "1.5rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
        padding: "6px",
        cursor: "pointer",
    },
    addWrap: {
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
        padding: "6px",
        cursor: "pointer",
    },
};
