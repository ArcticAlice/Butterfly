import React, { useState, useEffect, useRef } from "react";
import Vert from "../assets/Vert";
import { colors, typography, spacing } from "../utils/theme";

function Template({ foodName, initialCalories, onUpdateCalories, onDelete, onEditName }) {
    const [calories, setCalories] = useState(initialCalories || '');
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState(foodName);
    const nameInputRef = useRef(null);

    // Sync state if it changes externally
    useEffect(() => { setCalories(initialCalories || ''); }, [initialCalories]);
    useEffect(() => { setTempName(foodName); }, [foodName]);

    // Auto-focus the input box when user clicks Vert to edit
    useEffect(() => {
        if (isEditingName && nameInputRef.current) {
            nameInputRef.current.focus();
        }
    }, [isEditingName]);

    // Save calories instantly
    const handleBlurCalories = () => { onUpdateCalories(foodName, Number(calories) || 0); };
    const handleKeyDownCalories = (e) => { if (e.key === 'Enter') e.target.blur(); };

    // Save New Name instantly
    const handleSaveName = () => {
        const trimmedName = tempName.trim();
        if (trimmedName !== '' && trimmedName !== foodName) {
            onEditName(foodName, trimmedName);
        } else {
            setTempName(foodName); // revert if they left it blank
        }
        setIsEditingName(false);
    };
    const handleKeyDownName = (e) => { if (e.key === 'Enter') handleSaveName(); };

    return (
        <div style={style.box}>
            <Vert width="20px" height="20px" onClick={() => setIsEditingName(true)} style={{ cursor: 'pointer' }} />

            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", cursor: "pointer" }} onClick={() => setIsEditingName(true)}>
                {isEditingName ? (
                    <input
                        ref={nameInputRef}
                        style={style.nameInput}
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        onBlur={handleSaveName}
                        onKeyDown={handleKeyDownName}
                    />
                ) : (
                    <p style={style.text} title={foodName}>{foodName}</p>
                )}
            </div>

            <input
                type="text"
                inputMode="numeric"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                onBlur={handleBlurCalories}
                onKeyDown={handleKeyDownCalories}
                style={style.durationInput}
                placeholder="0"
            />
            {onDelete && (
                <button
                    onClick={() => onDelete(foodName)}
                    style={style.deleteBtn}
                    title="Remove"
                >
                    &times;
                </button>
            )}
        </div>
    );
}

export default Template;

const style = {
    box: {
        width: "100%",
        height: "44px",
        backgroundColor: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: '4px',
        display: "grid",
        gridTemplateColumns: "36px 1fr 64px 32px",
        boxSizing: "border-box",
        alignItems: "center",
        padding: `0 ${spacing.sm}`,
        gap: spacing.xs,
    },
    text: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "inline-block",
        color: colors.first,
        fontFamily: typography.fontFamily,
        fontSize: '14px',
        fontWeight: '500',
    },
    nameInput: {
        border: `1px solid ${colors.border}`,
        borderRadius: '2px',
        fontSize: '14px',
        display: "inline-block",
        outline: "none",
        backgroundColor: colors.card,
        color: colors.first,
        padding: '2px 4px',
        fontFamily: typography.fontFamily,
    },
    durationInput: {
        borderRadius: '2px',
        display: "inline-block",
        textAlign: "right",
        fontSize: '14px',
        fontWeight: '600',
        height: "28px",
        border: `1px solid ${colors.border}`,
        outline: "none",
        backgroundColor: colors.card,
        color: colors.first,
        padding: '0 6px',
        fontFamily: typography.monoFontFamily || 'monospace',
    },
    deleteBtn: {
        background: 'transparent',
        border: 'none',
        color: colors.second,
        fontSize: '18px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        width: '24px',
        height: '24px',
    }
};