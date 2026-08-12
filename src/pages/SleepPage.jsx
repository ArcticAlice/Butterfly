import React, { useState, useRef, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import DateNavigator from '../components/DateNavigator';
import NotesSection from '../components/NotesSection';
import Gauge from '../assets/Guage';
import { colors, typography, spacing, borderRadius } from '../utils/theme';
import { formatTime } from '../utils/helperFunctions';

function SleepPage({ onBack, currentDate, setCurrentDate, service, onCalendarClick }) {
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({});
    const [editingFields, setEditingFields] = useState({});
    const [tempValues, setTempValues] = useState({});
    const notesRef = useRef('');
    const serviceRef = useRef(null);
    const formDataRef = useRef({});
    const inputRefs = useRef({});
    const hasChanged = useRef(false);

    // Compute totals
    const totalSleepMins =
        (formData.rem_sleep_duration || 0) +
        (formData.deep_sleep_duration || 0) +
        (formData.light_sleep_duration || 0);
    const goalMins = 480;
    const percentage = Math.min((totalSleepMins / goalMins) * 100, 100);

    useEffect(() => {
        let mounted = true;

        async function initialize() {
            if (!service) return;
            try {
                if (!mounted) return;
                setLoading(true);

                const record = await service.getRecord(currentDate, "sleep_records_v2");

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
                    });
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
                });
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
    }, [currentDate, service]);

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
                    ...formDataRef.current,
                    notes: notesRef.current
                };

                await serviceRef.current.saveRecord(currentDate, updatedData, "sleep_records_v2");
                hasChanged.current = false;
            } catch (error) {
                console.error('Failed to save sleep record:', error);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [currentDate, service, loading]);

    // Auto-focus field when edit mode activates
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
        } catch (error) {
            console.error('Failed to save sleep record:', error);
        }
    };

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

            <div style={styles.mainGrid}>
                {/* Left Column: SLEEP QUALITY */}
                <div style={styles.card}>
                    <h3 style={styles.cardHeader}>SLEEP QUALITY</h3>
                    <div style={styles.gaugeContainer}>
                        <div style={styles.gaugeWrapper}>
                            <Gauge
                                percentage={percentage}
                                totalValue={totalSleepMins}
                                primaryColor={colors.first}
                                size={245}
                            />
                            <div style={styles.gaugeText}>
                                <span style={styles.totalSleepVal}>{formatTime(totalSleepMins)}</span>
                                <span style={styles.goalText}>GOAL: 8H 00M</span>
                            </div>
                        </div>
                    </div>
                </div>



                {/* Right Column */}
                <div style={styles.rightColumn}>
                    {/* SLEEP SCHEDULE */}
                    <div style={styles.card}>
                        <h3 style={styles.cardHeader}>SLEEP SCHEDULE</h3>

                        <div style={styles.scheduleGrid}>
                            <div style={styles.scheduleBlock}>
                                <label style={styles.subLabel}>Went To Bed</label>
                                {editingFields.sleep_start_time ? (
                                    <input
                                        type="text"
                                        ref={(el) => (inputRefs.current.sleep_start_time = el)}
                                        value={tempValues.sleep_start_time ?? ''}
                                        onChange={handleTempChange("sleep_start_time")}
                                        onKeyDown={(e) => handleKeyPress(e, 'sleep_start_time')}
                                        onBlur={(e) => saveField(e, 'sleep_start_time')}
                                        style={styles.timeInput}
                                    />
                                ) : (
                                    <div
                                        style={styles.timeDisplay}
                                        onClick={() => startEditing('sleep_start_time')}
                                        title="Click to edit"
                                    >
                                        {formData.sleep_start_time || '00:00 PM'}
                                    </div>
                                )}
                            </div>

                            <div style={styles.scheduleBlock}>
                                <label style={styles.subLabel}>Woke Up</label>
                                {editingFields.sleep_end_time ? (
                                    <input
                                        type="text"
                                        ref={(el) => (inputRefs.current.sleep_end_time = el)}
                                        value={tempValues.sleep_end_time ?? ''}
                                        onChange={handleTempChange("sleep_end_time")}
                                        onKeyDown={(e) => handleKeyPress(e, 'sleep_end_time')}
                                        onBlur={(e) => saveField(e, 'sleep_end_time')}
                                        style={styles.timeInput}
                                    />
                                ) : (
                                    <div
                                        style={styles.timeDisplay}
                                        onClick={() => startEditing('sleep_end_time')}
                                        title="Click to edit"
                                    >
                                        {formData.sleep_end_time || '00:00 AM'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* SLEEP STAGES */}
                    <div style={styles.card}>
                        <h3 style={styles.cardHeader}>SLEEP STAGES</h3>
                        <div style={styles.stagesList}>
                            {sleepStages.map(({ field, label, color }, idx) => (
                                <div
                                    key={field}
                                    style={{
                                        ...styles.stageRow,
                                        borderBottom: idx === sleepStages.length - 1 ? 'none' : styles.stageRow.borderBottom,
                                    }}
                                    onClick={() => !editingFields[field] && startEditing(field)}
                                    title="Click to edit"
                                >
                                    <div style={{ ...styles.stagePill, backgroundColor: color }} />
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
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom: DAILY NOTES */}
            <NotesSection
                value={formData.notes}
                onChange={handleNotesChange}
            />
        </PageLayout>
    );
}

const styles = {
    mainGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1.25fr',
        gap: spacing.lg,
        width: '100%',
    },
    card: {
        backgroundColor: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: borderRadius.md,
        padding: spacing.xl,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
    },
    cardHeader: {
        ...typography.labelCaps,
        color: colors.second,
        margin: `0 0 ${spacing.md} 0`,
    },
    gaugeContainer: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `${spacing.lg} 0`,
    },
    gaugeWrapper: {
        position: 'relative',
        width: 245,
        height: 245,
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
        textAlign: 'center',
        pointerEvents: 'none',
    },
    totalSleepVal: {
        fontFamily: typography.fontFamily,
        fontSize: '32px',
        fontWeight: '300',
        color: colors.first,
        lineHeight: '38px',
    },
    goalText: {
        ...typography.labelCaps,
        color: colors.second,
        marginTop: '6px',
        fontSize: '11px',
    },
    rightColumn: {
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.lg,
    },
    scheduleGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: spacing.lg,
        paddingTop: spacing.xs,
    },
    scheduleBlock: {
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.xs,
    },
    subLabel: {
        fontFamily: typography.fontFamily,
        fontSize: '14px',
        fontWeight: '400',
        color: colors.second,
    },
    timeDisplay: {
        fontFamily: typography.fontFamily,
        fontSize: '32px',
        fontWeight: '300',
        color: colors.first,
        cursor: 'pointer',
        userSelect: 'none',
        lineHeight: '40px',
        padding: '3px 0',
        transition: 'opacity 0.15s ease',
    },
    timeInput: {
        fontFamily: typography.fontFamily,
        fontSize: '24px',
        fontWeight: '400',
        color: colors.first,
        backgroundColor: colors.background,
        border: `1px solid ${colors.border}`,
        borderRadius: borderRadius.sm,
        outline: 'none',
        padding: '4px 8px',
        width: '100%',
        boxSizing: 'border-box',
    },
    stagesList: {
        display: 'flex',
        flexDirection: 'column',
    },
    stageRow: {
        display: 'flex',
        alignItems: 'center',
        padding: '10px 0',
        borderBottom: `1px solid ${colors.border}`,
        cursor: 'pointer',
        userSelect: 'none',
    },


    stagePill: {
        width: '3px',
        height: '18px',
        borderRadius: borderRadius.full,
        marginRight: spacing.md,
    },
    stageLabel: {
        flex: 1,
        fontFamily: typography.fontFamily,
        fontSize: '15px',
        fontWeight: '400',
        color: colors.first,
    },
    stageValue: {
        fontFamily: typography.fontFamily,
        fontSize: '15px',
        fontWeight: '400',
        color: colors.first,
    },
    durationInput: {
        fontFamily: typography.monoFontFamily || 'monospace',
        fontSize: '14px',
        fontWeight: '500',
        color: colors.first,
        backgroundColor: colors.background,
        border: `1px solid ${colors.border}`,
        borderRadius: borderRadius.sm,
        outline: 'none',
        padding: '2px 6px',
        width: '70px',
        textAlign: 'right',
    }
};

export default SleepPage;