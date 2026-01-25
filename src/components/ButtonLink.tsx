import { Button } from "@radix-ui/themes";
import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

interface ButtonLinkProps extends ComponentPropsWithoutRef<typeof Button> {
    href: string;
}

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
    ({ href, children, ...props }, ref) => {
        return (
            <Button {...props} asChild ref={ref as any}>
                <a href={href} style={{ textDecoration: "none", color: "inherit" }}>
                    {children}
                </a>
            </Button>
        );
    }
);
ButtonLink.displayName = "ButtonLink";
