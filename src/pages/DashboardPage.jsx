import React from 'react';
import { colors, typography, spacing } from '../utils/theme';

function DashboardPage({ onNavigate }) {
    
    // Fake Data for Sleep Histogram
    const sleepData = [40, 60, 45, 80, 55, 70, 65]; 

    return (
        <div style={styles.container}>
            {/* Header Section */}
            <div style={styles.header}>
                <div style={styles.logoContainer}>
                    <span style={styles.logoIcon}>🦋</span>
                    <h1 style={styles.logoText}>Butterfly Health Dashboard</h1>
                </div>
                <div style={styles.userIcon}>👤</div>
            </div>

            <div style={styles.content}>
                <h2 style={styles.pageTitle}>Activity Detail</h2>

                {/* Top Section: Sleep & Small Metrics */}
                <div style={styles.topGrid}>
                    
                    {/* Sleep Card */}
                    <div style={styles.card} onClick={() => onNavigate('sleep')}>
                        <div style={styles.cardHeader}>
                            <div>
                                <h3 style={styles.cardTitle}>Sleep</h3>
                                <p style={styles.cardSubtitle}>Restorative cycle and REM efficiency</p>
                            </div>
                            <span style={styles.timeTag}>Last 7 Days ▾</span>
                        </div>
                        <div style={styles.chartArea}>
                            {sleepData.map((val, i) => (
                                <div key={i} style={styles.chartColumn}>
                                    <div style={{...styles.chartBar, height: `${val}%`}}></div>
                                    <span style={styles.chartLabel}>{['MON','TUE','WED','THU','FRI','SAT','SUN'][i]}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column Metrics */}
                    <div style={styles.metricsColumn}>
                        <div style={styles.smallCard} onClick={() => onNavigate('health-metrics')}>
                            <div style={styles.smallCardHeader}>
                                <span>➕ Health Metrics</span>
                            </div>
                            <p style={styles.metricLabel}>Optimal Range</p>
                            <div style={styles.metricValueRow}>
                                <span style={styles.metricValue}>94%</span>
                                <span style={styles.metricTrendPos}>+2.4%</span>
                            </div>
                        </div>

                        <div style={styles.smallCard} onClick={() => onNavigate('diet')}>
                            <div style={styles.smallCardHeader}>
                                <span>🍴 Diet</span>
                            </div>
                            <p style={styles.metricLabel}>Daily Calorie Balance</p>
                            <div style={styles.metricValueRow}>
                                <span style={styles.metricValue}>1,850 <small>kcal</small></span>
                                <span style={styles.toggleIcon}>◑</span>
                            </div>
                        </div>

                        <div style={styles.smallCard} onClick={() => onNavigate('workout')}>
                            <div style={styles.smallCardHeader}>
                                <span>🏃 Workout</span>
                            </div>
                            <p style={styles.metricLabel}>Weekly Consistency</p>
                            <div style={styles.metricValueRow}>
                                <span style={styles.metricValue}>5/7 <small>days</small></span>
                                <span style={styles.detailsLink}>Details</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Blood Work */}
                <div style={styles.bloodWorkCard} onClick={() => onNavigate('blood-work')}>
                    <div style={styles.cardHeader}>
                        <div>
                            <h3 style={styles.cardTitle}>Blood Work</h3>
                            <p style={styles.cardSubtitle}>Comprehensive laboratory results and biometric history</p>
                        </div>
                        <span style={styles.detailsLink}>Full Report</span>
                    </div>

                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.tableHeader}>
                                <th style={styles.th}>MARKER</th>
                                <th style={styles.th}>DATE & SOURCE</th>
                                <th style={styles.th}>CURRENT VALUE</th>
                                <th style={styles.th}>STATUS</th>
                                <th style={styles.th}>TREND</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={styles.tr}>
                                <td style={styles.td}>🧪 <b>Total Cholesterol</b></td>
                                <td style={styles.tdSub}>Oct 12, 2023 <br/>City Diagnostics</td>
                                <td style={styles.td}>184 mg/dL</td>
                                <td style={styles.td}><span style={styles.statusOptimal}>OPTIMAL</span></td>
                                <td style={styles.td}>📉</td>
                            </tr>
                            <tr style={styles.tr}>
                                <td style={styles.td}>🩸 <b>Hemoglobin A1c</b></td>
                                <td style={styles.tdSub}>Oct 12, 2023 <br/>City Diagnostics</td>
                                <td style={styles.td}>5.2%</td>
                                <td style={styles.td}><span style={styles.statusNormal}>NORMAL</span></td>
                                <td style={styles.td}>→</td>
                            </tr>
                            <tr style={styles.tr}>
                                <td style={styles.td}>🔬 <b>Vitamin D (25-OH)</b></td>
                                <td style={styles.tdSub}>Sep 28, 2023 <br/>Quest Health</td>
                                <td style={styles.td}>28 ng/mL</td>
                                <td style={styles.td}><span style={styles.statusLow}>LOW</span></td>
                                <td style={styles.td}>📈</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { minHeight: '100vh', backgroundColor: colors.background, paddingBottom: spacing.xxl },
    header: { 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: `${spacing.md} ${spacing.xl}`, backgroundColor: colors.surface, borderBottom: `1px solid ${colors.border}` 
    },
    logoContainer: { display: 'flex', alignItems: 'center', gap: spacing.sm },
    logoIcon: { fontSize: '24px' },
    logoText: { ...typography.h3, color: colors.primary, margin: 0 },
    userIcon: { fontSize: '20px', backgroundColor: '#ddd', borderRadius: '50%', padding: '4px' },
    content: { maxWidth: '1100px', margin: '0 auto', padding: spacing.xl },
    pageTitle: { ...typography.h2, color: colors.primary, marginBottom: spacing.lg },
    
    topGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: spacing.lg, marginBottom: spacing.lg },
    
    card: { 
        backgroundColor: colors.surface, borderRadius: '16px', padding: spacing.lg, 
        boxShadow: '0 4px 6px rgba(0,0,0,0.02)', cursor: 'pointer' 
    },
    cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: spacing.lg },
    cardTitle: { ...typography.h3, margin: 0 },
    cardSubtitle: { ...typography.caption, color: colors.textSecondary, margin: 0 },
    timeTag: { fontSize: '11px', color: colors.textSecondary, border: `1px solid ${colors.border}`, padding: '4px 8px', borderRadius: '8px' },
    
    chartArea: { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '200px', padding: `0 ${spacing.md}`, borderBottom: `1px solid ${colors.border}` },
    chartColumn: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '10%' },
    chartBar: { width: '100%', backgroundColor: '#F3F4F6', borderRadius: '4px 4px 0 0' },
    chartLabel: { fontSize: '10px', color: colors.textTertiary, marginTop: spacing.sm },

    metricsColumn: { display: 'flex', flexDirection: 'column', gap: spacing.md },
    smallCard: { backgroundColor: colors.surface, borderRadius: '16px', padding: spacing.md, boxShadow: '0 2px 4px rgba(0,0,0,0.02)', cursor: 'pointer' },
    smallCardHeader: { ...typography.caption, fontWeight: '700', marginBottom: spacing.xs },
    metricLabel: { fontSize: '11px', color: colors.textSecondary, margin: 0 },
    metricValueRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: spacing.xs },
    metricValue: { ...typography.h2, margin: 0 },
    metricTrendPos: { color: colors.secondary, fontSize: '12px', fontWeight: '600' },
    detailsLink: { fontSize: '12px', color: colors.textSecondary, textDecoration: 'underline' },

    bloodWorkCard: { backgroundColor: colors.surface, borderRadius: '16px', padding: spacing.lg, cursor: 'pointer' },
    table: { width: '100%', borderCollapse: 'collapse', marginTop: spacing.md },
    th: { textAlign: 'left', fontSize: '10px', color: colors.textTertiary, padding: spacing.sm, borderBottom: `1px solid ${colors.border}` },
    td: { padding: spacing.md, fontSize: '13px', borderBottom: `1px solid ${colors.border}` },
    tdSub: { padding: spacing.md, fontSize: '11px', color: colors.textSecondary, borderBottom: `1px solid ${colors.border}` },
    statusOptimal: { color: colors.secondary, fontWeight: '700', fontSize: '10px', backgroundColor: '#ECFDF5', padding: '4px 8px', borderRadius: '4px' },
    statusNormal: { color: colors.primary, fontWeight: '700', fontSize: '10px', backgroundColor: '#F0F9FF', padding: '4px 8px', borderRadius: '4px' },
    statusLow: { color: colors.error, fontWeight: '700', fontSize: '10px', backgroundColor: '#FEF2F2', padding: '4px 8px', borderRadius: '4px' },
};

export default DashboardPage;