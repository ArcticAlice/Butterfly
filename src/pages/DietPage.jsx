import React, { useState, useRef, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import DateNavigator from '../components/DateNavigator';
import NotesSection from '../components/NotesSection';
import Gauge from '../assets/Guage';
import Template from '../components/Template';
import { colors, typography, spacing } from '../utils/theme';
import { getFoodService } from "../utils/dataFunctions";

function DietPage({ onBack }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [saveStatus, setSaveStatus] = useState('idle');
    const [formData, setFormData] = useState({ food_info: {}, notes: '' });
    const [newFoodName, setNewFoodName] = useState('');
    const [loading, setLoading] = useState(true);
    const [foodService, setFoodService] = useState(null);

    const saveTimeoutRef = useRef(null);

    // Calculate total calories dynamically from the Object
    let totalFoodCal = 0;
    if (formData.food_info) {
        Object.values(formData.food_info).forEach((cals) => {
            totalFoodCal += Number(cals) || 0;
        });
    }

    const goalCal = 3000;
    const percentage = Math.min((totalFoodCal / goalCal) * 100, 100);
    const remaining = Math.max((goalCal - totalFoodCal), 0);

    useEffect(() => {
        let mounted = true;
        async function initialize() {
            try {
                setLoading(true)

                const service = await getFoodService();
                if (!mounted) return;

                setFoodService(service)

                const record = await foodService.getFoodRecord(currentDate);
                if (!mounted) return;

                if (record) {
                    setFormData({
                        food_info: record.food_info || {},
                        notes: record.notes || ''
                    });
                } else {
                    setFormData(foodService.getDefaultFoodRecord());
                }
            } catch (error) {
                console.error('Failed to load food record:', error);
                setFormData(foodService.getDefaultFoodRecord());
            } finally {
                setLoading(false);
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

    // Core Saving Mechanism
    const debouncedSave = (data, instant) => {
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

        setSaveStatus('saving');
        const time = instant ? 500 : 3500;

        saveTimeoutRef.current = setTimeout(async () => {
            if (!foodService) return;
            try {
                await foodService.saveFoodRecord(currentDate, data);
                setSaveStatus('saved');
                setTimeout(() => setSaveStatus('idle'), 1000);
            } catch (error) {
                console.error('Failed to save food record:', error);
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

    const handleAddFood = () => {
        const name = newFoodName.trim();
        if (!name) return;

        const updatedInfo = { ...formData.food_info };
        if (!(name in updatedInfo)) {
            updatedInfo[name] = 0;
        }

        const updatedData = { ...formData, food_info: updatedInfo };
        setFormData(updatedData);
        setNewFoodName('');
        debouncedSave(updatedData, true);
    };

    const handleAddFoodKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAddFood();
        }
    };

    const handleUpdateCalories = (foodName, newCalories) => {
        const updatedInfo = { ...formData.food_info };
        updatedInfo[foodName] = newCalories;

        const updatedData = { ...formData, food_info: updatedInfo };
        setFormData(updatedData);
        debouncedSave(updatedData, true);
    };

    const handleEditFoodName = (oldName, newName) => {
        const updatedInfo = { ...formData.food_info };

        // Save the old calories, delete the old key, and assign it to the new key
        const existingCalories = updatedInfo[oldName];
        delete updatedInfo[oldName];
        updatedInfo[newName] = existingCalories;

        const updatedData = { ...formData, food_info: updatedInfo };
        setFormData(updatedData);
        debouncedSave(updatedData, true);
    };

    const handleDeleteFood = (foodName) => {
        const updatedInfo = { ...formData.food_info };
        delete updatedInfo[foodName];

        const updatedData = { ...formData, food_info: updatedInfo };
        setFormData(updatedData);
        debouncedSave(updatedData, true);
    };

    const handleNotesChange = (value) => {
        const updatedData = { ...formData, notes: value };
        setFormData(updatedData);
        debouncedSave(updatedData, false);
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div style={styles.container}>
            <PageHeader onBack={onBack} />

            <div style={styles.content}>
                <DateNavigator
                    currentDate={currentDate}
                    onPrevious={() => setCurrentDate(prev => new Date(new Date(prev).setDate(prev.getDate() - 1)))}
                    onNext={() => setCurrentDate(prev => new Date(new Date(prev).setDate(prev.getDate() + 1)))}
                />

                <div style={styles.mainGrid}>
                    {/* Left Column: Calorie Goal & Macros */}
                    <div style={styles.leftCol}>
                        <div style={styles.summaryCard}>

                            <h3 style={styles.cardHeader}>Calorie Goal</h3>

                            <div style={styles.gaugeWrapper}>
                                <Gauge percentage={percentage} goalText={goalCal.toString()} />

                                <p style={styles.gaugeText}>
                                    {`${totalFoodCal} \n Calories`}
                                </p>
                            </div>

                            <div style={styles.goalFooter}>
                                <div style={styles.footerItem}>
                                    <p style={styles.footerLabel}>DAILY TARGET</p>
                                    <p style={styles.footerValue}>{goalCal} kcal</p>
                                </div>
                                <div style={styles.footerDivider} />
                                <div style={styles.footerItem}>
                                    <p style={styles.footerLabel}>REMAINING</p>
                                    <p style={{ ...styles.footerValue, color: colors.third }}>
                                        {remaining} kcal
                                    </p>
                                </div>
                            </div>

                        </div>

                        <div style={styles.macroRow}>
                            <div style={{ ...styles.macroCard, borderTop: `3px solid ${colors.first}` }}>
                                <span style={styles.macroLabel}>PROTEIN</span>
                                <span style={styles.macroValue}>?</span>
                            </div>
                            <div style={{ ...styles.macroCard, borderTop: `3px solid ${colors.second}` }}>
                                <span style={styles.macroLabel}>CARBS</span>
                                <span style={styles.macroValue}>?</span>
                            </div>
                            <div style={{ ...styles.macroCard, borderTop: `3px solid ${colors.third}` }}>
                                <span style={styles.macroLabel}>FAT</span>
                                <span style={styles.macroValue}>?</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Daily Intake */}
                    <div style={styles.intakeCard}>
                        <div style={styles.intakeHeader}>
                            <h3 style={styles.cardHeader}>Daily Intake</h3>
                            <span style={styles.itemCount}>{Object.keys(formData.food_info).length} Items Logged</span>
                        </div>

                        <div style={styles.foodList}>
                            {Object.entries(formData.food_info).map(([foodName, calories]) => (
                                <Template
                                    key={foodName}
                                    foodName={foodName}
                                    initialCalories={calories}
                                    onUpdateCalories={handleUpdateCalories}
                                    onEditName={handleEditFoodName}
                                    onDelete={() => handleDeleteFood(foodName)}
                                />
                            ))}
                        </div>

                        <div style={styles.addArea}>
                            <input
                                style={styles.addInput}
                                placeholder="Type food item..."
                                value={newFoodName}
                                onChange={(e) => setNewFoodName(e.target.value)}
                                onKeyDown={handleAddFoodKeyPress}
                            />
                            <button style={styles.addBtn} onClick={handleAddFood}>Add</button>
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
        height: '100%',
        width: '100%',
        boxSizing: 'border-box',
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
        gridTemplateColumns: '1fr 1.5fr',
        gap: spacing.xl,
        width: '100%',
        minHeight: "0",
    },
    // Left Column
    leftCol: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        minHeight: "0",
        justifyContent: "center",
    },
    summaryCard: {
        backgroundColor: colors.card,
        borderRadius: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        padding: '32px',
        minHeight: "0",
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
        color: colors.first,
    },
    cardHeader: { fontSize: '16px', fontWeight: 'bold', color: colors.first, margin: 0, textAlign: 'left' },

    goalFooter: { display: 'flex', padding: '16px', marginTop: '16px', width: "80%", flexDirection: "row", },
    footerItem: { flex: 2, display: 'flex', flexDirection: 'column', gap: '4px', justifyContent: "center", alignItems: "center" },
    footerDivider: { flex: .03, backgroundColor: '#E2E8F0', margin: '0 16px' },
    footerLabel: { fontSize: '9px', fontWeight: 'bold', color: colors.first },
    footerValue: { fontSize: '16px', fontWeight: 'bold', color: colors.fifth },

    macroRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' },
    macroCard: { backgroundColor: colors.card, padding: '16px', borderRadius: '12px', textAlign: 'center', },
    macroLabel: { fontSize: '9px', fontWeight: 'bold', color: colors.first, display: 'block', marginBottom: '8px' },
    macroValue: { fontSize: '16px', fontWeight: 'bold', color: colors.fifth },

    // Right Column
    intakeCard: {
        backgroundColor: colors.card,
        borderRadius: '24px',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        minHeight: "0",
    },
    intakeHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' },
    itemCount: { fontSize: '12px', color: colors.fifth, },

    foodList: {
        flex: "1",
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        overflowY: "auto",
        minHeight: "0",
    },
    foodItem: { display: 'flex', alignItems: 'center', gap: '16px' },
    foodIconBox: { width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' },
    foodInfo: { flex: 1 },
    foodName: { fontSize: '14px', fontWeight: 'bold', color: colors.first },
    foodSub: { fontSize: '11px', color: colors.first },
    foodAction: { display: 'flex', alignItems: 'center', gap: '12px' },
    foodCal: { fontSize: '14px', color: colors.first },
    editIcon: { fontSize: '12px', opacity: 0.3, cursor: 'pointer' },

    addArea: { display: 'flex', gap: '12px', borderTop: '1px solid #F1F5F9', paddingTop: '24px' },
    addInput: { flex: 1, border: `1px solid #F1F5F9`, borderRadius: '10px', padding: '12px 16px', fontSize: '14px', outline: 'none' },
    addBtn: { backgroundColor: colors.second, color: colors.card, border: 'none', borderRadius: '10px', padding: '0 24px', fontWeight: '600', cursor: 'pointer' }
};

export default DietPage;