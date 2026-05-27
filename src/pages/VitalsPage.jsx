import React, { useState, useRef, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import DateNavigator from '../components/DateNavigator';
import NotesSection from '../components/NotesSection';
import { colors, typography, spacing } from '../utils/theme';
import { getVitalsService } from '../utils/dataFunctions';

function MetricInput({ label, value, unit, target, field, changeFunction, saveField }) {
    return (
        <div style={styles.metricContainer}>
            <p style={styles.metricLabel}>{label}</p>
            <div style={styles.inputWrapper}>
                <input
                    type="text"
                    value={value}
                    onChange={(e) => changeFunction(field, e.target.value)}
                    style={styles.customInput}
                    onBlur={() => saveField(field, true)}
                />
                <span style={styles.unitText}>{unit}</span>
            </div>
            <div style={styles.targetText}>{target}</div>
        </div>
    )
};

function VitalsPage({ onBack, currentDate, setCurrentDate }) {
    const [saveStatus, setSaveStatus] = useState('idle');
    const [loading, setLoading] = useState(true);
    const [vitalsService, setVitalsService] = useState(null);

    const saveTimeoutRef = useRef(null);

    const [formData, setFormData] = useState({
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

    useEffect(() => {
        let mounted = true;

        async function initialize() {
            try {
                setLoading(true);

                const service = await getVitalsService();
                if (!mounted) return;

                setVitalsService(service);

                const record = await service.getVitalsRecord(currentDate);
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
                    setFormData(service.getDefaultVitalsRecord());
                }
            } catch (error) {
                console.error('Failed to load vitals record:', error);
                if (vitalsService) {
                    setFormData(vitalsService.getDefaultVitalsRecord());
                }
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
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, []);

    const debouncedSave = (data, instant) => {
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

        setSaveStatus('saving');
        const time = instant ? 500 : 3500;

        saveTimeoutRef.current = setTimeout(async () => {
            if (!vitalsService) return;

            try {
                await vitalsService.saveVitalsRecord(currentDate, data);

                setSaveStatus('saved');
                setTimeout(() => setSaveStatus('idle'), 1000);
            } catch (error) {
                console.error('Failed to save vitals record:', error);

                setSaveStatus('error');
                setTimeout(() => setSaveStatus('idle'), 1000);
            }
        }, time);
    };

    const saveField = (field, instant = false, directValue = null) => {
        const rawValue = directValue !== null ? directValue : formData[field];

        const updatedData = {
            ...formData,
            [field]: rawValue
        };

        setFormData(updatedData);
        debouncedSave(updatedData, instant);
    };

    const handleFieldChange = (field, value) => {
        const updatedData = {
            ...formData,
            [field]: value
        };

        setFormData(updatedData);
        debouncedSave(updatedData, true);
    };

    const handleNotesChange = (value) => {
        const updatedData = {
            ...formData,
            notes: value
        };

        setFormData(updatedData);
        debouncedSave(updatedData, false);
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
                            label="Blood Oxygen" 
                            field="blood_oxygen"
                            value={formData.blood_oxygen} 
                            unit="SpO2" 
                            changeFunction={handleFieldChange}
                            saveField={saveField}
                        />
                        <MetricInput
                            label="Resting Heart Rate" 
                            field="resting_heart_rate"
                            value={formData.resting_heart_rate} 
                            unit="bpm" 
                            changeFunction={handleFieldChange}
                            saveField={saveField}
                        />
                        <MetricInput
                            label="Heart Rate Low" 
                            field="heart_rate_low"
                            value={formData.heart_rate_low} 
                            unit="bpm" 
                            changeFunction={handleFieldChange}
                            saveField={saveField}
                        />
                        <MetricInput
                            label="Heart Rate High" 
                            field="heart_rate_high"
                            value={formData.heart_rate_high} 
                            unit="bpm" 
                            changeFunction={handleFieldChange}
                            saveField={saveField}
                        />
                        <MetricInput
                            label="Heart Rate Variability" 
                            field="heart_rate_variability"
                            value={formData.heart_rate_variability} 
                            unit="ms" 
                            changeFunction={handleFieldChange}
                            saveField={saveField}
                        />
                        <MetricInput
                            label="Breathing Rate" 
                            field="breathing_rate"
                            value={formData.breathing_rate} 
                            unit="BR/M"
                            changeFunction={handleFieldChange}
                            saveField={saveField}
                        />

                    </div>
                    <div style={styles.summaryCard}>
                        <MetricInput
                            label="Blood Pressure"
                            field="blood_pressure"
                            value={formData.blood_pressure}
                            unit="mmHg"
                            changeFunction={handleFieldChange}
                            saveField={saveField}
                        />
                        <MetricInput
                            label="Body Fat Percentage" 
                            field="body_fate_percentage"
                            value={formData.body_fat_percentage} 
                            unit="MS"
                            changeFunction={handleFieldChange}
                            saveField={saveField}
                        />
                        <MetricInput
                            label="Body Weight" 
                            field="body_weight"
                            value={formData.body_weight} 
                            unit="%"
                            changeFunction={handleFieldChange}
                            saveField={saveField}
                        />
                        <MetricInput
                            label="Oxygen Saturation" 
                            field="oxygen_saturation"
                            value={formData.oxygen_saturation} 
                            unit="%"
                            changeFunction={handleFieldChange}
                            saveField={saveField}
                        />
                        <MetricInput
                            label="Skin Temp Var" 
                            field="skin_temperature_variation"
                            value={formData.skin_temperature_variation} 
                            unit="°C"
                            changeFunction={handleFieldChange}
                            saveField={saveField}
                        />
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
    targetText: {
        fontSize: '10px', color: colors.first, marginTop: '6px', fontWeight: '500', textTransform: 'uppercase'
    },
};

export default VitalsPage;