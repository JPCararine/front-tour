import React from "react";
import { cva, type VariantProps} from "class-variance-authority";

const text = cva("font-sans text-gray-400", {
    variants: {
        variant: {
            "body-sm-bold": "text-sm leading-5 font-semibold",
            "body-md": "text-base leading-6 font-normal",
            "body-md-bold": "text-base leading-6 font-semibold"
        }
    },
    defaultVariants: {
        variant: "body-md"
    }
});
    

interface TextProps extends VariantProps<typeof text>{
    as?: keyof React.JSX.IntrinsicElements;
    className?: string;
    children?: React.ReactNode;
}

function Text( {as = "span", variant, className, children, ...props}: TextProps) {
    return React.createElement(
        as,
        {
            className: text({variant, className}),
            ...props
        },
        children
    )
}

export default Text;
export { text };