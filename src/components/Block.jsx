import React, { useState } from "react";
import { colors } from "../utils/theme";

function Number({ day }) {
    const Style = {
        width: "30%",
        height: "30%",
        position: "absolute",
        bottom: "4px",
        right: "6px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: colors.first,
        fontWeight: "500",
    };

    return <div style={Style}>{day}</div>;
}

function Block({ day, onClick, fill = false, circle = false }) {
    const [hovered, setHovered] = useState(false);

    const glowColor = day ? colors.first : colors.border;

    const Style = {
        width: "100%",
        height: "100%",
        borderRadius: "8px",
        border: `1px solid ${day ? glowColor : 'transparent'}`,
        position: "relative",
        cursor: day ? "pointer" : "default",
        boxSizing: "border-box",
        backgroundColor: day ? (hovered ? "rgba(237, 203, 150, 0.1)" : "rgba(20, 20, 20, 0.6)") : "transparent",
        transition: "transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease",

        transform: day && hovered ? "scale(1.03)" : "scale(1)",
        transformOrigin: "center",

        boxShadow: day && hovered
            ? `0 0 12px rgba(237, 203, 150, 0.35)`
            : `none`,

        zIndex: hovered ? 2 : 1,
    };

    const fillStyle = {
        width: "6px",
        height: "6px",
        border: `1px solid ${colors.first}`,
        backgroundColor: fill ? colors.first : "transparent",
        borderRadius: "50%",
        position: "absolute",
        top: "8px",
        left: "8px",
    };

    return (
        <div
            style={Style}
            onClick={day ? onClick : undefined}
            onMouseEnter={() => day && setHovered(true)}
            onMouseLeave={() => day && setHovered(false)}
            onFocus={() => day && setHovered(true)}
            onBlur={() => day && setHovered(false)}
            tabIndex={day ? 0 : -1}
            aria-label={day ? `Day ${day}` : undefined}
            onKeyDown={(e) => {
                if (day && onClick && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onClick();
                }
            }}
        >
            {day && <Number day={day} />}
            {day && circle && <div style={fillStyle}></div>}
        </div>
    );
}

export default Block;

