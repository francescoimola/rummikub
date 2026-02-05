import { Text } from "@radix-ui/themes";

interface Props {
    children?: React.ReactNode;
    [key: string]: any;
}

export function BlogParagraph({ children, ...props }: Props) {
    return (
        <Text size="3" as="p" wrap="pretty" {...props}>
            {children}
        </Text>
    );
}
