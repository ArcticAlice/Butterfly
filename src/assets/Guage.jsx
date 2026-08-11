import { colors } from "../utils/theme";

function Gauge({ size = 220, percentage = 0, primaryColor = colors.first, totalValue = 0, goalText = "", ...props}) {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            {...props}
        >
            <circle
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke={colors.border}
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