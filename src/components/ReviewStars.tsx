import { StarFilledIcon } from "@radix-ui/react-icons";
import { Flex, Text } from "@radix-ui/themes";

interface Props {
    count?: number;
}

export default function ReviewStars({ count = 5 }: Props) {
    const starCount = Math.max(3, Math.min(count, 5));

    return (

        <Text size="2" color="gray" highContrast>
            <Flex gap="1" align="center">
                {Array.from({ length: starCount }).map((_, i) => (
                    <StarFilledIcon key={i} />
                ))}
            </Flex>
        </Text>
    );
}
