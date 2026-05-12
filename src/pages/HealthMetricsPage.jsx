import React, { useState, useRef } from 'react';
import PageHeader from '../components/PageHeader';
import DateNavigator from '../components/DateNavigator';
import NotesSection from '../components/NotesSection';
import { colors } from '../styles/theme';

function HealthMetricsPage({ onBack }) {
    // ========== LOGIC SECTION ==========
    const [currentDate, setCurrentDate] = useState(new Date());
    const [saveStatus, setSaveStatus] = useState('idle');
    const saveTimeoutRef = useRef(null);

    const [formData, setFormData] = useState({
        body_weight: '72.5',
        resting_heart_rate: '62',
        heart_rate_variability: '45',
        breathing_rate: '14',
        blood_pressure_systolic: '120',
        blood_pressure_diastolic: '80',
        blood_oxygen: '98',
        body_fat_percentage: '18.5',
        oxygen_saturation: '98',
        skin_temperature_variation: '0.2',
        notes: '',
    });

    const handleFieldChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

        setSaveStatus('saving');
        saveTimeoutRef.current = setTimeout(() => {
            setSaveStatus('idle');
        }, 2000);
    };

    // Reusable Metric Component
    const MetricInput = ({ label, value, unit, icon, target, field, placeholder }) => (
        <div style={styles.metricContainer}>
            <div style={styles.metricHeader}>
                <span style={styles.metricIcon}>{icon}</span>
                <span style={styles.metricLabel}>{label}</span>
            </div>
            <div style={styles.inputWrapper}>
                <input
                    type="text"
                    value={value}
                    placeholder={placeholder}
                    onChange={(e) => handleFieldChange(field, e.target.value)}
                    style={styles.customInput}
                />
                <span style={styles.unitText}>{unit}</span>
            </div>
            <div style={styles.targetText}>{target}</div>
        </div>
    );

    // ========== RETURN STATEMENT ==========
    return (
        <div style={styles.container}>
            <PageHeader onBack={onBack} />

            <div style={styles.content}>

                <DateNavigator
                    currentDate={currentDate}
                    onPrevious={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)))}
                    onNext={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)))}
                />

                <div style={styles.mainCard}>
                    <div style={styles.grid}>
                        <MetricInput
                            label="Body Weight" field="body_weight"
                            value={formData.body_weight} unit="KG"
                        />
                        <MetricInput
                            label="Resting Heart Rate" field="resting_heart_rate"
                            value={formData.resting_heart_rate} unit="BPM"
                        />
                        <MetricInput
                            label="Blood Pressure" field="resting_heart_rate"
                            value={formData.resting_heart_rate} unit="mmHg"
                        />

                        <MetricInput
                            label="Body Fat" field="body_fat_percentage"
                            value={formData.body_fat_percentage} unit="%"
                        />
                        <MetricInput
                            label="Breathing Rate" field="breathing_rate"
                            value={formData.breathing_rate} unit="BR/M"
                        />
                        <MetricInput
                            label="Heart Rate Variability" field="heart_rate_variability"
                            value={formData.heart_rate_variability} unit="MS"
                        />
                        <MetricInput
                            label="Blood Oxygen" field="blood_oxygen"
                            value={formData.blood_oxygen} unit="%"
                        />
                        <MetricInput
                            label="Skin Temp Var" field="skin_temperature_variation"
                            value={formData.skin_temperature_variation} unit="°C"
                        />
                        <MetricInput
                            label="Oxygen Saturation" field="oxygen_saturation"
                            value={formData.oxygen_saturation} unit="%"
                        />
                    </div>
                </div>
                <NotesSection
                        label="Health & Wellness Notes"
                        value={formData.notes}
                        onChange={(val) => handleFieldChange('notes', val)}
                        saveStatus={saveStatus}
                    />
            </div>
        </div>
    );
}

const styles = {
    container: { height: '100vh', width: '100vw', boxSizing: 'border-box' },
    content: {
        width: '50%',
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
    mainCard: {
        backgroundColor: colors.card, 
        borderRadius: '24px', 
        padding: '32px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
    },
    grid: { 
        display: 'grid', 
        gridTemplateColumns: 'repeat(3, 1fr)', 
        gap: '24px',
        marginBottom: '32px' 
    },
    metricContainer: { display: 'flex', flexDirection: 'column' },
    metricHeader: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' },
    metricIcon: { fontSize: '14px' },
    metricLabel: { fontSize: '14px', fontWeight: 'bold', color: '#1E293B' },
    inputWrapper: {
        display: 'flex', alignItems: 'center', backgroundColor: '#F1F5F9',
        borderRadius: '12px', padding: '0 12px', height: '48px'
    },
    customInput: {
        flex: 1, background: 'transparent', border: 'none', outline: 'none',
        fontSize: '16px', color: '#64748B', fontWeight: '500', width: '100%'
    },
    unitText: { fontSize: '10px', fontWeight: 'bold', color: '#94A3B8' },
    targetText: { fontSize: '10px', color: '#94A3B8', marginTop: '6px', fontWeight: '500', textTransform: 'uppercase' },
    
    // BP Specific Styles
    bpInputRow: { display: 'flex', alignItems: 'center', gap: '4px' },
    bpWrapper: {
        backgroundColor: '#F1F5F9', borderRadius: '12px', flex: 1,
        height: '48px', display: 'flex', alignItems: 'center'
    },
    bpInput: {
        width: '100%', textAlign: 'center', background: 'transparent',
        border: 'none', outline: 'none', fontSize: '16px', color: '#64748B'
    },
    separator: { color: '#CBD5E1', fontWeight: 'bold' }
};

export default HealthMetricsPage;