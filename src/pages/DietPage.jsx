import React, { useState, useRef, useEffect } from 'react';
import PageLayout from '../components/PageLayout';
import DateNavigator from '../components/DateNavigator';
import NotesSection from '../components/NotesSection';
import Gauge from '../assets/Guage';
import FoodTemplate from '../components/FoodTemplate';
import { colors, typography, spacing, borderRadius } from '../utils/theme';
import { normalizeFoodName, capitalizeWords } from '../utils/helperFunctions';

function DietPage({ onBack, currentDate, setCurrentDate, service, onCalendarClick }) {
    const [formData, setFormData] = useState({});
    const [newFoodName, setNewFoodName] = useState('');
    const [loading, setLoading] = useState(true);
    const [suggestions, setSuggestions] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [showDropdown, setShowDropdown] = useState(false);
    const notesRef = useRef('');
    const serviceRef = useRef(null);
    const formDataRef = useRef({});
    const hasChanged = useRef(false);
    const inputContainerRef = useRef(null);

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
                setLoading(true);

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
                    ...formDataRef.current,
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

    useEffect(() => {
        let mounted = true;
        const trimmed = newFoodName.trim();

        if (!service || trimmed.length < 3) {
            setSuggestions([]);
            setShowDropdown(false);
            setSelectedIndex(-1);
            return;
        }

        if (trimmed.length % 3 === 0) {
            service.getMatchingUniqueFoods(trimmed, 3)
                .then(matches => {
                    if (!mounted) return;
                    if (matches && matches.length > 0) {
                        setSuggestions(matches);
                        setSelectedIndex(0);
                        setShowDropdown(true);
                    } else {
                        setSuggestions([{ food_name: 'No known food', isFallback: true }]);
                        setSelectedIndex(0);
                        setShowDropdown(true);
                    }
                })
                .catch(err => {
                    console.error('Error fetching matching unique foods:', err);
                    if (!mounted) return;
                    setSuggestions([{ food_name: 'No known food', isFallback: true }]);
                    setSelectedIndex(0);
                    setShowDropdown(true);
                });
        }
        return () => {
            mounted = false;
        };
    }, [newFoodName, service]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (inputContainerRef.current && !inputContainerRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const saveField = async (data) => {
        try {
            await service.saveRecord(currentDate, data, "food_records_v2");
        } catch (error) {
            console.error('Failed to save food record:', error);
        }
    };

    const handleAddFood = async (food_name, calories) => {
        const name = capitalizeWords(food_name.trim());
        if (!name) return;

        const normName = normalizeFoodName(name);
        const existingList = formData.food_list || {};
        const isDuplicateToday = Object.keys(existingList).some(
            k => normalizeFoodName(k) === normName
        );
        if (isDuplicateToday) return;

        hasChanged.current = true;
        let caloriesToUse = Number(calories) || 0;

        if (service) {
            try {
                const uniqueFood = await service.getUniqueFood(name);
                if (uniqueFood) {
                    if (caloriesToUse === 0) {
                        caloriesToUse = uniqueFood.food_calories;
                    } else {
                        await service.saveUniqueFood(name, caloriesToUse);
                    }
                } else {
                    await service.saveUniqueFood(name, caloriesToUse);
                }
            } catch (err) {
                console.error('Failed to lookup/save unique food:', err);
            }
        }

        const updatedFormData = {
            ...formData,
            food_list: {
                ...existingList,
                [name]: caloriesToUse
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
        const cal = Number(newCalories) || 0;
        const updatedFormData = {
            ...formData,
            food_list: {
                ...formData.food_list,
                [food_name]: cal
            }
        };

        setFormData(updatedFormData);

        if (service) {
            await saveField(updatedFormData);
            await service.saveUniqueFood(food_name, cal);
        }
    };

    const handleEditFoodName = async (oldName, newName) => {
        const trimmedNew = capitalizeWords(newName.trim());
        if (!trimmedNew || trimmedNew === oldName) return;

        hasChanged.current = true;
        const updatedFoodList = {
            ...formData.food_list
        };
        const calories = updatedFoodList[oldName] || 0;
        delete updatedFoodList[oldName];
        updatedFoodList[trimmedNew] = calories;

        const updatedFormData = {
            ...formData,
            food_list: updatedFoodList
        };

        setFormData(updatedFormData);

        if (service) {
            await saveField(updatedFormData);
            await service.saveUniqueFood(trimmedNew, calories);
        }
    };

    const handleDeleteFood = async (food_name) => {
        hasChanged.current = true;
        const updatedFoodList = {
            ...formData.food_list
        };
        delete updatedFoodList[food_name];

        const updatedFormData = {
            ...formData,
            food_list: updatedFoodList
        };

        setFormData(updatedFormData);

        if (service) {
            await saveField(updatedFormData);
        }
    };

    const handleAddFoodKeyPress = (e) => {
        if (showDropdown && suggestions.length > 0) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % suggestions.length);
                return;
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
                return;
            }
            if (e.key === 'ArrowRight') {
                if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
                    const item = suggestions[selectedIndex];
                    if (!item.isFallback) {
                        e.preventDefault();
                        setNewFoodName(item.food_name);
                        setShowDropdown(false);
                        return;
                    }
                }
            }
            if (e.key === 'Enter') {
                e.preventDefault();
                if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
                    const item = suggestions[selectedIndex];
                    if (!item.isFallback) {
                        handleAddFood(item.food_name, item.food_calories || 0);
                        setShowDropdown(false);
                        return;
                    }
                }
                handleAddFood(newFoodName, 0);
                setShowDropdown(false);
                return;
            }
            if (e.key === 'Escape') {
                setShowDropdown(false);
                return;
            }
        } else {
            if (e.key === 'Enter') {
                handleAddFood(newFoodName, 0);
            }
        }
    };

    const handleSelectSuggestion = (item) => {
        if (item.isFallback) return;
        setNewFoodName(item.food_name);
        setShowDropdown(false);
    };

    const handleNotesChange = (value) => {
        notesRef.current = value;
        hasChanged.current = true;
        setFormData(prev => ({ ...prev, notes: value }));
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
                {/* Left Column: CALORIE GOAL */}
                <div style={styles.card}>
                    <h3 style={styles.cardHeader}>CALORIE GOAL</h3>
                    <div style={styles.gaugeContainer}>
                        <div style={styles.gaugeWrapper}>
                            <Gauge
                                percentage={percentage}
                                totalValue={totalFoodCal}
                                primaryColor={colors.first}
                                size={265}
                            />
                            <div style={styles.gaugeText}>
                                <span style={styles.totalCalVal}>{totalFoodCal} kcal</span>
                                <span style={styles.goalText}>GOAL: {goalCal} KCAL</span>
                            </div>
                        </div>
                    </div>



                    <div style={styles.goalFooter}>
                        <div style={styles.footerItem}>
                            <span style={styles.footerLabel}>DAILY TARGET</span>
                            <span style={styles.footerValue}>{goalCal} kcal</span>
                        </div>
                        <div style={styles.footerDivider} />
                        <div style={styles.footerItem}>
                            <span style={styles.footerLabel}>REMAINING</span>
                            <span style={{ ...styles.footerValue, color: colors.second }}>
                                {remaining} kcal
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Column: DAILY INTAKE */}
                <div style={styles.rightColumn}>
                    <div style={styles.intakeCard}>
                        <div style={styles.intakeHeader}>
                            <h3 style={styles.cardHeader}>DAILY INTAKE</h3>
                            <span style={styles.itemCount}>
                                {Object.keys(formData.food_list || {}).length} ITEMS LOGGED
                            </span>
                        </div>

                        <div style={styles.foodList} className="no-scrollbar">
                            {Object.entries(formData.food_list || {}).map(([food_name, calories]) => (
                                <FoodTemplate
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
                            <div ref={inputContainerRef} style={styles.inputWrapper}>
                                {showDropdown && suggestions.length > 0 && (
                                    <div style={styles.dropdownContainer}>
                                        {suggestions.map((item, idx) => {
                                            const isSelected = idx === selectedIndex;
                                            if (item.isFallback) {
                                                return (
                                                    <div key="fallback" style={styles.fallbackOption}>
                                                        No known food
                                                    </div>
                                                );
                                            }
                                            return (
                                                <div
                                                    key={item.food_name + idx}
                                                    style={{
                                                        ...styles.dropdownOption,
                                                        ...(isSelected ? styles.dropdownOptionActive : {})
                                                    }}
                                                    onMouseDown={(e) => {
                                                        e.preventDefault();
                                                        handleSelectSuggestion(item);
                                                    }}
                                                    onMouseEnter={() => setSelectedIndex(idx)}
                                                >
                                                    <span>{item.food_name}</span>
                                                    {item.food_calories ? (
                                                        <span style={styles.dropdownCal}>{item.food_calories} kcal</span>
                                                    ) : null}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                                <input
                                    style={styles.addInput}
                                    placeholder="Type food item..."
                                    value={newFoodName}
                                    onChange={(e) => setNewFoodName(e.target.value)}
                                    onFocus={() => {
                                        if (suggestions.length > 0 && newFoodName.trim().length >= 3) {
                                            setShowDropdown(true);
                                        }
                                    }}
                                    onKeyDown={handleAddFoodKeyPress}
                                    disabled={loading}
                                    spellCheck={false}
                                    autoCorrect="off"
                                    autoCapitalize="off"
                                    autoComplete="off"
                                />
                            </div>
                            <button
                                style={styles.addBtn}
                                onClick={() => {
                                    handleAddFood(newFoodName, 0);
                                    setShowDropdown(false);
                                }}
                                disabled={loading}
                            >
                                Add Item
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: DAILY NOTES */}
            <NotesSection
                value={formData.notes}
                onChange={handleNotesChange}
                minHeight="120px"
            />
        </PageLayout>
    );
}

const styles = {
    mainGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1.25fr',
        gap: spacing.lg,
        width: '100%',
    },
    card: {
        backgroundColor: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: borderRadius.md,
        padding: spacing.xl,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
    },
    cardHeader: {
        ...typography.labelCaps,
        color: colors.second,
        margin: `0 0 ${spacing.md} 0`,
    },
    gaugeContainer: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `${spacing.lg} 0`,
    },
    gaugeWrapper: {
        position: 'relative',
        width: 265,
        height: 265,
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
        textAlign: 'center',
        pointerEvents: 'none',
    },
    totalCalVal: {
        fontFamily: typography.fontFamily,
        fontSize: '32px',
        fontWeight: '300',
        color: colors.first,
        lineHeight: '38px',
    },
    goalText: {
        ...typography.labelCaps,
        color: colors.second,
        marginTop: '6px',
        fontSize: '11px',
    },
    goalFooter: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingTop: spacing.md,
        marginTop: spacing.md,
        borderTop: `1px solid ${colors.border}`,
        width: '100%',
    },
    footerItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
    },
    footerDivider: {
        width: '1px',
        height: '28px',
        backgroundColor: colors.border,
    },
    footerLabel: {
        ...typography.labelCaps,
        fontSize: '11px',
        color: colors.second,
    },
    footerValue: {
        fontFamily: typography.fontFamily,
        fontSize: '16px',
        fontWeight: '600',
        color: colors.first,
    },
    rightColumn: {
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.lg,
        height: '100%',
    },
    intakeCard: {
        backgroundColor: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: borderRadius.md,
        padding: spacing.xl,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
    },
    intakeHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: `0 0 ${spacing.md} 0`,
    },
    itemCount: {
        ...typography.labelCaps,
        fontSize: '11px',
        color: colors.second,
    },
    foodList: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.sm,
        minHeight: '140px',
        maxHeight: '300px',
        overflowY: 'auto',
        marginBottom: spacing.md,
        paddingRight: '4px',
    },

    addArea: {
        display: 'flex',
        gap: spacing.sm,
        borderTop: `1px solid ${colors.border}`,
        paddingTop: spacing.md,
    },
    inputWrapper: {
        position: 'relative',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
    },
    dropdownContainer: {
        position: 'absolute',
        top: 'calc(100% + 6px)',
        left: 0,
        right: 0,
        backgroundColor: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: borderRadius.sm,
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6)',
        zIndex: 100,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    },
    dropdownOption: {
        padding: '8px 12px',
        fontFamily: typography.fontFamily,
        fontSize: '14px',
        color: colors.first,
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'transparent',
        transition: 'background-color 0.15s ease',
    },
    dropdownOptionActive: {
        backgroundColor: colors.fifth,
        color: colors.first,
    },
    dropdownCal: {
        fontSize: '12px',
        color: colors.second,
        fontFamily: typography.fontFamily,
    },
    fallbackOption: {
        padding: '8px 12px',
        fontFamily: typography.fontFamily,
        fontSize: '14px',
        color: colors.second,
        fontStyle: 'italic',
        cursor: 'default',
    },
    addInput: {
        width: '100%',
        boxSizing: 'border-box',
        backgroundColor: colors.background,
        color: colors.first,
        border: `1px solid ${colors.border}`,
        borderRadius: borderRadius.sm,
        padding: '8px 12px',
        fontFamily: typography.fontFamily,
        fontSize: '14px',
        outline: 'none',
    },
    addBtn: {
        backgroundColor: colors.first,
        color: colors.background,
        border: 'none',
        borderRadius: borderRadius.sm,
        padding: '8px 16px',
        fontFamily: typography.fontFamily,
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'opacity 0.15s ease',
    },
};

export default DietPage;