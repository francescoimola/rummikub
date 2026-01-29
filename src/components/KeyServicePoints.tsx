import { Grid, Heading, Text } from "@radix-ui/themes";

interface KeyServicePointProps {
    heading: string;
    children: React.ReactNode;
}

export const KeyServicePoint = ({ heading, children }: KeyServicePointProps) => {
    const words = heading.split(" ");
    const firstWord = words[0];
    const restOfHeading = words.slice(1).join(" ");

    return (
        <Grid columns={{ initial: "1", md: "2" }} gapX="6" gapY="2" className="key-service-point">
            <Heading size="3" weight="medium">
                <Text color="gray" as="span">
                    {firstWord}
                </Text>{" "}
                <Text as="span" highContrast>
                    {restOfHeading}
                </Text>
            </Heading>
            <Text as="p" size="3">
                {children}
            </Text>
        </Grid>
    );
};

interface KeyServicePointsProps {
    children: React.ReactNode;
}

export const KeyServicePoints = ({ children }: KeyServicePointsProps) => {
    return (
        <div className="key-service-points">
            {children}
        </div>
    );
};
