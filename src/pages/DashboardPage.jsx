import React from 'react';
import PageLayout from "../components/PageLayout";
import DateNavigator from '../components/DateNavigator';
import { colors, typography, spacing, borderRadius } from '../utils/theme';

function DashboardPage({ onNavigate, currentDate, setCurrentDate, service, onCalendarClick }) {
    return (
        <PageLayout title={true} onCalendarClick={onCalendarClick}>
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

            <div style={styles.gridContainer}>
                {/* Top Section: Sleep & Metrics Column */}
                <div style={styles.topGrid}>
                    {/* Sleep Card */}
                    <div
                        style={{ ...styles.card, ...styles.sleepCard }}
                        onClick={() => onNavigate('sleep')}
                        title="View Sleep Details"
                    >
                        <div style={styles.cardHeader}>
                            <span style={styles.cardCategory}>RECOVERY</span>
                            <h2 style={styles.cardTitle}>Sleep</h2>
                        </div>
                        <p style={styles.cardSubtext}>Track sleep duration, quality, and stages</p>
                    </div>

                    {/* Right Column Metrics */}
                    <div style={styles.metricsColumn}>
                        <div
                            style={styles.smallCard}
                            onClick={() => onNavigate('vitals')}
                            title="View Vitals Details"
                        >
                            <span style={styles.cardCategory}>METRICS</span>
                            <h3 style={styles.smallCardTitle}>Vitals</h3>
                        </div>

                        <div
                            style={styles.smallCard}
                            onClick={() => onNavigate('diet')}
                            title="View Diet Details"
                        >
                            <span style={styles.cardCategory}>NUTRITION</span>
                            <h3 style={styles.smallCardTitle}>Diet</h3>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Blood Work & Journal */}
                <div style={styles.bottomGrid}>
                    <div
                        style={styles.bloodWorkCard}
                        onClick={() => onNavigate('blood-work')}
                        title="View Blood Work Lab Reports"
                    >
                        <span style={styles.cardCategory}>LABS</span>
                        <h2 style={styles.cardTitle}>Blood Work</h2>
                        <p style={styles.cardSubtext}>Biometric analysis and lipid panel records</p>
                    </div>

                    <div
                        style={styles.bloodWorkCard}
                        onClick={() => onNavigate('journal')}
                        title="View Journal Tasks & Reflection"
                    >
                        <span style={styles.cardCategory}>JOURNAL</span>
                        <h2 style={styles.cardTitle}>Journal</h2>
                        <p style={styles.cardSubtext}>Task logging, details, and monthly summary</p>
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}

const styles = {
    gridContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.lg,
        width: '100%',
    },
    topGrid: {
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: spacing.lg,
        width: '100%',
    },
    bottomGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: spacing.lg,
        width: '100%',
    },
    card: {
        backgroundColor: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        cursor: 'pointer',
        color: colors.first,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'border-color 0.2s ease, transform 0.15s ease',
    },
    sleepCard: {
        minHeight: '242px',
    },
    metricsColumn: {
        display: 'flex',
        flexDirection: 'column',
        gap: spacing.lg,
    },
    smallCard: {
        backgroundColor: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        cursor: 'pointer',
        flex: 1,
        color: colors.first,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        transition: 'border-color 0.2s ease, transform 0.15s ease',
    },
    bloodWorkCard: {
        backgroundColor: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: borderRadius.md,
        padding: spacing.lg,
        cursor: 'pointer',
        color: colors.first,
        minHeight: '152px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        transition: 'border-color 0.2s ease, transform 0.15s ease',
    },


    cardCategory: {
        ...typography.labelCaps,
        fontSize: '11px',
        color: colors.second,
        marginBottom: spacing.xs,
    },
    cardTitle: {
        ...typography.h1,
        color: colors.first,
        margin: 0,
    },
    smallCardTitle: {
        ...typography.h2,
        color: colors.first,
        margin: 0,
    },
    cardSubtext: {
        ...typography.body,
        fontSize: '14px',
        color: colors.second,
        marginTop: spacing.xs,
    },
    cardHeader: {
        display: 'flex',
        flexDirection: 'column',
    }
};

export default DashboardPage;