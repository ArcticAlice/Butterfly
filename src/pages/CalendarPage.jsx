import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PageLayout from "../components/PageLayout";
import CalendarBlock from "../components/CalendarBlock";

const calendarVariants = {
    enter: (dir) => ({ opacity: 0, x: dir * 22 }),
    center: { opacity: 1, x: 0 },
    exit: (dir) => ({ opacity: 0, x: dir * -22 }),
};

function CalendarPage({ currentDate = new Date(), onSelectDate, onBack }) {
    const initialMonthIndex = useMemo(() => {
        const d = currentDate || new Date();
        return (d.getFullYear() - 1970) * 12 + d.getMonth();
    }, [currentDate]);

    const [monthIndex, setMonthIndex] = useState(initialMonthIndex);
    const [direction, setDirection] = useState(0);

    const { currentYear, currentMonth } = useMemo(() => {
        const year = 1970 + Math.floor(monthIndex / 12);
        const month = ((monthIndex % 12) + 12) % 12;
        return { currentYear: year, currentMonth: month };
    }, [monthIndex]);

    const handleLeftArrow = () => {
        setDirection(-1);
        setMonthIndex((prev) => prev - 1);
    };

    const handleRightArrow = () => {
        setDirection(1);
        setMonthIndex((prev) => prev + 1);
    };

    useEffect(() => {
        const onKeyDown = (e) => {
            const el = e.target;
            const tag = el?.tagName;
            if (tag === "INPUT" || tag === "TEXTAREA" || el?.isContentEditable) return;

            if (e.key === "ArrowLeft") {
                e.preventDefault();
                handleLeftArrow();
            } else if (e.key === "ArrowRight") {
                e.preventDefault();
                handleRightArrow();
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    const handleSelectDay = (day) => {
        if (onSelectDate) {
            const selectedDate = new Date(currentYear, currentMonth, day);
            onSelectDate(selectedDate);
        }
    };

    return (
        <PageLayout onBack={onBack} title={false}>
            <div style={styles.calendarWrapper}>
                <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                        key={monthIndex}
                        style={styles.calendarContainer}
                        custom={direction}
                        variants={calendarVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
                    >
                        <CalendarBlock
                            year={currentYear}
                            month={currentMonth}
                            onSelectDay={handleSelectDay}
                        />
                    </motion.div>
                </AnimatePresence>
            </div>
        </PageLayout>
    );
}

export default CalendarPage;

const styles = {
    calendarWrapper: {
        width: "100%",
        height: "calc(100vh - 130px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
    },
    calendarContainer: {
        width: "100%",
        maxWidth: "960px",
        height: "100%",
        maxHeight: "720px",
    },
};
