import { Flex, Box, Heading } from "@radix-ui/themes";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { type ReactNode, type ComponentPropsWithoutRef, forwardRef } from "react";

export interface ServiceCardProps extends ComponentPropsWithoutRef<"button"> {
    title: string;
    href?: string;
    icon?: ReactNode;
}

export const ServiceCard = forwardRef<HTMLButtonElement | HTMLAnchorElement, ServiceCardProps>(
    ({ title, href, icon, style, className, ...props }, ref) => {
        const content = (
            <Flex
                direction="column"
                justify="between"
                align="end"
                p="5"
                gap="var(--space-12)"
                height="100%"
            >
                <Box className="service-card-icon">
                    {icon}
                </Box>


                <Flex align="center" justify="between" width="100%">
                    <Heading size="3" weight="medium" as="h3">
                        {title}
                    </Heading>
                    <ArrowRightIcon width="18" height="18" />
                </Flex>
            </Flex>
        );

        if (href) {
            return (
                <a
                    ref={ref as React.Ref<HTMLAnchorElement>}
                    href={href}
                    className={`service-card ${className || ""}`}
                    style={{
                        textDecoration: "none",
                        color: "inherit",
                        ...style
                    }}
                    {...(props as ComponentPropsWithoutRef<"a">)}
                >
                    {content}
                </a>
            );
        }

        return (
            <button
                type="button"
                ref={ref as React.Ref<HTMLButtonElement>}
                className={`service-card ${className || ""}`}
                style={{
                    border: "none",
                    font: "inherit",
                    textAlign: "inherit",
                    textDecoration: "none",
                    color: "inherit",
                    cursor: "pointer",
                    ...style
                }}
                {...props}
            >
                {content}
            </button>
        );
    }
);

ServiceCard.displayName = "ServiceCard";
