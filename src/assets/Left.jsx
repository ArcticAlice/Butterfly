import {colors} from "../utils/theme"
 
function Left( {width = "25px", height = "25px", color = colors.second, stroke = "white", strokeWidth = 1, ...props} ) {

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
            <path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z"/>
        </svg>
    );

}


export default Left;
