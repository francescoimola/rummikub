import { StarFilledIcon } from "@radix-ui/react-icons";
import { Flex } from "@radix-ui/themes";

interface Props {
    count?: number;
}

export default function ReviewStars({ count = 5 }: Props) {
    const starCount = Math.max(3, Math.min(count, 5));

    return (
        <Flex gap="1" align="center">
            {Array.from({ length: starCount }).map((_, i) => (
                <StarFilledIcon key={i} width="13" height="13" className="star-icon" />
            ))}
        </Flex>
    );
}
