import React from "react";
import { cva, type VariantProps} from "class-variance-authority";
import Text from "./text";
import Icon from "./icon";


const button = cva(`
    flex items-center justify-center cursor-pointer
    transition rounded-lg group gap-2
    `, {
    variants: {
        variant: {
            primary: "bg-gray-200 hover:bg-pink-light"
        },
        size: {
            md: "h-14 py-4 px-5"
        },
        disabled: {
            true: "opacity-50 pointer-events-none"
        }
    },
    defaultVariants: {
        variant: "primary",
        size: "md",
        disabled: false
    }
});

const buttonText = cva("", {
    variants: {
        variant: {
            primary: "text-gray-400"
        }
    },
    defaultVariants: {
        variant: "primary"
    }
});

const buttonIcon = cva("transition", {
    variants: {
        variant: {
            primary: "fill-pink-base"
        },
        size: {
            md: "w-5 h-5"
        }
    },
    defaultVariants: {
        variant: "primary",
        size: "md"
    }
});

interface ButtonProps extends Omit<React.ComponentProps<"button">, "size" | "disabled">, VariantProps<typeof button>{
    icon?: React.ComponentProps<typeof Icon>["svg"];
    children?: React.ReactNode;
    className?: string;
}

function Button({icon: IconComponent,disabled ,size ,variant,children, className, ...props}: ButtonProps) {
    return (
        <button className={button({variant, className, disabled, size})}{...props}>
            {IconComponent && <Icon svg={IconComponent} 
            className={buttonIcon({variant, size})} 
            /> }
            <Text variant ="body-md-bold" className={buttonText({variant})}>{children}</Text>
        </button>
    )
}

export default Button;
export { button, buttonIcon, buttonText};