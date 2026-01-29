import { Flex, Box, Heading } from "@radix-ui/themes";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { type ReactNode, type ComponentPropsWithoutRef, forwardRef } from "react";

export interface ServiceCardProps extends ComponentPropsWithoutRef<"div"> {
    title: string;
    href?: string;
    icon?: ReactNode;
}

export const ServiceCard = forwardRef<HTMLDivElement | HTMLAnchorElement, ServiceCardProps>(
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
                        transition: "filter 0.2s ease",
                        ...style
                    }}
                    {...(props as ComponentPropsWithoutRef<"a">)}
                >
                    {content}
                </a>
            );
        }

        return (
            <div
                ref={ref as React.Ref<HTMLDivElement>}
                className={`service-card ${className || ""}`}
                style={{
                    textDecoration: "none",
                    color: "inherit",
                    transition: "filter 0.2s ease",
                    cursor: "pointer",
                    ...style
                }}
                {...props}
            >
                {content}
            </div>
        );
    }
);

ServiceCard.displayName = "ServiceCard";
