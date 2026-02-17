import { Heading } from "@radix-ui/themes";
import type { ComponentProps } from "react";

export default function PageHeading(props: ComponentProps<typeof Heading>) {
    return (
        <Heading
            as="h1"
            size="8"
            weight="medium"
            highContrast
            trim="both"

            {...props}
        />
    );
}
