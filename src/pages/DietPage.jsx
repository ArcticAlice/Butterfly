import React, { useState, useRef, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import DateNavigator from '../components/DateNavigator';
import NotesSection from '../components/NotesSection';
import Gauge from '../assets/Guage';
import Template from '../components/Template';
import { colors, typography, spacing } from '../utils/theme';
import { getService } from "../utils/dataFunctions";

function DietPage({ onBack, currentDate, setCurrentDate, service }) {
    const [formData, setFormData] = useState({});
    const [newFoodName, setNewFoodName] = useState('');
    const [loading, setLoading] = useState(true);
    const notesRef = useRef('');
    const serviceRef = useRef(null);
    const formDataRef = useRef({});
    const hasChanged = useRef(false);

    // Calculate total calories dynamically from the Object
    let totalFoodCal = 0;
    if (formData.food_list) {
        Object.values(formData.food_list).forEach((cals) => {
            totalFoodCal += Number(cals) || 0;
        });
    }

    const goalCal = 3000;
    const percentage = Math.min((totalFoodCal / goalCal) * 100, 100);
    const remaining = Math.max((goalCal - totalFoodCal), 0);

    useEffect(() => {
        let mounted = true;
        async function initialize() {
            if (!service) return;
            try {
                setLoading(true)

                const record = await service.getRecord(currentDate, "food_records_v2");
                if (!mounted) return;

                if (record) {
                    setFormData({
                        food_list: record.food_list || {},
                        notes: record.notes || ''
                    });
                } else {
                    setFormData({
                        food_list: {},
                        notes: ""
                    });
                }
            } catch (error) {
                console.error('Failed to load food record:', error);
                setFormData({
                    food_list: {},
                    notes: ""
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
                    ...formDataRef.current, // safe snapshot for non-notes fields
                    notes: notesRef.current
                };

                await serviceRef.current.saveRecord(currentDate, updatedData, "food_records_v2");
                hasChanged.current = false;
            } catch (error) {
                console.error('Failed to save food record:', error);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [currentDate, service, loading]);

    const saveField = async (data) => {
        try {
            await service.saveRecord(currentDate, data, "food_records_v2");
            console.log("information saved");
        } catch (error) {
            console.error('Failed to save food record:', error);
        }
    }

    const handleAddFood = async (food_name, calories) => {
        hasChanged.current = true;
        const name = food_name.trim();

        if (!name || (formData.food_list && name in formData.food_list)) return;

        const updatedFormData = {
            ...formData,
            food_list: {
                ...formData.food_list,
                [name]: calories
            }
        };

        setFormData(updatedFormData);

        if (service) {
            await saveField(updatedFormData);
        }
        setNewFoodName('');
    };

    const handleUpdateCalories = async (food_name, newCalories) => {
        hasChanged.current = true;
        const updatedFormData = {
            ...formData,
            food_list: {
                ...formData.food_list,
                [food_name]: newCalories
            }
        };

        setFormData(updatedFormData);

        if (service) {
            await saveField(updatedFormData);
        }
    };

    const handleEditFoodName = async (oldName, newName) => {
        hasChanged.current = true;
        const updatedFoodList = {
            ...formData.food_list
        };
        const calories = updatedFoodList[oldName];
        delete updatedFoodList[oldName];
        updatedFoodList[newName] = calories;

        const updatedFormData = {
            ...formData,
            food_list: updatedFoodList
        }

        setFormData(updatedFormData)

        if (service) {
            await saveField(updatedFormData)
        }
    };

    const handleDeleteFood = async (food_name) => {
        hasChanged.current = true;
        const updatedFoodList = {
            ...formData.food_list
        };
        const calories = updatedFoodList[food_name];
        delete updatedFoodList[food_name];

        const updatedFormData = {
            ...formData,
            food_list: updatedFoodList
        }

        setFormData(updatedFormData)

        if (service) {
            await saveField(updatedFormData)
        }
    };

    const handleAddFoodKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleAddFood(newFoodName, 0);
        }
    };

    const handleNotesChange = (value) => {
        notesRef.current = value;
        hasChanged.current = true;
        setFormData(prev => ({ ...prev, notes: value }));
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
                            <span style={styles.itemCount}>{Object.keys(formData.food_list || {}).length} Items Logged</span>
                        </div>

                        <div style={styles.foodList}>
                            {Object.entries(formData.food_list || {}).map(([food_name, calories]) => (
                                <Template
                                    key={food_name}
                                    foodName={food_name}
                                    initialCalories={calories}
                                    onUpdateCalories={handleUpdateCalories}
                                    onEditName={handleEditFoodName}
                                    onDelete={() => handleDeleteFood(food_name)}
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
                                disabled={loading}
                            />
                            <button 
                                style={styles.addBtn} 
                                onClick={() => handleAddFood(newFoodName, 0)}
                                disabled={loading}
                            >
                                Add
                            </button>
                        </div>
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