import React from "react";
import Text from "./text";
import {cva, type VariantProps} from "class-variance-authority"

const badge = cva("inline-flex items-center justify-center rounded-full", {
    variants: {
        variant: {
            primary: "text-pink-dark bg-pink-light",
            secondary: "text-green-dark bg-green-light"
        },
        size: {
            sm: "py-0.5 px-2" 
        }
    },
    defaultVariants: {
        variant: "primary",
        size: "sm"
    }
});

const badgeText = cva("", {
    variants: {
        variant: {
            primary: "text-pink-dark",
            secondary: "text-green-dark"
        }
    },
    defaultVariants: {
        variant: "primary"
    }
})
    


interface BadgeProps extends React.ComponentProps<"div">, VariantProps<typeof badge>{
    className?: string;
    children?: React.ReactNode;
}


function Badge({size, className, variant, children, ...props}: BadgeProps) {
    return (
        <div className={badge({className,size, variant})}{...props}>
            <Text variant="body-sm-bold" className={badgeText({variant})}>{children}</Text>
        </div>
    )
}

export default Badge;
export { badge, badgeText };