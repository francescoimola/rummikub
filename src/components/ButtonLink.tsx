import { Button } from "@radix-ui/themes";
import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

interface ButtonLinkProps extends ComponentPropsWithoutRef<typeof Button> {
    href: string;
    external?: boolean;
    target?: string;
    rel?: string;
}

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
    ({ href, external, children, target, rel, ...props }, ref) => {
        return (
            <Button {...props} asChild ref={ref as any}>
                <a
                    href={href}
                    style={{ textDecoration: "none" }}
                    target={target ?? (external ? "_blank" : undefined)}
                    rel={rel ?? (external ? "noopener noreferrer" : undefined)}
                >
                    {children}
                </a>
            </Button>
        );
    }
);
ButtonLink.displayName = "ButtonLink";
