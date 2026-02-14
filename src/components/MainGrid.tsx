import { Grid } from "@radix-ui/themes";
import type { ComponentProps } from "react";

type MainGridProps = ComponentProps<typeof Grid>;

export function MainGrid({ className, ...props }: MainGridProps) {
    return (
        <Grid
            maxWidth="var(--max-cw)"
            mx="auto"
            columns={{ initial: "1", md: "2" }}
            py="var(--space-10)"
            gapY="var(--space-12)"
            gapX="4"
            className={`side-margin ${className ?? ""}`}
            {...props}
        />
    );
}
