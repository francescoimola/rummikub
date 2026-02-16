import { Flex, Box, Heading } from "@radix-ui/themes";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { type ComponentPropsWithoutRef, type ReactNode, forwardRef } from "react";

export type ServiceCardProps = ComponentPropsWithoutRef<"button"> &
    ComponentPropsWithoutRef<"a"> & {
        title: string;
        icon?: ReactNode;
    };

export const ServiceCard = forwardRef<HTMLButtonElement | HTMLAnchorElement, ServiceCardProps>(
    ({ title, href, icon, style, className, ...props }, ref) => {
        const Tag = href ? "a" : "button";

        return (
            <Tag
                ref={ref as any}
                href={href}
                type={!href ? "button" : undefined}
                className={`service-card ${className || ""}`}
                style={{
                    border: "none",
                    font: "inherit",
                    textAlign: "inherit",
                    textDecoration: "none",
                    color: "inherit",
                    cursor: "pointer",
                    ...style,
                }}
                {...props}
            >
                <Flex
                    direction="column"
                    justify="between"
                    align="end"
                    p="5"
                    gap="var(--space-12)"
                    height="100%"
                >
                    <Box className="service-card-icon">{icon}</Box>

                    <Flex align="center" justify="between" width="100%">
                        <Heading size="3" weight="medium" as="h3">
                            {title}
                        </Heading>
                        <ArrowRightIcon width="18" height="18" />
                    </Flex>
                </Flex>
            </Tag>
        );
    },
);

ServiceCard.displayName = "ServiceCard";
