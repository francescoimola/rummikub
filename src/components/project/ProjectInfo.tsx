import { Flex, Heading, Text } from "@radix-ui/themes";
import { ButtonLink } from "../ButtonLink";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";

interface ProjectInfoProps {
    role: string;
    year: string;
    visitUrl?: string;
    visitHeading?: string;
}

export const ProjectInfo = ({
    role,
    year,
    visitUrl,
    visitHeading = "Visit",
}: ProjectInfoProps) => {


    return (
        <Flex direction="column" justify="start" align="start" gap="4" asChild>
            <aside>
                <Heading as="h3" size="3" highContrast mb="4">
                    Project Info
                </Heading>
                <Flex direction="column">
                    <Text size="3" highContrast>
                        Role
                    </Text>
                    <Text size="3" color="gray">
                        {role}
                    </Text>
                </Flex>
                <Flex direction="column">
                    <Text size="3" highContrast>
                        Date
                    </Text>
                    <Text size="3" color="gray">
                        {year}
                    </Text>
                </Flex>
                {visitUrl && (
                    <ButtonLink href={visitUrl} external size="3" variant="soft" color="gray" radius="none">
                        {visitHeading}
                        <ArrowTopRightIcon />
                    </ButtonLink>
                )}
            </aside>
        </Flex>
    );
};
