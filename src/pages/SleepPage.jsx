import React, { useState, useRef, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import DateNavigator from '../components/DateNavigator';
import NotesSection from '../components/NotesSection';
import Gauge from '../assets/Guage';
import Pencil from '../assets/Pencil';
import { colors, typography, spacing } from '../styles/theme';
import { getSleepService } from "../utils/dataFunctions";
import { formatTime } from '../utils/helperFunctions';

function SleepPage({ onBack }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [saveStatus, setSaveStatus] = useState('idle');
    const [loading, setLoading] = useState(true);
    const [sleepService, setSleepService] = useState(null);
    const [formData, setFormData] = useState({});
    const [editingFields, setEditingFields] = useState({});
    const [tempValues, setTempValues] = useState({});
    const saveTimeoutRef = useRef(null);

    // Safely compute totals with fallback values to prevent NaN render errors
    const totalSleepMins =
        (formData.rem_sleep_duration || 0) +
        (formData.deep_sleep_duration || 0) +
        (formData.light_sleep_duration || 0);
    const goalMins = 480;
    const percentage = Math.min((totalSleepMins / goalMins) * 100, 100);

    useEffect(() => {
        let mounted = true;

        async function init() {
            const service = await getSleepService();
            if (mounted) {
                setSleepService(service);
            }
        }

        init();

        return () => {
            mounted = false;
        };
    }, []);

    // Load sleep record from database for current date
    const loadSleepRecord = async () => {
        if (!sleepService) return;

        try {
            setLoading(true);
            const record = await sleepService.getSleepRecord(currentDate);

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
                setFormData(sleepService.getDefaultSleepRecord());
            }
        } catch (error) {
            console.error('Failed to load sleep record:', error);
            setFormData(sleepService.getDefaultSleepRecord());
        } finally {
            setLoading(false);
        }
    };

    // Debounced save delegates exclusively to saveSleepRecord as required
    const debouncedSave = (data, instant) => {
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }

        setSaveStatus('saving');
        const time = instant ? 500 : 3500;

        saveTimeoutRef.current = setTimeout(async () => {
            if (!sleepService) return;

            try {
                await sleepService.saveSleepRecord(currentDate, data);
                setSaveStatus('saved');
                setTimeout(() => setSaveStatus('idle'), 1000);
            } catch (error) {
                console.error('Failed to save sleep record:', error);
                setSaveStatus('error');
                setTimeout(() => setSaveStatus('idle'), 1000);
            }
        }, time);
    };

    const startEditing = (field) => {
        setTempValues(prev => ({ ...prev, [field]: formData[field] }));
        setEditingFields(prev => ({ ...prev, [field]: true }));
    };

    const saveField = (field, instant = false, directValue = null) => {
        const rawValue = directValue !== null ? directValue : tempValues[field];
        const textFields = ['notes', 'sleep_start_time', 'sleep_end_time'];
        const formattedValue = textFields.includes(field) ? rawValue : rawValue === '' ? 0 : Number(rawValue);

        const updatedData = {
            ...formData,
            [field]: formattedValue
        };

        setFormData(updatedData);
        setEditingFields(prev => ({ ...prev, [field]: false }));
        debouncedSave(updatedData, instant);
    };

    const handleTempChange = (field, value) => {
        setTempValues(prev => ({
            ...prev,
            [field]: value === '' ? '' : value
        }));
    };

    const handleKeyPress = (e, field) => {
        if (e.key === 'Enter') {
            saveField(field, true);
        }
    };

    const handleNotesChange = (value) => {
        const updatedData = { ...formData, notes: value };
        setFormData(updatedData);
        debouncedSave(updatedData, false);
    };

    useEffect(() => {
        loadSleepRecord();
    }, [currentDate, sleepService]);

    useEffect(() => {
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, []);

    const sleepStages = [
        { field: 'rem_sleep_duration', label: 'REM', color: colors.primary },
        { field: 'deep_sleep_duration', label: 'Deep Sleep', color: colors.secondary },
        { field: 'light_sleep_duration', label: 'Light Sleep', color: colors.accent },
        { field: 'awake_duration', label: 'Awake', color: colors.primarySoft }
    ];

    if (loading) return <div>Loading...</div>;

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
                                <div style={{ ...styles.fieldValueRow, ...(editingFields.sleep_start_time) }}>
                                    {editingFields.sleep_start_time ? (
                                        <input
                                            type="text"
                                            value={tempValues.sleep_start_time}
                                            onChange={(e) => handleTempChange('sleep_start_time', e.target.value)}
                                            onKeyPress={(e) => handleKeyPress(e, 'sleep_start_time')}
                                            style={styles.timeInputFull}
                                            autoFocus
                                            onBlur={() => saveField('sleep_start_time', true)}
                                        />
                                    ) : (
                                        <span style={styles.fieldValueText}>
                                            {formData.sleep_start_time || '--:-- --'}
                                        </span>
                                    )}
                                    {!editingFields.sleep_start_time && (
                                        <div onClick={() => startEditing(field)}>
                                            <Pencil width='15px' height='15px' />
                                        </div>
                                    )}
                                </div>

                                <div style={{ ...styles.fieldValueRow, ...(editingFields.sleep_end_time) }}>
                                    {editingFields.sleep_end_time ? (
                                        <input
                                            type="text"
                                            value={tempValues.sleep_end_time}
                                            onChange={(e) => handleTempChange('sleep_end_time', e.target.value)}
                                            onKeyPress={(e) => handleKeyPress(e, 'sleep_end_time')}
                                            style={styles.timeInputFull}
                                            autoFocus
                                            onBlur={() => saveField('sleep_end_time', true)}
                                        />
                                    ) : (
                                        <span style={styles.fieldValueText}>
                                            {formData.sleep_end_time || '--:-- --'}
                                        </span>
                                    )}
                                    {!editingFields.sleep_end_time && (
                                        <div onClick={() => startEditing(field)}>
                                            <Pencil width='15px' height='15px' />
                                        </div>
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
                                            inputMode="numeric"
                                            value={tempValues[field] ?? ''}
                                            onChange={(e) => handleTempChange(field, e.target.value)}
                                            onKeyPress={(e) => handleKeyPress(e, field)}
                                            style={styles.durationInput}
                                            autoFocus
                                            onBlur={() => saveField(field, true)}
                                        />
                                    ) : (
                                        <span style={styles.stageValue}>{formatTime(formData[field])}</span>
                                    )}
                                    {!editingFields[field] && (
                                        <div onClick={() => startEditing(field)}>
                                            <Pencil width='15px' height='15px' />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <NotesSection
                    value={formData.notes}
                    onChange={handleNotesChange}
                    saveStatus={saveStatus}
                    saveField={saveField}
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