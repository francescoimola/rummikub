import * as Accordion from "@radix-ui/react-accordion";
import { PlusIcon, MinusIcon } from "@radix-ui/react-icons";
import { Box, Flex, Text } from "@radix-ui/themes";

interface ProcessStepData {
    number?: number;
    title: string;
    content: string | string[];
    linkHref?: string;
}

interface ProcessAccordionProps {
    steps: ProcessStepData[];
    defaultStep?: number;
}

export function ProcessAccordion({ steps, defaultStep }: ProcessAccordionProps) {
    return (
        <Accordion.Root
            type="single"
            collapsible
            defaultValue={defaultStep ? `step-${defaultStep}` : undefined}
            asChild
        >
            <Flex direction="column" gap="4">
                {steps.map(({ number, title, content }) => (
                    <Accordion.Item
                        key={number ?? title}
                        value={`step-${number ?? title}`}
                        style={{ backgroundColor: "var(--gray-a3)" }}
                    >
                        <Accordion.Header style={{ margin: 0 }}>
                            <Accordion.Trigger className="AccordionTrigger">
                                <Flex justify="between" align="center" py="6" px="5" gap="4">
                                    <Text size="5" weight="medium" trim="both">
                                        {number && (
                                            <>
                                                <Text
                                                    as="span"
                                                    style={{
                                                        color: "var(--gray-a10)",
                                                        marginRight: "var(--space-2)",
                                                    }}
                                                >
                                                    {number}
                                                </Text>{" "}
                                            </>
                                        )}
                                        {title}
                                    </Text>
                                    <Box style={{ color: "var(--gray-a11)" }}>
                                        <PlusIcon
                                            className="AccordionIconPlus"
                                            width="18"
                                            height="20"
                                            style={{ verticalAlign: "middle" }}
                                        />
                                        <MinusIcon
                                            className="AccordionIconMinus"
                                            width="18"
                                            height="20"
                                            style={{ verticalAlign: "middle" }}
                                        />
                                    </Box>
                                </Flex>
                            </Accordion.Trigger>
                        </Accordion.Header>
                        <Accordion.Content className="AccordionContent">
                            <Box pt="8" pb="5" px="5">
                                <Flex direction="column" gap="3" className="AccordionInnerContent">
                                    {[content].flat().map((paragraph, index) => (
                                        <Text key={index} size="3" as="p" wrap="pretty">
                                            {paragraph}
                                        </Text>
                                    ))}
                                </Flex>
                            </Box>
                        </Accordion.Content>
                    </Accordion.Item>
                ))}
            </Flex>
        </Accordion.Root>
    );
}
