import React from "react";
import {cva, type VariantProps} from "class-variance-authority"
import Icon from "./icon";



const buttonIcon = cva(`
    inline-flex items-center justify-center cursor-pointer transition group rounded-sm
    `, {
    variants: {
        variant: {
            primary: "fill-white bg-green-base hover:bg-green-dark",
            secondary: "fill-pink-base bg-gray-200 hover:fill-white hover:bg-pink-base",
            terciary: "fill-gray-300 hover:fill gray-400 hover:bg-gray-200"
        },
        size: {
            sm: "w-6 h-6 p-1 rounded"
        },

        disabled: {
            true: "opacity-50 pointer-events-none"
        },

        defaultVariants: {
            variant: "primary",
            size: "sm",
            disabled: false
        }
    }
})



interface ButtonIconProps extends Omit<React.ComponentProps<"button">, "size" | "disabled">, VariantProps<typeof buttonIcon>{
    icon: React.ComponentProps<typeof Icon>["svg"];
    className?: string;
    
}

function ButtonIcon({icon: IconComponent, variant, size ,className, disabled, ...props}: ButtonIconProps) {
    return (
        <button className={buttonIcon({variant, size, disabled})}{...props}>
            <Icon svg={IconComponent} />
        </button>
    )
    
}

export default ButtonIcon;
export { buttonIcon };