import { Flex, Heading, Text, Separator, Link } from "@radix-ui/themes";
import { Fragment, type ReactNode } from "react";

type ContentCardItem = string | { text: string; linkText?: string; linkHref?: string };

interface ContentCardProps {
    backgroundColor?: string;
    heading?: ReactNode;
    children?: ReactNode;
    width?: string | number;
    items?: ContentCardItem[];
}

export const ContentCard = ({
    backgroundColor = "var(--orange-3)",
    heading,
    children,
    width,
    items,
}: ContentCardProps) => (
    <Flex p="5" direction="column" justify="between" gap="9" style={{ backgroundColor, width }}>
        <Heading size="3" as="h3" weight="medium">
            {heading}
        </Heading>

        {items ? (
            <Flex direction="column" gap="3">
                {items.map((item, i) => (
                    <Fragment key={i}>
                        <Text as="p" size="3" wrap="pretty">
                            <ItemContent item={item} />
                        </Text>
                        {i < items.length - 1 && <Separator size="4" />}
                    </Fragment>
                ))}
            </Flex>
        ) : (
            <Text as="p" size="3" wrap="pretty" color="gray">
                {children}
            </Text>
        )}
    </Flex>
);

const ItemContent = ({ item }: { item: ContentCardItem }) => {
    if (typeof item === "string") return <>{item}</>;
    const { text, linkText, linkHref } = item;

    if (!linkText || !linkHref) return <>{text}</>;

    const [before, ...rest] = text.split(linkText);
    const isExternal = linkHref.startsWith("http");

    return (
        <>
            {before}
            <Link
                highContrast
                href={linkHref}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
            >
                {linkText}
            </Link>
            {rest.join(linkText)}
        </>
    );
};
