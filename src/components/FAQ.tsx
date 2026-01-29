import * as Accordion from "@radix-ui/react-accordion";
import { Flex, Text, Box, Heading } from "@radix-ui/themes";
import { PlusIcon, MinusIcon } from "@radix-ui/react-icons";

interface FAQItem {
    question: string;
    answer: string;
}

interface FAQProps {
    items: FAQItem[];
}

export default function FAQ({ items }: FAQProps) {
    return (
        <Accordion.Root type="single" collapsible>
            {items.map((item, index) => (
                <Accordion.Item
                    key={index}
                    value={`item-${index}`}
                    style={{
                        margin: "0",
                        borderTop: index === 0 ? "none" : "thin solid var(--gray-a6)",
                    }}
                >
                    <Accordion.Header style={{ margin: "0" }} asChild>
                        <Accordion.Trigger
                            className="AccordionTrigger">
                            <Flex justify="between" align="center" pb="6" gap="4" pt={index === 0 ? "0" : "6"}>
                                <Heading size="3" weight="medium" highContrast as="h3">
                                    {item.question}
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
                        <Box pb="6" pr="8" asChild m="0" >
                            <Text size="3" as="p" color="gray" wrap="pretty" style={{ whiteSpace: "pre-line" }}>
                                {item.answer}
                            </Text>
                        </Box>
                    </Accordion.Content>
                </Accordion.Item>
            ))}
        </Accordion.Root>
    );
}
