import { Flex, Text, Link, Heading } from "@radix-ui/themes";
import type { ComponentProps } from "react";

export interface Anchor {
    href: string;
    label: string;
}

type SkipToNavProps = ComponentProps<typeof Flex> & {
    anchors: Anchor[];
};

export default function SkipToNav({ anchors, ...props }: SkipToNavProps) {
    if (!anchors || anchors.length === 0) return null;

    return (
        <Flex direction="column" gap="4" {...props}>
            <Heading size="3" weight="medium" highContrast as="h4">
                Skip to
            </Heading>
            <ol className="anchor-list">
                {anchors.map((anchor, index) => (
                    <Flex asChild gap="2" align="center" key={anchor.href}>
                        <li value={index + 1}>
                            <Text size="3">
                                {index + 1}
                            </Text>
                            <Link
                                href={anchor.href}
                                size="3"
                                underline="hover"
                                highContrast
                            >
                                {anchor.label}
                            </Link>
                        </li>
                    </Flex>
                ))}
            </ol>
        </Flex>
    );
}
