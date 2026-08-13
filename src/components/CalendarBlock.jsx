import React from "react";
import Block from "./Block";
import Left from "../assets/Left.jsx";
import Right from "../assets/Right.jsx";
import { colors, typography, spacing, borderRadius } from "../utils/theme";

function CalendarBlock({ year, month, onSelectDay, onPreviousMonth, onNextMonth }) {
    const firstDay = new Date(year, month, 1);
    const startWeekday = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // Total slots rounded up to full weeks
    const totalSlots = Math.ceil((startWeekday + daysInMonth) / 7) * 7;
    const numRows = totalSlots / 7;
    const monthName = new Date(year, month).toLocaleString("default", { month: "long" });

    const blocks = Array.from({ length: totalSlots }).map((_, index) => {
        const day = index >= startWeekday && index < startWeekday + daysInMonth
            ? index - startWeekday + 1
            : null;

        return (
            <Block
                key={index}
                day={day}
                fill={false}
                circle={Boolean(day)}
                onClick={() => day && onSelectDay(day)}
            />
        );
    });

    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div style={styles.box}>
            <div style={styles.headerBox}>
                <button
                    type="button"
                    onClick={onPreviousMonth}
                    style={styles.arrowButton}
                    title="Previous Month"
                >
                    <Left size="18px" color={colors.first} stroke="none" />
                </button>

                <h2 style={styles.headerText}>{monthName} {year}</h2>

                <button
                    type="button"
                    onClick={onNextMonth}
                    style={styles.arrowButton}
                    title="Next Month"
                >
                    <Right size="18px" color={colors.first} stroke="none" />
                </button>
            </div>

            <div style={styles.weekdayGrid}>
                {weekdays.map((day, index) => (
                    <div key={index} style={styles.weekdayItem}>{day}</div>
                ))}
            </div>

            <div style={{ ...styles.gridContainer, gridTemplateRows: `repeat(${numRows}, 1fr)` }}>
                {blocks}
            </div>
        </div>
    );
}

export default CalendarBlock;

const styles = {
    box: {
        width: "100%",
        height: "100%",
        borderRadius: borderRadius.md,
        backgroundColor: colors.card,
        border: `1px solid ${colors.border}`,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        boxSizing: "border-box",
        padding: "16px 24px 24px 24px",
    },
    headerBox: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: spacing.md,
        paddingBottom: "16px",
        borderBottom: `1px solid ${colors.border}`,
        userSelect: "none",
    },
    arrowButton: {
        background: 'transparent',
        border: 'none',
        padding: '6px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px',
        color: colors.first,
        transition: 'opacity 0.15s ease',
    },
    headerText: {
        fontFamily: typography.fontFamily,
        fontSize: "24px",
        fontWeight: "600",
        color: colors.first,
        margin: 0,
        letterSpacing: "-0.01em",
        minWidth: "200px",
        textAlign: "center",
    },
    weekdayGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: "12px",
        padding: "16px 0 8px 0",
        textAlign: "center",
    },
    weekdayItem: {
        fontFamily: typography.labelCaps.fontFamily,
        fontSize: "12px",
        fontWeight: "600",
        color: colors.second,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
    },
    gridContainer: {
        flex: 1,
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: "10px",
        paddingTop: "8px",
    },
};

