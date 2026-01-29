import * as Accordion from "@radix-ui/react-accordion";
import { Flex, Box, Heading } from "@radix-ui/themes";
import { PlusIcon, MinusIcon } from "@radix-ui/react-icons";
import type { ReactNode } from "react";

interface AccordionSectionProps {
    title: string;
    children: ReactNode;
}

export function AccordionSection({ title, children }: AccordionSectionProps) {
    return (
        <Accordion.Root type="single" collapsible>
            <Accordion.Item
                value="content"
                style={{
                    margin: "0",
                    borderTop: "thin solid var(--gray-a6)",
                }}
            >
                <Accordion.Header style={{ margin: "0" }} asChild>
                    <Accordion.Trigger className="AccordionTrigger">
                        <Flex justify="between" align="center" py="6" gap="4">
                            <Heading size="3" weight="medium" highContrast as="h3">
                                {title}
                            </Heading>
                            <Box style={{ color: "var(--gray-a11)" }}>
                                <PlusIcon
                                    className="AccordionIconPlus"
                                    width="18"
                                    height="18"
                                />
                                <MinusIcon
                                    className="AccordionIconMinus"
                                    width="18"
                                    height="18"
                                />
                            </Box>
                        </Flex>
                    </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="AccordionContent">
                    <Box pb="6" asChild>
                        {children}
                    </Box>
                </Accordion.Content>
            </Accordion.Item>
        </Accordion.Root>
    );
}
