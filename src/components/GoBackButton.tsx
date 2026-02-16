import { Button } from "@radix-ui/themes";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { ButtonLink } from "./ButtonLink";
import { useState, useEffect, type ComponentPropsWithoutRef } from "react";

type GoBackButtonProps = ComponentPropsWithoutRef<typeof Button> & {
    fallbackHref?: string;
};

/**
 * Determines if the previous history entry is same-origin.
 *
 * Primary: Navigation API (Baseline 2026, works with view transitions).
 * Fallback: document.referrer (older browsers, full page loads only).
 */
function hasSameOriginPreviousPage(): boolean {
    const nav = (window as any).navigation;
    if (nav?.currentEntry) {
        const { index } = nav.currentEntry;
        if (typeof index === "number" && index > 0) {
            const prev = nav.entries()[index - 1];
            try {
                return new URL(prev.url).origin === window.location.origin;
            } catch {
                return false;
            }
        }
        return false;
    }

    try {
        return (
            window.history.length > 1 &&
            !!document.referrer &&
            new URL(document.referrer).origin === window.location.origin
        );
    } catch {
        return false;
    }
}

export function GoBackButton({
    fallbackHref = "/",
    children = "Go back",
    onClick,
    ...props
}: GoBackButtonProps) {
    const [canGoBack, setCanGoBack] = useState(false);

    useEffect(() => {
        setCanGoBack(hasSameOriginPreviousPage());
    }, []);

    const icon = <ArrowLeftIcon aria-hidden="true" />;

    if (!canGoBack) {
        return (
            <ButtonLink href={fallbackHref} {...props}>
                {icon}
                {children}
            </ButtonLink>
        );
    }

    return (
        <Button
            {...props}
            onClick={(e) => {
                onClick?.(e);
                history.back();
            }}
        >
            {icon}
            {children}
        </Button>
    );
}
