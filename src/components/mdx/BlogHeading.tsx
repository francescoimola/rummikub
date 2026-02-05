import { Heading } from "@radix-ui/themes";

interface Props {
    children?: React.ReactNode;
    [key: string]: any;
}

export function BlogHeading({ children, ...props }: Props) {
    return (
        <Heading size="6" as="h2" weight="medium" mt="4" {...props}>
            {children}
        </Heading>
    );
}
