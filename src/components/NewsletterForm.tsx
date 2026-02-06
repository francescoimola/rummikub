import { Flex, Box, TextField, Theme, Button, Text, Card } from "@radix-ui/themes";
import * as Form from "@radix-ui/react-form";
import { CopyEmailButton } from "./CopyEmailButton";

interface NewsletterFormProps {
    showPrivacyText?: boolean;
    textAlign?: "left" | "center" | "right";
    align?: "start" | "center" | "end" | "stretch" | "baseline";
    serverError?: string;
}

export const NewsletterForm = ({
    showPrivacyText = true,
    textAlign = "left",
    align = "start",
    serverError,
}: NewsletterFormProps) => {
    return (
        <Flex direction="column" justify="center" align={align} gap="4">
            <Form.Root style={{ width: "100%" }} onSubmit={(e) => e.preventDefault()}>
                <Flex direction="column" gap="2" width="100%">
                    <Flex gap="2" align="start" width="100%">
                        <Form.Field name="email" asChild>
                            <Box flexGrow="1" asChild>
                                <Form.Control asChild>
                                    <TextField.Root
                                        placeholder="Your email"
                                        size="3"
                                        variant="surface"
                                        radius="none"
                                        type="email"
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

                    {serverError && (
                        <Card variant="ghost" size="2" mt="2" style={{ margin: "unset", backgroundColor: "var(--gray-a3)" }}>
                            <Flex direction="column" justify="center" gap="4" wrap="wrap">
                                <Text color="red" size="2" trim="end" weight="medium">
                                    {serverError}
                                </Text>
                                <Text size="2" color="gray" trim="both">
                                    Having trouble? I want to fix that. Could you drop me a message? {" "}
                                    <CopyEmailButton
                                        variant="surface"
                                        size="1"
                                        ml="2"
                                        style={{ display: "inline-flex" }}
                                    />
                                </Text>
                            </Flex>
                        </Card>
                    )}
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
