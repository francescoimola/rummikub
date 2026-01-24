import { Heading } from "@radix-ui/themes";
import type { ComponentProps } from "react";

interface PageHeadingProps extends ComponentProps<typeof Heading> { }

export default function PageHeading({ className = "", children, ...props }: PageHeadingProps) {
    return (
        <Heading
            as="h1"
            size="8"
            weight="medium"
            highContrast
            trim="both"
            className={className}
            {...props}
        >
            {children}
        </Heading>
    );
}
