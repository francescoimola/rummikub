import { Button } from "@radix-ui/themes";
import { forwardRef, useState } from "react";
import type { ComponentPropsWithoutRef } from "react";

interface CopyEmailButtonProps extends ComponentPropsWithoutRef<typeof Button> {
    email?: string;
    label?: string;
    successLabel?: string;
}

export const CopyEmailButton = forwardRef<HTMLButtonElement, CopyEmailButtonProps>(
    ({ email = "hi@francescoimola.com", label = "Copy email", successLabel = "Copied!", onClick, children, ...props }, ref) => {
        const [copied, setCopied] = useState(false);

        const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
            navigator.clipboard.writeText(email);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            onClick?.(e);
        };

        return (
            <Button {...props} ref={ref} onClick={handleCopy}>
                {children ? children : (copied ? <em>{successLabel}</em> : label)}
            </Button>
        );
    }
);
CopyEmailButton.displayName = "CopyEmailButton";
