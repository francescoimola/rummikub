import { Flex, Grid, Heading, Separator, Text } from "@radix-ui/themes";
import { Fragment } from "react";

interface ProjectResultsProps {
    heading?: string;
    items?: { title: string; description: string }[];
}

export const ProjectResults = ({ heading = "Project Results", items }: ProjectResultsProps) => {
    if (!items?.length) return null;

    return (
        <Grid gapX="4" gapY="8" style={{ gridColumn: "1 / -1", gridTemplateColumns: "subgrid" }}>
            <Heading as="h2" size={{ initial: "6", sm: "3" }} highContrast>
                {heading}
            </Heading>
            <Grid columns="1" gap="4">
                {items.map((item, i) => (
                    <Fragment key={i}>
                        <Flex direction={{ initial: "column", lg: "row" }} gap="4" wrap="wrap" justify="start" align="start">
                            <Heading as="h3" size="3" color="gray" style={{ flex: 1 }}>
                                {item.title}
                            </Heading>
                            <Text as="p" size="3" color="gray" style={{ flex: 1, textWrap: "pretty" }}>
                                {item.description}
                            </Text>
                        </Flex>
                        {i < items.length - 1 && <Separator decorative style={{ width: "100%" }} />}
                    </Fragment>
                ))}
            </Grid>
        </Grid>
    );
};
