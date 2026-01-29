import { Flex, Heading, Text } from "@radix-ui/themes";
import ReviewStars from "./ReviewStars";
import type { ReactNode } from "react";

interface Props {
    authorName: string;
    authorRole?: ReactNode;
    quote: string;
    rating?: 3 | 4 | 5;
    logo?: ReactNode;
}

export default function Testimonial({
    authorName,
    authorRole,
    quote,
    rating = 5,
    logo,
}: Props) {
    return (
        <Flex direction={{ initial: "column-reverse", md: "row" }} gapX="4" gapY="7">
            <Flex direction="column" justify="start" align="start" gap="1" style={{ flex: 1 }}>
                <Heading size="3" as="h3" highContrast>
                    {authorName}
                </Heading>
                <Text size="2" as="div" wrap="balance">
                    {authorRole}
                </Text>
                {logo && <div className="client-logo-wrapper">{logo}</div>}
            </Flex>
            <Flex direction="column" gap="4" style={{ flex: 1 }}>
                <Text size="3" as="p" highContrast>
                    "{quote}"
                </Text>
                <ReviewStars count={rating} />
            </Flex>
        </Flex>
    );
}
