import { Flex, Box, TextField, Theme, Button, Text } from "@radix-ui/themes";
import * as Form from "@radix-ui/react-form";

interface NewsletterFormProps {
    showPrivacyText?: boolean;
    /** Text alignment for the privacy text */
    textAlign?: "left" | "center" | "right";
    /** Flexbox alignment for the form container */
    align?: "start" | "center" | "end" | "stretch" | "baseline";
}

export const NewsletterForm = ({
    showPrivacyText = true,
    textAlign = "left",
    align = "start"
}: NewsletterFormProps) => {
    return (
        <Flex direction="column" justify="center" align={align} gap="4">
            <Form.Root
                onSubmit={(e) => {
                    e.preventDefault();
                }}
                style={{ width: "100%" }}
            >
                <Flex gap="2" align="start" width="100%">
                    <Form.Field name="email" asChild>
                        <Box flexGrow="1" asChild>
                            <Form.Control asChild>
                                <TextField.Root
                                    placeholder="Your email"
                                    size="3"
                                    variant="surface"
                                    radius="none"
                                    autoComplete="email"
                                    style={{
                                        padding: 0,
                                        minHeight: "auto",
                                        border: "none",
                                        backgroundColor: "transparent",
                                    }}
                                />
                            </Form.Control>
                        </Box>
                    </Form.Field>
                    <Form.Submit asChild>
                        <Theme
                            appearance="light"
                            accentColor="yellow"
                            radius="none"
                            hasBackground={true}
                            asChild
                        >
                            <Button
                                size="3"
                                variant="solid"
                                style={{
                                    color: "var(--accent-a12)",
                                    backgroundColor: "var(--accent-3)",
                                }}
                                highContrast
                            >
                                Subscribe
                            </Button>
                        </Theme>
                    </Form.Submit>
                </Flex>
            </Form.Root>

            {showPrivacyText && (
                <Text size="2" as="p" color="gray" align={textAlign}>
                    You agree to receive updates and consent to our Privacy Policy.
                </Text>
            )}
        </Flex>
    );
};

export default NewsletterForm;
