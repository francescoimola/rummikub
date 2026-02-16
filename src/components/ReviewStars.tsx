import { StarFilledIcon } from "@radix-ui/react-icons";
import { Flex, Text } from "@radix-ui/themes";

export default function ReviewStars({ count = 5 }: { count?: number }) {
    return (
        <Text size="2" color="gray" highContrast style={{ userSelect: "none" }}>
            <Flex gap="1" align="center">
                {Array.from({ length: Math.max(3, Math.min(count, 5)) }, (_, i) => (
                    <StarFilledIcon key={i} />
                ))}
            </Flex>
        </Text>
    );
}
