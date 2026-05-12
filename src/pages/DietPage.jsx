import React, { useState, useEffect, useRef } from 'react';
import PageHeader from '../components/PageHeader';
import DateNavigator from '../components/DateNavigator';
import NotesSection from '../components/NotesSection';
import Gauge from '../assets/Guage';
import { colors, typography, spacing } from '../styles/theme';

function DietPage({ onBack }) {
    // ========== LOGIC SECTION ==========
    const [currentDate, setCurrentDate] = useState(new Date());
    const [saveStatus, setSaveStatus] = useState('idle');
    const saveTimeoutRef = useRef(null);

    const [calorieGoal, setCalorieGoal] = useState(1850);
    const [newFoodName, setNewFoodName] = useState('');
    const [foodItems, setFoodItems] = useState([
        { id: 1, name: 'Avocado Toast with Poached Egg', meal: 'Breakfast', time: '08:30 AM', cal: 340, icon: '🥑' },
        { id: 2, name: 'Grilled Salmon & Quinoa', meal: 'Lunch', time: '12:45 PM', cal: 520, icon: '🍴' },
        { id: 3, name: 'Green Detox Smoothie', meal: 'Snack', time: '03:15 PM', cal: 180, icon: '🍹' }
    ]);

    const handleFieldChange = (field, value) => {
        setSaveStatus('saving');
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveTimeoutRef.current = setTimeout(() => setSaveStatus('idle'), 2000);
    };

    const totals = foodItems.reduce((acc, item) => acc + item.cal, 0);
    const remaining = calorieGoal - totals;
    const progress = Math.min((totals / calorieGoal) * 100, 100);

    const handleAddFood = () => {
        if (!newFoodName.trim()) return;
        const newItem = {
            id: Date.now(),
            name: newFoodName,
            meal: 'Log',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            cal: 0,
            icon: '🥗'
        };
        setFoodItems([...foodItems, newItem]);
        setNewFoodName('');
        handleFieldChange();
    };

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

                <div style={styles.mainGrid}>
                    {/* Left Column: Calorie Goal & Macros */}
                    <div style={styles.leftCol}>
                        <div style={styles.goalCard}>
                            <h3 style={styles.cardHeader}>Calorie Goal</h3>
                            <div style={styles.gaugeContainer}>
                                <Gauge
                                    percentage={23}
                                    totalSleepMins={1500}
                                    goalText="3000"
                                    valueStyle={styles.gaugeValue}
                                    goalStyle={styles.gaugeGoal}
                                />
                            </div>
                            <div style={styles.goalFooter}>
                                <div style={styles.footerItem}>
                                    <span style={styles.footerLabel}>DAILY TARGET</span>
                                    <span style={styles.footerValue}>{calorieGoal} <small>kcal</small></span>
                                </div>
                                <div style={styles.footerDivider} />
                                <div style={styles.footerItem}>
                                    <span style={styles.footerLabel}>REMAINING</span>
                                    <span style={{ ...styles.footerValue, color: colors.secondary }}>{remaining} <small>kcal</small></span>
                                </div>
                            </div>
                        </div>

                        <div style={styles.macroRow}>
                            <div style={{ ...styles.macroCard, borderTop: `3px solid ${colors.secondary}` }}>
                                <span style={styles.macroLabel}>PROTEIN</span>
                                <span style={styles.macroValue}>64g</span>
                            </div>
                            <div style={{ ...styles.macroCard, borderTop: `3px solid ${colors.accent}` }}>
                                <span style={styles.macroLabel}>CARBS</span>
                                <span style={styles.macroValue}>128g</span>
                            </div>
                            <div style={{ ...styles.macroCard, borderTop: `3px solid ${colors.error}` }}>
                                <span style={styles.macroLabel}>FAT</span>
                                <span style={styles.macroValue}>42g</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Daily Intake */}
                    <div style={styles.intakeCard}>
                        <div style={styles.intakeHeader}>
                            <h3 style={styles.cardHeader}>Daily Intake</h3>
                            <span style={styles.itemCount}>{foodItems.length} Items Logged</span>
                        </div>

                        <div style={styles.foodList}>
                            {foodItems.map(item => (
                                <div key={item.id} style={styles.foodItem}>
                                    <div style={styles.foodIconBox}>{item.icon}</div>
                                    <div style={styles.foodInfo}>
                                        <div style={styles.foodName}>{item.name}</div>
                                        <div style={styles.foodSub}>{item.meal} • {item.time}</div>
                                    </div>
                                    <div style={styles.foodAction}>
                                        <span style={styles.foodCal}><b>{item.cal}</b> <small>KCAL</small></span>
                                        <span style={styles.editIcon}>✏️</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={styles.addArea}>
                            <input
                                style={styles.addInput}
                                placeholder="Search or type food item..."
                                value={newFoodName}
                                onChange={(e) => setNewFoodName(e.target.value)}
                            />
                            <button style={styles.addBtn} onClick={handleAddFood}>Add</button>
                        </div>
                    </div>
                </div>

                <NotesSection
                    label="Notes"
                    placeholder="Enter Notes?"
                    saveStatus={saveStatus}
                />
            </div>
        </div>
    );
}

const styles = {
    container: { height: '100vh', width: '100vw', boxSizing: 'border-box' },
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
    mainGrid: { display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: spacing.xl, width: '100%', },

    // Left Column
    leftCol: { display: 'flex', flexDirection: 'column', gap: '24px' },
    goalCard: { backgroundColor: colors.card, borderRadius: '24px', padding: '32px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' },
    cardHeader: { fontSize: '16px', fontWeight: 'bold', color: '#1E293B', margin: 0, textAlign: 'left' },
    gaugeArea: { padding: '20px 0' },
    gaugeValue: { fontSize: '10px', fontWeight: 'bold', fill: '#1E293B' },
    gaugeLabel: { fontSize: '4px', fill: '#94A3B8', fontWeight: 'bold' },

    goalFooter: { display: 'flex', backgroundColor: '#F8FAFC', borderRadius: '12px', padding: '16px', marginTop: '16px' },
    footerItem: { flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' },
    footerDivider: { width: '1px', backgroundColor: '#E2E8F0', margin: '0 16px' },
    footerLabel: { fontSize: '9px', fontWeight: 'bold', color: '#94A3B8' },
    footerValue: { fontSize: '16px', fontWeight: 'bold', color: '#1E293B' },

    macroRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
    macroCard: { backgroundColor: colors.card, padding: '16px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.01)' },
    macroLabel: { fontSize: '9px', fontWeight: 'bold', color: '#94A3B8', display: 'block', marginBottom: '8px' },
    macroValue: { fontSize: '16px', fontWeight: 'bold', color: '#1E293B' },

    // Right Column
    intakeCard: { backgroundColor: colors.card, borderRadius: '24px', padding: '32px', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' },
    intakeHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
    itemCount: { fontSize: '12px', color: '#94A3B8', fontWeight: '500' },

    foodList: { flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' },
    foodItem: { display: 'flex', alignItems: 'center', gap: '16px' },
    foodIconBox: { width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' },
    foodInfo: { flex: 1 },
    foodName: { fontSize: '14px', fontWeight: 'bold', color: '#1E293B' },
    foodSub: { fontSize: '11px', color: '#94A3B8' },
    foodAction: { display: 'flex', alignItems: 'center', gap: '12px' },
    foodCal: { fontSize: '14px', color: '#1E293B' },
    editIcon: { fontSize: '12px', opacity: 0.3, cursor: 'pointer' },

    addArea: { display: 'flex', gap: '12px', borderTop: '1px solid #F1F5F9', paddingTop: '24px' },
    addInput: { flex: 1, border: '1px solid #F1F5F9', borderRadius: '10px', padding: '12px 16px', fontSize: '14px', outline: 'none' },
    addBtn: { backgroundColor: colors.primary, color: colors.card, border: 'none', borderRadius: '10px', padding: '0 24px', fontWeight: '600', cursor: 'pointer' }
};

export default DietPage;