import React, { useState, useRef } from 'react';
import PageHeader from '../components/PageHeader';
import DateNavigator from '../components/DateNavigator';
import NotesSection from '../components/NotesSection';
import Gauge from '../assets/Guage';
import Pencil from '../assets/Pencil';
import { colors, typography, spacing } from '../utils/theme';

function WorkoutPage({ onBack }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [saveStatus, setSaveStatus] = useState('idle');
    const countRef = useRef(true);

    const [formData, setFormData] = useState({
        main_activity_type: 'Running',
        cardio_load: 142,
        max_heart_rate: 178,
        running_distance: 8.42,
        running_pace: '5:12',
        daily_steps: 12480,
        step_goal: 15000,
        stretching_duration: 15,
        mobility_routine_name: 'Lower Body Routine',
        notes: '',
    });

    const [editingFields, setEditingFields] = useState({});
    const [tempValues, setTempValues] = useState({});

    const stepPercentage = Math.min((formData.daily_steps / formData.step_goal) * 100, 100);

    const startEditing = (field) => {
        countRef.current = false;
        setTempValues(prev => ({ ...prev, [field]: formData[field] }));
        setEditingFields(prev => ({ ...prev, [field]: true }));
    };

    const saveField = (field) => {
        countRef.current = true;
        setFormData(prev => ({ ...prev, [field]: tempValues[field] }));
        setEditingFields(prev => ({ ...prev, [field]: false }));
        setSaveStatus('saving');
        setTimeout(() => setSaveStatus('idle'), 1000);
    };

    const handleTempChange = (field, value) => {
        const numericFields = ['cardio_load', 'max_heart_rate', 'running_distance', 'daily_steps', 'step_goal', 'stretching_duration'];
        const processedValue = numericFields.includes(field) ? (parseFloat(value) || 0) : value;
        setTempValues(prev => ({ ...prev, [field]: processedValue }));
    };

    const handleKeyPress = (e, field) => {
        if (e.key === 'Enter') {
            saveField(field);
        }
    };

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
                    move={countRef.current}
                />

                <div style={styles.mainGrid}>

                    {/* Left Column */}
                    <div style={styles.mainActivityCard}>
                        <div style={styles.cardHeader}>
                            <h2 style={styles.cardTitle}>Main Activity</h2>
                            <div style={{
                                ...styles.activityPill,
                                ...(editingFields.main_activity_type)
                            }}>
                                {editingFields.main_activity_type ? (
                                    <input
                                        type="text"
                                        value={tempValues.main_activity_type}
                                        onChange={(e) => handleTempChange('main_activity_type', e.target.value)}
                                        onKeyPress={(e) => handleKeyPress(e, 'main_activity_type')}
                                        style={styles.activityInput}
                                        autoFocus
                                        onBlur={() => saveField('main_activity_type')}
                                    />
                                ) : (
                                    <span>{formData.main_activity_type}</span>
                                )}
                                <div onClick={() => editingFields.main_activity_type ? saveField('main_activity_type') : startEditing('main_activity_type')}>
                                    <Pencil width='16px' height='16px' color={colors.primary} />
                                </div>
                            </div>
                        </div>

                        <div style={styles.metricRow}>
                            <div style={styles.metricBox}>
                                <div style={styles.metricLabel}>CARDIO LOAD</div>
                                <div style={styles.metricValueLine}>
                                    {editingFields.cardio_load ? (
                                        <input
                                            type="number"
                                            value={tempValues.cardio_load}
                                            onChange={(e) => handleTempChange('cardio_load', e.target.value)}
                                            onKeyPress={(e) => handleKeyPress(e, 'cardio_load')}
                                            style={styles.metricInput}
                                            autoFocus
                                            onBlur={() => saveField('cardio_load')}
                                        />
                                    ) : (
                                        <span style={styles.metricBigValue}>{formData.cardio_load}</span>
                                    )}
                                    <span style={styles.unitText}>TRIMP</span>
                                    <div onClick={() => editingFields.cardio_load ? saveField('cardio_load') : startEditing('cardio_load')}>
                                        <Pencil width='18px' height='18px' color={colors.secondary} />
                                    </div>
                                </div>
                            </div>
                            <div style={styles.metricBox}>
                                <div style={styles.metricLabel}>MAX HEART RATE</div>
                                <div style={styles.metricValueLine}>
                                    {editingFields.max_heart_rate ? (
                                        <input
                                            type="number"
                                            value={tempValues.max_heart_rate}
                                            onChange={(e) => handleTempChange('max_heart_rate', e.target.value)}
                                            onKeyPress={(e) => handleKeyPress(e, 'max_heart_rate')}
                                            style={styles.metricInput}
                                            autoFocus
                                            onBlur={() => saveField('max_heart_rate')}
                                        />
                                    ) : (
                                        <span style={styles.metricBigValue}>{formData.max_heart_rate}</span>
                                    )}
                                    <span style={styles.unitText}>BPM</span>
                                    <div onClick={() => editingFields.max_heart_rate ? saveField('max_heart_rate') : startEditing('max_heart_rate')}>
                                        <Pencil width='18px' height='18px' color={colors.secondary} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Running Specifics Section */}
                        {formData.main_activity_type === 'Running' && (
                            <div style={styles.specificsSection}>
                                <div style={styles.specificsTitle}>RUNNING SPECIFICS</div>
                                <div style={styles.metricRow}>
                                    <div style={styles.specificsBox}>
                                        <div style={styles.specificsLabel}>Distance</div>
                                        <div style={styles.specificsValueLine}>
                                            {editingFields.running_distance ? (
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={tempValues.running_distance}
                                                    onChange={(e) => handleTempChange('running_distance', e.target.value)}
                                                    onKeyPress={(e) => handleKeyPress(e, 'running_distance')}
                                                    style={styles.cleanInput}
                                                    autoFocus
                                                    onBlur={() => saveField('running_distance')}
                                                />
                                            ) : (
                                                <span style={styles.cleanInputValue}>{formData.running_distance}</span>
                                            )}
                                            <span style={styles.unitText}>KM</span>
                                            <div onClick={() => editingFields.running_distance ? saveField('running_distance') : startEditing('running_distance')}>
                                                <Pencil width='16px' height='16px' color={colors.accent} />
                                            </div>
                                        </div>
                                    </div>
                                    <div style={styles.specificsBox}>
                                        <div style={styles.specificsLabel}>Average Pace</div>
                                        <div style={styles.specificsValueLine}>
                                            {editingFields.running_pace ? (
                                                <input
                                                    type="text"
                                                    value={tempValues.running_pace}
                                                    onChange={(e) => handleTempChange('running_pace', e.target.value)}
                                                    onKeyPress={(e) => handleKeyPress(e, 'running_pace')}
                                                    style={styles.cleanInput}
                                                    autoFocus
                                                    onBlur={() => saveField('running_pace')}
                                                />
                                            ) : (
                                                <span style={styles.cleanInputValue}>{formData.running_pace}</span>
                                            )}
                                            <span style={styles.unitText}>/KM</span>
                                            <div onClick={() => editingFields.running_pace ? saveField('running_pace') : startEditing('running_pace')}>
                                                <Pencil width='16px' height='16px' color={colors.accent} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* End of Running Specifics Section */}
                    </div>

                    {/* Right Column */}
                    <div style={styles.sidebar}>
                        
                        {/* Daily Steps Card */}
                        <div style={styles.sidebarCard}>
                            <div style={styles.sidebarCardLayout}>
                                <div style={styles.sidebarTextCol}>
                                    <div style={styles.sidebarLabel}>DAILY STEPS</div>
                                    <div style={styles.sidebarValueRow}>
                                        {editingFields.daily_steps ? (
                                            <input
                                                type="number"
                                                value={tempValues.daily_steps}
                                                onChange={(e) => handleTempChange('daily_steps', e.target.value)}
                                                onKeyPress={(e) => handleKeyPress(e, 'daily_steps')}
                                                style={styles.sidebarInput}
                                                autoFocus
                                                onBlur={() => saveField('daily_steps')}
                                            />
                                        ) : (
                                            <span style={styles.sidebarBigValue}>{formData.daily_steps}</span>
                                        )}
                                        <span style={styles.sidebarGoal}>/ {formData.step_goal / 1000}k</span>
                                        <div onClick={() => editingFields.daily_steps ? saveField('daily_steps') : startEditing('daily_steps')}>
                                            <Pencil width='16px' height='16px' color={colors.primary} />
                                        </div>
                                    </div>
                                </div>
                                <div style={styles.gaugeContainer}>
                                    <Gauge
                                        width={80}
                                        height={80}
                                        percentage={stepPercentage}
                                        totalValue={`${Math.round(stepPercentage)}%`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Stretching Card */}
                        <div style={styles.sidebarCard}>
                            <div style={styles.sidebarCardLayout}>
                                <div style={styles.sidebarTextCol}>
                                    <div style={styles.sidebarLabel}>STRETCHING</div>
                                    <div style={styles.sidebarValueRow}>
                                        {editingFields.stretching_duration ? (
                                            <input
                                                type="number"
                                                value={tempValues.stretching_duration}
                                                onChange={(e) => handleTempChange('stretching_duration', e.target.value)}
                                                onKeyPress={(e) => handleKeyPress(e, 'stretching_duration')}
                                                style={styles.sidebarInput}
                                                autoFocus
                                                onBlur={() => saveField('stretching_duration')}
                                            />
                                        ) : (
                                            <span style={styles.sidebarBigValue}>{formData.stretching_duration}</span>
                                        )}
                                        <span style={styles.sidebarUnit}>Minutes</span>
                                        <div onClick={() => editingFields.stretching_duration ? saveField('stretching_duration') : startEditing('stretching_duration')}>
                                            <Pencil width='16px' height='16px' color={colors.secondary} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mobility Card */}
                        <div style={styles.sidebarCard}>
                            <div style={styles.sidebarCardLayout}>
                                <div style={{ ...styles.sidebarTextCol, flex: 1 }}>
                                    <div style={styles.sidebarLabel}>DAILY MOBILITY</div>
                                    <div style={styles.sidebarValueRow}>
                                        {editingFields.mobility_routine_name ? (
                                            <input
                                                type="text"
                                                value={tempValues.mobility_routine_name}
                                                onChange={(e) => handleTempChange('mobility_routine_name', e.target.value)}
                                                onKeyPress={(e) => handleKeyPress(e, 'mobility_routine_name')}
                                                style={styles.mobilityInput}
                                                autoFocus
                                                onBlur={() => saveField('mobility_routine_name')}
                                            />
                                        ) : (
                                            <span style={styles.sidebarMedValue}>{formData.mobility_routine_name}</span>
                                        )}
                                        <div onClick={() => editingFields.mobility_routine_name ? saveField('mobility_routine_name') : startEditing('mobility_routine_name')}>
                                            <Pencil width='16px' height='16px' color={colors.accent} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <NotesSection
                    label="Workout Notes & Reflections"
                    value={formData.notes}
                    onChange={(val) => setFormData(prev => ({ ...prev, notes: val }))}
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
        width: '58%',
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
        gridTemplateColumns: '1.5fr 1fr',
        gap: spacing.xl,
        width: '100%',
    },
    // Styles for left column
    mainActivityCard: {
        backgroundColor: colors.card,
        borderRadius: '24px',
        padding: '32px',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
    },
    cardTitle: {
        fontSize: '24px',
        fontWeight: 'bold',
        margin: 0,
        color: colors.textPrimary
    },
    activityPill: {
        backgroundColor: colors.surface,
        padding: '8px 16px',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '600',
        color: colors.primary,
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    activityInput: {
        background: 'transparent',
        border: 'none',
        outline: 'none',
        fontSize: '14px',
        fontWeight: '600',
        color: colors.primary,
        width: '100px'
    },
    metricRow: {
        display: 'flex',
        gap: '24px',
        marginBottom: '32px'
    },
    metricBox: {
        backgroundColor: colors.surface,
        borderRadius: '16px',
        padding: '20px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
                border: `1px solid ${colors.primary}`,
    },
    metricLabel: {
        fontSize: '10px',
        fontWeight: 'bold',
        color: colors.textSecondary,
        
    },
    metricValueLine: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    metricBigValue: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: colors.textPrimary,
        
    },
    metricInput: {
        background: 'transparent',
        border: 'none',
        outline: 'none',
        fontSize: '28px',
        fontWeight: 'bold',
        color: colors.textPrimary,
        width: '80px',
        
    },
    unitText: {
        fontSize: '12px',
        fontWeight: 'bold',
        color: colors.textSecondary,
        marginLeft: 'auto'
    },
    // Styles for running specifics
    specificsSection: {
        borderTop: `1px solid ${colors.surface}`,
        paddingTop: '24px',
        
    },
    specificsTitle: {
        fontSize: '10px',
        fontWeight: 'bold',
        color: colors.textSecondary,
        marginBottom: '16px'
    },
    specificsBox: {
        backgroundColor: colors.surface,
        borderRadius: '12px',
        padding: '16px',
        flex: 1,
        border: `1px solid ${colors.primary}`,
    },
    specificsLabel: {
        fontSize: '12px',
        fontWeight: '600',
        color: colors.textSecondary,
        marginBottom: '8px'
    },
    specificsValueLine: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    cleanInput: {
        background: 'transparent',
        border: 'none',
        outline: 'none',
        fontSize: '16px',
        fontWeight: 'bold',
        color: colors.textPrimary,
        width: '60px'
    },
    cleanInputValue: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: colors.textPrimary
    },
    // Styles for right column
    sidebar: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    sidebarCard: {
        backgroundColor: colors.card,
        borderRadius: '24px',
        padding: '24px',
    },
    sidebarCardLayout: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
    },
    sidebarTextCol: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    },
    sidebarLabel: {
        fontSize: '10px',
        fontWeight: 'bold',
        color: colors.textSecondary
    },
    sidebarValueRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    sidebarBigValue: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: colors.textPrimary
    },
    sidebarMedValue: {
        fontSize: '15px',
        fontWeight: 'bold',
        color: colors.textPrimary
    },
    sidebarGoal: {
        fontSize: '14px',
        color: colors.textSecondary,
        marginLeft: '0px'
    },
    sidebarUnit: {
        fontSize: '12px',
        color: colors.textSecondary,
        fontWeight: '500'
    },
    sidebarInput: {
        background: 'transparent',
        border: 'none',
        outline: 'none',
        fontSize: '24px',
        fontWeight: 'bold',
        color: colors.textPrimary,
        width: '80px'
    },
    mobilityInput: {
        background: 'transparent',
        border: 'none',
        outline: 'none',
        fontSize: '15px',
        fontWeight: 'bold',
        color: colors.textPrimary,
        width: '100%'
    },
    gaugeContainer: {
        marginLeft: 'auto'
    },
};

export default WorkoutPage;