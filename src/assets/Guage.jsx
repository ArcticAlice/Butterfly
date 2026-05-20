import { colors } from "../utils/theme";

function Gauge({
    width = 220,
    height = 220,
    percentage = 0,
    primaryColor = colors.third,
    totalValue = 0,
    goalText = "",
    ...props
}) {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const hasGoalText = Boolean(goalText?.trim());

    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 100 100"
            {...props}
        >
            <circle
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke="#F3F4F6"
                strokeWidth="6"
            />
            <circle
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke={primaryColor}
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - (circumference * percentage) / 100}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
            />
        </svg>
    );
}

export default Gauge;