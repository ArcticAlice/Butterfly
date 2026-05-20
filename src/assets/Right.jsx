import {colors} from "../utils/theme"

function Right( {width = "25px", height = "25px", color = colors.second, stroke = "white", strokeWidth = 1, ...props} ) {

    const style = {
        cursor: "pointer"
    }

        return (
        <svg style={style}
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 -960 960 960"
            fill={color}
            stroke={stroke}
            strokeWidth={strokeWidth}
            {...props}
        >
            <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z"/>
        </svg>
    );

}

export default Right;
