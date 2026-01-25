import { Flex, Text, Link, Heading } from "@radix-ui/themes";
import type { ComponentProps } from "react";

const anchors = [
    { href: "#intro", label: "Intro" },
    { href: "#principles", label: "Principles" },
    { href: "#tools", label: "Tools" },
    { href: "#sustainability", label: "Sustainability" },
    { href: "#faqs", label: "FAQs" },
    { href: "#contact", label: "Contact details" },
];

export default function SkipToNav(props: ComponentProps<typeof Flex>) {
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
