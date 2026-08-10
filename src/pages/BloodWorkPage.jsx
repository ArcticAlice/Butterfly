import React, { useState, useEffect, useRef } from 'react';
import PageHeader from '../components/PageHeader';
import NotesSection from '../components/NotesSection';
import DateNavigator from '../components/DateNavigator';
import { colors, typography, spacing } from '../utils/theme';

function BloodWorkPage({ onBack }) {
    // ========== LOGIC SECTION ==========
    const [reportIndex, setReportIndex] = useState(1);
    const [saveStatus, setSaveStatus] = useState('idle');
    const saveTimeoutRef = useRef(null);

    // Initial data using the ranges from the picture as default values
    const [formData, setFormData] = useState({
        hemoglobin: '13.5 - 17.5',
        white_blood_cells: '4.5 - 11.0',
        platelets: '150 - 450',
        glucose_fasting: '70 - 99',
        total_cholesterol: '< 200',
        ldl_cholesterol: '< 100',
        hdl_cholesterol: '> 40',
        triglycerides: '< 150',
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

    // Helper for the lab input fields
    const LabInput = ({ label, value, field }) => (
        <div style={styles.inputContainer}>
            <label style={styles.inputLabel}>{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => handleFieldChange(field, e.target.value)}
                style={styles.customInput}
            />
        </div>
    );

    return (
        <div style={styles.container}>
            <PageHeader onBack={onBack} />

            <div style={styles.content}>
                {/* Unique Lab Report Navigator */}
                <div style={styles.navigator}>
                    <button
                        onClick={() => setReportIndex(Math.max(1, reportIndex - 1))}
                        style={styles.navArrow}
                    >
                        ‹
                    </button>
                    <div style={styles.navCenter}>
                        <div style={styles.navTitle}>Lab Report {reportIndex}</div>
                        <div style={styles.navDate}>October 24, 2023</div>
                    </div>
                    <button
                        onClick={() => setReportIndex(reportIndex + 1)}
                        style={styles.navArrow}
                    >
                        ›
                    </button>
                </div>

                <div style={styles.reportCard}>
                    {/* Card Header with Status Label */}
                    <div style={styles.cardHeader}>
                        <h2 style={styles.cardTitle}>Biometric Analysis</h2>
                        <div style={styles.statusPill}>STATUS: DRAFT</div>
                    </div>

                    <div style={styles.panelsGrid}>
                        {/* Hematology Section */}
                        <div style={styles.panelSection}>
                            <h3 style={styles.sectionHeader}>HEMATOLOGY & GLUCOSE</h3>
                            <LabInput label="Hemoglobin (g/dL)" value={formData.hemoglobin} field="hemoglobin" />
                            <LabInput label="White Blood Cells (x10³/µL)" value={formData.white_blood_cells} field="white_blood_cells" />
                            <LabInput label="Platelets (x10³/µL)" value={formData.platelets} field="platelets" />
                            <LabInput label="Glucose, Fasting (mg/dL)" value={formData.glucose_fasting} field="glucose_fasting" />
                        </div>

                        {/* Lipid Panel Section */}
                        <div style={styles.panelSection}>
                            <h3 style={styles.sectionHeader}>LIPID PANEL</h3>
                            <LabInput label="Total Cholesterol (mg/dL)" value={formData.total_cholesterol} field="total_cholesterol" />
                            <LabInput label="LDL Cholesterol (mg/dL)" value={formData.ldl_cholesterol} field="ldl_cholesterol" />
                            <LabInput label="HDL Cholesterol (mg/dL)" value={formData.hdl_cholesterol} field="hdl_cholesterol" />
                            <LabInput label="Triglycerides (mg/dL)" value={formData.triglycerides} field="triglycerides" />
                        </div>
                    </div>

                    <div style={styles.notesWrapper}>
                        <NotesSection
                            value={formData.notes}
                            onChange={(val) => handleFieldChange('notes', val)}
                            saveStatus={saveStatus}
                        />
                    </div>
                </div>
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

    // Navigator Styles
    navigator: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: spacing.xl, marginBottom: spacing.xl },
    navArrow: { background: 'none', border: 'none', fontSize: typography.h1.fontSize, color: colors.first, cursor: 'pointer', paddingBottom: spacing.xs },
    navCenter: { textAlign: 'center' },
    navTitle: { ...typography.h2, color: colors.first },
    navDate: { ...typography.caption, color: colors.fifth, marginTop: spacing.xs, textTransform: 'uppercase', letterSpacing: '0.5px' },

    // Card Styles
    reportCard: {
        backgroundColor: colors.card, border: `1px solid ${colors.border}`, borderRadius: spacing.lg, padding: spacing.xxl, position: 'relative'
    },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.xxl },
    cardTitle: { ...typography.h1, color: colors.first, margin: 0 },
    statusPill: {
        backgroundColor: colors.card, color: colors.second, border: `1px solid ${colors.fifth}`, ...typography.caption,
        fontWeight: 'bold', padding: `${spacing.xs} ${spacing.sm}`, borderRadius: spacing.sm, letterSpacing: '0.5px'
    },

    panelsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.xxl },
    sectionHeader: { ...typography.caption, fontWeight: 'bold', color: colors.second, marginBottom: spacing.lg, letterSpacing: '1px' },

    inputContainer: { marginBottom: spacing.md },
    inputLabel: { display: 'block', ...typography.caption, fontWeight: '600', color: colors.first, marginBottom: spacing.xs },
    customInput: {
        width: '100%', backgroundColor: colors.card, border: `1px solid ${colors.border}`, borderRadius: spacing.sm,
        padding: `${spacing.sm} ${spacing.md}`, ...typography.caption, color: colors.second, outline: 'none'
    },

    notesWrapper: { borderTop: `1px solid ${colors.border}`, marginTop: spacing.xl, paddingTop: spacing.sm }
};

export default BloodWorkPage;