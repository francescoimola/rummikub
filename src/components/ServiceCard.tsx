import { Flex, Box, Heading } from "@radix-ui/themes";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import type { ReactNode } from "react";

interface ServiceCardProps {
    title: string;
    href: string;
    icon?: ReactNode;
}

export function ServiceCard({ title, href, icon }: ServiceCardProps) {
    return (
        <a
            href={href}
            style={{
                textDecoration: "none",
                color: "inherit",
                transition: "filter 0.2s ease",
            }}
        >
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
        </a>
    );
}
