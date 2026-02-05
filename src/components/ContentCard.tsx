import { Flex, Heading, Text, Separator, Link } from "@radix-ui/themes";
import React from "react";

// ============================================================================
// Types
// ============================================================================

/** Item can be a string OR an object with { text, linkText, linkHref } */
type ContentCardItem =
    | string
    | { text: string; linkText?: string; linkHref?: string };

interface ContentCardProps {
    backgroundColor?: string;
    heading?: React.ReactNode;
    children?: React.ReactNode;
    width?: string | number;
    items?: ContentCardItem[];
}

// ============================================================================
// Component
// ============================================================================

export const ContentCard = ({
    backgroundColor = "var(--orange-3)",
    heading,
    children,
    width,
    items,
}: ContentCardProps) => {
    return (
        <Flex
            p="5"
            direction="column"
            justify="between"
            gap="9"
            style={{ backgroundColor, width }}
        >
            <Heading size="3" as="h3" weight="medium">
                {heading}
            </Heading>

            {items ? (
                <Flex direction="column" gap="3">
                    {items.map((item, index) => (
                        <React.Fragment key={index}>
                            <Text as="p" size="3" wrap="pretty">
                                <ItemContent item={item} />
                            </Text>
                            {index < items.length - 1 && <Separator size="4" />}
                        </React.Fragment>
                    ))}
                </Flex>
            ) : (
                <Text as="p" size="3" wrap="pretty">
                    {children}
                </Text>
            )}
        </Flex>
    );
};

// ============================================================================
// Helper: Renders item content (handles both string and object with link)
// ============================================================================

function ItemContent({ item }: { item: ContentCardItem }) {
    // Simple string → render as-is
    if (typeof item === "string") return <>{item}</>;

    const { text, linkText, linkHref } = item;

    // No link → render just the text
    if (!linkText || !linkHref) return <>{text}</>;

    // Has link → split text and insert link
    const [before, ...after] = text.split(linkText);
    return (
        <>
            {before}
            <Link
                highContrast
                href={linkHref}
                target={linkHref.startsWith("http") ? "_blank" : undefined}
                rel={linkHref.startsWith("http") ? "noopener noreferrer" : undefined}
            >
                {linkText}
            </Link>
            {after.join(linkText)}
        </>
    );
}
