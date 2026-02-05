import * as Accordion from "@radix-ui/react-accordion";
import { Flex, Box, Text, Heading } from "@radix-ui/themes";
import { PlusIcon, MinusIcon } from "@radix-ui/react-icons";

interface ProcessStepData {
    /** Step number displayed before the title (optional) */
    number?: number;
    /** Title of the step */
    title: string;
    /** Content paragraphs - can be a single string or array of strings */
    content: string | string[];
}

interface ProcessAccordionProps {
    /** Array of step data objects */
    steps: ProcessStepData[];
    /** Default expanded step number (optional) */
    defaultStep?: number;
}

export function ProcessAccordion({
    steps,
    defaultStep,
}: ProcessAccordionProps) {
    return (
        <Accordion.Root
            type="single"
            collapsible
            defaultValue={defaultStep ? `step-${defaultStep}` : undefined}
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-4)",
            }}
        >
            {steps.map((step) => {
                const contentArray = Array.isArray(step.content)
                    ? step.content
                    : [step.content];

                return (
                    <Accordion.Item
                        key={step.number ?? step.title}
                        value={`step-${step.number ?? step.title}`}
                        style={{
                            margin: 0,
                            backgroundColor: "var(--gray-a3)",
                        }}
                    >
                        <Accordion.Header style={{ margin: 0 }} asChild>
                            <Accordion.Trigger className="AccordionTrigger">
                                <Flex
                                    justify="between"
                                    align="center"
                                    py="6"
                                    px="5"
                                    gap="4"
                                >
                                    <Heading size="5" weight="medium" as="h3" trim="both">
                                        {step.number && (
                                            <Text
                                                as="span"
                                                style={{
                                                    color: "var(--gray-a10)",
                                                    marginRight: "var(--space-2)",
                                                }}
                                            >
                                                {step.number}
                                            </Text>
                                        )}{step.number && " "}
                                        {step.title}
                                    </Heading>
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
                                    {contentArray.map((paragraph, index) => (
                                        <Text
                                            key={index}
                                            size="2"
                                            as="p"
                                            wrap="pretty"
                                        >
                                            {paragraph}
                                        </Text>
                                    ))}
                                </Flex>
                            </Box>
                        </Accordion.Content>
                    </Accordion.Item>
                );
            })}
        </Accordion.Root>
    );
}
