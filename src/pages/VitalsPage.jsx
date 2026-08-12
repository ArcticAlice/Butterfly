import React, { useState, useRef, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import DateNavigator from '../components/DateNavigator';
import NotesSection from '../components/NotesSection';
import { colors, typography, spacing, borderRadius } from '../utils/theme';

function MetricInput({ label, value, unit, field, changeFunction, saveField, keydown }) {
    return (
        <div style={styles.metricContainer}>
            <p style={styles.metricLabel}>{label}</p>
            <div style={styles.inputWrapper}>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => changeFunction(e, field)}
                    onKeyDown={(e) => keydown(e, field)}
                    onBlur={(e) => saveField(e, field)}
                    style={styles.customInput}
                />
                <span style={styles.unitText}>{unit}</span>
            </div>
        </div>
    );
}

function VitalsPage({ onBack, currentDate, setCurrentDate, service, onCalendarClick }) {
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({});
    const notesRef = useRef('');
    const serviceRef = useRef(null);
    const formDataRef = useRef({});
    const hasChanged = useRef(false);

    useEffect(() => {
        let mounted = true;

        async function initialize() {
            if (!service) return;
            try {
                setLoading(true);

                const record = await service.getRecord(currentDate, "vitals_records_v2");
                if (!mounted) return;

                if (record) {
                    setFormData({
                        blood_oxygen: record.blood_oxygen || '',
                        resting_heart_rate: record.resting_heart_rate || '',
                        heart_rate_low: record.heart_rate_low || '',
                        heart_rate_high: record.heart_rate_high || '',
                        heart_rate_variability: record.heart_rate_variability || '',
                        breathing_rate: record.breathing_rate || '',
                        blood_pressure: record.blood_pressure || '',
                        body_fat_percentage: record.body_fat_percentage || '',
                        body_weight: record.body_weight || '',
                        oxygen_saturation: record.oxygen_saturation || '',
                        skin_temperature_variation: record.skin_temperature_variation || '',
                        notes: record.notes || '',
                    });
                } else {
                    setFormData({
                        blood_oxygen: '',
                        resting_heart_rate: '',
                        heart_rate_low: '',
                        heart_rate_high: '',
                        heart_rate_variability: '',
                        breathing_rate: '',
                        blood_pressure: '',
                        body_fat_percentage: '',
                        body_weight: '',
                        oxygen_saturation: '',
                        skin_temperature_variation: '',
                        notes: '',
                    });
                }
            } catch (error) {
                console.error('Failed to load vitals record:', error);
                setFormData({
                    blood_oxygen: '',
                    resting_heart_rate: '',
                    heart_rate_low: '',
                    heart_rate_high: '',
                    heart_rate_variability: '',
                    breathing_rate: '',
                    blood_pressure: '',
                    body_fat_percentage: '',
                    body_weight: '',
                    oxygen_saturation: '',
                    skin_temperature_variation: '',
                    notes: '',
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

                await serviceRef.current.saveRecord(currentDate, updatedData, "vitals_records_v2");
                hasChanged.current = false;
            } catch (error) {
                console.error('Failed to save vitals record:', error);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [currentDate, service, loading]);

    const saveField = async (event, field) => {
        let latestValue = event.target.value;

        const updatedData = {
            ...formData,
            [field]: latestValue
        };

        setFormData(updatedData);

        if (!service) return;

        try {
            await service.saveRecord(currentDate, updatedData, "vitals_records_v2");
        } catch (error) {
            console.error('Failed to save vitals record:', error);
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

    const handleTempChange = (e, field) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, [field]: value }));
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

            <div style={styles.mainGrid}>
                {/* Column 1: Cardiac & Respiration */}
                <div style={styles.summaryCard}>
                    <h3 style={styles.cardHeader}>CARDIAC & RESPIRATORY</h3>
                    <div style={styles.metricsGroup}>
                        <MetricInput
                            label="Heart Rate Low"
                            field="heart_rate_low"
                            value={formData.heart_rate_low ?? ''}
                            unit="bpm"
                            changeFunction={handleTempChange}
                            keydown={handleKeyPress}
                            saveField={saveField}
                        />
                        <MetricInput
                            label="Heart Rate High"
                            field="heart_rate_high"
                            value={formData.heart_rate_high ?? ''}
                            unit="bpm"
                            changeFunction={handleTempChange}
                            keydown={handleKeyPress}
                            saveField={saveField}
                        />
                        <MetricInput
                            label="Resting Heart Rate"
                            field="resting_heart_rate"
                            value={formData.resting_heart_rate ?? ''}
                            unit="bpm"
                            changeFunction={handleTempChange}
                            keydown={handleKeyPress}
                            saveField={saveField}
                        />
                        <MetricInput
                            label="Heart Rate Variability"
                            field="heart_rate_variability"
                            value={formData.heart_rate_variability ?? ''}
                            unit="ms"
                            changeFunction={handleTempChange}
                            keydown={handleKeyPress}
                            saveField={saveField}
                        />
                        <MetricInput
                            label="Blood Oxygen"
                            field="blood_oxygen"
                            value={formData.blood_oxygen ?? ''}
                            unit="SpO2"
                            changeFunction={handleTempChange}
                            keydown={handleKeyPress}
                            saveField={saveField}
                        />
                        <MetricInput
                            label="Breathing Rate"
                            field="breathing_rate"
                            value={formData.breathing_rate ?? ''}
                            unit="bprm"
                            changeFunction={handleTempChange}
                            keydown={handleKeyPress}
                            saveField={saveField}
                        />
                    </div>
                </div>

                {/* Column 2: Body Composition & Circulation */}
                <div style={styles.summaryCard}>
                    <h3 style={styles.cardHeader}>BODY & CIRCULATION</h3>
                    <div style={styles.metricsGroup}>
                        <MetricInput
                            label="Skin Temp Var"
                            field="skin_temperature_variation"
                            value={formData.skin_temperature_variation ?? ''}
                            unit="°F"
                            changeFunction={handleTempChange}
                            keydown={handleKeyPress}
                            saveField={saveField}
                        />
                        <MetricInput
                            label="Body Weight"
                            field="body_weight"
                            value={formData.body_weight ?? ''}
                            unit="lb"
                            changeFunction={handleTempChange}
                            keydown={handleKeyPress}
                            saveField={saveField}
                        />
                        <MetricInput
                            label="Blood Pressure"
                            field="blood_pressure"
                            value={formData.blood_pressure ?? ''}
                            unit="mmHg"
                            changeFunction={handleTempChange}
                            keydown={handleKeyPress}
                            saveField={saveField}
                        />
                        <MetricInput
                            label="Body Fat Percentage"
                            field="body_fat_percentage"
                            value={formData.body_fat_percentage ?? ''}
                            unit="%"
                            changeFunction={handleTempChange}
                            keydown={handleKeyPress}
                            saveField={saveField}
                        />
                        <MetricInput
                            label="Oxygen Saturation"
                            field="oxygen_saturation"
                            value={formData.oxygen_saturation ?? ''}
                            unit="%"
                            changeFunction={handleTempChange}
                            keydown={handleKeyPress}
                            saveField={saveField}
                        />
                    </div>
                </div>
            </div>

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
        gridTemplateColumns: '1fr 1fr',
        gap: spacing.lg,
        width: '100%',
        height: "95%"
    },
    summaryCard: {
        backgroundColor: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: borderRadius.md,
        padding: '36px 28px',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        minHeight: '480px',
        justifyContent: 'space-between',
    },
    cardHeader: {
        ...typography.labelCaps,
        color: colors.second,
        margin: `0 0 24px 0`,
    },
    metricsGroup: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        columnGap: '20px',
        rowGap: '38px',
        flex: 1,
    },
    metricContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    metricLabel: {
        ...typography.caption,
        fontSize: '12px',
        color: colors.second,
        marginBottom: '6px',
    },
    inputWrapper: {
        display: 'flex',
        alignItems: 'center',
        border: `1px solid ${colors.border}`,
        borderRadius: borderRadius.sm,
        padding: `0 ${spacing.sm}`,
        height: '42px',
        backgroundColor: colors.background,
    },




    customInput: {
        flex: 1,
        background: 'transparent',
        border: 'none',
        outline: 'none',
        fontFamily: typography.fontFamily,
        fontSize: '14px',
        fontWeight: '500',
        color: colors.first,
        width: '100%'
    },
    unitText: {
        fontFamily: typography.monoFontFamily || 'monospace',
        fontSize: '11px',
        fontWeight: 'bold',
        color: colors.second
    },
};

export default VitalsPage;