
import { Heading, Text, Flex } from "@radix-ui/themes";

export const ContactSHeader = () => (
    <Flex direction="column" gap="4">
        <Heading size="8" as="h2" weight="medium" highContrast>
            Knock on my door
        </Heading>
        <Text as="p" size="3" style={{ maxWidth: "60ch" }} highContrast>
            Ready to talk shop or want to discuss an idea? Get in touch and I’ll reply within 24 hrs.
        </Text>
    </Flex>
);