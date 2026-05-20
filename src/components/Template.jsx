import React, { useState, useEffect, useRef } from "react";
import Vert from "../assets/Vert";
import Pencil from "../assets/Pencil";

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
            <Vert width="75%" height="75%" onClick={() => setIsEditingName(true)} />

            <div>
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
            <Pencil width="75%" height="75%" onClick={() => onDelete(foodName)} />
        </div>
    );
}

export default Template;

const style = {
    box: {
        width: "90%",
        height: "40px",
        border: "1px solid #750D37",
        borderRadius: "8px",
        display: "grid",
        gridTemplateColumns: "10% 70% 13% 7%",
        boxSizing: "border-box",
        alignItems: "center",
    },
    text: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "inline-block",
        height: "100%",
    },
    nameInput: {
        borderRadius: "4px",
        border: "1px solid #00B4D8",
        fontSize: "14px",
        display: "inline-block",
        outline: "none",
        height: "100%",
    },
    durationInput: {
        borderRadius: "5px",
        display: "inline-block",
        textAlign: "center",
        fontSize: "14px",
        height: "80%",
        border: "none",
        outline: "none"
    }
};