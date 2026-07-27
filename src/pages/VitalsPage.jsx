import React, { useState, useRef, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import DateNavigator from '../components/DateNavigator';
import NotesSection from '../components/NotesSection';
import { colors, typography, spacing } from '../utils/theme';
import { getService } from '../utils/dataFunctions';

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
    )
};

function VitalsPage({ onBack, currentDate, setCurrentDate, service }) {
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({});
    const saveTimeoutRef = useRef(null);
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
            console.log("information saved");
        } catch (error) {
            console.error('Failed to save vitals record:', error);
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

    const handleTempChange = (e, field) => {
        const value = e.target.value;
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // ========== RETURN STATEMENT ==========
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
                    <div style={styles.summaryCard}>
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
                    <div style={styles.summaryCard}>
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
                            unit="MS"
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
        gridTemplateRows: '5% 58% 28%',
        gap: '2%',
        boxSizing: 'border-box',
        paddingTop: '2%',
    },
    mainGrid: {
        display: 'grid',
        gridTemplateColumns: 'auto auto',
        gap: spacing.xl,
        width: '100%',
    },
    summaryCard: {
        backgroundColor: colors.card,
        borderRadius: '24px',
        padding: spacing.xl,
        display: 'grid',
        gridTemplateColumns: 'repeat(2, auto)',
        gridTemplateRows: 'repeat(3, auto)',
        boxSizing: 'border-box',
        columnGap: '20px'
    },
    metricContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    metricLabel: {
        fontSize: '14px',
        color: colors.first,
        marginBottom: '5px',
        marginLeft: '5px'
    },
    inputWrapper: {
        display: 'flex',
        alignItems: 'center',
        border: `1px solid ${colors.second}`,
        borderRadius: '12px',
        padding: '0 12px',
        height: '48px'
    },
    customInput: {
        flex: 1,
        background: 'transparent',
        border: 'none', outline: 'none',
        fontSize: '16px',
        color: colors.first,
        fontWeight: '500',
        width: '100%'
    },
    unitText: {
        fontSize: '10px', fontWeight: 'bold', color: colors.first
    },
};

export default VitalsPage;