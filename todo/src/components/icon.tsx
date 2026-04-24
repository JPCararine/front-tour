import React from "react";
import {cva, type VariantProps} from "class-variance-authority";

const icon = cva("", {
    variants: {
        animate: {
            true: "animate-spin",
            false: ""
        }
    },
    defaultVariants: {
        animate: false
    }
}); 
   

interface IconProps extends React.ComponentProps<"svg">, VariantProps<typeof icon> {
    svg: React.FC<React.ComponentProps<"svg">>;
}


function Icon( {svg: SvgComponent, animate, className, ...props}: IconProps) {
    return <SvgComponent className={icon({animate, className})}{...props} />
}

export default Icon;
export { icon };