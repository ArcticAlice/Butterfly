import React, { useState, useRef } from 'react';
import PageLayout from '../components/PageLayout';
import NotesSection from '../components/NotesSection';
import { colors, typography, spacing, borderRadius } from '../utils/theme';

function BloodWorkPage({ onBack }) {
    // ========== LOGIC SECTION ==========
    const [reportIndex, setReportIndex] = useState(1);
    const [saveStatus, setSaveStatus] = useState('idle');
    const saveTimeoutRef = useRef(null);

    // Initial data using standard reference ranges
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
        }, 1500);
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
        <PageLayout onBack={onBack} showCalendarIcon={false}>
            {/* Lab Report Navigator */}
            <div style={styles.navigator}>
                <button
                    onClick={() => setReportIndex(Math.max(1, reportIndex - 1))}
                    style={styles.navArrow}
                    title="Previous Report"
                >
                    ‹
                </button>
                <div style={styles.navCenter}>
                    <div style={styles.navTitle}>Lab Report #{reportIndex}</div>
                    <div style={styles.navDate}>October 24, 2023</div>
                </div>
                <button
                    onClick={() => setReportIndex(reportIndex + 1)}
                    style={styles.navArrow}
                    title="Next Report"
                >
                    ›
                </button>
            </div>

            <div style={styles.reportCard}>
                {/* Card Header with Status Label */}
                <div style={styles.cardHeader}>
                    <div>
                        <h2 style={styles.cardTitle}>Biometric Analysis</h2>
                        <span style={styles.cardSubtext}>Standard Blood Panel & Biomarkers</span>
                    </div>
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
            </div>

            <NotesSection
                value={formData.notes}
                onChange={(val) => handleFieldChange('notes', val)}
                saveStatus={saveStatus}
            />
        </PageLayout>
    );
}

const styles = {
    // Navigator Styles
    navigator: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.lg,
        margin: `0 0 ${spacing.sm} 0`,
        userSelect: 'none',
    },
    navArrow: {
        background: 'none',
        border: 'none',
        fontSize: '28px',
        color: colors.first,
        cursor: 'pointer',
        padding: '0 8px',
        lineHeight: 1,
        borderRadius: '4px',
        transition: 'opacity 0.15s ease',
    },
    navCenter: {
        textAlign: 'center',
        minWidth: '220px',
    },
    navTitle: {
        fontFamily: typography.fontFamily,
        fontSize: '20px',
        fontWeight: '600',
        color: colors.first,
    },
    navDate: {
        ...typography.labelCaps,
        fontSize: '11px',
        color: colors.second,
        marginTop: spacing.xs,
    },

    // Card Styles
    reportCard: {
        backgroundColor: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: borderRadius.md,
        padding: spacing.xl,
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.xl,
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottom: `1px solid ${colors.border}`,
        paddingBottom: spacing.md,
    },
    cardTitle: {
        ...typography.h1,
        color: colors.first,
        margin: 0,
    },
    cardSubtext: {
        ...typography.body,
        fontSize: '13px',
        color: colors.second,
    },
    statusPill: {
        backgroundColor: colors.background,
        color: colors.second,
        border: `1px solid ${colors.border}`,
        ...typography.labelCaps,
        fontSize: '11px',
        fontWeight: 'bold',
        padding: `${spacing.xs} ${spacing.sm}`,
        borderRadius: borderRadius.sm,
    },

    panelsGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: spacing.xl,
    },
    panelSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.md,
    },
    sectionHeader: {
        ...typography.labelCaps,
        color: colors.second,
        marginBottom: spacing.xs,
    },

    inputContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    inputLabel: {
        fontFamily: typography.fontFamily,
        fontSize: '13px',
        fontWeight: '500',
        color: colors.first,
    },
    customInput: {
        width: '100%',
        backgroundColor: colors.background,
        border: `1px solid ${colors.border}`,
        borderRadius: borderRadius.sm,
        padding: '9px 12px',
        fontFamily: typography.fontFamily,
        fontSize: '14px',
        color: colors.first,
        outline: 'none',
        boxSizing: 'border-box',
    },


};

export default BloodWorkPage;