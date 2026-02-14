import {
    Header,
    Root,
    Item,
    Trigger,
    Content,
} from "@radix-ui/react-accordion";
import { Flex, Box, Text } from "@radix-ui/themes";
import { PlusIcon, MinusIcon } from "@radix-ui/react-icons";
import type { ReactNode } from "react";

interface AccordionSectionProps {
    title: string;
    children: ReactNode;
}

export function AccordionSection({ title, children }: AccordionSectionProps) {
    return (
        <Root type="single" collapsible>
            <Item
                value="content"
                style={{
                    borderTop: "thin solid var(--gray-a6)",
                }}
            >
                <Header style={{ margin: 0 }} asChild>
                    <h3>
                        <Trigger className="AccordionTrigger">
                            <Flex
                                justify="between"
                                align="center"
                                py="6"
                                gap="4"
                            >
                                <Text
                                    size="3"
                                    weight="medium"
                                    highContrast
                                >
                                    {title}
                                </Text>
                                <Text color="gray">
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
                                </Text>
                            </Flex>
                        </Trigger>
                    </h3>
                </Header>
                <Content className="AccordionContent">
                    <Box pb="6">{children}</Box>
                </Content>
            </Item>
        </Root>
    );
}
