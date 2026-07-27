import React, { useState, useRef, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import DateNavigator from '../components/DateNavigator';
import NotesSection from '../components/NotesSection';
import Gauge from '../assets/Guage';
import Pencil from '../assets/Pencil';
import { colors, typography, spacing } from '../utils/theme';
import { getService } from "../utils/dataFunctions";
import { formatTime } from '../utils/helperFunctions';

function SleepPage({ onBack, currentDate, setCurrentDate }) {
    const [loading, setLoading] = useState(true);
    const [service, setService] = useState(null);
    const [formData, setFormData] = useState({});
    const [editingFields, setEditingFields] = useState({});
    const [tempValues, setTempValues] = useState({});
    const saveTimeoutRef = useRef(null);
    const notesRef = useRef('');
    const serviceRef = useRef(null);
    const formDataRef = useRef({});
    const inputRefs = useRef({}); // ADD: holds DOM nodes for each field's input
    const hasChanged = useRef(false);

    // Safely compute totals with fallback values to prevent NaN render errors
    const totalSleepMins =
        (formData.rem_sleep_duration || 0) +
        (formData.deep_sleep_duration || 0) +
        (formData.light_sleep_duration || 0);
    const goalMins = 480;
    const percentage = Math.min((totalSleepMins / goalMins) * 100, 100);

    useEffect(() => {
        let mounted = true;

        async function initialize() {
            try {
                if (!mounted) return;

                setLoading(true);
                const s = await getService();
                setService(s);
                const record = await s.getRecord(currentDate, "sleep_records_v2");

                if (record) {
                    setFormData({
                        sleep_start_time: record.sleep_start_time || '',
                        sleep_end_time: record.sleep_end_time || '',
                        rem_sleep_duration: record.rem_sleep_duration || 0,
                        deep_sleep_duration: record.deep_sleep_duration || 0,
                        light_sleep_duration: record.light_sleep_duration || 0,
                        awake_duration: record.awake_duration || 0,
                        sleep_quality_rating: record.sleep_quality_rating || '',
                        notes: record.notes || ''
                    });
                } else {
                    setFormData({
                        sleep_start_time: "",
                        sleep_end_time: "",
                        rem_sleep_duration: 0,
                        deep_sleep_duration: 0,
                        light_sleep_duration: 0,
                        awake_duration: 0,
                        sleep_quality_rating: "",
                        notes: ""
                    })
                }
            } catch (error) {
                console.error('Failed to initialize sleep page:', error);
                setFormData({
                    sleep_start_time: "",
                    sleep_end_time: "",
                    rem_sleep_duration: 0,
                    deep_sleep_duration: 0,
                    light_sleep_duration: 0,
                    awake_duration: 0,
                    sleep_quality_rating: "",
                    notes: ""
                })
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        initialize();

        return () => {
            mounted = false;
        };
    }, [currentDate]);

    useEffect(() => {
        formDataRef.current = formData;
        serviceRef.current = service;
    }, [formData, service]);

    useEffect(() => {
        if (!serviceRef.current || loading) return;

        const interval = setInterval(async () => {
            if (!hasChanged.current) return;
            try {
                const updatedData = {
                    ...formDataRef.current, // safe snapshot for non-notes fields
                    notes: notesRef.current
                };

                await serviceRef.current.saveRecord(currentDate, updatedData, "sleep_records_v2");
                hasChanged.current = false;
            } catch (error) {
                console.error('Failed to save sleep record:', error);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [currentDate, service, loading]);

    // ADD: focus whichever field just entered edit mode
    useEffect(() => {
        const activeField = Object.keys(editingFields).find((f) => editingFields[f]);
        if (activeField && inputRefs.current[activeField]) {
            inputRefs.current[activeField].focus();
        }
    }, [editingFields]);

    const startEditing = (field) => {
        setTempValues(prev => ({ ...prev, [field]: formData[field] }));
        setEditingFields(prev => ({ ...prev, [field]: true }));
    };

    const saveField = async (event, field) => {
        let latestValue = event.target.value;
        const nonNumbers = ["notes", "sleep_start_time", "sleep_end_time", "sleep_quality_rating"];
        if (!nonNumbers.includes(field)) {
            const parsed = Number(latestValue);
            latestValue = Number.isFinite(parsed) ? parsed : 0;
        }

        const updatedData = {
            ...formData,
            [field]: latestValue
        };

        setFormData(updatedData);
        setEditingFields(prev => ({ ...prev, [field]: false }));
        setTempValues(prev => {
            const next = { ...prev };
            delete next[field];
            return next;
        });

        if (!service) return;

        try {
            await service.saveRecord(currentDate, updatedData, "sleep_records_v2");
            console.log("information saved");
        } catch (error) {
            console.error('Failed to save sleep record:', error);
        }
    }

    const handleKeyPress = (e, field) => {
        if (e.key === 'Enter') {
            e.target.blur();
        }
    };

    const handleNotesChange = (value) => {
        notesRef.current = value;
        hasChanged.current = true;
        setFormData(prev => ({ ...prev, notes: value }));
    };

    const handleTempChange = (field) => (e) => {
        const value = e.target.value;

        setTempValues(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const sleepStages = [
        { field: 'rem_sleep_duration', label: 'REM', color: colors.first },
        { field: 'deep_sleep_duration', label: 'Deep Sleep', color: colors.second },
        { field: 'light_sleep_duration', label: 'Light Sleep', color: colors.third },
        { field: 'awake_duration', label: 'Awake', color: colors.fourth }
    ];

    return (
        <div style={styles.container}>
            <PageHeader onBack={onBack} />
            <div style={styles.content}>
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

                <div style={styles.mainGrid}>
                    {/* Left Column */}
                    <div style={styles.summaryCard}>
                        <div style={styles.gaugeWrapper}>
                            <Gauge
                                percentage={percentage}
                                totalValue={totalSleepMins}
                                goalText="GOAL: 8h 00m"
                            />

                            <div style={styles.gaugeText}>
                                <p style={{ margin: 0, fontSize: '18px', fontWeight: '700' }}>
                                    {formatTime(totalSleepMins)}
                                </p>
                                <p style={{ margin: 0, marginTop: '8px', fontSize: '12px' }}>
                                    GOAL: 8h 00M
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div style={styles.detailsColumn}>
                        {/* Sleep Schedule Section */}
                        <div style={styles.sectionCard}>
                            <h3 style={styles.sectionHeader}>Sleep Schedule</h3>

                            <div style={styles.labelGrid}>
                                <label style={styles.fieldLabel}>Went To Bed</label>
                                <label style={styles.fieldLabel}>Woke Up</label>
                            </div>

                            <div style={styles.valuesGrid}>
                                <div style={styles.fieldValueRow}>
                                    {editingFields.sleep_start_time ? (
                                        <input
                                            type="text"
                                            ref={(el) => (inputRefs.current.sleep_start_time = el)}
                                            value={tempValues.sleep_start_time}
                                            onChange={handleTempChange("sleep_start_time")}
                                            onKeyDown={(e) => handleKeyPress(e, 'sleep_start_time')}
                                            onBlur={(e) => saveField(e, 'sleep_start_time')}
                                            style={styles.timeInputFull}
                                        />
                                    ) : (
                                        <span style={styles.fieldValueText}>
                                            {formData.sleep_start_time || '--:-- --'}
                                        </span>
                                    )}
                                    {!editingFields.sleep_start_time && (
                                        <Pencil onClick={() => startEditing('sleep_start_time')} />
                                    )}
                                </div>

                                <div style={styles.fieldValueRow}>
                                    {editingFields.sleep_end_time ? (
                                        <input
                                            type="text"
                                            ref={(el) => (inputRefs.current.sleep_end_time = el)}
                                            value={tempValues.sleep_end_time}
                                            onChange={handleTempChange("sleep_end_time")}
                                            onKeyDown={(e) => handleKeyPress(e, 'sleep_end_time')}
                                            onBlur={(e) => saveField(e, 'sleep_end_time')}
                                            style={styles.timeInputFull}
                                        />
                                    ) : (
                                        <span style={styles.fieldValueText}>
                                            {formData.sleep_end_time || '--:-- --'}
                                        </span>
                                    )}
                                    {!editingFields.sleep_end_time && (
                                        <Pencil onClick={() => startEditing('sleep_end_time')} />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sleep Stages Section */}
                        <div style={styles.sectionCard}>
                            <h3 style={styles.sectionHeader}>SLEEP STAGES</h3>

                            {sleepStages.map(({ field, label, color }) => (
                                <div key={field} style={{ ...styles.stageRow, ...(editingFields[field]) }}>
                                    <div style={{ ...styles.stageIndicator, backgroundColor: color }}></div>
                                    <span style={styles.stageLabel}>{label}</span>
                                    {editingFields[field] ? (
                                        <input
                                            type="text"
                                            ref={(el) => (inputRefs.current[field] = el)}
                                            value={tempValues[field] ?? ''}
                                            onChange={handleTempChange(field)}
                                            onKeyDown={(e) => handleKeyPress(e, field)}
                                            onBlur={(e) => saveField(e, field)}
                                            style={styles.durationInput}
                                        />
                                    ) : (
                                        <span style={styles.stageValue}>{formatTime(formData[field])}</span>
                                    )}
                                    {!editingFields[field] && (
                                        <Pencil onClick={() => startEditing(field)} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <NotesSection
                    value={formData.notes}
                    onChange={handleNotesChange}
                />
            </div>
        </div>
    );
}

const styles = {
    container: {
        height: '100vh',
        width: '100vw',
        boxSizing: 'border-box',
        overflow: 'hidden',
    },
    content: {
        width: '60%',
        height: '93%',
        position: 'absolute',
        bottom: '0',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'grid',
        gridTemplateRows: '.1fr 1fr .8fr',
        gap: '2%',
        boxSizing: 'border-box',
        paddingTop: '2%',
    },
    mainGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1.5fr',
        gap: spacing.xl,
        width: '100%',
    },
    // Styles for left column
    summaryCard: {
        backgroundColor: colors.card,
        borderRadius: '24px',
        padding: spacing.xl,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        marginBottom: '10%',
        marginTop: '10%'
    },
    gaugeWrapper: {
        position: 'relative',
        width: 220,
        height: 220,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    gaugeText: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        textAlign: 'center',
        pointerEvents: 'none',
    },
    qualityPill: {
        backgroundColor: colors.card,
        color: colors.primary,
        padding: '8px 24px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: 'bold'
    },
    // styles for right column
    detailsColumn: {
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.lg
    },
    // General styles for sections in right column
    sectionCard: {
        backgroundColor: colors.card,
        borderRadius: '24px',
        padding: '32px'
    },
    sectionHeader: {
        fontSize: '18px',
        letterSpacing: '1px',
        marginBottom: '16px',
        color: colors.textPrimary,
        fontWeight: '900',
    },
    // styles for sleep schedule
    labelGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: spacing.md,
        marginBottom: '6px'
    },
    fieldLabel: {
        fontSize: '12px',
        color: colors.textSecondary,
        letterSpacing: '0.5px'
    },
    valuesGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: spacing.md
    },
    fieldValueRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        minHeight: '24px',
    },
    timeInputFull: {
        width: '160px',
        fontSize: '18px',
        fontWeight: '900',
        border: 'none',
        outline: 'none',
        backgroundColor: '#d7e9ff88',
        color: colors.textPrimary,
    },
    fieldValueText: {
        fontSize: '18px',
        fontWeight: '900',
        color: colors.textPrimary,
    },
    // styles for sleep stages
    stageRow: {
        display: 'flex', alignItems: 'center', backgroundColor: colors.surface,
        padding: '12px 16px', borderRadius: '12px', marginBottom: spacing.sm
    },
    stageIndicator: { width: '4px', height: '24px', borderRadius: '2px', marginRight: spacing.md },
    stageLabel: { flex: 1, fontSize: '14px', fontWeight: '500' },
    stageValue: { fontSize: '14px', fontWeight: 'bold', marginRight: spacing.sm },
    durationInput: {
        width: '60px', fontSize: '14px', fontWeight: 'bold', border: 'none',
        outline: 'none', backgroundColor: 'transparent', textAlign: 'right', marginRight: spacing.sm
    }
};

export default SleepPage;