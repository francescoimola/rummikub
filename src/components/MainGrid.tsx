import { Container, Grid } from "@radix-ui/themes";
import type { ComponentProps, ReactNode } from "react";

type MainGridProps = ComponentProps<typeof Grid> & {
    children?: ReactNode;
};


export function MainGrid({ className, children, ...rest }: MainGridProps) {
    return (
        <Container maxWidth="var(--max-cw)">
            <Grid
                columns={{ initial: "1", sm: "2" }}
                py="var(--space-10)"
                gapY="var(--space-12)"
                gapX="4"
                className={`side-margin ${className || ""}`}
                {...rest}
            >
                {children}
            </Grid>
        </Container>
    );
}
