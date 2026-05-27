import PageHeader from "../components/PageHeader"
import { colors, typography, spacing } from '../utils/theme';
import DateNavigator from '../components/DateNavigator';

function DashboardPage({ onNavigate, currentDate, setCurrentDate }) {

    return (
        <div style={styles.container}>
            <PageHeader />

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

                {/* Top Section: Sleep & Small Metrics */}
                <div style={styles.topGrid}>

                    {/* Sleep Card */}
                    <div style={styles.card} onClick={() => onNavigate('sleep')}>
                        <div style={styles.cardHeader}>
                            <div>
                                <p>Sleep</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column Metrics */}
                    <div style={styles.metricsColumn}>
                        <div style={styles.smallCard} onClick={() => onNavigate('vitals')}>
                            <p>Vitals</p>
                        </div>

                        <div style={styles.smallCard} onClick={() => onNavigate('diet')}>
                            <p>Diet</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Blood Work */}
                <div style={styles.bloodWorkCard} onClick={() => onNavigate('blood-work')}>
                    <p>Blood Work</p>
                </div>
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
        width: '70%',
        height: '93%',
        position: 'absolute',
        bottom: '0',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'grid',
        gridTemplateRows: '5% 50% 36%',
        gap: '2%',
        boxSizing: 'border-box',
        paddingTop: '2%',
    },

    topGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: spacing.lg, marginBottom: spacing.lg },

    card: {
        backgroundColor: colors.card, borderRadius: '16px', padding: spacing.lg, cursor: 'pointer'
    },
    cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: spacing.lg },
    metricsColumn: { display: 'flex', flexDirection: 'column', gap: spacing.md },
    smallCard: { backgroundColor: colors.card, borderRadius: '16px', padding: spacing.md, cursor: 'pointer', flex: '1' },

    bloodWorkCard: { backgroundColor: colors.card, borderRadius: '16px', padding: spacing.lg, cursor: 'pointer' },
};

export default DashboardPage;