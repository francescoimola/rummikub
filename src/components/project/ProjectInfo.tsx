import { Flex, Heading, Text } from "@radix-ui/themes";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { ButtonLink } from "../ButtonLink";
import { GoBackButton } from "../GoBackButton";

const InfoItem = ({ label, value }: { label: string; value: string }) => (
    <Flex direction="column">
        <Text size="3" highContrast>{label}</Text>
        <Text size="3" color="gray">{value}</Text>
    </Flex>
);

export const ProjectInfo = ({
    role,
    year,
    visitUrl,
    visitHeading = "Visit"
}: {
    role: string;
    year: string;
    visitUrl?: string;
    visitHeading?: string;
}) => (
    <Flex direction="column" justify="start" align="start" gap="4" asChild>
        <aside>
            <Heading as="h3" size="3" highContrast mb="4">Project Info</Heading>

            <InfoItem label="Role" value={role} />
            <InfoItem label="Date" value={year} />

            {visitUrl && (
                <ButtonLink href={visitUrl} external size="3" variant="soft" color="gray" radius="none">
                    {visitHeading}
                    <ArrowTopRightIcon />
                </ButtonLink>
            )}

            <GoBackButton size="3" variant="outline" color="gray" fallbackHref="/work">
                Go back
            </GoBackButton>
        </aside>
    </Flex>
);
