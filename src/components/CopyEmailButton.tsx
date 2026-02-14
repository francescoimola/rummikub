import { Button } from "@radix-ui/themes";
import { type ComponentPropsWithoutRef, forwardRef, useState } from "react";
import { SITE_DATA } from "../constants";

interface CopyEmailButtonProps extends ComponentPropsWithoutRef<typeof Button> {
    email?: string;
    label?: string;
    successLabel?: string;
}

export const CopyEmailButton = forwardRef<HTMLButtonElement, CopyEmailButtonProps>(
    ({ email = SITE_DATA.email, label = "Copy email", successLabel = "Copied!", onClick, children, style, ...props }, ref) => {
        const [copied, setCopied] = useState(false);

        return (
            <Button
                {...props}
                ref={ref}
                style={{ userSelect: "none", ...style }}
                onClick={(e) => {
                    void navigator.clipboard.writeText(email);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                    onClick?.(e);
                }}
            >
                {copied ? <em>{successLabel}</em> : (children ?? label)}
            </Button>
        );
    }
);
CopyEmailButton.displayName = "CopyEmailButton";
